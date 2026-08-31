import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  ChevronDown,
  FileText,
  MapPin,
  Send,
  Star,
  Upload,
  X,
} from "lucide-react";

import { getWorks } from "../api/workApi";
import { submitFeedback } from "../api/feedbackApi";
import { EndpointNotConfiguredError } from "../api/apiClient";

function CitizenFeedback() {
  const navigate = useNavigate();

  const [works, setWorks] = useState([]);
  const [loadingWorks, setLoadingWorks] = useState(true);
  const [selectedWork, setSelectedWork] = useState("");
  const [observation, setObservation] = useState("");
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [image, setImage] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [unavailable, setUnavailable] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoadingWorks(true);

        const backendWorks = await getWorks();

        setWorks(Array.isArray(backendWorks) ? backendWorks : []);

        if (backendWorks?.length > 0) {
          setSelectedWork(String(backendWorks[0].id));
        }
      } catch (err) {
        console.error("Error loading works:", err);
        setWorks([]);
      } finally {
        setLoadingWorks(false);
      }
    })();
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
      setError("");
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setUnavailable(false);

    if (!selectedWork) {
      setError("Please select a public work.");
      return;
    }

    if (!observation) {
      setError("Please select your observation.");
      return;
    }

    if (rating === 0) {
      setError("Please give a rating.");
      return;
    }

    if (!feedback.trim()) {
      setError("Please write your feedback.");
      return;
    }

    const selectedProject = works.find(
      (work) => String(work.id) === String(selectedWork)
    );

    const payload = {
      workId: selectedProject?.id,
      observation,
      rating,
      feedback: feedback.trim(),
      image,
    };

    setSubmitting(true);

    try {
      await submitFeedback(payload);

      setSuccess(true);

      setTimeout(() => {
        navigate("/dashboard");
      }, 1800);
    } catch (err) {
      console.error(err);

      if (err instanceof EndpointNotConfiguredError) {
        // Honest unavailable state — do not pretend it worked.
        setUnavailable(true);
      } else {
        setError(err?.message || "Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const selectedProject = works.find(
    (work) =>
      String(work.id) === String(selectedWork)
  );

  return (
    <div className="citizen-feedback-page">

      <header className="citizen-feedback-header">

        <button
          type="button"
          className="feedback-back-btn"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div className="feedback-brand">
          <div className="feedback-brand-icon">
            <CheckCircle2 size={22} />
          </div>

          <div>
            <strong>
              Proof-of-<span>Work</span>
            </strong>

            <small>
              CITIZEN FEEDBACK
            </small>
          </div>
        </div>

      </header>

      <main className="citizen-feedback-container">

        <section className="feedback-intro">

          <span className="feedback-eyebrow">
            CITIZEN VOICE
          </span>

          <h1>
            Share what you <span>see.</span>
          </h1>

          <p>
            Your real-world observations help verify
            whether public infrastructure work matches
            what has been officially reported.
          </p>

        </section>

        {unavailable ? (

          <div className="feedback-success">

            <div className="feedback-success-icon">
              <FileText size={45} />
            </div>

            <h2>Feedback submission isn't available yet</h2>

            <p>
              The citizen feedback backend endpoint isn't connected
              yet. Your response was not saved — please try again
              once it's set up.
            </p>

          </div>

        ) : success ? (

          <div className="feedback-success">

            <div className="feedback-success-icon">
              <CheckCircle2 size={45} />
            </div>

            <h2>
              Feedback Submitted!
            </h2>

            <p>
              Thank you for helping create more
              transparent public infrastructure.
            </p>

            <span>
              Returning to dashboard...
            </span>

          </div>

        ) : (

          <form
            className="citizen-feedback-form"
            onSubmit={handleSubmit}
          >

            {/* SELECT PROJECT */}

            <section className="feedback-section">

              <div className="feedback-section-number">
                01
              </div>

              <div className="feedback-section-content">

                <span className="feedback-label">
                  SELECT PUBLIC WORK
                </span>

                <h2>
                  Which project did you visit?
                </h2>

                {works.length === 0 ? (

                  <div className="feedback-empty-work">

                    <FileText size={25} />

                    <div>
                      <strong>
                        No projects available
                      </strong>

                      <p>
                        Register a work first before
                        submitting citizen feedback.
                      </p>
                    </div>

                  </div>

                ) : (

                  <div className="feedback-select-wrapper">

                    <FileText
                      size={19}
                      className="feedback-select-icon"
                    />

                    <select
                      value={selectedWork}
                      onChange={(event) =>
                        setSelectedWork(event.target.value)
                      }
                    >
                      {works.map((work) => (

                        <option
                          key={work.id}
                          value={work.id}
                        >
                          {work.workName ||
                            work.title ||
                            "Untitled Work"}
                        </option>

                      ))}
                    </select>

                    <ChevronDown
                      size={18}
                      className="feedback-chevron"
                    />

                  </div>

                )}

                {selectedProject && (

                  <div className="selected-work-preview">

                    <div className="selected-work-icon">
                      <MapPin size={19} />
                    </div>

                    <div>

                      <span>
                        SELECTED LOCATION
                      </span>

                      <strong>
                        {selectedProject.workLocation ||
                          selectedProject.location ||
                          "Location not available"}
                      </strong>

                    </div>

                  </div>

                )}

              </div>

            </section>

            {/* OBSERVATION */}

            <section className="feedback-section">

              <div className="feedback-section-number">
                02
              </div>

              <div className="feedback-section-content">

                <span className="feedback-label">
                  YOUR OBSERVATION
                </span>

                <h2>
                  What did you observe?
                </h2>

                <div className="observation-grid">

                  {[
                    {
                      value: "completed",
                      title: "Work looks completed",
                      text: "The work appears finished.",
                    },
                    {
                      value: "partial",
                      title: "Partially completed",
                      text: "Some work is still remaining.",
                    },
                    {
                      value: "issues",
                      title: "Issues found",
                      text: "The work has visible problems.",
                    },
                    {
                      value: "not-started",
                      title: "Work not started",
                      text: "No visible progress at the site.",
                    },
                  ].map((item) => (

                    <button
                      type="button"
                      key={item.value}
                      className={`observation-card ${
                        observation === item.value
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setObservation(item.value)
                      }
                    >

                      <span className="observation-radio" />

                      <div>

                        <strong>
                          {item.title}
                        </strong>

                        <small>
                          {item.text}
                        </small>

                      </div>

                    </button>

                  ))}

                </div>

              </div>

            </section>

            {/* RATING */}

            <section className="feedback-section">

              <div className="feedback-section-number">
                03
              </div>

              <div className="feedback-section-content">

                <span className="feedback-label">
                  RATE THE WORK
                </span>

                <h2>
                  How would you rate it?
                </h2>

                <div className="feedback-stars">

                  {[1, 2, 3, 4, 5].map((star) => (

                    <button
                      type="button"
                      key={star}
                      className={
                        star <= rating
                          ? "star active"
                          : "star"
                      }
                      onClick={() => setRating(star)}
                    >
                      <Star
                        size={34}
                        fill={
                          star <= rating
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </button>

                  ))}

                  <span className="rating-text">

                    {rating === 0 &&
                      "Select a rating"}

                    {rating === 1 &&
                      "Poor"}

                    {rating === 2 &&
                      "Below average"}

                    {rating === 3 &&
                      "Average"}

                    {rating === 4 &&
                      "Good"}

                    {rating === 5 &&
                      "Excellent"}

                  </span>

                </div>

              </div>

            </section>

            {/* FEEDBACK */}

            <section className="feedback-section">

              <div className="feedback-section-number">
                04
              </div>

              <div className="feedback-section-content">

                <span className="feedback-label">
                  YOUR FEEDBACK
                </span>

                <h2>
                  Tell us what you observed
                </h2>

                <textarea
                  value={feedback}
                  onChange={(event) =>
                    setFeedback(event.target.value)
                  }
                  placeholder="Describe the condition of the work, any issues you noticed, or anything that should be verified..."
                  rows="6"
                  maxLength="1000"
                />

                <div className="feedback-character-count">
                  {feedback.length}/1000
                </div>

              </div>

            </section>

            {/* PHOTO EVIDENCE */}

            <section className="feedback-section">

              <div className="feedback-section-number">
                05
              </div>

              <div className="feedback-section-content">

                <span className="feedback-label">
                  PHOTO EVIDENCE
                </span>

                <h2>
                  Add a real site photo
                </h2>

                {!image ? (

                  <label className="feedback-upload-box">

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />

                    <div className="feedback-upload-icon">
                      <Camera size={28} />
                    </div>

                    <strong>
                      Upload Evidence Photo
                    </strong>

                    <span>
                      JPG, PNG or WEBP
                    </span>

                    <div className="feedback-upload-action">
                      <Upload size={16} />
                      Choose Image
                    </div>

                  </label>

                ) : (

                  <div className="feedback-image-preview">

                    <img
                      src={image}
                      alt="Citizen evidence"
                    />

                    <button
                      type="button"
                      onClick={() => setImage(null)}
                    >
                      <X size={18} />
                    </button>

                  </div>

                )}

              </div>

            </section>

            {error && (

              <div className="feedback-error">
                {error}
              </div>

            )}

            <div className="feedback-submit-area">

              <p>
                Your feedback will be recorded as
                citizen-submitted evidence.
              </p>

              <button
                type="submit"
                className="feedback-submit-btn"
                disabled={works.length === 0 || submitting}
              >
                {submitting ? "Submitting..." : "Submit Feedback"}

                <Send size={18} />
              </button>

            </div>

          </form>

        )}

      </main>

    </div>
  );
}

export default CitizenFeedback;