import "./wingmatch-result.css";

export interface ResultTelemetryItem {
  label: string;
  value: string;
  status?: string;
}

export interface ResultMissionHistoryItem {
  sceneId: string;
  phase: string;
  title: string;
  consequence: string;
  effects: ResultTelemetryItem[];
}

interface WingMatchResultProps {
  wingScores: Partial<
    Record<string, number>
  >;

  reasoningScores: Partial<
    Record<string, number>
  >;

  missionHistory:
    ResultMissionHistoryItem[];

  onRestart?: () => void;
  onContinue?: () => void;
}

interface WingProfile {
  id: string;
  name: string;
  shortName: string;
  description: string;

  major:
    | string
    | string[];

  projectTitle: string;
  projectDescription: string;

  extracurricular:
    string;

  courses: string[];

  evidenceKeywords: string[];
}

const wingProfiles: Record<
  string,
  WingProfile
> = {
  systems: {
    id: "systems",
    name: "Systems Engineering",
    shortName: "SYSTEMS",

    description:
      "You tend to look across the whole mission, balance competing constraints, and ask how one decision changes the rest of the system.",

    major: [
      "Aerospace Engineering",
      "Systems Engineering",
      "Industrial Engineering",
    ],

    projectTitle:
      "Build a Mission Tradeoff Simulator",

    projectDescription:
      "Create a small simulator where mass, power, thermal margin, reliability, and mission value compete for limited resources. Let users change assumptions and watch the best plan change.",

    extracurricular:
      "Turn the simulator into a documented engineering project, publish it on GitHub, test it with other students, and present the design decisions through TSA, a science fair, engineering club, or independent research portfolio.",

    courses: [
      "AP Calculus",
      "Physics",
      "Computer Science",
      "Engineering Design",
    ],

    evidenceKeywords: [
      "THERMAL",
      "LANDING",
      "MISSION COMMAND",
      "SYSTEM",
    ],
  },

  gnc: {
    id: "gnc",
    name:
      "Guidance, Navigation & Control",
    shortName: "GNC",

    description:
      "You show interest in how a vehicle senses its state, corrects errors, and stays on the desired trajectory under uncertainty.",

    major: [
      "Aerospace Engineering",
      "Mechanical Engineering",
      "Robotics",
    ],

    projectTitle:
      "Build a Lander Control Simulator",

    projectDescription:
      "Model a simplified lander trying to reach a target attitude or altitude. Let the user tune controller gain and visualize overshoot, settling time, and stability.",

    extracurricular:
      "Develop the simulator into an engineering portfolio project with experiments, graphs, design iterations, and a short technical report. It can support TSA, robotics, aerospace club, or research applications.",

    courses: [
      "AP Calculus BC",
      "AP Physics",
      "Computer Science",
      "Linear Algebra later",
    ],

    evidenceKeywords: [
      "ENTRY",
      "SENSOR",
      "CONTROL",
      "LANDING",
    ],
  },

  avionics: {
    id: "avionics",
    name:
      "Avionics & Embedded Systems",
    shortName: "AVIONICS",

    description:
      "You tend to investigate signals, electronics, communication paths, and sensor evidence before deciding what failed.",

    major: [
      "Aerospace Engineering",
      "Electrical Engineering",
      "Computer Engineering",
    ],

    projectTitle:
      "Build a Spacecraft Fault Detective",

    projectDescription:
      "Create a diagnostic system that receives simulated spacecraft telemetry and asks the user or an algorithm to isolate sensor, communication, power, or computer faults.",

    extracurricular:
      "Turn the diagnostic tool into a technical demonstration with test cases and fault-injection experiments. Publish the results and use them for TSA, robotics, engineering competitions, or independent research.",

    courses: [
      "Physics",
      "Computer Science",
      "Electronics",
      "Engineering",
    ],

    evidenceKeywords: [
      "SENSOR",
      "AVIONICS",
      "FAULT",
      "COMM",
    ],
  },

  structures: {
    id: "structures",
    name:
      "Aerospace Structures",
    shortName: "STRUCTURES",

    description:
      "You focus on how forces move through a vehicle and how engineers trade mass against strength, stiffness, and failure risk.",

    major: [
      "Aerospace Engineering",
      "Mechanical Engineering",
      "Materials Engineering",
    ],

    projectTitle:
      "Design the Lightest Safe Lander Leg",

    projectDescription:
      "Create several landing-leg designs, estimate their load paths, compare buckling risk and mass, and justify which structure you would actually build.",

    extracurricular:
      "Document CAD versions, calculations, failure assumptions, and design changes. The project can become a TSA engineering design entry, science fair project, CAD portfolio piece, or research starter.",

    courses: [
      "AP Physics",
      "Calculus",
      "Engineering",
      "CAD",
    ],

    evidenceKeywords: [
      "STRUCTURAL",
      "LOAD",
      "LANDING",
    ],
  },

  thermal: {
    id: "thermal",
    name:
      "Thermal Engineering",
    shortName: "THERMAL",

    description:
      "You pay attention to heat, energy limits, margins, and how protecting one subsystem can create risk somewhere else.",

    major: [
      "Aerospace Engineering",
      "Mechanical Engineering",
    ],

    projectTitle:
      "Design a Small-Satellite Thermal Model",

    projectDescription:
      "Model how a CubeSat heats and cools in sunlight and eclipse. Explore how insulation, radiators, electronics power, and orbit assumptions change temperature.",

    extracurricular:
      "Turn the model into a simulation study with plots, design recommendations, and documented assumptions for an engineering portfolio, science fair, or aerospace research application.",

    courses: [
      "Physics",
      "Calculus",
      "Chemistry",
      "Engineering",
    ],

    evidenceKeywords: [
      "THERMAL",
      "POWER",
      "MISSION COMMAND",
    ],
  },

  propulsion: {
    id: "propulsion",
    name:
      "Propulsion & Energy Systems",
    shortName: "PROPULSION",

    description:
      "You pay attention to the energy required to move a vehicle and the tradeoff between performance, efficiency, heat, and remaining reserves.",

    major: [
      "Aerospace Engineering",
      "Mechanical Engineering",
    ],

    projectTitle:
      "Build a Rocket Performance Explorer",

    projectDescription:
      "Create a simulation that compares vehicle mass, thrust, burn time, efficiency, and mission requirements without building an actual rocket.",

    extracurricular:
      "Turn the model into a safe computational aerospace project with scenario testing, graphs, and technical documentation for competitions, research portfolios, or aerospace clubs.",

    courses: [
      "Physics",
      "Calculus",
      "Chemistry",
      "Computer Science",
    ],

    evidenceKeywords: [
      "ENTRY",
      "THERMAL",
      "MISSION COMMAND",
    ],
  },

  "mission-design": {
    id: "mission-design",
    name:
      "Mission Design & Space Operations",
    shortName: "MISSION DESIGN",

    description:
      "You tend to think about the mission objective itself: where to go, what to prioritize, what risk is acceptable, and what makes the mission worthwhile.",

    major: [
      "Aerospace Engineering",
      "Astronomy / Astrophysics",
      "Systems Engineering",
    ],

    projectTitle:
      "Design a Complete Mars Micro-Mission",

    projectDescription:
      "Choose a scientific objective, landing region, spacecraft constraints, instruments, operating timeline, and mission tradeoffs. Explain why your mission deserves to exist.",

    extracurricular:
      "Develop it into a mission proposal with maps, CAD or diagrams, trade studies, and a written design review. This can support aerospace competitions, science fairs, research programs, or an independent project portfolio.",

    courses: [
      "Physics",
      "Calculus",
      "Astronomy",
      "Engineering",
    ],

    evidenceKeywords: [
      "LANDING",
      "MISSION",
      "SCIENCE",
    ],
  },
};

const reasoningLabels:
  Record<string, string> = {
    "systems-integration":
      "Systems Integration",

    "mission-tradeoffs":
      "Tradeoff Reasoning",

    optimization:
      "Optimization",

    iteration:
      "Iterative Testing",

    "quantitative-reasoning":
      "Quantitative Reasoning",

    "feedback-control":
      "Feedback Thinking",

    "thermal-reasoning":
      "Thermal Reasoning",

    "risk-tolerance":
      "Risk Judgment",
  };

function humanizeKey(
  key: string,
) {
  return (
    reasoningLabels[key] ??
    key
      .split("-")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() +
          word.slice(1),
      )
      .join(" ")
  );
}

function rankScores(
  scores:
    Partial<
      Record<string, number>
    >,
) {
  return Object.entries(scores)
    .filter(
      (
        entry,
      ): entry is [
        string,
        number,
      ] =>
        typeof entry[1] ===
          "number" &&
        entry[1] > 0,
    )
    .sort(
      (a, b) =>
        b[1] - a[1],
    );
}

function getProfile(
  id: string,
): WingProfile {
  return (
    wingProfiles[id] ?? {
      id,

      name: humanizeKey(id),

      shortName:
        humanizeKey(
          id,
        ).toUpperCase(),

      description:
        "Your mission behavior produced a meaningful signal in this aerospace pathway.",

      major:
        "Aerospace Engineering",

      projectTitle:
        "Build an Aerospace Investigation",

      projectDescription:
        "Turn one of the mission problems into a real technical project, test multiple approaches, and document what you learned.",

      extracurricular:
        "Document the work, publish the evidence, and develop it into an engineering portfolio activity.",

      courses: [
        "Calculus",
        "Physics",
        "Computer Science",
        "Engineering",
      ],

      evidenceKeywords: [],
    }
  );
}

function WingMatchResult({
  wingScores,
  reasoningScores,
  missionHistory,
  onRestart,
  onContinue,
}: WingMatchResultProps) {
  const rankedWings =
    rankScores(wingScores);

  const rankedReasoning =
    rankScores(
      reasoningScores,
    );

  const maxWingScore =
    rankedWings[0]?.[1] ?? 1;

  const topWings =
    rankedWings
      .slice(0, 3)
      .map(
        ([id, score]) => ({
          profile:
            getProfile(id),

          score,

          relativeStrength:
            Math.round(
              (score /
                maxWingScore) *
                100,
            ),
        }),
      );

  const primaryWing =
    topWings[0]?.profile ??
    getProfile("systems");

  const primaryScore =
    topWings[0]?.score ?? 0;

  const alternateWings =
    topWings.slice(1);

  const topReasoning =
    rankedReasoning.slice(
      0,
      4,
    );

  const maxReasoningScore =
    topReasoning[0]?.[1] ??
    1;

  function reasoningSignal(
    score: number,
  ) {
    const ratio =
      score /
      maxReasoningScore;

    if (ratio >= 0.8) {
      return "STRONG SIGNAL";
    }

    if (ratio >= 0.55) {
      return "SUPPORTING SIGNAL";
    }

    return "EMERGING SIGNAL";
  }

  /*
   * Prioritize the interactive
   * decisions students actually
   * remember making.
   */
  const preferredSceneIds = [
    "thermal-management",
    "landing-site-selection",
    "avionics-fault-isolation",
    "mission-command",
  ];

  const priorityEvidence =
    preferredSceneIds
      .map((sceneId) =>
        [...missionHistory]
          .reverse()
          .find(
            (item) =>
              item.sceneId ===
              sceneId,
          ),
      )
      .filter(
        (
          item,
        ): item is
          ResultMissionHistoryItem =>
          Boolean(item),
      );

  const prioritySceneIds =
    new Set(
      priorityEvidence.map(
        (item) =>
          item.sceneId,
      ),
    );

  const fallbackEvidence =
    [...missionHistory]
      .reverse()
      .filter(
        (item) =>
          !prioritySceneIds.has(
            item.sceneId,
          ),
      );

  const evidenceToShow = [
    ...priorityEvidence,
    ...fallbackEvidence,
  ].slice(0, 4);

  return (
    <main className="result-shell">
      <section className="result-reveal">
        <div className="result-reveal__kicker">
          MISSION COMPLETE
        </div>

        <div className="result-reveal__label">
          YOUR WING
        </div>

        <h1>
          {primaryWing.name}
        </h1>

        <p className="result-reveal__description">
          {
            primaryWing.description
          }
        </p>

        <div className="result-reveal__rule" />

        <p className="result-reveal__method">
          This is not a personality
          label. It is the strongest
          pattern produced by the
          decisions you made during
          this mission.
        </p>

        <div className="result-reveal__signal">
          <span>
            PRIMARY EVIDENCE SIGNAL
          </span>

          <strong>
            {primaryScore} pts
          </strong>
        </div>
      </section>

      <section className="result-section">
        <div className="result-section-heading">
          <span>
            01 / WHY THIS WING
          </span>

          <h2>
            Your decisions left
            evidence.
          </h2>

          <p>
            These are choices you
            actually made during the
            mission — not answers to
            personality questions.
          </p>
        </div>

        <div className="result-debrief-list">
          {evidenceToShow.map(
            (
              item,
              index,
            ) => (
              <article
                className="result-debrief-card"
                key={
                  `${item.sceneId}-${index}`
                }
              >
                <div className="result-debrief-card__top">
                  <div>
                    <span>
                      {String(
                        index + 1,
                      ).padStart(
                        2,
                        "0",
                      )}
                      {" / "}
                      {item.phase}
                    </span>

                    <h3>
                      {item.title}
                    </h3>
                  </div>

                  <div className="result-debrief-card__status">
                    DECISION EVIDENCE
                  </div>
                </div>

                <p>
                  {
                    item.consequence
                  }
                </p>

                {item.effects.length >
                  0 && (
                  <div className="result-evidence-metrics">
                    {item.effects
                      .slice(0, 5)
                      .map(
                        (
                          effect,
                          effectIndex,
                        ) => (
                          <div
                            className={[
                              "result-evidence-metric",

                              effect.status ===
                              "warning"
                                ? "result-evidence-metric--warning"
                                : "",
                            ]
                              .filter(
                                Boolean,
                              )
                              .join(
                                " ",
                              )}
                            key={
                              `${effect.label}-${effectIndex}`
                            }
                          >
                            <span>
                              {
                                effect.label
                              }
                            </span>

                            <strong>
                              {
                                effect.value
                              }
                            </strong>
                          </div>
                        ),
                      )}
                  </div>
                )}
              </article>
            ),
          )}
        </div>
      </section>

      <section className="result-section result-pattern-section">
        <div className="result-section-heading">
          <span>
            02 / YOUR ENGINEERING PATTERN
          </span>

          <h2>
            How you tended to
            reason.
          </h2>

          <p>
            These signals compare
            patterns inside your own
            mission run. They are not
            aptitude scores.
          </p>
        </div>

        <div className="reasoning-grid">
          {topReasoning.map(
            (
              [id, score],
              index,
            ) => (
              <article
                className="reasoning-card result-reasoning-card"
                key={id}
              >
                <span>
                  0{index + 1}
                </span>

                <strong>
                  {
                    humanizeKey(
                      id,
                    )
                  }
                </strong>

                <div className="result-reasoning-signal">
                  {
                    reasoningSignal(
                      score,
                    )
                  }
                </div>

                <small>
                  {score} evidence
                  points
                </small>
              </article>
            ),
          )}
        </div>
      </section>

      {alternateWings.length >
        0 && (
        <section className="result-section">
          <div className="result-section-heading">
            <span>
              03 / OTHER SIGNALS
            </span>

            <h2>
              You are not one
              fixed Wing.
            </h2>

            <p>
              Different decisions
              could strengthen
              different engineering
              pathways on another
              mission run.
            </p>
          </div>

          <div className="result-alternate-grid">
            {alternateWings.map(
              ({
                profile,
                score,
              }) => (
                <article
                  className="result-alternate-card"
                  key={
                    profile.id
                  }
                >
                  <span>
                    SUPPORTING WING
                  </span>

                  <h3>
                    {
                      profile.name
                    }
                  </h3>

                  <p>
                    {
                      profile.description
                    }
                  </p>

                  <small>
                    {score} evidence
                    points
                  </small>
                </article>
              ),
            )}
          </div>
        </section>
      )}

      <section className="result-section result-pathway">
        <div className="result-section-heading">
          <span>
            04 / TEST THIS WING
          </span>

          <h2>
            Don't believe the
            result. Build something
            and test it.
          </h2>
        </div>

        <div className="pathway-hero">
          <div>
            <span>
              PRIMARY WING
            </span>

            <h3>
              {primaryWing.name}
            </h3>

            <p>
              The next step is not
              another quiz. Build a
              small project that lets
              you experience this kind
              of engineering for real.
            </p>
          </div>

          <div className="pathway-majors">
            <span>
              RELATED MAJORS
            </span>

            {(Array.isArray(
              primaryWing.major,
            )
              ? primaryWing.major
              : [
                  primaryWing.major,
                ]
            ).map(
              (major) => (
                <strong
                  key={major}
                >
                  {major}
                </strong>
              ),
            )}
          </div>
        </div>

        <div className="result-project-focus">
          <span>
            YOUR 3-WEEK BUILD
          </span>

          <h3>
            {
              primaryWing.projectTitle
            }
          </h3>

          <p>
            {
              primaryWing.projectDescription
            }
          </p>

          <div>
            BUILD → TEST → ITERATE →
            DOCUMENT → SHARE
          </div>
        </div>

        <div className="action-grid">
          <article className="action-card">
            <span>
              MAKE IT REAL
            </span>

            <h3>
              Turn the project into
              evidence.
            </h3>

            <p>
              {
                primaryWing.extracurricular
              }
            </p>
          </article>

          <article className="action-card">
            <span>
              WHY THIS PROJECT
            </span>

            <h3>
              Test the pattern you
              just revealed.
            </h3>

            <p>
              Your mission behavior
              suggests this Wing is
              worth exploring. The
              build is how you find
              out whether you actually
              enjoy doing the work.
            </p>
          </article>
        </div>
      </section>

      <section className="result-section">
        <div className="result-section-heading">
          <span>
            05 / ACADEMIC RUNWAY
          </span>

          <h2>
            Prepare for the work,
            not just the major name.
          </h2>
        </div>

        <div className="college-launch-grid">
          <article>
            <span>
              HIGH-SCHOOL
              FOUNDATION
            </span>

            <div className="course-tags">
              {primaryWing.courses.map(
                (course) => (
                  <strong
                    key={course}
                  >
                    {course}
                  </strong>
                ),
              )}
            </div>
          </article>

          <article>
            <span>
              NEXT EVIDENCE
            </span>

            <h3>
              Leave proof behind.
            </h3>

            <p>
              Build something,
              test it, document what
              failed, and show what
              changed because of your
              decisions.
            </p>
          </article>
        </div>
      </section>

      <section className="result-footer result-footer--v3">
        <div>
          <span>
            EXPLORE. BUILD.
            LAUNCH.
          </span>

          <h2>
            Your Wing can change
            when your decisions
            change.
          </h2>

          <p>
            Replay the mission with
            different tradeoffs, or
            take this Wing into a real
            build.
          </p>
        </div>

        <div className="result-actions">
          {onRestart && (
            <button
              type="button"
              className="result-button result-button--secondary"
              onClick={
                onRestart
              }
            >
              Replay with different choices
            </button>
          )}

          {onContinue && (
            <button
              type="button"
              className="result-button result-button--primary"
              onClick={
                onContinue
              }
            >
              Build this Wing →
            </button>
          )}
        </div>
      </section>
    </main>
  );
}

export default WingMatchResult;