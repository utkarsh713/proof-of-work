from fastapi import FastAPI, UploadFile, File, Form
import os
import shutil
import math
from datetime import datetime

from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS, IFD

from sentence_transformers import SentenceTransformer, util


# ============================================================
# FASTAPI APP
# ============================================================

app = FastAPI(
    title="Proof-of-Work AI Verification Service",
    description="AI service for verifying before and after evidence",
    version="3.0.0"
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
        "message": "Proof-of-Work AI Service is running",
        "status": "OK"
    }


@app.get("/health")
def health():

    return {
        "status": "healthy"
    }


# ============================================================
# SAFE GPS VALUE CONVERTER
# ============================================================

def rational_to_float(value):

    """
    Converts Pillow EXIF GPS values into float.

    Handles:
    - int
    - float
    - IFDRational
    - tuple/list
    """

    try:

        if value is None:

            return None

        # Normal number

        if isinstance(
            value,
            (int, float)
        ):

            return float(value)

        # Pillow IFDRational

        if hasattr(
            value,
            "numerator"
        ) and hasattr(
            value,
            "denominator"
        ):

            if value.denominator == 0:

                return None

            return (
                float(value.numerator)
                /
                float(value.denominator)
            )

        # Tuple such as
        # (numerator, denominator)

        if isinstance(
            value,
            tuple
        ) and len(value) == 2:

            numerator = float(
                value[0]
            )

            denominator = float(
                value[1]
            )

            if denominator == 0:

                return None

            return (
                numerator
                /
                denominator
            )

        return float(value)

    except Exception as e:

        print(
            "Rational conversion error:",
            e
        )

        return None


# ============================================================
# GPS DMS -> DECIMAL
# ============================================================

def gps_to_decimal(
    values,
    reference
):

    """
    Converts GPS coordinates from:

        Degrees / Minutes / Seconds

    to:

        Decimal degrees
    """

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

        decimal = (

            degrees

            +

            (minutes / 60.0)

            +

            (seconds / 3600.0)

        )

        reference = str(
            reference
        ).upper()

        if reference in [
            "S",
            "W"
        ]:

            decimal = -decimal

        return decimal

    except Exception as e:

        print(
            "GPS decimal conversion error:",
            e
        )

        return None


# ============================================================
# IMAGE METADATA EXTRACTION
# ============================================================

def get_image_metadata(
    image_path
):

    print(
        "\n===================================="
    )

    print(
        "READING IMAGE:",
        image_path
    )

    print(
        "===================================="
    )

    metadata = {

        "timestamp": None,

        "timestamp_source": None,

        "gps": None,

        "gps_source": None

    }

    try:

        image = Image.open(
            image_path
        )

        print(
            "IMAGE FORMAT:",
            image.format
        )

        print(
            "IMAGE SIZE:",
            image.size
        )

        # ====================================================
        # READ EXIF
        # ====================================================

        exif_data = image.getexif()

        if not exif_data:

            print(
                "NO EXIF DATA FOUND"
            )

            return metadata

        print(
            "EXIF TAG COUNT:",
            len(exif_data)
        )

        # ====================================================
        # TIMESTAMP
        # ====================================================

        timestamp_tags = [

            36867,  # DateTimeOriginal

            36868,  # DateTimeDigitized

            306     # DateTime

        ]

        for tag_id in timestamp_tags:

            value = exif_data.get(
                tag_id
            )

            if value:

                tag_name = TAGS.get(
                    tag_id,
                    tag_id
                )

                metadata[
                    "timestamp"
                ] = str(value)

                metadata[
                    "timestamp_source"
                ] = str(
                    tag_name
                )

                print(
                    "TIMESTAMP FOUND:",
                    metadata[
                        "timestamp"
                    ]
                )

                print(
                    "TIMESTAMP SOURCE:",
                    metadata[
                        "timestamp_source"
                    ]
                )

                break

        # ====================================================
        # GPS
        # ====================================================

        gps_data = None

        # ----------------------------------------------------
        # Modern Pillow method
        # ----------------------------------------------------

        try:

            gps_data = exif_data.get_ifd(
                IFD.GPSInfo
            )

        except Exception as e:

            print(
                "get_ifd GPS error:",
                e
            )

        # ----------------------------------------------------
        # Fallback for older Pillow
        # ----------------------------------------------------

        if not gps_data:

            try:

                gps_data = exif_data.get(
                    34853
                )

            except Exception as e:

                print(
                    "Legacy GPS read error:",
                    e
                )

        # ----------------------------------------------------
        # Process GPS
        # ----------------------------------------------------

        if gps_data:

            readable_gps = {}

            for key, value in gps_data.items():

                gps_name = GPSTAGS.get(
                    key,
                    key
                )

                readable_gps[
                    gps_name
                ] = value

            print(
                "GPS RAW DATA:",
                readable_gps
            )

            latitude = gps_to_decimal(

                readable_gps.get(
                    "GPSLatitude"
                ),

                readable_gps.get(
                    "GPSLatitudeRef"
                )

            )

            longitude = gps_to_decimal(

                readable_gps.get(
                    "GPSLongitude"
                ),

                readable_gps.get(
                    "GPSLongitudeRef"
                )

            )

            # ------------------------------------------------
            # GPS successfully converted
            # ------------------------------------------------

            if (

                latitude is not None

                and

                longitude is not None

            ):

                metadata["gps"] = {

                    "latitude":
                        latitude,

                    "longitude":
                        longitude,

                    "latitude_ref":
                        str(
                            readable_gps.get(
                                "GPSLatitudeRef"
                            )
                        ),

                    "longitude_ref":
                        str(
                            readable_gps.get(
                                "GPSLongitudeRef"
                            )
                        )

                }

                metadata[
                    "gps_source"
                ] = "EXIF_GPS"

                print(
                    "GPS FOUND:",
                    metadata["gps"]
                )

            else:

                print(
                    "GPS TAG FOUND BUT "
                    "COULD NOT CONVERT"
                )

        else:

            print(
                "GPS NOT FOUND IN EXIF"
            )

    except Exception as e:

        print(
            "Metadata extraction error:",
            e
        )

    print(
        "FINAL METADATA:",
        metadata
    )

    return metadata


# ============================================================
# TIMESTAMP PARSER
# ============================================================

def parse_timestamp(
    timestamp
):

    if not timestamp:

        return None

    timestamp = str(
        timestamp
    ).strip()

    formats = [

        "%Y:%m:%d %H:%M:%S",

        "%Y-%m-%d %H:%M:%S",

        "%Y:%m:%d %H:%M:%S%z",

        "%Y-%m-%dT%H:%M:%S"

    ]

    for fmt in formats:

        try:

            return datetime.strptime(
                timestamp,
                fmt
            )

        except ValueError:

            continue

    print(
        "Unable to parse timestamp:",
        timestamp
    )

    return None


# ============================================================
# GPS DISTANCE - HAVERSINE
# ============================================================

def calculate_distance(
    lat1,
    lon1,
    lat2,
    lon2
):

    # Earth radius in meters

    R = 6371000

    lat1_rad = math.radians(
        lat1
    )

    lat2_rad = math.radians(
        lat2
    )

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

        math.sqrt(
            1 - a
        )

    )

    return R * c


# ============================================================
# METADATA VERIFICATION
# ============================================================

def check_metadata(
    before_metadata,
    after_metadata
):

    before_timestamp = (
        before_metadata.get(
            "timestamp"
        )
    )

    after_timestamp = (
        after_metadata.get(
            "timestamp"
        )
    )

    before_gps = (
        before_metadata.get(
            "gps"
        )
    )

    after_gps = (
        after_metadata.get(
            "gps"
        )
    )

    # ========================================================
    # TIMESTAMP
    # ========================================================

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

        if (

            before_time

            and

            after_time

        ):

            timestamp_order_check = (

                after_time
                >=
                before_time

            )

        else:

            timestamp_order_check = False

    # ========================================================
    # GPS
    # ========================================================

    gps_check = (

        before_gps is not None

        and

        after_gps is not None

    )

    gps_distance_meters = None

    gps_location_check = None

    if gps_check:

        try:

            gps_distance_meters = (
                calculate_distance(

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
            )

            gps_location_check = (

                gps_distance_meters
                <=
                500

            )

        except Exception as e:

            print(
                "GPS distance error:",
                e
            )

            gps_location_check = False

    # ========================================================
    # OVERALL STATUS
    # ========================================================

    if (

        timestamp_check

        and

        gps_check

        and

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

            (

                round(
                    gps_distance_meters,
                    2
                )

                if gps_distance_meters
                is not None

                else None

            ),

        "status":
            status

    }


# ============================================================
# FIND BEFORE / AFTER FILES
# ============================================================

def find_evidence_files(
    work_id
):

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

        if (

            "before" in file_lower

            and

            not file_lower.startswith(".")

        ):

            before_file = os.path.join(

                work_folder,

                file

            )

        elif (

            "after" in file_lower

            and

            not file_lower.startswith(".")

        ):

            after_file = os.path.join(

                work_folder,

                file

            )

    print(
        "BEFORE FILE:",
        before_file
    )

    print(
        "AFTER FILE:",
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

    # ========================================================
    # BEFORE EMBEDDING
    # ========================================================

    print(
        "Generating BEFORE image embedding..."
    )

    before_embedding = image_model.encode(

        before_image,

        convert_to_tensor=True

    )

    # ========================================================
    # AFTER EMBEDDING
    # ========================================================

    print(
        "Generating AFTER image embedding..."
    )

    after_embedding = image_model.encode(

        after_image,

        convert_to_tensor=True

    )

    # ========================================================
    # COSINE SIMILARITY
    # ========================================================

    similarity = util.cos_sim(

        before_embedding,

        after_embedding

    ).item()

    # Keep value between 0 and 1

    similarity = max(

        0.0,

        min(
            1.0,
            similarity
        )

    )

    difference = 1 - similarity

    # ========================================================
    # CHANGE CLASSIFICATION
    # ========================================================

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

    # ========================================================
    # IMAGE EMBEDDING
    # ========================================================

    image_embedding = image_model.encode(

        after_image,

        convert_to_tensor=True

    )

    # ========================================================
    # TEXT EMBEDDING
    # ========================================================

    text_embedding = image_model.encode(

        work_description,

        convert_to_tensor=True

    )

    # ========================================================
    # IMAGE-TEXT SIMILARITY
    # ========================================================

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

    before_image: UploadFile = File(...),

    after_image: UploadFile = File(...)

):

    work_folder = os.path.join(

        UPLOAD_DIR,

        str(work_id)

    )

    os.makedirs(

        work_folder,

        exist_ok=True

    )

    # ========================================================
    # BEFORE
    # ========================================================

    before_path = os.path.join(

        work_folder,

        "before_" + before_image.filename

    )

    with open(

        before_path,

        "wb"

    ) as buffer:

        shutil.copyfileobj(

            before_image.file,

            buffer

        )

    # ========================================================
    # AFTER
    # ========================================================

    after_path = os.path.join(

        work_folder,

        "after_" + after_image.filename

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

    before_file, after_file = (
        find_evidence_files(
            work_id
        )
    )

    if (

        not before_file

        or

        not after_file

    ):

        return {

            "error":
                "Before and After image not found"

        }

    before_metadata = get_image_metadata(

        before_file

    )

    after_metadata = get_image_metadata(

        after_file

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

    before_file, after_file = (
        find_evidence_files(
            work_id
        )
    )

    if (

        not before_file

        or

        not after_file

    ):

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

    # ========================================================
    # METADATA
    # ========================================================

    metadata_response = verify_metadata(

        work_id

    )

    if "error" in metadata_response:

        return metadata_response

    # ========================================================
    # AI
    # ========================================================

    ai_response = verify_ai(

        work_id

    )

    if "error" in ai_response:

        return ai_response

    metadata_result = (
        metadata_response[
            "metadata_verification"
        ]
    )

    ai_result = (
        ai_response[
            "ai_verification"
        ]
    )

    metadata_status = (
        metadata_result[
            "status"
        ]
    )

    ai_status = (
        ai_result[
            "status"
        ]
    )

    # ========================================================
    # FINAL DECISION
    # ========================================================

    if (

        metadata_status
        == "VERIFIED"

        and

        ai_status
        == "SIGNIFICANT_CHANGE"

    ):

        final_status = "VERIFIED"

        reason = (
            "Strong visual change with valid "
            "timestamp and GPS metadata"
        )

    elif ai_status in [

        "SIGNIFICANT_CHANGE",

        "MODERATE_CHANGE"

    ]:

        final_status = "NEEDS_REVIEW"

        reason = (
            "Visual change detected but "
            "metadata verification is incomplete"
        )

    else:

        final_status = "REJECTED"

        reason = (
            "Insufficient evidence of meaningful "
            "work completion"
        )

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

            "reason":
                reason

        }

    }


# ============================================================
# WORK DESCRIPTION VERIFICATION
# ============================================================

@app.post("/verify-work")
async def verify_work(

    work_id: int = Form(...),

    work_description: str = Form(...)

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

    before_file, after_file = (
        find_evidence_files(
            work_id
        )
    )

    if (

        not before_file

        or

        not after_file

    ):

        return {

            "error":
                "Before and After image not found"

        }

    # ========================================================
    # VISUAL COMPARISON
    # ========================================================

    ai_result = compare_images(

        before_file,

        after_file

    )

    # ========================================================
    # DESCRIPTION MATCHING
    # ========================================================

    work_similarity = check_work_description(

        work_description,

        after_file

    )

    # ========================================================
    # METADATA
    # ========================================================

    before_metadata = get_image_metadata(

        before_file

    )

    after_metadata = get_image_metadata(

        after_file

    )

    metadata_result = check_metadata(

        before_metadata,

        after_metadata

    )

    # ========================================================
    # DESCRIPTION STATUS
    # ========================================================

    if work_similarity >= 0.30:

        description_status = "MATCH"

    elif work_similarity >= 0.15:

        description_status = "PARTIAL_MATCH"

    else:

        description_status = "LOW_MATCH"

    # ========================================================
    # SCORE
    # ========================================================

    ai_score = (

        ai_result["difference"]
        *
        100

    )

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

    description_score = (

        max(

            0,

            min(

                100,

                work_similarity
                *
                100

            )

        )

    )

    final_score = (

        ai_score * 0.50

        +

        metadata_score * 0.30

        +

        description_score * 0.20

    )

    # ========================================================
    # FINAL DECISION
    # ========================================================

    if final_score >= 70:

        final_status = "VERIFIED"

    elif final_score >= 45:

        final_status = "NEEDS_REVIEW"

    else:

        final_status = "REJECTED"

    return {

        "work_id":
            work_id,

        "work_description":
            work_description,

        "metadata_verification":
            metadata_result,

        "ai_verification":
            ai_result,

        "description_verification": {

            "similarity":
                work_similarity,

            "status":
                description_status

        },

        "scores": {

            "ai_score":
                round(
                    ai_score,
                    2
                ),

            "metadata_score":
                metadata_score,

            "description_score":
                round(
                    description_score,
                    2
                ),

            "final_score":
                round(
                    final_score,
                    2
                )

        },

        "final_verification": {

            "status":
                final_status

        }

    }


# ============================================================
# CITIZEN FEEDBACK METADATA
# ============================================================

@app.post("/verify-citizen-feedback")
async def verify_citizen_feedback(

    work_id: int = Form(...),

    feedback_id: int = Form(...),

    feedback_text: str = Form(""),

    feedback_photo: UploadFile = File(...)

):

    """
    Citizen feedback verification.

    This endpoint ONLY verifies metadata
    from the citizen feedback photo.

    It checks:

    - Photo timestamp
    - Photo GPS
    - Availability of both

    It DOES NOT perform AI image comparison.
    """

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
    # CITIZEN FEEDBACK FOLDER
    # ========================================================

    feedback_folder = os.path.join(

        work_folder,

        "citizen_feedback"

    )

    os.makedirs(

        feedback_folder,

        exist_ok=True

    )

    # ========================================================
    # SAFE FILE NAME
    # ========================================================

    filename = os.path.basename(

        feedback_photo.filename
        or
        "feedback.jpg"

    )

    citizen_path = os.path.join(

        feedback_folder,

        f"feedback_{feedback_id}_{filename}"

    )

    # ========================================================
    # SAVE CITIZEN PHOTO
    # ========================================================

    with open(

        citizen_path,

        "wb"

    ) as buffer:

        shutil.copyfileobj(

            feedback_photo.file,

            buffer

        )

    # ========================================================
    # EXTRACT CITIZEN PHOTO METADATA
    # ========================================================

    citizen_metadata = get_image_metadata(

        citizen_path

    )

    # ========================================================
    # CHECK TIMESTAMP
    # ========================================================

    timestamp_available = (

        citizen_metadata[
            "timestamp"
        ]

        is not None

    )

    # ========================================================
    # CHECK GPS
    # ========================================================

    gps_available = (

        citizen_metadata[
            "gps"
        ]

        is not None

    )

    # ========================================================
    # FINAL STATUS
    # ========================================================

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

    # ========================================================
    # RESPONSE
    # ========================================================

    return {

        "work_id":
            work_id,

        "feedback_id":
            feedback_id,

        "feedback_text":
            feedback_text,

        "citizen_feedback_metadata": {

            "timestamp":
                citizen_metadata[
                    "timestamp"
                ],

            "timestamp_source":
                citizen_metadata[
                    "timestamp_source"
                ],

            "gps":
                citizen_metadata[
                    "gps"
                ],

            "gps_source":
                citizen_metadata[
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
