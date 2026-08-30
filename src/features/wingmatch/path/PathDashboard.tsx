import { useState } from "react";
import CoursePlan from "./CoursePlan";
import ActivityPlan from "./ActivityPlan";
import LeadershipPlan from "./LeadershipPlan";
import CollegeMatch from "./CollegeMatch";
import ReadinessPlan from "./ReadinessPlan";
import FinalDecision from "./FinalDecision";
import "./path.css";

export type FlightSection =
  | "academics"
  | "activities"
  | "leadership"
  | "colleges"
  | "readiness"
  | "decide";

interface PathDashboardProps {
  wingName?: string;
  major?: string;
  grade?: number;
  onBack?: () => void;
  onOpenSection?: (
    section: FlightSection,
  ) => void;
}

const flightCards: {
  id: FlightSection;
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  outcome: string;
}[] = [
  {
    id: "academics",
    number: "01",
    eyebrow: "ACADEMICS",
    title:
      "Build your academic runway.",
    description:
      "See which high-school courses best support your intended major, your Wing, and the level of rigor expected by selective colleges.",
    outcome:
      "Classes → priorities → 12th-grade plan",
  },

  {
    id: "activities",
    number: "02",
    eyebrow: "ACTIVITIES",
    title:
      "Choose activities that actually fit.",
    description:
      "Move beyond joining random clubs. Find activities that connect your interests to projects, competitions, research, and real evidence.",
    outcome:
      "Join → build → deepen",
  },

  {
    id: "leadership",
    number: "03",
    eyebrow: "LEADERSHIP",
    title:
      "Turn participation into impact.",
    description:
      "Identify where you can lead a team, create something new, teach others, organize a project, or improve an existing community.",
    outcome:
      "Participate → lead → create impact",
  },

  {
    id: "colleges",
    number: "04",
    eyebrow: "COLLEGE MATCH",
    title:
      "Find colleges where your Wing can grow.",
    description:
      "Explore schools by major strength, aerospace opportunities, academics, location, cost, and official admissions data.",
    outcome:
      "Major → school → admissions profile",
  },

  {
    id: "readiness",
    number: "05",
    eyebrow: "READINESS",
    title:
      "See the gap between now and your targets.",
    description:
      "Compare your academic preparation with official college data without pretending admissions can be reduced to a fake acceptance probability.",
    outcome:
      "GPA + SAT/ACT + rigor + evidence + leadership",
  },

  {
    id: "decide",
    number: "06",
    eyebrow: "FINAL DECISION",
    title:
      "Choose the college that fits you.",
    description:
      "When offers arrive, compare program strength, cost, research, internships, career access, location, and personal priorities.",
    outcome:
      "Compare offers → weight priorities → decide",
  },
];

function PathDashboard({
  wingName = "Systems Engineering",
  major = "Aerospace Engineering",
  grade = 11,
  onBack,
  onOpenSection,
}: PathDashboardProps) {
  const [activeSection, setActiveSection] =
    useState<FlightSection | null>(null);

  if (activeSection === "academics") {
    return (
      <CoursePlan
        wingName={wingName}
        major={major}
        grade={grade}
        onBack={() =>
          setActiveSection(null)
        }
      />
    );
  }

  if (activeSection === "activities") {
    return (
      <ActivityPlan
        wingName={wingName}
        major={major}
        onBack={() =>
          setActiveSection(null)
        }
      />
    );
  }

  if (activeSection === "leadership") {
    return (
      <LeadershipPlan
        wingName={wingName}
        major={major}
        onBack={() =>
          setActiveSection(null)
        }
      />
    );
  }

  if (activeSection === "colleges") {
    return (
      <CollegeMatch
        major={major}
        onAnalyzeReadiness={() =>
          setActiveSection(
            "readiness",
          )
        }
        onBack={() =>
          setActiveSection(null)
        }
      />
    );
  }

  if (activeSection === "readiness") {
    return (
      <ReadinessPlan
        major={major}
        onBack={() =>
          setActiveSection(null)
        }
      />
    );
  }

  if (activeSection === "decide") {
    return (
      <FinalDecision
        major={major}
        onBack={() =>
          setActiveSection(null)
        }
      />
    );
  }
  return (
    <main className="path-shell">
      <header className="path-nav">
        <button
          type="button"
          onClick={onBack}
          disabled={!onBack}
        >
          ← Back
        </button>

        <strong>
          Alt<span>Wing</span>
        </strong>
      </header>

      <section className="path-hero">
        <span className="path-kicker">
          MY FLIGHT PLAN
        </span>

        <h1>
          You found a Wing.
          <br />
          Now build a path around it.
        </h1>

        <p>
          AltWing should not stop at
          telling you what interests you.
          Build the classes, activities,
          leadership, college strategy,
          and decisions that turn that
          interest into a real direction.
        </p>

        <div className="path-profile">
          <div>
            <span>WING</span>
            <strong>{wingName}</strong>
          </div>

          <div>
            <span>INTENDED MAJOR</span>
            <strong>{major}</strong>
          </div>

          <div>
            <span>GRADE</span>
            <strong>{grade}</strong>
          </div>
        </div>
      </section>

      <section className="path-grid">
        {flightCards.map((card) => (
          <article
            key={card.id}
            className={`path-card path-card-${card.id}`}
          >
            <div className="path-card-top">
              <span className="path-number">
                {card.number}
              </span>

              <span className="path-card-eyebrow">
                {card.eyebrow}
              </span>
            </div>

            <div className="path-card-body">
              <h2>{card.title}</h2>

              <p>{card.description}</p>
            </div>

            <div className="path-card-bottom">
              <span>
                {card.outcome}
              </span>

              <button
                type="button"
                onClick={() => {
                  if (onOpenSection) {
                    onOpenSection(card.id);
                    return;
                  }

                  if (
                    card.id === "academics" ||
                    card.id === "activities" ||
                    card.id === "leadership" ||
                    card.id === "colleges" ||
                    card.id === "readiness" ||
                    card.id === "decide"
                  ) {
                    setActiveSection(card.id);
                  }
                }}
                disabled={
                  !onOpenSection &&
                  card.id !== "academics" &&
                  card.id !== "activities" &&
                  card.id !== "leadership" &&
                  card.id !== "colleges" &&
                  card.id !== "readiness" &&
                  card.id !== "decide"
                }
              >
                Explore →
              </button>
            </div>
          </article>
        ))}
      </section>

      <section className="path-principle">
        <span>
          ALTWING PRINCIPLE
        </span>

        <h2>
          Don't collect activities.
          Build a direction.
        </h2>

        <p>
          The strongest path is not the
          one with the most AP classes,
          clubs, or awards. It is the one
          where your academic choices,
          projects, leadership, and
          college goals begin to tell the
          same story.
        </p>
      </section>
    </main>
  );
}

export default PathDashboard;
