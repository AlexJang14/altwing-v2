import { useState, useEffect, useMemo } from "react";
import { awardMilestone } from "../../progression/progression";
import PathDashboard from "../path/PathDashboard";
interface LaunchPlanProps {
  wingId: string;
  wingName: string;
  project: string;
  onBack: () => void;
}

interface LaunchRoute {
  title: string;
  description: string;
  action: string;
}


interface BuildQuestProgress {
  routeIndex: number | null;
  completedWeeks: number[];
  evidence: Record<number, string>;
  completed: boolean;
}

interface WingLaunchPlan {
  routes: LaunchRoute[];
  monthPlan: {
    week: string;
    title: string;
    description: string;
  }[];
}

const launchPlans: Record<
  string,
  WingLaunchPlan
> = {
  systems: {
    routes: [
      {
        title: "GitHub Engineering Project",
        description:
          "Publish the simulator, assumptions, test scenarios, and V1 → V2 comparison.",
        action: "Create project README",
      },
      {
        title: "TSA / Engineering Design",
        description:
          "Turn the tradeoff simulator into a design project with requirements, alternatives, and evidence.",
        action: "Prepare competition version",
      },
      {
        title: "Research Extension",
        description:
          "Ask how changing uncertainty, mission priorities, or subsystem limits changes the recommended design.",
        action: "Write a research question",
      },
    ],

    monthPlan: [
      {
        week: "WEEK 01",
        title: "Polish the engineering model",
        description:
          "Replace weak assumptions, improve calculations, and make the simulator understandable to another student.",
      },
      {
        week: "WEEK 02",
        title: "Publish the evidence",
        description:
          "Create a GitHub README with the problem, constraints, screenshots, scenarios, and results.",
      },
      {
        week: "WEEK 03",
        title: "Get outside review",
        description:
          "Ask a teacher, engineer, mentor, or another student to test the model and give one specific critique.",
      },
      {
        week: "WEEK 04",
        title: "Launch V2",
        description:
          "Use the feedback to improve the project and submit, share, present, or expand it.",
      },
    ],
  },

  gnc: {
    routes: [
      {
        title: "Interactive Control Simulator",
        description:
          "Publish controller tuning experiments, response plots, and stability comparisons.",
        action: "Publish simulation",
      },
      {
        title: "Robotics Extension",
        description:
          "Apply the same feedback-control ideas to a robot, drone, or simulated autonomous vehicle.",
        action: "Design hardware extension",
      },
      {
        title: "GNC Investigation",
        description:
          "Study how disturbances, sensor noise, or different gains affect vehicle stability.",
        action: "Create experiment",
      },
    ],

    monthPlan: [
      {
        week: "WEEK 01",
        title: "Improve controller behavior",
        description:
          "Refine gains and document overshoot, settling time, error, and control effort.",
      },
      {
        week: "WEEK 02",
        title: "Publish response evidence",
        description:
          "Create graphs and a clear comparison of slow, balanced, and aggressive tuning.",
      },
      {
        week: "WEEK 03",
        title: "Add a disturbance",
        description:
          "Introduce noise, wind, sensor error, or another disturbance and evaluate robustness.",
      },
      {
        week: "WEEK 04",
        title: "Share the control project",
        description:
          "Publish the final simulator or connect it to a robotics, TSA, or engineering activity.",
      },
    ],
  },

  structures: {
    routes: [
      {
        title: "CAD Portfolio Project",
        description:
          "Publish the landing structure, load path, mass comparison, and V1 → V2 reinforcement.",
        action: "Publish CAD case study",
      },
      {
        title: "FEA Extension",
        description:
          "Use structural analysis software to investigate stress, displacement, or buckling.",
        action: "Add structural analysis",
      },
      {
        title: "Design Competition",
        description:
          "Turn the structure into a lightweight design challenge with measurable constraints.",
        action: "Prepare competition entry",
      },
    ],

    monthPlan: [
      {
        week: "WEEK 01",
        title: "Clean the CAD model",
        description:
          "Make geometry, dimensions, load paths, and structural assumptions easy to understand.",
      },
      {
        week: "WEEK 02",
        title: "Add quantitative evidence",
        description:
          "Compare mass, estimated loads, strength margin, or simulation results.",
      },
      {
        week: "WEEK 03",
        title: "Review the weak region",
        description:
          "Get feedback on the most critical structural member or joint.",
      },
      {
        week: "WEEK 04",
        title: "Publish the final design",
        description:
          "Document why V2 is stronger or more efficient than V1.",
      },
    ],
  },

  avionics: {
    routes: [
      {
        title: "Fault Detection Software",
        description:
          "Publish telemetry data, diagnostic logic, test cases, and false-alarm analysis.",
        action: "Publish software project",
      },
      {
        title: "Sensor Prototype",
        description:
          "Connect the diagnostic logic to Arduino, Raspberry Pi, or another sensor platform.",
        action: "Build hardware extension",
      },
      {
        title: "Embedded Systems Project",
        description:
          "Expand the software into a small autonomous monitoring or fault-response system.",
        action: "Design embedded version",
      },
    ],

    monthPlan: [
      {
        week: "WEEK 01",
        title: "Improve fault logic",
        description:
          "Refine thresholds and identify ambiguous diagnostic cases.",
      },
      {
        week: "WEEK 02",
        title: "Create test telemetry",
        description:
          "Build a clear healthy-vs-fault dataset and record diagnosis accuracy.",
      },
      {
        week: "WEEK 03",
        title: "Reduce false alarms",
        description:
          "Add stronger evidence rules or multiple-signal confirmation.",
      },
      {
        week: "WEEK 04",
        title: "Publish or prototype",
        description:
          "Release the software or connect it to a real sensor system.",
      },
    ],
  },

  thermal: {
    routes: [
      {
        title: "Thermal Simulation",
        description:
          "Publish temperature-over-time models, component limits, and cooling decisions.",
        action: "Publish thermal model",
      },
      {
        title: "Research Investigation",
        description:
          "Study how insulation, radiation, exposure time, or thermal-control power changes survival margin.",
        action: "Create research question",
      },
      {
        title: "Systems Extension",
        description:
          "Connect thermal decisions to spacecraft power, battery, and mission constraints.",
        action: "Expand system model",
      },
    ],

    monthPlan: [
      {
        week: "WEEK 01",
        title: "Improve thermal assumptions",
        description:
          "Review heating, cooling, temperature limits, and exposure assumptions.",
      },
      {
        week: "WEEK 02",
        title: "Create temperature evidence",
        description:
          "Generate plots comparing multiple thermal-control strategies.",
      },
      {
        week: "WEEK 03",
        title: "Stress-test the model",
        description:
          "Run a hotter, colder, or longer-duration mission case.",
      },
      {
        week: "WEEK 04",
        title: "Publish the investigation",
        description:
          "Turn the model and findings into a technical project page or research-style brief.",
      },
    ],
  },

  propulsion: {
    routes: [
      {
        title: "ΔV Mission Calculator",
        description:
          "Publish an interactive calculator comparing mission ΔV, Isp, mass, and propellant requirements.",
        action: "Publish calculator",
      },
      {
        title: "Mission Design Challenge",
        description:
          "Compare propulsion options for a real lunar, Mars, or orbital mission scenario.",
        action: "Create mission case",
      },
      {
        title: "Research Extension",
        description:
          "Investigate how propulsion assumptions change spacecraft architecture.",
        action: "Write trade-study question",
      },
    ],

    monthPlan: [
      {
        week: "WEEK 01",
        title: "Validate the equations",
        description:
          "Check ΔV, specific impulse, dry mass, and propellant calculations.",
      },
      {
        week: "WEEK 02",
        title: "Compare propulsion options",
        description:
          "Run high-thrust, high-efficiency, and balanced mission scenarios.",
      },
      {
        week: "WEEK 03",
        title: "Add mission realism",
        description:
          "Include reserve margin, maneuver requirements, or another realistic constraint.",
      },
      {
        week: "WEEK 04",
        title: "Publish the trade study",
        description:
          "Share the calculator, assumptions, results, and final propulsion recommendation.",
      },
    ],
  },

  "mission-design": {
    routes: [
      {
        title: "Mission Proposal",
        description:
          "Turn the architecture into a complete mission concept with objectives, constraints, and system decisions.",
        action: "Publish mission proposal",
      },
      {
        title: "Space Competition",
        description:
          "Adapt the architecture to a NASA-style challenge, competition, or student design program.",
        action: "Find submission path",
      },
      {
        title: "Mission Research",
        description:
          "Investigate how changing cost, risk, payload, or mission duration changes the preferred architecture.",
        action: "Create research extension",
      },
    ],

    monthPlan: [
      {
        week: "WEEK 01",
        title: "Strengthen the architecture",
        description:
          "Make objectives, constraints, alternatives, and decision criteria explicit.",
      },
      {
        week: "WEEK 02",
        title: "Create mission visuals",
        description:
          "Build a timeline, architecture diagram, or mission sequence.",
      },
      {
        week: "WEEK 03",
        title: "Challenge the assumptions",
        description:
          "Change one important mission assumption and determine whether the architecture still wins.",
      },
      {
        week: "WEEK 04",
        title: "Publish the proposal",
        description:
          "Package the architecture as a concise technical mission proposal.",
      },
    ],
  },
};

function LaunchPlan({
  wingId,
  wingName,
  project,
  onBack,
}: LaunchPlanProps) {
  const [showFlightPlan, setShowFlightPlan] =
    useState(false);
  const plan =
    launchPlans[wingId] ??
    launchPlans.systems;

  const BUILD_QUEST_STORAGE_KEY =
    `altwing-build-quest-${wingId}`;

  const [
    buildQuest,
    setBuildQuest,
  ] = useState<BuildQuestProgress>(
    () => {
      try {
        const raw =
          localStorage.getItem(
            BUILD_QUEST_STORAGE_KEY,
          );

        if (!raw) {
          return {
            routeIndex: null,
            completedWeeks: [],
            evidence: {},
            completed: false,
          };
        }

        return JSON.parse(
          raw,
        ) as BuildQuestProgress;
      } catch {
        return {
          routeIndex: null,
          completedWeeks: [],
          evidence: {},
          completed: false,
        };
      }
    },
  );

  const [
    draftEvidence,
    setDraftEvidence,
  ] = useState<
    Record<number, string>
  >(() => ({
    ...(buildQuest.evidence ?? {}),
  }));

  const [
    questAcceptedFlash,
    setQuestAcceptedFlash,
  ] = useState(false);

  const selectedRoute =
    useMemo(
      () =>
        buildQuest.routeIndex === null
          ? null
          : plan.routes[
              buildQuest.routeIndex
            ],
      [
        buildQuest.routeIndex,
        plan.routes,
      ],
    );

  useEffect(() => {
    localStorage.setItem(
      BUILD_QUEST_STORAGE_KEY,
      JSON.stringify(
        buildQuest,
      ),
    );
  }, [
    buildQuest,
    BUILD_QUEST_STORAGE_KEY,
  ]);

  function chooseRoute(
    index: number,
  ) {
    setBuildQuest(
      (current) => ({
        ...current,
        routeIndex: index,
      }),
    );

    setQuestAcceptedFlash(true);

    window.setTimeout(
      () =>
        setQuestAcceptedFlash(
          false,
        ),
      1400,
    );
  }

  function completeWeek(
    index: number,
  ) {
    const evidenceText =
      (
        draftEvidence[index] ??
        ""
      ).trim();

    if (
      evidenceText.length < 12 ||
      buildQuest.completedWeeks.includes(
        index,
      )
    ) {
      return;
    }

    const nextCompletedWeeks = [
      ...buildQuest.completedWeeks,
      index,
    ];

    const finalWeek =
      index ===
      plan.monthPlan.length - 1;

    setBuildQuest(
      (current) => ({
        ...current,

        completedWeeks:
          nextCompletedWeeks,

        evidence: {
          ...current.evidence,
          [index]:
            evidenceText,
        },

        completed:
          finalWeek
            ? true
            : current.completed,
      }),
    );

    awardMilestone(
      `project:${wingId}:week:${index + 1}`,
      25,
      {
        technicalBuild:
          index === 0
            ? 1
            : 0,

        evidenceReasoning:
          index >= 1
            ? 1
            : 0,
      },
      `${plan.monthPlan[index].week} complete`,
    );

    if (finalWeek) {
      awardMilestone(
        `project:${wingId}:build-complete`,
        100,
        {
          technicalBuild: 1,
          evidenceReasoning: 1,
        },
        `${selectedRoute?.title ?? wingName} build complete`,
      );
    }
  }

  function resetBuildQuest() {
    const empty:
      BuildQuestProgress = {
        routeIndex: null,
        completedWeeks: [],
        evidence: {},
        completed: false,
      };

    setBuildQuest(
      empty,
    );

    setDraftEvidence(
      {},
    );

    localStorage.removeItem(
      BUILD_QUEST_STORAGE_KEY,
    );
  }


  if (showFlightPlan) {
    return (
      <PathDashboard
        wingName={wingName}
        major="Aerospace Engineering"
        grade={11}
        onBack={() =>
          setShowFlightPlan(false)
        }
      />
    );
  }

  return (
    <main className="launch-shell">
      {questAcceptedFlash &&
        selectedRoute && (
          <div
            className="launch-quest-flash"
            role="status"
          >
            <img
              src="/brand/altwing-penguin.png"
              alt=""
            />

            <div>
              <span>
                QUEST ACCEPTED
              </span>

              <strong>
                {selectedRoute.title}
              </strong>

              <small>
                BUILD PATH ACTIVE
              </small>
            </div>
          </div>
        )}
      <header className="launch-nav">
        <button
          type="button"
          onClick={onBack}
        >
          ← Back to Portfolio
        </button>

        <strong>
          Alt<span>Wing</span>
        </strong>
      </header>

      <section className="launch-hero">
        <span>
          LAUNCH YOUR WING
        </span>

        <h1>
          Don't let the project
          <br />
          stop at completion.
        </h1>

        <p>
          Your {wingName} Wing produced
          <strong> {project}</strong>.
          Now turn that evidence into
          something other people can see,
          test, review, or build on.
        </p>
      </section>

      <section className="launch-section">
        <div className="launch-heading">
          <span>
            01 / CHOOSE A FLIGHT PATH
          </span>

          <h2>
            Where could this project go next?
          </h2>
        </div>

        <div className="launch-route-grid">
          {plan.routes.map(
            (route, index) => {
              const selected =
                buildQuest.routeIndex ===
                index;

              return (
                <article
                  key={route.title}
                  className={[
                    "launch-route-card",

                    selected
                      ? "launch-route-card--selected"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <span>
                    0{index + 1}
                  </span>

                  {selected && (
                    <b className="launch-route-selected">
                      ACTIVE PATH
                    </b>
                  )}

                  <h3>
                    {route.title}
                  </h3>

                  <p>
                    {route.description}
                  </p>

                  <button
                    type="button"
                    className="launch-route-action"
                    onClick={() =>
                      chooseRoute(
                        index,
                      )
                    }
                  >
                    {selected
                      ? "Quest Accepted ✓"
                      : `${route.action} →`}
                  </button>
                </article>
              );
            },
          )}
        </div>
      </section>

      <section className="launch-section">
        <div className="launch-heading">
          <span>
            02 / 30-DAY LAUNCH PLAN
          </span>

          <h2>
            Four weeks from project
            to visible evidence.
          </h2>
        </div>

        {!selectedRoute ? (
          <div className="launch-quest-gate">
            <img
              src="/brand/altwing-penguin.png"
              alt=""
            />

            <span>
              QUEST LOCKED
            </span>

            <h3>
              Choose a Flight Path first.
            </h3>

            <p>
              Your 30-day Build Quest
              will unlock here.
            </p>
          </div>
        ) : (
          <>
            <div className="launch-active-path">
              <div>
                <span>
                  ACTIVE BUILD QUEST
                </span>

                <strong>
                  {selectedRoute.title}
                </strong>
              </div>

              <button
                type="button"
                onClick={
                  resetBuildQuest
                }
              >
                Change Path
              </button>
            </div>

            <div className="launch-month-plan">
              {plan.monthPlan.map(
                (item, index) => {
                  const complete =
                    buildQuest.completedWeeks.includes(
                      index,
                    );

                  const unlocked =
                    index === 0 ||
                    buildQuest.completedWeeks.includes(
                      index - 1,
                    );

                  const evidenceValue =
                    draftEvidence[index] ??
                    buildQuest.evidence[
                      index
                    ] ??
                    "";

                  const canComplete =
                    unlocked &&
                    !complete &&
                    evidenceValue
                      .trim()
                      .length >= 12;

                  return (
                    <article
                      key={item.week}
                      className={[
                        complete
                          ? "launch-week--complete"
                          : "",

                        unlocked
                          ? "launch-week--unlocked"
                          : "launch-week--locked",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <span>
                        {item.week}
                      </span>

                      <div className="launch-week-state">
                        {complete
                          ? "COMPLETE ✓"
                          : unlocked
                            ? "ACTIVE"
                            : "LOCKED"}
                      </div>

                      <h3>
                        {item.title}
                      </h3>

                      <p>
                        {item.description}
                      </p>

                      {unlocked && (
                        <div className="launch-evidence-entry">
                          <label>
                            EVIDENCE
                          </label>

                          <textarea
                            value={
                              evidenceValue
                            }
                            disabled={
                              complete
                            }
                            onChange={(
                              event,
                            ) =>
                              setDraftEvidence(
                                (
                                  current,
                                ) => ({
                                  ...current,

                                  [index]:
                                    event
                                      .target
                                      .value,
                                }),
                              )
                            }
                            placeholder={
                              index === 0
                                ? "What did you actually improve or build?"
                                : index === 1
                                  ? "What evidence did you create or publish?"
                                  : index === 2
                                    ? "Who reviewed it, and what feedback did you get?"
                                    : "What changed in V2, and where did you share or submit it?"
                            }
                          />

                          <div>
                            <small>
                              {
                                evidenceValue
                                  .trim()
                                  .length
                              }
                              /12 minimum
                            </small>

                            <button
                              type="button"
                              disabled={
                                !canComplete
                              }
                              onClick={() =>
                                completeWeek(
                                  index,
                                )
                              }
                            >
                              {complete
                                ? "Completed ✓"
                                : `Complete ${item.week} +25 XP`}
                            </button>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                },
              )}
            </div>

            {buildQuest.completed && (
              <div className="launch-build-complete">
                <img
                  src="/brand/altwing-penguin.png"
                  alt=""
                />

                <span>
                  BUILD QUEST COMPLETE
                </span>

                <h3>
                  {selectedRoute.title}
                </h3>

                <p>
                  You explored, built,
                  tested, documented,
                  and improved
                  something real.
                </p>

                <strong>
                  +100 XP · TECHNICAL BUILD ↑
                </strong>

                <small>
                  A higher-rarity
                  cosmic signal may
                  have been detected.
                </small>
              </div>
            )}
          </>
        )}
      </section>

      <section className="launch-final">
        <span>
          EXPLORE → BUILD → LAUNCH
        </span>

        <h2>
          Your Wing matters when
          you do something with it.
        </h2>

        <p>
          The goal is not to collect
          another badge. The goal is to
          leave with evidence that shows
          how you think, build, test,
          improve, and contribute.
        </p>

        <button
          type="button"
          className="launch-flight-plan-button"
          onClick={() =>
            setShowFlightPlan(true)
          }
        >
          Build My Flight Plan →
        </button>
      </section>
    </main>
  );
}

export default LaunchPlan;