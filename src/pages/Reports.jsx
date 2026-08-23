import React, { useMemo, useState } from "react";

import {
  FiFileText,
  FiDownload,
  FiCalendar,
  FiBarChart2,
  FiCheckCircle,
  FiAlertTriangle,
  FiClock,
  FiTrendingUp,
  FiArrowUpRight,
  FiMapPin,
  FiX,
} from "react-icons/fi";

import "../index.css";

export default function Reports() {
  const [showReport, setShowReport] = useState(false);

  // GET REAL SUBMISSIONS
  const submissions = useMemo(() => {
    try {
      return JSON.parse(
        localStorage.getItem("proofOfWorkSubmissions")
      ) || [];
    } catch {
      return [];
    }
  }, [showReport]);

  // REAL COUNTS
  const totalReports = submissions.length;

  const verifiedWorks = submissions.filter(
    (item) => item.status === "Verified"
  ).length;

  const underReview = submissions.filter(
    (item) =>
      item.status === "Under Verification" ||
      item.status === "Under Review"
  ).length;

  const issuesFound = submissions.filter(
    (item) => item.status === "Issues Found"
  ).length;

  // CALCULATE TRANSPARENCY SCORE
  const transparencyScore = useMemo(() => {
    if (totalReports === 0) return 0;

    const verifiedScore =
      (verifiedWorks / totalReports) * 100;

    const issuePenalty =
      (issuesFound / totalReports) * 20;

    return Math.max(
      0,
      Math.min(
        100,
        Math.round(verifiedScore - issuePenalty + 50)
      )
    );
  }, [
    totalReports,
    verifiedWorks,
    issuesFound,
  ]);

  // REPORTS GENERATED FROM REAL DATA
  const reports = useMemo(() => {
    if (submissions.length === 0) return [];

    return [
      {
        id: "monthly",
        title: "Public Work Activity Report",
        description:
          "Live overview generated from your registered public work submissions.",
        date: new Date().toLocaleDateString(
          "en-GB",
          {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }
        ),
        type: "Activity",
        icon: <FiBarChart2 />,
        status: "Ready",
      },

      {
        id: "verification",
        title: "Verification Status Report",
        description: `${verifiedWorks} verified works and ${underReview} submissions currently under review.`,
        date: new Date().toLocaleDateString(
          "en-GB",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        ),
        type: "Verification",
        icon: <FiCheckCircle />,
        status: "Ready",
      },

      ...(issuesFound > 0
        ? [
            {
              id: "issues",
              title: "Reported Issues Report",
              description: `${issuesFound} submission${
                issuesFound > 1 ? "s" : ""
              } currently require attention.`,
              date: new Date().toLocaleDateString(
                "en-GB",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }
              ),
              type: "Issues",
              icon: <FiAlertTriangle />,
              status: "Ready",
            },
          ]
        : []),
    ];
  }, [
    submissions,
    verifiedWorks,
    underReview,
    issuesFound,
  ]);

  // DOWNLOAD REAL REPORT
  const downloadReport = (reportTitle = "Proof-of-Work Report") => {
    const reportData = {
      reportTitle,
      generatedAt: new Date().toLocaleString(),

      summary: {
        totalSubmissions: totalReports,
        verifiedWorks,
        underReview,
        issuesFound,
        transparencyScore: `${transparencyScore}%`,
      },

      submissions,
    };

    const blob = new Blob(
      [
        JSON.stringify(
          reportData,
          null,
          2
        ),
      ],
      {
        type: "application/json",
      }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = `${reportTitle
      .toLowerCase()
      .replaceAll(" ", "-")}.json`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const generateReport = () => {
    setShowReport(true);
  };

  const issuesResolved =
    totalReports === 0
      ? 0
      : Math.round(
          ((totalReports - issuesFound) /
            totalReports) *
            100
        );

  return (
    <div className="reports-page">

      {/* HERO */}

      <section className="reports-hero">

        <div>
          <p className="reports-label">
            TRANSPARENCY INTELLIGENCE
          </p>

          <h1>
            Reports &
            <span> Insights.</span>
          </h1>

          <p className="reports-description">
            Real-time insights generated from registered
            public work, verification activity and
            accountability data.
          </p>
        </div>

        <button
          className="generate-report-btn"
          onClick={generateReport}
        >
          <FiFileText />

          GENERATE REPORT

          <FiArrowUpRight />
        </button>

      </section>


      {/* REAL REPORT STATS */}

      <section className="report-stats">

        <div className="report-stat-card">

          <div className="report-stat-icon">
            <FiFileText />
          </div>

          <div>
            <span>TOTAL REPORTS</span>

            <h2>{totalReports}</h2>

            <p className="positive">
              <FiTrendingUp />
              Registered submissions
            </p>
          </div>

        </div>


        <div className="report-stat-card">

          <div className="report-stat-icon verified">
            <FiCheckCircle />
          </div>

          <div>
            <span>VERIFIED WORKS</span>

            <h2>{verifiedWorks}</h2>

            <p className="positive">
              <FiTrendingUp />
              Successfully verified
            </p>
          </div>

        </div>


        <div className="report-stat-card">

          <div className="report-stat-icon pending">
            <FiClock />
          </div>

          <div>
            <span>UNDER REVIEW</span>

            <h2>{underReview}</h2>

            <p className="neutral">
              Verification in progress
            </p>
          </div>

        </div>


        <div className="report-stat-card">

          <div className="report-stat-icon alert">
            <FiAlertTriangle />
          </div>

          <div>
            <span>REPORTED ISSUES</span>

            <h2>{issuesFound}</h2>

            <p className="negative">
              Requires attention
            </p>
          </div>

        </div>

      </section>


      {/* MAIN CONTENT */}

      <section className="reports-content">

        {/* LEFT */}

        <div className="reports-main">

          <div className="reports-section-header">

            <div>
              <p className="section-label">
                AVAILABLE DOCUMENTS
              </p>

              <h2>
                Recent Reports
              </h2>
            </div>

            <button
              className="view-all-btn"
              onClick={() => {
                document
                  .querySelector(".reports-list")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  });
              }}
            >
              VIEW ALL

              <FiArrowUpRight />
            </button>

          </div>


          {/* EMPTY STATE */}

          {reports.length === 0 ? (

            <div className="reports-empty-state">

              <div className="reports-empty-icon">
                <FiFileText />
              </div>

              <h3>
                No reports available yet
              </h3>

              <p>
                Register your first public work submission
                to generate live transparency reports.
              </p>

              <button
                onClick={() => {
                  window.location.href =
                    "/register-work";
                }}
              >
                Register Public Work
              </button>

            </div>

          ) : (

            <div className="reports-list">

              {reports.map((report) => (

                <div
                  className="report-item"
                  key={report.id}
                >

                  <div className="report-item-icon">
                    {report.icon}
                  </div>


                  <div className="report-item-content">

                    <h3>
                      {report.title}
                    </h3>

                    <p>
                      {report.description}
                    </p>


                    <div className="report-meta">

                      <span>
                        <FiCalendar />

                        {report.date}
                      </span>

                      <span className="report-type">
                        {report.type}
                      </span>

                    </div>

                  </div>


                  <div className="report-actions">

                    <span className="report-status ready">
                      {report.status}
                    </span>


                    <button
                      className="download-report-btn"
                      title="Download Report"
                      onClick={() =>
                        downloadReport(
                          report.title
                        )
                      }
                    >
                      <FiDownload />
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>


        {/* RIGHT SIDE */}

        <aside className="reports-side-panel">

          <p className="section-label">
            PLATFORM SUMMARY
          </p>

          <h2>
            Transparency Score
          </h2>


          <div className="transparency-score">

            <div
              className="score-ring"
              style={{
                background: `conic-gradient(
                  #b8f52a ${
                    transparencyScore * 3.6
                  }deg,
                  #172019 ${
                    transparencyScore * 3.6
                  }deg
                )`,
              }}
            >

              <div className="score-ring-inner">

                <strong>
                  {transparencyScore}
                </strong>

                <span>
                  / 100
                </span>

              </div>

            </div>

          </div>


          <div className="score-status">

            <FiCheckCircle />

            {transparencyScore >= 75
              ? "Excellent Transparency"
              : transparencyScore >= 50
              ? "Moderate Transparency"
              : "Building Transparency"}

          </div>


          <div className="score-details">

            <div>

              <span>
                <FiMapPin />

                Projects Tracked
              </span>

              <strong>
                {totalReports}
              </strong>

            </div>


            <div>

              <span>
                <FiCheckCircle />

                Verified
              </span>

              <strong>
                {verifiedWorks}
              </strong>

            </div>


            <div>

              <span>
                <FiAlertTriangle />

                Issues Resolved
              </span>

              <strong>
                {issuesResolved}%
              </strong>

            </div>

          </div>

        </aside>

      </section>


      {/* GENERATE REPORT MODAL */}

      {showReport && (

        <div className="report-modal-overlay">

          <div className="report-modal">

            <button
              className="report-modal-close"
              onClick={() =>
                setShowReport(false)
              }
            >
              <FiX />
            </button>


            <div className="report-modal-icon">
              <FiFileText />
            </div>


            <p className="section-label">
              REPORT READY
            </p>


            <h2>
              Public Work Transparency Report
            </h2>


            <p>
              This report was generated using your real
              Proof-of-Work submission and verification
              data.
            </p>


            <div className="generated-report-details">

              <div>
                <span>
                  TOTAL WORKS
                </span>

                <strong>
                  {totalReports}
                </strong>
              </div>


              <div>
                <span>
                  VERIFIED
                </span>

                <strong className="report-ready">
                  {verifiedWorks}
                </strong>
              </div>


              <div>
                <span>
                  TRANSPARENCY SCORE
                </span>

                <strong>
                  {transparencyScore}/100
                </strong>
              </div>

            </div>


            <button
              className="download-generated-btn"
              onClick={() => {
                downloadReport(
                  "Proof-of-Work Transparency Report"
                );

                setShowReport(false);
              }}
            >
              <FiDownload />

              DOWNLOAD REPORT
            </button>

          </div>

        </div>

      )}

    </div>
  );
}