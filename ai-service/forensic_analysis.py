import os
import io
import hashlib
import tempfile
from PIL import Image, ImageChops, ImageEnhance


# ============================================================
# BASIC IMAGE INFORMATION
# ============================================================

def get_image_info(image_path):
    """
    Extract basic technical information from an image.
    """

    if not os.path.exists(image_path):
        return {
            "status": "ERROR",
            "error": "Image file not found"
        }

    try:
        file_size = os.path.getsize(image_path)

        with Image.open(image_path) as img:

            width, height = img.size

            # File hash
            sha256_hash = hashlib.sha256()

            with open(image_path, "rb") as f:
                for chunk in iter(lambda: f.read(8192), b""):
                    sha256_hash.update(chunk)

            return {
                "status": "SUCCESS",
                "filename": os.path.basename(image_path),
                "format": img.format,
                "mode": img.mode,
                "width": width,
                "height": height,
                "aspect_ratio": round(width / height, 3) if height else None,
                "file_size_bytes": file_size,
                "sha256": sha256_hash.hexdigest()
            }

    except Exception as e:
        return {
            "status": "ERROR",
            "error": str(e)
        }


# ============================================================
# EXIF / METADATA ANALYSIS
# ============================================================

def analyze_exif(image_path):
    """
    Analyze EXIF metadata and look for useful forensic signals.
    """

    try:
        with Image.open(image_path) as img:

            exif_data = img.getexif()

            if not exif_data:
                return {
                    "exif_present": False,
                    "metadata_status": "NO_EXIF",
                    "fields": {}
                }

            fields = {}

            for tag_id, value in exif_data.items():

                try:
                    tag_name = Image.ExifTags.TAGS.get(
                        tag_id,
                        str(tag_id)
                    )
                except Exception:
                    tag_name = str(tag_id)

                # Avoid extremely large metadata
                if isinstance(value, bytes):
                    try:
                        value = value.decode(
                            "utf-8",
                            errors="ignore"
                        )
                    except Exception:
                        value = "<binary>"

                fields[tag_name] = str(value)[:500]

            important_fields = [
                "DateTime",
                "DateTimeOriginal",
                "DateTimeDigitized",
                "Make",
                "Model",
                "Software",
                "GPSInfo",
                "Orientation"
            ]

            important_metadata = {
                key: fields[key]
                for key in important_fields
                if key in fields
            }

            return {
                "exif_present": True,
                "metadata_status": "EXIF_AVAILABLE",
                "fields": important_metadata,
                "field_count": len(fields)
            }

    except Exception as e:
        return {
            "exif_present": False,
            "metadata_status": "ERROR",
            "error": str(e)
        }


# ============================================================
# IMAGE DIMENSION / FORMAT ANALYSIS
# ============================================================

def analyze_dimensions(image_path):
    """
    Check image dimensions and technical properties.
    """

    try:
        with Image.open(image_path) as img:

            width, height = img.size

            megapixels = (width * height) / 1_000_000

            issues = []

            # Extremely small images
            if width < 300 or height < 300:
                issues.append("VERY_SMALL_IMAGE")

            # Extremely unusual aspect ratio
            ratio = width / height if height else 0

            if ratio > 5 or ratio < 0.2:
                issues.append("UNUSUAL_ASPECT_RATIO")

            return {
                "width": width,
                "height": height,
                "megapixels": round(megapixels, 2),
                "format": img.format,
                "mode": img.mode,
                "issues": issues
            }

    except Exception as e:
        return {
            "status": "ERROR",
            "error": str(e)
        }


# ============================================================
# JPEG COMPRESSION ANALYSIS
# ============================================================

def analyze_jpeg(image_path):
    """
    Inspect JPEG-specific compression information.

    This is a forensic signal, NOT proof of manipulation.
    """

    try:
        with Image.open(image_path) as img:

            if img.format != "JPEG":
                return {
                    "jpeg_analysis": False,
                    "reason": "Image is not JPEG"
                }

            quantization = getattr(img, "quantization", None)

            if not quantization:
                return {
                    "jpeg_analysis": True,
                    "quantization_available": False
                }

            tables = len(quantization)

            table_sizes = {
                str(key): len(value)
                for key, value in quantization.items()
            }

            return {
                "jpeg_analysis": True,
                "quantization_available": True,
                "quantization_tables": tables,
                "table_sizes": table_sizes
            }

    except Exception as e:
        return {
            "jpeg_analysis": False,
            "error": str(e)
        }


# ============================================================
# ERROR LEVEL ANALYSIS (ELA)
# ============================================================

def perform_ela(image_path):
    """
    Perform Error Level Analysis.

    ELA highlights regions that compress differently from
    surrounding regions.

    IMPORTANT:
    ELA is only a forensic clue. It cannot prove that an
    image was edited or AI-generated.
    """

    try:
        with Image.open(image_path) as original:

            # Convert to RGB
            original = original.convert("RGB")

            # Save temporary JPEG at controlled quality
            temp_buffer = io.BytesIO()

            original.save(
                temp_buffer,
                format="JPEG",
                quality=90
            )

            temp_buffer.seek(0)

            recompressed = Image.open(temp_buffer).convert("RGB")

            # Pixel difference
            difference = ImageChops.difference(
                original,
                recompressed
            )

            # Get difference statistics
            extrema = difference.getextrema()

            max_difference = max(
                channel_max
                for channel_min, channel_max in extrema
            )

            mean_difference = sum(
                (channel_min + channel_max) / 2
                for channel_min, channel_max in extrema
            ) / 3

            # Amplify ELA image
            scale = 10

            ela_image = ImageEnhance.Brightness(
                difference
            ).enhance(scale)

            # Save ELA image next to source image
            base, ext = os.path.splitext(image_path)

            ela_path = base + "_ELA.jpg"

            ela_image.save(
                ela_path,
                format="JPEG",
                quality=90
            )

            # Basic interpretation
            if mean_difference < 3:
                ela_status = "LOW_VARIATION"

            elif mean_difference < 10:
                ela_status = "MODERATE_VARIATION"

            else:
                ela_status = "HIGH_VARIATION"

            return {
                "status": "SUCCESS",
                "mean_difference": round(mean_difference, 3),
                "max_difference": max_difference,
                "ela_status": ela_status,
                "ela_image": ela_path
            }

    except Exception as e:
        return {
            "status": "ERROR",
            "error": str(e)
        }


# ============================================================
# FILE INTEGRITY
# ============================================================

def calculate_file_hash(image_path):
    """
    Calculate SHA-256 hash.
    """

    try:

        sha256 = hashlib.sha256()

        with open(image_path, "rb") as f:

            for chunk in iter(
                lambda: f.read(8192),
                b""
            ):
                sha256.update(chunk)

        return {
            "status": "SUCCESS",
            "algorithm": "SHA-256",
            "hash": sha256.hexdigest()
        }

    except Exception as e:

        return {
            "status": "ERROR",
            "error": str(e)
        }


# ============================================================
# COMPLETE FORENSIC ANALYSIS
# ============================================================

def analyze_image_forensics(image_path):
    """
    Run complete forensic analysis on one image.
    """

    if not os.path.exists(image_path):

        return {
            "status": "ERROR",
            "error": "Image not found"
        }

    basic_info = get_image_info(image_path)

    exif_info = analyze_exif(image_path)

    dimension_info = analyze_dimensions(image_path)

    jpeg_info = analyze_jpeg(image_path)

    ela_info = perform_ela(image_path)

    hash_info = calculate_file_hash(image_path)

    # --------------------------------------------------------
    # Risk signals
    # --------------------------------------------------------

    risk_signals = []

    if not exif_info.get("exif_present", False):
        risk_signals.append("NO_EXIF_METADATA")

    if "issues" in dimension_info:
        risk_signals.extend(
            dimension_info["issues"]
        )

    if ela_info.get("ela_status") == "HIGH_VARIATION":
        risk_signals.append("HIGH_ELA_VARIATION")

    # --------------------------------------------------------
    # Risk level
    # --------------------------------------------------------

    risk_count = len(risk_signals)

    if risk_count == 0:
        risk_level = "LOW"

    elif risk_count <= 2:
        risk_level = "MEDIUM"

    else:
        risk_level = "HIGH"

    return {
        "status": "SUCCESS",

        "image": basic_info,

        "exif": exif_info,

        "dimensions": dimension_info,

        "jpeg": jpeg_info,

        "ela": ela_info,

        "integrity": hash_info,

        "risk_signals": risk_signals,

        "risk_level": risk_level,

        "forensic_note": (
            "Forensic analysis provides evidence and risk "
            "signals only. It does not prove that an image "
            "is genuine, manipulated, or AI-generated."
        )
    }


# ============================================================
# BEFORE / AFTER FORENSIC COMPARISON
# ============================================================

def compare_forensics(before_path, after_path):
    """
    Compare forensic properties of Before and After images.
    """

    before = analyze_image_forensics(before_path)

    after = analyze_image_forensics(after_path)

    comparison = {
        "before": before,
        "after": after,
        "consistency_checks": {}
    }

    # --------------------------------------------------------
    # Format consistency
    # --------------------------------------------------------

    before_format = (
        before.get("image", {}).get("format")
    )

    after_format = (
        after.get("image", {}).get("format")
    )

    comparison["consistency_checks"][
        "format_consistent"
    ] = before_format == after_format

    # --------------------------------------------------------
    # Metadata availability
    # --------------------------------------------------------

    before_exif = (
        before.get("exif", {}).get("exif_present", False)
    )

    after_exif = (
        after.get("exif", {}).get("exif_present", False)
    )

    comparison["consistency_checks"][
        "both_have_exif"
    ] = before_exif and after_exif

    # --------------------------------------------------------
    # Camera information
    # --------------------------------------------------------

    before_fields = before.get(
        "exif", {}
    ).get("fields", {})

    after_fields = after.get(
        "exif", {}
    ).get("fields", {})

    before_camera = (
        before_fields.get("Make"),
        before_fields.get("Model")
    )

    after_camera = (
        after_fields.get("Make"),
        after_fields.get("Model")
    )

    if (
        before_camera != (None, None)
        and after_camera != (None, None)
    ):

        comparison["consistency_checks"][
            "camera_consistent"
        ] = before_camera == after_camera

    else:

        comparison["consistency_checks"][
            "camera_consistent"
        ] = None

    # --------------------------------------------------------
    # Overall forensic risk
    # --------------------------------------------------------

    before_risk = before.get(
        "risk_level",
        "UNKNOWN"
    )

    after_risk = after.get(
        "risk_level",
        "UNKNOWN"
    )

    comparison["overall"] = {
        "before_risk": before_risk,
        "after_risk": after_risk
    }

    return comparison


# ============================================================
# LOCAL TEST
# ============================================================

if __name__ == "__main__":

    print("=" * 60)
    print("IMAGE FORENSIC ANALYSIS")
    print("=" * 60)

    image_path = input(
        "\nEnter image path: "
    ).strip().strip('"')

    result = analyze_image_forensics(
        image_path
    )

    import json

    print(
        json.dumps(
            result,
            indent=4,
            default=str
        )
    )