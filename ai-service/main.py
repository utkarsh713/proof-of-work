
from fastapi import FastAPI, UploadFile, File, Form
import os
import shutil
import math
from datetime import datetime

try:
    import cv2
    CV2_AVAILABLE = True
except Exception:
    cv2 = None
    CV2_AVAILABLE = False

from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS, IFD

from sentence_transformers import SentenceTransformer, util

import torch
from transformers import AutoImageProcessor, SiglipForImageClassification

from forensic_analysis import compare_forensics


# ============================================================
# APP CONFIG
# ============================================================

app = FastAPI(
    title="Proof-of-Work AI Verification Service",
    version="5.1.1"
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# ============================================================
# GENERAL THRESHOLDS
# ============================================================

GPS_MAX_DISTANCE_METERS = 500

DESCRIPTION_SIGNIFICANT_THRESHOLD = 0.30
DESCRIPTION_MODERATE_THRESHOLD = 0.15

VISUAL_CHANGE_SIGNIFICANT_THRESHOLD = 0.30
VISUAL_CHANGE_MODERATE_THRESHOLD = 0.15


# ============================================================
# SAME SCENE CONFIG
# ============================================================

SAME_SCENE_SEMANTIC_THRESHOLD = 0.70
SAME_SCENE_BORDERLINE_THRESHOLD = 0.60

HIGH_SEMANTIC_SIMILARITY = 0.78

ORB_RATIO_TEST = 0.75

RANSAC_REPROJECTION_THRESHOLD = 5.0

RANSAC_MIN_GOOD_MATCHES = 12
RANSAC_MIN_INLIERS = 6
RANSAC_MIN_INLIER_RATIO = 0.30

RANSAC_BORDERLINE_MIN_GOOD_MATCHES = 8
RANSAC_BORDERLINE_MIN_INLIERS = 4
RANSAC_BORDERLINE_INLIER_RATIO = 0.25


# ============================================================
# AUTHENTICITY MODEL
# ============================================================

AUTHENTICITY_MODEL_NAME = (
    "prithivMLmods/deepfake-detector-model-v1"
)


# ============================================================
# LOAD MODELS
# ============================================================

print("Loading CLIP model...")

clip_model = SentenceTransformer(
    "clip-ViT-B-32"
)

print("CLIP model loaded.")


print("Loading authenticity model...")

try:

    authenticity_processor = (
        AutoImageProcessor.from_pretrained(
            AUTHENTICITY_MODEL_NAME
        )
    )

    authenticity_model = (
        SiglipForImageClassification.from_pretrained(
            AUTHENTICITY_MODEL_NAME
        )
    )

    authenticity_model.eval()

    AUTHENTICITY_MODEL_AVAILABLE = True

    print("Authenticity model loaded.")

except Exception as e:

    print(
        "Authenticity model could not be loaded:"
    )

    print(e)

    authenticity_processor = None
    authenticity_model = None

    AUTHENTICITY_MODEL_AVAILABLE = False


# ============================================================
# UTILITY FUNCTIONS
# ============================================================

def rational_to_float(value):

    try:

        if (
            hasattr(value, "numerator")
            and
            hasattr(value, "denominator")
        ):

            return (
                float(value.numerator)
                /
                float(value.denominator)
            )

        return float(value)

    except Exception:

        return 0.0


def gps_to_decimal(value, ref):

    try:

        degrees = rational_to_float(
            value[0]
        )

        minutes = rational_to_float(
            value[1]
        )

        seconds = rational_to_float(
            value[2]
        )

        decimal = (
            degrees
            +
            (minutes / 60.0)
            +
            (seconds / 3600.0)
        )

        if ref in ["S", "W"]:

            decimal = -decimal

        return decimal

    except Exception:

        return None


# ============================================================
# IMAGE METADATA
# ============================================================

def get_image_metadata(image_path):

    result = {

        "timestamp": None,

        "timestamp_original": None,

        "latitude": None,

        "longitude": None,

        "camera_make": None,

        "camera_model": None,

        "software": None,

        "raw_exif": {}
    }

    try:

        image = Image.open(
            image_path
        )

        exif = image.getexif()

        if not exif:

            return result

        exif_data = {}

        for tag_id, value in exif.items():

            tag = TAGS.get(
                tag_id,
                tag_id
            )

            exif_data[tag] = value

        result["raw_exif"] = exif_data

        result["timestamp"] = (
            exif_data.get("DateTime")
        )

        result["timestamp_original"] = (
            exif_data.get("DateTimeOriginal")
        )

        result["camera_make"] = (
            exif_data.get("Make")
        )

        result["camera_model"] = (
            exif_data.get("Model")
        )

        result["software"] = (
            exif_data.get("Software")
        )

        gps_info = {}

        try:

            gps_ifd = exif.get_ifd(
                IFD.GPSInfo
            )

            for key, value in gps_ifd.items():

                decoded_key = GPSTAGS.get(
                    key,
                    key
                )

                gps_info[decoded_key] = value

        except Exception:

            gps_info = {}

        if gps_info:

            lat = gps_info.get(
                "GPSLatitude"
            )

            lat_ref = gps_info.get(
                "GPSLatitudeRef"
            )

            lon = gps_info.get(
                "GPSLongitude"
            )

            lon_ref = gps_info.get(
                "GPSLongitudeRef"
            )

            if lat and lat_ref:

                result["latitude"] = (
                    gps_to_decimal(
                        lat,
                        lat_ref
                    )
                )

            if lon and lon_ref:

                result["longitude"] = (
                    gps_to_decimal(
                        lon,
                        lon_ref
                    )
                )

        return result

    except Exception as e:

        print(
            "Metadata error:",
            e
        )

        return result


# ============================================================
# TIMESTAMP PARSING
# ============================================================

def parse_timestamp(value):

    if not value:

        return None

    formats = [

        "%Y:%m:%d %H:%M:%S",

        "%Y-%m-%d %H:%M:%S",

        "%Y/%m/%d %H:%M:%S"
    ]

    for fmt in formats:

        try:

            return datetime.strptime(
                str(value),
                fmt
            )

        except Exception:

            continue

    return None


# ============================================================
# GPS DISTANCE
# ============================================================

def calculate_distance(
    lat1,
    lon1,
    lat2,
    lon2
):

    if None in [
        lat1,
        lon1,
        lat2,
        lon2
    ]:

        return None

    earth_radius = 6371000

    phi1 = math.radians(
        lat1
    )

    phi2 = math.radians(
        lat2
    )

    delta_phi = math.radians(
        lat2 - lat1
    )

    delta_lambda = math.radians(
        lon2 - lon1
    )

    a = (

        math.sin(
            delta_phi / 2
        ) ** 2

        +

        math.cos(phi1)
        *
        math.cos(phi2)
        *
        math.sin(
            delta_lambda / 2
        ) ** 2
    )

    c = (
        2
        *
        math.atan2(
            math.sqrt(a),
            math.sqrt(1 - a)
        )
    )

    return (
        earth_radius * c
    )


# ============================================================
# METADATA VERIFICATION
# ============================================================

def check_metadata(
    before_path,
    after_path
):

    before = get_image_metadata(
        before_path
    )

    after = get_image_metadata(
        after_path
    )

    before_time = parse_timestamp(
        before.get(
            "timestamp_original"
        )
        or
        before.get(
            "timestamp"
        )
    )

    after_time = parse_timestamp(
        after.get(
            "timestamp_original"
        )
        or
        after.get(
            "timestamp"
        )
    )

    timestamp_check = (

        before_time is not None

        and

        after_time is not None
    )

    timestamp_order_check = False

    if timestamp_check:

        timestamp_order_check = (
            after_time >= before_time
        )

    gps_available = (

        before.get(
            "latitude"
        ) is not None

        and

        before.get(
            "longitude"
        ) is not None

        and

        after.get(
            "latitude"
        ) is not None

        and

        after.get(
            "longitude"
        ) is not None
    )

    gps_distance = None

    gps_location_check = False

    if gps_available:

        gps_distance = calculate_distance(

            before["latitude"],

            before["longitude"],

            after["latitude"],

            after["longitude"]
        )

        if gps_distance is not None:

            gps_location_check = (
                gps_distance
                <=
                GPS_MAX_DISTANCE_METERS
            )

    if (
        timestamp_check
        and
        gps_available
    ):

        if (
            timestamp_order_check
            and
            gps_location_check
        ):

            status = "VERIFIED"

        else:

            status = "PARTIAL_METADATA"

    elif (
        timestamp_check
        or
        gps_available
    ):

        status = "PARTIAL_METADATA"

    else:

        status = "INSUFFICIENT_METADATA"

    return {

        "timestamp_check":
            timestamp_check,

        "timestamp_order_check":
            timestamp_order_check,

        "gps_check":
            gps_available,

        "gps_location_check":
            gps_location_check,

        "gps_distance_meters": (

            round(
                gps_distance,
                2
            )

            if gps_distance is not None

            else None
        ),

        "max_allowed_gps_distance_meters":
            GPS_MAX_DISTANCE_METERS,

        "status":
            status
    }


# ============================================================
# FIND BEFORE / AFTER FILES
# ============================================================

def find_evidence_files(
    work_id
):

    work_dir = os.path.join(
        UPLOAD_DIR,
        str(work_id)
    )

    if not os.path.exists(
        work_dir
    ):

        return None, None

    files = os.listdir(
        work_dir
    )

    before_file = None

    after_file = None

    for filename in files:

        lower = filename.lower()

        if "_ela" in lower:

            continue

        full_path = os.path.join(
            work_dir,
            filename
        )

        if not os.path.isfile(
            full_path
        ):

            continue

        if (
            "before" in lower
            and
            before_file is None
        ):

            before_file = full_path

        elif (
            "after" in lower
            and
            after_file is None
        ):

            after_file = full_path

    return (
        before_file,
        after_file
    )


# ============================================================
# VISUAL COMPARISON
# ============================================================

def compare_images(
    before_path,
    after_path
):

    try:

        before_image = Image.open(
            before_path
        ).convert("RGB")

        after_image = Image.open(
            after_path
        ).convert("RGB")

        embeddings = clip_model.encode(

            [
                before_image,
                after_image
            ],

            convert_to_tensor=True,

            normalize_embeddings=True
        )

        similarity = float(

            util.cos_sim(

                embeddings[0],
                embeddings[1]

            ).item()
        )

        similarity = max(
            0.0,
            min(
                1.0,
                similarity
            )
        )

        difference = (
            1.0
            -
            similarity
        )

        if (
            difference
            >=
            VISUAL_CHANGE_SIGNIFICANT_THRESHOLD
        ):

            status = (
                "SIGNIFICANT_CHANGE"
            )

        elif (
            difference
            >=
            VISUAL_CHANGE_MODERATE_THRESHOLD
        ):

            status = (
                "MODERATE_CHANGE"
            )

        else:

            status = (
                "LOW_CHANGE"
            )

        return {

            "similarity":
                round(
                    similarity,
                    4
                ),

            "difference":
                round(
                    difference,
                    4
                ),

            "status":
                status
        }

    except Exception as e:

        return {

            "similarity": None,

            "difference": None,

            "status": "ERROR",

            "error": str(e)
        }


# ============================================================
# SAME SCENE - ORB + RANSAC
# ============================================================

def check_same_scene(
    before_path,
    after_path
):

    result = {

        "status":
            "UNCERTAIN",

        "method":
            "CLIP_ORB_RANSAC",

        "semantic_similarity":
            None,

        "keypoints_before":
            0,

        "keypoints_after":
            0,

        "good_matches":
            0,

        "ransac_inliers":
            0,

        "ransac_inlier_ratio":
            0.0,

        "homography_found":
            False,

        "orb_ratio_test":
            ORB_RATIO_TEST,

        "ransac_reprojection_threshold":
            RANSAC_REPROJECTION_THRESHOLD,

        "ransac_min_inliers":
            RANSAC_MIN_INLIERS,

        "ransac_min_good_matches":
            RANSAC_MIN_GOOD_MATCHES,

        "decision_reason":
            "",

        "note": (
            "GPS location indicates approximate physical "
            "location only. CLIP measures semantic similarity, "
            "while ORB and RANSAC provide local geometric "
            "evidence. A small number of matches is not "
            "sufficient to confirm the same physical scene."
        )
    }

    # ========================================================
    # CLIP
    # ========================================================

    try:

        before_image = Image.open(
            before_path
        ).convert("RGB")

        after_image = Image.open(
            after_path
        ).convert("RGB")

        embeddings = clip_model.encode(

            [
                before_image,
                after_image
            ],

            convert_to_tensor=True,

            normalize_embeddings=True
        )

        semantic_similarity = float(

            util.cos_sim(

                embeddings[0],
                embeddings[1]

            ).item()
        )

        semantic_similarity = max(
            0.0,
            min(
                1.0,
                semantic_similarity
            )
        )

        result[
            "semantic_similarity"
        ] = round(
            semantic_similarity,
            4
        )

    except Exception as e:

        result["status"] = (
            "UNCERTAIN"
        )

        result[
            "decision_reason"
        ] = (
            "CLIP comparison failed: "
            +
            str(e)
        )

        return result

    # ========================================================
    # OpenCV unavailable
    # ========================================================

    if not CV2_AVAILABLE:

        if (
            semantic_similarity
            >=
            SAME_SCENE_SEMANTIC_THRESHOLD
        ):

            result["status"] = (
                "UNCERTAIN"
            )

            result[
                "decision_reason"
            ] = (
                "High semantic similarity was detected, "
                "but OpenCV/ORB geometric verification "
                "is unavailable."
            )

        else:

            result["status"] = (
                "DIFFERENT_SCENE"
            )

            result[
                "decision_reason"
            ] = (
                "Semantic similarity is below the "
                "same-scene threshold."
            )

        return result

    # ========================================================
    # LOAD GRAYSCALE IMAGES
    # ========================================================

    try:

        before_cv = cv2.imread(
            before_path,
            cv2.IMREAD_GRAYSCALE
        )

        after_cv = cv2.imread(
            after_path,
            cv2.IMREAD_GRAYSCALE
        )

        if (
            before_cv is None
            or
            after_cv is None
        ):

            result["status"] = (
                "UNCERTAIN"
            )

            result[
                "decision_reason"
            ] = (
                "Could not read one or both "
                "images with OpenCV."
            )

            return result

    except Exception as e:

        result["status"] = (
            "UNCERTAIN"
        )

        result[
            "decision_reason"
        ] = (
            "OpenCV image loading failed: "
            +
            str(e)
        )

        return result

    # ========================================================
    # RESIZE
    # ========================================================

    MAX_DIMENSION = 1600

    def resize_image(
        image
    ):

        height, width = (
            image.shape[:2]
        )

        largest = max(
            height,
            width
        )

        if (
            largest
            <=
            MAX_DIMENSION
        ):

            return image

        scale = (
            MAX_DIMENSION
            /
            largest
        )

        new_width = int(
            width * scale
        )

        new_height = int(
            height * scale
        )

        return cv2.resize(

            image,

            (
                new_width,
                new_height
            ),

            interpolation=cv2.INTER_AREA
        )

    before_cv = resize_image(
        before_cv
    )

    after_cv = resize_image(
        after_cv
    )

    # ========================================================
    # ORB
    # ========================================================

    try:

        orb = cv2.ORB_create(
            nfeatures=2000
        )

        (
            keypoints_before,
            descriptors_before
        ) = orb.detectAndCompute(
            before_cv,
            None
        )

        (
            keypoints_after,
            descriptors_after
        ) = orb.detectAndCompute(
            after_cv,
            None
        )

        result[
            "keypoints_before"
        ] = (

            len(keypoints_before)

            if keypoints_before

            else 0
        )

        result[
            "keypoints_after"
        ] = (

            len(keypoints_after)

            if keypoints_after

            else 0
        )

        if (
            descriptors_before is None
            or
            descriptors_after is None
        ):

            result["status"] = (

                "UNCERTAIN"

                if
                semantic_similarity
                >=
                SAME_SCENE_SEMANTIC_THRESHOLD

                else
                "DIFFERENT_SCENE"
            )

            result[
                "decision_reason"
            ] = (
                "Insufficient ORB features were "
                "detected for reliable geometric "
                "verification."
            )

            return result

        matcher = cv2.BFMatcher(
            cv2.NORM_HAMMING,
            crossCheck=False
        )

        knn_matches = matcher.knnMatch(

            descriptors_before,

            descriptors_after,

            k=2
        )

        good_matches = []

        for pair in knn_matches:

            if len(pair) < 2:

                continue

            m, n = pair

            if (
                m.distance
                <
                ORB_RATIO_TEST
                *
                n.distance
            ):

                good_matches.append(
                    m
                )

        result[
            "good_matches"
        ] = len(
            good_matches
        )

    except Exception as e:

        result["status"] = (
            "UNCERTAIN"
        )

        result[
            "decision_reason"
        ] = (
            "ORB feature matching failed: "
            +
            str(e)
        )

        return result

    # ========================================================
    # NOT ENOUGH MATCHES
    # ========================================================

    if len(
        good_matches
    ) < 4:

        result["status"] = (
            "DIFFERENT_SCENE"
        )

        result[
            "decision_reason"
        ] = (
            "Local feature matching produced fewer "
            "than 4 reliable correspondences. "
            "A same-scene geometric relationship "
            "cannot be established."
        )

        return result

    # ========================================================
    # BUILD POINT CORRESPONDENCES
    # ========================================================

    src_pts = []

    dst_pts = []

    for match in good_matches:

        src_pts.append(

            keypoints_before[
                match.queryIdx
            ].pt
        )

        dst_pts.append(

            keypoints_after[
                match.trainIdx
            ].pt
        )

    import numpy as np

    src_pts = np.float32(
        src_pts
    ).reshape(
        -1,
        1,
        2
    )

    dst_pts = np.float32(
        dst_pts
    ).reshape(
        -1,
        1,
        2
    )

    # ========================================================
    # RANSAC HOMOGRAPHY
    # ========================================================

    try:

        homography, mask = (
            cv2.findHomography(

                src_pts,

                dst_pts,

                cv2.RANSAC,

                RANSAC_REPROJECTION_THRESHOLD
            )
        )

        if (
            homography is None
            or
            mask is None
        ):

            result["status"] = (
                "DIFFERENT_SCENE"
            )

            result[
                "decision_reason"
            ] = (
                "RANSAC could not find a reliable "
                "geometric model between the images."
            )

            return result

        result[
            "homography_found"
        ] = True

        inliers = int(
            mask.ravel().sum()
        )

        result[
            "ransac_inliers"
        ] = inliers

        total_matches = len(
            good_matches
        )

        inlier_ratio = (

            inliers
            /
            total_matches

            if total_matches > 0

            else 0.0
        )

        result[
            "ransac_inlier_ratio"
        ] = round(
            inlier_ratio,
            4
        )

    except Exception as e:

        result["status"] = (
            "UNCERTAIN"
        )

        result[
            "decision_reason"
        ] = (
            "RANSAC verification failed: "
            +
            str(e)
        )

        return result

    # ========================================================
    # GEOMETRY DECISION
    # ========================================================

    strong_geometry = (

        len(good_matches)
        >=
        RANSAC_MIN_GOOD_MATCHES

        and

        inliers
        >=
        RANSAC_MIN_INLIERS

        and

        inlier_ratio
        >=
        RANSAC_MIN_INLIER_RATIO
    )

    borderline_geometry = (

        len(good_matches)
        >=
        RANSAC_BORDERLINE_MIN_GOOD_MATCHES

        and

        inliers
        >=
        RANSAC_BORDERLINE_MIN_INLIERS

        and

        inlier_ratio
        >=
        RANSAC_BORDERLINE_INLIER_RATIO
    )

    # ========================================================
    # STRONG SAME SCENE
    # ========================================================

    if (

        semantic_similarity
        >=
        SAME_SCENE_SEMANTIC_THRESHOLD

        and

        strong_geometry
    ):

        result["status"] = (
            "SAME_SCENE"
        )

        result[
            "decision_reason"
        ] = (
            "Semantic similarity is high and there "
            "are enough independent local feature "
            "matches with sufficient RANSAC inliers "
            "to provide strong geometric evidence."
        )

    # ========================================================
    # BORDERLINE
    # ========================================================

    elif (

        semantic_similarity
        >=
        SAME_SCENE_BORDERLINE_THRESHOLD

        and

        borderline_geometry
    ):

        result["status"] = (
            "UNCERTAIN"
        )

        result[
            "decision_reason"
        ] = (
            "Semantic similarity and local geometric "
            "evidence are present, but the evidence "
            "is not strong enough to confidently "
            "confirm the same physical scene."
        )

    # ========================================================
    # HIGH CLIP + WEAK GEOMETRY
    # ========================================================

    elif (
        semantic_similarity
        >=
        SAME_SCENE_SEMANTIC_THRESHOLD
    ):

        result["status"] = (
            "UNCERTAIN"
        )

        result[
            "decision_reason"
        ] = (
            "High semantic similarity was detected, "
            "but the number of reliable local matches "
            "or RANSAC inliers is too small to confirm "
            "the same physical scene."
        )

    # ========================================================
    # LOW SEMANTIC + WEAK GEOMETRY
    # ========================================================

    else:

        result["status"] = (
            "DIFFERENT_SCENE"
        )

        result[
            "decision_reason"
        ] = (
            "Semantic similarity is below the same-scene "
            "threshold and geometric evidence is "
            "insufficient to establish the same "
            "physical scene."
        )

    return result


# ============================================================
# WORK DESCRIPTION CHECK
# ============================================================

def check_work_description(
    image_path,
    description
):

    if not description:

        return {

            "similarity": 0,

            "status":
                "NO_DESCRIPTION",

            "role":
                "SUPPORTING_SIGNAL"
        }

    try:

        image = Image.open(
            image_path
        ).convert("RGB")

        image_embedding = (
            clip_model.encode(

                image,

                convert_to_tensor=True,

                normalize_embeddings=True
            )
        )

        text_embedding = (
            clip_model.encode(

                description,

                convert_to_tensor=True,

                normalize_embeddings=True
            )
        )

        similarity = float(

            util.cos_sim(

                image_embedding,

                text_embedding

            ).item()
        )

        similarity = max(
            0.0,
            min(
                1.0,
                similarity
            )
        )

        if (
            similarity
            >=
            DESCRIPTION_SIGNIFICANT_THRESHOLD
        ):

            status = "MATCH"

        elif (
            similarity
            >=
            DESCRIPTION_MODERATE_THRESHOLD
        ):

            status = "PARTIAL_MATCH"

        else:

            status = "LOW_MATCH"

        return {

            "similarity":
                round(
                    similarity,
                    4
                ),

            "status":
                status,

            "role":
                "SUPPORTING_SIGNAL"
        }

    except Exception as e:

        return {

            "similarity": 0,

            "status":
                "ERROR",

            "error":
                str(e),

            "role":
                "SUPPORTING_SIGNAL"
        }


# ============================================================
# SCENE RELEVANCE
# ============================================================

def check_scene_relevance(
    image_path,
    description
):

    description_lower = (
        description or ""
    ).lower()

    if any(

        word in description_lower

        for word in [

            "road",
            "street",
            "pothole",
            "asphalt",
            "resurface",
            "roadway",
            "highway",
            "pavement"
        ]
    ):

        scene_type = (
            "ROAD_WORK"
        )

        positive_prompt = (
            "a road construction or "
            "road repair scene"
        )

        negative_prompt = (
            "an indoor building or "
            "unrelated place"
        )

    elif any(

        word in description_lower

        for word in [

            "drain",
            "drainage",
            "sewer",
            "culvert"
        ]
    ):

        scene_type = (
            "DRAINAGE_WORK"
        )

        positive_prompt = (
            "a drainage construction or "
            "drainage repair scene"
        )

        negative_prompt = (
            "an indoor building or "
            "unrelated place"
        )

    elif any(

        word in description_lower

        for word in [

            "streetlight",
            "street light",
            "lamp post",
            "electric pole",
            "lighting"
        ]
    ):

        scene_type = (
            "STREETLIGHT_WORK"
        )

        positive_prompt = (
            "a streetlight, lamp post or "
            "electric lighting work scene"
        )

        negative_prompt = (
            "an indoor building or "
            "unrelated place"
        )

    elif any(

        word in description_lower

        for word in [

            "building",
            "wall",
            "construction",
            "renovation",
            "painting",
            "hall"
        ]
    ):

        scene_type = (
            "BUILDING_WORK"
        )

        positive_prompt = (
            "a building construction, "
            "renovation, painting or "
            "hall work scene"
        )

        negative_prompt = (
            "a road or unrelated outdoor "
            "infrastructure scene"
        )

    elif any(

        word in description_lower

        for word in [

            "park",
            "garden",
            "playground",
            "green space"
        ]
    ):

        scene_type = (
            "PARK_WORK"
        )

        positive_prompt = (
            "a park, garden or playground "
            "development scene"
        )

        negative_prompt = (
            "an indoor building or unrelated "
            "infrastructure scene"
        )

    else:

        scene_type = (
            "GENERAL_WORK"
        )

        positive_prompt = (
            "a public infrastructure work "
            "or construction scene"
        )

        negative_prompt = (
            "an unrelated scene"
        )

    try:

        image = Image.open(
            image_path
        ).convert("RGB")

        image_embedding = (
            clip_model.encode(

                image,

                convert_to_tensor=True,

                normalize_embeddings=True
            )
        )

        positive_embedding = (
            clip_model.encode(

                positive_prompt,

                convert_to_tensor=True,

                normalize_embeddings=True
            )
        )

        negative_embedding = (
            clip_model.encode(

                negative_prompt,

                convert_to_tensor=True,

                normalize_embeddings=True
            )
        )

        positive_similarity = float(

            util.cos_sim(

                image_embedding,

                positive_embedding

            ).item()
        )

        negative_similarity = float(

            util.cos_sim(

                image_embedding,

                negative_embedding

            ).item()
        )

        margin = (
            positive_similarity
            -
            negative_similarity
        )

        if margin >= 0.05:

            status = "RELEVANT"

        elif margin >= 0:

            status = "UNCERTAIN"

        else:

            status = "NOT_RELEVANT"

        return {

            "scene_type":
                scene_type,

            "positive_similarity":
                round(
                    positive_similarity,
                    4
                ),

            "negative_similarity":
                round(
                    negative_similarity,
                    4
                ),

            "margin":
                round(
                    margin,
                    4
                ),

            "status":
                status,

            "role":
                "SUPPORTING_SIGNAL"
        }

    except Exception as e:

        return {

            "scene_type":
                scene_type,

            "status":
                "ERROR",

            "error":
                str(e),

            "role":
                "SUPPORTING_SIGNAL"
        }


# ============================================================
# DESCRIPTION CONSISTENCY
# ============================================================

def determine_description_consistency(
    description_verification,
    scene_relevance
):

    description_status = (
        description_verification.get(
            "status"
        )
    )

    relevance_status = (
        scene_relevance.get(
            "status"
        )
    )

    if (

        description_status == "MATCH"

        and

        relevance_status == "RELEVANT"
    ):

        return {

            "status":
                "CONSISTENT",

            "severity":
                "LOW",

            "action":
                "SUPPORTING_SIGNAL"
        }

    if (

        description_status == "LOW_MATCH"

        and

        relevance_status == "NOT_RELEVANT"
    ):

        return {

            "status":
                "CONTRADICTORY",

            "severity":
                "MEDIUM",

            "action":
                "SUPPORTING_SIGNAL_ONLY"
        }

    return {

        "status":
            "UNCERTAIN",

        "severity":
            "LOW",

        "action":
            "SUPPORTING_SIGNAL_ONLY"
    }


# ============================================================
# AUTHENTICITY
# ============================================================

def check_single_image_authenticity(
    image_path
):

    if not AUTHENTICITY_MODEL_AVAILABLE:

        return {

            "status":
                "UNCERTAIN",

            "real_probability":
                None,

            "fake_probability":
                None,

            "authenticity_score":
                None,

            "role":
                "SUPPORTING_SIGNAL"
        }

    try:

        image = Image.open(
            image_path
        ).convert("RGB")

        inputs = (
            authenticity_processor(

                images=image,

                return_tensors="pt"
            )
        )

        with torch.no_grad():

            outputs = (
                authenticity_model(
                    **inputs
                )
            )

        probabilities = torch.softmax(

            outputs.logits,

            dim=-1

        )[0]

        # ====================================================
        # DYNAMIC MODEL LABEL MAPPING
        # ====================================================
        # Do not assume class 0 = fake and class 1 = real.
        # Read the labels provided by the model configuration.

        id2label = getattr(
            authenticity_model.config,
            "id2label",
            {}
        )

        fake_index = None
        real_index = None

        for index, label in id2label.items():

            label_text = str(
                label
            ).lower().strip()

            if (
                "fake" in label_text
                or
                "deepfake" in label_text
                or
                "ai" in label_text
                or
                "generated" in label_text
            ):

                fake_index = int(
                    index
                )

            elif (
                "real" in label_text
                or
                "authentic" in label_text
                or
                "human" in label_text
            ):

                real_index = int(
                    index
                )

        # ====================================================
        # SAFE FALLBACK
        # ====================================================
        # Keep the previous mapping only if the model does not
        # expose usable real/fake labels.

        if (
            fake_index is None
            or
            real_index is None
            or
            fake_index >= len(probabilities)
            or
            real_index >= len(probabilities)
        ):

            fake_index = 0
            real_index = 1

        fake_probability = float(
            probabilities[
                fake_index
            ].item()
        )

        real_probability = float(
            probabilities[
                real_index
            ].item()
        )

        # ====================================================
        # CLASSIFICATION
        # ====================================================

        if fake_probability >= 0.70:

            status = (
                "LIKELY_AI_GENERATED"
            )

        elif real_probability >= 0.70:

            status = (
                "LIKELY_REAL"
            )

        else:

            status = (
                "UNCERTAIN"
            )

        return {

            "status":
                status,

            "real_probability":
                round(
                    real_probability,
                    4
                ),

            "fake_probability":
                round(
                    fake_probability,
                    4
                ),

            # This is the model's estimated real probability,
            # not proof that the image is authentic.
            "authenticity_score":
                round(
                    real_probability * 100,
                    2
                ),

            "role":
                "SUPPORTING_SIGNAL"
        }

    except Exception as e:

        return {

            "status":
                "UNCERTAIN",

            "real_probability":
                None,

            "fake_probability":
                None,

            "authenticity_score":
                None,

            "error":
                str(e),

            "role":
                "SUPPORTING_SIGNAL"
        }


def check_image_authenticity(
    before_path,
    after_path
):

    before_result = (
        check_single_image_authenticity(
            before_path
        )
    )

    after_result = (
        check_single_image_authenticity(
            after_path
        )
    )

    return {

        "before_image":
            before_result,

        "after_image":
            after_result,

        "role":
            "SUPPORTING_SIGNAL"
    }


# ============================================================
# SCORE FUNCTIONS
# ============================================================

def calculate_metadata_score(
    metadata
):

    score = 0

    if metadata.get(
        "timestamp_check"
    ):

        score += 25

    if metadata.get(
        "timestamp_order_check"
    ):

        score += 25

    if metadata.get(
        "gps_check"
    ):

        score += 25

    if metadata.get(
        "gps_location_check"
    ):

        score += 25

    return score


def calculate_description_score(
    description_verification
):

    similarity = (
        description_verification.get(
            "similarity"
        )
    )

    if similarity is None:

        return 0

    return round(
        similarity * 100,
        2
    )


def calculate_visual_change_score(
    visual_result
):

    difference = (
        visual_result.get(
            "difference"
        )
    )

    if difference is None:

        return 0

    return round(

        min(
            1.0,
            max(
                0.0,
                difference
            )
        )
        *
        100,

        2
    )


def calculate_evidence_score(
    metadata_score,
    visual_change_score,
    description_score,
    same_scene
):

    same_scene_status = (
        same_scene.get(
            "status"
        )
    )

    if same_scene_status == (
        "SAME_SCENE"
    ):

        scene_score = 100

    elif same_scene_status == (
        "UNCERTAIN"
    ):

        scene_score = 50

    else:

        scene_score = 0

    score = (

        metadata_score * 0.35

        +

        visual_change_score * 0.30

        +

        scene_score * 0.25

        +

        description_score * 0.10
    )

    return round(
        score,
        2
    )


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():

    return {

        "service":
            "Proof-of-Work AI Verification Service",

        "version":
            "5.1.0",

        "status":
            "running",

        "cv2_available":
            CV2_AVAILABLE,

        "authenticity_model_available":
            AUTHENTICITY_MODEL_AVAILABLE
    }


# ============================================================
# HEALTH
# ============================================================

@app.get("/health")
def health():

    return {

        "status":
            "healthy",

        "cv2_available":
            CV2_AVAILABLE,

        "authenticity_model_available":
            AUTHENTICITY_MODEL_AVAILABLE
    }


# ============================================================
# UPLOAD EVIDENCE
# ============================================================

@app.post("/upload-evidence")
async def upload_evidence(
    work_id: int = Form(...),
    evidence_type: str = Form(...),
    file: UploadFile = File(...)
):

    work_dir = os.path.join(
        UPLOAD_DIR,
        str(work_id)
    )

    os.makedirs(
        work_dir,
        exist_ok=True
    )

    safe_filename = os.path.basename(
        file.filename
    )

    filename = (
        f"{evidence_type}_"
        f"{safe_filename}"
    )

    file_path = os.path.join(
        work_dir,
        filename
    )

    with open(
        file_path,
        "wb"
    ) as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )

    return {

        "status":
            "uploaded",

        "work_id":
            work_id,

        "evidence_type":
            evidence_type,

        "filename":
            filename,

        "path":
            file_path
    }


# ============================================================
# VERIFY METADATA
# ============================================================

@app.get("/verify-metadata/{work_id}")
def verify_metadata(
    work_id: int
):

    before_path, after_path = (
        find_evidence_files(
            work_id
        )
    )

    if (
        not before_path
        or
        not after_path
    ):

        return {

            "status":
                "ERROR",

            "message":
                "Before and after images are required."
        }

    return check_metadata(
        before_path,
        after_path
    )


# ============================================================
# VERIFY AI / VISUAL CHANGE
# ============================================================

@app.get("/verify-ai/{work_id}")
def verify_ai(
    work_id: int
):

    before_path, after_path = (
        find_evidence_files(
            work_id
        )
    )

    if (
        not before_path
        or
        not after_path
    ):

        return {

            "status":
                "ERROR",

            "message":
                "Before and after images are required."
        }

    return compare_images(
        before_path,
        after_path
    )


# ============================================================
# VERIFY AUTHENTICITY
# ============================================================

@app.get("/verify-authenticity/{work_id}")
def verify_authenticity(
    work_id: int
):

    before_path, after_path = (
        find_evidence_files(
            work_id
        )
    )

    if (
        not before_path
        or
        not after_path
    ):

        return {

            "status":
                "ERROR",

            "message":
                "Before and after images are required."
        }

    return check_image_authenticity(
        before_path,
        after_path
    )


# ============================================================
# VERIFY WORK GET
# ============================================================

@app.get("/verify/{work_id}")
def verify_work_get(
    work_id: int
):

    return verify_work_logic(
        work_id,
        ""
    )


# ============================================================
# VERIFY WORK LOGIC
# ============================================================

def verify_work_logic(
    work_id,
    work_description
):

    before_path, after_path = (
        find_evidence_files(
            work_id
        )
    )

    if (
        not before_path
        or
        not after_path
    ):

        return {

            "work_id":
                work_id,

            "status":
                "ERROR",

            "message":
                "Before and after evidence images "
                "are required."
        }

    # ========================================================
    # 1. VISUAL COMPARISON
    # ========================================================

    visual_result = compare_images(
        before_path,
        after_path
    )

    # ========================================================
    # 2. SAME SCENE
    # ========================================================

    same_scene_result = check_same_scene(
        before_path,
        after_path
    )

    # ========================================================
    # 3. DESCRIPTION
    # ========================================================

    description_result = (
        check_work_description(
            before_path,
            work_description
        )
    )

    # ========================================================
    # 4. SCENE RELEVANCE
    # ========================================================

    scene_relevance_result = (
        check_scene_relevance(
            before_path,
            work_description
        )
    )

    # ========================================================
    # 5. DESCRIPTION CONSISTENCY
    # ========================================================

    description_consistency = (
        determine_description_consistency(

            description_result,

            scene_relevance_result
        )
    )

    # ========================================================
    # 6. METADATA
    # ========================================================

    metadata_result = check_metadata(
        before_path,
        after_path
    )

    # ========================================================
    # 7. AUTHENTICITY
    # ========================================================

    authenticity_result = (
        check_image_authenticity(

            before_path,

            after_path
        )
    )

    # ========================================================
    # 8. FORENSICS
    # ========================================================

    try:

        forensic_result = (
            compare_forensics(

                before_path,

                after_path
            )
        )

    except Exception as e:

        forensic_result = {

            "status":
                "ERROR",

            "error":
                str(e)
        }

    # ========================================================
    # 9. SCORES
    # ========================================================

    metadata_score = (
        calculate_metadata_score(
            metadata_result
        )
    )

    visual_change_score = (
        calculate_visual_change_score(
            visual_result
        )
    )

    description_score = (
        calculate_description_score(
            description_result
        )
    )

    evidence_score = (
        calculate_evidence_score(

            metadata_score,

            visual_change_score,

            description_score,

            same_scene_result
        )
    )

    # ========================================================
    # 10. PRIMARY EVIDENCE
    # ========================================================

    primary_evidence_status = {

        "gps":
            metadata_result.get(
                "gps_location_check"
            ),

        "timestamp":
            metadata_result.get(
                "timestamp_order_check"
            ),

        "same_scene":
            same_scene_result.get(
                "status"
            ),

        "visual_change":
            visual_result.get(
                "status"
            )
    }

    # ========================================================
    # 11. AUTHENTICITY REVIEW
    # ========================================================

    authenticity_review_required = False

    before_auth = (
        authenticity_result.get(
            "before_image",
            {}
        )
    )

    after_auth = (
        authenticity_result.get(
            "after_image",
            {}
        )
    )

    if (

        before_auth.get(
            "status"
        )
        ==
        "LIKELY_AI_GENERATED"

        or

        after_auth.get(
            "status"
        )
        ==
        "LIKELY_AI_GENERATED"
    ):

        authenticity_review_required = True

    # ========================================================
    # 12. FORENSIC REVIEW
    # ========================================================

    forensic_review_required = False

    try:

        overall = (
            forensic_result.get(
                "overall",
                {}
            )
        )

        if (

            overall.get(
                "before_risk"
            )
            ==
            "HIGH"

            or

            overall.get(
                "after_risk"
            )
            ==
            "HIGH"
        ):

            forensic_review_required = True

    except Exception:

        pass

    # ========================================================
    # 13. FINAL DECISION
    # ========================================================

    final_status = (
        "NEEDS_REVIEW"
    )

    final_reason = ""

    metadata_status = (
        metadata_result.get(
            "status"
        )
    )

    same_scene_status = (
        same_scene_result.get(
            "status"
        )
    )

    visual_status = (
        visual_result.get(
            "status"
        )
    )

    description_consistency_status = (
        description_consistency.get(
            "status"
        )
    )

    # ========================================================
    # PRIORITY 1:
    # DIFFERENT SCENE = REJECT
    #
    # IMPORTANT FIX:
    # This check comes BEFORE metadata.
    #
    # Even if GPS/timestamp are missing,
    # if the images cannot be established as
    # the same physical scene, automatic
    # verification must fail.
    # ========================================================

    if (
        same_scene_status
        ==
        "DIFFERENT_SCENE"
    ):

        final_status = (
            "REJECTED"
        )

        final_reason = (
            "The before and after images do not "
            "provide sufficient evidence that they "
            "represent the same physical scene. "
            "Local feature matching and RANSAC "
            "geometric verification failed."
        )

    # ========================================================
    # PRIORITY 2:
    # LOW VISUAL CHANGE = REJECT
    #
    # If the same scene is established but there
    # is practically no change, the work cannot
    # be automatically verified.
    # ========================================================

    elif (
        visual_status
        ==
        "LOW_CHANGE"
    ):

        final_status = (
            "REJECTED"
        )

        final_reason = (
            "The before and after images do not "
            "show sufficient visual change."
        )

    # ========================================================
    # PRIORITY 3:
    # UNCERTAIN SCENE = REVIEW
    # ========================================================

    elif (
        same_scene_status
        ==
        "UNCERTAIN"
    ):

        final_status = (
            "NEEDS_REVIEW"
        )

        final_reason = (
            "The images may be semantically related, "
            "but local geometric evidence is insufficient "
            "to reliably confirm that they show the same "
            "physical scene."
        )

    # ========================================================
    # PRIORITY 4:
    # MISSING / INSUFFICIENT METADATA = REVIEW
    # ========================================================

    elif (
        metadata_status
        ==
        "INSUFFICIENT_METADATA"
    ):

        final_status = (
            "NEEDS_REVIEW"
        )

        final_reason = (
            "The images appear related, but required "
            "GPS/timestamp metadata is insufficient "
            "for automatic verification."
        )

    # ========================================================
    # PRIORITY 5:
    # PARTIAL METADATA = REVIEW
    # ========================================================

    elif (
        metadata_status
        ==
        "PARTIAL_METADATA"
    ):

        final_status = (
            "NEEDS_REVIEW"
        )

        final_reason = (
            "Some metadata evidence is available, "
            "but complete automatic verification "
            "is not possible."
        )

    # ========================================================
    # PRIORITY 6:
    # STRONG EVIDENCE = VERIFIED
    # ========================================================

    elif (

        metadata_status
        ==
        "VERIFIED"

        and

        same_scene_status
        ==
        "SAME_SCENE"

        and

        visual_status
        in
        [
            "SIGNIFICANT_CHANGE",
            "MODERATE_CHANGE"
        ]
    ):

        if (
            description_consistency_status
            ==
            "CONTRADICTORY"
        ):

            final_status = (
                "NEEDS_REVIEW"
            )

            final_reason = (
                "Primary work evidence is strong, "
                "but the work description conflicts "
                "with the image evidence and requires "
                "review."
            )

        elif (
            authenticity_review_required
        ):

            final_status = (
                "NEEDS_REVIEW"
            )

            final_reason = (
                "Strong work evidence was detected, "
                "but the authenticity model flagged "
                "one or more images for additional review."
            )

        elif (
            forensic_review_required
        ):

            final_status = (
                "NEEDS_REVIEW"
            )

            final_reason = (
                "Strong work evidence was detected, "
                "but forensic analysis produced elevated "
                "risk signals requiring review."
            )

        else:

            final_status = (
                "VERIFIED"
            )

            final_reason = (
                "GPS, timestamp, same-scene geometric "
                "evidence and before/after visual change "
                "support the work verification."
            )

    # ========================================================
    # FALLBACK
    # ========================================================

    else:

        final_status = (
            "NEEDS_REVIEW"
        )

        final_reason = (
            "Evidence is inconclusive and requires "
            "manual review."
        )

    # ========================================================
    # FINAL RESPONSE
    # ========================================================

    return {

        "work_id":
            work_id,

        "work_description":
            work_description,

        "metadata_verification":
            metadata_result,

        "ai_verification":
            visual_result,

        "same_scene_verification":
            same_scene_result,

        "description_verification":
            description_result,

        "description_consistency":
            description_consistency,

        "scene_relevance_verification":
            scene_relevance_result,

        "authenticity_verification":
            authenticity_result,

        "forensic_verification":
            forensic_result,

        "primary_evidence_status":
            primary_evidence_status,

        "scores": {

            "visual_change_score":
                visual_change_score,

            "metadata_score":
                metadata_score,

            "description_score":
                description_score,

            "evidence_score":
                evidence_score
        },

        "review_flags": {

            "authenticity_review_required":
                authenticity_review_required,

            "forensic_review_required":
                forensic_review_required
        },

        "final_verification": {

            "status":
                final_status,

            "reason":
                final_reason
        },

        "verification_policy": {

            "primary_evidence": [

                "GPS",

                "Timestamp",

                "Same Scene",

                "Before/After Visual Change"
            ],

            "same_scene_method": [

                "CLIP Semantic Similarity",

                "ORB Local Features",

                "Lowe Ratio Test",

                "RANSAC Homography",

                "Absolute Match Count",

                "Absolute Inlier Count",

                "RANSAC Inlier Ratio"
            ],

            "supporting_evidence": [

                "Work Description",

                "Scene Relevance",

                "Image Authenticity",

                "Forensic Analysis"
            ],

            "description_can_auto_reject":
                False,

            "evidence_score_is_probability":
                False,

            "same_scene_requires_absolute_matches":
                True,

            "same_scene_requires_absolute_inliers":
                True
        }
    }


# ============================================================
# VERIFY WORK - POST
# ============================================================

@app.post("/verify-work")
async def verify_work(
    work_id: int = Form(...),
    work_description: str = Form("")
):

    return verify_work_logic(
        work_id,
        work_description
    )


# ============================================================
# CITIZEN FEEDBACK
# ============================================================

@app.post("/verify-citizen-feedback")
async def verify_citizen_feedback(
    work_id: int = Form(...),
    feedback: str = Form(...),
    citizen_name: str = Form("")
):

    work_dir = os.path.join(
        UPLOAD_DIR,
        str(work_id)
    )

    os.makedirs(
        work_dir,
        exist_ok=True
    )

    feedback_file = os.path.join(
        work_dir,
        "citizen_feedback.txt"
    )

    with open(
        feedback_file,
        "a",
        encoding="utf-8"
    ) as file:

        file.write(

            f"\nCitizen: {citizen_name}\n"

            f"Feedback: {feedback}\n"

            f"Time: "
            f"{datetime.now().isoformat()}\n"

            f"{'-' * 50}\n"
        )

    return {

        "status":
            "feedback_saved",

        "work_id":
            work_id,

        "citizen_name":
            citizen_name,

        "feedback":
            feedback
    }

