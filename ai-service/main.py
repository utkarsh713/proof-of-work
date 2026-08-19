from fastapi import FastAPI, UploadFile, File, Form
import os
import shutil
import math
from datetime import datetime

from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS

from sentence_transformers import SentenceTransformer, util


# ============================================================
# FASTAPI APP
# ============================================================

app = FastAPI(
    title="Proof-of-Work AI Verification Service",
    description="AI service for verifying before and after evidence",
    version="1.0.0"
)


# ============================================================
# AI MODEL
# ============================================================

print("Loading AI model...")

image_model = SentenceTransformer("clip-ViT-B-32")

print("AI model loaded successfully!")


# ============================================================
# UPLOAD DIRECTORY
# ============================================================

UPLOAD_DIR = "uploads"

os.makedirs(
    UPLOAD_DIR,
    exist_ok=True
)


# ============================================================
# BASIC APIs
# ============================================================

@app.get("/")
def home():

    return {
        "message": "Proof-of-work AI Service is running",
        "status": "Ok"
    }


@app.get("/health")
def health():

    return {
        "status": "healthy"
    }


# ============================================================
# IMAGE METADATA
# ============================================================

def get_image_metadata(image_path):

    print("READING IMAGE:", image_path)

    image = Image.open(image_path)

    exif_data = image.getexif()

    print(
        "EXIF DATA:",
        dict(exif_data)
    )

    metadata = {
        "timestamp": None,
        "gps": None
    }

    # --------------------------------------------------------
    # Timestamp
    # --------------------------------------------------------

    for tag_id, value in exif_data.items():

        tag_name = TAGS.get(
            tag_id,
            tag_id
        )

        if tag_name in [
            "DateTimeOriginal",
            "DateTimeDigitized",
            "DateTime"
        ]:

            metadata["timestamp"] = str(value)

    # --------------------------------------------------------
    # GPS
    # --------------------------------------------------------

    gps_info = exif_data.get(34853)

    if gps_info:

        gps_data = {}

        for key, value in gps_info.items():

            gps_name = GPSTAGS.get(
                key,
                key
            )

            gps_data[gps_name] = value

        metadata["gps"] = {

            "latitude": str(
                gps_data.get("GPSLatitude")
            ),

            "latitude_ref": str(
                gps_data.get("GPSLatitudeRef")
            ),

            "longitude": str(
                gps_data.get("GPSLongitude")
            ),

            "longitude_ref": str(
                gps_data.get("GPSLongitudeRef")
            )
        }

    print(
        "RETURNING METADATA:",
        metadata
    )

    return metadata


# ============================================================
# GPS CONVERSION
# ============================================================

def convert_gps_to_decimal(gps_data):

    if not gps_data:

        return None

    try:

        lat = gps_data.get(
            "latitude"
        )

        lat_ref = gps_data.get(
            "latitude_ref"
        )

        lon = gps_data.get(
            "longitude"
        )

        lon_ref = gps_data.get(
            "longitude_ref"
        )

        if not lat or not lon:

            return None

        def convert(value):

            value = value.strip(
                "[]()"
            )

            parts = value.split(",")

            if len(parts) != 3:

                return None

            d = float(
                parts[0].strip()
            )

            m = float(
                parts[1].strip()
            )

            s = float(
                parts[2].strip()
            )

            return (
                d
                +
                (m / 60)
                +
                (s / 3600)
            )

        latitude = convert(lat)

        longitude = convert(lon)

        if latitude is None or longitude is None:

            return None

        if lat_ref == "S":

            latitude = -latitude

        if lon_ref == "W":

            longitude = -longitude

        return {

            "latitude": latitude,

            "longitude": longitude
        }

    except Exception as e:

        print(
            "GPS conversion error:",
            e
        )

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

    R = 6371000

    lat1_rad = math.radians(lat1)

    lat2_rad = math.radians(lat2)

    delta_lat = math.radians(
        lat2 - lat1
    )

    delta_lon = math.radians(
        lon2 - lon1
    )

    a = (

        math.sin(
            delta_lat / 2
        ) ** 2

        +

        math.cos(lat1_rad)
        *
        math.cos(lat2_rad)
        *
        math.sin(
            delta_lon / 2
        ) ** 2
    )

    c = 2 * math.atan2(
        math.sqrt(a),
        math.sqrt(1 - a)
    )

    return R * c


# ============================================================
# METADATA VERIFICATION
# ============================================================

def check_metadata(
    before_metadata,
    after_metadata
):

    before_timestamp = before_metadata.get(
        "timestamp"
    )

    after_timestamp = after_metadata.get(
        "timestamp"
    )

    before_gps = before_metadata.get(
        "gps"
    )

    after_gps = after_metadata.get(
        "gps"
    )

    timestamp_check = (

        before_timestamp is not None

        and

        after_timestamp is not None
    )

    gps_check = (

        before_gps is not None

        and

        after_gps is not None
    )

    timestamp_order_check = None

    gps_distance_meters = None

    gps_location_check = None

    # --------------------------------------------------------
    # Timestamp verification
    # --------------------------------------------------------

    if timestamp_check:

        try:

            before_time = datetime.strptime(
                before_timestamp,
                "%Y:%m:%d %H:%M:%S"
            )

            after_time = datetime.strptime(
                after_timestamp,
                "%Y:%m:%d %H:%M:%S"
            )

            timestamp_order_check = (
                after_time >= before_time
            )

        except Exception as e:

            print(
                "Timestamp error:",
                e
            )

            timestamp_order_check = False

    # --------------------------------------------------------
    # GPS verification
    # --------------------------------------------------------

    if gps_check:

        before_location = convert_gps_to_decimal(
            before_gps
        )

        after_location = convert_gps_to_decimal(
            after_gps
        )

        if before_location and after_location:

            gps_distance_meters = calculate_distance(

                before_location[
                    "latitude"
                ],

                before_location[
                    "longitude"
                ],

                after_location[
                    "latitude"
                ],

                after_location[
                    "longitude"
                ]
            )

            gps_location_check = (
                gps_distance_meters <= 500
            )

        else:

            gps_location_check = False

    # --------------------------------------------------------
    # Overall metadata status
    # --------------------------------------------------------

    if (

        timestamp_check

        and

        gps_check

        and

        timestamp_order_check

        and

        gps_location_check

    ):

        status = "VERIFIED"

    elif timestamp_check or gps_check:

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
            gps_distance_meters,

        "status":
            status
    }


# ============================================================
# FIND BEFORE / AFTER FILES
# ============================================================

def find_evidence_files(work_id):

    work_folder = os.path.join(
        UPLOAD_DIR,
        str(work_id)
    )

    if not os.path.exists(
        work_folder
    ):

        return None, None

    files = os.listdir(
        work_folder
    )

    print(
        "FILES FOUND:",
        files
    )

    before_file = None

    after_file = None

    for file in files:

        file_lower = file.lower()

        if "before" in file_lower:

            before_file = os.path.join(
                work_folder,
                file
            )

        elif "after" in file_lower:

            after_file = os.path.join(
                work_folder,
                file
            )

    print(
        "Before File:",
        before_file
    )

    print(
        "After File:",
        after_file
    )

    return before_file, after_file


# ============================================================
# AI IMAGE COMPARISON
# ============================================================

def compare_images(
    before_path,
    after_path
):

    print(
        "AI COMPARISON STARTED"
    )

    before_image = Image.open(
        before_path
    ).convert("RGB")

    after_image = Image.open(
        after_path
    ).convert("RGB")

    print(
        "Generating before image embedding..."
    )

    before_embedding = image_model.encode(
        before_image,
        convert_to_tensor=True
    )

    print(
        "Generating after image embedding..."
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

    difference = 1 - similarity

    # --------------------------------------------------------
    # Visual change thresholds
    # --------------------------------------------------------

    if difference >= 0.30:

        status = "SIGNIFICANT_CHANGE"

    elif difference >= 0.15:

        status = "MODERATE_CHANGE"

    else:

        status = "LOW_CHANGE"

    print(
        "Similarity:",
        similarity
    )

    print(
        "Difference:",
        difference
    )

    print(
        "Status:",
        status
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


# ============================================================
# WORK DESCRIPTION MATCHING
# ============================================================

def check_work_description(
    work_description,
    after_path
):

    after_image = Image.open(
        after_path
    ).convert("RGB")

    # --------------------------------------------------------
    # Encode image
    # --------------------------------------------------------

    image_embedding = image_model.encode(
        after_image,
        convert_to_tensor=True
    )

    # --------------------------------------------------------
    # Encode description
    # --------------------------------------------------------

    text_embedding = image_model.encode(
        work_description,
        convert_to_tensor=True
    )

    # --------------------------------------------------------
    # Similarity
    # --------------------------------------------------------

    similarity = util.cos_sim(
        image_embedding,
        text_embedding
    ).item()

    return round(
        similarity,
        4
    )


# ============================================================
# UPLOAD EVIDENCE
# ============================================================

@app.post("/upload-evidence")
async def upload_evidence(

    work_id: int = Form(...),

    before_image: UploadFile =
        File(...),

    after_image: UploadFile =
        File(...)
):

    work_folder = os.path.join(
        UPLOAD_DIR,
        str(work_id)
    )

    os.makedirs(
        work_folder,
        exist_ok=True
    )

    # --------------------------------------------------------
    # Save BEFORE
    # --------------------------------------------------------

    before_path = os.path.join(

        work_folder,

        "before_"
        +
        before_image.filename
    )

    with open(
        before_path,
        "wb"
    ) as buffer:

        shutil.copyfileobj(
            before_image.file,
            buffer
        )

    # --------------------------------------------------------
    # Save AFTER
    # --------------------------------------------------------

    after_path = os.path.join(

        work_folder,

        "after_"
        +
        after_image.filename
    )

    with open(
        after_path,
        "wb"
    ) as buffer:

        shutil.copyfileobj(
            after_image.file,
            buffer
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
# METADATA VERIFICATION API
# ============================================================

@app.get("/verify-metadata/{work_id}")
def verify_metadata(
    work_id: int
):

    work_folder = os.path.join(
        UPLOAD_DIR,
        str(work_id)
    )

    if not os.path.exists(
        work_folder
    ):

        return {
            "error":
                "Work ID not found"
        }

    before_file, after_file = \
        find_evidence_files(
            work_id
        )

    if not before_file or not after_file:

        return {
            "error":
                "Before and After image not found"
        }

    before_metadata = \
        get_image_metadata(
            before_file
        )

    after_metadata = \
        get_image_metadata(
            after_file
        )

    metadata_result = \
        check_metadata(
            before_metadata,
            after_metadata
        )

    return {

        "Work_id":
            work_id,

        "before":
            before_metadata,

        "after":
            after_metadata,

        "metadata_verification":
            metadata_result
    }


# ============================================================
# AI VERIFICATION API
# ============================================================

@app.get("/verify-ai/{work_id}")
def verify_ai(
    work_id: int
):

    work_folder = os.path.join(
        UPLOAD_DIR,
        str(work_id)
    )

    if not os.path.exists(
        work_folder
    ):

        return {
            "error":
                "Work ID not found"
        }

    before_file, after_file = \
        find_evidence_files(
            work_id
        )

    if not before_file or not after_file:

        return {
            "error":
                "Before and After image not found"
        }

    try:

        ai_result = compare_images(
            before_file,
            after_file
        )

        return {

            "work_id":
                work_id,

            "ai_verification":
                ai_result
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
# FINAL VERIFICATION API
# ============================================================

@app.get("/verify/{work_id}")
def final_verification(
    work_id: int
):

    # --------------------------------------------------------
    # Metadata
    # --------------------------------------------------------

    metadata_response = verify_metadata(
        work_id
    )

    if "error" in metadata_response:

        return metadata_response

    # --------------------------------------------------------
    # AI
    # --------------------------------------------------------

    ai_response = verify_ai(
        work_id
    )

    if "error" in ai_response:

        return ai_response

    metadata_result = \
        metadata_response[
            "metadata_verification"
        ]

    ai_result = \
        ai_response[
            "ai_verification"
        ]

    metadata_status = \
        metadata_result[
            "status"
        ]

    ai_status = \
        ai_result[
            "status"
        ]

    # --------------------------------------------------------
    # Final decision
    # --------------------------------------------------------

    if (

        metadata_status == "VERIFIED"

        and

        ai_status == "SIGNIFICANT_CHANGE"

    ):

        final_status = "VERIFIED"

    elif ai_status in [

        "SIGNIFICANT_CHANGE",

        "MODERATE_CHANGE"

    ]:

        final_status = "NEEDS_REVIEW"

    else:

        final_status = "REJECTED"

    return {

        "work_id":
            work_id,

        "metadata_verification":
            metadata_result,

        "ai_verification":
            ai_result,

        "final_verification": {

            "status":
                final_status,

            "reason": (

                "Strong visual change with valid metadata"

                if final_status == "VERIFIED"

                else

                "Visual change detected but additional verification is required"

                if final_status == "NEEDS_REVIEW"

                else

                "Insufficient evidence of meaningful work completion"
            )
        }
    }


# ============================================================
# WORK DESCRIPTION VERIFICATION
# ============================================================

@app.post("/verify-work")
async def verify_work(

    work_id: int = Form(...),

    work_description: str =
        Form(...)
):

    work_folder = os.path.join(
        UPLOAD_DIR,
        str(work_id)
    )

    if not os.path.exists(
        work_folder
    ):

        return {
            "error":
                "Work ID not found"
        }

    before_file, after_file = \
        find_evidence_files(
            work_id
        )

    if not before_file or not after_file:

        return {
            "error":
                "Before and After image not found"
        }

    # --------------------------------------------------------
    # Visual comparison
    # --------------------------------------------------------

    ai_result = compare_images(
        before_file,
        after_file
    )

    # --------------------------------------------------------
    # Description matching
    # --------------------------------------------------------

    work_similarity = \
        check_work_description(
            work_description,
            after_file
        )

    # --------------------------------------------------------
    # Score
    # --------------------------------------------------------

    visual_score = \
        ai_result[
            "difference"
        ]

    description_score = \
        work_similarity

    verification_score = (

        visual_score * 0.60

        +

        description_score * 0.40
    )

    verification_score_percent = round(
        verification_score * 100,
        2
    )

    # --------------------------------------------------------
    # Decision
    # --------------------------------------------------------

    if verification_score_percent >= 60:

        status = "LIKELY_COMPLETED"

    elif verification_score_percent >= 35:

        status = "NEEDS_REVIEW"

    else:

        status = "LOW_EVIDENCE"

    return {

        "work_id":
            work_id,

        "work_description":
            work_description,

        "visual_verification":
            ai_result,

        "work_description_similarity":
            work_similarity,

        "verification_score":
            verification_score_percent,

        "final_status":
            status
    }


# ============================================================
# COMPLETE VERIFICATION API
# ============================================================

@app.post("/verify-complete")
async def verify_complete(

    work_id: int = Form(...),

    work_description: str =
        Form(...)
):

    # ========================================================
    # FIND WORK
    # ========================================================

    work_folder = os.path.join(
        UPLOAD_DIR,
        str(work_id)
    )

    if not os.path.exists(
        work_folder
    ):

        return {
            "error":
                "Work ID not found"
        }

    # ========================================================
    # FIND BEFORE / AFTER
    # ========================================================

    before_file, after_file = \
        find_evidence_files(
            work_id
        )

    if not before_file or not after_file:

        return {
            "error":
                "Before and After image not found"
        }

    # ========================================================
    # 1. METADATA VERIFICATION
    # ========================================================

    before_metadata = \
        get_image_metadata(
            before_file
        )

    after_metadata = \
        get_image_metadata(
            after_file
        )

    metadata_result = \
        check_metadata(
            before_metadata,
            after_metadata
        )

    # ========================================================
    # 2. VISUAL AI VERIFICATION
    # ========================================================

    try:

        visual_result = compare_images(
            before_file,
            after_file
        )

    except Exception as e:

        return {

            "work_id":
                work_id,

            "error":
                "Visual AI verification failed",

            "details":
                str(e)
        }

    # ========================================================
    # 3. WORK DESCRIPTION VERIFICATION
    # ========================================================

    try:

        work_similarity = \
            check_work_description(
                work_description,
                after_file
            )

    except Exception as e:

        return {

            "work_id":
                work_id,

            "error":
                "Work description verification failed",

            "details":
                str(e)
        }

    # ========================================================
    # 4. AI SCORE
    # ========================================================

    visual_score = \
        visual_result[
            "difference"
        ]

    description_score = \
        work_similarity

    ai_score = (

        visual_score * 0.60

        +

        description_score * 0.40
    )

    ai_score_percent = round(
        ai_score * 100,
        2
    )

    # ========================================================
    # 5. METADATA SCORE
    # ========================================================

    metadata_score = 0

    if (
        metadata_result[
            "timestamp_order_check"
        ]
        is True
    ):

        metadata_score += 50

    if (
        metadata_result[
            "gps_location_check"
        ]
        is True
    ):

        metadata_score += 50

    # ========================================================
    # 6. FINAL SCORE
    # ========================================================

    final_score = (

        ai_score_percent * 0.70

        +

        metadata_score * 0.30
    )

    final_score = round(
        final_score,
        2
    )

    # ========================================================
    # 7. IMPROVED FINAL DECISION
    # ========================================================

    # --------------------------------------------------------
    # VERIFIED
    # --------------------------------------------------------

    if (

        metadata_result[
            "status"
        ] == "VERIFIED"

        and

        visual_result[
            "status"
        ] == "SIGNIFICANT_CHANGE"

        and

        work_similarity >= 0.25

    ):

        final_status = "VERIFIED"

        reason = (
            "Strong visual change, matching work "
            "description, valid GPS and timestamp evidence"
        )

    # --------------------------------------------------------
    # NEEDS REVIEW
    # --------------------------------------------------------

    elif (

        visual_result[
            "status"
        ] in [

            "SIGNIFICANT_CHANGE",

            "MODERATE_CHANGE"

        ]

        and

        work_similarity >= 0.25

    ):

        final_status = "NEEDS_REVIEW"

        reason = (
            "Visual change and work-description match "
            "detected, but GPS/timestamp evidence is incomplete"
        )

    # --------------------------------------------------------
    # REJECTED
    # --------------------------------------------------------

    else:

        final_status = "REJECTED"

        reason = (
            "Insufficient visual and semantic evidence "
            "of meaningful work completion"
        )

    # ========================================================
    # 8. RESPONSE
    # ========================================================

    return {

        "work_id":
            work_id,

        "work_description":
            work_description,

        "metadata_verification": {

            "timestamp_check":
                metadata_result[
                    "timestamp_check"
                ],

            "timestamp_order_check":
                metadata_result[
                    "timestamp_order_check"
                ],

            "gps_check":
                metadata_result[
                    "gps_check"
                ],

            "gps_location_check":
                metadata_result[
                    "gps_location_check"
                ],

            "gps_distance_meters":
                metadata_result[
                    "gps_distance_meters"
                ],

            "status":
                metadata_result[
                    "status"
                ]
        },

        "ai_verification": {

            "visual_similarity":
                visual_result[
                    "similarity"
                ],

            "visual_difference":
                visual_result[
                    "difference"
                ],

            "visual_status":
                visual_result[
                    "status"
                ],

            "work_description_similarity":
                work_similarity,

            "ai_score":
                ai_score_percent
        },

        "final_verification": {

            "metadata_score":
                metadata_score,

            "final_score":
                final_score,

            "status":
                final_status,

            "reason":
                reason
        }
    }