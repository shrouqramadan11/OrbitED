
import { useState } from "react";
import "./App.css";

export default function LandingPage({ onStartMission }) {
  return (
    <main className="landing">

      <button className="sound">🔊</button>

      <section className="content">

        <div className="logo">
          Orbit<span>ED</span> 🚀
        </div>

        <p className="tagline">
          EXPLORE • BUILD • LEARN
        </p>

        <p className="subtitle">
          Your choices. A brighter future.
        </p>

        <div className="mascot">

          <div className="speech">
            Hi, Space Explorer!
            <br />
            Ready for an adventure?
          </div>

          <div className="robot-3d">
            <model-viewer
              src="/models/robot.glb"
              alt="3D Space Robot"
              auto-rotate
              auto-rotate-delay="0"
              rotation-per-second="20deg"
              camera-controls
              disable-zoom
              autoplay
              shadow-intensity="1"
              exposure="1"
              environment-image="neutral"
              interaction-prompt="none"
            ></model-viewer>
          </div>

        </div>

        <div className="buttons">

          <button
            className="start"
            onClick={onStartMission}
          >
            🚀 Start Mission <span>›</span>
          </button>

        </div>

        <p className="footer">
          ✦ THE UNIVERSE IS YOURS TO EXPLORE ✦
        </p>

      </section>

    </main>
  );
}
