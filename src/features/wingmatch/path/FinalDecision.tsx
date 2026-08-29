import {
  useMemo,
  useState,
} from "react";

import {
  colleges,
} from "./collegeData";

interface FinalDecisionProps {
  major: string;
  onBack: () => void;
}

type CriterionKey =
  | "program"
  | "affordability"
  | "career"
  | "research"
  | "fit";

interface CollegeDecision {
  included: boolean;
  netCost: string;
  program: number;
  affordability: number;
  career: number;
  research: number;
  fit: number;
}

const criteria: {
  key: CriterionKey;
  label: string;
  description: string;
}[] = [
  {
    key: "program",
    label: "PROGRAM STRENGTH",
    description:
      "How well does this school support the major and technical direction you actually want?",
  },
  {
    key: "affordability",
    label: "AFFORDABILITY",
    description:
      "After scholarships and aid, how financially reasonable is this option for your family?",
  },
  {
    key: "career",
    label: "CAREER OPPORTUNITIES",
    description:
      "Internships, recruiting, co-ops, industry access, and the opportunities you can realistically pursue.",
  },
  {
    key: "research",
    label: "RESEARCH",
    description:
      "Undergraduate research access, faculty, laboratories, and technical depth that matter to you.",
  },
  {
    key: "fit",
    label: "PERSONAL FIT",
    description:
      "Campus, location, community, size, culture, distance from home, and where you can imagine thriving.",
  },
];

const defaultWeights: Record<
  CriterionKey,
  number
> = {
  program: 30,
  affordability: 25,
  career: 20,
  research: 15,
  fit: 10,
};

function makeDefaultDecision():
  Record<string, CollegeDecision> {
  return Object.fromEntries(
    colleges.map((college) => [
      college.id,
      {
        included: true,
        netCost: "",
        program: 3,
        affordability: 3,
        career: 3,
        research: 3,
        fit: 3,
      },
    ]),
  );
}

function FinalDecision({
  major,
  onBack,
}: FinalDecisionProps) {
  const [weights, setWeights] =
    useState(defaultWeights);

  const [
    collegeDecisions,
    setCollegeDecisions,
  ] = useState<
    Record<string, CollegeDecision>
  >(makeDefaultDecision);

  const updateWeight = (
    key: CriterionKey,
    value: number,
  ) => {
    setWeights((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const updateCollege = (
    collegeId: string,
    key: keyof CollegeDecision,
    value: boolean | string | number,
  ) => {
    setCollegeDecisions(
      (current) => ({
        ...current,
        [collegeId]: {
          ...current[collegeId],
          [key]: value,
        },
      }),
    );
  };

  const totalWeight =
    Object.values(weights).reduce(
      (sum, value) => sum + value,
      0,
    );

  const ranked = useMemo(() => {
    return colleges
      .filter(
        (college) =>
          collegeDecisions[
            college.id
          ]?.included,
      )
      .map((college) => {
        const decision =
          collegeDecisions[college.id];

        const weightedTotal =
          criteria.reduce(
            (sum, criterion) =>
              sum +
              decision[
                criterion.key
              ] *
                weights[
                  criterion.key
                ],
            0,
          );

        const score =
          totalWeight > 0
            ? weightedTotal /
              totalWeight
            : 0;

        return {
          college,
          decision,
          score,
        };
      })
      .sort(
        (a, b) =>
          b.score - a.score,
      );
  }, [
    collegeDecisions,
    weights,
    totalWeight,
  ]);

  return (
    <main className="decision-shell">
      <header className="path-nav">
        <button
          type="button"
          onClick={onBack}
        >
          ← Back to Flight Plan
        </button>

        <strong>
          Alt<span>Wing</span>
        </strong>
      </header>

      <section className="decision-hero">
        <span className="path-kicker">
          06 / FINAL DECISION
        </span>

        <h1>
          Don't choose the
          most famous college.
          <br />
          Choose your best fit.
        </h1>

        <p>
          When decisions arrive,
          compare your real offers for{" "}
          <strong>{major}</strong>{" "}
          using the priorities that
          matter to you. AltWing does
          the arithmetic. You make
          the judgment.
        </p>
      </section>

      <section className="decision-rule-banner">
        <div>
          <span>
            DECISION PRINCIPLE
          </span>

          <h2>
            Your priorities,
            not ours.
          </h2>
        </div>

        <p>
          AltWing does not assign
          prestige scores or declare
          one university universally
          better than another.
          You choose the criteria,
          weights, and ratings.
        </p>
      </section>

      <section className="decision-weights">
        <div className="decision-section-heading">
          <span>
            01 / SET YOUR PRIORITIES
          </span>

          <h2>
            What matters most
            to you?
          </h2>
        </div>

        <div className="decision-weight-grid">
          {criteria.map(
            (criterion) => (
              <article
                key={
                  criterion.key
                }
              >
                <div>
                  <span>
                    {
                      criterion.label
                    }
                  </span>

                  <strong>
                    {
                      weights[
                        criterion.key
                      ]
                    }
                    %
                  </strong>
                </div>

                <input
                  type="range"
                  min="0"
                  max="50"
                  step="5"
                  value={
                    weights[
                      criterion.key
                    ]
                  }
                  onChange={(
                    event,
                  ) =>
                    updateWeight(
                      criterion.key,
                      Number(
                        event
                          .target
                          .value,
                      ),
                    )
                  }
                />

                <p>
                  {
                    criterion.description
                  }
                </p>
              </article>
            ),
          )}
        </div>

        <div className="decision-weight-total">
          <span>
            TOTAL WEIGHT
          </span>

          <strong>
            {totalWeight}%
          </strong>

          <small>
            It does not have to
            equal 100. AltWing
            normalizes the calculation
            automatically.
          </small>
        </div>
      </section>

      <section className="decision-offers">
        <div className="decision-section-heading">
          <span>
            02 / COMPARE MY OFFERS
          </span>

          <h2>
            Rate the schools
            from your perspective.
          </h2>

          <p>
            1 = weak fit for you.
            5 = exceptional fit for you.
          </p>
        </div>

        <div className="decision-college-grid">
          {colleges.map(
            (college) => {
              const decision =
                collegeDecisions[
                  college.id
                ];

              return (
                <article
                  key={
                    college.id
                  }
                  className={
                    decision.included
                      ? "decision-college"
                      : "decision-college decision-college-off"
                  }
                >
                  <div className="decision-college-header">
                    <div>
                      <span>
                        {
                          college.location
                        }
                      </span>

                      <h3>
                        {
                          college.shortName
                        }
                      </h3>

                      <p>
                        {
                          college.major
                        }
                      </p>
                    </div>

                    <label className="decision-include">
                      <input
                        type="checkbox"
                        checked={
                          decision.included
                        }
                        onChange={(
                          event,
                        ) =>
                          updateCollege(
                            college.id,
                            "included",
                            event
                              .target
                              .checked,
                          )
                        }
                      />

                      Compare
                    </label>
                  </div>

                  <label className="decision-cost">
                    <span>
                      ESTIMATED ANNUAL
                      NET COST
                    </span>

                    <input
                      type="text"
                      placeholder="Example: $28,000"
                      value={
                        decision.netCost
                      }
                      onChange={(
                        event,
                      ) =>
                        updateCollege(
                          college.id,
                          "netCost",
                          event
                            .target
                            .value,
                        )
                      }
                    />
                  </label>

                  <div className="decision-ratings">
                    {criteria.map(
                      (
                        criterion,
                      ) => (
                        <label
                          key={
                            criterion.key
                          }
                        >
                          <span>
                            {
                              criterion.label
                            }
                          </span>

                          <select
                            value={
                              decision[
                                criterion
                                  .key
                              ]
                            }
                            onChange={(
                              event,
                            ) =>
                              updateCollege(
                                college.id,
                                criterion.key,
                                Number(
                                  event
                                    .target
                                    .value,
                                ),
                              )
                            }
                          >
                            <option
                              value="1"
                            >
                              1 — Weak
                            </option>

                            <option
                              value="2"
                            >
                              2
                            </option>

                            <option
                              value="3"
                            >
                              3 — Solid
                            </option>

                            <option
                              value="4"
                            >
                              4
                            </option>

                            <option
                              value="5"
                            >
                              5 — Exceptional
                            </option>
                          </select>
                        </label>
                      ),
                    )}
                  </div>
                </article>
              );
            },
          )}
        </div>
      </section>

      <section className="decision-ranking">
        <div className="decision-section-heading">
          <span>
            03 / YOUR PRIORITY MATCH
          </span>

          <h2>
            What rises to the top?
          </h2>
        </div>

        <div className="decision-ranking-list">
          {ranked.map(
            (
              result,
              index,
            ) => (
              <article
                key={
                  result.college.id
                }
              >
                <div className="decision-rank">
                  #{index + 1}
                </div>

                <div>
                  <span>
                    {
                      result.college
                        .location
                    }
                  </span>

                  <h3>
                    {
                      result.college
                        .shortName
                    }
                  </h3>

                  {result.decision
                    .netCost && (
                    <p>
                      Estimated annual
                      net cost:{" "}
                      {
                        result
                          .decision
                          .netCost
                      }
                    </p>
                  )}
                </div>

                <div className="decision-score">
                  <strong>
                    {result.score.toFixed(
                      2,
                    )}
                  </strong>

                  <span>
                    / 5 PRIORITY MATCH
                  </span>
                </div>
              </article>
            ),
          )}
        </div>
      </section>

      <section className="decision-checklist">
        <span>
          BEFORE YOU COMMIT
        </span>

        <h2>
          A spreadsheet should
          inform the decision,
          not make it.
        </h2>

        <div>
          <article>
            <strong>
              VISIT
            </strong>

            <p>
              Experience the campus
              and department when
              possible.
            </p>
          </article>

          <article>
            <strong>
              VERIFY COST
            </strong>

            <p>
              Compare actual financial
              aid offers and total cost,
              not sticker price alone.
            </p>
          </article>

          <article>
            <strong>
              TALK TO PEOPLE
            </strong>

            <p>
              Ask current students
              about courses, research,
              internships, and culture.
            </p>
          </article>

          <article>
            <strong>
              IMAGINE FOUR YEARS
            </strong>

            <p>
              Ask where you can
              realistically learn,
              contribute, and grow.
            </p>
          </article>
        </div>
      </section>

      <section className="decision-final">
        <span>
          ALTWING DECISION RULE
        </span>

        <h2>
          The best school is the
          one that best supports
          the life you want to build.
        </h2>

        <p>
          Rankings, admission rates,
          and reputation are useful
          context. They are not a
          substitute for academic fit,
          affordability, opportunity,
          and your own priorities.
        </p>
      </section>
    </main>
  );
}

export default FinalDecision;
