import React, { useState } from "react";

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
} from "react-icons/fi";

import "../index.css";

export default function Reports() {
  const [showReport, setShowReport] = useState(false);
  const generateReport = () => {
    setShowReport(true);
  };
  const reports = [
    {
      title: "Monthly Transparency Report",
      description: "Overview of public works and verification activity.",
      date: "August 2026",
      type: "Monthly Report",
      icon: <FiBarChart2 />,
      status: "Ready",
    },
    {
      title: "AI Verification Report",
      description: "Detailed analysis of submitted work evidence.",
      date: "22 August 2026",
      type: "Verification",
      icon: <FiCheckCircle />,
      status: "Ready",
    },
    {
      title: "Citizen Feedback Report",
      description: "Community feedback and verification results.",
      date: "August 2026",
      type: "Community",
      icon: <FiTrendingUp />,
      status: "Processing",
    },
  ];

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
            Explore verified data, project performance and public
            accountability insights from across the platform.
          </p>
        </div>

        {/* GENERATE REPORT */}
        <button
          className="generate-report-btn"
          onClick={generateReport}
        >
          <FiFileText />
          GENERATE REPORT
          <FiArrowUpRight />
        </button>
      </section>


      {/* REPORT STATS */}
      <section className="report-stats">

        <div className="report-stat-card">
          <div className="report-stat-icon">
            <FiFileText />
          </div>

          <div>
            <span>TOTAL REPORTS</span>
            <h2>24</h2>
            <p className="positive">
              <FiTrendingUp /> +12% this month
            </p>
          </div>
        </div>


        <div className="report-stat-card">
          <div className="report-stat-icon verified">
            <FiCheckCircle />
          </div>

          <div>
            <span>VERIFIED WORKS</span>
            <h2>156</h2>
            <p className="positive">
              <FiTrendingUp /> +18.2% growth
            </p>
          </div>
        </div>


        <div className="report-stat-card">
          <div className="report-stat-icon pending">
            <FiClock />
          </div>

          <div>
            <span>UNDER REVIEW</span>
            <h2>67</h2>
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
            <h2>25</h2>
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

              <h2>Recent Reports</h2>
            </div>

            <button className="view-all-btn">
              VIEW ALL <FiArrowUpRight />
            </button>
          </div>


          <div className="reports-list">
            {reports.map((report, index) => (

              <div className="report-item" key={index}>

                <div className="report-item-icon">
                  {report.icon}
                </div>

                <div className="report-item-content">

                  <h3>{report.title}</h3>

                  <p>{report.description}</p>

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

                  <span
                    className={`report-status ${
                      report.status === "Ready"
                        ? "ready"
                        : "processing"
                    }`}
                  >
                    {report.status}
                  </span>

                  <button
                    className="download-report-btn"
                    title="Download Report"
                    onClick={() => alert(`${report.title} download started!`)}
                  >
                    <FiDownload />
                  </button>

                </div>

              </div>
            ))}
          </div>

        </div>


        {/* RIGHT SIDE */}
        <aside className="reports-side-panel">

          <p className="section-label">
            PLATFORM SUMMARY
          </p>

          <h2>Transparency Score</h2>

          <div className="transparency-score">
            <div className="score-ring">
              <div className="score-ring-inner">
                <strong>94</strong>
                <span>/ 100</span>
              </div>
            </div>
          </div>

          <div className="score-status">
            <FiCheckCircle />
            Excellent Transparency
          </div>

          <div className="score-details">

            <div>
              <span>
                <FiMapPin />
                Projects Tracked
              </span>
              <strong>248</strong>
            </div>

            <div>
              <span>
                <FiCheckCircle />
                Verified
              </span>
              <strong>156</strong>
            </div>

            <div>
              <span>
                <FiAlertTriangle />
                Issues Resolved
              </span>
              <strong>89%</strong>
            </div>

          </div>

        </aside>

      </section>


      {/* ===============================
          GENERATE REPORT MODAL
      =============================== */}

      {showReport && (
        <div className="report-modal-overlay">

          <div className="report-modal">

            <button
              className="report-modal-close"
              onClick={() => setShowReport(false)}
            >
              ×
            </button>

            <div className="report-modal-icon">
              <FiFileText />
            </div>

            <p className="section-label">
              REPORT GENERATED
            </p>

            <h2>
              Public Work Transparency Report
            </h2>

            <p>
              Your report has been successfully generated with
              project data, verification progress, evidence analysis,
              and public accountability insights.
            </p>


            <div className="generated-report-details">

              <div>
                <span>REPORT ID</span>
                <strong>POW-2026-001</strong>
              </div>

              <div>
                <span>STATUS</span>
                <strong className="report-ready">
                  ✓ READY
                </strong>
              </div>

              <div>
                <span>GENERATED</span>
                <strong>JUST NOW</strong>
              </div>

            </div>


            <button
              className="download-generated-btn"
              onClick={() => alert("Report download started!")}
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