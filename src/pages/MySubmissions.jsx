import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  Plus,
  Search,
  AlertTriangle,
  Building2,
  CalendarDays,
  ClipboardCheck,
  Filter,
  X,
} from "lucide-react";



function MySubmissions() {
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadSubmissions = () => {
      try {
        const savedSubmissions = JSON.parse(
          localStorage.getItem("proofOfWorkSubmissions") || "[]"
        );

        setSubmissions(savedSubmissions);
      } catch (error) {
        console.error("Failed to load submissions:", error);
        setSubmissions([]);
      }
    };

    loadSubmissions();

    window.addEventListener("workRegistered", loadSubmissions);

    return () => {
      window.removeEventListener(
        "workRegistered",
        loadSubmissions
      );
    };
  }, []);

  const stats = useMemo(() => {
    return {
      total: submissions.length,

      verified: submissions.filter(
        (item) => item.status === "Verified"
      ).length,

      review: submissions.filter(
        (item) =>
          item.status === "Under Verification" ||
          item.status === "Under Review"
      ).length,

      issues: submissions.filter(
        (item) => item.status === "Issues Found"
      ).length,
    };
  }, [submissions]);

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((item) => {
      const matchesFilter =
        filter === "All"
          ? true
          : item.status === filter;

      const searchText = search.toLowerCase();

      const matchesSearch =
        (item.title || item.workName || "")
          .toLowerCase()
          .includes(searchText) ||
        (item.location || item.workLocation || "")
          .toLowerCase()
          .includes(searchText) ||
        (item.department || "")
          .toLowerCase()
          .includes(searchText) ||
        (item.id || "")
          .toLowerCase()
          .includes(searchText);

      return matchesFilter && matchesSearch;
    });
  }, [submissions, filter, search]);

  const getStatusClass = (status) => {
    if (status === "Verified") return "verified";

    if (
      status === "Under Verification" ||
      status === "Under Review"
    ) {
      return "review";
    }

    if (status === "Issues Found") {
      return "issues";
    }

    return "review";
  };

  const getStatusIcon = (status) => {
    if (status === "Verified") {
      return <CheckCircle2 size={14} />;
    }

    if (status === "Issues Found") {
      return <AlertTriangle size={14} />;
    }

    return <Clock3 size={14} />;
  };

  return (
    <div className="submissions-page">

      {/* HERO */}

      <section className="submissions-header">

        <div className="header-grid-pattern"></div>

        <div className="submissions-header-content">

          <div className="header-left">

            <div className="page-label">
              <span className="label-line"></span>
              CITIZEN ACTIVITY
            </div>

            <h1>
              My <span>Submissions</span>
            </h1>

            <p>
              Track your public infrastructure reports,
              evidence submissions and verification progress.
            </p>

          </div>

          <button
            className="new-submission-btn"
            onClick={() =>
              navigate("/register-work")
            }
          >
            <Plus size={18} />
            Register New Work
          </button>

        </div>

      </section>


      <main className="submissions-container">

        {/* STATS */}

        <section className="submission-summary">

          <div className="submission-summary-card total-card">

            <div className="summary-card-top">

              <div className="summary-icon total-icon">
                <ClipboardCheck size={24} />
              </div>

              <div className="summary-mini">
                ALL WORK
              </div>

            </div>

            <div className="summary-value">
              {stats.total}
            </div>

            <div className="summary-label">
              Total Submissions
            </div>

            <p>
              Public works submitted by you
            </p>

          </div>


          <div className="submission-summary-card verified-card">

            <div className="summary-card-top">

              <div className="summary-icon verified-icon">
                <CheckCircle2 size={24} />
              </div>

              <div className="summary-mini success">
                APPROVED
              </div>

            </div>

            <div className="summary-value">
              {stats.verified}
            </div>

            <div className="summary-label">
              Verified
            </div>

            <p>
              Successfully verified projects
            </p>

          </div>


          <div className="submission-summary-card review-card">

            <div className="summary-card-top">

              <div className="summary-icon review-icon">
                <Clock3 size={24} />
              </div>

              <div className="summary-mini warning">
                PENDING
              </div>

            </div>

            <div className="summary-value">
              {stats.review}
            </div>

            <div className="summary-label">
              Under Review
            </div>

            <p>
              Waiting for verification
            </p>

          </div>


          <div className="submission-summary-card issues-card">

            <div className="summary-card-top">

              <div className="summary-icon issues-icon">
                <AlertTriangle size={24} />
              </div>

              <div className="summary-mini danger">
                ACTION
              </div>

            </div>

            <div className="summary-value">
              {stats.issues}
            </div>

            <div className="summary-label">
              Issues Found
            </div>

            <p>
              Reports requiring attention
            </p>

          </div>

        </section>


        {/* CONTROLS */}

        <section className="submissions-controls">

          <div className="controls-heading">

            <div className="control-title">
              <Filter size={15} />
              FILTER REPORTS
            </div>

            <div className="submission-tabs">

              {[
                "All",
                "Verified",
                "Under Verification",
                "Issues Found",
              ].map((item) => (

                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`submission-tab ${
                    filter === item ? "active" : ""
                  }`}
                >
                  {item}

                  <span>
                    {item === "All"
                      ? stats.total
                      : item === "Verified"
                      ? stats.verified
                      : item === "Under Verification"
                      ? stats.review
                      : stats.issues}
                  </span>

                </button>

              ))}

            </div>

          </div>


          <div className="submission-search">

            <Search size={18} />

            <input
              type="text"
              placeholder="Search projects, location..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            {search && (
              <button
                onClick={() => setSearch("")}
              >
                <X size={17} />
              </button>
            )}

          </div>

        </section>


        {/* SUBMISSIONS */}

        <section className="submissions-list">

          <div className="submissions-list-header">

            <div>

              <div className="list-label">
                WORK REPORTS
              </div>

              <h2>
                Your Public Work Evidence
              </h2>

              <p>
                Review every project you have submitted.
              </p>

            </div>

            <div className="submission-count">

              <FileText size={17} />

              <strong>
                {filteredSubmissions.length}
              </strong>

              <span>
                REPORTS
              </span>

            </div>

          </div>


          {filteredSubmissions.length > 0 ? (

            <div className="submission-table">

              <div className="submission-table-head">

                <span>PROJECT</span>
                <span>LOCATION</span>
                <span>DEPARTMENT</span>
                <span>SUBMITTED</span>
                <span>STATUS</span>
                <span></span>

              </div>


              {filteredSubmissions.map(
                (submission, index) => (

                  <div
                    className="submission-row"
                    key={submission.id}
                  >

                    {/* PROJECT */}

                    <div className="submission-project">

                      <div className="project-number">
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </div>

                      <div className="project-icon">
                        <Building2 size={21} />
                      </div>

                      <div className="project-info">

                        <h3>
                          {submission.title ||
                            submission.workName}
                        </h3>

                        <p>
                          {submission.id}
                        </p>

                      </div>

                    </div>


                    {/* LOCATION */}

                    <div className="submission-detail">

                      <span className="mobile-label">
                        LOCATION
                      </span>

                      <p>
                        <MapPin size={15} />

                        {submission.location ||
                          submission.workLocation ||
                          "Location not provided"}
                      </p>

                    </div>


                    {/* DEPARTMENT */}

                    <div className="submission-detail">

                      <span className="mobile-label">
                        DEPARTMENT
                      </span>

                      <p>
                        {submission.department ||
                          "Not specified"}
                      </p>

                    </div>


                    {/* DATE */}

                    <div className="submission-detail">

                      <span className="mobile-label">
                        SUBMITTED
                      </span>

                      <p>
                        <CalendarDays size={14} />

                        {submission.date ||
                          "Recently"}
                      </p>

                    </div>


                    {/* STATUS */}

                    <div className="submission-status">

                      <span
                        className={`status-badge ${getStatusClass(
                          submission.status
                        )}`}
                      >
                        {getStatusIcon(
                          submission.status
                        )}

                        {submission.status ||
                          "Under Verification"}

                      </span>

                    </div>


                    {/* ACTION */}

                    <button
                      className="submission-action"
                      onClick={() =>
                        navigate(
                          `/submission/${submission.id}`
                        )
                      }
                    >
                      <ArrowRight size={18} />
                    </button>

                  </div>

                )
              )}

            </div>

          ) : (

            <div className="empty-submissions">

              <div className="empty-icon">
                <FileText size={34} />
              </div>

              <div className="empty-label">
                NO REPORTS YET
              </div>

              <h3>
                No submissions found
              </h3>

              <p>
                Register your first public infrastructure
                project and upload verifiable evidence.
              </p>

              <button
                className="empty-register-btn"
                onClick={() =>
                  navigate("/register-work")
                }
              >
                <Plus size={17} />
                Register First Work
              </button>

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default MySubmissions;