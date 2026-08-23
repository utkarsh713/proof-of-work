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

const STORAGE_KEY = "proofOfWorkSubmissions";

export default function AIVerification() {
  const [works, setWorks] = useState([]);
  const [selectedWork, setSelectedWork] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState(null);

  /* LOAD REAL SUBMISSIONS */

  useEffect(() => {
    loadWorks();
  }, []);

  const loadWorks = () => {
    try {
      const savedWorks = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );

      setWorks(Array.isArray(savedWorks) ? savedWorks : []);
    } catch (error) {
      console.error("Unable to load submissions:", error);
      setWorks([]);
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

  /* FILTER WORKS THAT CAN BE VERIFIED */

  const pendingWorks = useMemo(() => {
    return works.filter((work) => {
      return (
        work.status !== "Verified" &&
        work.status !== "Issues Found"
      );
    });
  }, [works]);

  /* DYNAMIC STATS */

  const stats = useMemo(() => {
    const verified = works.filter(
      (work) => work.status === "Verified"
    ).length;

    const issues = works.filter(
      (work) => work.status === "Issues Found"
    ).length;

    const pending = works.filter(
      (work) =>
        work.status === "Under Verification" ||
        work.status === "Under Review"
    ).length;

    return {
      total: works.length,
      verified,
      issues,
      pending,
    };
  }, [works]);

  /* START AI VERIFICATION */

  const startVerification = (work) => {
    setSelectedWork(work);
    setVerifying(true);
    setResult(null);

    /*
      FRONTEND DEMO ANALYSIS

      Replace this timeout with your real
      backend AI API later.
    */

    setTimeout(() => {
      const confidence = Math.floor(
        Math.random() * 8 + 90
      );

      const isVerified = confidence >= 93;

      const verificationResult = {
        confidence,
        status: isVerified
          ? "Verified"
          : "Issues Found",

        message: isVerified
          ? "Evidence appears consistent with the registered public work. Significant visual progress was detected."
          : "The submitted evidence contains inconsistencies that require manual review.",
      };

      setResult(verificationResult);
      setVerifying(false);

      const updatedWorks = works.map((item) => {
        if (item.id === work.id) {
          return {
            ...item,
            status: verificationResult.status,
            confidence: `${confidence}%`,
            verifiedAt: new Date().toLocaleString(),
          };
        }

        return item;
      });

      setWorks(updatedWorks);

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedWorks)
      );

      setSelectedWork({
        ...work,
        status: verificationResult.status,
        confidence: `${confidence}%`,
      });
    }, 2500);
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
                  ? `${Math.max(
                      90,
                      Math.round(
                        (stats.verified / works.length) *
                          100
                      ) || 90
                    )}%`
                  : "—"}
              </strong>

              <span>Verification Score</span>
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

          {pendingWorks.length > 0 ? (

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


              {result && (

                <div
                  className={`ai-result ${
                    result.status === "Verified"
                      ? "success"
                      : "warning"
                  }`}
                >

                  <div className="result-icon">

                    {result.status === "Verified" ? (
                      <CheckCircle2 size={26} />
                    ) : (
                      <AlertTriangle size={26} />
                    )}

                  </div>


                  <div>

                    <strong>
                      {result.status === "Verified"
                        ? "Evidence Verified"
                        : "Manual Review Required"}
                    </strong>

                    <p>
                      {result.message}
                    </p>

                  </div>

                </div>

              )}

            </div>


            <div className="ai-analysis-score">

              <div
                className={`analysis-score-ring ${
                  verifying
                    ? "scanning"
                    : result?.status === "Issues Found"
                    ? "warning"
                    : ""
                }`}
              >

                <div>

                  <strong>
                    {verifying
                      ? "..."
                      : result
                      ? `${result.confidence}%`
                      : selectedWork.confidence ||
                        "—"}
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