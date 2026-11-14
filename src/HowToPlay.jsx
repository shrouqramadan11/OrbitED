import { useEffect, useRef, useState } from "react";
import {
  Volume2,
  Square,
  ChevronLeft,
  ChevronRight,
  Rocket,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import howToPlayMessages from "./howToPlayMessages";
import "./HowToPlay.css";

function HowToPlay({ onAcceptMission }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [speechError, setSpeechError] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const [hasInteracted, setHasInteracted] = useState(false);

  const speechTimeoutRef = useRef(null);
  const speechIdRef = useRef(0);

  const currentMessage = howToPlayMessages[currentStep];

  useEffect(() => {
    setDisplayedText("");

    if (!currentMessage?.text) return;

    let currentIndex = 0;
    const textToType = currentMessage.text;

    const typingInterval = setInterval(() => {
      if (currentIndex < textToType.length) {
        setDisplayedText((prev) => prev + textToType.charAt(currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 35);

    return () => clearInterval(typingInterval);
  }, [currentStep]);

  useEffect(() => {
    if (!("speechSynthesis" in window)) {
      setSpeechError("Your browser does not support speech synthesis.");
      return;
    }

    const synth = window.speechSynthesis;
    const loadVoices = () => {
      synth.getVoices();
    };

    loadVoices();
    synth.addEventListener("voiceschanged", loadVoices);

    return () => {
      synth.removeEventListener("voiceschanged", loadVoices);
    };
  }, []);

  const handleStop = () => {
    speechIdRef.current++;

    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
      speechTimeoutRef.current = null;
    }

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setSpeaking(false);
  };

  const speakMessage = (message) => {
    if (!("speechSynthesis" in window)) {
      setSpeechError("Your browser does not support speech synthesis.");
      return;
    }

    if (!message?.text) {
      setSpeechError("There is no text to read.");
      return;
    }

    const synth = window.speechSynthesis;
    speechIdRef.current++;
    const currentSpeechId = speechIdRef.current;

    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
      speechTimeoutRef.current = null;
    }

    synth.cancel();
    setSpeaking(false);
    setSpeechError("");

    speechTimeoutRef.current = setTimeout(() => {
      if (currentSpeechId !== speechIdRef.current) return;

      const utterance = new SpeechSynthesisUtterance(message.text);
      const language = message.lang || "en-US";
      utterance.lang = language;

      utterance.rate = 0.92;
      utterance.pitch = 1.45;
      utterance.volume = 1;

      const voices = synth.getVoices();
      const selectedVoice =
        voices.find((voice) => voice.name === "Google US English") ||
        voices.find(
          (voice) => voice.name === "Microsoft Zira - English (United States)"
        ) ||
        voices.find(
          (voice) => voice.lang.toLowerCase() === language.toLowerCase()
        );

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onstart = () => {
        if (currentSpeechId !== speechIdRef.current) return;
        setSpeaking(true);
        setSpeechError("");
      };

      utterance.onend = () => {
        if (currentSpeechId !== speechIdRef.current) return;
        setSpeaking(false);
      };

      utterance.onerror = (event) => {
        if (currentSpeechId !== speechIdRef.current) return;
        setSpeaking(false);

        if (event.error !== "canceled" && event.error !== "interrupted") {
          setSpeechError(`Voice playback failed: ${event.error}`);
        }
      };

      synth.speak(utterance);
      speechTimeoutRef.current = null;
    }, 150);
  };

  useEffect(() => {
    if (!currentMessage?.text) return;

    if (hasInteracted) {
      speakMessage(currentMessage);
    }

    return () => {
      handleStop();
    };
  }, [currentStep, hasInteracted]);

  const handleUserInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      speakMessage(currentMessage);
    }
  };

  const handleNext = () => {
    handleStop();
    if (currentStep < howToPlayMessages.length - 1) {
      setCurrentStep((step) => step + 1);
    }
  };

  const handlePrevious = () => {
    handleStop();
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1);
    }
  };

  useEffect(() => {
    return () => {
      speechIdRef.current++;
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
      }
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const progress = ((currentStep + 1) / howToPlayMessages.length) * 100;

  return (
    <main className="mission-page" onClick={handleUserInteraction}>
      <div className="youtube-bg-container">
        <iframe
          className="youtube-bg-iframe"
          src="https://www.youtube.com/embed/eTD0WWFIDAg?autoplay=1&mute=1&loop=1&playlist=eTD0WWFIDAg&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&playsinline=1"
          title="Space Galaxy Background"
          frameBorder="0"
          allow="autoplay; encrypted-media"
        />
      </div>

      <div className="video-overlay" />

      {/* Header */}
      <header className="mission-header">
        <div className="orbi-logo">
          <Rocket size={23} />
          <span>
            Orbit<span style={{ color: "var(--logo-ed)" }}>ED</span>
          </span>
        </div>

        <span className="briefing-label">YOUR MISSION STARTS HERE</span>
      </header>

      {/* Main content */}
      <section className="briefing-layout">
        {/* ORBI */}
        <div className="robot-section">
          <div className="robot-status">
            <span className={`status-dot ${speaking ? "active" : ""}`} />
            {speaking ? "ORBI IS SPEAKING" : "ORBI IS READY"}
          </div>

          <div className="robot-container">
            <motion.img
              src="/robot.png"
              alt="ORBI Robot"
              className="robot-character-img"
              animate={{ y: [0, -8, 0] }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut",
              }}
              onError={() => console.error("Could not load /robot.png")}
            />
          </div>

          <div className="robot-name">
            <h2>ORBI</h2>
            <p>Your friendly mission guide</p>
          </div>
        </div>

        {/* Mission briefing */}
        <div className="briefing-section">
          <div className="briefing-title">
            <span>HOW TO PLAY</span>
            <div className="title-line" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              className="speech-card enhanced-speech-card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <span className="message-number">
                BRIEFING 0{currentStep + 1}
              </span>

              <h1>{currentMessage.title}</h1>

              <p>{displayedText}</p>

              {/* Voice controls */}
              <div className="speech-controls">
                <button
                  className="voice-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setHasInteracted(true);
                    speakMessage(currentMessage);
                  }}
                >
                  <Volume2 size={18} />
                  Replay ORBI
                </button>

                <button
                  className="stop-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStop();
                  }}
                  disabled={!speaking}
                  aria-label="Stop voice"
                >
                  <Square size={15} />
                </button>
              </div>

              {speechError && (
                <p className="speech-error" role="alert">
                  {speechError}
                </p>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Progress */}
          <div className="briefing-progress">
            <div className="progress-info">
              <span>MISSION PREPARATION</span>
              <span>
                {currentStep + 1} / {howToPlayMessages.length}
              </span>
            </div>

            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="briefing-navigation">
            <button
              className="previous-button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
              disabled={currentStep === 0}
            >
              <ChevronLeft size={18} />
              Previous
            </button>

            {currentStep < howToPlayMessages.length - 1 ? (
              <button
                className="next-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
              >
                Next
                <ChevronRight size={18} />
              </button>
            ) : (
              <button
  className="next-button"
  onClick={(e) => {
    e.stopPropagation();
    handleStop();
    onAcceptMission?.();
  }}
>
  I'm Ready
  <Rocket size={18} />
</button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mission-footer">
        <span>ORBITED SPACE ACADEMY</span>
        <span>EXPLORE • BUILD • SURVIVE</span>
      </footer>
    </main>
  );
}

export default HowToPlay;