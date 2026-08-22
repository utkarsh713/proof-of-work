function EvidenceCard({ registeredWork }) {
  return (
    <section className="evidence-section">

      <div className="section-heading">
        <div>
          <p className="section-label">
            EVIDENCE ANALYSIS
          </p>

          <h2>
            Work Evidence
          </h2>

          <p>
            Compare evidence and AI verification results.
          </p>
        </div>

        <span className="verified-badge">
          ✓ Evidence Verified
        </span>
      </div>


      <div className="evidence-grid">

        {/* BEFORE */}

        <div className="evidence-card">

          <div className="evidence-image before-image">

            {registeredWork?.beforeImage ? (
              <img
                src={registeredWork.beforeImage}
                alt="Before work evidence"
                className="real-evidence-image"
              />
            ) : (
              <div className="empty-evidence">
                📷
                <span>No before image</span>
              </div>
            )}

            <div className="image-overlay">
              <span className="image-label">
                BEFORE
              </span>
            </div>

          </div>


          <div className="evidence-info">

            <div className="evidence-title-row">

              <h3>
                Before Work
              </h3>

              <span className="evidence-number">
                01
              </span>

            </div>

            <p>
              📍 {registeredWork?.workLocation || "Sector 18, Noida"}
            </p>

            <p>
              🕒 Original Evidence
            </p>

            <span className="evidence-status">
              Original Evidence
            </span>

          </div>

        </div>


        {/* AFTER */}

        <div className="evidence-card">

          <div className="evidence-image after-image">

            {registeredWork?.afterImage ? (
              <img
                src={registeredWork.afterImage}
                alt="After work evidence"
                className="real-evidence-image"
              />
            ) : (
              <div className="empty-evidence">
                📸
                <span>No after image</span>
              </div>
            )}

            <div className="image-overlay">
              <span className="image-label">
                AFTER
              </span>
            </div>

          </div>


          <div className="evidence-info">

            <div className="evidence-title-row">

              <h3>
                After Work
              </h3>

              <span className="evidence-number">
                02
              </span>

            </div>

            <p>
              📍 {registeredWork?.workLocation || "Sector 18, Noida"}
            </p>

            <p>
              🕒 Completion Evidence
            </p>

            <span className="evidence-status completed">
              Completion Evidence
            </span>

          </div>

        </div>


        {/* AI RESULT */}

        <div className="ai-result-card">

          <div className="ai-result-header">

            <div className="ai-icon">
              ✦
            </div>

            <div>

              <p className="ai-label">
                AI ANALYSIS
              </p>

              <h3>
                AI Verification
              </h3>

            </div>

          </div>


          <div className="ai-score">

            <div className="score-circle">

              <div className="score-inner">

                <strong>
                  94%
                </strong>

                <span>
                  Confidence
                </span>

              </div>

            </div>

          </div>


          <div className="ai-analysis">

            <div className="analysis-item">
              <span>✓</span>
              Image quality
            </div>

            <div className="analysis-item">
              <span>✓</span>
              Visual changes detected
            </div>

            <div className="analysis-item">
              <span>✓</span>
              Evidence appears consistent
            </div>

          </div>


          <p className="ai-description">
            Significant visual changes detected.
            Evidence appears consistent with
            completed work.
          </p>


          <div className="ai-status">
            <span>✓</span>
            Verified
          </div>


          <button
            className="ai-report-button"
            type="button"
          >
            View AI Analysis →
          </button>

        </div>

      </div>

    </section>
  );
}

export default EvidenceCard;