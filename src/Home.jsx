import {
  Hammer,
  Telescope,
  Target,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

import "./home.css";
const experiences = [
  {
    number: "01",
    title: "BUILD",
    subtitle: "Create Your Own World",
    description:
      "Build your lunar environment and turn your imagination into reality.",
    color: "purple",
    icon: Hammer,
    link: "https://build-16nl.vercel.app/",
  },
  {
    number: "02",
    title: "DISCOVERY",
    subtitle: "Explore The Unknown",
    description: "Discover the mysteries of the Moon and explore the unknown.",
    color: "blue",
    icon: Telescope,
    link: "https://discover-git-main-shrouq-dev.vercel.app/",
  },
  {
    number: "03",
    title: "MISSION",
    subtitle: "Solve The Challenges",
    description: "Complete exciting challenges and prove your skills.",
    color: "orange",
    icon: Target,
    link: "https://missions-4qwcmsz0d-shrouq-dev.vercel.app/",
  },
];

export default function Home() {
  return (
    <main className="home-page">
      <div className="experiences">
        {experiences.map((item) => {
          const Icon = item.icon;

          return (
            <div className={`experience-card ${item.color}`} key={item.title}>
              <div className="card-top">
                <span className="card-number">
                  <span className="number-icon">◇</span>
                  {item.number}
                </span>

                <span className="card-tag">{item.title}</span>
              </div>

              <div className="icon-area">
                <div className="orbit"></div>

                <div className="icon-box">
                  <Icon size={58} strokeWidth={1.7} />
                </div>

                <Sparkles className="sparkle" size={22} />
              </div>

              <div className="card-content">
                <h2>{item.title}</h2>

                <h3>{item.subtitle}</h3>

                <p>{item.description}</p>
              </div>

              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="enter-button"
              >
                <span>Enter Experience</span>
                <ArrowUpRight size={21} />
              </a>
            </div>
          );
        })}
      </div>
    </main>
  );
}
