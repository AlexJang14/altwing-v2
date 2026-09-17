import {
  useMemo,
  useState,
} from "react";

import "./gnc-lab.css";


interface Props {
  onEvidence: (
    evidence: string,
  ) => void;
}


const RADAR_ALTITUDE =
  1420;

const INERTIAL_ALTITUDE =
  1670;

const MODEL_ALTITUDE =
  1510;


/*
 * Fictional hidden truth for
 * this educational scenario.
 */
const TRUE_ALTITUDE =
  1495;


export default function GNCLab({
  onEvidence,
}: Props) {

  const [
    radarTrust,
    setRadarTrust,
  ] =
    useState(
      50,
    );


  const [
    inertialTrust,
    setInertialTrust,
  ] =
    useState(
      20,
    );


  const [
    modelTrust,
    setModelTrust,
  ] =
    useState(
      30,
    );


  const [
    hasRun,
    setHasRun,
  ] =
    useState(
      false,
    );


  const [
    locked,
    setLocked,
  ] =
    useState(
      false,
    );


  const estimate =
    useMemo(
      () => {

        const total =
          radarTrust +
          inertialTrust +
          modelTrust;


        if (total <= 0) {
          return 0;
        }


        return (
          (
            RADAR_ALTITUDE *
            radarTrust
          ) +
          (
            INERTIAL_ALTITUDE *
            inertialTrust
          ) +
          (
            MODEL_ALTITUDE *
            modelTrust
          )
        ) /
        total;

      },
      [
        radarTrust,
        inertialTrust,
        modelTrust,
      ],
    );


  const error =
    Math.abs(
      estimate -
      TRUE_ALTITUDE,
    );


  const quality =
    error <= 25
      ? "STRONG ESTIMATE"
      : error <= 70
        ? "WORKABLE ESTIMATE"
        : "HIGH UNCERTAINTY";


  function runEstimate() {

    setHasRun(
      true,
    );


    onEvidence(
      [
        `Navigation estimate: ${Math.round(estimate)} m.`,
        `Radar trust: ${radarTrust}.`,
        `Inertial trust: ${inertialTrust}.`,
        `Model trust: ${modelTrust}.`,
        `Estimate error after reveal: ${Math.round(error)} m.`,
      ].join(
        " ",
      ),
    );
  }


  function lockDecision() {

    setLocked(
      true,
    );


    onEvidence(
      [
        `Final navigation estimate: ${Math.round(estimate)} m.`,
        `Radar trust: ${radarTrust}%.`,
        `Inertial trust: ${inertialTrust}%.`,
        `Prediction trust: ${modelTrust}%.`,
        `Scenario truth: ${TRUE_ALTITUDE} m.`,
        `Final estimation error: ${Math.round(error)} m.`,
        `Result: ${quality}.`,
      ].join(
        " ",
      ),
    );
  }


  function resetResult() {

    setHasRun(
      false,
    );

    setLocked(
      false,
    );

    onEvidence(
      "",
    );
  }


  return (
    <section className="gnclab">

      <div className="gnclab-intro">

        <span>
          ARES-9 · DESCENT NAVIGATION
        </span>

        <h3>
          Three estimates.
          One spacecraft.
        </h3>

        <p>
          Seconds before a descent
          maneuver, the spacecraft's
          altitude sources disagree.
          Decide how much confidence
          to give each source.
        </p>

      </div>


      <aside className="gnclab-disclosure">

        <strong>
          SIMPLIFIED LEARNING MODEL
        </strong>

        <p>
          This is a fictional sensor-fusion
          exercise, not a NASA flight
          navigation algorithm or Kalman
          filter. It demonstrates the idea
          of combining multiple uncertain
          navigation inputs.
        </p>

      </aside>


      <div className="gnclab-sensors">

        <article>

          <span>
            RADAR
          </span>

          <strong>
            1,420 m
          </strong>

          <p>
            Direct altitude measurement,
            but dust and terrain can affect
            observations.
          </p>

        </article>


        <article>

          <span>
            INERTIAL
          </span>

          <strong>
            1,670 m
          </strong>

          <p>
            Motion-based estimate.
            Small accumulated errors can
            grow over time.
          </p>

        </article>


        <article>

          <span>
            TRAJECTORY MODEL
          </span>

          <strong>
            1,510 m
          </strong>

          <p>
            Where the spacecraft was
            predicted to be before the
            disagreement appeared.
          </p>

        </article>

      </div>


      <section className="gnclab-controls">

        <div className="gnclab-slider">

          <div>
            <span>
              TRUST RADAR
            </span>

            <strong>
              {radarTrust}
            </strong>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={
              radarTrust
            }
            onChange={
              event => {

                setRadarTrust(
                  Number(
                    event.target.value,
                  ),
                );

                resetResult();
              }
            }
          />

        </div>


        <div className="gnclab-slider">

          <div>
            <span>
              TRUST INERTIAL
            </span>

            <strong>
              {inertialTrust}
            </strong>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={
              inertialTrust
            }
            onChange={
              event => {

                setInertialTrust(
                  Number(
                    event.target.value,
                  ),
                );

                resetResult();
              }
            }
          />

        </div>


        <div className="gnclab-slider">

          <div>
            <span>
              TRUST MODEL
            </span>

            <strong>
              {modelTrust}
            </strong>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={
              modelTrust
            }
            onChange={
              event => {

                setModelTrust(
                  Number(
                    event.target.value,
                  ),
                );

                resetResult();
              }
            }
          />

        </div>

      </section>


      <div className="gnclab-live-estimate">

        <span>
          YOUR CURRENT ESTIMATE
        </span>

        <strong>
          {
            Math.round(
              estimate,
            )
          }{" "}
          m
        </strong>

      </div>


      {!hasRun && (

        <button
          type="button"
          className="gnclab-run"
          onClick={
            runEstimate
          }
        >
          RUN NAVIGATION ESTIMATE →
        </button>

      )}


      {hasRun && (

        <section className="gnclab-result">

          <div>

            <span>
              SCENARIO TRUTH REVEALED
            </span>

            <strong>
              {
                TRUE_ALTITUDE
              }{" "}
              m
            </strong>

          </div>


          <div>

            <span>
              YOUR ESTIMATE
            </span>

            <strong>
              {
                Math.round(
                  estimate,
                )
              }{" "}
              m
            </strong>

          </div>


          <div>

            <span>
              ERROR
            </span>

            <strong>
              {
                Math.round(
                  error,
                )
              }{" "}
              m
            </strong>

          </div>


          <div>

            <span>
              RESULT
            </span>

            <strong
              className={
                error <= 25
                  ? "good"
                  : error <= 70
                    ? "okay"
                    : "poor"
              }
            >
              {
                quality
              }
            </strong>

          </div>

        </section>

      )}


      {hasRun && !locked && (

        <div className="gnclab-after">

          <p>
            You can change the confidence
            sliders and run the estimate
            again, or keep this navigation
            decision.
          </p>

          <button
            type="button"
            onClick={
              lockDecision
            }
          >
            KEEP THIS ESTIMATE →
          </button>

        </div>

      )}


      {locked && (

        <div className="gnclab-locked">

          <span>
            NAVIGATION DECISION SAVED
          </span>

          <strong>
            {
              Math.round(
                estimate,
              )
            }{" "}
            m
          </strong>

          <p>
            Your experiment evidence is
            ready for the Compare stage.
          </p>

        </div>

      )}

    </section>
  );
}
