import React, { useState } from "react";

function CitizenVerification() {
  const [selected, setSelected] = useState(null);

  const works = [
    {
      id: 1,
      title: "Sector 18 Road Development",
      location: "Noida, Uttar Pradesh",
      category: "Road Infrastructure",
      status: "Needs Verification",
      progress: 85,
      image:
        "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 2,
      title: "Community Water Pipeline",
      location: "Greater Noida",
      category: "Water Infrastructure",
      status: "Needs Verification",
      progress: 100,
      image:
        "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 3,
      title: "Public Park Renovation",
      location: "Sector 62, Noida",
      category: "Public Infrastructure",
      status: "Under Review",
      progress: 70,
      image:
        "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=900&q=80",
    },
  ];

  return (
    <div className="citizen-page">

      {/* HERO */}

      <section className="citizen-hero">

        <div className="citizen-hero-content">

          <div className="citizen-eyebrow">
            <span className="citizen-live-dot"></span>
            COMMUNITY VERIFICATION
          </div>

          <h1>
            SEE IT.
            <span> VERIFY IT.</span>
          </h1>

          <p>
            Public infrastructure should not depend only on reports.
            Citizens can verify real work, upload evidence and help
            create true accountability.
          </p>

          <div className="citizen-stats">

            <div>
              <strong>1,248</strong>
              <span>Citizen Reviews</span>
            </div>

            <div>
              <strong>94%</strong>
              <span>Verified Accuracy</span>
            </div>

            <div>
              <strong>326</strong>
              <span>Active Verifiers</span>
            </div>

          </div>

        </div>


        {/* COMMUNITY VISUAL */}

        <div className="citizen-visual">

          <div className="citizen-orbit orbit-a"></div>
          <div className="citizen-orbit orbit-b"></div>

          <div className="citizen-core">
            <span>👥</span>
          </div>

          <div className="floating-tag tag-one">
            ✓ VERIFIED
          </div>

          <div className="floating-tag tag-two">
            📍 LOCAL
          </div>

          <div className="floating-tag tag-three">
            📸 EVIDENCE
          </div>

        </div>

      </section>


      {/* SECTION HEADER */}

      <section className="citizen-content">

        <div className="citizen-section-header">

          <div>

            <p className="citizen-section-label">
              ACTIVE PROJECTS
            </p>

            <h2>
              Help verify public work
            </h2>

            <p>
              Review projects near you and share your real-world evidence.
            </p>

          </div>

          <button className="citizen-filter">
            ⌘ FILTER PROJECTS
          </button>

        </div>


        {/* PROJECT CARDS */}

        <div className="citizen-project-grid">

          {works.map((work) => (

            <div
              className={`citizen-project-card ${
                selected === work.id ? "selected" : ""
              }`}
              key={work.id}
              onClick={() => setSelected(work.id)}
            >

              <div className="citizen-project-image">

                <img
                  src={work.image}
                  alt={work.title}
                />

                <div className="citizen-project-overlay"></div>

                <span className="citizen-status">
                  {work.status}
                </span>

                <div className="citizen-project-number">
                  0{work.id}
                </div>

              </div>


              <div className="citizen-project-info">

                <span className="citizen-category">
                  {work.category}
                </span>

                <h3>
                  {work.title}
                </h3>

                <p className="citizen-location">
                  📍 {work.location}
                </p>


                {/* Progress */}

                <div className="citizen-progress-info">

                  <div>
                    <span>PROJECT PROGRESS</span>

                    <strong>
                      {work.progress}%
                    </strong>
                  </div>

                  <div className="citizen-progress-bar">

                    <span
                      style={{
                        width: `${work.progress}%`,
                      }}
                    ></span>

                  </div>

                </div>


                <button className="citizen-verify-btn">

                  VERIFY THIS WORK

                  <span>→</span>

                </button>

              </div>

            </div>

          ))}

        </div>


        {/* CITIZEN PROCESS */}

        <section className="citizen-process">

          <div className="citizen-process-heading">

            <p>HOW IT WORKS</p>

            <h2>
              Your evidence creates
              <span> accountability.</span>
            </h2>

          </div>


          <div className="citizen-steps">

            <div className="citizen-step">

              <span className="step-number">
                01
              </span>

              <div className="step-icon">
                📍
              </div>

              <h3>
                Find a Project
              </h3>

              <p>
                Discover public works happening
                in your local area.
              </p>

            </div>


            <div className="citizen-step">

              <span className="step-number">
                02
              </span>

              <div className="step-icon">
                📸
              </div>

              <h3>
                Upload Evidence
              </h3>

              <p>
                Capture real photos and
                observations from the site.
              </p>

            </div>


            <div className="citizen-step">

              <span className="step-number">
                03
              </span>

              <div className="step-icon">
                ✓
              </div>

              <h3>
                Verify Progress
              </h3>

              <p>
                Help confirm whether public
                work matches official claims.
              </p>

            </div>

          </div>

        </section>

      </section>

    </div>
  );
}

export default CitizenVerification;