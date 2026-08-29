import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  colleges,
  type CollegeProfile,
} from "./collegeData";

interface ReadinessPlanProps {
  major: string;
  onBack: () => void;
}

type StrengthLevel =
  | "Exploring"
  | "Developing"
  | "Strong"
  | "Advanced";

interface StudentProfile {
  gpa: string;
  sat: string;
  satMath: string;
  rigor: StrengthLevel;
  engineering: StrengthLevel;
  leadership: StrengthLevel;
}

const STORAGE_KEY =
  "altwing-readiness-profile";

const COLLEGE_LIST_STORAGE_KEY =
  "altwing-my-college-list";

const defaultProfile:
  StudentProfile = {
  gpa: "",
  sat: "",
  satMath: "",
  rigor: "Developing",
  engineering: "Developing",
  leadership: "Developing",
};

function formatScore(
  score: number | null,
) {
  return score === null
    ? "—"
    : String(score);
}

function caltechBucket(
  score: number,
) {
  if (score >= 780) {
    return "BUCKET A";
  }

  if (score >= 750) {
    return "BUCKET B";
  }

  return "BUCKET C";
}

function getSatSignal(
  profile: StudentProfile,
  college: CollegeProfile,
) {
  const score =
    Number(profile.sat) || 0;

  const math =
    Number(profile.satMath) || 0;

  if (
    college.testingPolicy ===
    "NOT_USED"
  ) {
    return {
      label:
        "SAT / ACT NOT USED",

      detail:
        `${college.shortName} does not use SAT or ACT scores in admission selection. Focus this comparison on GPA, coursework, major preparation, projects, and fit.`,
    };
  }

  if (
    college.testingPolicy ===
      "SPECIAL" &&
    college.id === "caltech"
  ) {
    if (!math) {
      return {
        label:
          "ADD SAT MATH OR ACT SECTION DATA",

        detail:
          "Caltech evaluates individual test sections using buckets. Enter SAT Math to preview the Math bucket; Reading & Writing must also be considered separately.",
      };
    }

    return {
      label:
        `SAT MATH: ${caltechBucket(
          math,
        )}`,

      detail:
        math >= 780
          ? "Your SAT Math falls in Caltech Bucket A (780–800). The exact score is hidden from the admissions committee within this bucket."
          : math >= 750
            ? "Your SAT Math falls in Caltech Bucket B (750–770). The exact score is hidden from the admissions committee within this bucket."
            : "Your SAT Math falls in Bucket C. Caltech shows the individual score to the admissions committee and recommends clear additional evidence of STEM readiness.",
    };
  }

  if (!score) {
    if (
      college.testingPolicy ===
      "OPTIONAL"
    ) {
      return {
        label:
          "TEST OPTIONAL",

        detail:
          `${college.shortName} does not require an SAT or ACT for this cycle. Add a score only if you want to compare submitted-score context.`,
      };
    }

    if (
      college.testingPolicy ===
      "REQUIRED"
    ) {
      return {
        label:
          "TEST REQUIRED",

        detail:
          `${college.shortName} currently requires standardized testing. Add your score to the profile.`,
      };
    }

    return {
      label:
        "ADD A SCORE IF RELEVANT",

      detail:
        "Enter an SAT score to compare it with available institutional context. Verify the school's testing policy for your exact application cycle.",
    };
  }

  const low =
    college.sat25;

  const middle =
    college.sat50;

  const high =
    college.sat75;

  if (
    low === null ||
    high === null
  ) {
    return {
      label:
        "SCORE RECORDED",

      detail:
        `${college.shortName} does not currently have a verified percentile band loaded in AltWing. Your score is saved, but no fake comparison is generated.`,
    };
  }

  if (score < low) {
    return {
      label:
        "BELOW REPORTED RANGE",

      detail:
        `Your ${score} is below the lower bound currently shown for ${college.shortName} (${low}).`,
    };
  }

  if (
    middle !== null &&
    score < middle
  ) {
    return {
      label:
        "WITHIN REPORTED RANGE",

      detail:
        `Your ${score} falls between the reported 25th percentile (${low}) and median (${middle}).`,
    };
  }

  if (
    middle !== null &&
    score <= high
  ) {
    return {
      label:
        "AT / ABOVE MEDIAN",

      detail:
        `Your ${score} is between the reported median (${middle}) and 75th percentile (${high}).`,
    };
  }

  if (
    middle === null &&
    score <= high
  ) {
    return {
      label:
        "WITHIN REPORTED MIDDLE 50%",

      detail:
        `Your ${score} is within the published middle-50% range of ${low}–${high}.`,
    };
  }

  return {
    label:
      "ABOVE REPORTED UPPER RANGE",

    detail:
      `Your ${score} is above the upper bound currently shown (${high}). Do not assume this creates a high admission probability.`,
  };
}

function nextMoves(
  profile: StudentProfile,
  college: CollegeProfile,
) {
  const moves: string[] = [];

  const sat =
    Number(profile.sat) || 0;

  const satMath =
    Number(profile.satMath) || 0;

  if (college.id === "caltech") {
    if (
      !satMath ||
      satMath < 750
    ) {
      moves.push(
        "Review Caltech's section-level testing buckets and strengthen clear evidence of quantitative readiness rather than chasing a composite score.",
      );
    }

    moves.push(
      "Make sure your high-school preparation demonstrates mastery in calculus, chemistry, and physics, because Caltech explicitly expects those foundations.",
    );
  } else if (
    college.id === "utaustin"
  ) {
    if (
      !satMath ||
      satMath < 620
    ) {
      moves.push(
        "Confirm Cockrell calculus readiness. SAT Math 620+ is one official route, but AP/IB calculus or qualifying calculus coursework can also satisfy the requirement.",
      );
    }

    if (!sat) {
      moves.push(
        "Plan for an official SAT or ACT because UT Austin currently requires one for first-year admission.",
      );
    }
  } else if (
    college.testingPolicy ===
    "NOT_USED"
  ) {
    moves.push(
      "Do not spend application strategy time optimizing SAT for this school; strengthen grades, course rigor, major preparation, and meaningful engineering work instead.",
    );
  } else if (
    college.testingPolicy ===
      "REQUIRED" ||
    college.testingPolicy ===
      "CHECK_CURRENT"
  ) {
    if (!sat) {
      moves.push(
        "Establish a current testing baseline and verify whether this school requires scores for your exact application cycle.",
      );
    } else if (
      college.sat50 !== null &&
      sat < college.sat50
    ) {
      moves.push(
        `If testing remains important for your cycle, work toward the institution's reported median context of ${college.sat50} without letting test prep crowd out stronger academic or engineering work.`,
      );
    }
  }

  if (
    college.id === "calpoly"
  ) {
    moves.push(
      "Protect your 9th–11th grade academic record and relevant math/science preparation because Cal Poly evaluates applicants by intended major and does not use SAT/ACT in selection.",
    );
  }

  if (
    profile.rigor ===
      "Exploring" ||
    profile.rigor ===
      "Developing"
  ) {
    moves.push(
      "Strengthen relevant course rigor in math, physics, computing, or engineering where your school makes those courses available.",
    );
  }

  if (
    profile.engineering ===
      "Exploring" ||
    profile.engineering ===
      "Developing"
  ) {
    moves.push(
      `Turn technical interest into one tested, documented engineering project with visible evidence instead of adding another shallow activity.`,
    );
  }

  if (
    profile.leadership ===
      "Exploring" ||
    profile.leadership ===
      "Developing"
  ) {
    moves.push(
      "Deepen one existing activity into measurable leadership: own an outcome, lead a team, create an opportunity, or mentor others.",
    );
  }

  if (moves.length < 3) {
    moves.push(
      "Keep building depth rather than adding unrelated activities simply to make the résumé longer.",
    );
  }

  return moves.slice(0, 3);
}

function ReadinessPlan({
  major,
  onBack,
}: ReadinessPlanProps) {
  const [profile, setProfile] =
    useState<StudentProfile>(() => {
      try {
        const saved =
          localStorage.getItem(
            STORAGE_KEY,
          );

        return saved
          ? {
              ...defaultProfile,
              ...JSON.parse(saved),
            }
          : defaultProfile;
      } catch {
        return defaultProfile;
      }
    });

  const [
    savedCollegeIds,
  ] = useState<string[]>(() => {
    try {
      const saved =
        localStorage.getItem(
          COLLEGE_LIST_STORAGE_KEY,
        );

      return saved
        ? JSON.parse(saved)
        : [];
    } catch {
      return [];
    }
  });

  const shortlistColleges =
    useMemo(
      () =>
        colleges.filter(
          (college) =>
            savedCollegeIds.includes(
              college.id,
            ),
        ),
      [savedCollegeIds],
    );

  const targetColleges =
    shortlistColleges.length > 0
      ? shortlistColleges
      : colleges;

  const [
    selectedCollegeId,
    setSelectedCollegeId,
  ] = useState(
    () =>
      targetColleges[0]?.id ??
      colleges[0].id,
  );

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(profile),
    );
  }, [profile]);

  const college =
    targetColleges.find(
      (item) =>
        item.id ===
        selectedCollegeId,
    ) ??
    targetColleges[0] ??
    colleges[0];

  const satSignal = useMemo(
    () =>
      getSatSignal(
        profile,
        college,
      ),
    [profile, college],
  );

  const moves = useMemo(
    () =>
      nextMoves(
        profile,
        college,
      ),
    [profile, college],
  );

  const updateField = (
    key: keyof StudentProfile,
    value: string,
  ) => {
    setProfile((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const showStandardScores =
    college.testingPolicy !==
      "NOT_USED" &&
    college.testingPolicy !==
      "SPECIAL";

  return (
    <main className="readiness-shell">
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

      <section className="readiness-hero">
        <span className="path-kicker">
          05 / READINESS
        </span>

        <h1>
          See the gap.
          <br />
          Decide what matters next.
        </h1>

        <p>
          Compare your preparation for{" "}
          <strong>{major}</strong>{" "}
          with the actual admissions
          context of each school.
          AltWing changes its logic
          when the school's rules
          change.
        </p>
      </section>

      <section className="readiness-shortlist">
        <div className="readiness-shortlist-heading">
          <div>
            <span>
              MY COLLEGE LIST
            </span>

            <h2>
              What should I work on
              for each school?
            </h2>

            <p>
              Readiness is not an
              admission probability.
              It turns your shortlist
              into school-specific
              next actions.
            </p>
          </div>

          <strong>
            {shortlistColleges.length}
            {" "}
            {shortlistColleges.length === 1
              ? "school saved"
              : "schools saved"}
          </strong>
        </div>

        {shortlistColleges.length === 0 ? (
          <div className="readiness-shortlist-empty">
            <span>
              NO SHORTLIST YET
            </span>

            <h3>
              Save colleges first.
            </h3>

            <p>
              Go to College Match and
              add schools to My College
              List. Until then, you can
              still explore readiness
              using all colleges.
            </p>
          </div>
        ) : (
          <div className="readiness-shortlist-grid">
            {shortlistColleges.map(
              (item) => {
                const signal =
                  getSatSignal(
                    profile,
                    item,
                  );

                const firstMove =
                  nextMoves(
                    profile,
                    item,
                  )[0];

                const active =
                  item.id ===
                  college.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={
                      active
                        ? "readiness-shortlist-card readiness-shortlist-card-active"
                        : "readiness-shortlist-card"
                    }
                    onClick={() =>
                      setSelectedCollegeId(
                        item.id,
                      )
                    }
                  >
                    <div className="readiness-shortlist-card-top">
                      <div>
                        <span>
                          {
                            item.aerospaceFit
                          }
                        </span>

                        <h3>
                          {
                            item.shortName
                          }
                        </h3>
                      </div>

                      {active && (
                        <strong>
                          ANALYZING ✓
                        </strong>
                      )}
                    </div>

                    <div className="readiness-shortlist-signal">
                      <span>
                        TESTING CONTEXT
                      </span>

                      <strong>
                        {
                          signal.label
                        }
                      </strong>
                    </div>

                    <div className="readiness-shortlist-next">
                      <span>
                        NEXT MOVE
                      </span>

                      <p>
                        {firstMove}
                      </p>
                    </div>

                    <small>
                      Open full readiness →
                    </small>
                  </button>
                );
              },
            )}
          </div>
        )}
      </section>

      <section className="readiness-layout">
        <div className="readiness-input-panel">
          <span>
            MY PROFILE
          </span>

          <h2>
            Where are you now?
          </h2>

          <div className="readiness-form">
            <label>
              <span>GPA</span>

              <input
                type="number"
                min="0"
                max="5"
                step="0.01"
                placeholder="Example: 3.85"
                value={profile.gpa}
                onChange={(event) =>
                  updateField(
                    "gpa",
                    event.target.value,
                  )
                }
              />
            </label>

            <label>
              <span>
                SAT TOTAL
              </span>

              <input
                type="number"
                min="400"
                max="1600"
                placeholder="Example: 1450"
                value={profile.sat}
                onChange={(event) =>
                  updateField(
                    "sat",
                    event.target.value,
                  )
                }
              />
            </label>

            <label>
              <span>
                SAT MATH
              </span>

              <input
                type="number"
                min="200"
                max="800"
                placeholder="Example: 760"
                value={
                  profile.satMath
                }
                onChange={(event) =>
                  updateField(
                    "satMath",
                    event.target.value,
                  )
                }
              />
            </label>

            <label>
              <span>
                COURSE RIGOR
              </span>

              <select
                value={profile.rigor}
                onChange={(event) =>
                  updateField(
                    "rigor",
                    event.target.value,
                  )
                }
              >
                <option>
                  Exploring
                </option>
                <option>
                  Developing
                </option>
                <option>
                  Strong
                </option>
                <option>
                  Advanced
                </option>
              </select>
            </label>

            <label>
              <span>
                ENGINEERING EVIDENCE
              </span>

              <select
                value={
                  profile.engineering
                }
                onChange={(event) =>
                  updateField(
                    "engineering",
                    event.target.value,
                  )
                }
              >
                <option>
                  Exploring
                </option>
                <option>
                  Developing
                </option>
                <option>
                  Strong
                </option>
                <option>
                  Advanced
                </option>
              </select>
            </label>

            <label>
              <span>
                LEADERSHIP
              </span>

              <select
                value={
                  profile.leadership
                }
                onChange={(event) =>
                  updateField(
                    "leadership",
                    event.target.value,
                  )
                }
              >
                <option>
                  Exploring
                </option>
                <option>
                  Developing
                </option>
                <option>
                  Strong
                </option>
                <option>
                  Advanced
                </option>
              </select>
            </label>
          </div>
        </div>

        <div className="readiness-target-panel">
          <span>
            TARGET SCHOOL
          </span>

          {shortlistColleges.length > 0 && (
            <small className="readiness-shortlist-source">
              Showing schools from
              My College List
            </small>
          )}

          <select
            value={
              selectedCollegeId
            }
            onChange={(event) =>
              setSelectedCollegeId(
                event.target.value,
              )
            }
          >
            {targetColleges.map(
              (item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.shortName}
                </option>
              ),
            )}
          </select>

          <h2>
            {college.shortName}
          </h2>

          <p>
            {college.major}
          </p>

          <div className="readiness-target-policy">
            <span>
              TESTING
            </span>

            <strong>
              {
                college.testingPolicy
              }
            </strong>

            <p>
              {
                college
                  .testingPolicyNote
              }
            </p>
          </div>
        </div>
      </section>

      <section className="readiness-snapshot">
        <div className="readiness-section-heading">
          <span>
            READINESS SNAPSHOT
          </span>

          <h2>
            Compare context,
            not acceptance odds.
          </h2>
        </div>

        {showStandardScores ? (
          <>
            <article className="readiness-score-card">
              <div>
                <span>
                  SAT
                </span>

                <strong>
                  {
                    profile.sat ||
                    "—"
                  }
                </strong>

                <small>
                  YOU
                </small>
              </div>

              <div>
                <span>
                  25TH
                </span>

                <strong>
                  {formatScore(
                    college.sat25,
                  )}
                </strong>

                <small>
                  PUBLISHED
                </small>
              </div>

              <div>
                <span>
                  MEDIAN
                </span>

                <strong>
                  {formatScore(
                    college.sat50,
                  )}
                </strong>

                <small>
                  PUBLISHED
                </small>
              </div>

              <div>
                <span>
                  75TH
                </span>

                <strong>
                  {formatScore(
                    college.sat75,
                  )}
                </strong>

                <small>
                  PUBLISHED
                </small>
              </div>
            </article>

            <div className="readiness-signal">
              <span>
                {satSignal.label}
              </span>

              <p>
                {satSignal.detail}
              </p>
            </div>
          </>
        ) : (
          <article className="readiness-policy-card">
            <span>
              SCHOOL-SPECIFIC
              TESTING LOGIC
            </span>

            <h3>
              {satSignal.label}
            </h3>

            <p>
              {satSignal.detail}
            </p>
          </article>
        )}

        <article className="readiness-gpa-card">
          <div>
            <span>
              YOUR GPA
            </span>

            <strong>
              {
                profile.gpa ||
                "—"
              }
            </strong>
          </div>

          <div>
            <span>
              SCHOOL GPA CONTEXT
            </span>

            <strong>
              {
                college.averageGpa
              }
            </strong>

            <p>
              {college.gpaNote}
            </p>
          </div>
        </article>

        <div className="readiness-strength-grid">
          <article>
            <span>
              COURSE RIGOR
            </span>

            <strong>
              {profile.rigor}
            </strong>
          </article>

          <article>
            <span>
              ENGINEERING
            </span>

            <strong>
              {
                profile.engineering
              }
            </strong>
          </article>

          <article>
            <span>
              LEADERSHIP
            </span>

            <strong>
              {
                profile.leadership
              }
            </strong>
          </article>
        </div>
      </section>

      <section className="readiness-next-moves">
        <span>
          YOUR NEXT 3 MOVES
        </span>

        <h2>
          Focus beats adding more.
        </h2>

        <div>
          {moves.map(
            (move, index) => (
              <article key={move}>
                <span>
                  0{index + 1}
                </span>

                <p>{move}</p>
              </article>
            ),
          )}
        </div>
      </section>

      <section className="readiness-rule">
        <span>
          ALTWING READINESS RULE
        </span>

        <h2>
          One admissions formula
          cannot fit every college.
        </h2>

        <p>
          A test-blind university,
          a test-optional university,
          a school using score
          percentiles, and a school
          using testing buckets should
          not receive the same
          readiness calculation.
        </p>

        <small>
          Source context:{" "}
          {college.source},{" "}
          {college.sourceYear}
        </small>
      </section>
    </main>
  );
}

export default ReadinessPlan;
