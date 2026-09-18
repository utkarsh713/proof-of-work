from fastapi import FastAPI, UploadFile, File, Form
import os
import shutil
import math
from datetime import datetime

# Optional computer-vision feature matching for same-scene verification
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
# FASTAPI
# ============================================================

app = FastAPI(
    title="Proof-of-Work AI Verification Service",
    version="3.4.0"
)

UPLOAD_DIR = "uploads"

os.makedirs(
    UPLOAD_DIR,
    exist_ok=True
)


# ============================================================
# CLIP MODEL
# ============================================================

print("Loading CLIP model...")

image_model = SentenceTransformer(
    "clip-ViT-B-32"
)

print("CLIP model loaded!")


# ============================================================
# AUTHENTICITY MODEL
# ============================================================

AUTHENTICITY_MODEL_NAME = (
    "prithivMLmods/deepfake-detector-model-v1"
)

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

    print(
        "Authenticity model loaded!"
    )

except Exception as e:

    print(
        "Authenticity model load failed:",
        e
    )

    authenticity_processor = None

    authenticity_model = None

    AUTHENTICITY_MODEL_AVAILABLE = False


# ============================================================
# HOME
# ============================================================

@app.get("/")
def home():

    return {

        "message":
            "Proof-of-Work AI Service is running",

        "status":
            "OK"

    }


# ============================================================
# HEALTH
# ============================================================

@app.get("/health")
def health():

    return {

        "status":
            "healthy",

        "authenticity_model":
            AUTHENTICITY_MODEL_AVAILABLE

    }


# ============================================================
# RATIONAL -> FLOAT
# ============================================================

def rational_to_float(
    value
):

    try:

        if value is None:

            return None

        if isinstance(
            value,
            (int, float)
        ):

            return float(value)

        if (
            hasattr(value, "numerator")
            and
            hasattr(value, "denominator")
        ):

            if value.denominator == 0:

                return None

            return (
                float(value.numerator)
                /
                float(value.denominator)
            )

        if (
            isinstance(value, tuple)
            and
            len(value) == 2
        ):

            if float(value[1]) == 0:

                return None

            return (
                float(value[0])
                /
                float(value[1])
            )

        return float(value)

    except Exception:

        return None


# ============================================================
# GPS DMS -> DECIMAL
# ============================================================

def gps_to_decimal(
    values,
    reference
):

    try:

        if not values:

            return None

        if len(values) != 3:

            return None

        degrees = rational_to_float(
            values[0]
        )

        minutes = rational_to_float(
            values[1]
        )

        seconds = rational_to_float(
            values[2]
        )

        if (
            degrees is None
            or
            minutes is None
            or
            seconds is None
        ):

            return None

        result = (

            degrees

            +

            minutes / 60

            +

            seconds / 3600

        )

        if str(
            reference
        ).upper() in ["S", "W"]:

            result = -result

        return result

    except Exception:

        return None


# ============================================================
# IMAGE METADATA
# ============================================================

def get_image_metadata(
    path
):

    result = {

        "timestamp":
            None,

        "timestamp_source":
            None,

        "gps":
            None,

        "gps_source":
            None

    }

    try:

        image = Image.open(
            path
        )

        exif = image.getexif()

        if not exif:

            return result

        # ----------------------------------------------------
        # TIMESTAMP
        # ----------------------------------------------------

        timestamp_tags = [

            36867,

            36868,

            306

        ]

        for tag_id in timestamp_tags:

            value = exif.get(
                tag_id
            )

            if value:

                result[
                    "timestamp"
                ] = str(value)

                result[
                    "timestamp_source"
                ] = str(
                    TAGS.get(
                        tag_id,
                        tag_id
                    )
                )

                break

        # ----------------------------------------------------
        # GPS
        # ----------------------------------------------------

        gps = None

        try:

            gps = exif.get_ifd(
                IFD.GPSInfo
            )

        except Exception:

            pass

        if not gps:

            gps = exif.get(
                34853
            )

        if gps:

            readable = {}

            for key, value in gps.items():

                readable[
                    GPSTAGS.get(
                        key,
                        key
                    )
                ] = value

            latitude = gps_to_decimal(

                readable.get(
                    "GPSLatitude"
                ),

                readable.get(
                    "GPSLatitudeRef"
                )

            )

            longitude = gps_to_decimal(

                readable.get(
                    "GPSLongitude"
                ),

                readable.get(
                    "GPSLongitudeRef"
                )

            )

            if (
                latitude is not None
                and
                longitude is not None
            ):

                result["gps"] = {

                    "latitude":
                        latitude,

                    "longitude":
                        longitude,

                    "latitude_ref":
                        str(
                            readable.get(
                                "GPSLatitudeRef"
                            )
                        ),

                    "longitude_ref":
                        str(
                            readable.get(
                                "GPSLongitudeRef"
                            )
                        )

                }

                result[
                    "gps_source"
                ] = "EXIF_GPS"

    except Exception as e:

        print(
            "Metadata error:",
            e
        )

    return result


# ============================================================
# PARSE TIMESTAMP
# ============================================================

def parse_timestamp(
    value
):

    if not value:

        return None

    formats = [

        "%Y:%m:%d %H:%M:%S",

        "%Y-%m-%d %H:%M:%S",

        "%Y-%m-%dT%H:%M:%S"

    ]

    for fmt in formats:

        try:

            return datetime.strptime(
                str(value).strip(),
                fmt
            )

        except ValueError:

            pass

    return None


# ============================================================
# HAVERSINE DISTANCE
# ============================================================

def calculate_distance(
    lat1,
    lon1,
    lat2,
    lon2
):

    R = 6371000

    p1 = math.radians(
        lat1
    )

    p2 = math.radians(
        lat2
    )

    dp = math.radians(
        lat2 - lat1
    )

    dl = math.radians(
        lon2 - lon1
    )

    a = (

        math.sin(dp / 2) ** 2

        +

        math.cos(p1)
        *
        math.cos(p2)
        *
        math.sin(dl / 2) ** 2

    )

    return (

        R
        *
        2
        *
        math.atan2(
            math.sqrt(a),
            math.sqrt(1 - a)
        )

    )


# ============================================================
# WORK SCENE RELEVANCE
# ============================================================

def check_scene_relevance(
    description,
    after_path
):
    """Semantic scene check to prevent unrelated images from passing."""

    description_lower = description.lower()

    if any(word in description_lower for word in [
        "road", "street", "pothole", "asphalt",
        "resurface", "roadway", "highway", "pavement"
    ]):
        positive_prompt = "a real photograph of a road or street showing road work"
        negative_prompt = "a real photograph of an indoor hall, event, classroom, or room"
        scene_type = "ROAD_WORK"
    elif any(word in description_lower for word in [
        "drain", "drainage", "sewer", "culvert"
    ]):
        positive_prompt = "a real photograph of drainage, sewer, or drain construction work"
        negative_prompt = "a real photograph of an unrelated indoor hall or event"
        scene_type = "DRAINAGE_WORK"
    elif any(word in description_lower for word in [
        "streetlight", "street light", "lamp post", "electric pole", "lighting"
    ]):
        positive_prompt = "a real photograph of a streetlight, lamp post, or electrical pole work site"
        negative_prompt = "a real photograph of an unrelated indoor hall or event"
        scene_type = "STREETLIGHT_WORK"
    elif any(word in description_lower for word in [
        "building", "wall", "construction", "renovation", "painting"
    ]):
        positive_prompt = "a real photograph of a building construction, repair, renovation, or painting work site"
        negative_prompt = "a real photograph of an unrelated indoor hall or event"
        scene_type = "BUILDING_WORK"
    elif any(word in description_lower for word in [
        "park", "garden", "playground", "green space"
    ]):
        positive_prompt = "a real photograph of a public park, garden, or playground work site"
        negative_prompt = "a real photograph of an unrelated indoor hall or event"
        scene_type = "PARK_WORK"
    else:
        positive_prompt = "a real photograph showing the work described in the task"
        negative_prompt = "a real photograph of an unrelated location or indoor event"
        scene_type = "GENERAL_WORK"

    image_embedding = image_model.encode(
        Image.open(after_path).convert("RGB"),
        convert_to_tensor=True
    )
    positive_embedding = image_model.encode(
        positive_prompt,
        convert_to_tensor=True
    )
    negative_embedding = image_model.encode(
        negative_prompt,
        convert_to_tensor=True
    )

    positive_similarity = util.cos_sim(image_embedding, positive_embedding).item()
    negative_similarity = util.cos_sim(image_embedding, negative_embedding).item()
    margin = positive_similarity - negative_similarity

    if margin >= 0.05:
        status = "RELEVANT"
    elif margin >= 0.0:
        status = "UNCERTAIN"
    else:
        status = "NOT_RELEVANT"

    return {
        "scene_type": scene_type,
        "positive_similarity": round(positive_similarity, 4),
        "negative_similarity": round(negative_similarity, 4),
        "margin": round(margin, 4),
        "status": status
    }


# ============================================================
# SAME-SCENE VERIFICATION
# ============================================================

def check_same_scene(
    before_path,
    after_path
):
    """
    Checks whether Before and After appear to show the same physical scene.

    Uses:
    1. CLIP semantic similarity as a broad scene signal.
    2. ORB local-feature matching as a physical landmark signal.

    This is supporting evidence, not absolute proof of identity.
    """

    before_image = Image.open(
        before_path
    ).convert("RGB")

    after_image = Image.open(
        after_path
    ).convert("RGB")

    # --------------------------------------------------------
    # CLIP SEMANTIC SIMILARITY
    # --------------------------------------------------------

    before_embedding = image_model.encode(
        before_image,
        convert_to_tensor=True
    )

    after_embedding = image_model.encode(
        after_image,
        convert_to_tensor=True
    )

    semantic_similarity = util.cos_sim(
        before_embedding,
        after_embedding
    ).item()

    semantic_similarity = max(
        0.0,
        min(1.0, semantic_similarity)
    )

    # --------------------------------------------------------
    # ORB LOCAL FEATURE MATCHING
    # --------------------------------------------------------

    if not CV2_AVAILABLE:
        return {
            "status": "UNCERTAIN",
            "method": "CLIP_ONLY",
            "semantic_similarity": round(
                semantic_similarity, 4
            ),
            "good_matches": None,
            "feature_match_ratio": None,
            "note": (
                "OpenCV is not installed. Install "
                "opencv-python for physical landmark matching."
            )
        }

    try:
        before_cv = cv2.cvtColor(
            cv2.imread(before_path),
            cv2.COLOR_BGR2GRAY
        )
        after_cv = cv2.cvtColor(
            cv2.imread(after_path),
            cv2.COLOR_BGR2GRAY
        )

        if before_cv is None or after_cv is None:
            raise ValueError("Could not read images with OpenCV")

        # Resize only for feature extraction; original evidence is untouched.
        max_dim = 1200

        def resize_for_matching(image):
            h, w = image.shape[:2]
            scale = min(1.0, max_dim / max(h, w))
            if scale < 1.0:
                return cv2.resize(
                    image,
                    (int(w * scale), int(h * scale)),
                    interpolation=cv2.INTER_AREA
                )
            return image

        before_cv = resize_for_matching(before_cv)
        after_cv = resize_for_matching(after_cv)

        orb = cv2.ORB_create(
            nfeatures=1500,
            scaleFactor=1.2,
            nlevels=8
        )

        kp1, des1 = orb.detectAndCompute(
            before_cv, None
        )
        kp2, des2 = orb.detectAndCompute(
            after_cv, None
        )

        if des1 is None or des2 is None:
            good_matches = 0
            feature_match_ratio = 0.0
        else:
            matcher = cv2.BFMatcher(
                cv2.NORM_HAMMING,
                crossCheck=False
            )

            knn_matches = matcher.knnMatch(
                des1,
                des2,
                k=2
            )

            good = []

            for pair in knn_matches:
                if len(pair) < 2:
                    continue

                m, n = pair

                if m.distance < 0.75 * n.distance:
                    good.append(m)

            good_matches = len(good)
            feature_match_ratio = good_matches / max(
                min(len(kp1), len(kp2)),
                1
            )

        # Conservative thresholds:
        # - strong local matches + good semantic similarity => same scene
        # - borderline evidence => manual review
        # - weak semantic similarity => different scene
        if (
            semantic_similarity >= 0.70
            and good_matches >= 15
        ):
            status = "SAME_SCENE"
        elif (
            semantic_similarity >= 0.60
            and good_matches >= 5
        ):
            status = "UNCERTAIN"
        else:
            status = "DIFFERENT_SCENE"

        return {
            "status": status,
            "method": "CLIP_ORB",
            "semantic_similarity": round(
                semantic_similarity, 4
            ),
            "good_matches": good_matches,
            "feature_match_ratio": round(
                feature_match_ratio, 4
            ),
            "note": (
                "Local feature matching checks shared visual landmarks; "
                "it is supporting evidence, not absolute proof."
            )
        }

    except Exception as e:
        return {
            "status": "UNCERTAIN",
            "method": "CLIP_ORB",
            "semantic_similarity": round(
                semantic_similarity, 4
            ),
            "good_matches": None,
            "feature_match_ratio": None,
            "error": str(e)
        }


# ============================================================
# METADATA VERIFICATION
# ============================================================

def check_metadata(
    before,
    after
):

    before_timestamp = before.get(
        "timestamp"
    )

    after_timestamp = after.get(
        "timestamp"
    )

    before_gps = before.get(
        "gps"
    )

    after_gps = after.get(
        "gps"
    )

    timestamp_check = (

        before_timestamp is not None

        and

        after_timestamp is not None

    )

    timestamp_order_check = None

    if timestamp_check:

        before_time = parse_timestamp(
            before_timestamp
        )

        after_time = parse_timestamp(
            after_timestamp
        )

        timestamp_order_check = bool(

            before_time

            and

            after_time

            and

            after_time >= before_time

        )

    gps_check = (

        before_gps is not None

        and

        after_gps is not None

    )

    distance = None

    gps_location_check = None

    if gps_check:

        try:

            distance = calculate_distance(

                before_gps[
                    "latitude"
                ],

                before_gps[
                    "longitude"
                ],

                after_gps[
                    "latitude"
                ],

                after_gps[
                    "longitude"
                ]

            )

            gps_location_check = (
                distance <= 500
            )

        except Exception:

            gps_location_check = False

    if (

        timestamp_order_check is True

        and

        gps_location_check is True

    ):

        status = "VERIFIED"

    elif (

        timestamp_check

        or

        gps_check

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
            gps_check,

        "gps_location_check":
            gps_location_check,

        "gps_distance_meters":
            round(
                distance,
                2
            )
            if distance is not None
            else None,

        "status":
            status

    }


# ============================================================
# FIND BEFORE / AFTER
# ============================================================

def find_evidence_files(
    work_id
):

    folder = os.path.join(

        UPLOAD_DIR,

        str(work_id)

    )

    if not os.path.exists(
        folder
    ):

        return None, None

    before = None

    after = None

    for name in os.listdir(
        folder
    ):

        lower = name.lower()

        if lower.startswith("."):
            continue

        # IMPORTANT:
        # ELA output files are generated by forensic analysis.
        # They must NEVER be selected as the original evidence.
        if "_ela" in lower or lower.endswith("_ela.jpg"):
            continue

        full_path = os.path.join(
            folder,
            name
        )

        if not os.path.isfile(full_path):
            continue

        if "before" in lower:
            before = full_path

        elif "after" in lower:
            after = full_path

    return before, after


# ============================================================
# CLIP BEFORE / AFTER
# ============================================================

def compare_images(
    before_path,
    after_path
):

    before_image = Image.open(
        before_path
    ).convert(
        "RGB"
    )

    after_image = Image.open(
        after_path
    ).convert(
        "RGB"
    )

    before_embedding = image_model.encode(

        before_image,

        convert_to_tensor=True

    )

    after_embedding = image_model.encode(

        after_image,

        convert_to_tensor=True

    )

    similarity = util.cos_sim(

        before_embedding,

        after_embedding

    ).item()

    similarity = max(

        0.0,

        min(
            1.0,
            similarity
        )

    )

    difference = (
        1 - similarity
    )

    if difference >= 0.30:

        status = "SIGNIFICANT_CHANGE"

    elif difference >= 0.15:

        status = "MODERATE_CHANGE"

    else:

        status = "LOW_CHANGE"

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


# ============================================================
# WORK DESCRIPTION MATCHING
# ============================================================

def check_work_description(
    description,
    after_path
):

    image_embedding = image_model.encode(

        Image.open(
            after_path
        ).convert("RGB"),

        convert_to_tensor=True

    )

    text_embedding = image_model.encode(

        description,

        convert_to_tensor=True

    )

    similarity = util.cos_sim(

        image_embedding,

        text_embedding

    ).item()

    return round(
        similarity,
        4
    )


# ============================================================
# AI-GENERATED IMAGE DETECTION
# ============================================================

def check_image_authenticity(
    path
):

    if not AUTHENTICITY_MODEL_AVAILABLE:

        return {

            "status":
                "AUTHENTICITY_CHECK_UNAVAILABLE",

            "real_probability":
                None,

            "fake_probability":
                None,

            "authenticity_score":
                None

        }

    try:

        image = Image.open(
            path
        ).convert(
            "RGB"
        )

        inputs = authenticity_processor(

            images=image,

            return_tensors="pt"

        )

        with torch.no_grad():

            outputs = authenticity_model(
                **inputs
            )

        probabilities = torch.softmax(

            outputs.logits,

            dim=1

        )[0]

        # Model:
        # Class 0 = Fake
        # Class 1 = Real

        fake_probability = float(
            probabilities[0].item()
        )

        real_probability = float(
            probabilities[1].item()
        )

        if fake_probability >= 0.70:

            status = (
                "LIKELY_AI_GENERATED"
            )

        elif real_probability >= 0.70:

            status = (
                "LIKELY_REAL"
            )

        else:

            status = "UNCERTAIN"

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

            "authenticity_score":
                round(
                    real_probability * 100,
                    2
                )

        }

    except Exception as e:

        print(
            "Authenticity error:",
            e
        )

        return {

            "status":
                "AUTHENTICITY_CHECK_FAILED",

            "real_probability":
                None,

            "fake_probability":
                None,

            "authenticity_score":
                None,

            "error":
                str(e)

        }


# ============================================================
# UPLOAD EVIDENCE
# ============================================================

@app.post(
    "/upload-evidence"
)
async def upload_evidence(

    work_id: int = Form(...),

    before_image: UploadFile = File(...),

    after_image: UploadFile = File(...)

):

    folder = os.path.join(

        UPLOAD_DIR,

        str(work_id)

    )

    os.makedirs(
        folder,
        exist_ok=True
    )

    before_name = os.path.basename(

        before_image.filename
        or
        "before.jpg"

    )

    after_name = os.path.basename(

        after_image.filename
        or
        "after.jpg"

    )

    before_path = os.path.join(

        folder,

        "before_" + before_name

    )

    after_path = os.path.join(

        folder,

        "after_" + after_name

    )

    with open(
        before_path,
        "wb"
    ) as f:

        shutil.copyfileobj(

            before_image.file,

            f

        )

    with open(
        after_path,
        "wb"
    ) as f:

        shutil.copyfileobj(

            after_image.file,

            f

        )

    return {

        "message":
            "Evidence uploaded successfully",

        "work_id":
            work_id,

        "before_image":
            before_path,

        "after_image":
            after_path

    }


# ============================================================
# VERIFY METADATA API
# ============================================================

@app.get(
    "/verify-metadata/{work_id}"
)
def verify_metadata(
    work_id: int
):

    before, after = find_evidence_files(
        work_id
    )

    if not before or not after:

        return {

            "error":
                "Before and After image not found"

        }

    before_metadata = get_image_metadata(
        before
    )

    after_metadata = get_image_metadata(
        after
    )

    metadata_result = check_metadata(

        before_metadata,

        after_metadata

    )

    return {

        "work_id":
            work_id,

        "before":
            before_metadata,

        "after":
            after_metadata,

        "metadata_verification":
            metadata_result

    }


# ============================================================
# VERIFY AI / VISUAL CHANGE
# ============================================================

@app.get(
    "/verify-ai/{work_id}"
)
def verify_ai(
    work_id: int
):

    before, after = find_evidence_files(
        work_id
    )

    if not before or not after:

        return {

            "error":
                "Before and After image not found"

        }

    try:

        result = compare_images(

            before,

            after

        )

        return {

            "work_id":
                work_id,

            "ai_verification":
                result

        }

    except Exception as e:

        return {

            "work_id":
                work_id,

            "ai_verification":
                None,

            "error":
                str(e)

        }


# ============================================================
# VERIFY AUTHENTICITY API
# ============================================================

@app.get(
    "/verify-authenticity/{work_id}"
)
def verify_authenticity(
    work_id: int
):

    before, after = find_evidence_files(
        work_id
    )

    if not before or not after:

        return {

            "error":
                "Before and After image not found"

        }

    before_auth = check_image_authenticity(
        before
    )

    after_auth = check_image_authenticity(
        after
    )

    return {

        "work_id":
            work_id,

        "authenticity_verification": {

            "before_image":
                before_auth,

            "after_image":
                after_auth

        }

    }


# ============================================================
# OLD FINAL VERIFICATION API
# ============================================================

@app.get(
    "/verify/{work_id}"
)
def final_verification(
    work_id: int
):

    metadata_response = verify_metadata(
        work_id
    )

    if "error" in metadata_response:

        return metadata_response

    ai_response = verify_ai(
        work_id
    )

    if "error" in ai_response:

        return ai_response

    metadata = metadata_response[
        "metadata_verification"
    ]

    ai = ai_response[
        "ai_verification"
    ]

    if (

        metadata["status"]
        == "VERIFIED"

        and

        ai["status"]
        == "SIGNIFICANT_CHANGE"

    ):

        status = "VERIFIED"

        reason = (
            "Strong visual change with valid "
            "timestamp and GPS metadata"
        )

    elif ai["status"] in [

        "SIGNIFICANT_CHANGE",

        "MODERATE_CHANGE"

    ]:

        status = "NEEDS_REVIEW"

        reason = (
            "Visual change detected but "
            "metadata verification is incomplete"
        )

    else:

        status = "REJECTED"

        reason = (
            "Insufficient evidence of meaningful "
            "work completion"
        )

    return {

        "work_id":
            work_id,

        "metadata_verification":
            metadata,

        "ai_verification":
            ai,

        "final_verification": {

            "status":
                status,

            "reason":
                reason

        }

    }


# ============================================================
# VISUAL CHANGE SCORE
# ============================================================

def visual_change_score(
    difference
):

    if difference < 0.05:

        score = (
            difference / 0.05
        ) * 20

    elif difference < 0.10:

        score = (

            20

            +

            (
                (difference - 0.05)
                /
                0.05
            )
            *
            20

        )

    elif difference < 0.15:

        score = (

            40

            +

            (
                (difference - 0.10)
                /
                0.05
            )
            *
            20

        )

    elif difference < 0.18:

        score = (

            60

            +

            (
                (difference - 0.15)
                /
                0.03
            )
            *
            10

        )

    else:

        score = 70

    return round(

        min(
            max(
                score,
                0
            ),
            70
        ),

        2

    )


# ============================================================
# COMPLETE WORK VERIFICATION
# ============================================================

@app.post(
    "/verify-work"
)
async def verify_work(

    work_id: int = Form(...),

    work_description: str = Form(...)

):

    before, after = find_evidence_files(
        work_id
    )

    if not before or not after:

        return {

            "error":
                "Before and After image not found"

        }

    # --------------------------------------------------------
    # VISUAL COMPARISON
    # --------------------------------------------------------

    ai_result = compare_images(

        before,

        after

    )

    visual_score = visual_change_score(

        ai_result[
            "difference"
        ]

    )

    # --------------------------------------------------------
    # SAME SCENE
    # --------------------------------------------------------

    same_scene_result = check_same_scene(
        before,
        after
    )

    # --------------------------------------------------------
    # DESCRIPTION
    # --------------------------------------------------------

    similarity = check_work_description(

        work_description,

        after

    )

    if similarity >= 0.30:

        description_status = "MATCH"

    elif similarity >= 0.15:

        description_status = "PARTIAL_MATCH"

    else:

        description_status = "LOW_MATCH"

    description_score = round(

        max(
            0,
            min(
                100,
                similarity * 100
            )
        ),

        2

    )

    # --------------------------------------------------------
    # WORK SCENE RELEVANCE
    # --------------------------------------------------------
    scene_result = check_scene_relevance(
        work_description,
        after
    )

    # --------------------------------------------------------
    # METADATA
    # --------------------------------------------------------

    before_metadata = get_image_metadata(
        before
    )

    after_metadata = get_image_metadata(
        after
    )

    metadata = check_metadata(

        before_metadata,

        after_metadata

    )

    # --------------------------------------------------------
    # AUTHENTICITY
    # --------------------------------------------------------

    before_auth = check_image_authenticity(
        before
    )

    after_auth = check_image_authenticity(
        after
    )

    # --------------------------------------------------------
    # FORENSIC ANALYSIS
    # --------------------------------------------------------

    try:
        forensic_result = compare_forensics(
            before,
            after
        )
    except Exception as e:
        forensic_result = {
            "status": "FORENSIC_CHECK_FAILED",
            "error": str(e)
        }

    # --------------------------------------------------------
    # METADATA SCORE
    # --------------------------------------------------------

    metadata_score = 0

    if (

        metadata.get(
            "timestamp_order_check"
        )
        is True

    ):

        metadata_score += 50

    if (

        metadata.get(
            "gps_location_check"
        )
        is True

    ):

        metadata_score += 50

    # --------------------------------------------------------
    # FINAL SCORE
    # --------------------------------------------------------

    final_score = (

        visual_score * 0.40

        +

        metadata_score * 0.40

        +

        description_score * 0.20

    )

    final_score = round(
        final_score,
        2
    )

    # --------------------------------------------------------
    # FINAL DECISION
    # --------------------------------------------------------

    # Authenticity detection is informational only and does not
    # automatically reject evidence. The pretrained model is
    # experimental for this road-work verification domain.

    metadata_status = metadata.get(
        "status"
    )

    visual_status = ai_result.get(
        "status"
    )

    scene_status = scene_result.get(
        "status"
    )

    same_scene_status = same_scene_result.get(
        "status"
    )

    if metadata_status == "INSUFFICIENT_METADATA":
        final_status = "REJECTED"
        reason = (
            "Evidence does not contain sufficient "
            "trusted GPS and timestamp metadata"
        )

    elif scene_status == "NOT_RELEVANT":
        final_status = "REJECTED"
        reason = (
            "After image does not visually match the "
            "type of work described"
        )

    elif scene_status == "UNCERTAIN":
        final_status = "NEEDS_REVIEW"
        reason = (
            "Work scene could not be confidently matched "
            "to the description"
        )

    elif same_scene_status == "DIFFERENT_SCENE":
        final_status = "REJECTED"
        reason = (
            "Before and After images do not appear to show "
            "the same physical scene"
        )

    elif same_scene_status == "UNCERTAIN":
        final_status = "NEEDS_REVIEW"
        reason = (
            "Same-scene verification is inconclusive; "
            "manual review is required"
        )

    elif (
        metadata_status == "VERIFIED"
        and scene_status == "RELEVANT"
        and same_scene_status == "SAME_SCENE"
        and visual_status in [
            "SIGNIFICANT_CHANGE",
            "MODERATE_CHANGE"
        ]
    ):
        final_status = "VERIFIED"
        reason = (
            "Trusted metadata, relevant work scene, and "
            "meaningful visual change were detected"
        )

    elif (
        metadata_status == "VERIFIED"
        and scene_status == "RELEVANT"
        and same_scene_status == "SAME_SCENE"
        and visual_status == "LOW_CHANGE"
    ):
        final_status = "REJECTED"
        reason = (
            "Trusted metadata and relevant scene are available, "
            "but insufficient visual change was detected"
        )

    elif metadata_status == "PARTIAL_METADATA":
        if scene_status == "NOT_RELEVANT":
            final_status = "REJECTED"
            reason = (
                "Evidence does not match the described work scene"
            )
        elif same_scene_status == "DIFFERENT_SCENE":
            final_status = "REJECTED"
            reason = (
                "Before and After images do not appear to show "
                "the same physical scene"
            )
        elif same_scene_status == "UNCERTAIN":
            final_status = "NEEDS_REVIEW"
            reason = (
                "Same-scene verification is inconclusive and "
                "metadata is incomplete"
            )
        elif (
            visual_status == "SIGNIFICANT_CHANGE"
            and similarity >= 0.15
        ):
            final_status = "NEEDS_REVIEW"
            reason = (
                "Strong visual change detected, "
                "but metadata verification is incomplete"
            )
        else:
            final_status = "REJECTED"
            reason = (
                "Evidence has incomplete metadata "
                "and insufficient supporting evidence"
            )

    else:
        final_status = "NEEDS_REVIEW"
        reason = "Evidence requires manual review"

    # --------------------------------------------------------
    # RESPONSE
    # --------------------------------------------------------

    return {

        "work_id":
            work_id,

        "work_description":
            work_description,

        "metadata_verification":
            metadata,

        "ai_verification":
            ai_result,

        "description_verification": {

            "similarity":
                similarity,

            "status":
                description_status

        },

        "scene_relevance_verification": scene_result,

        "same_scene_verification": same_scene_result,

        "authenticity_verification": {

            "before_image":
                before_auth,

            "after_image":
                after_auth

        },

        "forensic_verification": forensic_result,

        "scores": {

            "visual_change_score":
                visual_score,

            "metadata_score":
                metadata_score,

            "description_score":
                description_score,

            "final_score":
                final_score

        },

        "final_verification": {

            "status":
                final_status,

            "reason":
                reason

        }

    }


# ============================================================
# CITIZEN FEEDBACK
# ============================================================

@app.post(
    "/verify-citizen-feedback"
)
async def verify_citizen_feedback(

    work_id: int = Form(...),

    feedback_id: int = Form(...),

    feedback_text: str = Form(""),

    feedback_photo: UploadFile = File(...)

):

    folder = os.path.join(

        UPLOAD_DIR,

        str(work_id)

    )

    if not os.path.exists(
        folder
    ):

        return {

            "error":
                "Work ID not found"

        }

    feedback_folder = os.path.join(

        folder,

        "citizen_feedback"

    )

    os.makedirs(

        feedback_folder,

        exist_ok=True

    )

    filename = os.path.basename(

        feedback_photo.filename
        or
        "feedback.jpg"

    )

    path = os.path.join(

        feedback_folder,

        f"feedback_{feedback_id}_{filename}"

    )

    with open(
        path,
        "wb"
    ) as f:

        shutil.copyfileobj(

            feedback_photo.file,

            f

        )

    metadata = get_image_metadata(
        path
    )

    timestamp_available = (

        metadata[
            "timestamp"
        ]
        is not None

    )

    gps_available = (

        metadata[
            "gps"
        ]
        is not None

    )

    if (

        timestamp_available
        and
        gps_available

    ):

        status = "VERIFIED"

    elif (

        timestamp_available
        or
        gps_available

    ):

        status = "PARTIAL_METADATA"

    else:

        status = "INSUFFICIENT_METADATA"

    return {

        "work_id":
            work_id,

        "feedback_id":
            feedback_id,

        "feedback_text":
            feedback_text,

        "citizen_feedback_metadata": {

            "timestamp":
                metadata[
                    "timestamp"
                ],

            "timestamp_source":
                metadata[
                    "timestamp_source"
                ],

            "gps":
                metadata[
                    "gps"
                ],

            "gps_source":
                metadata[
                    "gps_source"
                ]

        },

        "feedback_verification": {

            "timestamp_available":
                timestamp_available,

            "gps_available":
                gps_available,

            "status":
                status

        }

    }