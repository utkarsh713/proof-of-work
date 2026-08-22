import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../Home.css";

import Logo from "../components/Logo";

import heroVideo from "../assets/hero.mp4";
import metroVideo from "../assets/metro.mp4";
import roadVideo from "../assets/road.mp4";
import waterVideo from "../assets/water.mp4";
import projectSite from "../assets/project-site.jpeg";
import pipeline from "../assets/pipeline.jpeg";
import infrastructure from "../assets/infra.jpeg";
import roadImage from "../assets/afterRoad.jpeg";
import citizenImage from "../assets/citizen.jpeg";
import beforeImage from "../assets/beforeRoad.jpeg";

export default function Home() {
  const [activeProject, setActiveProject] = useState("all");

  const projects = [
    {
      id: 1,
      category: "road",
      title: "Road Reconstruction",
      location: "Sarita Vihar, Delhi",
      budget: "₹12.5 Cr",
      status: "UNDER VERIFICATION",
      video: roadVideo,
    },
    {
      id: 2,
      category: "park",
      title: "Park Renovation",
      location: "Noida Sector 62",
      budget: "₹8.75 Cr",
      status: "VERIFIED",
      video: heroVideo,
    },
    {
      id: 3,
      category: "water",
      title: "Drainage System",
      location: "Gurgaon Sector 46",
      budget: "₹6.20 Cr",
      status: "ISSUE FOUND",
      video: waterVideo,
    },
    {
      id: 4,
      category: "metro",
      title: "Metro Extension",
      location: "Dwarka, Delhi",
      budget: "₹152.00 Cr",
      status: "VERIFIED",
      video: metroVideo,
    },
  ];

  const filteredProjects =
    activeProject === "all"
      ? projects
      : projects.filter((project) => project.category === activeProject);

  return (
    <div className="home-page">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="home-hero">
        <video className="hero-video" autoPlay muted loop playsInline>
          <source src={heroVideo} type="video/mp4" />
        </video>

        <div className="hero-overlay" />
        <div className="hero-grid" />
        <div className="hero-moving-shape" />

        {/* NAVBAR */}

        <nav className="home-navbar">
          <Link to="/" className="pw-logo-link">
            <Logo className="nav-logo" />
          </Link>

          <div className="home-nav-links">
            <a href="#projects">PROJECTS</a>
            <a href="#why-us">WHY US</a>
            <a href="#how-it-works">HOW IT WORKS</a>
            <a href="#about">ABOUT</a>
          </div>

          <Link to="/login" className="nav-login-btn">
            LOGIN <span>↗</span>
          </Link>
        </nav>

        {/* HERO CONTENT */}

        <div className="hero-content">
          <div className="hero-eyebrow">PUBLIC ACCOUNTABILITY PLATFORM</div>

          <h1 className="hero-title">
            <span>PUBLIC</span>
            <span className="green-text">WORK.</span>
            <span>PUBLIC</span>
            <span>PROOF.</span>
          </h1>

          <p className="hero-description">
            A transparent platform where public infrastructure meets real-world
            evidence. Track projects, verify progress and make accountability
            visible.
          </p>

          <div className="hero-actions">
            <a href="#projects" className="hero-primary-btn">
              EXPLORE PROJECTS
              <span>→</span>
            </a>

            <a href="#how-it-works" className="hero-secondary-btn">
              HOW IT WORKS
            </a>
          </div>
        </div>

        {/* HERO BOTTOM */}

        <div className="hero-bottom">
          <span>TRANSPARENCY</span>
          <span>✦</span>
          <span>ACCOUNTABILITY</span>
          <span>✦</span>
          <span>EVIDENCE</span>
          <span>✦</span>
          <span>TRUST</span>
        </div>
      </section>

      {/* =====================================================
          FEATURED PROJECTS
      ===================================================== */}

      <section className="featured-section" id="projects">
        <div className="section-container">
          <div className="section-header">
            <div>
              <p className="section-label">FEATURED</p>

              <h2>
                PUBLIC <span>WORKS</span>
              </h2>
            </div>

            <a href="#projects" className="view-all">
              VIEW ALL PROJECTS →
            </a>
          </div>

          {/* FILTERS */}

          <div className="project-filters">
            <button
              className={activeProject === "all" ? "active" : ""}
              onClick={() => setActiveProject("all")}
            >
              ALL
            </button>

            <button
              className={activeProject === "road" ? "active" : ""}
              onClick={() => setActiveProject("road")}
            >
              ROADS
            </button>

            <button
              className={activeProject === "park" ? "active" : ""}
              onClick={() => setActiveProject("park")}
            >
              PARKS
            </button>

            <button
              className={activeProject === "water" ? "active" : ""}
              onClick={() => setActiveProject("water")}
            >
              WATER
            </button>

            <button
              className={activeProject === "metro" ? "active" : ""}
              onClick={() => setActiveProject("metro")}
            >
              INFRASTRUCTURE
            </button>
          </div>

          {/* PROJECT CARDS */}

          <div className="projects-grid">
            {filteredProjects.map((project) => (
              <div className="project-card" key={project.id}>
                <div className="project-media">
                  <video autoPlay muted loop playsInline>
                    <source src={project.video} type="video/mp4" />
                  </video>

                  <span
                    className={`project-status ${project.status
                      .toLowerCase()
                      .replaceAll(" ", "-")}`}
                  >
                    {project.status}
                  </span>
                </div>

                <div className="project-info">
                  <h3>{project.title}</h3>

                  <p>{project.location}</p>

                  <div className="project-meta">
                    <span>{project.budget}</span>

                    <span>VIEW →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* =========================
    CLAIM VS REALITY
========================= */}

<section className="claim-reality-section" id="why-us">

  <div className="claim-reality-wrapper">

    {/* LEFT — GOVERNMENT CLAIM */}

    <div className="claim-side">

      <p className="claim-label">
        THE CLAIM
      </p>

      <h2 className="claim-title">
        GOVERNMENT CLAIM
      </h2>

      <div className="claim-status">

        <div className="claim-check">
          ✓
        </div>

        <div>
          <h3>PROJECT COMPLETED</h3>

          <p>₹12.50 CR ALLOCATED</p>

          <span>
            Official completion report submitted.
          </span>
        </div>

      </div>

    </div>


    {/* CENTER VS */}

    <div className="vs-circle">
      VS
    </div>


    {/* RIGHT — CITIZEN EVIDENCE */}

    <div className="evidence-side">

      <p className="evidence-label">
        THE REALITY
      </p>

      <h2 className="evidence-title">
        CITIZEN EVIDENCE
      </h2>

      <div className="evidence-status">

        <div className="warning-icon">
          △
        </div>

        <div>
          <h3>ROAD PARTIALLY COMPLETED</h3>

          <p>◉ &nbsp; 42 PHOTOS SUBMITTED</p>
          <p>☁ &nbsp; 18 CITIZEN REPORTS</p>
          <p>◈ &nbsp; 87% VERIFICATION CONFIDENCE</p>
        </div>

      </div>


      {/* POLAROID PHOTOS */}

      <div className="evidence-polaroids">

  <div className="evidence-polaroid photo-one">
    <img
      src={roadImage}
      alt="Damaged road evidence"
    />

    <span>BEFORE</span>
  </div>

  <div className="evidence-polaroid photo-two">
    <img
      src={beforeImage}
      alt="Citizen inspection evidence"
    />

    <span>ON-SITE PROOF</span>
  </div>

</div>

    </div>

  </div>

</section>
{/* ================= HOW IT WORKS ================= */}

<section className="how-section" id="how-it-works">

  <div className="how-header">
    <span className="section-tag">HOW IT WORKS</span>

    <h2>
      FROM <span>CLAIM</span> TO PROOF.
    </h2>

    <p>
      A transparent verification system powered by citizens,
      real-world evidence and AI.
    </p>
  </div>

  <div className="how-process">

    <div className="process-card">
      <span className="process-number">01</span>

      <div className="process-icon">
        ◈
      </div>

      <h3>DISCOVER</h3>

      <p>
        Explore public infrastructure projects happening around you.
      </p>
    </div>

    <div className="process-arrow">→</div>

    <div className="process-card">
      <span className="process-number">02</span>

      <div className="process-icon">
        ◎
      </div>

      <h3>INSPECT</h3>

      <p>
        Compare official project claims with the real situation.
      </p>
    </div>

    <div className="process-arrow">→</div>

    <div className="process-card">
      <span className="process-number">03</span>

      <div className="process-icon">
        ↑
      </div>

      <h3>SUBMIT PROOF</h3>

      <p>
        Upload photos, reports and real-world evidence.
      </p>
    </div>

    <div className="process-arrow">→</div>

    <div className="process-card">
      <span className="process-number">04</span>

      <div className="process-icon">
        ✓
      </div>

      <h3>VERIFY</h3>

      <p>
        AI and citizens verify the submitted evidence.
      </p>
    </div>

  </div>

</section>

     
      {/* =========================
    REALITY SECTION
========================= */}

      <section className="reality-section" id="why-us">
        <div className="reality-container">
          {/* LEFT CONTENT */}

          <div className="reality-content">
            <p className="reality-eyebrow">REALITY, DOCUMENTED.</p>

            <h2 className="reality-title">
              <span>SEE WHAT'S</span>
              <span className="green-text">REALLY</span>
              <span className="green-text">HAPPENING.</span>
            </h2>

            <p className="reality-description">
              Every project tells a story. Official reports show one side.
              Citizens show the other.
            </p>

            {/* STATS */}

            <div className="reality-stats">
              <div className="reality-stat">
                <strong>42</strong>
                <span>PHOTOS</span>
              </div>

              <div className="reality-stat">
                <strong>18</strong>
                <span>REPORTS</span>
              </div>

              <div className="reality-stat">
                <strong>87%</strong>
                <span>CONFIDENCE</span>
              </div>
            </div>

            <Link to="/citizen-verification" className="reality-btn">
              VIEW ALL EVIDENCE
              <span>→</span>
            </Link>
          </div>

          {/* RIGHT POLAROID GALLERY */}

          <div className="polaroid-gallery">
            
            {/* MAIN BIG PHOTO */}

            <div className="polaroid polaroid-main">
              <img src={roadImage} alt="Road construction" />

              <div className="polaroid-caption">ON-SITE EVIDENCE</div>
            </div>

            {/* TOP RIGHT */}

            <div className="polaroid polaroid-top">
              <img src={projectSite} alt="Infrastructure work" />

              <div className="polaroid-caption">PROJECT SITE</div>
            </div>

            {/* MIDDLE RIGHT */}

            <div className="polaroid polaroid-middle">
              <img src={pipeline} alt="Citizen evidence" />

              <div className="polaroid-caption">VERIFIED</div>
            </div>

            {/* BOTTOM WIDE */}

            <div className="polaroid polaroid-bottom">
              <img src={infrastructure} alt="Public infrastructure" />

              <div className="polaroid-caption">REALITY CHECK</div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="final-cta">
        <div className="cta-glow" />

        <div className="section-container cta-content">
          <p className="section-label">MAKE ACCOUNTABILITY VISIBLE</p>

          <h2>
            SEE IT.
            <br />
            <span>PROVE IT.</span>
          </h2>

          <p>
            Join a transparent future where public work can be seen, verified
            and trusted.
          </p>

          <div className="cta-buttons">
            <Link to="/register" className="cta-primary">
              JOIN THE MOVEMENT →
            </Link>

            <Link to="/login" className="cta-secondary">
              LOGIN
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="home-footer">
        <Link to="/" className="footer-logo">
          <Logo className="footer-pw-logo" />
        </Link>

        <p>PROOF-OF-WORK © 2026</p>

        <div className="footer-links">
          <a href="#projects">PROJECTS</a>

          <a href="#how-it-works">PROCESS</a>

          <Link to="/login">LOGIN</Link>
        </div>
      </footer>
    </div>
  );
}