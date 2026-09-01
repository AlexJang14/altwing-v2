import {
  useEffect,
  useMemo,
  useState,
} from "react";

import MissionVisual from "../v6/MissionVisual";
import "./wingmatch-v7.css";


interface WingMatchV7Props {
  onExit: () => void;
}


type WingId =
  | "gnc"
  | "avionics"
  | "structures"
  | "thermal"
  | "propulsion"
  | "mission-design";


interface Wing {
  id: WingId;
  short: string;
  name: string;
  description: string;
}


interface MissionOption {
  id: string;
  title: string;
  description: string;
  consequence: string;

  scores:
    Partial<
      Record<
        WingId,
        number
      >
    >;
}


interface MissionScene {
  id: string;
  chapter: string;
  phase: string;
  situation: string;
  question: string;
  options: MissionOption[];
}


const WINGS: Wing[] = [
  {
    id: "gnc",
    short: "GNC",
    name: "Guidance, Navigation & Control",
    description:
      "Motion, trajectory, control, uncertainty, and how a vehicle responds.",
  },

  {
    id: "avionics",
    short: "AVIONICS",
    name: "Avionics",
    description:
      "Sensors, electronics, software signals, diagnostics, and information flow.",
  },

  {
    id: "structures",
    short: "STRUCTURES",
    name: "Structures",
    description:
      "Loads, mechanisms, physical limits, materials, and hardware survival.",
  },

  {
    id: "thermal",
    short: "THERMAL",
    name: "Thermal Engineering",
    description:
      "Heat, temperature limits, environmental margins, and energy management.",
  },

  {
    id: "propulsion",
    short: "PROPULSION",
    name: "Propulsion",
    description:
      "Thrust, fuel, power, performance margins, and vehicle capability.",
  },

  {
    id: "mission-design",
    short: "MISSION DESIGN",
    name: "Mission Design",
    description:
      "Balancing objectives, constraints, risk, resources, and the entire mission.",
  },
];


const SCENES: MissionScene[] = [

  // ========================================================
  // 01
  // ========================================================

  {
    id: "entry-heat",

    chapter:
      "ARES-7 / ENTRY INTERFACE",

    phase:
      "MISSION 01 / MARS ARRIVAL",

    situation:
      "After seven months in deep space, ARES-7 reaches Mars. The lander hits the atmosphere faster than planned. Heating is climbing, but changing the entry path could push the spacecraft away from its target landing zone.",

    question:
      "What would you protect first?",

    options: [
      {
        id:
          "reduce-heating",

        title:
          "Protect the heat margin",

        description:
          "Change the entry path to reduce heating, even if the landing becomes less precise.",

        consequence:
          "ARES-7 survives peak heating with more margin, but it exits entry farther from the center of the planned landing corridor.",

        scores: {
          thermal: 3,
          structures: 1,
        },
      },

      {
        id:
          "hold-path",

        title:
          "Protect the landing path",

        description:
          "Hold the planned trajectory and trust the heat shield to tolerate the higher load.",

        consequence:
          "The lander stays close to its target, but the thermal system enters descent with less remaining margin.",

        scores: {
          gnc: 3,
          thermal: 1,
        },
      },

      {
        id:
          "rebalance-system",

        title:
          "Protect structural margin",

        description:
          "Change the vehicle attitude to reduce peak mechanical loading, even if heating rises and the landing corridor becomes wider.",

        consequence:
          "Peak structural loads fall, but ARES-7 now has less thermal margin and less landing precision.",

        scores: {
          structures: 3,
          thermal: 1,
        },
      },
    ],
  },


  // ========================================================
  // 02
  // ========================================================

  {
    id:
      "sensor-conflict",

    chapter:
      "ARES-7 / DESCENT NAVIGATION",

    phase:
      "MISSION 02 / DESCENT",

    situation:
      "ARES-7 clears peak heating and begins powered descent. Seconds before the next burn, two altitude sensors disagree by almost two kilometers. The spacecraft cannot wait long enough to fully diagnose everything.",

    question:
      "How would you resolve the uncertainty?",

    options: [
      {
        id:
          "independent-sensor",

        title:
          "Ask another sensor",

        description:
          "Use an independent measurement to determine which altitude reading is more believable.",

        consequence:
          "You gain another piece of evidence, but the lander spends valuable time before committing to the burn.",

        scores: {
          avionics: 3,
          gnc: 1,
        },
      },

      {
        id:
          "motion-model",

        title:
          "Trust the motion model",

        description:
          "Compare both readings with where the flight model predicts the lander should be.",

        consequence:
          "The navigation model becomes your reference. The burn can begin sooner, but only if the model itself is accurate.",

        scores: {
          gnc: 3,
          avionics: 1,
        },
      },

      {
        id:
          "mission-context",

        title:
          "Focus on the next burn",

        description:
          "Determine which uncertainty actually matters for the upcoming maneuver and act around that risk.",

        consequence:
          "You keep the mission moving without completely solving the sensor disagreement.",

        scores: {
          "mission-design": 3,
          gnc: 1,
        },
      },
    ],
  },


  // ========================================================
  // 03
  // ========================================================

  {
    id:
      "fuel-margin",

    chapter:
      "ARES-7 / TERMINAL DESCENT",

    phase:
      "MISSION 03 / LANDING BURN",

    situation:
      "The descent burn begins. The sensor problem is manageable, but the engines are using fuel faster than the pre-flight model predicted. ARES-7 can still land — the question is how much reserve it should keep.",

    question:
      "Where would you accept the tradeoff?",

    options: [
      {
        id:
          "save-fuel",

        title:
          "Protect the fuel reserve",

        description:
          "Use the most efficient descent profile even if the guidance system loses some freedom to correct later.",

        consequence:
          "ARES-7 preserves more propellant, but its final approach becomes less flexible.",

        scores: {
          propulsion: 3,
          thermal: 2,
        },
      },

      {
        id:
          "keep-control",

        title:
          "Protect maneuvering freedom",

        description:
          "Keep enough thrust available for late corrections, even if the reserve becomes smaller.",

        consequence:
          "The lander remains responsive during final approach, but there is less propellant left for surprises.",

        scores: {
          gnc: 2,
          propulsion: 2,
        },
      },

      {
        id:
          "change-objective",

        title:
          "Relax the landing objective",

        description:
          "Accept a less precise touchdown zone so the entire vehicle can operate with more margin.",

        consequence:
          "ARES-7 gives up some landing accuracy in exchange for a more forgiving final descent.",

        scores: {
          "mission-design": 3,
          propulsion: 1,
        },
      },
    ],
  },


  // ========================================================
  // 04
  // ========================================================

  {
    id:
      "structure-vibration",

    chapter:
      "ARES-7 / TOUCHDOWN",

    phase:
      "MISSION 04 / FINAL 100 METERS",

    situation:
      "ARES-7 reaches the final hundred meters. A vibration appears in one landing-leg assembly. The structure is still inside its certified limit, but the signal is growing as the surface approaches.",

    question:
      "What would you change before touchdown?",

    options: [
      {
        id:
          "reinforce-load",

        title:
          "Protect the load path",

        description:
          "Shift how landing forces move through the vehicle so the suspect leg carries less peak load.",

        consequence:
          "The landing structure gains margin, but the touchdown configuration becomes more complicated.",

        scores: {
          structures: 3,
          thermal: 1,
        },
      },

      {
        id:
          "reduce-impact",

        title:
          "Soften the touchdown",

        description:
          "Change the descent profile so the landing gear experiences less peak force.",

        consequence:
          "Structural stress falls, but the guidance system must fly a tighter final maneuver.",

        scores: {
          structures: 2,
          gnc: 2,
        },
      },

      {
        id:
          "inspect-pattern",

        title:
          "Study the vibration first",

        description:
          "Use the remaining seconds to determine whether the signal is local or part of a larger system problem.",

        consequence:
          "You gain diagnostic information, but spend time that could have been used to change the landing configuration.",

        scores: {
          avionics: 2,
          structures: 2,
        },
      },
    ],
  },


  // ========================================================
  // 05
  // ========================================================

  {
    id:
      "power-shortage",

    chapter:
      "ARES-7 / SURFACE STARTUP",

    phase:
      "MISSION 05 / TOUCHDOWN + 04 MIN",

    situation:
      "Touchdown is successful. The rover wakes up — but the surface power system is producing less energy than expected. Communications, navigation, thermal control, and science cannot all run at full power.",

    question:
      "What gets priority during startup?",

    options: [
      {
        id:
          "communications-first",

        title:
          "Protect communications",

        description:
          "Keep the Earth link strongest and operate other systems at reduced power.",

        consequence:
          "Mission Control stays connected to ARES-7, but local science and autonomous operations slow down.",

        scores: {
          avionics: 3,
          "mission-design": 1,
        },
      },

      {
        id:
          "science-first",

        title:
          "Protect the science window",

        description:
          "Use the limited surface opportunity to capture the highest-value measurements first.",

        consequence:
          "Science return increases immediately, but the rover operates with less reserve.",

        scores: {
          "mission-design": 3,
          avionics: 1,
        },
      },

      {
        id:
          "balanced-cycles",

        title:
          "Protect thermal survival",

        description:
          "Reserve power for heaters and thermal control so batteries and critical hardware stay inside safe temperature limits.",

        consequence:
          "ARES-7 protects its hardware from the Martian environment, but communications and science operations must wait.",

        scores: {
          thermal: 3,
          "mission-design": 1,
        },
      },
    ],
  },


  // ========================================================
  // 06
  // ========================================================

  {
    id:
      "landing-site",

    chapter:
      "ARES-7 / FIRST TRAVERSE",

    phase:
      "MISSION 06 / SOL 01",

    situation:
      "Power is stable enough to begin the rover's first traverse. Two nearby regions are reachable. One may contain stronger science targets; the other appears easier and safer to cross.",

    question:
      "What information would you request before committing?",

    options: [
      {
        id:
          "terrain-map",

        title:
          "A closer terrain scan",

        description:
          "Compare slopes, rocks, surface geometry, and rover mobility limits.",

        consequence:
          "You reduce traversal risk, but the safest route may not lead to the most valuable target.",

        scores: {
          structures: 2,
          gnc: 2,
        },
      },

      {
        id:
          "science-map",

        title:
          "A science-value map",

        description:
          "Determine which location best answers the mission's main research question.",

        consequence:
          "Scientific value becomes clearer, but difficult terrain could still threaten access.",

        scores: {
          "mission-design": 3,
          avionics: 1,
        },
      },

      {
        id:
          "resource-map",

        title:
          "A resource forecast",

        description:
          "Compare travel time, energy, communication, and thermal cost for both routes.",

        consequence:
          "You understand the system-wide cost of each path, but still need to decide how much risk the science is worth.",

        scores: {
          propulsion: 2,
          thermal: 2,
          "mission-design": 1,
        },
      },
    ],
  },


  // ========================================================
  // 07
  // ========================================================

  {
    id:
      "fault-isolation",

    chapter:
      "ARES-7 / ROVER ANOMALY",

    phase:
      "MISSION 07 / SOL 01 + 03:42",

    situation:
      "The rover commits to its first route. Halfway to the target, a wheel command is sent — but the expected motion never happens. The cause could be sensing, electronics, software, or the mechanism itself.",

    question:
      "Where would you start the investigation?",

    options: [
      {
        id:
          "check-signal",

        title:
          "Trace the electrical signal",

        description:
          "Check whether the command reached the actuator and whether the sensors responded.",

        consequence:
          "You narrow the electronic path quickly, while mechanical causes remain unresolved.",

        scores: {
          avionics: 3,
        },
      },

      {
        id:
          "test-behavior",

        title:
          "Run a controlled motion test",

        description:
          "Send one small safe command and compare the real response with the vehicle model.",

        consequence:
          "The rover itself becomes the experiment, but another test consumes time and energy.",

        scores: {
          gnc: 2,
          avionics: 1,
          structures: 1,
        },
      },

      {
        id:
          "isolate-subsystems",

        title:
          "Separate the possible causes",

        description:
          "Design a sequence that distinguishes software, sensing, electronics, and mechanical faults.",

        consequence:
          "Diagnosis becomes systematic, but recovery may take longer.",

        scores: {
          avionics: 2,
          "mission-design": 2,
        },
      },
    ],
  },


  // ========================================================
  // 08
  // ========================================================

  {
    id:
      "final-priority",

    chapter:
      "ARES-7 / FINAL SCIENCE WINDOW",

    phase:
      "MISSION 08 / FINAL SOL",

    situation:
      "The rover recovers and reaches the target region. Only enough time and energy remain for one major operation before the mission closes. ARES-7 cannot maximize reliability, science, and engineering learning at the same time.",

    question:
      "What should the final operation prove?",

    options: [
      {
        id:
          "reliable-finish",

        title:
          "Prove the system can finish reliably",

        description:
          "Choose the operation with the strongest mission margin and fewest unresolved dependencies.",

        consequence:
          "ARES-7 closes with strong reliability evidence, but leaves some ambitious opportunities unused.",

        scores: {
          structures: 2,
          "mission-design": 2,
        },
      },

      {
        id:
          "science-finish",

        title:
          "Capture the highest-value science",

        description:
          "Spend the remaining resources on the observation that could matter most scientifically.",

        consequence:
          "The mission may produce its strongest scientific result, but with less reserve.",

        scores: {
          "mission-design": 3,
          avionics: 1,
        },
      },

      {
        id:
          "engineering-finish",

        title:
          "Test the most uncertain system",

        description:
          "Use the final opportunity to learn something that could improve the next spacecraft.",

        consequence:
          "ARES-7 becomes a final engineering experiment, trading immediate return for future knowledge.",

        scores: {
          avionics: 1,
          structures: 1,
          thermal: 2,
          propulsion: 2,
          gnc: 1,
        },
      },
    ],
  },
];


const LOADING_MESSAGES = [
  "Reading your eight mission decisions",
  "Comparing six aerospace engineering patterns",
  "Building your Wing signal",
];


function shuffle<T>(
  items: T[],
): T[] {

  const copy =
    [...items];

  for (
    let index =
      copy.length - 1;
    index > 0;
    index -= 1
  ) {

    const other =
      Math.floor(
        Math.random() *
        (index + 1),
      );

    [
      copy[index],
      copy[other],
    ] = [
      copy[other],
      copy[index],
    ];

  }

  return copy;
}


function calculateResults(
  answers:
    Record<
      string,
      string
    >,
) {

  const totals:
    Record<
      WingId,
      number
    > = {
      gnc: 0,
      avionics: 0,
      structures: 0,
      thermal: 0,
      propulsion: 0,
      "mission-design": 0,
    };


  SCENES.forEach(
    (
      scene,
    ) => {

      const optionId =
        answers[
          scene.id
        ];

      const option =
        scene.options.find(
          (
            item,
          ) =>
            item.id ===
            optionId,
        );

      if (!option) {
        return;
      }


      Object.entries(
        option.scores,
      ).forEach(
        ([
          wing,
          score,
        ]) => {

          totals[
            wing as WingId
          ] +=
            score ?? 0;

        },
      );

    },
  );


  const highest =
    Math.max(
      ...Object.values(
        totals,
      ),
      1,
    );


  return WINGS
    .map(
      (
        wing,
      ) => ({
        ...wing,

        score:
          totals[
            wing.id
          ],

        relative:
          Math.round(
            (
              totals[
                wing.id
              ] /
              highest
            ) *
            100,
          ),
      }),
    )
    .sort(
      (
        a,
        b,
      ) =>
        b.score -
        a.score,
    );
}


function WingMatchV7({
  onExit,
}: WingMatchV7Props) {

  const [
    runNumber,
    setRunNumber,
  ] =
    useState(0);


  const [
    sceneIndex,
    setSceneIndex,
  ] =
    useState(0);


  const [
    selected,
    setSelected,
  ] =
    useState<
      MissionOption | null
    >(
      null,
    );


  const [
    hoveredOptionId,
    setHoveredOptionId,
  ] =
    useState<
      string | null
    >(
      null,
    );


  const [
    answers,
    setAnswers,
  ] =
    useState<
      Record<
        string,
        string
      >
    >({});


  const [
    previousDecision,
    setPreviousDecision,
  ] =
    useState<{
      title: string;
      consequence: string;
    } | null>(
      null,
    );


  const [
    mode,
    setMode,
  ] =
    useState<
      "mission"
      | "loading"
      | "result"
    >(
      "mission",
    );


  const [
    loadingStep,
    setLoadingStep,
  ] =
    useState(0);


  const [
    chosenWingId,
    setChosenWingId,
  ] =
    useState<
      WingId | null
    >(
      null,
    );


  const scenes =
    useMemo(
      () =>
        SCENES.map(
          (
            scene,
          ) => ({
            ...scene,

            options:
              shuffle(
                scene.options,
              ),
          }),
        ),
      [
        runNumber,
      ],
    );


  const scene =
    scenes[
      sceneIndex
    ];


  const results =
    useMemo(
      () =>
        calculateResults(
          answers,
        ),
      [
        answers,
      ],
    );


  const recommendedWing =
    results[0];


  const selectedWing =
    results.find(
      (
        wing,
      ) =>
        wing.id ===
        (
          chosenWingId ??
          recommendedWing.id
        ),
    ) ??
    recommendedWing;


  const progress =
    (
      (
        sceneIndex +
        (selected ? 1 : 0)
      ) /
      scenes.length
    ) *
    100;


  useEffect(
    () => {

      if (
        mode !==
        "loading"
      ) {
        return;
      }


      setLoadingStep(
        0,
      );


      const timer1 =
        window.setTimeout(
          () =>
            setLoadingStep(
              1,
            ),
          850,
        );


      const timer2 =
        window.setTimeout(
          () =>
            setLoadingStep(
              2,
            ),
          1700,
        );


      const timer3 =
        window.setTimeout(
          () => {
            setChosenWingId(
              recommendedWing.id,
            );

            setMode(
              "result",
            );

            window.scrollTo({
              top: 0,
              behavior:
                "smooth",
            });
          },
          2850,
        );


      return () => {
        window.clearTimeout(
          timer1,
        );

        window.clearTimeout(
          timer2,
        );

        window.clearTimeout(
          timer3,
        );
      };

    },
    [
      mode,
      recommendedWing.id,
    ],
  );


  function choose(
    option:
      MissionOption,
  ) {

    if (selected) {
      return;
    }


    setSelected(
      option,
    );


    setAnswers(
      (
        current,
      ) => ({
        ...current,

        [
          scene.id
        ]:
          option.id,
      }),
    );
  }


  function next() {

    if (!selected) {
      return;
    }


    setPreviousDecision({
      title:
        selected.title,

      consequence:
        selected.consequence,
    });


    if (
      sceneIndex ===
      scenes.length - 1
    ) {

      setMode(
        "loading",
      );

      window.scrollTo({
        top: 0,
        behavior:
          "smooth",
      });

      return;
    }


    setSceneIndex(
      (
        current,
      ) =>
        current + 1,
    );


    setSelected(
      null,
    );


    setHoveredOptionId(
      null,
    );


    window.scrollTo({
      top: 0,
      behavior:
        "smooth",
    });
  }


  function goBack() {

    if (
      sceneIndex <= 0
    ) {
      return;
    }


    const targetIndex =
      sceneIndex - 1;


    /*
     * Going backward means the student
     * must make that decision again.
     *
     * We remove that answer and anything
     * after it instead of secretly keeping
     * a stale choice.
     */

    setAnswers(
      (
        current,
      ) => {

        const nextAnswers =
          {
            ...current,
          };


        scenes
          .slice(
            targetIndex,
          )
          .forEach(
            (
              item,
            ) => {

              delete nextAnswers[
                item.id
              ];

            },
          );


        return nextAnswers;
      },
    );


    /*
     * Restore the consequence from the
     * decision BEFORE the page we are
     * returning to.
     */

    if (
      targetIndex === 0
    ) {

      setPreviousDecision(
        null,
      );

    } else {

      const priorScene =
        scenes[
          targetIndex - 1
        ];


      const priorOptionId =
        answers[
          priorScene.id
        ];


      const priorOption =
        priorScene.options.find(
          (
            option,
          ) =>
            option.id ===
            priorOptionId,
        );


      if (priorOption) {

        setPreviousDecision({
          title:
            priorOption.title,

          consequence:
            priorOption.consequence,
        });

      } else {

        setPreviousDecision(
          null,
        );

      }
    }


    setSceneIndex(
      targetIndex,
    );


    setSelected(
      null,
    );


    setHoveredOptionId(
      null,
    );


    window.scrollTo({
      top: 0,
      behavior: "auto",
    });
  }


  function restart() {

    setRunNumber(
      (
        current,
      ) =>
        current + 1,
    );

    setSceneIndex(
      0,
    );

    setSelected(
      null,
    );

    setHoveredOptionId(
      null,
    );

    setAnswers(
      {},
    );

    setPreviousDecision(
      null,
    );

    setChosenWingId(
      null,
    );

    setMode(
      "mission",
    );

    window.scrollTo({
      top: 0,
      behavior:
        "smooth",
    });
  }


  function saveWing(
    wing:
      typeof results[number],
  ) {

    const payload = {
      id:
        wing.id,

      name:
        wing.name,

      short:
        wing.short,

      source:
        "wingmatch-v7",

      recommendedWing:
        recommendedWing.id,

      selectedAt:
        new Date()
          .toISOString(),
    };


    localStorage.setItem(
      "altwing-selected-wing-v1",
      JSON.stringify(
        payload,
      ),
    );


    localStorage.setItem(
      "altwing-selected-wing",
      wing.id,
    );


    localStorage.setItem(
      "altwing-wingmatch-v7-result",
      JSON.stringify({
        answers,
        recommended:
          recommendedWing.id,

        selected:
          wing.id,

        results:
          results.map(
            (
              item,
            ) => ({
              id:
                item.id,

              score:
                item.score,
            }),
          ),
      }),
    );


    window.dispatchEvent(
      new CustomEvent(
        "altwing:selected-wing",
        {
          detail:
            payload,
        },
      ),
    );


    setChosenWingId(
      wing.id,
    );
  }


  function finishWingMatch() {

    /*
     * Save the Wing the student actually chose,
     * not necessarily the recommendation.
     */

    saveWing(
      selectedWing,
    );


    /*
     * Return to the AltWing home screen.
     * App.tsx already handles switching the
     * WingMatch view back to "home".
     */

    onExit();


    /*
     * Make sure home opens at the top.
     */

    window.setTimeout(
      () => {
        window.scrollTo({
          top: 0,
          behavior: "auto",
        });
      },
      0,
    );
  }


  // ========================================================
  // LOADING
  // ========================================================

  if (
    mode ===
    "loading"
  ) {

    return (
      <main className="awv7-shell awv7-loading">

        <header className="awv7-topbar">

          <div />

          <div className="awv7-brand">
            Alt<span>Wing</span>
          </div>

          <div />

        </header>


        <section className="awv7-loading-stage">

          <div className="awv7-flight-zone">

            <div className="awv7-flight-orbit" />

            <img
              src="/brand/altwing-penguin.png"
              alt=""
              className="awv7-flying-penguin"
            />

          </div>


          <span className="awv7-loading-kicker">
            WINGMATCH COMPLETE
          </span>


          <h1>
            Finding the best-fit
            <br />
            Wing for you...
          </h1>


          <p>
            Based on the engineering
            patterns you used across
            this mission run.
          </p>


          <div className="awv7-loading-steps">

            {LOADING_MESSAGES.map(
              (
                message,
                index,
              ) => (

                <div
                  key={
                    message
                  }
                  className={
                    index <=
                    loadingStep
                      ? "is-active"
                      : ""
                  }
                >

                  <span>
                    {index <
                    loadingStep
                      ? "✓"
                      : index ===
                        loadingStep
                        ? "●"
                        : "○"}
                  </span>

                  {
                    message
                  }

                </div>

              ),
            )}

          </div>


          <div className="awv7-loading-bar">
            <span
              style={{
                width:
                  `${(
                    (
                      loadingStep +
                      1
                    ) /
                    3
                  ) *
                  100}%`,
              }}
            />
          </div>

        </section>

      </main>
    );
  }


  // ========================================================
  // RESULT
  // ========================================================

  if (
    mode ===
    "result"
  ) {

    return (
      <main className="awv7-shell">

        <header className="awv7-topbar">

          <button
            type="button"
            onClick={onExit}
            className="awv7-exit"
          >
            ← ALTWING
          </button>


          <div className="awv7-brand">
            Alt<span>Wing</span>
          </div>


          <span className="awv7-result-label">
            RESULT
          </span>

        </header>


        <section className="awv7-result">

          <span className="awv7-kicker">
            YOUR STRONGEST SIGNAL TODAY
          </span>


          <h1>
            {
              recommendedWing.name
            }
          </h1>


          <p className="awv7-result-intro">
            This was the strongest
            engineering pattern in this
            mission run. It is a direction
            to test — not a permanent
            label or an aptitude score.
          </p>


          <section className="awv7-recommended">

            <div>

              <span>
                RECOMMENDED FROM THIS RUN
              </span>

              <h2>
                {
                  recommendedWing.short
                }
              </h2>

              <p>
                {
                  recommendedWing.description
                }
              </p>

            </div>


            <div
              className="awv7-result-mascot"
              data-wing={
                recommendedWing.id
              }
            >

              <div className="awv7-result-orbit" />

              <img
                src="/brand/altwing-penguin.png"
                alt="AltWing mascot"
              />

            </div>

          </section>


          <section className="awv7-result-options">

            <header>

              <span className="awv7-kicker">
                WHAT YOU COULD HAVE GOTTEN
              </span>

              <h2>
                You can choose a
                different Wing to explore.
              </h2>

              <p>
                Your strongest signal is
                only a recommendation.
                If another kind of
                engineering interests you
                more, choose it. AltWing
                will build your next path
                around that Wing instead.
              </p>

            </header>


            <div className="awv7-wing-grid">

              {results.map(
                (
                  wing,
                ) => {

                  const chosen =
                    selectedWing.id ===
                    wing.id;

                  const recommended =
                    recommendedWing.id ===
                    wing.id;


                  return (
                    <button
                      key={
                        wing.id
                      }
                      type="button"
                      className={[
                        "awv7-wing-card",

                        chosen
                          ? "is-selected"
                          : "",
                      ]
                        .filter(
                          Boolean,
                        )
                        .join(
                          " ",
                        )}
                      onClick={() =>
                        saveWing(
                          wing,
                        )
                      }
                    >

                      <div className="awv7-wing-card-top">

                        <span>
                          {
                            wing.short
                          }
                        </span>

                        {recommended && (
                          <b>
                            RECOMMENDED
                          </b>
                        )}

                      </div>


                      <h3>
                        {
                          wing.name
                        }
                      </h3>


                      <p>
                        {
                          wing.description
                        }
                      </p>


                      <div className="awv7-wing-meter">

                        <span>
                          <i
                            style={{
                              width:
                                `${wing.relative}%`,
                            }}
                          />
                        </span>

                      </div>


                      <strong>
                        {chosen
                          ? "SELECTED ✓"
                          : "CHOOSE THIS WING →"}
                      </strong>

                    </button>
                  );
                },
              )}

            </div>

          </section>


          <section className="awv7-selected-path">

            <div>

              <span>
                YOUR NEXT WING
              </span>

              <h2>
                {
                  selectedWing.name
                }
              </h2>

              <p>
                AltWing will use this
                Wing for your projects,
                opportunities, and
                exploration path.
              </p>

            </div>


            <div className="awv7-result-actions">

              <button
                type="button"
                className="awv7-primary-action"
                onClick={
                  finishWingMatch
                }
              >
                SAVE{" "}
                {
                  selectedWing.short
                }{" "}
                & RETURN HOME →
              </button>


              <button
                type="button"
                className="awv7-secondary-action"
                onClick={restart}
              >
                REPLAY MISSION
              </button>

            </div>

          </section>

        </section>

      </main>
    );
  }


  // ========================================================
  // MISSION
  // ========================================================

  return (
    <main className="awv7-shell">

      <header className="awv7-topbar">

        <div className="awv7-nav-actions">

          <button
            type="button"
            onClick={onExit}
            className="awv7-exit"
          >
            EXIT
          </button>


          {sceneIndex > 0 && (
            <button
              type="button"
              onClick={goBack}
              className="awv7-back"
            >
              ← PREVIOUS
            </button>
          )}

        </div>


        <div className="awv7-brand">
          Alt<span>Wing</span>
        </div>


        <div className="awv7-count">
          {String(
            sceneIndex + 1,
          ).padStart(
            2,
            "0",
          )}
          {" / "}
          {String(
            scenes.length,
          ).padStart(
            2,
            "0",
          )}
        </div>

      </header>


      <div className="awv7-progress">

        <span
          style={{
            width:
              `${progress}%`,
          }}
        />

      </div>


      <section className="awv7-stage">

        <div className="awv7-story-header">

          <span>
            {
              scene.phase
            }
          </span>

          <strong>
            {
              scene.chapter
            }
          </strong>

        </div>


        {previousDecision && (
          <aside className="awv7-continuity">

            <span>
              FROM YOUR LAST DECISION
            </span>

            <strong>
              {
                previousDecision.title
              }
            </strong>

            <p>
              {
                previousDecision.consequence
              }
            </p>

          </aside>
        )}


        <p className="awv7-situation">
          {
            scene.situation
          }
        </p>


        <h1 className="awv7-question">
          {
            scene.question
          }
        </h1>


        <p className="awv7-rule">
          There is no perfect answer.
          Choose the tradeoff you would
          actually accept as mission
          control.
        </p>


        <MissionVisual
          sceneId={
            scene.id
          }
          options={
            scene.options
          }
          activeOptionId={
            selected?.id ??
            hoveredOptionId
          }
          selectedOptionId={
            selected?.id ??
            null
          }
          onHover={
            setHoveredOptionId
          }
          onChoose={
            (
              optionId,
            ) => {

              const option =
                scene.options.find(
                  (
                    item,
                  ) =>
                    item.id ===
                    optionId,
                );

              if (option) {
                choose(
                  option,
                );
              }

            }
          }
        />


        <div className="awv7-options">

          {scene.options.map(
            (
              option,
              index,
            ) => {

              const isSelected =
                selected?.id ===
                option.id;


              return (
                <button
                  key={
                    option.id
                  }
                  type="button"
                  className={[
                    "awv7-option",

                    isSelected
                      ? "is-selected"
                      : "",

                    selected &&
                    !isSelected
                      ? "is-dimmed"
                      : "",
                  ]
                    .filter(
                      Boolean,
                    )
                    .join(
                      " ",
                    )}
                  disabled={
                    Boolean(
                      selected,
                    )
                  }
                  onMouseEnter={() =>
                    setHoveredOptionId(
                      option.id,
                    )
                  }
                  onMouseLeave={() =>
                    setHoveredOptionId(
                      null,
                    )
                  }
                  onFocus={() =>
                    setHoveredOptionId(
                      option.id,
                    )
                  }
                  onBlur={() =>
                    setHoveredOptionId(
                      null,
                    )
                  }
                  onClick={() =>
                    choose(
                      option,
                    )
                  }
                >

                  <span className="awv7-option-number">
                    OPTION{" "}
                    {
                      index + 1
                    }
                  </span>


                  <strong>
                    {
                      option.title
                    }
                  </strong>


                  <p>
                    {
                      option.description
                    }
                  </p>


                  <b>
                    {isSelected
                      ? "SELECTED ✓"
                      : "CHOOSE →"}
                  </b>

                </button>
              );
            },
          )}

        </div>


        {selected && (
          <section className="awv7-decision">

            <div>

              <span>
                YOUR DECISION
              </span>

              <h2>
                {
                  selected.title
                }
              </h2>

              <p>
                {
                  selected.consequence
                }
              </p>

            </div>


            <button
              type="button"
              onClick={next}
            >
              {sceneIndex ===
              scenes.length - 1
                ? "ANALYZE MY WING →"
                : "CONTINUE MISSION →"}
            </button>

          </section>
        )}

      </section>

    </main>
  );
}


export default WingMatchV7;
