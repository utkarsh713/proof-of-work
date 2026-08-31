import React, { useEffect, useMemo, useState } from "react";
import {
  FiTrendingUp,
  FiCheckCircle,
  FiClock,
  FiAlertTriangle,
  FiBarChart2,
  FiActivity,
  FiMapPin,
  FiArrowUpRight,
  FiDatabase,
} from "react-icons/fi";

import "../index.css";
import { getWorks } from "../api/workApi";

export default function Analytics() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        setLoading(true);
        setLoadError("");

        const works = await getWorks();

        setSubmissions(Array.isArray(works) ? works : []);
      } catch (error) {
        console.error("Error loading works:", error);
        setLoadError(error?.message || "Unable to connect with backend.");
        setSubmissions([]);
      } finally {
        setLoading(false);
      }
    };

    loadSubmissions();

    window.addEventListener("workRegistered", loadSubmissions);

    return () => {
      window.removeEventListener("workRegistered", loadSubmissions);
    };
  }, []);

  /* =========================
     REAL DATA CALCULATIONS
  ========================= */

  const normalizeStatus = (status) =>
    String(status || "").trim().toUpperCase();

  const analytics = useMemo(() => {
    const total = submissions.length;

    const verified = submissions.filter(
      (item) => normalizeStatus(item.status) === "VERIFIED"
    ).length;

    const underReview = submissions.filter((item) => {
      const status = normalizeStatus(item.status);
      return status === "UNDER_REVIEW" || status === "UNDER VERIFICATION" || status === "";
    }).length;

    const issues = submissions.filter(
      (item) => normalizeStatus(item.status) === "REJECTED"
    ).length;

    const verificationRate =
      total > 0
        ? Math.round((verified / total) * 100)
        : 0;

    const transparencyScore =
      total === 0
        ? 0
        : Math.min(
            100,
            Math.round(
              (verified / total) * 100 +
                (underReview / total) * 70
            )
          );

    return {
      total,
      verified,
      underReview,
      issues,
      verificationRate,
      transparencyScore,
    };
  }, [submissions]);

  /* =========================
     MONTHLY DATA
  ========================= */

  const monthlyData = useMemo(() => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const currentMonth = new Date().getMonth();

    const lastSixMonths = [];

    for (let i = 5; i >= 0; i--) {
      const monthIndex =
        (currentMonth - i + 12) % 12;

      lastSixMonths.push({
        month: months[monthIndex],
        value: 0,
        monthIndex,
      });
    }

    submissions.forEach((submission) => {
      if (!submission.date) return;

      const submissionMonth = new Date(
        submission.date
      ).getMonth();

      const matchedMonth =
        lastSixMonths.find(
          (item) =>
            item.monthIndex === submissionMonth
        );

      if (matchedMonth) {
        matchedMonth.value += 1;
      }
    });

    return lastSixMonths;
  }, [submissions]);

  const maxValue = Math.max(
    ...monthlyData.map((item) => item.value),
    1
  );

  /* =========================
     LOCATION DATA
  ========================= */

  const locations = useMemo(() => {
    const locationMap = {};

    submissions.forEach((submission) => {
      const location =
        submission.location || "Unknown";

      if (!locationMap[location]) {
        locationMap[location] = 0;
      }

      locationMap[location] += 1;
    });

    return Object.entries(locationMap)
      .map(([name, count]) => ({
        name,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }, [submissions]);

  const getScoreStatus = () => {
    const score = analytics.transparencyScore;

    if (score >= 80) return "Excellent Transparency";
    if (score >= 60) return "Good Transparency";
    if (score > 0) return "Needs Improvement";

    return "No Data Yet";
  };

  return (
    <div className="analytics-page">

      {/* BACKGROUND DECORATION */}

      <div className="analytics-grid-bg"></div>
      <div className="analytics-glow analytics-glow-one"></div>
      <div className="analytics-glow analytics-glow-two"></div>

      {/* HERO */}

      <section className="analytics-hero">

        <div className="analytics-hero-content">

          <p className="analytics-label">
            <span></span>
            PLATFORM INTELLIGENCE
          </p>

          <h1>
            Data that tells
            <span> the story.</span>
          </h1>

          <p className="analytics-description">
            Track your real public works, verification
            performance and transparency across the
            Proof-of-Work platform.
          </p>

        </div>

        <div className="analytics-live">
          <span className="live-dot"></span>
          LIVE PLATFORM DATA
        </div>

      </section>


      {loadError && (
        <div className="analytics-empty-chart">
          <h3>Unable to load analytics</h3>
          <p>{loadError}</p>
        </div>
      )}

      {/* TOP STATS */}

      <section className="analytics-stats">

        <div className="analytics-stat-card">
          <div className="analytics-stat-icon">
            <FiActivity />
          </div>

          <div>
            <span>TOTAL ACTIVITY</span>

            <h2>{analytics.total}</h2>

            <p>
              <FiTrendingUp />
              Registered works
            </p>
          </div>
        </div>


        <div className="analytics-stat-card">

          <div className="analytics-stat-icon green">
            <FiCheckCircle />
          </div>

          <div>
            <span>VERIFICATION RATE</span>

            <h2>
              {analytics.verificationRate}%
            </h2>

            <p>
              <FiTrendingUp />
              {analytics.verified} verified
            </p>
          </div>

        </div>


        <div className="analytics-stat-card">

          <div className="analytics-stat-icon yellow">
            <FiClock />
          </div>

          <div>
            <span>UNDER REVIEW</span>

            <h2>
              {analytics.underReview}
            </h2>

            <p className="analytics-neutral">
              Awaiting verification
            </p>
          </div>

        </div>


        <div className="analytics-stat-card">

          <div className="analytics-stat-icon red">
            <FiAlertTriangle />
          </div>

          <div>
            <span>ISSUES DETECTED</span>

            <h2>
              {analytics.issues}
            </h2>

            <p className="analytics-negative">
              Requires attention
            </p>
          </div>

        </div>

      </section>


      {/* MAIN GRID */}

      <section className="analytics-grid">

        {/* CHART */}

        <div className="analytics-chart-card">

          <div className="analytics-card-header">

            <div>

              <p className="section-label">
                PERFORMANCE
              </p>

              <h2>
                Submission Activity
              </h2>

            </div>

            <div className="analytics-filter">
              2026
              <FiArrowUpRight />
            </div>

          </div>


          {analytics.total === 0 ? (

            <div className="analytics-empty-chart">

              <FiDatabase />

              <h3>No activity yet</h3>

              <p>
                Register your first public work to
                start generating analytics.
              </p>

              <button
                onClick={() => {
                  window.location.href =
                    "/register-work";
                }}
              >
                Register Work
                <FiArrowUpRight />
              </button>

            </div>

          ) : (

            <div className="bar-chart">

              {monthlyData.map((item, index) => (

                <div
                  className="bar-item"
                  key={`${item.month}-${index}`}
                >

                  <div className="bar-wrapper">

                    <div
                      className="analytics-bar"
                      style={{
                        height: `${
                          (item.value / maxValue) * 100
                        }%`,
                        animationDelay: `${
                          index * 0.1
                        }s`,
                      }}
                    >

                      <span>
                        {item.value}
                      </span>

                    </div>

                  </div>

                  <span className="bar-label">
                    {item.month}
                  </span>

                </div>

              ))}

            </div>

          )}

        </div>


        {/* SCORE */}

        <div className="analytics-score-card">

          <p className="section-label">
            PLATFORM HEALTH
          </p>

          <h2>
            Transparency Score
          </h2>


          <div
            className="analytics-score-ring"
            style={{
              background: `conic-gradient(
                #b8f52a ${
                  analytics.transparencyScore * 3.6
                }deg,
                #1b2922 ${
                  analytics.transparencyScore * 3.6
                }deg
              )`,
            }}
          >

            <div className="analytics-score-inner">

              <strong>
                {analytics.transparencyScore}
              </strong>

              <span>
                / 100
              </span>

            </div>

          </div>


          <div className="analytics-score-status">

            <FiCheckCircle />

            {getScoreStatus()}

          </div>


          <p className="analytics-score-text">
            This score is calculated from your
            registered works and their current
            verification status.
          </p>

        </div>

      </section>


      {/* BOTTOM GRID */}

      <section className="analytics-bottom-grid">


        {/* STATUS BREAKDOWN */}

        <div className="analytics-breakdown-card">

          <div className="analytics-card-header">

            <div>

              <p className="section-label">
                VERIFICATION
              </p>

              <h2>
                Work Status
              </h2>

            </div>

            <FiBarChart2 className="card-header-icon" />

          </div>


          <div className="status-breakdown">

            <div className="status-row">

              <div className="status-name">

                <span className="status-dot completed"></span>

                Verified

              </div>

              <strong>
                {analytics.verified}
              </strong>

              <div className="status-progress">

                <span
                  className="completed"
                  style={{
                    width: `${
                      analytics.total
                        ? (analytics.verified /
                            analytics.total) *
                          100
                        : 0
                    }%`,
                  }}
                ></span>

              </div>

            </div>


            <div className="status-row">

              <div className="status-name">

                <span className="status-dot pending"></span>

                Under Review

              </div>

              <strong>
                {analytics.underReview}
              </strong>

              <div className="status-progress">

                <span
                  className="pending"
                  style={{
                    width: `${
                      analytics.total
                        ? (analytics.underReview /
                            analytics.total) *
                          100
                        : 0
                    }%`,
                  }}
                ></span>

              </div>

            </div>


            <div className="status-row">

              <div className="status-name">

                <span className="status-dot issue"></span>

                Issues Found

              </div>

              <strong>
                {analytics.issues}
              </strong>

              <div className="status-progress">

                <span
                  className="issue"
                  style={{
                    width: `${
                      analytics.total
                        ? (analytics.issues /
                            analytics.total) *
                          100
                        : 0
                    }%`,
                  }}
                ></span>

              </div>

            </div>

          </div>

        </div>


        {/* LOCATIONS */}

        <div className="analytics-location-card">

          <div className="analytics-card-header">

            <div>

              <p className="section-label">
                GEOGRAPHIC DATA
              </p>

              <h2>
                Active Locations
              </h2>

            </div>

            <FiMapPin className="card-header-icon" />

          </div>


          <div className="location-list">

            {locations.length > 0 ? (

              locations.map(
                (location, index) => (

                  <div
                    className="location-item"
                    key={location.name}
                  >

                    <div className="location-rank">
                      {String(index + 1).padStart(
                        2,
                        "0"
                      )}
                    </div>

                    <div className="location-info">

                      <strong>
                        {location.name}
                      </strong>

                      <span>
                        {location.count} active{" "}
                        {location.count === 1
                          ? "project"
                          : "projects"}
                      </span>

                    </div>

                    <FiArrowUpRight />

                  </div>

                )
              )

            ) : (

              <div className="analytics-empty-location">

                <FiMapPin />

                <p>
                  No locations available yet.
                </p>

              </div>

            )}

          </div>

        </div>

      </section>

    </div>
  );
}