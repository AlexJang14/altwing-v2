import {
  useMemo,
  useState,
} from "react";

import "./propulsion-lab.css";


interface Props {
  onEvidence: (
    evidence: string,
  ) => void;
}


type EngineId =
  | "a"
  | "b";


const G0 =
  9.80665;

const PROPELLANT_MASS =
  2400;

const REQUIRED_DV =
  1400;

const PREFERRED_BURN_TIME =
  180;


const ENGINES = {
  a: {
    id:
      "a" as EngineId,

    name:
      "ENGINE A",

    label:
      "HIGH THRUST",

    thrustKN:
      60,

    isp:
      320,

    description:
      "Stronger push and shorter burn. Lower propellant efficiency.",
  },

  b: {
    id:
      "b" as EngineId,

    name:
      "ENGINE B",

    label:
      "HIGH EFFICIENCY",

    thrustKN:
      35,

    isp:
      450,

    description:
      "Smaller push and longer burn. More velocity change from the same propellant.",
  },
};


function calculate(
  engineId: EngineId,
  dryMass: number,
) {

  const engine =
    ENGINES[
      engineId
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
    dryMass +
    PROPELLANT_MASS;


  const deltaV =
    engine.isp *
    G0 *
    Math.log(
      initialMass /
      dryMass,
    );


  return {
    burnTime,
    deltaV,

    deltaVMargin:
      deltaV -
      REQUIRED_DV,

    meetsDeltaV:
      deltaV >=
      REQUIRED_DV,

    meetsBurn:
      burnTime <=
      PREFERRED_BURN_TIME,
  };
}


export default function PropulsionLab({
  onEvidence,
}: Props) {

  const [
    dryMass,
    setDryMass,
  ] =
    useState(
      4000,
    );


  const [
    selectedEngine,
    setSelectedEngine,
  ] =
    useState<
      EngineId | null
    >(
      null,
    );


  const [
    hasRun,
    setHasRun,
  ] =
    useState(
      false,
    );


  const resultA =
    useMemo(
      () =>
        calculate(
          "a",
          dryMass,
        ),
      [
        dryMass,
      ],
    );


  const resultB =
    useMemo(
      () =>
        calculate(
          "b",
          dryMass,
        ),
      [
        dryMass,
      ],
    );


  function runModel() {

    setHasRun(
      true,
    );


    const aDV =
      Math.round(
        resultA.deltaV,
      );

    const bDV =
      Math.round(
        resultB.deltaV,
      );

    const aBurn =
      Math.round(
        resultA.burnTime,
      );

    const bBurn =
      Math.round(
        resultB.burnTime,
      );


    onEvidence(
      [
        `Payload dry mass: ${dryMass} kg.`,
        `Engine A: ${aDV} m/s delta-v, ${aBurn} s burn.`,
        `Engine B: ${bDV} m/s delta-v, ${bBurn} s burn.`,
        selectedEngine
          ? `Student selected Engine ${selectedEngine.toUpperCase()}.`
          : "No final engine selected yet.",
      ].join(
        " ",
      ),
    );
  }


  function chooseEngine(
    id: EngineId,
  ) {

    setSelectedEngine(
      id,
    );


    const result =
      id === "a"
        ? resultA
        : resultB;


    onEvidence(
      [
        `Payload dry mass: ${dryMass} kg.`,
        `Final test selection: Engine ${id.toUpperCase()}.`,
        `Delta-v: ${Math.round(result.deltaV)} m/s.`,
        `Burn time: ${Math.round(result.burnTime)} s.`,
        `Delta-v requirement ${result.meetsDeltaV ? "met" : "not met"}.`,
        `Preferred burn window ${result.meetsBurn ? "met" : "not met"}.`,
      ].join(
        " ",
      ),
    );
  }


  return (
    <section className="plab">

      <div className="plab-intro">

        <span>
          ARES-8 PROPULSION LAB
        </span>

        <h3>
          One engine is faster.
          One is more efficient.
        </h3>

        <p>
          Your spacecraft needs at least
          <strong> 1,400 m/s </strong>
          of Δv. Mission Control would
          prefer the burn to finish in
          <strong> 180 seconds or less.</strong>
        </p>

      </div>


      <aside className="plab-disclosure">

        <strong>
          FICTIONAL DESIGN CASE
        </strong>

        <p>
          Engine A and Engine B are invented
          for learning. The physics relationships
          are based on NASA propulsion concepts.
          These values are not NASA flight hardware data.
        </p>

      </aside>


      <section className="plab-control">

        <div className="plab-control-head">

          <div>

            <span>
              SPACECRAFT DRY MASS
            </span>

            <strong>
              {
                dryMass.toLocaleString()
              }{" "}
              kg
            </strong>

          </div>


          <small>
            More mass makes the same
            propellant produce less Δv.
          </small>

        </div>


        <input
          type="range"
          min="3400"
          max="5000"
          step="100"
          value={
            dryMass
          }
          onChange={
            event => {

              setDryMass(
                Number(
                  event.target.value,
                ),
              );

              setHasRun(
                false,
              );

              setSelectedEngine(
                null,
              );

              onEvidence(
                "",
              );
            }
          }
          aria-label="Spacecraft dry mass"
        />


        <div className="plab-scale">

          <span>
            3,400 kg
          </span>

          <span>
            5,000 kg
          </span>

        </div>

      </section>


      <div className="plab-engine-grid">

        {Object.values(
          ENGINES,
        ).map(
          engine => (

            <article
              key={
                engine.id
              }
              className={[
                "plab-engine",

                selectedEngine ===
                engine.id
                  ? "is-selected"
                  : "",
              ]
                .filter(
                  Boolean,
                )
                .join(
                  " ",
                )}
            >

              <span>
                {
                  engine.label
                }
              </span>

              <h4>
                {
                  engine.name
                }
              </h4>


              <div className="plab-engine-numbers">

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
                    SPECIFIC IMPULSE
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
                  engine.description
                }
              </p>


              {hasRun && (

                <div className="plab-result-preview">

                  <div>

                    <span>
                      ΔV
                    </span>

                    <strong>
                      {
                        Math.round(
                          engine.id === "a"
                            ? resultA.deltaV
                            : resultB.deltaV,
                        )
                      }{" "}
                      m/s
                    </strong>

                  </div>


                  <div>

                    <span>
                      BURN
                    </span>

                    <strong>
                      {
                        Math.round(
                          engine.id === "a"
                            ? resultA.burnTime
                            : resultB.burnTime,
                        )
                      }{" "}
                      s
                    </strong>

                  </div>

                </div>

              )}


              {hasRun && (

                <button
                  type="button"
                  onClick={() =>
                    chooseEngine(
                      engine.id,
                    )
                  }
                >
                  {selectedEngine ===
                  engine.id
                    ? "SELECTED ✓"
                    : `CHOOSE ${engine.name} →`}
                </button>

              )}

            </article>

          ),
        )}

      </div>


      {!hasRun && (

        <button
          type="button"
          className="plab-run"
          onClick={
            runModel
          }
        >
          RUN PROPULSION MODEL →
        </button>

      )}


      {hasRun && (

        <section className="plab-comparison">

          <header>

            <span>
              MODEL RESULT
            </span>

            <h3>
              The tradeoff changed.
            </h3>

          </header>


          <div className="plab-compare-grid">

            <article>

              <span>
                ENGINE A
              </span>

              <strong>
                {
                  Math.round(
                    resultA.deltaV,
                  )
                }{" "}
                m/s
              </strong>

              <p>
                Δv requirement:
                {" "}
                <b
                  className={
                    resultA.meetsDeltaV
                      ? "pass"
                      : "fail"
                  }
                >
                  {resultA.meetsDeltaV
                    ? "PASS"
                    : "FAIL"}
                </b>
              </p>

              <p>
                Burn window:
                {" "}
                <b
                  className={
                    resultA.meetsBurn
                      ? "pass"
                      : "warn"
                  }
                >
                  {resultA.meetsBurn
                    ? "PASS"
                    : "LONG"}
                </b>
              </p>

            </article>


            <article>

              <span>
                ENGINE B
              </span>

              <strong>
                {
                  Math.round(
                    resultB.deltaV,
                  )
                }{" "}
                m/s
              </strong>

              <p>
                Δv requirement:
                {" "}
                <b
                  className={
                    resultB.meetsDeltaV
                      ? "pass"
                      : "fail"
                  }
                >
                  {resultB.meetsDeltaV
                    ? "PASS"
                    : "FAIL"}
                </b>
              </p>

              <p>
                Burn window:
                {" "}
                <b
                  className={
                    resultB.meetsBurn
                      ? "pass"
                      : "warn"
                  }
                >
                  {resultB.meetsBurn
                    ? "PASS"
                    : "LONG"}
                </b>
              </p>

            </article>

          </div>


          <div className="plab-insight">

            <span>
              ENGINEERING INSIGHT
            </span>

            <p>
              Higher thrust and higher
              efficiency are different advantages.
              Engine A finishes the burn faster.
              Engine B produces more Δv from the
              same amount of propellant.
              Mission constraints decide which
              tradeoff matters more.
            </p>

          </div>

        </section>

      )}

    </section>
  );
}
