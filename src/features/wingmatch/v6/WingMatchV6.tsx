import {
  useMemo,
  useState,
} from "react";

import MissionVisual from "./MissionVisual";

import "./wingmatch-v6.css";


interface WingMatchV6Props {
  onExit: () => void;
}


interface WingOption {
  id: string;

  title: string;

  description: string;

  consequence: string;
}


interface WingScene {
  id: string;

  phase: string;

  eyebrow: string;

  situation: string;

  question: string;

  options: WingOption[];
}


type WingId =
  | "gnc"
  | "avionics"
  | "structures"
  | "thermal"
  | "propulsion"
  | "mission-design";


interface WingMeta {
  id: WingId;

  name: string;

  short: string;

  description: string;
}


const WINGS:
  WingMeta[] = [

    {
      id:
        "gnc",

      name:
        "Guidance, Navigation & Control",

      short:
        "GNC",

      description:
        "You showed a stronger tendency to reason through motion, control, uncertainty, trajectory, and vehicle behavior.",
    },

    {
      id:
        "avionics",

      name:
        "Avionics",

      short:
        "AVIONICS",

      description:
        "You showed a stronger tendency to investigate sensing, electronics, information, faults, and system signals.",
    },

    {
      id:
        "structures",

      name:
        "Structures",

      short:
        "STRUCTURES",

      description:
        "You showed a stronger tendency to think about loads, physical limits, mechanisms, reliability, and how hardware survives.",
    },

    {
      id:
        "thermal",

      name:
        "Thermal Engineering",

      short:
        "THERMAL",

      description:
        "You showed a stronger tendency to protect temperature margins, manage heat, and reason about environmental limits.",
    },

    {
      id:
        "propulsion",

      name:
        "Propulsion",

      short:
        "PROPULSION",

      description:
        "You showed a stronger tendency to think about thrust, fuel, energy, performance margins, and vehicle capability.",
    },

    {
      id:
        "mission-design",

      name:
        "Mission Design",

      short:
        "MISSION DESIGN",

      description:
        "You showed a stronger tendency to balance competing objectives and make system-level mission tradeoffs.",
    },
  ];


/*
 * Hidden scoring.
 *
 * Students never see which Wing an option
 * points toward while answering.
 *
 * That prevents the quiz from becoming:
 * "click the answer that sounds like
 * the career I already want."
 */

const WING_SCORE_MAP:
  Record<
    string,
    Partial<
      Record<
        WingId,
        number
      >
    >
  > = {

    "reduce-heating": {
      thermal: 3,
      gnc: 1,
    },

    "hold-path": {
      gnc: 3,
      thermal: 1,
    },

    "rebalance-system": {
      "mission-design": 3,
      thermal: 1,
      gnc: 1,
    },


    "independent-sensor": {
      avionics: 3,
      gnc: 1,
    },

    "motion-model": {
      gnc: 3,
      avionics: 1,
    },

    "mission-context": {
      "mission-design": 3,
      gnc: 1,
    },


    "save-fuel": {
      propulsion: 3,
      "mission-design": 1,
    },

    "keep-control": {
      gnc: 3,
      propulsion: 2,
    },

    "change-objective": {
      "mission-design": 3,
      propulsion: 1,
    },


    "reinforce-load": {
      structures: 3,
      "mission-design": 1,
    },

    "reduce-impact": {
      structures: 2,
      gnc: 2,
    },

    "inspect-pattern": {
      structures: 2,
      avionics: 2,
    },


    "communications-first": {
      avionics: 3,
      "mission-design": 1,
    },

    "science-first": {
      "mission-design": 3,
      avionics: 1,
    },

    "balanced-cycles": {
      avionics: 2,
      "mission-design": 2,
    },


    "terrain-map": {
      gnc: 2,
      structures: 2,
    },

    "science-map": {
      "mission-design": 3,
      avionics: 1,
    },

    "resource-map": {
      propulsion: 2,
      "mission-design": 2,
    },


    "check-signal": {
      avionics: 3,
    },

    "test-behavior": {
      gnc: 2,
      avionics: 2,
    },

    "isolate-subsystems": {
      avionics: 3,
      "mission-design": 1,
    },


    "reliable-finish": {
      "mission-design": 2,
      structures: 2,
    },

    "science-finish": {
      "mission-design": 3,
      avionics: 1,
    },

    "engineering-finish": {
      avionics: 2,
      structures: 1,
      propulsion: 1,
      thermal: 1,
    },
  };


interface WingResult
  extends WingMeta {

  score: number;

  relative: number;
}


function calculateWingResults(
  answers:
    Record<
      string,
      string
    >,
): WingResult[] {

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


  Object.values(
    answers,
  ).forEach(
    (
      optionId,
    ) => {

      const contribution =
        WING_SCORE_MAP[
          optionId
        ];

      if (!contribution) {
        return;
      }


      Object.entries(
        contribution,
      ).forEach(
        ([
          wing,
          value,
        ]) => {

          totals[
            wing as WingId
          ] +=
            value ?? 0;
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



const SCENES: WingScene[] = [

  {
    id: "entry-heat",

    phase:
      "MARS ENTRY",

    eyebrow:
      "MISSION 01 / THERMAL TRADEOFF",

    situation:
      "Your lander is entering the Martian atmosphere. Heating is climbing faster than predicted, but changing course now could make the landing less accurate.",

    question:
      "What would you protect first?",

    options: [
      {
        id:
          "reduce-heating",

        title:
          "Reduce the heating",

        description:
          "Change the flight path to lower thermal stress, even if the landing becomes less precise.",

        consequence:
          "Thermal margin improves, but the vehicle gives up some control over exactly where it will land.",
      },

      {
        id:
          "hold-path",

        title:
          "Hold the landing path",

        description:
          "Keep the planned trajectory and accept a smaller thermal margin.",

        consequence:
          "The landing solution remains predictable, but the heat shield must tolerate the higher load.",
      },

      {
        id:
          "rebalance-system",

        title:
          "Rebalance the whole system",

        description:
          "Look for smaller changes across trajectory, power, and thermal limits instead of making one large correction.",

        consequence:
          "No single subsystem gets everything it wants, but the mission keeps more overall flexibility.",
      },
    ],
  },


  {
    id:
      "sensor-conflict",

    phase:
      "DESCENT",

    eyebrow:
      "MISSION 02 / SENSOR CONFLICT",

    situation:
      "Two altitude sensors disagree while the landing burn is getting closer. You have enough time for one additional move.",

    question:
      "How would you handle the disagreement?",

    options: [
      {
        id:
          "independent-sensor",

        title:
          "Get an independent reading",

        description:
          "Use another sensor to check which measurement is more believable.",

        consequence:
          "You gain another piece of evidence, but spend precious time before the burn.",
      },

      {
        id:
          "motion-model",

        title:
          "Use the motion prediction",

        description:
          "Compare both readings with how the vehicle should be moving according to the flight model.",

        consequence:
          "The vehicle model becomes your reference, but a bad model could mislead the decision.",
      },

      {
        id:
          "mission-context",

        title:
          "Use what the next maneuver needs",

        description:
          "Judge which uncertainty matters most for the upcoming burn and act around that risk.",

        consequence:
          "You make a mission-focused decision without fully resolving which sensor is wrong.",
      },
    ],
  },


  {
    id:
      "fuel-margin",

    phase:
      "POWERED DESCENT",

    eyebrow:
      "MISSION 03 / PROPULSION",

    situation:
      "The lander is consuming fuel slightly faster than expected. You can still reach the surface, but the original reserve is disappearing.",

    question:
      "Where would you accept the tradeoff?",

    options: [
      {
        id:
          "save-fuel",

        title:
          "Protect the fuel reserve",

        description:
          "Use a more efficient descent even if it gives the guidance system less freedom to correct later.",

        consequence:
          "Fuel margin grows, while the final descent becomes less flexible.",
      },

      {
        id:
          "keep-control",

        title:
          "Protect maneuvering freedom",

        description:
          "Keep enough thrust available for late corrections, even if the reserve becomes smaller.",

        consequence:
          "The vehicle stays responsive, but has less fuel left for unexpected problems.",
      },

      {
        id:
          "change-objective",

        title:
          "Change the mission target",

        description:
          "Accept a less demanding landing objective so several systems can operate with more margin.",

        consequence:
          "The mission gives up some original ambition in exchange for a more forgiving descent.",
      },
    ],
  },


  {
    id:
      "structure-vibration",

    phase:
      "LOW ALTITUDE",

    eyebrow:
      "MISSION 04 / STRUCTURES",

    situation:
      "A vibration appears in one landing-leg assembly. The structure is still within limits, but the signal is growing.",

    question:
      "What would you do with the remaining margin?",

    options: [
      {
        id:
          "reinforce-load",

        title:
          "Protect the load path",

        description:
          "Shift or reinforce how the landing force will travel through the structure.",

        consequence:
          "Structural confidence improves, but the change adds mass or complexity.",
      },

      {
        id:
          "reduce-impact",

        title:
          "Reduce landing impact",

        description:
          "Change the descent so the landing gear experiences a smaller peak load.",

        consequence:
          "The structure receives less stress, but the flight profile becomes more restrictive.",
      },

      {
        id:
          "inspect-pattern",

        title:
          "Study the vibration pattern",

        description:
          "Use the remaining time to determine whether the vibration is local or part of a larger system problem.",

        consequence:
          "You gain diagnostic information, but delay committing to a physical fix.",
      },
    ],
  },


  {
    id:
      "power-shortage",

    phase:
      "SURFACE STARTUP",

    eyebrow:
      "MISSION 05 / POWER",

    situation:
      "After landing, available electrical power is lower than predicted. Navigation, communications, and science cannot all operate at full capacity.",

    question:
      "How would you allocate the limited power?",

    options: [
      {
        id:
          "communications-first",

        title:
          "Keep communications strongest",

        description:
          "Protect the link to Earth and operate the other systems at reduced power.",

        consequence:
          "The mission stays connected, but local science and autonomy slow down.",
      },

      {
        id:
          "science-first",

        title:
          "Protect the science window",

        description:
          "Use the limited opportunity to gather the highest-value measurements first.",

        consequence:
          "Science return increases, but less power remains for communication and reserve.",
      },

      {
        id:
          "balanced-cycles",

        title:
          "Run systems in cycles",

        description:
          "Schedule navigation, communications, and science at different times instead of running everything together.",

        consequence:
          "Peak demand falls, but mission operations become more complicated.",
      },
    ],
  },


  {
    id:
      "landing-site",

    phase:
      "SURFACE MISSION",

    eyebrow:
      "MISSION 06 / MISSION DESIGN",

    situation:
      "Two nearby sites are reachable. One is scientifically exciting but rough. The other is easier to operate in but has lower expected science value.",

    question:
      "Which information matters most before choosing?",

    options: [
      {
        id:
          "terrain-map",

        title:
          "Study the terrain risk",

        description:
          "Compare slopes, obstacles, and mobility limits before committing the rover.",

        consequence:
          "Operational uncertainty decreases, but the safer site may not be the most scientifically valuable.",
      },

      {
        id:
          "science-map",

        title:
          "Study the science value",

        description:
          "Find out which site contains the strongest target for the mission's main research question.",

        consequence:
          "Mission value becomes clearer, but difficult terrain may still threaten access.",
      },

      {
        id:
          "resource-map",

        title:
          "Study the resource cost",

        description:
          "Compare power, travel time, communication, and thermal demands for both sites.",

        consequence:
          "You understand the system-wide cost, but still have to decide how much risk the science is worth.",
      },
    ],
  },


  {
    id:
      "fault-isolation",

    phase:
      "ROVER OPERATIONS",

    eyebrow:
      "MISSION 07 / AVIONICS",

    situation:
      "A rover wheel command was sent, but the expected motion did not occur. The problem could be the sensor, electronics, software, or mechanism.",

    question:
      "Where would you start?",

    options: [
      {
        id:
          "check-signal",

        title:
          "Trace the electrical signal",

        description:
          "Check whether the command reached the actuator and whether the sensors responded.",

        consequence:
          "You narrow the electronic path first, while mechanical causes remain unresolved.",
      },

      {
        id:
          "test-behavior",

        title:
          "Run a controlled behavior test",

        description:
          "Send a small safe command and compare the real response with the expected model.",

        consequence:
          "The system itself becomes the experiment, but another test consumes time and energy.",
      },

      {
        id:
          "isolate-subsystems",

        title:
          "Separate the possible causes",

        description:
          "Design tests that distinguish software, electronics, sensing, and mechanical faults one by one.",

        consequence:
          "Diagnosis becomes systematic, but it may take longer than trying the most likely fix first.",
      },
    ],
  },


  {
    id:
      "final-priority",

    phase:
      "FINAL SOL",

    eyebrow:
      "MISSION 08 / FINAL DECISION",

    situation:
      "Only one major operation remains before the mission ends. You cannot maximize safety margin, science return, and system experimentation at the same time.",

    question:
      "What would you want the final operation to prove?",

    options: [
      {
        id:
          "reliable-finish",

        title:
          "Prove the system can finish reliably",

        description:
          "Choose the operation with the strongest overall mission margin and the fewest unresolved dependencies.",

        consequence:
          "The mission finishes with strong reliability evidence, but leaves some ambitious opportunities unused.",
      },

      {
        id:
          "science-finish",

        title:
          "Capture the highest-value science",

        description:
          "Use the remaining resources on the observation that could matter most scientifically.",

        consequence:
          "The final operation may create the strongest scientific result, but with less reserve.",
      },

      {
        id:
          "engineering-finish",

        title:
          "Test the most uncertain system",

        description:
          "Use the final opportunity to learn something that could improve the next vehicle or mission.",

        consequence:
          "The mission becomes an engineering experiment, trading immediate return for future knowledge.",
      },
    ],
  },
];


function shuffle<T>(
  items: T[],
): T[] {
  const copy =
    [...items];

  for (
    let i =
      copy.length - 1;
    i > 0;
    i -= 1
  ) {
    const j =
      Math.floor(
        Math.random() *
          (i + 1),
      );

    [
      copy[i],
      copy[j],
    ] = [
      copy[j],
      copy[i],
    ];
  }

  return copy;
}


function WingMatchV6({
  onExit,
}: WingMatchV6Props) {

  const [
    runNumber,
    setRunNumber,
  ] = useState(0);

  const [
    sceneIndex,
    setSceneIndex,
  ] = useState(0);

  const [
    selected,
    setSelected,
  ] =
    useState<WingOption | null>(
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
    hoveredOptionId,
    setHoveredOptionId,
  ] =
    useState<string | null>(
      null,
    );

  const [
    complete,
    setComplete,
  ] = useState(false);


  const scenes =
    useMemo(
      () =>
        SCENES.map(
          (scene) => ({
            ...scene,

            options:
              shuffle(
                scene.options,
              ),
          }),
        ),
      [runNumber],
    );


  const scene =
    scenes[sceneIndex];


  const progress =
    (
      (
        sceneIndex +
        (selected ? 1 : 0)
      ) /
      scenes.length
    ) *
    100;


  const wingResults =
    calculateWingResults(
      answers,
    );


  const strongestWing =
    wingResults[0];


  const topThreeWings =
    wingResults.slice(
      0,
      3,
    );


  function choose(
    option: WingOption,
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

    if (
      sceneIndex ===
      scenes.length - 1
    ) {
      setComplete(
        true,
      );

      return;
    }

    setSceneIndex(
      (current) =>
        current + 1,
    );

    setSelected(
      null,
    );

    setHoveredOptionId(
      null,
    );

    setHoveredOptionId(
      null,
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }


  function restart() {
    setRunNumber(
      (current) =>
        current + 1,
    );

    setSceneIndex(
      0,
    );

    setSelected(
      null,
    );

    setComplete(
      false,
    );

    setAnswers(
      {},
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }


  if (complete) {

    return (
      <main className="aw6-shell aw6-result-shell">

        <header className="aw6-topbar">

          <button
            type="button"
            className="aw6-exit"
            onClick={onExit}
          >
            ← ALTWING
          </button>

          <div className="aw6-brand">
            Alt<span>Wing</span>
          </div>

          <div className="aw6-count">
            RESULT
          </div>

        </header>


        <section className="aw6-result">

          <div className="aw6-result-intro">

            <span className="aw6-result-kicker">
              WINGMATCH COMPLETE
            </span>

            <h1>
              Your strongest
              <br />
              signal today.
            </h1>

            <p>
              WingMatch does not assign
              you a permanent career.
              It shows which engineering
              patterns appeared most
              often across the decisions
              you just made.
            </p>

          </div>


          <section className="aw6-primary-wing">

            <div className="aw6-primary-copy">

              <span>
                STRONGEST SIGNAL
              </span>

              <h2>
                {
                  strongestWing.name
                }
              </h2>

              <p>
                {
                  strongestWing.description
                }
              </p>

              <div className="aw6-result-note">
                Exploration signal —
                not aptitude,
                probability, or a
                permanent label.
              </div>

            </div>


            <div className="aw6-primary-mascot">

              <div className={[
                "aw6-result-orbit",
                `aw6-result-orbit--${strongestWing.id}`,
              ].join(" ")}>

                <img
                  src="/brand/altwing-penguin.png"
                  alt="AltWing penguin"
                />

              </div>

              <strong>
                {
                  strongestWing.short
                }
              </strong>

            </div>

          </section>


          <section className="aw6-result-section">

            <div className="aw6-result-section-heading">

              <span>
                YOUR TOP SIGNALS
              </span>

              <h2>
                Three directions worth
                testing next.
              </h2>

            </div>


            <div className="aw6-top-three">

              {topThreeWings.map(
                (
                  wing,
                  index,
                ) => (

                  <article
                    key={
                      wing.id
                    }
                    className="aw6-wing-result-card"
                  >

                    <span className="aw6-wing-result-rank">
                      0{index + 1}
                    </span>

                    <span className="aw6-wing-result-short">
                      {
                        wing.short
                      }
                    </span>

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

                    <div className="aw6-wing-result-meter">

                      <span>
                        <i
                          style={{
                            width:
                              `${wing.relative}%`,
                          }}
                        />
                      </span>

                    </div>

                  </article>

                ),
              )}

            </div>

          </section>


          <section className="aw6-result-section">

            <div className="aw6-result-section-heading">

              <span>
                WHAT YOU COULD HAVE GOTTEN
              </span>

              <h2>
                All six Wings were
                possible.
              </h2>

              <p>
                These bars show relative
                signal strength inside
                this run. They are not
                percentages or admission
                probabilities.
              </p>

            </div>


            <div className="aw6-all-wings">

              {wingResults.map(
                (
                  wing,
                ) => (

                  <div
                    key={
                      wing.id
                    }
                    className="aw6-all-wing-row"
                  >

                    <div>
                      <strong>
                        {
                          wing.short
                        }
                      </strong>

                      <span>
                        {
                          wing.name
                        }
                      </span>
                    </div>


                    <div className="aw6-all-wing-track">

                      <i
                        style={{
                          width:
                            `${wing.relative}%`,
                        }}
                      />

                    </div>

                  </div>

                ),
              )}

            </div>

          </section>


          <section className="aw6-result-next">

            <div>

              <span>
                NEXT STEP
              </span>

              <h2>
                Don't trust the result.
                Test the work.
              </h2>

              <p>
                Try a small project in
                your strongest Wing and
                see whether you actually
                enjoy doing the work.
              </p>

            </div>


            <div className="aw6-result-actions">

              <button
                type="button"
                className="aw6-result-primary"
                onClick={onExit}
              >
                CONTINUE TO ALTWING →
              </button>

              <button
                type="button"
                className="aw6-result-secondary"
                onClick={restart}
              >
                REPLAY WITH NEW ORDER
              </button>

            </div>

          </section>

        </section>

      </main>
    );
  }

  return (
    <main className="aw6-shell">

      <header className="aw6-topbar">

        <button
          type="button"
          className="aw6-exit"
          onClick={onExit}
        >
          ← EXIT
        </button>

        <div className="aw6-brand">
          Alt<span>Wing</span>
        </div>

        <div className="aw6-count">
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


      <div className="aw6-progress">
        <span
          style={{
            width:
              `${progress}%`,
          }}
        />
      </div>


      <section className="aw6-stage">

        <div className="aw6-mission-meta">
          <span>
            {scene.eyebrow}
          </span>

          <b>
            {scene.phase}
          </b>
        </div>


        <p className="aw6-situation">
          {scene.situation}
        </p>


        <h1 className="aw6-question">
          {scene.question}
        </h1>


        <p className="aw6-instruction">
          There is no perfect answer.
          Choose the tradeoff you would
          actually accept.
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


        <div className="aw6-options">

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
                    "aw6-option",

                    isSelected
                      ? "aw6-option--selected"
                      : "",

                    selected &&
                    !isSelected
                      ? "aw6-option--dimmed"
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

                  <span className="aw6-option-number">
                    OPTION{" "}
                    {index + 1}
                  </span>


                  <span className="aw6-option-title">
                    {
                      option.title
                    }
                  </span>


                  <span className="aw6-option-description">
                    {
                      option.description
                    }
                  </span>


                  <span className="aw6-option-action">
                    {isSelected
                      ? "SELECTED ✓"
                      : "CHOOSE →"}
                  </span>

                </button>
              );
            },
          )}

        </div>


        {selected && (
          <section className="aw6-consequence">

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

            <button
              type="button"
              onClick={next}
            >
              {sceneIndex ===
              scenes.length - 1
                ? "COMPLETE FLIGHT →"
                : "NEXT DECISION →"}
            </button>

          </section>
        )}

      </section>

    </main>
  );
}


export default WingMatchV6;
