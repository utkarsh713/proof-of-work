import React, { useEffect, useState } from "react";
import "../SplashScreen.css";

export default function SplashScreen({ onFinish }) {
  const [showName, setShowName] = useState(false);
  const [exit, setExit] = useState(false);

  useEffect(() => {
    const nameTimer = setTimeout(() => {
      setShowName(true);
    }, 900);

    const exitTimer = setTimeout(() => {
      setExit(true);
    }, 2800);

    const finishTimer = setTimeout(() => {
      onFinish();
    }, 3400);

    return () => {
      clearTimeout(nameTimer);
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div className={`splash-screen ${exit ? "splash-exit" : ""}`}>
      <div className={`pw-logo ${showName ? "logo-small" : ""}`}>
        <span className="letter-p">P</span>
        <span className="logo-slash">/</span>
        <span className="letter-w">W</span>
      </div>

      {showName && (
        <div className="project-name">
          <span>PROOF</span>
          <span className="slash"> / </span>
          <span>WORK</span>
        </div>
      )}

      <div className="splash-line" />
    </div>
  );
}