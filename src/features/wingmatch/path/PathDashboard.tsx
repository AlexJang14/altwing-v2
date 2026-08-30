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


interface ExplorerProfile {
  grade: string;
  state: string;
  major: string;
  experience: string;
}


const EXPLORER_PROFILE_KEY =
  "altwing-explorer-profile-v1";


const DEFAULT_EXPLORER_PROFILE:
  ExplorerProfile = {
  grade: "",
  state: "",
  major: "",
  experience: "",
};


const US_STATES = [
  ["", "Choose later"],
  ["AL", "Alabama"],
  ["AK", "Alaska"],
  ["AZ", "Arizona"],
  ["AR", "Arkansas"],
  ["CA", "California"],
  ["CO", "Colorado"],
  ["CT", "Connecticut"],
  ["DE", "Delaware"],
  ["FL", "Florida"],
  ["GA", "Georgia"],
  ["HI", "Hawaii"],
  ["ID", "Idaho"],
  ["IL", "Illinois"],
  ["IN", "Indiana"],
  ["IA", "Iowa"],
  ["KS", "Kansas"],
  ["KY", "Kentucky"],
  ["LA", "Louisiana"],
  ["ME", "Maine"],
  ["MD", "Maryland"],
  ["MA", "Massachusetts"],
  ["MI", "Michigan"],
  ["MN", "Minnesota"],
  ["MS", "Mississippi"],
  ["MO", "Missouri"],
  ["MT", "Montana"],
  ["NE", "Nebraska"],
  ["NV", "Nevada"],
  ["NH", "New Hampshire"],
  ["NJ", "New Jersey"],
  ["NM", "New Mexico"],
  ["NY", "New York"],
  ["NC", "North Carolina"],
  ["ND", "North Dakota"],
  ["OH", "Ohio"],
  ["OK", "Oklahoma"],
  ["OR", "Oregon"],
  ["PA", "Pennsylvania"],
  ["RI", "Rhode Island"],
  ["SC", "South Carolina"],
  ["SD", "South Dakota"],
  ["TN", "Tennessee"],
  ["TX", "Texas"],
  ["UT", "Utah"],
  ["VT", "Vermont"],
  ["VA", "Virginia"],
  ["WA", "Washington"],
  ["WV", "West Virginia"],
  ["WI", "Wisconsin"],
  ["WY", "Wyoming"],
  ["DC", "Washington, DC"],
] as const;


function readExplorerProfile():
  ExplorerProfile {

  try {
    const raw =
      localStorage.getItem(
        EXPLORER_PROFILE_KEY,
      );

    if (!raw) {
      return {
        ...DEFAULT_EXPLORER_PROFILE,
      };
    }

    return {
      ...DEFAULT_EXPLORER_PROFILE,
      ...JSON.parse(raw),
    };

  } catch {
    return {
      ...DEFAULT_EXPLORER_PROFILE,
    };
  }
}


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


const ALTWING_SELECTED_WING_KEY =
  "altwing-selected-wing-v1";

const ALTWING_WINGMATCH_STATE_KEY =
  "altwing-wingmatch-v3-state";

const ALTWING_WING_NAMES:
  Record<string, string> = {
  systems:
    "Systems Engineering",

  gnc:
    "Guidance, Navigation & Control",

  avionics:
    "Avionics",

  structures:
    "Structures",

  thermal:
    "Thermal Engineering",

  propulsion:
    "Propulsion",

  "mission-design":
    "Mission Design",
};


function readPersistedWingName():
  string | null {

  try {
    /*
     * First priority:
     * a Wing the student explicitly chose
     * on the WingMatch result screen.
     */
    const selected =
      localStorage.getItem(
        ALTWING_SELECTED_WING_KEY,
      );

    if (selected) {
      if (
        ALTWING_WING_NAMES[
          selected
        ]
      ) {
        return (
          ALTWING_WING_NAMES[
            selected
          ]
        );
      }

      if (
        Object.values(
          ALTWING_WING_NAMES,
        ).includes(
          selected,
        )
      ) {
        return selected;
      }
    }


    /*
     * Migration / recovery:
     * old WingMatch sessions already
     * stored wingScores, so recover
     * the strongest completed result.
     */
    const raw =
      localStorage.getItem(
        ALTWING_WINGMATCH_STATE_KEY,
      );

    if (!raw) {
      return null;
    }

    const parsed =
      JSON.parse(
        raw,
      ) as {
        wingScores?:
          Record<
            string,
            number
          >;
      };


    const ranked =
      Object.entries(
        parsed.wingScores ??
          {},
      )
        .filter(
          (
            [, score],
          ) =>
            typeof score ===
            "number",
        )
        .sort(
          (
            [, a],
            [, b],
          ) =>
            b - a,
        );


    const topWingId =
      ranked[0]?.[0];

    if (!topWingId) {
      return null;
    }

    return (
      ALTWING_WING_NAMES[
        topWingId
      ] ??
      null
    );

  } catch {
    return null;
  }
}


function PathDashboard({
  wingName = "Not selected yet",
  major = "Aerospace Engineering",
  grade = 0,
  onBack,
  onOpenSection,
}: PathDashboardProps) {
  const [activeSection, setActiveSection] =
    useState<FlightSection | null>(null);

  const FLIGHT_PLAN_SCROLL_KEY =
    "altwing-flight-plan-scroll";


  function openFlightSection(
    section:
      FlightSection,
  ) {

    sessionStorage.setItem(
      FLIGHT_PLAN_SCROLL_KEY,
      String(
        window.scrollY,
      ),
    );

    setActiveSection(
      section,
    );

    window.scrollTo({
      top: 0,
      behavior: "auto",
    });
  }


  function returnToFlightPlan() {

    const savedPosition =
      Number(
        sessionStorage.getItem(
          FLIGHT_PLAN_SCROLL_KEY,
        ) ?? 0,
      );


    setActiveSection(
      null,
    );


    /*
     * Wait until the Flight Plan
     * has rendered again before
     * restoring the old position.
     */
    requestAnimationFrame(
      () => {
        requestAnimationFrame(
          () => {
            window.scrollTo({
              top:
                savedPosition,
              behavior:
                "auto",
            });
          },
        );
      },
    );
  }

  const [
    explorerProfile,
    setExplorerProfile,
  ] =
    useState<ExplorerProfile>(
      () =>
        readExplorerProfile(),
    );


  const [
    profileOpen,
    setProfileOpen,
  ] =
    useState(true);


  function updateExplorerProfile(
    key:
      keyof ExplorerProfile,

    value:
      string,
  ) {

    const next = {
      ...explorerProfile,
      [key]:
        value,
    };


    setExplorerProfile(
      next,
    );


    localStorage.setItem(
      EXPLORER_PROFILE_KEY,
      JSON.stringify(
        next,
      ),
    );


    /*
     * Opportunity Radar already
     * reads this state preference.
     */
    if (
      key === "state"
    ) {
      if (value) {
        localStorage.setItem(
          "altwing-opportunity-state",
          value,
        );
      } else {
        localStorage.removeItem(
          "altwing-opportunity-state",
        );
      }
    }
  }

  const resolvedWingName =
    wingName.trim() &&
    !wingName
      .toLowerCase()
      .startsWith(
        "not selected",
      )
      ? wingName
      : (
          readPersistedWingName() ??
          "Not selected yet"
        );



  const resolvedMajor =
    explorerProfile.major ||
    major;


  const resolvedGrade =
    explorerProfile.grade
      ? Number(
          explorerProfile.grade,
        )
      : grade;

  if (activeSection === "academics") {
    return (
      <CoursePlan
        wingName={resolvedWingName}
        major={resolvedMajor}
        grade={resolvedGrade}
        onBack={() =>
          returnToFlightPlan()
        }
      />
    );
  }

  if (activeSection === "activities") {
    return (
      <ActivityPlan
        wingName={resolvedWingName}
        major={resolvedMajor}
        onBack={() =>
          returnToFlightPlan()
        }
      />
    );
  }

  if (activeSection === "leadership") {
    return (
      <LeadershipPlan
        wingName={resolvedWingName}
        major={resolvedMajor}
        onBack={() =>
          returnToFlightPlan()
        }
      />
    );
  }

  if (activeSection === "colleges") {
    return (
      <CollegeMatch
        major={resolvedMajor}
        onAnalyzeReadiness={() =>
          setActiveSection(
            "readiness",
          )
        }
        onBack={() =>
          returnToFlightPlan()
        }
      />
    );
  }

  if (activeSection === "readiness") {
    return (
      <ReadinessPlan
        major={resolvedMajor}
        onBack={() =>
          returnToFlightPlan()
        }
      />
    );
  }

  if (activeSection === "decide") {
    return (
      <FinalDecision
        major={resolvedMajor}
        onBack={() =>
          returnToFlightPlan()
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
          Build your flight plan.
          <br />
          Start anywhere.
        </h1>

        <p>
          Explore academics, activities,
          leadership, colleges, readiness,
          and final decisions. You can use
          WingMatch first for a personalized
          direction, or explore the path
          before choosing a Wing.
        </p>

        <div className="path-profile">
          <div>
            <span>WING</span>
            <strong>{resolvedWingName}</strong>
          </div>

          <div>
            <span>INTENDED MAJOR</span>
            <strong>{resolvedMajor}</strong>
          </div>

          <div>
            <span>GRADE</span>
            <strong>
              {resolvedGrade > 0
                ? resolvedGrade
                : "Add later"}
            </strong>
          </div>
        </div>
      </section>


      <section className="explorer-profile-card">

        <div className="explorer-profile-heading">

          <div>

            <span>
              OPTIONAL PROFILE
            </span>

            <h2>
              Tell us a little
              about yourself.
            </h2>

            <p>
              This helps AltWing
              personalize courses,
              opportunities, and
              college exploration.
              It does not change
              your WingMatch score.
            </p>

          </div>


          <button
            type="button"
            onClick={() =>
              setProfileOpen(
                !profileOpen,
              )
            }
          >
            {profileOpen
              ? "Hide"
              : "Add info"}
          </button>

        </div>


        {profileOpen && (
          <div className="explorer-profile-form">

            <label>

              <span>
                GRADE
              </span>

              <select
                value={
                  explorerProfile
                    .grade
                }
                onChange={(
                  event,
                ) =>
                  updateExplorerProfile(
                    "grade",
                    event.target
                      .value,
                  )
                }
              >

                <option value="">
                  Choose later
                </option>

                <option value="8">
                  Grade 8
                </option>

                <option value="9">
                  Grade 9
                </option>

                <option value="10">
                  Grade 10
                </option>

                <option value="11">
                  Grade 11
                </option>

                <option value="12">
                  Grade 12
                </option>

              </select>

            </label>


            <label>

              <span>
                STATE
              </span>

              <select
                value={
                  explorerProfile
                    .state
                }
                onChange={(
                  event,
                ) =>
                  updateExplorerProfile(
                    "state",
                    event.target
                      .value,
                  )
                }
              >

                {US_STATES.map(
                  (
                    [
                      code,
                      name,
                    ],
                  ) => (
                    <option
                      key={
                        code ||
                        "none"
                      }
                      value={code}
                    >
                      {name}
                    </option>
                  ),
                )}

              </select>

            </label>


            <label>

              <span>
                WHAT ARE YOU
                EXPLORING?
              </span>

              <select
                value={
                  explorerProfile
                    .major
                }
                onChange={(
                  event,
                ) =>
                  updateExplorerProfile(
                    "major",
                    event.target
                      .value,
                  )
                }
              >

                <option value="">
                  Not sure yet
                </option>

                <option value="Aerospace Engineering">
                  Aerospace Engineering
                </option>

                <option value="Mechanical Engineering">
                  Mechanical Engineering
                </option>

                <option value="Physics">
                  Physics
                </option>

                <option value="Astronomy / Astrophysics">
                  Astronomy / Astrophysics
                </option>

              </select>

            </label>


            <label>

              <span>
                EXPERIENCE
              </span>

              <select
                value={
                  explorerProfile
                    .experience
                }
                onChange={(
                  event,
                ) =>
                  updateExplorerProfile(
                    "experience",
                    event.target
                      .value,
                  )
                }
              >

                <option value="">
                  Choose later
                </option>

                <option value="beginner">
                  New to aerospace
                </option>

                <option value="exploring">
                  Tried a few things
                </option>

                <option value="builder">
                  Building projects already
                </option>

              </select>

            </label>

          </div>
        )}


        <p className="explorer-profile-note">
          Optional — you can use
          AltWing without sharing
          any of this information.
        </p>

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
                    openFlightSection(card.id);
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
