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

const defaultProfile: StudentProfile = {
  gpa: "",
  sat: "",
  satMath: "",
  rigor: "Developing",
  engineering: "Developing",
  leadership: "Developing",
};

function getSatSignal(
  score: number,
  college: CollegeProfile,
) {
  if (!score) {
    return {
      label: "ADD YOUR SCORE",
      detail:
        "Enter an SAT score to compare it with the school's official range.",
    };
  }

  if (score >= college.sat75) {
    return {
      label: "AT / ABOVE 75TH",
      detail:
        `Your ${score} is at or above the school's reported 75th percentile (${college.sat75}).`,
    };
  }

  if (score >= college.sat50) {
    return {
      label: "ABOVE MEDIAN",
      detail:
        `Your ${score} is between the reported median (${college.sat50}) and 75th percentile (${college.sat75}).`,
    };
  }

  if (score >= college.sat25) {
    return {
      label: "WITHIN REPORTED RANGE",
      detail:
        `Your ${score} falls between the school's reported 25th percentile (${college.sat25}) and median (${college.sat50}).`,
    };
  }

  return {
    label: "BELOW 25TH",
    detail:
      `Your ${score} is below the school's reported 25th percentile (${college.sat25}). Testing may be one area to strengthen.`,
  };
}

function nextMoves(
  profile: StudentProfile,
  college: CollegeProfile,
) {
  const moves: string[] = [];

  const sat = Number(profile.sat);

  if (!sat) {
    moves.push(
      "Establish a current SAT or ACT baseline so testing strategy is based on evidence.",
    );
  } else if (sat < college.sat50) {
    moves.push(
      `Work toward ${college.shortName}'s reported SAT median of ${college.sat50}, while remembering that scores are only one part of admission.`,
    );
  } else {
    moves.push(
      "Testing is currently within a competitive reported range; protect time for coursework, projects, and impact instead of chasing points indefinitely.",
    );
  }

  if (
    profile.rigor === "Exploring" ||
    profile.rigor === "Developing"
  ) {
    moves.push(
      "Strengthen relevant academic rigor in math, physics, computing, or engineering where your school makes those courses available.",
    );
  }

  if (
    profile.engineering === "Exploring" ||
    profile.engineering === "Developing"
  ) {
    moves.push(
      `Turn your ${profile.engineering.toLowerCase()} technical interest into one tested, documented ${college.major} or engineering project with visible evidence.`,
    );
  }

  if (
    profile.leadership === "Exploring" ||
    profile.leadership === "Developing"
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
    selectedCollegeId,
    setSelectedCollegeId,
  ] = useState(colleges[0].id);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(profile),
    );
  }, [profile]);

  const college =
    colleges.find(
      (item) =>
        item.id === selectedCollegeId,
    ) ?? colleges[0];

  const satScore =
    Number(profile.sat) || 0;

  const satSignal = useMemo(
    () =>
      getSatSignal(
        satScore,
        college,
      ),
    [satScore, college],
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
          Compare your current preparation
          with official college data for{" "}
          <strong>{major}</strong>.
          AltWing does not calculate a fake
          probability of admission. It shows
          context, gaps, strengths, and useful
          next moves.
        </p>
      </section>

      <section className="readiness-layout">
        <div className="readiness-input-panel">
          <span>MY PROFILE</span>

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
              <span>SAT TOTAL</span>

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
              <span>SAT MATH</span>

              <input
                type="number"
                min="200"
                max="800"
                placeholder="Example: 760"
                value={profile.satMath}
                onChange={(event) =>
                  updateField(
                    "satMath",
                    event.target.value,
                  )
                }
              />
            </label>

            <label>
              <span>COURSE RIGOR</span>

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
              <span>LEADERSHIP</span>

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
          <span>TARGET SCHOOL</span>

          <select
            value={selectedCollegeId}
            onChange={(event) =>
              setSelectedCollegeId(
                event.target.value,
              )
            }
          >
            {colleges.map(
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

        <article className="readiness-score-card">
          <div>
            <span>SAT</span>

            <strong>
              {profile.sat || "—"}
            </strong>

            <small>YOU</small>
          </div>

          <div>
            <span>25TH</span>

            <strong>
              {college.sat25}
            </strong>

            <small>
              OFFICIAL DATA
            </small>
          </div>

          <div>
            <span>MEDIAN</span>

            <strong>
              {college.sat50}
            </strong>

            <small>
              OFFICIAL DATA
            </small>
          </div>

          <div>
            <span>75TH</span>

            <strong>
              {college.sat75}
            </strong>

            <small>
              OFFICIAL DATA
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

        <article className="readiness-gpa-card">
          <div>
            <span>YOUR GPA</span>

            <strong>
              {profile.gpa || "—"}
            </strong>
          </div>

          <div>
            <span>
              SCHOOL GPA CONTEXT
            </span>

            <strong>
              {college.averageGpa}
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
              {profile.engineering}
            </strong>
          </article>

          <article>
            <span>
              LEADERSHIP
            </span>

            <strong>
              {profile.leadership}
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
          This is a planning tool,
          not an admissions prediction.
        </h2>

        <p>
          College admissions are holistic
          and institution-specific. A score
          range, GPA, or activity rating
          cannot tell an individual student
          whether they will be admitted.
        </p>

        <small>
          College data source:{" "}
          {college.source},{" "}
          {college.sourceYear}
        </small>
      </section>
    </main>
  );
}

export default ReadinessPlan;
