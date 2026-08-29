import { useState } from "react";
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
}

function CollegeCard({
  college,
  selected,
  onSelect,
}: {
  college: CollegeProfile;
  selected: boolean;
  onSelect: () => void;
}) {
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

        <button
          type="button"
          onClick={onSelect}
        >
          {selected
            ? "Selected ✓"
            : "View profile →"}
        </button>
      </div>

      <div className="college-major">
        <span>PROGRAM</span>
        <strong>{college.major}</strong>
      </div>

      <div className="college-quick-stats">
        <div>
          <span>SAT 25TH</span>
          <strong>
            {college.sat25}
          </strong>
        </div>

        <div>
          <span>SAT MEDIAN</span>
          <strong>
            {college.sat50}
          </strong>
        </div>

        <div>
          <span>SAT 75TH</span>
          <strong>
            {college.sat75}
          </strong>
        </div>
      </div>
    </article>
  );
}

function CollegeMatch({
  major,
  onBack,
}: CollegeMatchProps) {
  const [
    selectedCollege,
    setSelectedCollege,
  ] = useState<CollegeProfile>(
    colleges[0],
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

        const matchesSat =
          satBand === "ALL" ||
          (
            satBand ===
              "1500_PLUS" &&
            college.sat50 >= 1500
          ) ||
          (
            satBand ===
              "1400_1499" &&
            college.sat50 >= 1400 &&
            college.sat50 < 1500
          ) ||
          (
            satBand ===
              "UNDER_1400" &&
            college.sat50 < 1400
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
          Start with colleges that can
          genuinely support your{" "}
          <strong>{major}</strong> direction.
          Compare official admissions data,
          program fit, and opportunities
          before deciding what belongs on
          your college list.
        </p>
      </section>

      <section className="college-data-rule">
        <div>
          <span>
            DATA STANDARD
          </span>

          <h2>
            Official data first.
          </h2>
        </div>

        <p>
          AltWing uses institution-reported
          data when available. If a university
          does not officially report an average
          GPA, we show "Not reported" instead
          of inventing one.
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
          These filters organize
          schools by published
          information. A higher or
          lower SAT range does not
          make a college a personal
          reach, target, or likely.
        </p>
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
                aerospace programs.
              </p>
            </div>
          )}

          {filteredColleges.map((college) => (
            <CollegeCard
              key={college.id}
              college={college}
              selected={
                selectedCollege.id ===
                college.id
              }
              onSelect={() =>
                setSelectedCollege(
                  college,
                )
              }
            />
          ))}
        </div>

        <aside className="college-profile-panel">
          <span className="college-profile-kicker">
            COLLEGE PROFILE
          </span>

          <h2>
            {selectedCollege.shortName}
          </h2>

          <p className="college-profile-location">
            {selectedCollege.location}
          </p>

          <div className="college-profile-program">
            <span>
              AEROSPACE PATH
            </span>

            <strong>
              {selectedCollege.major}
            </strong>
          </div>

          <section className="college-profile-section">
            <span>
              ADMISSIONS PROFILE
            </span>

            <div className="college-stat-row">
              <div>
                <small>
                  SAT 25TH
                </small>
                <strong>
                  {selectedCollege.sat25}
                </strong>
              </div>

              <div>
                <small>
                  MEDIAN
                </small>
                <strong>
                  {selectedCollege.sat50}
                </strong>
              </div>

              <div>
                <small>
                  SAT 75TH
                </small>
                <strong>
                  {selectedCollege.sat75}
                </strong>
              </div>
            </div>

            <div className="college-stat-row">
              <div>
                <small>
                  ACT 25TH
                </small>
                <strong>
                  {selectedCollege.act25}
                </strong>
              </div>

              <div>
                <small>
                  MEDIAN
                </small>
                <strong>
                  {selectedCollege.act50}
                </strong>
              </div>

              <div>
                <small>
                  ACT 75TH
                </small>
                <strong>
                  {selectedCollege.act75}
                </strong>
              </div>
            </div>
          </section>

          <section className="college-profile-section">
            <span>GPA CONTEXT</span>

            <strong className="college-gpa">
              {selectedCollege.averageGpa}
            </strong>

            <p>
              {selectedCollege.gpaNote}
            </p>
          </section>

          <section className="college-profile-section">
            <span>
              OVERALL ADMISSION CONTEXT
            </span>

            <strong className="college-admit">
              {selectedCollege.admissionRate}
            </strong>

            <p>
              This is context, not your
              personal probability of admission.
              Major, residency, academic record,
              essays, activities, institutional
              priorities, and other factors matter.
            </p>
          </section>

          <section className="college-profile-section">
            <span>
              WHY IT MAY FIT
            </span>

            <ul>
              {selectedCollege.strengths.map(
                (strength) => (
                  <li key={strength}>
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
                  selectedMeta.specialContext
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
                  selectedMeta.dataCaution
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
              {selectedCollege.sourceYear}
            </small>
          </footer>
        </aside>
      </section>

      <section className="college-warning">
        <span>
          IMPORTANT
        </span>

        <h2>
          A score range is not an
          admissions formula.
        </h2>

        <p>
          SAT, ACT, GPA, and admission
          rates help describe the enrolled
          or admitted population. They
          should guide planning, not be used
          to manufacture a fake acceptance
          probability.
        </p>
      </section>
    </main>
  );
}

export default CollegeMatch;
