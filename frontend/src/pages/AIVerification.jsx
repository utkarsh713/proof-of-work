import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  FileImage,
  ImageIcon,
  MapPin,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

import "../index.css";
import { getWorks } from "../api/workApi";
import { getVerificationResult, triggerVerification } from "../api/verificationApi";

export default function AIVerification() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [selectedWork, setSelectedWork] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [result, setResult] = useState(null);

  /* LOAD REAL WORKS FROM BACKEND */

  useEffect(() => {
    loadWorks();
  }, []);

  const loadWorks = async () => {
    try {
      setLoading(true);
      setLoadError("");

      const backendWorks = await getWorks();

      setWorks(Array.isArray(backendWorks) ? backendWorks : []);
    } catch (error) {
      console.error("Unable to load works:", error);
      setLoadError(error?.message || "Unable to connect with backend.");
      setWorks([]);
    } finally {
      setLoading(false);
    }
  };

  /* GET EVIDENCE IMAGE */

  const getWorkImage = (work) => {
    return (
      work.afterImage ||
      work.afterPhoto ||
      work.image ||
      work.imageUrl ||
      work.evidenceImage ||
      work.photos?.[0] ||
      work.images?.[0] ||
      null
    );
  };

  const normalizeStatus = (status) =>
    String(status || "").trim().toUpperCase();

  /* FILTER WORKS THAT CAN BE VERIFIED */

  const pendingWorks = useMemo(() => {
    return works.filter((work) => {
      const status = normalizeStatus(work.status);
      return status !== "VERIFIED" && status !== "REJECTED";
    });
  }, [works]);

  /* DYNAMIC STATS (from backend-reported status only) */

  const stats = useMemo(() => {
    const verified = works.filter(
      (work) => normalizeStatus(work.status) === "VERIFIED"
    ).length;

    const issues = works.filter(
      (work) => normalizeStatus(work.status) === "REJECTED"
    ).length;

    const pending = works.filter((work) => {
      const status = normalizeStatus(work.status);
      return status === "UNDER_REVIEW" || status === "UNDER VERIFICATION" || status === "";
    }).length;

    return {
      total: works.length,
      verified,
      issues,
      pending,
    };
  }, [works]);

  /* REQUEST VERIFICATION FROM BACKEND (AI service via Spring Boot) */

  const startVerification = async (work) => {
    setSelectedWork(work);
    setVerifying(true);
    setVerifyError("");
    setResult(null);

    try {
      // Ask the backend to run/return verification. The
      // frontend does not compute a result itself.
      const backendResult = await triggerVerification(work.id);

      setResult(backendResult);

      // Refresh the work list so the card reflects the
      // backend's actual current status.
      await loadWorks();

      setSelectedWork((prev) => ({ ...prev, ...backendResult }));
    } catch (error) {
      console.error("Verification request failed:", error);
      setVerifyError(
        error?.message || "Verification could not be completed."
      );
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="ai-page">

      {/* BACKGROUND */}

      <div className="ai-grid"></div>

      <div className="ai-floating-square square-one"></div>
      <div className="ai-floating-square square-two"></div>

      {/* HEADER */}

      <section className="ai-page-header">

        <div className="ai-header-content">

          <div>

            <div className="page-label">
              <span></span>
              ARTIFICIAL INTELLIGENCE
            </div>

            <h1>
              AI <span>Verification</span>
            </h1>

            <p>
              Analyze submitted public work evidence and
              detect progress using intelligent visual analysis.
            </p>

          </div>

          <div className="ai-live-status">

            <span className="live-dot"></span>

            <Activity size={15} />

            AI SYSTEM ONLINE

          </div>

        </div>

      </section>


      <main className="ai-container">

        {/* HERO */}

        <section className="ai-hero-card">

          <div className="ai-hero-content">

            <div className="ai-spark">
              <BrainCircuit size={28} />
            </div>

            <div className="page-label">
              <span></span>
              PROOF-OF-WORK AI ENGINE
            </div>

            <h2>
              Verify reality.
              <br />

              <span>Detect progress.</span>
            </h2>

            <p>
              Our verification engine analyzes registered
              infrastructure evidence and updates the verification
              status directly in your submission records.
            </p>

          </div>


          <div className="ai-hero-visual">

            <div className="ai-orbit orbit-one"></div>

            <div className="ai-orbit orbit-two"></div>

            <div className="ai-orbit orbit-three"></div>

            <div className="ai-core">

              <BrainCircuit size={48} />

            </div>

            <div className="ai-scan-line"></div>

            <div className="ai-data-node node-one"></div>
            <div className="ai-data-node node-two"></div>
            <div className="ai-data-node node-three"></div>

          </div>

        </section>


        {/* DYNAMIC STATS */}

        <section className="ai-stats-grid">

          <div className="ai-stat-box">

            <div className="ai-stat-icon accuracy">
              <ShieldCheck size={22} />
            </div>

            <div>
              <strong>
                {works.length
                  ? `${Math.round((stats.verified / works.length) * 100)}%`
                  : "—"}
              </strong>

              <span>Verification Rate</span>
            </div>

          </div>


          <div className="ai-stat-box">

            <div className="ai-stat-icon analyzed">
              <ScanLine size={22} />
            </div>

            <div>
              <strong>{stats.total}</strong>

              <span>Works Registered</span>
            </div>

          </div>


          <div className="ai-stat-box">

            <div className="ai-stat-icon issue">
              <AlertTriangle size={22} />
            </div>

            <div>
              <strong>{stats.issues}</strong>

              <span>Issues Detected</span>
            </div>

          </div>


          <div className="ai-stat-box">

            <div className="ai-stat-icon pending">
              <Clock3 size={22} />
            </div>

            <div>
              <strong>{stats.pending}</strong>

              <span>Awaiting Analysis</span>
            </div>

          </div>

        </section>


        {/* WORK SECTION */}

        <section className="ai-work-section">

          <div className="ai-section-header">

            <div>

              <div className="page-label">
                <span></span>
                VERIFICATION QUEUE
              </div>

              <h2>
                Works Ready for Analysis
              </h2>

              <p>
                Select a registered project to start AI verification.
              </p>

            </div>


            <div className="ai-work-count">

              <FileImage size={17} />

              <strong>
                {pendingWorks.length}
              </strong>

              <span> WORKS</span>

            </div>

          </div>


          {/* REAL WORKS */}

          {loading ? (

            <div className="ai-empty-state">
              <h3>Loading works…</h3>
              <p>Connecting to the verification backend.</p>
            </div>

          ) : loadError ? (

            <div className="ai-empty-state">
              <h3>Unable to load works</h3>
              <p>{loadError}</p>
            </div>

          ) : pendingWorks.length > 0 ? (

            <div className="ai-work-grid">

              {pendingWorks.map((work) => {

                const image = getWorkImage(work);

                return (

                  <div
                    className={`ai-work-card ${
                      selectedWork?.id === work.id
                        ? "selected"
                        : ""
                    }`}
                    key={work.id}
                  >

                    <div className="ai-work-image">

                      {image ? (

                        <img
                          src={image}
                          alt={
                            work.title ||
                            work.workName ||
                            "Public work"
                          }
                        />

                      ) : (

                        <div className="ai-no-image">

                          <ImageIcon size={38} />

                          <span>
                            No evidence image
                          </span>

                        </div>

                      )}

                      <span className="ai-image-status">

                        <span></span>

                        READY

                      </span>

                    </div>


                    <div className="ai-work-info">

                      <div className="ai-work-location">

                        <MapPin size={15} />

                        <span>
                          {work.location ||
                            work.workLocation ||
                            "Location not provided"}
                        </span>

                      </div>


                      <h3>
                        {work.title ||
                          work.workName ||
                          "Untitled Public Work"}
                      </h3>


                      <p className="ai-work-id">
                        {work.id}
                      </p>


                      <div className="ai-work-status">

                        <Clock3 size={15} />

                        {work.status ||
                          "Under Verification"}

                      </div>


                      <button
                        className="ai-verify-button"
                        onClick={() =>
                          startVerification(work)
                        }
                        disabled={verifying}
                      >

                        <Sparkles size={17} />

                        <span>
                          {verifying &&
                          selectedWork?.id === work.id
                            ? "Analyzing..."
                            : "Verify with AI"}
                        </span>

                        <ArrowRight size={17} />

                      </button>

                    </div>

                  </div>

                );
              })}

            </div>

          ) : (

            <div className="ai-empty-state">

              <div className="ai-empty-icon">
                <CheckCircle2 size={38} />
              </div>

              <div className="page-label">
                <span></span>
                VERIFICATION QUEUE
              </div>

              <h3>
                No works waiting for verification
              </h3>

              <p>
                Register a public infrastructure project first.
                Your submitted work will automatically appear here.
              </p>

              <button
                onClick={() => {
                  window.location.href =
                    "/register-work";
                }}
              >
                <Zap size={17} />

                Register New Work

              </button>

            </div>

          )}

        </section>


        {/* ANALYSIS PANEL */}

        {selectedWork && (

          <section className="ai-analysis-panel">

            <div className="ai-analysis-left">

              <div className="page-label">
                <span></span>
                LIVE ANALYSIS
              </div>


              <h2>
                {selectedWork.title ||
                  selectedWork.workName}
              </h2>


              <p>
                The AI engine is analyzing the submitted
                project evidence and checking for visual
                progress and inconsistencies.
              </p>


              {verifying && (

                <div className="ai-processing">

                  <div className="processing-spinner"></div>

                  <div>

                    <strong>
                      AI Analysis in Progress
                    </strong>

                    <span>
                      Processing submitted evidence...
                    </span>

                  </div>

                </div>

              )}


              {verifyError && (
                <div className="ai-result warning">
                  <div className="result-icon">
                    <AlertTriangle size={26} />
                  </div>
                  <div>
                    <strong>Verification could not be completed</strong>
                    <p>{verifyError}</p>
                  </div>
                </div>
              )}

              {result && (

                <div
                  className={`ai-result ${
                    result.status === "VERIFIED"
                      ? "success"
                      : "warning"
                  }`}
                >

                  <div className="result-icon">

                    {result.status === "VERIFIED" ? (
                      <CheckCircle2 size={26} />
                    ) : (
                      <AlertTriangle size={26} />
                    )}

                  </div>


                  <div>

                    <strong>
                      {result.status === "VERIFIED"
                        ? "Evidence Verified"
                        : result.status === "REJECTED"
                        ? "Verification Rejected"
                        : "Under Review"}
                    </strong>

                    {/* Only render fields the backend actually sent */}
                    {result.ai?.imageQuality && (
                      <p>Image Quality: {result.ai.imageQuality}</p>
                    )}
                    {result.ai?.visualChanges && (
                      <p>Visual Changes: {result.ai.visualChanges}</p>
                    )}
                    {result.ai?.evidenceConsistency && (
                      <p>Evidence Consistency: {result.ai.evidenceConsistency}</p>
                    )}
                    {result.duplicate?.isDuplicate && (
                      <p>Duplicate detected (matched work #{result.duplicate.matchedWorkId})</p>
                    )}

                  </div>

                </div>

              )}

            </div>


            <div className="ai-analysis-score">

              <div
                className={`analysis-score-ring ${
                  verifying
                    ? "scanning"
                    : result?.status === "REJECTED"
                    ? "warning"
                    : ""
                }`}
              >

                <div>

                  <strong>
                    {verifying
                      ? "..."
                      : result?.ai?.confidence !== undefined
                      ? `${result.ai.confidence}%`
                      : "—"}
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

      </main>

    </div>
  );
}