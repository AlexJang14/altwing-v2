import {
  useMemo,
  useState,
} from "react";

import "./structures-lab.css";


interface Props {
  onEvidence: (
    evidence: string,
  ) => void;
}


type MaterialId =
  | "light"
  | "strong"
  | "composite";


const G0 =
  9.80665;

const LANDER_MASS =
  5200;

const LEG_COUNT =
  4;

const LEG_LENGTH =
  1.2;

const REQUIRED_FOS =
  1.5;

const MASS_LIMIT =
  7;


const MATERIALS = {

  light: {
    id:
      "light" as MaterialId,

    name:
      "MATERIAL A",

    label:
      "LIGHTWEIGHT ALLOY CONCEPT",

    allowableMPa:
      180,

    density:
      2700,

    description:
      "Low structural mass, but less strength margin.",
  },


  strong: {
    id:
      "strong" as MaterialId,

    name:
      "MATERIAL B",

    label:
      "HIGH-STRENGTH METAL CONCEPT",

    allowableMPa:
      320,

    density:
      4500,

    description:
      "Higher strength, but the structure becomes heavier.",
  },


  composite: {
    id:
      "composite" as MaterialId,

    name:
      "MATERIAL C",

    label:
      "COMPOSITE CONCEPT",

    allowableMPa:
      250,

    density:
      1600,

    description:
      "Good strength-to-mass performance with simplified assumptions.",
  },

};


function calculate(
  materialId: MaterialId,
  areaMM2: number,
  touchdownG: number,
) {

  const material =
    MATERIALS[
      materialId
    ];


  const totalForce =
    LANDER_MASS *
    G0 *
    touchdownG;


  const forcePerLeg =
    totalForce /
    LEG_COUNT;


  /*
   * N / mm² = MPa
   */
  const stressMPa =
    forcePerLeg /
    areaMM2;


  const factorOfSafety =
    material.allowableMPa /
    stressMPa;


  const areaM2 =
    areaMM2 /
    1_000_000;


  const structuralMass =
    areaM2 *
    LEG_LENGTH *
    LEG_COUNT *
    material.density;


  return {
    forcePerLeg,
    stressMPa,
    factorOfSafety,
    structuralMass,

    safetyPass:
      factorOfSafety >=
      REQUIRED_FOS,

    massPass:
      structuralMass <=
      MASS_LIMIT,
  };
}


export default function StructuresLab({
  onEvidence,
}: Props) {

  const [
    material,
    setMaterial,
  ] =
    useState<MaterialId>(
      "light"
    );


  const [
    area,
    setArea,
  ] =
    useState(
      350
    );


  const [
    touchdownG,
    setTouchdownG,
  ] =
    useState(
      4
    );


  const [
    hasRun,
    setHasRun,
  ] =
    useState(
      false
    );


  const [
    locked,
    setLocked,
  ] =
    useState(
      false
    );


  const result =
    useMemo(
      () =>
        calculate(
          material,
          area,
          touchdownG,
        ),
      [
        material,
        area,
        touchdownG,
      ],
    );


  const missionPass =
    result.safetyPass &&
    result.massPass;


  function resetResult() {

    setHasRun(
      false
    );

    setLocked(
      false
    );

    onEvidence(
      ""
    );
  }


  function runModel() {

    setHasRun(
      true
    );


    onEvidence(
      [
        `Structure test run.`,
        `Material: ${MATERIALS[material].name}.`,
        `Leg area: ${area} mm².`,
        `Touchdown severity: ${touchdownG.toFixed(1)} g.`,
        `Stress: ${result.stressMPa.toFixed(1)} MPa.`,
        `Factor of safety: ${result.factorOfSafety.toFixed(2)}.`,
        `Estimated leg-system mass: ${result.structuralMass.toFixed(1)} kg.`,
      ].join(
        " "
      ),
    );
  }


  function lockDesign() {

    setLocked(
      true
    );


    onEvidence(
      [
        `Final structure decision: ${MATERIALS[material].name}.`,
        `Leg area: ${area} mm².`,
        `Touchdown severity: ${touchdownG.toFixed(1)} g.`,
        `Stress: ${result.stressMPa.toFixed(1)} MPa.`,
        `Factor of safety: ${result.factorOfSafety.toFixed(2)}.`,
        `Estimated structural mass: ${result.structuralMass.toFixed(1)} kg.`,
        `Safety requirement ${result.safetyPass ? "met" : "not met"}.`,
        `Mass requirement ${result.massPass ? "met" : "not met"}.`,
        `Overall mission result: ${missionPass ? "PASS" : "REVISE"}.`,
      ].join(
        " "
      ),
    );
  }


  return (
    <section className="slab">

      <div className="slab-intro">

        <span>
          ARES-10 · LANDING STRUCTURE
        </span>

        <h3>
          Make it lighter.
          Don't let it fail.
        </h3>

        <p>
          A Mars lander must survive
          touchdown without carrying
          unnecessary structural mass.
          Your job is to find a design
          with enough safety margin.
        </p>

      </div>


      <aside className="slab-disclosure">

        <strong>
          SIMPLIFIED LEARNING MODEL
        </strong>

        <p>
          Material properties and mission
          values in this activity are
          educational parameters, not
          flight-certified spacecraft data.
          The model demonstrates the
          relationship between load,
          cross-sectional area, stress,
          safety margin, and mass.
        </p>

      </aside>


      <section className="slab-mission">

        <div>

          <span>
            LANDER MASS
          </span>

          <strong>
            5,200 kg
          </strong>

        </div>


        <div>

          <span>
            REQUIRED SAFETY FACTOR
          </span>

          <strong>
            ≥ 1.50
          </strong>

        </div>


        <div>

          <span>
            STRUCTURAL MASS LIMIT
          </span>

          <strong>
            ≤ 7.0 kg
          </strong>

        </div>

      </section>


      <div className="slab-materials">

        {Object.values(
          MATERIALS
        ).map(
          item => (

            <button
              key={
                item.id
              }
              type="button"
              className={[
                "slab-material",

                material ===
                item.id
                  ? "is-selected"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => {

                setMaterial(
                  item.id
                );

                resetResult();
              }}
            >

              <span>
                {
                  item.label
                }
              </span>

              <h4>
                {
                  item.name
                }
              </h4>


              <div className="slab-material-stats">

                <div>

                  <small>
                    ALLOWABLE
                  </small>

                  <strong>
                    {
                      item.allowableMPa
                    }{" "}
                    MPa
                  </strong>

                </div>


                <div>

                  <small>
                    DENSITY
                  </small>

                  <strong>
                    {
                      item.density
                    }{" "}
                    kg/m³
                  </strong>

                </div>

              </div>


              <p>
                {
                  item.description
                }
              </p>

            </button>

          ),
        )}

      </div>


      <section className="slab-controls">

        <div className="slab-slider">

          <div>

            <span>
              LANDING LEG AREA
            </span>

            <strong>
              {area} mm²
            </strong>

          </div>


          <input
            type="range"
            min="200"
            max="800"
            step="25"
            value={
              area
            }
            onChange={
              event => {

                setArea(
                  Number(
                    event.target.value
                  )
                );

                resetResult();
              }
            }
          />


          <small>
            Smaller area saves mass,
            but increases stress.
          </small>

        </div>


        <div className="slab-slider">

          <div>

            <span>
              TOUCHDOWN SEVERITY
            </span>

            <strong>
              {touchdownG.toFixed(1)} g
            </strong>

          </div>


          <input
            type="range"
            min="3"
            max="6"
            step="0.5"
            value={
              touchdownG
            }
            onChange={
              event => {

                setTouchdownG(
                  Number(
                    event.target.value
                  )
                );

                resetResult();
              }
            }
          />


          <small>
            Harder landings create
            larger structural loads.
          </small>

        </div>

      </section>


      {!hasRun && (

        <button
          type="button"
          className="slab-run"
          onClick={
            runModel
          }
        >
          RUN TOUCHDOWN MODEL →
        </button>

      )}


      {hasRun && (

        <section className="slab-results">

          <article>

            <span>
              STRESS
            </span>

            <strong>
              {
                result.stressMPa
                  .toFixed(1)
              }{" "}
              MPa
            </strong>

            <small>
              Force ÷ area
            </small>

          </article>


          <article>

            <span>
              SAFETY FACTOR
            </span>

            <strong
              className={
                result.safetyPass
                  ? "pass"
                  : "fail"
              }
            >
              {
                result.factorOfSafety
                  .toFixed(2)
              }
            </strong>

            <small>
              Required ≥ 1.50
            </small>

          </article>


          <article>

            <span>
              STRUCTURAL MASS
            </span>

            <strong
              className={
                result.massPass
                  ? "pass"
                  : "warn"
              }
            >
              {
                result.structuralMass
                  .toFixed(1)
              }{" "}
              kg
            </strong>

            <small>
              Limit ≤ 7.0 kg
            </small>

          </article>


          <article>

            <span>
              MISSION
            </span>

            <strong
              className={
                missionPass
                  ? "pass"
                  : "fail"
              }
            >
              {missionPass
                ? "PASS"
                : "REVISE"}
            </strong>

            <small>
              Safety + mass
            </small>

          </article>

        </section>

      )}


      {hasRun && !locked && (

        <section className="slab-tradeoff">

          <span>
            ENGINEERING TRADEOFF
          </span>

          <h4>
            {missionPass
              ? "This design meets both constraints."
              : "One or more constraints still need work."}
          </h4>

          <p>
            Increasing leg area reduces
            stress but adds mass.
            Stronger material can improve
            safety margin, but material
            density may increase structural
            mass. There is no free improvement.
          </p>


          <button
            type="button"
            onClick={
              lockDesign
            }
          >
            KEEP THIS DESIGN →
          </button>

        </section>

      )}


      {locked && (

        <section className="slab-locked">

          <span>
            STRUCTURE DECISION SAVED
          </span>

          <strong>
            {
              MATERIALS[
                material
              ].name
            }
            {" · "}
            {area}
            {" mm²"}
          </strong>

          <p>
            Your test result is ready
            for the Compare stage.
          </p>

        </section>

      )}

    </section>
  );
}
