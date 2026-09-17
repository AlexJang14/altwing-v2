import {
  useMemo,
  useState,
} from "react";

import "./propulsion-build-v1.css";


interface Props {
  onBack: () => void;
}


type EngineId =
  | "engine-a"
  | "engine-b";


type PayloadId =
  | "light"
  | "science"
  | "heavy";


const G0 = 9.80665;
const PROPELLANT_MASS = 2400;
const REQUIRED_DV = 1400;
const PREFERRED_BURN = 180;


const ENGINES = {
  "engine-a": {
    id: "engine-a" as EngineId,
    name: "ENGINE A",
    subtitle: "High-thrust concept",
    thrustKN: 60,
    isp: 320,
    note:
      "Stronger push. Uses propellant faster.",
  },

  "engine-b": {
    id: "engine-b" as EngineId,
    name: "ENGINE B",
    subtitle: "High-efficiency concept",
    thrustKN: 35,
    isp: 450,
    note:
      "Smaller push. Gets more velocity change from the same propellant.",
  },
};


const PAYLOADS = {
  light: {
    name: "LIGHT",
    dryMass: 3500,
    detail: "Smaller science package",
  },

  science: {
    name: "SCIENCE",
    dryMass: 4000,
    detail: "Baseline ARES-8 payload",
  },

  heavy: {
    name: "HEAVY",
    dryMass: 4700,
    detail: "Larger science package",
  },
};


function calculate(
  engineId: EngineId,
  payloadId: PayloadId,
) {

  const engine =
    ENGINES[
      engineId
    ];

  const payload =
    PAYLOADS[
      payloadId
    ];


  const thrustN =
    engine.thrustKN *
    1000;


  const massFlow =
    thrustN /
    (
      engine.isp *
      G0
    );


  const burnTime =
    PROPELLANT_MASS /
    massFlow;


  const initialMass =
    payload.dryMass +
    PROPELLANT_MASS;


  const deltaV =
    engine.isp *
    G0 *
    Math.log(
      initialMass /
      payload.dryMass,
    );


  return {
    massFlow,
    burnTime,
    deltaV,
    margin:
      deltaV -
      REQUIRED_DV,

    meetsDV:
      deltaV >=
      REQUIRED_DV,

    meetsBurn:
      burnTime <=
      PREFERRED_BURN,
  };
}


export default function PropulsionBuildV1({
  onBack,
}: Props) {

  const [
    initialEngine,
    setInitialEngine,
  ] =
    useState<
      EngineId | null
    >(
      null,
    );


  const [
    selectedEngine,
    setSelectedEngine,
  ] =
    useState<
      EngineId
    >(
      "engine-a",
    );


  const [
    payload,
    setPayload,
  ] =
    useState<
      PayloadId
    >(
      "science",
    );


  const [
    hasRun,
    setHasRun,
  ] =
    useState(
      false,
    );


  const [
    reason,
    setReason,
  ] =
    useState(
      "",
    );


  const [
    saved,
    setSaved,
  ] =
    useState(
      false,
    );


  const result =
    useMemo(
      () =>
        calculate(
          selectedEngine,
          payload,
        ),
      [
        selectedEngine,
        payload,
      ],
    );


  function chooseEngine(
    id: EngineId,
  ) {

    if (!initialEngine) {
      setInitialEngine(
        id,
      );
    }

    setSelectedEngine(
      id,
    );

    setHasRun(
      false,
    );
  }


  function saveProof() {

    const record = {
      wingId:
        "propulsion",

      initialEngine,
      finalEngine:
        selectedEngine,

      payload,

      reason,

      changed:
        initialEngine !==
        selectedEngine,

      result: {
        deltaV:
          Math.round(
            result.deltaV,
          ),

        burnTime:
          Math.round(
            result.burnTime,
          ),

        margin:
          Math.round(
            result.margin,
          ),
      },

      completedAt:
        new Date()
          .toISOString(),
    };


    localStorage.setItem(
      "altwing-propulsion-build-v1",
      JSON.stringify(
        record,
      ),
    );


    window.dispatchEvent(
      new CustomEvent(
        "altwing:build-progress",
        {
          detail:
            record,
        },
      ),
    );


    setSaved(
      true,
    );
  }


  if (saved) {

    return (
      <main className="pb1-overlay">

        <section className="pb1-complete">

          <span className="pb1-kicker">
            PROOF OF FLIGHT · SAVED
          </span>

          <h1>
            You made an
            engineering decision.
          </h1>

          <p>
            Not because one engine
            was simply “better,” but
            because you decided which
            tradeoff mattered more
            for this mission.
          </p>


          <div className="pb1-proof-card">

            <div>
              <span>
                FINAL ENGINE
              </span>

              <strong>
                {
                  ENGINES[
                    selectedEngine
                  ].name
                }
              </strong>
            </div>


            <div>
              <span>
                DELTA-V
              </span>

              <strong>
                {
                  Math.round(
                    result.deltaV,
                  )
                }{" "}
                m/s
              </strong>
            </div>


            <div>
              <span>
                BURN TIME
              </span>

              <strong>
                {
                  Math.round(
                    result.burnTime,
                  )
                }{" "}
                sec
              </strong>
            </div>


            <div>
              <span>
                DESIGN CHANGE
              </span>

              <strong>
                {
                  initialEngine !==
                  selectedEngine
                    ? "YES"
                    : "NO"
                }
              </strong>
            </div>

          </div>


          <div className="pb1-proof-reflection">

            <span>
              YOUR ENGINEERING NOTE
            </span>

            <p>
              {reason ||
                "No reflection added."}
            </p>

          </div>


          <button
            type="button"
            className="pb1-finish"
            onClick={
              onBack
            }
          >
            RETURN TO ALTWING →
          </button>

        </section>

      </main>
    );
  }


  return (
    <main className="pb1-overlay">

      <header className="pb1-topbar">

        <button
          type="button"
          onClick={
            onBack
          }
        >
          ← EXIT BUILD
        </button>

        <div>
          Alt<span>Wing</span>
        </div>

        <strong>
          PROPULSION · BUILD 01
        </strong>

      </header>


      <section className="pb1-shell">

        <div className="pb1-hero">

          <div>

            <span className="pb1-kicker">
              ARES-8 · MARS DEPARTURE
            </span>

            <h1>
              Choose the engine.
              <br />
              Defend the tradeoff.
            </h1>

            <p>
              ARES-8 needs at least
              <strong> 1,400 m/s </strong>
              of velocity change for its
              maneuver. Mission Control
              would also prefer the burn
              to finish within
              <strong> 180 seconds.</strong>
            </p>

          </div>


          <aside className="pb1-mission-card">

            <span>
              MISSION CONSTRAINTS
            </span>

            <div>
              <small>
                REQUIRED ΔV
              </small>

              <strong>
                1,400 m/s
              </strong>
            </div>

            <div>
              <small>
                PREFERRED BURN
              </small>

              <strong>
                ≤ 180 s
              </strong>
            </div>

            <div>
              <small>
                PROPELLANT
              </small>

              <strong>
                2,400 kg
              </strong>
            </div>

          </aside>

        </div>


        <section className="pb1-section">

          <div className="pb1-heading">

            <span>
              STEP 01
            </span>

            <h2>
              Pick your first engine.
            </h2>

            <p>
              There is no perfect
              choice. Decide what you
              think matters before
              seeing the full result.
            </p>

          </div>


          <div className="pb1-engine-grid">

            {Object.values(
              ENGINES,
            ).map(
              (
                engine,
              ) => {

                const active =
                  selectedEngine ===
                  engine.id &&
                  initialEngine !==
                  null;

                return (
                  <button
                    key={
                      engine.id
                    }
                    type="button"
                    className={
                      active
                        ? "pb1-engine is-active"
                        : "pb1-engine"
                    }
                    onClick={() =>
                      chooseEngine(
                        engine.id,
                      )
                    }
                  >

                    <span>
                      {
                        engine.subtitle
                      }
                    </span>

                    <h3>
                      {
                        engine.name
                      }
                    </h3>

                    <div className="pb1-engine-metrics">

                      <div>
                        <small>
                          THRUST
                        </small>

                        <strong>
                          {
                            engine.thrustKN
                          }{" "}
                          kN
                        </strong>
                      </div>

                      <div>
                        <small>
                          Isp
                        </small>

                        <strong>
                          {
                            engine.isp
                          }{" "}
                          s
                        </strong>
                      </div>

                    </div>

                    <p>
                      {
                        engine.note
                      }
                    </p>

                  </button>
                );
              },
            )}

          </div>

        </section>


        {initialEngine && (
          <section className="pb1-section">

            <div className="pb1-heading">

              <span>
                STEP 02
              </span>

              <h2>
                Change the payload.
                Run the model.
              </h2>

              <p>
                More spacecraft mass
                changes how much velocity
                change the same propellant
                can produce.
              </p>

            </div>


            <div className="pb1-payload-row">

              {Object.entries(
                PAYLOADS,
              ).map(
                ([
                  id,
                  option,
                ]) => (

                  <button
                    key={
                      id
                    }
                    type="button"
                    className={
                      payload ===
                      id
                        ? "is-active"
                        : ""
                    }
                    onClick={() => {
                      setPayload(
                        id as PayloadId,
                      );

                      setHasRun(
                        false,
                      );
                    }}
                  >

                    <span>
                      {
                        option.name
                      }
                    </span>

                    <strong>
                      {
                        option.dryMass
                          .toLocaleString()
                      }{" "}
                      kg
                    </strong>

                    <small>
                      {
                        option.detail
                      }
                    </small>

                  </button>

                ),
              )}

            </div>


            <button
              type="button"
              className="pb1-run"
              onClick={() =>
                setHasRun(
                  true,
                )
              }
            >
              RUN PROPULSION MODEL →
            </button>

          </section>
        )}


        {hasRun && (
          <section className="pb1-sim">

            <div className="pb1-sim-head">

              <div>
                <span>
                  SIMULATION RESULT
                </span>

                <h2>
                  {
                    ENGINES[
                      selectedEngine
                    ].name
                  }
                  {" · "}
                  {
                    PAYLOADS[
                      payload
                    ].name
                  }
                </h2>
              </div>


              <strong>
                SIMPLIFIED MODEL
              </strong>

            </div>


            <div className="pb1-sim-grid">

              <article>

                <span>
                  VELOCITY CHANGE
                </span>

                <strong>
                  {
                    Math.round(
                      result.deltaV,
                    )
                  }{" "}
                  m/s
                </strong>

                <div
                  className={
                    result.meetsDV
                      ? "pb1-status pass"
                      : "pb1-status fail"
                  }
                >
                  {result.meetsDV
                    ? "MISSION REQUIREMENT MET"
                    : "BELOW REQUIREMENT"}
                </div>

              </article>


              <article>

                <span>
                  BURN TIME
                </span>

                <strong>
                  {
                    Math.round(
                      result.burnTime,
                    )
                  }{" "}
                  sec
                </strong>

                <div
                  className={
                    result.meetsBurn
                      ? "pb1-status pass"
                      : "pb1-status warn"
                  }
                >
                  {result.meetsBurn
                    ? "INSIDE PREFERRED WINDOW"
                    : "LONGER BURN"}
                </div>

              </article>


              <article>

                <span>
                  ΔV MARGIN
                </span>

                <strong>
                  {
                    result.margin >= 0
                      ? "+"
                      : ""
                  }
                  {
                    Math.round(
                      result.margin,
                    )
                  }{" "}
                  m/s
                </strong>

                <small>
                  Margin after the
                  required maneuver.
                </small>

              </article>

            </div>


            <div className="pb1-tradeoff">

              <div>

                <span>
                  WHAT DID YOU JUST SEE?
                </span>

                <h3>
                  Faster burn and higher
                  efficiency are not the
                  same thing.
                </h3>

              </div>


              <p>
                Higher thrust can shorten
                a maneuver. Higher
                specific impulse can get
                more velocity change from
                the same propellant.
                Engineers choose based on
                the mission constraints.
              </p>

            </div>


            <details className="pb1-math">

              <summary>
                Want to see the physics?
              </summary>

              <p>
                This learning model uses
                the ideal rocket equation:
              </p>

              <code>
                Δv = Isp × g₀ ×
                ln(m₀ / mf)
              </code>

              <p>
                Burn time is estimated
                from propellant mass flow,
                using the relationship
                between thrust and
                specific impulse.
              </p>

              <a
                href="https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/ideal-rocket-equation/"
                target="_blank"
                rel="noreferrer"
              >
                NASA Glenn · Ideal Rocket Equation ↗
              </a>

            </details>


            <div className="pb1-reflect">

              <span>
                STEP 03 · DEFEND YOUR DESIGN
              </span>

              <h2>
                Would you keep this
                engine?
              </h2>

              <p>
                Switch engines or payloads
                above if you want.
                Then explain what mattered
                most in your final choice.
              </p>

              <textarea
                value={
                  reason
                }
                onChange={
                  event =>
                    setReason(
                      event.target.value,
                    )
                }
                placeholder="Example: I kept Engine A because the shorter burn mattered more for this maneuver, even though Engine B gave us more delta-v margin."
              />

              <button
                type="button"
                className="pb1-save"
                disabled={
                  reason.trim()
                    .length < 15
                }
                onClick={
                  saveProof
                }
              >
                SAVE PROOF OF FLIGHT →
              </button>

            </div>

          </section>
        )}

      </section>

    </main>
  );
}
