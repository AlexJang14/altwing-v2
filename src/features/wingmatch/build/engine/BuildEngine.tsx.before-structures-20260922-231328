import {
  useMemo,
  useState,
} from "react";

import {
  getWingBuild,
  type WingId,
} from "../catalog/buildCatalog";

import PropulsionLab
  from "../labs/PropulsionLab";

import GNCLab
  from "../labs/GNCLab";

import {
  awardCosmicPack,
  openCosmicPack,
  type CosmicPack,
  type CosmicPackOpenResult,
} from "../../../progression/cosmic-packs";

import {
  PackReveal,
} from "../../../progression/CosmicPackVault";

import "./build-engine.css";


interface Props {
  wingId: WingId;
  onBack: () => void;
}


const STAGES = [
  "MISSION",
  "PREDICT",
  "EXPERIMENT",
  "COMPARE",
  "REVISE",
  "DEFEND",
  "PROOF",
] as const;


type Stage =
  typeof STAGES[number];


export default function BuildEngine({
  wingId,
  onBack,
}: Props) {

  const build =
    useMemo(
      () =>
        getWingBuild(
          wingId,
        ),
      [
        wingId,
      ],
    );


  const buildStorageId =
    `${build.wingId}-${build.buildTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")}`;


  const [
    stageIndex,
    setStageIndex,
  ] =
    useState(0);


  const [
    prediction,
    setPrediction,
  ] =
    useState("");


  const [
    experiment,
    setExperiment,
  ] =
    useState("");


  const [
    comparison,
    setComparison,
  ] =
    useState("");


  const [
    revision,
    setRevision,
  ] =
    useState("");


  const [
    defense,
    setDefense,
  ] =
    useState("");


  const [
    saved,
    setSaved,
  ] =
    useState(false);


  const [
    earnedPack,
    setEarnedPack,
  ] =
    useState<
      CosmicPack | null
    >(
      null
    );


  const [
    packOpenResult,
    setPackOpenResult,
  ] =
    useState<
      CosmicPackOpenResult | null
    >(
      null
    );


  const stage:
    Stage =
      STAGES[
        stageIndex
      ];


  const progress =
    (
      (
        stageIndex + 1
      ) /
      STAGES.length
    ) *
    100;


  const predictionDone =
    prediction.trim()
      .length >= 15;


  const experimentDone =
    experiment.trim()
      .length >= 10;


  const comparisonDone =
    comparison.trim()
      .length >= 15;


  const revisionDone =
    revision.trim()
      .length >= 15;


  const defenseDone =
    defense.trim()
      .length >= 15;


  const finalDecisionDone =
    wingId === "propulsion"
      ? experiment.includes(
          "Final test selection:"
        )
      : wingId === "gnc"
        ? experiment.includes(
            "Final navigation estimate:"
          )
        : experimentDone;


  const evidenceItems = [
    {
      label:
        "Prediction recorded",
      done:
        predictionDone,
    },

    {
      label:
        "Experiment completed",
      done:
        experimentDone,
    },

    {
      label:
        "Evidence compared",
      done:
        comparisonDone,
    },

    {
      label:
        "Design revised",
      done:
        revisionDone,
    },

    {
      label:
        "Final decision made",
      done:
        finalDecisionDone,
    },

    {
      label:
        "Engineering defense written",
      done:
        defenseDone,
    },
  ];


  const evidenceComplete =
    evidenceItems.every(
      item =>
        item.done,
    );


  function next() {

    setStageIndex(
      current =>
        Math.min(
          current + 1,
          STAGES.length - 1,
        ),
    );


    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }


  function previous() {

    setStageIndex(
      current =>
        Math.max(
          current - 1,
          0,
        ),
    );


    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }


  function openEarnedPack() {

    if (!earnedPack) {
      return;
    }


    const result =
      openCosmicPack(
        earnedPack.id
      );


    setEarnedPack(
      null
    );


    if (result) {

      setPackOpenResult(
        result
      );
    }
  }


  function saveProof() {

    const record = {
      buildId:
        buildStorageId,

      wingId:
        build.wingId,

      wingName:
        build.wingName,

      buildTitle:
        build.buildTitle,

      prediction,

      experiment,

      comparison,

      revision,

      defense,

      completedAt:
        new Date()
          .toISOString(),

      sources:
        build.sources,
    };


    localStorage.setItem(
      `altwing-build-proof-${buildStorageId}`,
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


    const packAward =
      awardCosmicPack(
        `proof:${buildStorageId}`,
        "EVIDENCE",
        `${build.wingName} · ${build.buildTitle} Proof of Flight`,
      );


    setSaved(
      true,
    );


    /*
     * If this Proof already earned and opened
     * its Pack previously, don't award another.
     *
     * If the Pack exists but is still unopened,
     * remind the student about it.
     */
    if (
      !packAward.pack.openedAt
    ) {

      setEarnedPack(
        packAward.pack
      );
    }
  }


  if (
    packOpenResult
  ) {

    return (
      <PackReveal
        result={
          packOpenResult
        }
        onClose={() =>
          setPackOpenResult(
            null
          )
        }
      />
    );
  }


  if (
    earnedPack
  ) {

    return (
      <main className="be-shell">

        <section className="be-pack-earned">

          <span className="be-pack-kicker">
            PROOF OF FLIGHT COMPLETE
          </span>


          <div className="be-pack-mascot">

            <img
              src="/brand/altwing-penguin.png"
              alt=""
            />

          </div>


          <span className="be-pack-signal">
            REWARD SIGNAL RECEIVED
          </span>


          <h1>
            Engineering Pack
            <br />
            earned.
          </h1>


          <p>
            You earned this by completing
            <strong>
              {" "}
              {build.buildTitle}
            </strong>
            {" "}
            and saving your engineering
            evidence.
          </p>


          <div className="be-pack-object">

            <div className="be-pack-object-top">

              <span>
                ALTWING
              </span>

              <b>
                ENGINEERING
              </b>

            </div>


            <div className="be-pack-emblem">
              ✦
            </div>


            <strong>
              DEEP SPACE
              <br />
              PACK
            </strong>


            <small>
              3 COSMIC SIGNALS
            </small>

          </div>


          <div className="be-pack-actions">

            <button
              type="button"
              className="be-pack-open"
              onClick={
                openEarnedPack
              }
            >
              OPEN NOW →
            </button>


            <button
              type="button"
              className="be-pack-later"
              onClick={() =>
                setEarnedPack(
                  null
                )
              }
            >
              SAVE FOR LATER
            </button>

          </div>


          <small className="be-pack-note">
            One Pack per completed Build.
            Replaying the same Build will
            not create another reward.
          </small>

        </section>

      </main>
    );
  }


  if (saved) {

    return (
      <main className="be-shell">

        <header className="be-topbar">

          <span>
            AltWing
          </span>

          <strong>
            PROOF OF FLIGHT
          </strong>

        </header>


        <section className="be-proof">

          <span className="be-kicker">
            BUILD COMPLETE
          </span>


          <h1>
            You did more than
            read about{" "}
            {build.wingName}.
          </h1>


          <p>
            You made a prediction,
            tested an idea,
            compared evidence,
            revised your thinking,
            and defended a final
            engineering decision.
          </p>


          <div className="be-proof-grid">

            <article>
              <span>
                WING
              </span>

              <strong>
                {
                  build.wingName
                }
              </strong>
            </article>


            <article>
              <span>
                BUILD
              </span>

              <strong>
                {
                  build.buildTitle
                }
              </strong>
            </article>


            <article>
              <span>
                SOURCES
              </span>

              <strong>
                {
                  build.sources.length
                }{" "}
                primary
              </strong>
            </article>

          </div>


          <section className="be-proof-note">

            <span>
              YOUR FINAL DECISION
            </span>

            <p>
              {
                defense ||
                "No final defense recorded."
              }
            </p>

          </section>


          <button
            type="button"
            className="be-primary"
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
    <main className="be-shell">

      <header className="be-topbar">

        <button
          type="button"
          onClick={
            onBack
          }
        >
          ← EXIT BUILD
        </button>


        <span>
          AltWing
        </span>


        <strong>
          {
            build.wingName
          }
        </strong>

      </header>


      <div className="be-progress">

        <span
          style={{
            width:
              `${progress}%`,
          }}
        />

      </div>


      <section className="be-content">

        <div className="be-stage-heading">

          <div>

            <span className="be-kicker">
              {
                stage
              }
              {" · "}
              {stageIndex + 1}
              {" / "}
              {STAGES.length}
            </span>


            <h1>
              {
                build.buildTitle
              }
            </h1>

          </div>


          <div className="be-wing-tag">
            {
              build.wingName
            }
          </div>

        </div>


        {stage === "MISSION" && (

          <section className="be-panel">

            <span className="be-label">
              YOUR MISSION
            </span>


            <h2>
              {
                build.mission
              }
            </h2>


            <p className="be-big-question">
              {
                build.beginnerQuestion
              }
            </p>


            <div className="be-concepts">

              {build.concepts.map(
                concept => (
                  <span
                    key={
                      concept
                    }
                  >
                    {
                      concept
                    }
                  </span>
                ),
              )}

            </div>


            <aside className="be-disclosure">

              <strong>
                SIMPLIFIED LEARNING MODEL
              </strong>

              <p>
                {
                  build.modelDisclosure
                }
              </p>

            </aside>

          </section>
        )}


        {stage === "PREDICT" && (

          <section className="be-panel">

            <span className="be-label">
              BEFORE YOU TEST
            </span>


            <h2>
              Make a prediction.
            </h2>


            <p>
              Engineers do not wait
              until after a result to
              decide what they expected.
              Write what you think will
              happen and why.
            </p>


            <textarea
              value={
                prediction
              }
              onChange={
                event =>
                  setPrediction(
                    event.target.value,
                  )
              }
              placeholder="I predict that..."
            />

          </section>
        )}


        {stage === "EXPERIMENT" && (

          <section className="be-panel">

            <span className="be-label">
              BUILD LAB
            </span>


            <h2>
              Change something.
              Observe what happens.
            </h2>


            <p>
              This shared Build Engine
              records the experiment
              process. Each Wing will
              plug its own NASA-grounded
              interactive simulation
              into this stage.
            </p>


            {wingId ===
            "propulsion" ? (

              <PropulsionLab
                onEvidence={
                  setExperiment
                }
              />

            ) : wingId ===
              "gnc" ? (

              <GNCLab
                onEvidence={
                  setExperiment
                }
              />

            ) : (

              <>

                <div className="be-action-list">

                  {build.actions.map(
                    (
                      action,
                      index,
                    ) => (

                      <div
                        key={
                          action
                        }
                      >
                        <span>
                          {String(
                            index + 1,
                          ).padStart(
                            2,
                            "0",
                          )}
                        </span>

                        <strong>
                          {
                            action
                          }
                        </strong>
                      </div>

                    ),
                  )}

                </div>


                <textarea
                  value={
                    experiment
                  }
                  onChange={
                    event =>
                      setExperiment(
                        event.target.value,
                      )
                  }
                  placeholder="What did you change or test?"
                />

              </>

            )}

          </section>
        )}


        {stage === "COMPARE" && (

          <section className="be-panel">

            <span className="be-label">
              COMPARE
            </span>


            <h2>
              What changed?
            </h2>


            <p>
              Compare your prediction
              with the evidence. Look
              for tradeoffs rather than
              searching for a perfect
              answer.
            </p>


            <textarea
              value={
                comparison
              }
              onChange={
                event =>
                  setComparison(
                    event.target.value,
                  )
              }
              placeholder="My prediction was... but the result showed..."
            />

          </section>
        )}


        {stage === "REVISE" && (

          <section className="be-panel">

            <span className="be-label">
              ITERATE
            </span>


            <h2>
              Change the design.
            </h2>


            <p>
              Engineering usually gets
              better after the first
              attempt. What would you
              change now?
            </p>


            <textarea
              value={
                revision
              }
              onChange={
                event =>
                  setRevision(
                    event.target.value,
                  )
              }
              placeholder="For my second design, I would..."
            />

          </section>
        )}


        {stage === "DEFEND" && (

          <section className="be-panel">

            <span className="be-label">
              FINAL DECISION
            </span>


            <h2>
              Defend the tradeoff.
            </h2>


            <p>
              There may be several
              reasonable solutions.
              Explain why your final
              choice fits this mission.
            </p>


            <textarea
              value={
                defense
              }
              onChange={
                event =>
                  setDefense(
                    event.target.value,
                  )
              }
              placeholder="I chose this design because..."
            />

          </section>
        )}


        {stage === "PROOF" && (

          <section className="be-panel">

            <span className="be-label">
              PROOF OF FLIGHT
            </span>


            <h2>
              Keep evidence,
              not just completion.
            </h2>


            <p>
              Your Build record can
              preserve the thinking
              behind the final design.
            </p>


            <div className="be-proof-list">

              {evidenceItems.map(
                item => (

                  <div
                    key={
                      item.label
                    }
                    className={
                      item.done
                        ? "is-complete"
                        : "is-missing"
                    }
                  >
                    <span>
                      {
                        item.done
                          ? "✓"
                          : "○"
                      }
                    </span>

                    {
                      item.label
                    }
                  </div>

                ),
              )}

            </div>


            {!evidenceComplete && (

              <div className="be-proof-warning">

                Complete the unfinished
                evidence above before
                saving Proof of Flight.

              </div>

            )}


            <section className="be-sources">

              <div className="be-source-head">

                <span>
                  ENGINEERING BASIS
                </span>

                <strong>
                  {
                    build.sources.length
                  }{" "}
                  PRIMARY SOURCE
                  {build.sources.length !== 1
                    ? "S"
                    : ""}
                </strong>

              </div>


              {build.sources.map(
                source => (

                  <a
                    key={
                      source.url
                    }
                    href={
                      source.url
                    }
                    target="_blank"
                    rel="noreferrer"
                  >

                    <div>

                      <span>
                        {
                          source.organization
                        }
                      </span>

                      <strong>
                        {
                          source.title
                        }
                      </strong>

                      <p>
                        {
                          source.purpose
                        }
                      </p>

                    </div>

                    <b>
                      ↗
                    </b>

                  </a>

                ),
              )}

            </section>

          </section>
        )}


        <footer className="be-navigation">

          <button
            type="button"
            className="be-secondary"
            disabled={
              stageIndex === 0
            }
            onClick={
              previous
            }
          >
            ← PREVIOUS
          </button>


          {stageIndex <
          STAGES.length - 1 ? (

            <button
              type="button"
              className="be-primary"
              onClick={
                next
              }
            >
              CONTINUE →
            </button>

          ) : (

            <button
              type="button"
              className="be-primary"
              disabled={
                !evidenceComplete
              }
              onClick={
                saveProof
              }
            >
              SAVE PROOF OF FLIGHT →
            </button>

          )}

        </footer>

      </section>

    </main>
  );
}
