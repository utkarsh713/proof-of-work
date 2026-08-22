import React, { useState } from "react";
import "../index.css";

export default function AIVerification() {
  const [selectedWork, setSelectedWork] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const works = [
    {
      id: 1,
      title: "Road Development Project",
      location: "Sector 18, Noida",
      status: "Ready for AI Verification",
      confidence: "94%",
      image:
        "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      title: "Public Water Pipeline",
      location: "Greater Noida",
      status: "Ready for AI Verification",
      confidence: "91%",
      image:
        "https://images.unsplash.com/photo-1581093458791-9d42e3c3a1e8?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      title: "Community Park Renovation",
      location: "Noida Sector 62",
      status: "Verification Pending",
      confidence: "89%",
      image:
        "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const startVerification = (work) => {
    setSelectedWork(work);
    setVerifying(true);
    setVerified(false);

    setTimeout(() => {
      setVerifying(false);
      setVerified(true);
    }, 2500);
  };

  return (
    <div className="ai-page">

      {/* PAGE HEADER */}

      <div className="ai-page-header">

        <div>
          <p className="page-label">
            ARTIFICIAL INTELLIGENCE
          </p>

          <h1>
            AI Verification
          </h1>

          <p>
            Analyze public work evidence using intelligent visual verification.
          </p>
        </div>

        <div className="ai-live-status">
          <span></span>
          AI SYSTEM ONLINE
        </div>

      </div>


      {/* AI HERO */}

      <section className="ai-hero-card">

        <div className="ai-hero-content">

          <div className="ai-spark">
            ✦
          </div>

          <p className="page-label">
            PROOF-OF-WORK AI ENGINE
          </p>

          <h2>
            Verify reality.
            <br />
            <span>Detect progress.</span>
          </h2>

          <p>
            Our AI compares before and after evidence to detect
            construction progress, visual changes and possible inconsistencies.
          </p>

        </div>


        <div className="ai-hero-visual">

          <div className="ai-orbit orbit-one"></div>
          <div className="ai-orbit orbit-two"></div>

          <div className="ai-core">
            ✦
          </div>

          <div className="ai-scan-line"></div>

        </div>

      </section>


      {/* AI STATS */}

      <section className="ai-stats-grid">

        <div className="ai-stat-box">

          <div className="ai-stat-icon">
            ✓
          </div>

          <div>
            <strong>94.2%</strong>
            <span>Average Accuracy</span>
          </div>

        </div>


        <div className="ai-stat-box">

          <div className="ai-stat-icon">
            ◉
          </div>

          <div>
            <strong>67</strong>
            <span>Works Analyzed</span>
          </div>

        </div>


        <div className="ai-stat-box">

          <div className="ai-stat-icon">
            ⚠
          </div>

          <div>
            <strong>12</strong>
            <span>Issues Detected</span>
          </div>

        </div>


        <div className="ai-stat-box">

          <div className="ai-stat-icon">
            ⚡
          </div>

          <div>
            <strong>2.4s</strong>
            <span>Average Analysis</span>
          </div>

        </div>

      </section>


      {/* WORK LIST */}

      <section className="ai-work-section">

        <div className="ai-section-header">

          <div>

            <p className="page-label">
              PENDING ANALYSIS
            </p>

            <h2>
              Works Ready for Verification
            </h2>

          </div>

          <span className="ai-work-count">
            {works.length} WORKS
          </span>

        </div>


        <div className="ai-work-grid">

          {works.map((work) => (

            <div
              className={`ai-work-card ${
                selectedWork?.id === work.id ? "selected" : ""
              }`}
              key={work.id}
            >

              <div className="ai-work-image">

                <img
                  src={work.image}
                  alt={work.title}
                />

                <span className="ai-image-status">
                  AI READY
                </span>

              </div>


              <div className="ai-work-info">

                <span className="ai-work-location">
                  📍 {work.location}
                </span>

                <h3>
                  {work.title}
                </h3>

                <p>
                  {work.status}
                </p>


                <div className="ai-confidence-row">

                  <span>
                    Expected Confidence
                  </span>

                  <strong>
                    {work.confidence}
                  </strong>

                </div>


                <div className="ai-progress-bar">

                  <div
                    className="ai-progress-fill"
                    style={{
                      width: work.confidence,
                    }}
                  ></div>

                </div>


                <button
                  className="ai-verify-button"
                  onClick={() => startVerification(work)}
                >

                  <span>✦</span>

                  Verify with AI

                  <b>→</b>

                </button>

              </div>

            </div>

          ))}

        </div>

      </section>


      {/* ANALYSIS RESULT */}

      {selectedWork && (

        <section className="ai-analysis-panel">

          <div className="ai-analysis-left">

            <p className="page-label">
              LIVE ANALYSIS
            </p>

            <h2>
              {selectedWork.title}
            </h2>

            <p>
              AI is comparing submitted evidence and detecting
              visual changes between project stages.
            </p>


            {verifying && (

              <div className="ai-processing">

                <div className="processing-spinner"></div>

                <div>
                  <strong>
                    AI Analysis in Progress
                  </strong>

                  <span>
                    Comparing visual evidence...
                  </span>
                </div>

              </div>

            )}


            {verified && (

              <div className="ai-result-success">

                <div className="result-check">
                  ✓
                </div>

                <div>

                  <strong>
                    Evidence Verified
                  </strong>

                  <p>
                    Significant visual changes detected.
                    Submitted evidence appears consistent
                    with completed work.
                  </p>

                </div>

              </div>

            )}

          </div>


          <div className="ai-analysis-score">

            <div className="analysis-score-ring">

              <div>

                <strong>
                  {verifying
                    ? "..."
                    : verified
                    ? "94%"
                    : "94%"
                  }
                </strong>

                <span>
                  CONFIDENCE
                </span>

              </div>

            </div>

            <p>
              AI Confidence Score
            </p>

          </div>

        </section>

      )}

    </div>
  );
}