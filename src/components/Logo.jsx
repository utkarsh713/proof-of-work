import React from "react";
import { Link } from "react-router-dom";
import "./Logo.css";

export default function Logo({
  className = "",
  link = true,
}) {
  const logo = (
    <div className={`pw-logo ${className}`}>
      <span className="logo-p">P</span>
      <span className="logo-slash">/</span>
      <span className="logo-w">W</span>
    </div>
  );

  if (link) {
    return (
      <Link to="/" className="pw-logo-link">
        {logo}
      </Link>
    );
  }

  return logo;
}