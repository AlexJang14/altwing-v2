import { useEffect } from "react";

import {
  WING_PROFILES,
  STYLE_NAMES,
  rankScores,

  type PrimaryWingId,
  type StyleScores,
  type ThinkingStyleId,
  type WingEvidence,
  type WingScores,
} from "../engine/wingmatchV5";

import OpportunityRadar from "../opportunities/OpportunityRadar";
import WingMascot from "./WingMascot";

import "../styles/beginner-first.css";
import "../styles/wingmatch-v5.css";


interface HistoryItem {
  sceneId: string;

  phase: string;

  title: string;

  consequence: string;

  primaryWing?:
    PrimaryWingId;
}


interface Props {
  wingScores:
    WingScores;

  styleScores:
    StyleScores;

  wingEvidence:
    WingEvidence;

  missionHistory:
    HistoryItem[];

  onRestart?:
    () => void;

  onContinue?:
    (
      wingId:
        PrimaryWingId,
    ) => void;
}


const ALL_WINGS =
  Object.keys(
    WING_PROFILES,
  ) as PrimaryWingId[];


function WingMatchResult({
  wingScores,
  styleScores,
  wingEvidence,
  missionHistory,
  onRestart,
  onContinue,
}: Props) {

  const wingLandscape =
    ALL_WINGS
      .map(
        (
          id,
        ) => ({
          id,

          profile:
            WING_PROFILES[
              id
            ],

          score:
            wingScores[
              id
            ] ??
            0,
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


  const styles =
    rankScores<
      ThinkingStyleId
    >(
      styleScores,
    );


  const primary =
    wingLandscape[0];


  const secondary =
    wingLandscape[1];


  const primaryId =
    primary?.id ??
    "mission-design";


  const primaryProfile =
    WING_PROFILES[
      primaryId
    ];

  /*
   * MY WING
   *
   * The strongest completed WingMatch
   * signal becomes the student's current
   * saved Wing.
   *
   * It is persistent, but not permanent:
   * completing WingMatch again can update it.
   */
  useEffect(() => {

    localStorage.setItem(
      "altwing-selected-wing-v1",
      primaryId,
    );

    localStorage.setItem(
      "altwing-selected-wing-saved-at-v1",
      new Date().toISOString(),
    );

    window.dispatchEvent(
      new CustomEvent(
        "altwing:my-wing-changed",
        {
          detail: {
            wingId:
              primaryId,
          },
        },
      ),
    );

  }, [primaryId]);


  const topScore =
    primary?.score ??
    1;


  const secondScore =
    secondary?.score ??
    0;


  const scoreGap =
    topScore -
    secondScore;


  const evidenceCount =
    wingEvidence[
      primaryId
    ] ??
    0;


  const overlapping =
    scoreGap <
    0.18;


  const confidence =
    overlapping
      ? "CLOSE SIGNALS"

      : evidenceCount >=
          2 &&
        scoreGap >=
          0.75
        ? "REPEATED SIGNAL"

        : evidenceCount >=
            2 ||
          scoreGap >=
            0.35
          ? "MODERATE SIGNAL"

          : "EARLY SIGNAL";


  const topStyle =
    styles[0]?.[0] ??
    "systems";


  /*
   * Opportunity Radar uses the
   * student's THREE strongest
   * Wing signals, not only #1.
   *
   * This prevents the result page
   * from artificially narrowing
   * the student's next options.
   */

  const radarWings =
    wingLandscape
      .slice(
        0,
        3,
      )
      .map(
        (
          item,
        ) =>
          item.id,
      );


  const relevantMoments =
    missionHistory
      .filter(
        (
          item,
        ) =>
          radarWings.includes(
            item.primaryWing ??
            primaryId,
          ),
      )
      .slice(
        0,
        4,
      );


  function relative(
    score: number,
  ) {
    if (
      topScore <= 0
    ) {
      return 0;
    }

    return Math.round(
      (
        score /
        topScore
      ) *
      100,
    );
  }


  function signalLabel(
    score: number,
    index: number,
  ) {
    if (
      index === 0
    ) {
      return "STRONGEST TODAY";
    }

    const ratio =
      topScore > 0
        ? score /
          topScore
        : 0;


    if (
      ratio >= .86
    ) {
      return "VERY CLOSE";
    }

    if (
      ratio >= .63
    ) {
      return "POSSIBLE";
    }

    return "LOWER SIGNAL";
  }


  return (
    <main className="v5-result v5-result--landscape">

      <section className="v5-result-hero v5-result-hero--mascot">

        <div className="v5-result-hero-copy">

          <span>
            WINGMATCH COMPLETE
          </span>

          <p>
            YOUR STRONGEST SIGNAL
            TODAY
          </p>

          <h1>
            {
              primaryProfile
                .name
            }
          </h1>

          <strong>
            {
              primaryProfile
                .simple
            }
          </strong>


          <div className="v5-result-confidence">

            <span>
              {confidence}
            </span>

            <small>
              This is not a verdict.
              It is the strongest
              pattern from this
              mission session.
            </small>

          </div>

        </div>


        <div className="v5-result-hero-mascot">

          <WingMascot
            wingId={
              primaryId
            }
            size="hero"
          />

          <span>
            {
              primaryProfile
                .shortName
            }
            {" "}FLIGHT CREW
          </span>

        </div>

      </section>


      <section className="v5-result-section v5-wing-landscape">

        <span>
          WHAT YOU COULD HAVE
          GOTTEN
        </span>

        <h2>
          Your full Wing landscape.
        </h2>

        <p>
          AltWing does not assume
          one quiz result defines
          you. These are all six
          aerospace signals from
          the same mission.
        </p>


        <div className="v5-wing-landscape-grid">

          {wingLandscape.map(
            (
              item,
              index,
            ) => {

              const width =
                relative(
                  item.score,
                );

              return (
                <article
                  key={
                    item.id
                  }
                  className={
                    index === 0
                      ? "primary"
                      : ""
                  }
                >

                  <WingMascot
                    wingId={
                      item.id
                    }
                    size="card"
                  />


                  <div className="v5-wing-landscape-copy">

                    <small>
                      {
                        signalLabel(
                          item.score,
                          index,
                        )
                      }
                    </small>

                    <strong>
                      {
                        item.profile
                          .name
                      }
                    </strong>

                    <p>
                      {
                        item.profile
                          .simple
                      }
                    </p>


                    <div className="v5-wing-signal-track">

                      <i
                        style={{
                          width:
                            `${width}%`,
                        }}
                      />

                    </div>


                    {onContinue && (
                      <button
                        type="button"
                        onClick={() => {
                          localStorage.setItem(
                            "altwing-selected-wing-v1",
                            item.id,
                          );

                          onContinue(
                            item.id,
                          );
                        }}
                      >
                        TRY THIS WING →
                      </button>
                    )}

                  </div>

                </article>
              );
            },
          )}

        </div>


        <p className="v5-relative-note">
          Bars show relative signal
          strength within this
          session. They are not
          probabilities, aptitude
          percentages, or claims
          about what career you
          should choose.
        </p>

      </section>


      <section className="v5-result-section">

        <span>
          HOW YOU APPROACHED
          THE MISSION
        </span>

        <h2>
          {
            STYLE_NAMES[
              topStyle
            ]
          }
        </h2>

        <p>
          Thinking Style is
          separate from Wing.
          Someone can approach GNC,
          Structures, Propulsion,
          or any other field with
          the same thinking style.
        </p>


        <div className="v5-style-grid">

          {styles
            .slice(
              0,
              3,
            )
            .map(
              (
                [
                  id,
                  score,
                ],
                index,
              ) => (
                <article
                  key={id}
                >

                  <small>
                    SIGNAL{" "}
                    {index + 1}
                  </small>

                  <strong>
                    {
                      STYLE_NAMES[
                        id
                      ]
                    }
                  </strong>

                  <span>
                    Relative
                    behavioral
                    signal{" "}
                    {
                      score
                        .toFixed(
                          1,
                        )
                    }
                  </span>

                </article>
              ),
            )}

        </div>

      </section>


      <section className="v5-result-section">

        <span>
          WHAT SHAPED THE RESULT
        </span>

        <h2>
          Decisions that created
          your strongest signals.
        </h2>


        <div className="v5-result-moments">

          {relevantMoments.length >
          0
            ? relevantMoments.map(
                (
                  item,
                  index,
                ) => (
                  <article
                    key={
                      `${item.sceneId}-${index}`
                    }
                  >

                    <small>
                      {
                        item.phase
                      }
                    </small>

                    <strong>
                      {
                        item.title
                      }
                    </strong>

                    <p>
                      {
                        item.consequence
                      }
                    </p>

                  </article>
                ),
              )

            : missionHistory
                .slice(
                  0,
                  3,
                )
                .map(
                  (
                    item,
                    index,
                  ) => (
                    <article
                      key={
                        `${item.sceneId}-${index}`
                      }
                    >

                      <small>
                        {
                          item.phase
                        }
                      </small>

                      <strong>
                        {
                          item.title
                        }
                      </strong>

                      <p>
                        {
                          item.consequence
                        }
                      </p>

                    </article>
                  ),
                )}

        </div>

      </section>


      <section className="v5-method-note">

        <span>
          HOW TO READ THIS
        </span>

        <h2>
          Exploration signal —
          not an aptitude score.
        </h2>

        <p>
          AltWing uses
          situational choices,
          randomized option order,
          and mini behavior tasks
          to reduce simple
          self-report and obvious-
          answer bias. It is still
          an exploratory assessment,
          not a scientifically
          validated aptitude test.
        </p>

      </section>


      <OpportunityRadar
        wingIds={
          radarWings
        }
      />


      <section className="v5-try">

        <span>
          NEXT MOVE
        </span>

        <h2>
          Test a Wing instead of
          accepting a label.
        </h2>

        <p>
          Try one of your three
          strongest signals — or
          choose any Wing from the
          landscape above.
        </p>


        <div className="v5-try-grid">

          {wingLandscape
            .slice(
              0,
              3,
            )
            .map(
              (
                item,
              ) => (
                <article
                  key={
                    item.id
                  }
                >

                  <small>
                    {
                      item.profile
                        .shortName
                    }
                    {" "}STARTER
                  </small>

                  <strong>
                    {
                      item.profile
                        .challenge
                    }
                  </strong>

                  {onContinue && (
                    <button
                      type="button"
                      onClick={() => {
                          localStorage.setItem(
                            "altwing-selected-wing-v1",
                            item.id,
                          );

                          onContinue(
                            item.id,
                          );
                        }}
                    >
                      TRY{" "}
                      {
                        item.profile
                          .shortName
                      }
                      {" "}→
                    </button>
                  )}

                </article>
              ),
            )}

        </div>

      </section>


      <footer className="v5-result-actions">

        {onRestart && (
          <button
            type="button"
            onClick={
              onRestart
            }
          >
            Replay with a new
            option order
          </button>
        )}

      </footer>

    </main>
  );
}


export default WingMatchResult;
