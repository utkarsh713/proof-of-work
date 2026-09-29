
import os
import sys
import torch
from PIL import Image
from transformers import AutoImageProcessor, SiglipForImageClassification


# ============================================================
# CONFIGURATION
# ============================================================

MODEL_NAME = "prithivMLmods/deepfake-detector-model-v1"

# Folder containing test images
IMAGE_FOLDER = "authenticity_test_images"

# Threshold for flagging an image as AI-generated
FAKE_THRESHOLD = 0.50


# ============================================================
# LOAD MODEL
# ============================================================

print("\n" + "=" * 70)
print("AI AUTHENTICITY DETECTOR TEST")
print("=" * 70)

print("\nLoading model...")
print(f"Model: {MODEL_NAME}")

try:
    processor = AutoImageProcessor.from_pretrained(MODEL_NAME)
    model = SiglipForImageClassification.from_pretrained(MODEL_NAME)
    model.eval()

    print("Model loaded successfully.\n")

except Exception as e:
    print("\nERROR: Could not load model.")
    print(str(e))
    sys.exit(1)


# ============================================================
# HELPER FUNCTIONS
# ============================================================

def get_probabilities(image_path):
    """
    Run authenticity detection on one image.
    Returns real_probability and fake_probability.
    """

    image = Image.open(image_path).convert("RGB")

    inputs = processor(images=image, return_tensors="pt")

    with torch.no_grad():
        outputs = model(**inputs)

    probabilities = torch.softmax(outputs.logits, dim=-1)[0]

    # --------------------------------------------------------
    # IMPORTANT:
    # The model's label mapping can vary.
    # We inspect config instead of blindly assuming indexes.
    # --------------------------------------------------------

    id2label = model.config.id2label

    real_index = None
    fake_index = None

    for index, label in id2label.items():

        label_lower = str(label).lower()

        if "real" in label_lower:
            real_index = int(index)

        if "fake" in label_lower or "deepfake" in label_lower:
            fake_index = int(index)

    # If labels are not available, assume:
    # index 0 = fake
    # index 1 = real
    if real_index is None or fake_index is None:

        if len(probabilities) == 2:
            fake_index = 0
            real_index = 1
        else:
            raise RuntimeError(
                f"Could not determine model labels: {id2label}"
            )

    real_probability = float(probabilities[real_index])
    fake_probability = float(probabilities[fake_index])

    return real_probability, fake_probability, id2label


def predict_image(image_path):
    """
    Generate human-readable prediction.
    """

    real_probability, fake_probability, labels = get_probabilities(
        image_path
    )

    if fake_probability >= FAKE_THRESHOLD:
        status = "AI_GENERATION_SUSPECTED"
    else:
        status = "NOT_FLAGGED_AS_AI"

    return {
        "filename": os.path.basename(image_path),
        "real_probability": real_probability,
        "fake_probability": fake_probability,
        "status": status,
        "labels": labels,
    }


# ============================================================
# CHECK IMAGE FOLDER
# ============================================================

if not os.path.exists(IMAGE_FOLDER):

    print(f"ERROR: Folder not found:")
    print(f"  {IMAGE_FOLDER}")

    print("\nCreate this folder:")
    print(f"  {IMAGE_FOLDER}")

    print("\nThen put your test images inside it.")

    sys.exit(1)


supported_extensions = (
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".bmp",
)

image_files = [
    file
    for file in os.listdir(IMAGE_FOLDER)
    if file.lower().endswith(supported_extensions)
]

if not image_files:

    print(f"No images found inside '{IMAGE_FOLDER}'.")

    print("\nSupported formats:")
    print("JPG, JPEG, PNG, WEBP, BMP")

    sys.exit(1)


# ============================================================
# RUN TEST
# ============================================================

results = []

print(f"Found {len(image_files)} image(s).")
print("\nRunning detection...\n")

for filename in sorted(image_files):

    image_path = os.path.join(IMAGE_FOLDER, filename)

    try:

        result = predict_image(image_path)

        results.append(result)

        print("-" * 70)
        print(f"Image : {result['filename']}")
        print(
            f"Real  : {result['real_probability']:.4f}"
        )
        print(
            f"Fake  : {result['fake_probability']:.4f}"
        )
        print(
            f"Status: {result['status']}"
        )

    except Exception as e:

        print("-" * 70)
        print(f"Image : {filename}")
        print("ERROR :", str(e))


# ============================================================
# SUMMARY
# ============================================================

print("\n")
print("=" * 70)
print("SUMMARY")
print("=" * 70)

print(
    f"{'IMAGE':35} "
    f"{'REAL':>10} "
    f"{'FAKE':>10} "
    f"{'STATUS':>25}"
)

print("-" * 85)

for result in results:

    print(
        f"{result['filename'][:35]:35} "
        f"{result['real_probability']:>10.4f} "
        f"{result['fake_probability']:>10.4f} "
        f"{result['status']:>25}"
    )


# ============================================================
# BASIC COUNTS
# ============================================================

ai_suspected = sum(
    1
    for result in results
    if result["status"] == "AI_GENERATION_SUSPECTED"
)

not_flagged = sum(
    1
    for result in results
    if result["status"] == "NOT_FLAGGED_AS_AI"
)

print("\n" + "=" * 70)
print("COUNTS")
print("=" * 70)

print(f"Total images          : {len(results)}")
print(f"AI generation suspect : {ai_suspected}")
print(f"Not flagged as AI     : {not_flagged}")

print("\n" + "=" * 70)
print("IMPORTANT")
print("=" * 70)

print(
    "This detector is a supporting signal, not proof that an image "
    "is real or AI-generated."
)

print(
    f"Current fake threshold: {FAKE_THRESHOLD:.2f}"
)

print(
    "Run this test on KNOWN AI-generated and KNOWN real images "
    "before changing the threshold."
)

print("=" * 70)

# ============================================================
# EVALUATION METRICS
# ============================================================

# Expected labels based on filename:
# ai*.png/jpg  -> AI
# real*.png/jpg -> REAL

tp = 0  # AI correctly detected
tn = 0  # Real correctly detected
fp = 0  # Real incorrectly detected as AI
fn = 0  # AI incorrectly detected as Real

for result in results:

    filename = result["filename"].lower()

    actual_ai = filename.startswith("ai")
    predicted_ai = result["status"] == "AI_GENERATION_SUSPECTED"

    if actual_ai and predicted_ai:
        tp += 1

    elif not actual_ai and not predicted_ai:
        tn += 1

    elif not actual_ai and predicted_ai:
        fp += 1

    elif actual_ai and not predicted_ai:
        fn += 1


total = tp + tn + fp + fn

accuracy = (tp + tn) / total if total else 0

precision = (
    tp / (tp + fp)
    if (tp + fp) > 0
    else 0
)

recall = (
    tp / (tp + fn)
    if (tp + fn) > 0
    else 0
)

f1 = (
    2 * precision * recall / (precision + recall)
    if (precision + recall) > 0
    else 0
)

specificity = (
    tn / (tn + fp)
    if (tn + fp) > 0
    else 0
)

print("\n" + "=" * 70)
print("MODEL EVALUATION")
print("=" * 70)

print(f"True Positives  (AI → AI)   : {tp}")
print(f"True Negatives  (Real → Real): {tn}")
print(f"False Positives (Real → AI)  : {fp}")
print(f"False Negatives (AI → Real)  : {fn}")

print("\n" + "-" * 70)

print(f"Accuracy    : {accuracy:.2%}")
print(f"Precision   : {precision:.2%}")
print(f"Recall      : {recall:.2%}")
print(f"F1 Score    : {f1:.2%}")
print(f"Specificity : {specificity:.2%}")

print("\n" + "=" * 70)
print("CONFUSION MATRIX")
print("=" * 70)

print("""
                 Predicted
              Real       AI
Actual Real   {:>4}      {:>4}
Actual AI     {:>4}      {:>4}
""".format(tn, fp, fn, tp))

print("=" * 70)