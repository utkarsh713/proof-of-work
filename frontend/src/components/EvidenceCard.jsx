import { useNavigate } from "react-router-dom";
import { ImageOff } from "lucide-react";

function getWorkTitle(work) {
  return work?.title || work?.workName || "Untitled Work";
}

function normalizeStatus(status) {
  return String(status || "").trim().toLowerCase();
}

// The backend contract for the AI result shape wasn't fully specified,
// so we defensively look for a few plausible field names. If the
// backend hasn't returned an AI result yet, we show an honest
// "not verified yet" state instead of inventing a score.
function extractAiResult(work) {
  const confidence =
    work?.ai?.confidence ??
    work?.aiConfidence ??
    work?.confidence ??
    null;

  if (confidence === null || confidence === undefined) {
    return null;
  }

  return {
    confidence: Number(confidence),
    imageQuality: work?.ai?.imageQuality || work?.imageQuality || null,
    visualChanges: work?.ai?.visualChanges || work?.visualChanges || null,
    evidenceConsistency:
      work?.ai?.evidenceConsistency || work?.evidenceConsistency || null,
  };
}

export default function EvidenceCard({ registeredWork }) {
  const navigate = useNavigate();

  const status = normalizeStatus(registeredWork?.status);
  const isCompleted = status === "verified" || status === "completed";

  const aiResult = extractAiResult(registeredWork);

  return (
    <section className="evidence-section">

      <div className="section-heading">
        <div>
          <p className="page-label">EVIDENCE & AI ANALYSIS</p>
          <h2>{registeredWork ? getWorkTitle(registeredWork) : "No Work Registered"}</h2>

          <p>
            {registeredWork
              ? "Photographic evidence and AI verification result for this work."
              : "Register a public work to see its evidence here."}
          </p>
        </div>

        {registeredWork && (
          <span className={`evidence-status ${isCompleted ? "completed" : ""}`}>
            {registeredWork.status || "Under Verification"}
          </span>
        )}
      </div>

      {registeredWork && (
        <div className="evidence-grid">

          {/* BEFORE */}
          <div className="evidence-card">
            <div className="evidence-image before-image">
              {registeredWork.beforeImage ? (
                <img
                  className="real-evidence-image"
                  src={registeredWork.beforeImage}
                  alt="Before evidence"
                />
              ) : (
                <div className="empty-evidence">
                  <ImageOff size={22} />
                  No before image
                </div>
              )}

              <div className="image-overlay">
                <span className="image-label">BEFORE</span>
              </div>
            </div>

            <div className="evidence-info">
              <div className="evidence-title-row">
                <h3>Before</h3>
                {registeredWork.id && (
                  <span className="evidence-number">#{registeredWork.id}</span>
                )}
              </div>

              <p>Captured before work began.</p>
            </div>
          </div>

          {/* AFTER */}
          <div className="evidence-card">
            <div className="evidence-image after-image">
              {registeredWork.afterImage ? (
                <img
                  className="real-evidence-image"
                  src={registeredWork.afterImage}
                  alt="After evidence"
                />
              ) : (
                <div className="empty-evidence">
                  <ImageOff size={22} />
                  No after image
                </div>
              )}

              <div className="image-overlay">
                <span className="image-label">AFTER</span>
              </div>
            </div>

            <div className="evidence-info">
              <div className="evidence-title-row">
                <h3>After</h3>
                {registeredWork.id && (
                  <span className="evidence-number">#{registeredWork.id}</span>
                )}
              </div>

              <p>Captured after work completion.</p>
            </div>
          </div>

          {/* AI RESULT — only real backend data, never invented */}
          <div className="ai-result-card">

            <div className="ai-result-header">
              <div className="ai-icon">◈</div>

              <div>
                <p className="ai-label">AI ANALYSIS</p>
                <h3>Verification Result</h3>
              </div>
            </div>

            {aiResult ? (
              <>
                <div className="ai-score">
                  <div
                    className="score-circle"
                    style={{
                      background: `conic-gradient(#a8dc50 0deg ${
                        aiResult.confidence * 3.6
                      }deg, #263128 ${aiResult.confidence * 3.6}deg 360deg)`,
                    }}
                  >
                    <div className="score-inner">
                      <strong>{aiResult.confidence}%</strong>
                      <span>CONFIDENCE</span>
                    </div>
                  </div>
                </div>

                <div className="ai-analysis">
                  {aiResult.imageQuality && (
                    <p className="analysis-item">
                      <span>✓</span>Image Quality: {aiResult.imageQuality}
                    </p>
                  )}
                  {aiResult.visualChanges && (
                    <p className="analysis-item">
                      <span>✓</span>Visual Changes: {aiResult.visualChanges}
                    </p>
                  )}
                  {aiResult.evidenceConsistency && (
                    <p className="analysis-item">
                      <span>✓</span>Consistency: {aiResult.evidenceConsistency}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <p className="ai-description">
                This work hasn't been verified by the AI service yet.
                Run verification to see a real result here.
              </p>
            )}

            <button
              type="button"
              className="ai-report-button"
              onClick={() => navigate("/ai-verification")}
            >
              {aiResult ? "View Full Report" : "Run AI Verification"}
            </button>

          </div>

        </div>
      )}

    </section>
  );
}
