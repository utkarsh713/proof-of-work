import { useState } from "react";

function MySubmissions() {
  const [filter, setFilter] = useState("All");

  const submissions = [
    {
      id: "PW-2026-001",
      title: "Road Reconstruction",
      location: "Sarita Vihar, Delhi",
      department: "Public Works Department",
      date: "18 Aug 2026",
      status: "Under Verification",
      statusClass: "review",
      icon: "🛣️",
    },
    {
      id: "PW-2026-002",
      title: "Park Renovation",
      location: "Sector 62, Noida",
      department: "Urban Development",
      date: "15 Aug 2026",
      status: "Verified",
      statusClass: "verified",
      icon: "🌳",
    },
    {
      id: "PW-2026-003",
      title: "Drainage System Repair",
      location: "Sector 18, Noida",
      department: "Municipal Corporation",
      date: "10 Aug 2026",
      status: "Issues Found",
      statusClass: "issues",
      icon: "🌊",
    },
    {
      id: "PW-2026-004",
      title: "Metro Station Extension",
      location: "Dwarka, Delhi",
      department: "Transport Department",
      date: "05 Aug 2026",
      status: "Verified",
      statusClass: "verified",
      icon: "🚇",
    },
  ];

  const filteredSubmissions =
    filter === "All"
      ? submissions
      : submissions.filter((item) => item.status === filter);

  return (
    <div className="submissions-page">

      {/* PAGE HEADER */}
      <div className="submissions-header">
        <div>
          <p className="page-label">MY ACTIVITY</p>

          <h1>My Submissions</h1>

          <p>
            Track and manage all public work submissions.
          </p>
        </div>

        <button
          className="new-submission-btn"
          onClick={() => {
            window.location.href = "/register-work";
          }}
        >
          <span>＋</span>
          Register New Work
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <section className="submission-summary">

        <div className="submission-summary-card">
          <div className="summary-icon">📋</div>

          <div>
            <p>Total Submissions</p>
            <h2>24</h2>
          </div>
        </div>

        <div className="submission-summary-card verified-card">
          <div className="summary-icon">✓</div>

          <div>
            <p>Verified</p>
            <h2>12</h2>
          </div>
        </div>

        <div className="submission-summary-card review-card">
          <div className="summary-icon">⏳</div>

          <div>
            <p>Under Review</p>
            <h2>8</h2>
          </div>
        </div>

        <div className="submission-summary-card issues-card">
          <div className="summary-icon">!</div>

          <div>
            <p>Issues Found</p>
            <h2>4</h2>
          </div>
        </div>

      </section>

      {/* FILTER + SEARCH */}
      <section className="submissions-controls">

        <div className="submission-tabs">

          {["All", "Verified", "Under Verification", "Issues Found"].map(
            (item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`submission-tab ${
                  filter === item ? "active" : ""
                }`}
              >
                {item}
              </button>
            )
          )}

        </div>

        <div className="submission-search">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Search submissions..."
          />
        </div>

      </section>

      {/* SUBMISSIONS LIST */}
      <section className="submissions-list">

        <div className="submissions-list-header">
          <div>
            <p className="page-label">RECENT SUBMISSIONS</p>
            <h2>Your Public Work Reports</h2>
          </div>

          <span>{filteredSubmissions.length} submissions</span>
        </div>

        <div className="submission-table">

          {filteredSubmissions.map((submission) => (

            <div
              className="submission-row"
              key={submission.id}
            >

              {/* PROJECT */}
              <div className="submission-project">

                <div className="project-icon">
                  {submission.icon}
                </div>

                <div>
                  <h3>{submission.title}</h3>

                  <p>
                    {submission.id}
                  </p>
                </div>

              </div>

              {/* LOCATION */}
              <div className="submission-detail">
                <span className="detail-label">
                  LOCATION
                </span>

                <p>📍 {submission.location}</p>
              </div>

              {/* DEPARTMENT */}
              <div className="submission-detail department-detail">
                <span className="detail-label">
                  DEPARTMENT
                </span>

                <p>{submission.department}</p>
              </div>

              {/* DATE */}
              <div className="submission-detail">
                <span className="detail-label">
                  SUBMITTED
                </span>

                <p>{submission.date}</p>
              </div>

              {/* STATUS */}
              <div className="submission-status">

                <span
                  className={`status-badge ${submission.statusClass}`}
                >
                  {submission.status}
                </span>

              </div>

              {/* ACTION */}
              <button className="submission-action">
                →
              </button>

            </div>

          ))}

        </div>

      </section>

    </div>
  );
}

export default MySubmissions;