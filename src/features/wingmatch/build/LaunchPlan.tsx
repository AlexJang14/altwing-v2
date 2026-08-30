import {
  useEffect,
  useState,
} from "react";

import {
  awardMilestone,
} from "../../progression/progression";

import PathDashboard from "../path/PathDashboard";

import "../styles/beginner-first.css";


interface LaunchPlanProps {
  wingId: string;
  wingName: string;
  project: string;
  onBack: () => void;
}


interface BuildProgress {
  routeIndex:
    number | null;

  completedSteps:
    number[];

  evidence:
    Record<
      number,
      string
    >;

  completed:
    boolean;
}


const routeTypes = [
  {
    title:
      "Design something",

    description:
      "Sketch, model, or create a small engineering idea.",

    icon:
      "◇",
  },

  {
    title:
      "Test something",

    description:
      "Change one thing and see what happens.",

    icon:
      "↻",
  },

  {
    title:
      "Investigate something",

    description:
      "Ask one space question and look for evidence.",

    icon:
      "⌕",
  },

  {
    title:
      "Surprise me",

    description:
      "Let AltWing choose a simple starter challenge.",

    icon:
      "✦",
  },
];


const starterIdeas:
  Record<
    string,
    string[]
  > = {

  systems: [
    "Design a tiny Mars mission with only three resources.",
    "Compare two mission plans by changing one constraint.",
    "Ask which system should get priority when power is low.",
    "Create a simple Mars rescue mission.",
  ],

  gnc: [
    "Sketch how a lander could correct its tilt.",
    "Test different correction strengths in a simple simulator.",
    "Investigate why vehicles overshoot a target.",
    "Build a simple virtual landing challenge.",
  ],

  avionics: [
    "Design a simple spacecraft warning system.",
    "Test what happens when one sensor gives bad data.",
    "Investigate how spacecraft know when a sensor fails.",
    "Create a three-sensor detective challenge.",
  ],

  structures: [
    "Design a lightweight landing leg.",
    "Compare two shapes under the same load.",
    "Investigate why thin structures buckle.",
    "Create a paper landing-leg design challenge.",
  ],

  thermal: [
    "Design a simple way to keep a CubeSat cool.",
    "Compare two cooling strategies.",
    "Investigate why spacecraft overheat in space.",
    "Create a sunlight-vs-shadow temperature challenge.",
  ],

  propulsion: [
    "Design a mission that needs very little fuel.",
    "Compare two virtual engine choices.",
    "Investigate why some spacecraft use efficient low-thrust engines.",
    "Create a simple fuel-budget mission.",
  ],

  "mission-design": [
    "Design a tiny Mars science mission.",
    "Compare two landing-site choices.",
    "Investigate what makes a mission worth doing.",
    "Create a one-day rover mission with limited power.",
  ],
};


const steps = [
  {
    label:
      "STEP 01",

    title:
      "Pick one small question",

    description:
      "Keep it tiny. You should be able to explain the problem in one sentence.",

    placeholder:
      "Example: How could I make a lander leg lighter without making it too weak?",
  },

  {
    label:
      "STEP 02",

    title:
      "Make version 1",

    description:
      "Sketch it, model it, simulate it, calculate it, or build a simple first version.",

    placeholder:
      "What did you make for V1?",
  },

  {
    label:
      "STEP 03",

    title:
      "Test one thing",

    description:
      "Change one variable or compare two versions. Record what happened.",

    placeholder:
      "What did you test and what happened?",
  },

  {
    label:
      "STEP 04",

    title:
      "Improve and show it",

    description:
      "Make one improvement and save a screenshot, photo, graph, or short explanation.",

    placeholder:
      "What changed in V2?",
  },
];


function LaunchPlan({
  wingId,
  wingName,
  onBack,
}: LaunchPlanProps) {

  const STORAGE_KEY =
    `altwing-build-quest-${wingId}`;


  const [
    showFlightPlan,
    setShowFlightPlan,
  ] =
    useState(false);


  const [
    progress,
    setProgress,
  ] =
    useState<BuildProgress>(
      () => {
        try {
          const raw =
            localStorage.getItem(
              STORAGE_KEY,
            );

          if (!raw) {
            return {
              routeIndex:
                null,

              completedSteps:
                [],

              evidence:
                {},

              completed:
                false,
            };
          }

          const old =
            JSON.parse(
              raw,
            );

          return {
            routeIndex:
              typeof
                old.routeIndex ===
              "number"
                ? old.routeIndex
                : null,

            completedSteps:
              old.completedSteps ??
              old.completedWeeks ??
              [],

            evidence:
              old.evidence ??
              {},

            completed:
              Boolean(
                old.completed,
              ),
          };
        } catch {
          return {
            routeIndex:
              null,

            completedSteps:
              [],

            evidence:
              {},

            completed:
              false,
          };
        }
      },
    );


  const [
    drafts,
    setDrafts,
  ] =
    useState<
      Record<
        number,
        string
      >
    >(
      () => ({
        ...progress.evidence,
      }),
    );


  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        progress,
      ),
    );
  }, [
    progress,
    STORAGE_KEY,
  ]);


  const ideas =
    starterIdeas[
      wingId
    ] ??
    starterIdeas.systems;


  const routeIndex =
    progress.routeIndex;


  const starter =
    routeIndex === null
      ? null
      : ideas[
          routeIndex
        ] ??
        ideas[0];


  function chooseRoute(
    index: number,
  ) {
    setProgress(
      (
        current,
      ) => ({
        ...current,
        routeIndex:
          index,
      }),
    );
  }


  function completeStep(
    index: number,
  ) {
    const text =
      (
        drafts[index] ??
        ""
      ).trim();

    if (
      text.length < 8
    ) {
      return;
    }

    if (
      progress.completedSteps
        .includes(index)
    ) {
      return;
    }

    const next = [
      ...progress
        .completedSteps,
      index,
    ];


    const finished =
      index ===
      steps.length -
      1;


    setProgress(
      (
        current,
      ) => ({
        ...current,

        completedSteps:
          next,

        evidence: {
          ...current.evidence,
          [index]:
            text,
        },

        completed:
          finished
            ? true
            : current.completed,
      }),
    );


    awardMilestone(
      `project:${wingId}:week:${index + 1}`,
      25,

      {
        technicalBuild:
          index === 1
            ? 1
            : 0,

        evidenceReasoning:
          index >= 2
            ? 1
            : 0,
      },

      `Build Step ${index + 1} complete`,
    );


    if (finished) {
      awardMilestone(
        `project:${wingId}:build-complete`,
        100,

        {
          technicalBuild: 1,
          evidenceReasoning: 1,
        },

        `${wingName} beginner build complete`,
      );
    }
  }


  function restartBuild() {
    const empty:
      BuildProgress = {
        routeIndex:
          null,

        completedSteps:
          [],

        evidence:
          {},

        completed:
          false,
      };

    setProgress(
      empty,
    );

    setDrafts(
      {},
    );

    localStorage.removeItem(
      STORAGE_KEY,
    );
  }


  if (showFlightPlan) {
    return (
      <PathDashboard
        wingName={
          wingName
        }

        major="Aerospace Engineering"

        grade={11}

        onBack={() =>
          setShowFlightPlan(
            false,
          )
        }
      />
    );
  }


  return (
    <main className="beginner-build-shell">

      <header className="beginner-build-nav">

        <button
          type="button"
          onClick={onBack}
        >
          ← Back to my Wing
        </button>

        <strong>
          Alt
          <span>
            Wing
          </span>
        </strong>

      </header>


      <section className="beginner-build-hero">

        <span>
          TRY YOUR WING
        </span>

        <h1>
          Start small.
          <br />
          Make something.
        </h1>

        <p>
          You matched with
          {" "}
          <strong>
            {wingName}
          </strong>.
          You do not need to turn
          it into a competition,
          research paper, or big
          project yet.
        </p>

      </section>


      <section className="beginner-build-section">

        <div className="beginner-build-heading">

          <span>
            01 / CHOOSE HOW TO START
          </span>

          <h2>
            What sounds most fun?
          </h2>

          <p>
            There is no wrong choice.
          </p>

        </div>


        <div className="beginner-route-grid">

          {routeTypes.map(
            (
              route,
              index,
            ) => {

              const selected =
                routeIndex ===
                index;

              return (
                <button
                  type="button"
                  key={
                    route.title
                  }

                  className={
                    selected
                      ? "selected"
                      : ""
                  }

                  onClick={() =>
                    chooseRoute(
                      index,
                    )
                  }
                >

                  <b>
                    {route.icon}
                  </b>

                  <strong>
                    {
                      route.title
                    }
                  </strong>

                  <p>
                    {
                      route.description
                    }
                  </p>

                  <span>
                    {selected
                      ? "SELECTED ✓"
                      : "CHOOSE →"}
                  </span>

                </button>
              );
            },
          )}

        </div>

      </section>


      {starter && (
        <section className="beginner-build-section">

          <div className="beginner-starter">

            <span>
              YOUR STARTER IDEA
            </span>

            <h2>
              {starter}
            </h2>

            <p>
              You can change the idea.
              This is only a starting
              point.
            </p>

          </div>


          <div className="beginner-step-list">

            {steps.map(
              (
                step,
                index,
              ) => {

                const complete =
                  progress
                    .completedSteps
                    .includes(
                      index,
                    );


                const unlocked =
                  index === 0 ||
                  progress
                    .completedSteps
                    .includes(
                      index -
                      1,
                    );


                const value =
                  drafts[index] ??
                  progress
                    .evidence[
                      index
                    ] ??
                  "";


                return (
                  <article
                    key={
                      step.label
                    }

                    className={[
                      complete
                        ? "complete"
                        : "",

                      unlocked
                        ? "unlocked"
                        : "locked",
                    ]
                      .filter(
                        Boolean,
                      )
                      .join(" ")}
                  >

                    <div className="beginner-step-number">
                      {complete
                        ? "✓"
                        : index + 1}
                    </div>


                    <div className="beginner-step-copy">

                      <span>
                        {
                          step.label
                        }
                      </span>

                      <h3>
                        {
                          step.title
                        }
                      </h3>

                      <p>
                        {
                          step.description
                        }
                      </p>


                      {unlocked && (
                        <div className="beginner-step-evidence">

                          <textarea
                            value={
                              value
                            }

                            disabled={
                              complete
                            }

                            placeholder={
                              step.placeholder
                            }

                            onChange={(
                              event,
                            ) =>
                              setDrafts(
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
                          />

                          <button
                            type="button"

                            disabled={
                              complete ||
                              value
                                .trim()
                                .length <
                                8
                            }

                            onClick={() =>
                              completeStep(
                                index,
                              )
                            }
                          >
                            {complete
                              ? "Done ✓"
                              : "Finish this step →"}
                          </button>

                        </div>
                      )}

                    </div>
                  </article>
                );
              },
            )}

          </div>

        </section>
      )}


      {progress.completed && (
        <section className="beginner-build-complete">

          <img
            src="/brand/altwing-penguin.png"
            alt=""
          />

          <span>
            FIRST BUILD COMPLETE
          </span>

          <h2>
            You actually tried
            {` ${wingName}.`}
          </h2>

          <p>
            That matters more than
            simply receiving a career
            recommendation.
          </p>

          <strong>
            +100 XP
          </strong>

        </section>
      )}


      <section className="beginner-go-further">

        <span>
          WHEN YOU&apos;RE READY
        </span>

        <h2>
          Take it further.
        </h2>

        <p>
          These are optional next
          steps — not things you need
          before you start.
        </p>

        <div>
          <article>
            <b>
              GitHub
            </b>

            <span>
              Publish your project
            </span>
          </article>

          <article>
            <b>
              TSA / Competition
            </b>

            <span>
              Turn it into an entry
            </span>
          </article>

          <article>
            <b>
              Research
            </b>

            <span>
              Ask a deeper question
            </span>
          </article>
        </div>


        <button
          type="button"
          onClick={() =>
            setShowFlightPlan(
              true,
            )
          }
        >
          Explore colleges & next steps →
        </button>


        {routeIndex !==
          null && (
          <button
            type="button"
            className="beginner-reset-build"
            onClick={
              restartBuild
            }
          >
            Start a different build
          </button>
        )}

      </section>

    </main>
  );
}


export default LaunchPlan;
