
import { useState } from "react";
import HowToPlay from "./HowToPlay";
import LandingPage from "./LandingPage";
import MissionBriefing from "./MissionBriefing";
import Home from "./Home";

export default function App() {
  const [currentPage, setCurrentPage] = useState("landing");

  // Mission Briefing Page
  if (currentPage === "briefing") {
    return (
      <MissionBriefing
        onHowToPlay={() => setCurrentPage("howToPlay")}
      />
    );
  }

  // How To Play Page
  if (currentPage === "howToPlay") {
    return (
      <HowToPlay
        onAcceptMission={() => setCurrentPage("home")}
      />
    );
  }

  // Home Page
  if (currentPage === "home") {
    return <Home />;
  }

  // Landing Page
  return (
    <LandingPage
      onStartMission={() => setCurrentPage("briefing")}
    />
  );
}
