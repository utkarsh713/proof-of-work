import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getWorks } from "../api/workApi";
import "./Dashboard.css";

const API_BASE_URL = "http://localhost:8080";

const MENU_ITEMS = [
  { label: "Dashboard", icon: "⌂", path: "/dashboard" },
  { label: "Works", icon: "▣", path: "/works" },
  { label: "Evidence", icon: "▤", path: "/evidence" },
  { label: "Verifications", icon: "✓", path: "/verifications" },
  { label: "Citizen Reports", icon: "♧", path: "/citizen-reports" },
  { label: "Users", icon: "♙", path: "/users" },
  { label: "Notifications", icon: "♧", path: "/notifications" },
  { label: "Analytics", icon: "▥", path: "/analytics" },
  { label: "AI Insights", icon: "◉", path: "/ai-insights" },
  { label: "Settings", icon: "⚙", path: "/settings" },
  { label: "Audit Logs", icon: "▤", path: "/audit-logs" },
];

const STATUS_COLORS = {
  VERIFIED: "#32d74b",
  COMPLETED: "#32d74b",
  REGISTERED: "#a6d83f",
  PENDING: "#ff9f0a",
  UNDER_VERIFICATION: "#ff9f0a",
  UNDER_REVIEW: "#ff9f0a",
  REJECTED: "#ff453a",
  FAILED: "#ff453a",
};

function normalizeStatus(status) {
  return String(status || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");
}

function getTitle(work) {
  return (
    work?.title ||
    work?.workName ||
    work?.name ||
    "Untitled Work"
  );
}

function getLocation(work) {
  return (
    work?.location ||
    work?.workLocation ||
    "Not specified"
  );
}

function getDepartment(work) {
  return (
    work?.department ||
    work?.category ||
    "Not specified"
  );
}

function getStatus(work) {
  return normalizeStatus(
    work?.status || "UNKNOWN"
  );
}

function getLoggedInUser() {
  try {
    const rawUser = localStorage.getItem("currentUser");

    if (!rawUser) {
      return {
        name: "Admin User",
        role: "Super Admin",
      };
    }

    const user = JSON.parse(rawUser);

    return {
      name:
        user?.name?.trim() ||
        user?.fullName?.trim() ||
        "Admin User",
      role:
        user?.role === "CITIZEN"
          ? "Citizen Account"
          : user?.role === "AUTHORITY"
            ? "Authority Account"
            : "Super Admin",
    };
  } catch {
    return {
      name: "Admin User",
      role: "Super Admin",
    };
  }
}

function formatDate(value) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}


/* =========================================================
   SIDEBAR
========================================================= */

function AdminSidebar() {
  const navigate = useNavigate();
  const currentUser = getLoggedInUser();

  return (
    <aside className="pwo-sidebar">
      <div className="pwo-brand">
        <div className="pwo-brand-mark">
          <span className="pwo-brand-shield">✓</span>
        </div>

        <div className="pwo-brand-text">
          <strong>
            PRO<span>MO</span>TE
          </strong>

          <small>PUBLIC WORK VERIFICATION</small>
        </div>
      </div>

      <div className="pwo-sidebar-menu">
        {MENU_ITEMS.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={
              item.label === "Dashboard"
                ? "pwo-menu-item active"
                : "pwo-menu-item"
            }
          >
            <span className="pwo-menu-icon">
              {item.icon}
            </span>

            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="pwo-sidebar-bottom">
        <button
          type="button"
          className="pwo-register-button"
          onClick={() => navigate("/register-work")}
        >
          <span>＋</span>
          <span>Register New Work</span>
        </button>

        <div className="pwo-admin-profile">
          <div className="pwo-admin-avatar">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <strong>{currentUser.name}</strong>
            <span>{currentUser.role}</span>
          </div>
        </div>

        <button
          type="button"
          className="pwo-profile-button"
          onClick={() => navigate("/profile")}
        >
          View Profile
        </button>
      </div>
    </aside>
  );
}

/* =========================================================
   TOP HEADER
========================================================= */

function AdminHeader() {
  const navigate = useNavigate();
  const currentUser = getLoggedInUser();

  return (
    <header
      className="pwo-header"
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        minHeight: "112px",
        padding: "22px 32px",
        boxSizing: "border-box",
        gap: "28px",
      }}
    >
      {/* Page intro */}
      <div
        style={{
          minWidth: 0,
          flex: "1 1 auto",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "30px",
            lineHeight: 1.15,
            fontWeight: 700,
            color: "#f4f7fb",
          }}
        >
          Welcome, {currentUser.name}! 👋
        </h1>

        <p
          style={{
            margin: "7px 0 0",
            fontSize: "15px",
            lineHeight: 1.45,
            color: "#8fa5ba",
          }}
        >
          Here's what's happening with public work verification today.
        </p>
      </div>

      {/* Right-side tools */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: "16px",
          flexShrink: 0,
        }}
      >
        {/* Search */}
        <div
          className="pwo-search"
          style={{
            margin: 0,
          }}
        >
          <span>⌕</span>

          <input
            type="text"
            placeholder="Search works, locations..."
          />
        </div>

        {/* Notifications */}
        <button
          className="pwo-header-icon"
          type="button"
          title="Notifications"
          style={{
            position: "relative",
            right: "auto",
            top: "auto",
            transform: "none",
            margin: 0,
            flexShrink: 0,
          }}
          onClick={() => navigate("/notifications")}
        >
          ♧

          <span className="pwo-notification-badge">
            3
          </span>
        </button>
      </div>
    </header>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  title,
  value,
  subtitle,
  icon,
  type = "green",
}) {
  return (
    <article className="pwo-stat-card">
      <div className="pwo-stat-content">
        <span className="pwo-stat-title">
          {title}
        </span>

        <strong className="pwo-stat-value">
          {value}
        </strong>

        <span
          className={`pwo-stat-subtitle ${type}`}
        >
          {subtitle}
        </span>
      </div>

      <div
        className={`pwo-stat-icon ${type}`}
      >
        {icon}
      </div>

      <div className="pwo-stat-bottom-line" />
    </article>
  );
}

/* =========================================================
   LINE CHART
========================================================= */

function VerificationChart({ works }) {
  const chartData = useMemo(() => {
    const sorted = [...works]
      .sort((a, b) => {
        const dateA = new Date(
          a?.createdAt ||
            a?.registeredAt ||
            a?.created_at ||
            0
        );

        const dateB = new Date(
          b?.createdAt ||
            b?.registeredAt ||
            b?.created_at ||
            0
        );

        return dateA - dateB;
      })
      .slice(-12);

    if (!sorted.length) {
      return {
        verified: [],
        pending: [],
        rejected: [],
      };
    }

    let verified = 0;
    let pending = 0;
    let rejected = 0;

    return {
      verified: sorted.map((work) => {
        const status = getStatus(work);

        if (
          status === "VERIFIED" ||
          status === "COMPLETED"
        ) {
          verified += 1;
        }

        return verified;
      }),

      pending: sorted.map((work) => {
        const status = getStatus(work);

        if (
          status === "PENDING" ||
          status === "REGISTERED" ||
          status === "UNDER_VERIFICATION" ||
          status === "UNDER_REVIEW"
        ) {
          pending += 1;
        }

        return pending;
      }),

      rejected: sorted.map((work) => {
        const status = getStatus(work);

        if (
          status === "REJECTED" ||
          status === "FAILED"
        ) {
          rejected += 1;
        }

        return rejected;
      }),
    };
  }, [works]);

  const width = 760;
  const height = 240;
  const paddingLeft = 48;
  const paddingRight = 18;
  const paddingTop = 18;
  const paddingBottom = 35;

  const allValues = [
    ...chartData.verified,
    ...chartData.pending,
    ...chartData.rejected,
    5,
  ];

  const maxValue = Math.max(
    5,
    ...allValues
  );

  const pointCount = Math.max(
    chartData.verified.length,
    2
  );

  function createPoints(values) {
    if (!values.length) {
      return "";
    }

    return values
      .map((value, index) => {
        const x =
          paddingLeft +
          (index /
            (pointCount - 1)) *
            (width -
              paddingLeft -
              paddingRight);

        const y =
          height -
          paddingBottom -
          (value / maxValue) *
            (height -
              paddingTop -
              paddingBottom);

        return `${x},${y}`;
      })
      .join(" ");
  }

  function createArea(values) {
    if (!values.length) return "";

    const points = createPoints(values);
    const lastX =
      paddingLeft +
      ((values.length - 1) /
        (pointCount - 1)) *
        (width -
          paddingLeft -
          paddingRight);

    const bottom =
      height - paddingBottom;

    return `${points} ${lastX},${bottom} ${paddingLeft},${bottom}`;
  }

  const yLabels = [0, 1, 2, 3, 4, 5];

  return (
    <div className="pwo-line-chart">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient
            id="pwoGreenArea"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="#32d74b"
              stopOpacity="0.28"
            />

            <stop
              offset="100%"
              stopColor="#32d74b"
              stopOpacity="0"
            />
          </linearGradient>
        </defs>

        {yLabels.map((label) => {
          const y =
            height -
            paddingBottom -
            (label / maxValue) *
              (height -
                paddingTop -
                paddingBottom);

          return (
            <g key={label}>
              <line
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke="#173043"
                strokeWidth="1"
              />

              <text
                x="8"
                y={y + 4}
                fill="#718095"
                fontSize="11"
              >
                {label}
              </text>
            </g>
          );
        })}

        {chartData.verified.length > 0 && (
          <>
            <polygon
              points={createArea(
                chartData.verified
              )}
              fill="url(#pwoGreenArea)"
            />

            <polyline
              points={createPoints(
                chartData.verified
              )}
              fill="none"
              stroke="#32d74b"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        )}

        {chartData.pending.length > 0 && (
          <polyline
            points={createPoints(
              chartData.pending
            )}
            fill="none"
            stroke="#ff9f0a"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {chartData.rejected.length > 0 && (
          <polyline
            points={createPoints(
              chartData.rejected
            )}
            fill="none"
            stroke="#ff453a"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {chartData.verified.map(
          (value, index) => {
            const x =
              paddingLeft +
              (index /
                (pointCount - 1)) *
                (width -
                  paddingLeft -
                  paddingRight);

            const y =
              height -
              paddingBottom -
              (value / maxValue) *
                (height -
                  paddingTop -
                  paddingBottom);

            return (
              <circle
                key={`v-${index}`}
                cx={x}
                cy={y}
                r="3"
                fill="#32d74b"
              />
            );
          }
        )}

        <text
          x={paddingLeft}
          y={height - 10}
          fill="#718095"
          fontSize="11"
        >
          Start
        </text>

        <text
          x={width - 45}
          y={height - 10}
          fill="#718095"
          fontSize="11"
        >
          Now
        </text>
      </svg>
    </div>
  );
}

/* =========================================================
   DONUT CHART
========================================================= */

function DonutChart({
  values,
  centerValue,
  centerLabel,
}) {
  const total = values.reduce(
    (sum, item) => sum + item.value,
    0
  );

  let current = 0;

  const radius = 70;
  const circumference =
    2 * Math.PI * radius;

  return (
    <div className="pwo-donut-wrapper">
      <svg
        width="180"
        height="180"
        viewBox="0 0 180 180"
      >
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke="#162534"
          strokeWidth="25"
        />

        {total > 0 &&
          values.map((item) => {
            const percentage =
              item.value / total;

            const dash =
              percentage *
              circumference;

            const offset =
              -current *
              circumference;

            current += percentage;

            return (
              <circle
                key={item.label}
                cx="90"
                cy="90"
                r={radius}
                fill="none"
                stroke={item.color}
                strokeWidth="25"
                strokeDasharray={`${dash} ${
                  circumference - dash
                }`}
                strokeDashoffset={offset}
                transform="rotate(-90 90 90)"
              />
            );
          })}

        <text
          x="90"
          y="86"
          textAnchor="middle"
          fill="#f4f7fb"
          fontSize="24"
          fontWeight="700"
        >
          {centerValue}
        </text>

        <text
          x="90"
          y="106"
          textAnchor="middle"
          fill="#8a98a9"
          fontSize="11"
        >
          {centerLabel}
        </text>
      </svg>
    </div>
  );
}

/* =========================================================
   RECENT ACTIVITIES
========================================================= */

function RecentActivities({ works }) {
  const activities = works
    .slice(0, 5)
    .map((work) => {
      const status = getStatus(work);

      let icon = "+";
      let className = "blue";
      let text = `New work #${work?.id || "—"} registered`;

      if (
        status === "VERIFIED" ||
        status === "COMPLETED"
      ) {
        icon = "✓";
        className = "green";
        text = `Work #${work?.id || "—"} verified successfully`;
      } else if (
        status === "REJECTED" ||
        status === "FAILED"
      ) {
        icon = "×";
        className = "red";
        text = `Work #${work?.id || "—"} verification rejected`;
      } else if (
        status === "UNDER_VERIFICATION" ||
        status === "UNDER_REVIEW"
      ) {
        icon = "⌛";
        className = "orange";
        text = `Work #${work?.id || "—"} under verification`;
      }

      return {
        id: work?.id,
        icon,
        className,
        text,
        date:
          work?.createdAt ||
          work?.registeredAt ||
          work?.created_at,
      };
    });

  return (
    <div className="pwo-activities">
      {activities.length === 0 ? (
        <div className="pwo-empty-small">
          No recent activities available.
        </div>
      ) : (
        activities.map((activity) => (
          <div
            className="pwo-activity"
            key={activity.id}
          >
            <div
              className={`pwo-activity-icon ${activity.className}`}
            >
              {activity.icon}
            </div>

            <div className="pwo-activity-content">
              <strong>
                {activity.text}
              </strong>

              <span>
                {formatDate(activity.date)}
              </span>
            </div>
          </div>
        ))
      )}

      <button
        type="button"
        className="pwo-view-all"
      >
        View All
      </button>
    </div>
  );
}

/* =========================================================
   TOP CATEGORIES
========================================================= */

function TopCategories({ works }) {
  const categoryData = useMemo(() => {
    const counter = {};

    works.forEach((work) => {
      const category =
        work?.category ||
        work?.department ||
        "Others";

      counter[category] =
        (counter[category] || 0) + 1;
    });

    const sorted = Object.entries(counter)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    if (!sorted.length) {
      return [
        {
          label: "Others",
          value: 0,
          color: "#6f7d8d",
        },
      ];
    }

    const colors = [
      "#32d74b",
      "#2997ff",
      "#9b59ff",
      "#ff9f0a",
      "#6f7d8d",
    ];

    const total = works.length || 1;

    return sorted.map(
      ([label, count], index) => ({
        label,
        value: count,
        percentage: Math.round(
          (count / total) * 100
        ),
        color: colors[index],
      })
    );
  }, [works]);

  return (
    <div className="pwo-category-content">
      <DonutChart
        values={categoryData}
        centerValue={works.length}
        centerLabel="Works"
      />

      <div className="pwo-category-legend">
        {categoryData.map((item) => (
          <div
            className="pwo-category-row"
            key={item.label}
          >
            <span className="pwo-category-name">
              <i
                style={{
                  backgroundColor:
                    item.color,
                }}
              />

              {item.label}
            </span>

            <strong>
              {item.percentage || 0}%
            </strong>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   AI PIPELINE
========================================================= */

function AIPipeline() {
  const pipeline = [
    {
      title: "Image Quality Check",
      score: "91%",
      icon: "▤",
    },
    {
      title: "Change Detection",
      score: "87%",
      icon: "◫",
    },
    {
      title: "Duplicate Detection",
      score: "93%",
      icon: "◉",
    },
    {
      title: "Object Analysis",
      score: "89%",
      icon: "⌗",
    },
    {
      title: "Anomaly Detection",
      score: "90%",
      icon: "⌁",
    },
  ];

  return (
    <div className="pwo-pipeline">
      {pipeline.map((item, index) => (
        <div
          className="pwo-pipeline-item"
          key={item.title}
        >
          <div className="pwo-pipeline-box">
            <span>{item.icon}</span>
          </div>

          <strong>
            {item.title}
          </strong>

          <b>{item.score}</b>

          {index <
            pipeline.length - 1 && (
            <span className="pwo-pipeline-arrow">
              →
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

/* =========================================================
   RECENT WORKS TABLE
========================================================= */

function RecentWorks({ works }) {
  const recent = works.slice(0, 5);

  return (
    <div className="pwo-table-wrapper">
      <table className="pwo-table">
        <thead>
          <tr>
            <th>Work ID</th>
            <th>Title</th>
            <th>Location</th>
            <th>Category</th>
            <th>Status</th>
            <th>Registered On</th>
          </tr>
        </thead>

        <tbody>
          {recent.length === 0 ? (
            <tr>
              <td
                colSpan="6"
                className="pwo-table-empty"
              >
                No works found.
              </td>
            </tr>
          ) : (
            recent.map((work) => {
              const status = getStatus(work);

              return (
                <tr key={work.id}>
                  <td>
                    #{work.id ?? "—"}
                  </td>

                  <td className="pwo-title-cell">
                    {getTitle(work)}
                  </td>

                  <td>
                    {getLocation(work)}
                  </td>

                  <td>
                    {work?.category ||
                      "General"}
                  </td>

                  <td>
                    <span
                      className={`pwo-status-badge ${status.toLowerCase()}`}
                    >
                      {status
                        .replace(
                          /_/g,
                          " "
                        )
                        .toLowerCase()
                        .replace(
                          /\b\w/g,
                          (letter) =>
                            letter.toUpperCase()
                        )}
                    </span>
                  </td>

                  <td>
                    {formatDate(
                      work?.createdAt ||
                        work?.registeredAt ||
                        work?.created_at
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

/* =========================================================
   GEOGRAPHIC OVERVIEW
========================================================= */

function GeographicOverview({ works }) {
  const locations = useMemo(() => {
    const counter = {};

    works.forEach((work) => {
      const location =
        getLocation(work);

      if (
        location &&
        location !== "Not specified"
      ) {
        counter[location] =
          (counter[location] || 0) + 1;
      }
    });

    return Object.entries(counter)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [works]);

  const max =
    locations.length > 0
      ? locations[0][1]
      : 1;

  return (
    <div className="pwo-geographic-content">
      <div className="pwo-map">
        <svg
          viewBox="0 0 500 300"
          preserveAspectRatio="none"
        >
          <path
            d="M72 48 L108 38 L146 48 L170 75 L205 70 L224 91 L250 82 L275 110 L303 103 L327 129 L358 121 L380 151 L403 143 L426 171 L415 202 L389 198 L374 229 L341 220 L320 245 L286 231 L258 250 L226 231 L194 245 L170 218 L137 222 L120 192 L89 198 L76 168 L51 153 L65 123 L42 96 Z"
            fill="rgba(20, 42, 55, 0.35)"
            stroke="#1e4157"
            strokeWidth="2"
          />

          <path
            d="M96 84 L130 71 L162 82 L188 101 L213 95 L240 113 L269 106 L294 129 L325 125 L347 147 L371 143"
            fill="none"
            stroke="#193b50"
            strokeWidth="1"
          />

          <path
            d="M80 130 L113 118 L145 135 L174 128 L205 150 L232 143 L261 165 L295 155 L323 174 L354 166 L389 181"
            fill="none"
            stroke="#193b50"
            strokeWidth="1"
          />

          <path
            d="M132 56 L128 94 L142 125 L137 158 L153 190 L148 217"
            fill="none"
            stroke="#193b50"
            strokeWidth="1"
          />

          <path
            d="M215 73 L210 104 L220 139 L212 174 L229 210 L222 237"
            fill="none"
            stroke="#193b50"
            strokeWidth="1"
          />

          {[
            [125, 118],
            [210, 105],
            [287, 126],
            [351, 150],
            [171, 185],
            [264, 192],
          ].map(([cx, cy], index) => (
            <g key={index}>
              <circle
                cx={cx}
                cy={cy}
                r={index === 2 ? 13 : 8}
                fill="rgba(50,215,75,0.12)"
                stroke="#32d74b"
                strokeWidth="1"
              />

              <circle
                cx={cx}
                cy={cy}
                r="3"
                fill="#32d74b"
              />
            </g>
          ))}
        </svg>
      </div>

      <div className="pwo-location-list">
        {locations.length === 0 ? (
          <p className="pwo-empty-small">
            No location data available.
          </p>
        ) : (
          locations.map(
            ([location, count]) => (
              <div
                className="pwo-location-row"
                key={location}
              >
                <div>
                  <strong>
                    {location}
                  </strong>

                  <div className="pwo-location-bar">
                    <span
                      style={{
                        width: `${Math.max(
                          8,
                          (count / max) *
                            100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <span>
                  {count}{" "}
                  {count === 1
                    ? "work"
                    : "works"}
                </span>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}

/* =========================================================
   MAIN DASHBOARD
========================================================= */

export default function Dashboard() {
  const [works, setWorks] = useState([]);
  const [dashboardData, setDashboardData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      let backendDashboard = null;

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/dashboard`
        );

        if (response.ok) {
          backendDashboard =
            await response.json();
        }
      } catch (dashboardError) {
        console.warn(
          "Dashboard API unavailable:",
          dashboardError
        );
      }

      const backendWorks =
        await getWorks();

      setWorks(
        Array.isArray(backendWorks)
          ? backendWorks
          : []
      );

      setDashboardData(
        backendDashboard
      );
    } catch (err) {
      console.error(
        "Dashboard loading failed:",
        err
      );

      setError(
        err?.message ||
          "Unable to connect with backend."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();

    const refreshHandler = () => {
      loadDashboard();
    };

    window.addEventListener(
      "workRegistered",
      refreshHandler
    );

    return () => {
      window.removeEventListener(
        "workRegistered",
        refreshHandler
      );
    };
  }, []);

  const statistics = useMemo(() => {
    const total =
      Number(
        dashboardData?.totalWorks
      ) || works.length;

    const registered =
      Number(
        dashboardData?.registeredWorks
      ) || 0;

    const underVerification =
      Number(
        dashboardData?.underVerification
      ) || 0;

    const completed =
      Number(
        dashboardData?.completedWorks
      ) || 0;

    const rejected =
      Number(
        dashboardData?.rejectedWorks
      ) || 0;

    const unknown =
      Number(
        dashboardData?.unknownWorks
      ) || 0;

    return {
      total,
      registered,
      underVerification,
      completed,
      rejected,
      unknown,
    };
  }, [dashboardData, works]);

  const verifiedFromWorks =
    works.filter((work) => {
      const status = getStatus(work);

      return (
        status === "VERIFIED" ||
        status === "COMPLETED"
      );
    }).length;

  const pendingFromWorks =
    works.filter((work) => {
      const status = getStatus(work);

      return (
        status === "PENDING" ||
        status === "REGISTERED" ||
        status === "UNDER_VERIFICATION" ||
        status === "UNDER_REVIEW"
      );
    }).length;

  const rejectedFromWorks =
    works.filter((work) => {
      const status = getStatus(work);

      return (
        status === "REJECTED" ||
        status === "FAILED"
      );
    }).length;

  const verifiedWorks =
    dashboardData?.verifiedWorks !==
    undefined
      ? Number(
          dashboardData.verifiedWorks
        )
      : verifiedFromWorks;

  const pendingWorks =
    dashboardData?.pendingWorks !==
    undefined
      ? Number(
          dashboardData.pendingWorks
        )
      : pendingFromWorks;

  const rejectedWorks =
    dashboardData?.rejectedWorks !==
    undefined
      ? Number(
          dashboardData.rejectedWorks
        )
      : rejectedFromWorks;

  const statusValues = [
    {
      label: "Verified",
      value: verifiedWorks,
      color: "#32d74b",
    },
    {
      label: "Pending",
      value: pendingWorks,
      color: "#ff9f0a",
    },
    {
      label: "Rejected",
      value: rejectedWorks,
      color: "#ff453a",
    },
  ];

  if (loading) {
    return (
      <div className="pwo-app">
        <AdminSidebar />

        <main className="pwo-main">
          <AdminHeader />

          <div className="pwo-loading">
            <div className="pwo-loading-spinner" />

            <h2>
              Loading Dashboard
            </h2>

            <p>
              Connecting to the verification
              backend...
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="pwo-app">
      <AdminSidebar />

      <main className="pwo-main">
        <AdminHeader />

        <div className="pwo-dashboard">
          {/* =========================================
              ERROR
          ========================================= */}

          {error && (
            <div className="pwo-error">
              <strong>
                Backend connection issue
              </strong>

              <span>{error}</span>

              <button
                type="button"
                onClick={loadDashboard}
              >
                Retry
              </button>
            </div>
          )}

          {/* =========================================
              STATISTICS
          ========================================= */}

          <section className="pwo-stat-grid">
            <StatCard
              title="Total Works"
              value={
                statistics.total
              }
              subtitle="Live from backend"
              icon="▤"
            />

            <StatCard
              title="Verified Works"
              value={
                verifiedWorks
              }
              subtitle="Verified successfully"
              icon="✓"
              type="green"
            />

            <StatCard
              title="Pending Verifications"
              value={
                pendingWorks
              }
              subtitle="Awaiting verification"
              icon="◷"
              type="orange"
            />

            <StatCard
              title="Citizen Reports"
              value="N/A"
              subtitle="API not connected"
              icon="♧"
              type="purple"
            />

            <StatCard
              title="AI Accuracy"
              value="N/A"
              subtitle="AI metrics unavailable"
              icon="◉"
              type="blue"
            />
          </section>

          {/* =========================================
              MAIN ANALYTICS ROW
          ========================================= */}

          <section className="pwo-main-grid">
            {/* VERIFICATION OVERVIEW */}

            <article className="pwo-panel pwo-overview-panel">
              <div className="pwo-panel-header">
                <div>
                  <h2>
                    Verification Overview
                  </h2>
                </div>

                <div className="pwo-chart-legend">
                  <span>
                    <i className="green" />
                    Verified
                  </span>

                  <span>
                    <i className="orange" />
                    Pending
                  </span>

                  <span>
                    <i className="red" />
                    Rejected
                  </span>

                  <button type="button">
                    This Month⌄
                  </button>
                </div>
              </div>

              <VerificationChart
                works={works}
              />
            </article>

            {/* STATUS DISTRIBUTION */}

            <article className="pwo-panel pwo-status-panel">
              <div className="pwo-panel-header">
                <h2>
                  Verification Status
                  Distribution
                </h2>
              </div>

              <div className="pwo-status-content">
                <DonutChart
                  values={statusValues}
                  centerValue={
                    statistics.total
                  }
                  centerLabel="Total"
                />

                <div className="pwo-status-legend">
                  {statusValues.map(
                    (item) => {
                      const percentage =
                        statistics.total >
                        0
                          ? (
                              (item.value /
                                statistics.total) *
                              100
                            ).toFixed(1)
                          : "0.0";

                      return (
                        <div
                          className="pwo-status-row"
                          key={item.label}
                        >
                          <div>
                            <i
                              style={{
                                background:
                                  item.color,
                              }}
                            />

                            <span>
                              {item.label}
                            </span>
                          </div>

                          <strong>
                            {item.value}
                          </strong>

                          <small>
                            ({percentage}%)
                          </small>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </article>

            {/* RECENT ACTIVITIES */}

            <article className="pwo-panel pwo-activities-panel">
              <div className="pwo-panel-header">
                <h2>
                  Recent Activities
                </h2>
              </div>

              <RecentActivities
                works={works}
              />
            </article>
          </section>

          {/* =========================================
              SECOND ANALYTICS ROW
          ========================================= */}

          <section className="pwo-second-grid">
            <article className="pwo-panel pwo-category-panel">
              <div className="pwo-panel-header">
                <h2>
                  Top Work Categories
                </h2>
              </div>

              <TopCategories
                works={works}
              />
            </article>

            <article className="pwo-panel pwo-pipeline-panel">
              <div className="pwo-panel-header">
                <h2>
                  AI Verification Pipeline
                </h2>
              </div>

              <AIPipeline />
            </article>
          </section>

          {/* =========================================
              BOTTOM ROW
          ========================================= */}

          <section className="pwo-bottom-grid">
            <article className="pwo-panel pwo-recent-panel">
              <div className="pwo-panel-header">
                <h2>
                  Recent Works
                </h2>

                <button
                  type="button"
                  className="pwo-text-button"
                >
                  View All
                </button>
              </div>

              <RecentWorks
                works={works}
              />
            </article>

            <article className="pwo-panel pwo-map-panel">
              <div className="pwo-panel-header">
                <h2>
                  Geographic Overview
                </h2>

                <button type="button">
                  This Month⌄
                </button>
              </div>

              <GeographicOverview
                works={works}
              />
            </article>
          </section>
        </div>
      </main>
    </div>
  );
} 
