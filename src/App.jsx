import { useState } from "react";
import "./App.css";
import Game from "./Game";
import Mars from "./Mars"; // استدعاء ملف المريخ الجديد

export default function App() {
  const [showHelp, setShowHelp] = useState(false);
  const [showMission, setShowMission] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedPlanet, setSelectedPlanet] = useState("moon"); // لتحديد الكوكب

  // لو الصفحة الحالية هي لعبة
  if (currentPage === "game") {
    // لو مبرمجة المريخ يفتح Mars.jsx، ولو القمر يفتح Game.jsx
    if (selectedPlanet === "mars") {
      return <Mars goHome={() => setCurrentPage("home")} />;
    } else {
      return <Game goHome={() => setCurrentPage("home")} />;
    }
  }

  return (
    <main className="landing">

      {/* Sound */}
      <button className="sound">🔊</button>

      {/* Main Content */}
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

        {/* 3D Robot */}
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

        {/* Buttons */}
        <div className="buttons">

          <button
            className="start"
            onClick={() => {
              setSelectedPlanet("moon");
              setShowMission(true);
            }}
          >
            🚀 Start Moon Mission <span>›</span>
          </button>

          {/* زرار المريخ بيربط بـ Mars.jsx */}
          <button
            className="start"
            style={{ background: "linear-gradient(100deg, #ea580c, #c2410c)", borderColor: "#fb923c" }}
            onClick={() => {
              setSelectedPlanet("mars");
              setShowMission(true);
            }}
          >
            🔴 Start Mars Mission <span>›</span>
          </button>

          <button
            className="help"
            onClick={() => setShowHelp(true)}
          >
            How to Play ⓘ
          </button>

        </div>

        <p className="footer">
          ✦ THE UNIVERSE IS YOURS TO EXPLORE ✦
        </p>

      </section>

      {/* Help Modal */}
      {showHelp && (
        <div
          className="overlay"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="close"
              onClick={() => setShowHelp(false)}
            >
              ×
            </button>

            <h2>How to Play 🤖</h2>

            <p>Welcome, Space Explorer!</p>

            <div className="help-item">
              🚀 Explore the universe.
            </div>

            <div className="help-item">
              🏗️ Build your base.
            </div>

            <div className="help-item">
              ⚡ Manage your resources.
            </div>

            <button
              className="start"
              onClick={() => {
                setShowHelp(false);
                setSelectedPlanet("moon");
                setShowMission(true);
              }}
            >
              Let's Explore!
            </button>

          </div>
        </div>
      )}

      {/* Mission Modal */}
      {showMission && (
        <div
          className="overlay"
          onClick={() => setShowMission(false)}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="close"
              onClick={() => setShowMission(false)}
            >
              ×
            </button>

            <h2>Mission Briefing {selectedPlanet === "mars" ? "🔴" : "🌕"}</h2>

            <p>
              Welcome Commander!
              Your mission is to build
              a sustainable {selectedPlanet === "mars" ? "Mars" : "lunar"} base.
            </p>

            <button
              className="start"
              onClick={() => {
                setShowMission(false);
                setCurrentPage("game");
              }}
            >
              Ready, Commander! 🚀
            </button>

          </div>
        </div>
      )}

    </main>
  );
}