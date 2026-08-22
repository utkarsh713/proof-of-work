import React from "react";

import {
  FiTrendingUp,
  FiCheckCircle,
  FiClock,
  FiAlertTriangle,
  FiBarChart2,
  FiActivity,
  FiMapPin,
  FiArrowUpRight,
} from "react-icons/fi";

import "../index.css";

export default function Analytics() {
  const monthlyData = [
    { month: "Mar", value: 45 },
    { month: "Apr", value: 62 },
    { month: "May", value: 55 },
    { month: "Jun", value: 78 },
    { month: "Jul", value: 68 },
    { month: "Aug", value: 92 },
  ];

  const maxValue = 100;

  return (
    <div className="analytics-page">

      {/* HERO */}

      <section className="analytics-hero">

        <div>
          <p className="analytics-label">
            PLATFORM INTELLIGENCE
          </p>

          <h1>
            Data that tells
            <span> the story.</span>
          </h1>

          <p className="analytics-description">
            Track public works, verification performance and
            transparency across every stage of the platform.
          </p>
        </div>

        <div className="analytics-live">
          <span className="live-dot"></span>
          LIVE PLATFORM DATA
        </div>

      </section>


      {/* TOP STATS */}

      <section className="analytics-stats">

        <div className="analytics-stat-card">
          <div className="analytics-stat-icon">
            <FiActivity />
          </div>

          <div>
            <span>TOTAL ACTIVITY</span>
            <h2>248</h2>

            <p>
              <FiTrendingUp />
              +18.2% this month
            </p>
          </div>
        </div>


        <div className="analytics-stat-card">
          <div className="analytics-stat-icon green">
            <FiCheckCircle />
          </div>

          <div>
            <span>VERIFICATION RATE</span>
            <h2>94%</h2>

            <p>
              <FiTrendingUp />
              +6.4% improvement
            </p>
          </div>
        </div>


        <div className="analytics-stat-card">
          <div className="analytics-stat-icon yellow">
            <FiClock />
          </div>

          <div>
            <span>AVG. REVIEW TIME</span>
            <h2>2.4d</h2>

            <p className="analytics-neutral">
              Faster than last month
            </p>
          </div>
        </div>


        <div className="analytics-stat-card">
          <div className="analytics-stat-icon red">
            <FiAlertTriangle />
          </div>

          <div>
            <span>ISSUES DETECTED</span>
            <h2>25</h2>

            <p className="analytics-negative">
              Requires attention
            </p>
          </div>
        </div>

      </section>


      {/* ANALYTICS GRID */}

      <section className="analytics-grid">


        {/* PERFORMANCE CHART */}

        <div className="analytics-chart-card">

          <div className="analytics-card-header">

            <div>
              <p className="section-label">
                PERFORMANCE
              </p>

              <h2>
                Verification Activity
              </h2>
            </div>

            <button className="analytics-filter">
              2026 <FiArrowUpRight />
            </button>

          </div>


          <div className="bar-chart">

            {monthlyData.map((item) => (

              <div
                className="bar-item"
                key={item.month}
              >

                <div className="bar-wrapper">

                  <div
                    className="analytics-bar"
                    style={{
                      height: `${(item.value / maxValue) * 100}%`
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

        </div>


        {/* TRANSPARENCY SCORE */}

        <div className="analytics-score-card">

          <p className="section-label">
            PLATFORM HEALTH
          </p>

          <h2>
            Transparency Score
          </h2>


          <div className="analytics-score-ring">

            <div className="analytics-score-inner">

              <strong>
                94
              </strong>

              <span>
                / 100
              </span>

            </div>

          </div>


          <div className="analytics-score-status">
            <FiCheckCircle />
            Excellent Transparency
          </div>


          <p className="analytics-score-text">
            Platform activity and evidence verification
            are performing above the expected benchmark.
          </p>

        </div>

      </section>


      {/* BOTTOM GRID */}

      <section className="analytics-bottom-grid">


        {/* VERIFICATION BREAKDOWN */}

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

              <div>
                <span className="status-dot completed"></span>
                Verified
              </div>

              <strong>156</strong>

              <div className="status-progress">
                <span
                  style={{ width: "75%" }}
                  className="completed"
                ></span>
              </div>

            </div>


            <div className="status-row">

              <div>
                <span className="status-dot pending"></span>
                Under Review
              </div>

              <strong>67</strong>

              <div className="status-progress">
                <span
                  style={{ width: "48%" }}
                  className="pending"
                ></span>
              </div>

            </div>


            <div className="status-row">

              <div>
                <span className="status-dot issue"></span>
                Reported Issues
              </div>

              <strong>25</strong>

              <div className="status-progress">
                <span
                  style={{ width: "22%" }}
                  className="issue"
                ></span>
              </div>

            </div>

          </div>

        </div>


        {/* TOP LOCATIONS */}

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

            <div className="location-item">
              <div className="location-rank">01</div>

              <div className="location-info">
                <strong>Delhi</strong>
                <span>78 active projects</span>
              </div>

              <FiArrowUpRight />
            </div>


            <div className="location-item">
              <div className="location-rank">02</div>

              <div className="location-info">
                <strong>Noida</strong>
                <span>54 active projects</span>
              </div>

              <FiArrowUpRight />
            </div>


            <div className="location-item">
              <div className="location-rank">03</div>

              <div className="location-info">
                <strong>Gurugram</strong>
                <span>42 active projects</span>
              </div>

              <FiArrowUpRight />
            </div>

          </div>

        </div>

      </section>

    </div>
  );
}