import React, { useState } from "react";
import "../index.css";
function Dashboard() {
  const [registeredWork] = useState(() => {
    try {
      const savedWork = localStorage.getItem("registeredWork");
      return savedWork ? JSON.parse(savedWork) : null;
    } catch (error) {
      console.error("Unable to read registeredWork:", error);
      return null;
    }
  });

  const workName =
    registeredWork?.workName ||
    registeredWork?.title ||
    "Road Reconstruction";

  const department =
    registeredWork?.department ||
    "Public Works Department";

  const workLocation =
    registeredWork?.workLocation ||
    registeredWork?.location ||
    "Sarita Vihar, Delhi";

  const estimatedCost =
    registeredWork?.estimatedCost ||
    "12.50 Cr";

  const description =
    registeredWork?.description ||
    "Public infrastructure work submitted for citizen verification.";

  const beforeImage =
    registeredWork?.beforeImage ||
    "https://images.unsplash.com/photo-1494526585095-c41746248156?w=900";

  const afterImage =
    registeredWork?.afterImage ||
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=900";

  return (
    <div className="app">

      {/* LEFT SIDEBAR */}
      <Sidebar />

      <main className="main-content">

        {/* TOP HEADER */}
        <Header />

        {/* HERO / GREETING */}
        <section className="dashboard-greeting">
          <div>
            <h1>Good Morning, Anjali! 👋</h1>
            <p>Let's make our cities better together.</p>
          </div>
        </section>

        {/* STATS */}
        <section className="stats-grid">

          <StatCard
            title="Total Projects"
            value="128"
            change="↑ 18.2% this month"
            icon="💼"
          />

          <StatCard
            title="Verified"
            value="82"
            change="↑ 12.4% this month"
            icon="✓"
          />

          <StatCard
            title="Under Review"
            value="31"
            change="↑ 8.6% this month"
            icon="⌛"
          />

          <StatCard
            title="Issues Found"
            value="15"
            change="↓ 5.3% this month"
            icon="⚠"
          />

        </section>

        {/* FEATURED PROJECTS */}
        <section className="featured-section">

          <div className="section-heading">
            <div>
              <span className="section-kicker">
                FEATURED PROJECTS
              </span>
            </div>

            <button className="view-all-btn">
              View all projects →
            </button>
          </div>

          <div className="project-filters">
            <button className="active">All</button>
            <button>Roads</button>
            <button>Parks</button>
            <button>Water</button>
            <button>Infrastructure</button>
          </div>

          <div className="projects-grid">

            <div className="project-card">
              <img
                src={beforeImage}
                alt="Road project"
              />

              <span className="status pending">
                UNDER VERIFICATION
              </span>

              <div className="project-content">
                <h3>{workName}</h3>
                <p>{workLocation}</p>

                <div className="project-footer">
                  <div>
                    <small>Budget</small>
                    <strong>₹{estimatedCost}</strong>
                  </div>

                  <div>
                    <small>Status</small>
                    <strong className="orange">
                      Under Verification
                    </strong>
                  </div>

                  <button>→</button>
                </div>
              </div>
            </div>


            <div className="project-card">
              <img
                src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=900"
                alt="Park"
              />

              <span className="status verified">
                VERIFIED
              </span>

              <div className="project-content">
                <h3>Park Renovation</h3>
                <p>Noida Sector 62</p>

                <div className="project-footer">
                  <div>
                    <small>Budget</small>
                    <strong>₹8.75 Cr</strong>
                  </div>

                  <div>
                    <small>Status</small>
                    <strong className="green">
                      Completed
                    </strong>
                  </div>

                  <button>→</button>
                </div>
              </div>
            </div>


            <div className="project-card">
              <img
                src="https://images.unsplash.com/photo-1548013146-72479768bada?w=900"
                alt="Drainage"
              />

              <span className="status issues">
                ISSUES FOUND
              </span>

              <div className="project-content">
                <h3>Drainage System</h3>
                <p>Gurgaon Sector 45</p>

                <div className="project-footer">
                  <div>
                    <small>Budget</small>
                    <strong>₹6.20 Cr</strong>
                  </div>

                  <div>
                    <small>Status</small>
                    <strong className="red">
                      Issues Found
                    </strong>
                  </div>

                  <button>→</button>
                </div>
              </div>
            </div>


            <div className="project-card">
              <img
                src="https://images.unsplash.com/photo-1473445361085-b9a07f55608b?w=900"
                alt="Metro"
              />

              <span className="status verified">
                VERIFIED
              </span>

              <div className="project-content">
                <h3>Metro Extension</h3>
                <p>Dwarka, Delhi</p>

                <div className="project-footer">
                  <div>
                    <small>Budget</small>
                    <strong>₹152.00 Cr</strong>
                  </div>

                  <div>
                    <small>Status</small>
                    <strong className="green">
                      Completed
                    </strong>
                  </div>

                  <button>→</button>
                </div>
              </div>
            </div>

          </div>
        </section>


        {/* CLAIM VS EVIDENCE */}
        <section className="verification-layout">

          <div className="claim-evidence-card">

            {/* GOVERNMENT */}
            <div className="government-claim">

              <span>THE CLAIM</span>

              <h2>GOVERNMENT CLAIM</h2>

              <div className="claim-check">
                ✓
              </div>

              <h3>PROJECT COMPLETED</h3>

              <strong>₹ {estimatedCost} ALLOCATED</strong>

              <div className="claim-details">
                <p>
                  <span>Project:</span>
                  {workName}
                </p>

                <p>
                  <span>Location:</span>
                  {workLocation}
                </p>

                <p>
                  <span>Department:</span>
                  {department}
                </p>
              </div>

            </div>


            {/* VS */}
            <div className="vs-circle">
              VS
            </div>


            {/* CITIZEN */}
            <div className="citizen-evidence">

              <span>THE REALITY</span>

              <h2>CITIZEN EVIDENCE</h2>

              <div className="evidence-info">

                <div className="evidence-list">
                  <p>⚠ ROAD PARTIALLY COMPLETED</p>
                  <p>📷 42 PHOTOS SUBMITTED</p>
                  <p>♧ 18 CITIZEN REPORTS</p>
                  <p>⬡ 87% VERIFICATION CONFIDENCE</p>
                </div>

                <div className="evidence-images">
                  <img src={beforeImage} alt="Evidence 1" />
                  <img src={afterImage} alt="Evidence 2" />
                </div>

              </div>

            </div>

          </div>


          {/* RIGHT SIDE */}
          <div className="dashboard-side-cards">

            <div className="verification-overview">

              <h3>VERIFICATION OVERVIEW</h3>

              <div className="overview-content">

                <div className="progress-ring">
                  <span>128</span>
                  <small>Total</small>
                </div>

                <div className="overview-legend">
                  <p><span className="dot green-dot"></span>82 Verified</p>
                  <p><span className="dot orange-dot"></span>31 Under Review</p>
                  <p><span className="dot red-dot"></span>15 Issues Found</p>
                </div>

              </div>

              <div className="recent-evidence">
                <div className="mini-heading">
                  <strong>RECENT EVIDENCE</strong>
                  <span>View all</span>
                </div>

                <p>🛣 Road Reconstruction <small>Today, 10:34 AM</small></p>
                <p>🌳 Park Renovation <small>Today, 09:16 AM</small></p>
                <p>🌊 Drainage System <small>Yesterday, 04:45 PM</small></p>
              </div>

            </div>


            <div className="near-projects">

              <h3>PROJECTS NEAR YOU</h3>

              <div className="map-placeholder">
                <div className="map-lines"></div>
                <span className="map-pin one">●</span>
                <span className="map-pin two">●</span>
                <span className="map-pin three">●</span>
              </div>

              <button>View Map</button>

            </div>

          </div>

        </section>


        {/* HOW IT WORKS */}
        <section className="how-it-works">

          <h3>HOW IT WORKS</h3>

          <div className="steps-grid">

            <div className="step">
              <div className="step-icon">⌖</div>

              <div>
                <span>01</span>
                <h4>DISCOVER</h4>
                <p>Find public projects happening around you.</p>
              </div>
            </div>

            <div className="step-arrow">→</div>

            <div className="step">
              <div className="step-icon">⌕</div>

              <div>
                <span>02</span>
                <h4>INSPECT</h4>
                <p>Visit the location or inspect work online.</p>
              </div>
            </div>

            <div className="step-arrow">→</div>

            <div className="step">
              <div className="step-icon">☁</div>

              <div>
                <span>03</span>
                <h4>SUBMIT PROOF</h4>
                <p>Upload photos, videos and observations.</p>
              </div>
            </div>

            <div className="step-arrow">→</div>

            <div className="step">
              <div className="step-icon">♢</div>

              <div>
                <span>04</span>
                <h4>VERIFY</h4>
                <p>Compare citizen evidence with official claims.</p>
              </div>
            </div>

          </div>

        </section>


        {/* BOTTOM CTA */}
        <section className="dashboard-cta">

          <div>
            <h2>
              EVERY PROJECT DESERVES
              <span> PROOF.</span>
            </h2>

            <p>
              Help make public infrastructure more transparent.
            </p>
          </div>

          <button>
            EXPLORE PROJECTS →
          </button>

        </section>

      </main>

    </div>
  );
}