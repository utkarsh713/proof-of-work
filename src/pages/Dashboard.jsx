import React from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const storedWorks = JSON.parse(
    localStorage.getItem("works") || "[]"
  );

  const totalWorks = storedWorks.length;

  const completedWorks = storedWorks.filter(
    (work) => work.status === "Completed"
  ).length;

  const verificationWorks = storedWorks.filter(
    (work) =>
      work.status === "Under Verification" ||
      work.status === "Pending"
  ).length;

  const reportedIssues = storedWorks.filter(
    (work) => work.status === "Issue Reported"
  ).length;

  const recentWorks = [...storedWorks]
    .reverse()
    .slice(0, 5);

  return (
    <main className="dashboard-page">

      {/* TOP HEADER */}
      <div className="dashboard-header">

        <div>
          <h1>
            Welcome back, Anchal! 👋
          </h1>

          <p>
            Let's make public works truly transparent.
          </p>
        </div>

        <div className="dashboard-actions">

          <div className="dashboard-search">
            <span>🔍</span>

            <input
              type="text"
              placeholder="Search works, locations..."
            />
          </div>

          <button className="notification-button">
            🔔
            <span>0</span>
          </button>

          <button
            className="register-work-button"
            onClick={() => navigate("/register-work")}
          >
            + Register New Work
          </button>

        </div>

      </div>


      {/* STATS */}
      <section className="dashboard-stats">

        <div className="stat-card total-card">

          <div>
            <p>Total Works</p>

            <h2>{totalWorks}</h2>

            <span>
              {totalWorks > 0
                ? `${totalWorks} work registered`
                : "No works registered"}
            </span>

            <small>This Month</small>
          </div>

          <div className="stat-icon">
            📋
          </div>

        </div>


        <div className="stat-card">

          <div>
            <p>Completed</p>

            <h2>{completedWorks}</h2>

            <span>
              {completedWorks > 0
                ? "Works completed"
                : "No completed works"}
            </span>

            <small>This Month</small>
          </div>

          <div className="stat-icon">
            ✓
          </div>

        </div>


        <div className="stat-card">

          <div>
            <p>Under Verification</p>

            <h2>{verificationWorks}</h2>

            <span>
              {verificationWorks > 0
                ? "Awaiting verification"
                : "No works awaiting verification"}
            </span>

            <small>This Month</small>
          </div>

          <div className="stat-icon">
            ⏳
          </div>

        </div>


        <div className="stat-card">

          <div>
            <p>Reported Issues</p>

            <h2>{reportedIssues}</h2>

            <span>
              {reportedIssues > 0
                ? "Issues require attention"
                : "No issues reported"}
            </span>

            <small>This Month</small>
          </div>

          <div className="stat-icon">
            !
          </div>

        </div>

      </section>


      {/* VERIFICATION JOURNEY */}
      <section className="verification-journey">

        <div className="section-kicker">
          VERIFICATION JOURNEY
        </div>

        <h2>
          Work Verification Progress
        </h2>

        <div className="journey-stats">

          <div>
            <strong>
              {totalWorks}
            </strong>

            <span>Total Works</span>
          </div>

          <div>
            <strong>
              {completedWorks}
            </strong>

            <span>Completed</span>
          </div>

          <div>
            <strong>
              {verificationWorks}
            </strong>

            <span>Under Verification</span>
          </div>

          <div>
            <strong>
              {reportedIssues}
            </strong>

            <span>Issues Found</span>
          </div>

        </div>

      </section>


      {/* RECENTLY REGISTERED */}
      <section className="recent-works-section">

        <div className="recent-section-header">

          <div>
            <span className="section-kicker">
              RECENTLY REGISTERED
            </span>

            <h2>
              Your Recent Works
            </h2>
          </div>

          <button
            className="view-all-button"
            onClick={() => navigate("/my-submissions")}
          >
            View All →
          </button>

        </div>


        {recentWorks.length === 0 ? (

          <div className="empty-dashboard">

            <div className="empty-icon">
              📋
            </div>

            <h3>
              No work registered yet
            </h3>

            <p>
              Start by registering your first public work.
            </p>

            <button
              onClick={() =>
                navigate("/register-work")
              }
            >
              + Register New Work
            </button>

          </div>

        ) : (

          <div className="recent-works-list">

            {recentWorks.map((work) => (

              <div
                className="recent-work-card"
                key={work.id}
              >

                <div className="recent-work-top">

                  <div>
                    <span className="work-category">
                      {work.category ||
                        "Public Infrastructure"}
                    </span>

                    <h3>
                      {work.title ||
                        work.workName ||
                        "Untitled Work"}
                    </h3>
                  </div>

                  <span
                    className={`work-status ${(
                      work.status || "Under Verification"
                    )
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    ⏳{" "}
                    {work.status ||
                      "Under Verification"}
                  </span>

                </div>


                <div className="recent-work-details">

                  <div className="work-detail">
                    <span>Department</span>

                    <strong>
                      🏢{" "}
                      {work.department ||
                        "Not specified"}
                    </strong>
                  </div>

                  <div className="work-detail">
                    <span>Location</span>

                    <strong>
                      📍{" "}
                      {work.location ||
                        "Not specified"}
                    </strong>
                  </div>

                  <div className="work-detail">
                    <span>Estimated Cost</span>

                    <strong>
                      💰{" "}
                      {work.cost ||
                        work.estimatedCost ||
                        "Not specified"}
                    </strong>
                  </div>

                </div>


                <div className="recent-work-footer">

                  <button
                    className="view-work-button"
                    onClick={() =>
                      navigate(
                        `/evidence/${work.id}`
                      )
                    }
                  >
                    View Work →
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

    </main>
  );
}

export default Dashboard;