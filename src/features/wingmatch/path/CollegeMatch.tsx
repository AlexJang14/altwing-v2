import { useEffect, useState } from "react";

import {
  colleges,
  type CollegeProfile,
} from "./collegeData";

import {
  collegeExplorerMeta,
  type CollegeRegion,
} from "./collegeExplorerMeta";

interface CollegeMatchProps {
  major: string;
  onBack: () => void;

  onAnalyzeReadiness?: (
    collegeId: string,
  ) => void;
}

const COLLEGE_LIST_STORAGE_KEY =
  "altwing-my-college-list";

function formatScore(
  score: number | null,
) {
  return score === null
    ? "—"
    : String(score);
}

const policyLabels:
  Record<
    CollegeProfile["testingPolicy"],
    string
  > = {
  REQUIRED: "TEST REQUIRED",
  OPTIONAL: "TEST OPTIONAL",
  NOT_USED: "TEST NOT USED",
  SPECIAL: "SPECIAL TESTING",
  CHECK_CURRENT: "VERIFY CURRENT POLICY",
};

function CollegeCard({
  college,
  selected,
  saved,
  onSelect,
  onToggleSaved,
}: {
  college: CollegeProfile;
  selected: boolean;
  saved: boolean;
  onSelect: () => void;
  onToggleSaved: () => void;
}) {
  const hasSatData =
    college.sat25 !== null ||
    college.sat50 !== null ||
    college.sat75 !== null;

  return (
    <article
      className={
        selected
          ? "college-card college-card-selected"
          : "college-card"
      }
    >
      <div className="college-card-top">
        <div>
          <span>
            {college.aerospaceFit}
          </span>

          <h2>
            {college.shortName}
          </h2>

          <p>
            {college.location}
          </p>
        </div>

        <div className="college-card-actions">
          <button
            type="button"
            onClick={onSelect}
          >
            {selected
              ? "Viewing ✓"
              : "View profile →"}
          </button>

          <button
            type="button"
            className={
              saved
                ? "college-save college-save-active"
                : "college-save"
            }
            onClick={onToggleSaved}
          >
            {saved
              ? "Saved ✓"
              : "+ My List"}
          </button>
        </div>
      </div>

      <div
        className={
          "college-testing-badge " +
          `college-testing-${college.testingPolicy.toLowerCase()}`
        }
      >
        {policyLabels[
          college.testingPolicy
        ]}
      </div>

      <div className="college-major">
        <span>PROGRAM</span>

        <strong>
          {college.major}
        </strong>
      </div>

      {college.testingPolicy ===
      "NOT_USED" ? (
        <div className="college-score-unavailable">
          SAT / ACT are not used
          in admission selection.
        </div>
      ) : college.testingPolicy ===
        "SPECIAL" ? (
        <div className="college-score-unavailable">
          Section-level testing
          policy — open the profile
          for details.
        </div>
      ) : hasSatData ? (
        <div className="college-quick-stats">
          <div>
            <span>SAT 25TH</span>
            <strong>
              {formatScore(
                college.sat25,
              )}
            </strong>
          </div>

          <div>
            <span>SAT MEDIAN</span>
            <strong>
              {formatScore(
                college.sat50,
              )}
            </strong>
          </div>

          <div>
            <span>SAT 75TH</span>
            <strong>
              {formatScore(
                college.sat75,
              )}
            </strong>
          </div>
        </div>
      ) : (
        <div className="college-score-unavailable">
          No verified percentile
          profile loaded yet.
        </div>
      )}
    </article>
  );
}

function CollegeMatch({
  major,
  onBack,
  onAnalyzeReadiness,
}: CollegeMatchProps) {

  function analyzeReadiness(
    collegeId: string,
  ) {
    localStorage.setItem(
      "altwing-readiness-target-college",
      collegeId,
    );

    onAnalyzeReadiness?.(
      collegeId,
    );
  }

  const [
    selectedCollege,
    setSelectedCollege,
  ] = useState<CollegeProfile>(
    colleges[0],
  );

  const [
    profileOpen,
    setProfileOpen,
  ] = useState(false);

  const openCollegeProfile = (
    college: CollegeProfile,
  ) => {
    setSelectedCollege(
      college,
    );

    setProfileOpen(true);
  };

  const [
    savedCollegeIds,
    setSavedCollegeIds,
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

  useEffect(() => {
    localStorage.setItem(
      COLLEGE_LIST_STORAGE_KEY,
      JSON.stringify(
        savedCollegeIds,
      ),
    );
  }, [savedCollegeIds]);

  const toggleSavedCollege = (
    collegeId: string,
  ) => {
    setSavedCollegeIds(
      (current) =>
        current.includes(
          collegeId,
        )
          ? current.filter(
              (id) =>
                id !== collegeId,
            )
          : [
              ...current,
              collegeId,
            ],
    );
  };

  const savedColleges =
    colleges.filter(
      (college) =>
        savedCollegeIds.includes(
          college.id,
        ),
    );

  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");

  const [
    regionFilter,
    setRegionFilter,
  ] = useState<
    CollegeRegion | "ALL"
  >("ALL");

  const [
    satBand,
    setSatBand,
  ] = useState<
    | "ALL"
    | "1500_PLUS"
    | "1400_1499"
    | "UNDER_1400"
  >("ALL");

  const normalizedSearch =
    searchQuery
      .trim()
      .toLowerCase();

  const filteredColleges =
    colleges.filter(
      (college) => {
        const meta =
          collegeExplorerMeta[
            college.id
          ];

        const searchable = [
          college.name,
          college.shortName,
          college.location,
          college.major,
          college.aerospaceFit,
        ]
          .join(" ")
          .toLowerCase();

        const matchesSearch =
          normalizedSearch.length ===
            0 ||
          searchable.includes(
            normalizedSearch,
          );

        const matchesRegion =
          regionFilter === "ALL" ||
          meta?.region ===
            regionFilter;

        const median =
          college.sat50;

        const matchesSat =
          satBand === "ALL" ||
          (
            median !== null &&
            satBand ===
              "1500_PLUS" &&
            median >= 1500
          ) ||
          (
            median !== null &&
            satBand ===
              "1400_1499" &&
            median >= 1400 &&
            median < 1500
          ) ||
          (
            median !== null &&
            satBand ===
              "UNDER_1400" &&
            median < 1400
          );

        return (
          matchesSearch &&
          matchesRegion &&
          matchesSat
        );
      },
    );

  const selectedMeta =
    collegeExplorerMeta[
      selectedCollege.id
    ];

  const hasSatProfile =
    selectedCollege.sat25 !==
      null ||
    selectedCollege.sat50 !==
      null ||
    selectedCollege.sat75 !==
      null;

  const hasActProfile =
    selectedCollege.act25 !==
      null ||
    selectedCollege.act50 !==
      null ||
    selectedCollege.act75 !==
      null;

  return (
    <main className="college-shell">
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

      <section className="college-hero">
        <span className="path-kicker">
          04 / COLLEGE MATCH
        </span>

        <h1>
          Don't chase a ranking.
          <br />
          Find the right runway.
        </h1>

        <p>
          Start with colleges that
          genuinely support your{" "}
          <strong>{major}</strong>{" "}
          direction. Compare program
          structure, official data,
          and each school's actual
          admissions rules.
        </p>
      </section>

      <section className="college-data-rule">
        <div>
          <span>
            DATA STANDARD
          </span>

          <h2>
            Different schools.
            Different rules.
          </h2>
        </div>

        <p>
          AltWing does not force every
          college into the same SAT/GPA
          template. If a school is
          test-blind, test-optional, or
          uses a special testing system,
          the interface changes with it.
        </p>
      </section>

      <section className="college-explorer-tools">
        <div className="college-search-box">
          <span>
            SEARCH COLLEGES
          </span>

          <input
            type="search"
            placeholder="Search school, city, or major..."
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(
                event.target.value,
              )
            }
          />
        </div>

        <label>
          <span>REGION</span>

          <select
            value={regionFilter}
            onChange={(event) =>
              setRegionFilter(
                event.target.value as
                  CollegeRegion |
                  "ALL",
              )
            }
          >
            <option value="ALL">
              All regions
            </option>

            <option value="NORTHEAST">
              Northeast
            </option>

            <option value="MIDWEST">
              Midwest
            </option>

            <option value="SOUTH">
              South
            </option>

            <option value="WEST">
              West
            </option>
          </select>
        </label>

        <label>
          <span>
            SAT MEDIAN CONTEXT
          </span>

          <select
            value={satBand}
            onChange={(event) =>
              setSatBand(
                event.target.value as
                  | "ALL"
                  | "1500_PLUS"
                  | "1400_1499"
                  | "UNDER_1400",
              )
            }
          >
            <option value="ALL">
              All SAT ranges
            </option>

            <option value="1500_PLUS">
              Median 1500+
            </option>

            <option value="1400_1499">
              Median 1400–1499
            </option>

            <option value="UNDER_1400">
              Median below 1400
            </option>
          </select>
        </label>

        <div className="college-result-count">
          <strong>
            {filteredColleges.length}
          </strong>

          <span>
            schools shown
          </span>
        </div>
      </section>

      <section className="college-filter-note">
        <span>
          FILTER ≠ ADMISSION CHANCE
        </span>

        <p>
          SAT filters only apply to
          schools with a verified
          published median. Schools
          using special or test-blind
          policies are intentionally
          excluded from SAT-band filters.
        </p>
      </section>

      <section className="college-my-list">
        <div className="college-my-list-heading">
          <div>
            <span>
              MY COLLEGE LIST
            </span>

            <h2>
              Build a shortlist
              worth comparing.
            </h2>
          </div>

          <strong>
            {savedColleges.length}
            {" "}
            {savedColleges.length === 1
              ? "school"
              : "schools"}
          </strong>
        </div>

        {savedColleges.length === 0 ? (
          <div className="college-my-list-empty">
            <p>
              Save colleges as you explore.
              Your list stays on this device
              even after you refresh the page.
            </p>
          </div>
        ) : (
          <div className="college-my-list-items">
            {savedColleges.map(
              (college) => (
                <button
                  key={college.id}
                  type="button"
                  onClick={() =>
                    openCollegeProfile(
                      college,
                    )
                  }
                >
                  <span>
                    {college.shortName}
                  </span>

                  <small>
                    {college.aerospaceFit}
                  </small>

                  <b
                    role="button"
                    tabIndex={0}
                    onClick={(event) => {
                      event.stopPropagation();

                      toggleSavedCollege(
                        college.id,
                      );
                    }}
                    onKeyDown={(event) => {
                      if (
                        event.key ===
                          "Enter" ||
                        event.key === " "
                      ) {
                        event.preventDefault();
                        event.stopPropagation();

                        toggleSavedCollege(
                          college.id,
                        );
                      }
                    }}
                  >
                    ×
                  </b>
                </button>
              ),
            )}
          </div>
        )}
      </section>

      <section className="college-layout">
        <div className="college-list">
          {filteredColleges.length ===
            0 && (
            <div className="college-empty">
              <span>
                NO MATCHES
              </span>

              <h3>
                Try a broader search.
              </h3>

              <p>
                Clear a region or SAT
                filter to see more
                aerospace pathways.
              </p>
            </div>
          )}

          {filteredColleges.map(
            (college) => (
              <CollegeCard
                key={college.id}
                college={college}
                selected={
                  selectedCollege.id ===
                  college.id
                }
                saved={
                  savedCollegeIds.includes(
                    college.id,
                  )
                }
                onSelect={() =>
                  openCollegeProfile(
                    college,
                  )
                }
                onToggleSaved={() =>
                  toggleSavedCollege(
                    college.id,
                  )
                }
              />
            ),
          )}
        </div>

        {profileOpen && (
          <button
            type="button"
            className="college-profile-backdrop"
            aria-label="Close college profile"
            onClick={() =>
              setProfileOpen(false)
            }
          />
        )}

        <aside
          className={[
            "college-profile-panel",

            profileOpen
              ? "college-profile-panel--open"
              : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <button
            type="button"
            className="college-profile-close"
            aria-label="Close college profile"
            onClick={() =>
              setProfileOpen(false)
            }
          >
            ×
          </button>
          <span className="college-profile-kicker">
            COLLEGE PROFILE
          </span>

          <h2>
            {selectedCollege.shortName}
          </h2>

          <p className="college-profile-location">
            {selectedCollege.location}
          </p>

          <button
            type="button"
            className={
              savedCollegeIds.includes(
                selectedCollege.id,
              )
                ? "college-profile-save college-profile-save-active"
                : "college-profile-save"
            }
            onClick={() =>
              toggleSavedCollege(
                selectedCollege.id,
              )
            }
          >
            {savedCollegeIds.includes(
              selectedCollege.id,
            )
              ? "Saved to My College List ✓"
              : "+ Save to My College List"}
          </button>

          <button
            type="button"
            className="college-profile-readiness"
            onClick={() =>
              analyzeReadiness(
                selectedCollege.id,
              )
            }
          >
            <span>
              COLLEGE LAUNCH
            </span>

            <strong>
              Analyze Readiness →
            </strong>

            <small>
              See what to strengthen
              for this school.
            </small>
          </button>

          <div className="college-profile-program">
            <span>
              AEROSPACE PATH
            </span>

            <strong>
              {selectedCollege.major}
            </strong>
          </div>

          <section className="college-testing-policy">
            <span>
              TESTING POLICY
            </span>

            <strong>
              {
                policyLabels[
                  selectedCollege
                    .testingPolicy
                ]
              }
            </strong>

            <p>
              {
                selectedCollege
                  .testingPolicyNote
              }
            </p>
          </section>

          {hasSatProfile && (
            <section className="college-profile-section">
              <span>
                SAT CONTEXT
              </span>

              <div className="college-stat-row">
                <div>
                  <small>
                    25TH
                  </small>

                  <strong>
                    {formatScore(
                      selectedCollege
                        .sat25,
                    )}
                  </strong>
                </div>

                <div>
                  <small>
                    MEDIAN
                  </small>

                  <strong>
                    {formatScore(
                      selectedCollege
                        .sat50,
                    )}
                  </strong>
                </div>

                <div>
                  <small>
                    75TH
                  </small>

                  <strong>
                    {formatScore(
                      selectedCollege
                        .sat75,
                    )}
                  </strong>
                </div>
              </div>

              <p>
                {
                  selectedCollege
                    .scoreContext
                }
              </p>
            </section>
          )}

          {hasActProfile && (
            <section className="college-profile-section">
              <span>
                ACT CONTEXT
              </span>

              <div className="college-stat-row">
                <div>
                  <small>
                    25TH
                  </small>

                  <strong>
                    {formatScore(
                      selectedCollege
                        .act25,
                    )}
                  </strong>
                </div>

                <div>
                  <small>
                    MEDIAN
                  </small>

                  <strong>
                    {formatScore(
                      selectedCollege
                        .act50,
                    )}
                  </strong>
                </div>

                <div>
                  <small>
                    75TH
                  </small>

                  <strong>
                    {formatScore(
                      selectedCollege
                        .act75,
                    )}
                  </strong>
                </div>
              </div>
            </section>
          )}

          {!hasSatProfile &&
            !hasActProfile && (
            <section className="college-score-unavailable college-profile-no-score">
              <strong>
                NO COMPOSITE SCORE
                COMPARISON
              </strong>

              <p>
                {
                  selectedCollege
                    .scoreContext
                }
              </p>
            </section>
          )}

          <section className="college-profile-section">
            <span>GPA CONTEXT</span>

            <strong className="college-gpa">
              {
                selectedCollege
                  .averageGpa
              }
            </strong>

            <p>
              {
                selectedCollege
                  .gpaNote
              }
            </p>
          </section>

          <section className="college-profile-section">
            <span>
              ADMISSION CONTEXT
            </span>

            <strong className="college-admit">
              {
                selectedCollege
                  .admissionRate
              }
            </strong>
          </section>

          <section className="college-profile-section">
            <span>
              WHY IT MAY FIT
            </span>

            <ul>
              {selectedCollege
                .strengths.map(
                  (strength) => (
                    <li
                      key={strength}
                    >
                      {strength}
                    </li>
                  ),
                )}
            </ul>
          </section>

          {selectedMeta?.specialContext && (
            <section className="college-special-context">
              <span>
                SPECIAL ADMISSIONS CONTEXT
              </span>

              <p>
                {
                  selectedMeta
                    .specialContext
                }
              </p>
            </section>
          )}

          {selectedMeta?.dataCaution && (
            <section className="college-data-caution">
              <span>
                DATA CAUTION
              </span>

              <p>
                {
                  selectedMeta
                    .dataCaution
                }
              </p>
            </section>
          )}

          <footer className="college-source">
            <span>SOURCE</span>

            <strong>
              {selectedCollege.source}
            </strong>

            <small>
              {
                selectedCollege
                  .sourceYear
              }
            </small>
          </footer>
        </aside>
      </section>

      <section className="college-warning">
        <span>
          IMPORTANT
        </span>

        <h2>
          Context is useful.
          Fake precision isn't.
        </h2>

        <p>
          AltWing will not manufacture
          an average GPA, SAT median,
          major acceptance rate, or
          personal admission probability
          when the institution does not
          publish one.
        </p>
      </section>
    </main>
  );
}

export default CollegeMatch;
