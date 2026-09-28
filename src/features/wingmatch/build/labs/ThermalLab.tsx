import {
  useMemo,
  useState,
} from "react";

import "./thermal-lab.css";

interface Props {
  onEvidence: (
    evidence: string
  ) => void;
}

type SurfaceId =
  | "white"
  | "reflective"
  | "dark";

type InsulationId =
  | "low"
  | "medium"
  | "high";

const SIGMA =
  5.670374419e-8;

const SOLAR_FLUX =
  590;

const RADIATING_AREA =
  2.5;

const INTERNAL_POWER =
  180;

const SAFE_MIN =
  -20;

const SAFE_MAX =
  50;

const HEATER_BUDGET =
  150;

const SURFACES = {
  white: {
    name:
      "WHITE COATING",
    absorptivity:
      0.25,
    emissivity:
      0.85,
    note:
      "Reflects much of the sunlight while radiating heat efficiently.",
  },

  reflective: {
    name:
      "REFLECTIVE FILM",
    absorptivity:
      0.20,
    emissivity:
      0.35,
    note:
      "Absorbs little sunlight, but also radiates stored heat less effectively.",
  },

  dark: {
    name:
      "DARK SURFACE",
    absorptivity:
      0.85,
    emissivity:
      0.90,
    note:
      "Absorbs much more solar energy and can run hot in sunlight.",
  },
};

const INSULATION = {
  low: {
    name:
      "LOW",
    factor:
      1.0,
  },

  medium: {
    name:
      "MEDIUM",
    factor:
      0.60,
  },

  high: {
    name:
      "HIGH",
    factor:
      0.30,
  },
};

function equilibriumTemperature(
  flux: number,
  emissivity: number,
) {
  const kelvin =
    Math.pow(
      flux /
        (
          emissivity *
          SIGMA
        ),
      0.25,
    );

  return (
    kelvin -
    273.15
  );
}

export default function ThermalLab({
  onEvidence,
}: Props) {
  const [
    surface,
    setSurface,
  ] =
    useState<SurfaceId>(
      "white"
    );

  const [
    insulation,
    setInsulation,
  ] =
    useState<InsulationId>(
      "medium"
    );

  const [
    heater,
    setHeater,
  ] =
    useState(
      120
    );

  const [
    ran,
    setRan,
  ] =
    useState(false);

  const [
    locked,
    setLocked,
  ] =
    useState(false);

  const result =
    useMemo(
      () => {
        const s =
          SURFACES[
            surface
          ];

        const i =
          INSULATION[
            insulation
          ];

        const effectiveEmissivity =
          Math.max(
            0.03,
            s.emissivity *
              i.factor,
          );

        const internalFlux =
          (
            INTERNAL_POWER +
            heater
          ) /
          RADIATING_AREA;

        const sunlightFlux =
          (
            s.absorptivity *
            SOLAR_FLUX
          ) +
          internalFlux;

        const sunlight =
          equilibriumTemperature(
            sunlightFlux,
            effectiveEmissivity,
          );

        const eclipse =
          equilibriumTemperature(
            internalFlux,
            effectiveEmissivity,
          );

        const sunSafe =
          sunlight >=
            SAFE_MIN &&
          sunlight <=
            SAFE_MAX;

        const eclipseSafe =
          eclipse >=
            SAFE_MIN &&
          eclipse <=
            SAFE_MAX;

        const powerSafe =
          heater <=
          HEATER_BUDGET;

        return {
          sunlight,
          eclipse,
          sunSafe,
          eclipseSafe,
          powerSafe,

          pass:
            sunSafe &&
            eclipseSafe &&
            powerSafe,
        };
      },
      [
        surface,
        insulation,
        heater,
      ],
    );

  function reset() {
    setRan(false);
    setLocked(false);
    onEvidence("");
  }

  function runModel() {
    setRan(true);

    onEvidence(
      [
        "Thermal case run.",
        `Surface: ${SURFACES[surface].name}.`,
        `Insulation: ${INSULATION[insulation].name}.`,
        `Heater: ${heater} W.`,
        `Sunlight temperature: ${result.sunlight.toFixed(1)} C.`,
        `Eclipse temperature: ${result.eclipse.toFixed(1)} C.`,
        `Result: ${result.pass ? "PASS" : "REVISE"}.`,
      ].join(" "),
    );
  }

  function saveDecision() {
    if (!result.pass) {
      return;
    }

    setLocked(true);

    onEvidence(
      [
        `Final thermal decision: ${SURFACES[surface].name}.`,
        `Insulation: ${INSULATION[insulation].name}.`,
        `Heater power: ${heater} W.`,
        `Sunlight temperature: ${result.sunlight.toFixed(1)} C.`,
        `Eclipse temperature: ${result.eclipse.toFixed(1)} C.`,
        "Thermal limits satisfied.",
      ].join(" "),
    );
  }

  return (
    <section className="thermal-lab">

      <div className="thermal-heading">
        <span>
          ARES-11 · THERMAL CONTROL
        </span>

        <h3>
          Keep it alive through
          sunlight and darkness.
        </h3>

        <p>
          Balance surface properties,
          insulation, and heater power
          so the spacecraft survives
          both Mars sunlight and eclipse.
        </p>
      </div>


      <div className="thermal-note">
        <strong>
          SIMPLIFIED LEARNING MODEL
        </strong>

        <p>
          This activity demonstrates
          radiative thermal tradeoffs.
          Real spacecraft thermal
          analysis uses much more
          detailed geometry, conduction,
          and transient modeling.
        </p>
      </div>


      <div className="thermal-limits">

        <div>
          <span>
            SAFE RANGE
          </span>
          <strong>
            −20 to 50 °C
          </strong>
        </div>

        <div>
          <span>
            HEATER LIMIT
          </span>
          <strong>
            150 W
          </strong>
        </div>

        <div>
          <span>
            MARS SOLAR CASE
          </span>
          <strong>
            590 W/m²
          </strong>
        </div>

      </div>


      <h4 className="thermal-label">
        01 · SURFACE
      </h4>

      <div className="thermal-options">

        {(
          Object.keys(
            SURFACES
          ) as SurfaceId[]
        ).map(
          id => (
            <button
              key={id}
              type="button"
              className={
                surface === id
                  ? "selected"
                  : ""
              }
              onClick={() => {
                setSurface(id);
                reset();
              }}
            >
              <strong>
                {
                  SURFACES[
                    id
                  ].name
                }
              </strong>

              <span>
                α{" "}
                {
                  SURFACES[
                    id
                  ].absorptivity
                }
                {" · "}
                ε{" "}
                {
                  SURFACES[
                    id
                  ].emissivity
                }
              </span>

              <p>
                {
                  SURFACES[
                    id
                  ].note
                }
              </p>
            </button>
          ),
        )}

      </div>


      <h4 className="thermal-label">
        02 · INSULATION
      </h4>

      <div className="thermal-small-options">

        {(
          Object.keys(
            INSULATION
          ) as InsulationId[]
        ).map(
          id => (
            <button
              key={id}
              type="button"
              className={
                insulation === id
                  ? "selected"
                  : ""
              }
              onClick={() => {
                setInsulation(id);
                reset();
              }}
            >
              {
                INSULATION[
                  id
                ].name
              }
            </button>
          ),
        )}

      </div>


      <div className="thermal-slider">

        <div>
          <span>
            03 · HEATER POWER
          </span>

          <strong>
            {heater} W
          </strong>
        </div>

        <input
          type="range"
          min="0"
          max="160"
          step="10"
          value={heater}
          onChange={
            event => {
              setHeater(
                Number(
                  event.target.value
                )
              );

              reset();
            }
          }
        />
      </div>


      <button
        type="button"
        className="thermal-run"
        onClick={
          runModel
        }
      >
        RUN HOT + COLD CASES →
      </button>


      {ran && (
        <>
          <div className="thermal-results">

            <article>
              <span>
                SUNLIGHT
              </span>

              <strong
                className={
                  result.sunSafe
                    ? "pass"
                    : "fail"
                }
              >
                {
                  result.sunlight
                    .toFixed(1)
                }
                °C
              </strong>
            </article>


            <article>
              <span>
                ECLIPSE
              </span>

              <strong
                className={
                  result.eclipseSafe
                    ? "pass"
                    : "fail"
                }
              >
                {
                  result.eclipse
                    .toFixed(1)
                }
                °C
              </strong>
            </article>


            <article>
              <span>
                HEATER
              </span>

              <strong
                className={
                  result.powerSafe
                    ? "pass"
                    : "fail"
                }
              >
                {heater} W
              </strong>
            </article>


            <article>
              <span>
                MISSION
              </span>

              <strong
                className={
                  result.pass
                    ? "pass"
                    : "fail"
                }
              >
                {result.pass
                  ? "PASS"
                  : "REVISE"}
              </strong>
            </article>

          </div>


          <div className="thermal-explain">
            <strong>
              THERMAL TRADEOFF
            </strong>

            <p>
              More insulation helps retain
              heat in eclipse, but can make
              sunlight conditions hotter.
              More heater power helps the
              cold case, but consumes a
              limited spacecraft resource.
            </p>

            {result.pass ? (
              <button
                type="button"
                onClick={
                  saveDecision
                }
              >
                KEEP THIS THERMAL DESIGN →
              </button>
            ) : (
              <span>
                Change the design and
                run the model again.
              </span>
            )}
          </div>
        </>
      )}


      {locked && (
        <div className="thermal-saved">
          <span>
            THERMAL DECISION SAVED
          </span>

          <strong>
            {
              SURFACES[
                surface
              ].name
            }
            {" · "}
            {
              INSULATION[
                insulation
              ].name
            }
          </strong>
        </div>
      )}

    </section>
  );
}
