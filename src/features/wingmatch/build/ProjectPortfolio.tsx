import {
  useMemo,
  useState,
} from "react";

import "./project-portfolio.css";


interface EvidenceField {
  key: string;
  label: string;
  placeholder: string;
  multiline?: boolean;
  required?: boolean;
}


interface BuildStep {
  id: string;
  week: number;

  phase:
    | "EXPLORE"
    | "BUILD"
    | "LAUNCH";

  title: string;
  description: string;
  output: string;
  why: string;

  evidenceFields:
    EvidenceField[];
}


type EvidenceRecord =
  Record<
    string,
    string
  >;


type EvidenceStore =
  Record<
    string,
    EvidenceRecord
  >;


interface ProjectMeta {
  contribution: string;
  collaborators: string;
  aiUse: string;
  projectLink: string;
  reflection: string;
}


interface VersionEntry {
  id: string;
  stepId: string;
  title: string;
  savedAt: string;
}


interface Props {
  wingId: string;
  wingName: string;

  project: string;
  question: string;
  finalArtifact: string;

  steps:
    BuildStep[];

  evidence:
    EvidenceStore;

  onBack: () => void;
}


const EMPTY_META:
  ProjectMeta = {

  contribution: "",
  collaborators: "",
  aiUse: "",
  projectLink: "",
  reflection: "",
};


function readProjectMeta(
  wingId: string,
):
  ProjectMeta {

  try {
    const raw =
      localStorage.getItem(
        `altwing-project-meta-v1-${wingId}`,
      );

    if (!raw) {
      return {
        ...EMPTY_META,
      };
    }

    const parsed =
      JSON.parse(
        raw,
      );

    return {
      ...EMPTY_META,
      ...parsed,
    };
  } catch {
    return {
      ...EMPTY_META,
    };
  }
}


function readVersions(
  wingId: string,
):
  VersionEntry[] {

  try {
    const raw =
      localStorage.getItem(
        `altwing-project-versions-v1-${wingId}`,
      );

    if (!raw) {
      return [];
    }

    const parsed =
      JSON.parse(
        raw,
      );

    return Array.isArray(
      parsed,
    )
      ? parsed
      : [];
  } catch {
    return [];
  }
}


function ProjectPortfolio({
  wingId,
  wingName,
  project,
  question,
  finalArtifact,
  steps,
  evidence,
  onBack,
}: Props) {

  const [
    copied,
    setCopied,
  ] =
    useState(false);


  const meta =
    useMemo(
      () =>
        readProjectMeta(
          wingId,
        ),
      [wingId],
    );


  const versions =
    useMemo(
      () =>
        readVersions(
          wingId,
        ),
      [wingId],
    );


  const completedSteps =
    steps.filter(
      (
        step,
      ) =>
        Boolean(
          evidence[
            step.id
          ],
        ),
    );


  const links =
    useMemo(
      () => {

        const found:
          {
            label: string;
            value: string;
          }[] = [];


        steps.forEach(
          (
            step,
          ) => {

            const record =
              evidence[
                step.id
              ];

            if (!record) {
              return;
            }


            step.evidenceFields.forEach(
              (
                field,
              ) => {

                const value =
                  record[
                    field.key
                  ]?.trim();

                if (!value) {
                  return;
                }


                if (
                  /link|location|cad|portfolio/i
                    .test(
                      field.key,
                    )
                ) {
                  found.push({
                    label:
                      field.label,

                    value,
                  });
                }
              },
            );
          },
        );


        if (
          meta.projectLink
            .trim()
        ) {
          found.unshift({
            label:
              "PRIMARY PROJECT LINK",

            value:
              meta.projectLink
                .trim(),
          });
        }


        return found;
      },
      [
        evidence,
        meta.projectLink,
        steps,
      ],
    );


  const activityDraft =
    `Built ${project}, a ${wingName} engineering project investigating ${question} Completed ${completedSteps.length} evidence checkpoints across problem definition, design/build, testing, iteration, and technical documentation.`;


  const portfolioSummary = [
    "ALTWING PROJECT EVIDENCE PORTFOLIO",
    "",
    `PROJECT: ${project}`,
    `WING: ${wingName}`,
    "",
    "ENGINEERING QUESTION",
    question,
    "",
    "FINAL ARTIFACT",
    finalArtifact,
    "",
    "MY CONTRIBUTION",
    meta.contribution ||
      "Not documented yet.",
    "",
    "COLLABORATORS",
    meta.collaborators ||
      "Not documented yet.",
    "",
    "AI ASSISTANCE",
    meta.aiUse ||
      "Not documented yet.",
    "",
    "REFLECTION / NEXT ITERATION",
    meta.reflection ||
      "Not documented yet.",
    "",
    "PROCESS",
    ...completedSteps.map(
      (
        step,
        index,
      ) =>
        `${index + 1}. ${step.title} — ${step.output}`,
    ),
  ].join("\n");


  function copySummary() {
    void navigator.clipboard
      .writeText(
        portfolioSummary,
      )
      .then(
        () => {

          setCopied(
            true,
          );

          window.setTimeout(
            () =>
              setCopied(
                false,
              ),
            1500,
          );
        },
      )
      .catch(
        () =>
          setCopied(
            false,
          ),
      );
  }


  return (
    <main className="project-portfolio">

      <header className="portfolio-nav">

        <button
          type="button"
          onClick={
            onBack
          }
        >
          ← Back to Build
        </button>


        <a
          href="/"
          className="altwing-home-logo"
          aria-label="Go to AltWing home"
        >
          Alt<span>Wing</span>
        </a>


        <button
          type="button"
          onClick={() =>
            window.print()
          }
        >
          Print / Save PDF
        </button>

      </header>


      <section className="portfolio-hero">

        <div className="portfolio-hero-copy">

          <span>
            PROJECT EVIDENCE
            PORTFOLIO
          </span>

          <h1>
            {project}
          </h1>

          <p>
            {question}
          </p>


          <div className="portfolio-hero-tags">

            <b>
              {wingName}
            </b>

            <b>
              {
                completedSteps
                  .length
              }
              /{steps.length}
              {" "}
              CHECKPOINTS
            </b>

            <b>
              {
                versions.length
              }
              {" "}
              VERSION EVENTS
            </b>

          </div>

        </div>


        <div className="portfolio-penguin">

          <img
            src="/brand/altwing-penguin.png"
            alt=""
          />

          <span>
            EVIDENCE BUILT
          </span>

        </div>

      </section>


      <section className="portfolio-section">

        <div className="portfolio-section-heading">

          <span>
            01 / THE PROJECT
          </span>

          <h2>
            What was actually
            investigated?
          </h2>

        </div>


        <div className="portfolio-project-grid">

          <article>

            <small>
              ENGINEERING
              QUESTION
            </small>

            <p>
              {question}
            </p>

          </article>


          <article>

            <small>
              FINAL ARTIFACT
            </small>

            <p>
              {finalArtifact}
            </p>

          </article>

        </div>

      </section>


      <section className="portfolio-section">

        <div className="portfolio-section-heading">

          <span>
            02 / OWNERSHIP
          </span>

          <h2>
            What did you
            actually do?
          </h2>

          <p>
            Strong project
            documentation separates
            your own contribution
            from collaborators,
            mentors, and AI tools.
          </p>

        </div>


        <div className="portfolio-ownership-grid">

          <article>

            <small>
              MY CONTRIBUTION
            </small>

            <p>
              {meta.contribution ||
                "Not documented yet."}
            </p>

          </article>


          <article>

            <small>
              COLLABORATORS /
              TEAM
            </small>

            <p>
              {meta.collaborators ||
                "Not documented yet."}
            </p>

          </article>


          <article>

            <small>
              AI ASSISTANCE
            </small>

            <p>
              {meta.aiUse ||
                "Not documented yet."}
            </p>

          </article>


          <article>

            <small>
              REFLECTION /
              NEXT ITERATION
            </small>

            <p>
              {meta.reflection ||
                "Not documented yet."}
            </p>

          </article>

        </div>

      </section>


      <section className="portfolio-section">

        <div className="portfolio-section-heading">

          <span>
            03 / ENGINEERING
            PROCESS
          </span>

          <h2>
            Evidence before
            conclusions.
          </h2>

          <p>
            The portfolio keeps the
            process visible instead
            of showing only a final
            polished artifact.
          </p>

        </div>


        <div className="portfolio-process">

          {steps.map(
            (
              step,
              index,
            ) => {

              const record =
                evidence[
                  step.id
                ];


              return (
                <article
                  key={
                    step.id
                  }
                  className={
                    record
                      ? "complete"
                      : "missing"
                  }
                >

                  <div className="portfolio-process-number">
                    {record
                      ? "✓"
                      : String(
                          index + 1,
                        ).padStart(
                          2,
                          "0",
                        )}
                  </div>


                  <div className="portfolio-process-main">

                    <div className="portfolio-process-top">

                      <span>
                        WEEK{" "}
                        {
                          step.week
                        }
                        {" · "}
                        {
                          step.phase
                        }
                      </span>

                      <b>
                        {record
                          ? "EVIDENCE SAVED"
                          : "NOT YET SAVED"}
                      </b>

                    </div>


                    <h3>
                      {
                        step.title
                      }
                    </h3>


                    <p className="portfolio-output">
                      OUTPUT →{" "}
                      {
                        step.output
                      }
                    </p>


                    {record && (
                      <div className="portfolio-evidence-list">

                        {
                          step
                            .evidenceFields
                            .map(
                              (
                                field,
                              ) => {

                                const value =
                                  record[
                                    field.key
                                  ]?.trim();

                                if (
                                  !value
                                ) {
                                  return null;
                                }


                                return (
                                  <div
                                    key={
                                      field.key
                                    }
                                  >

                                    <small>
                                      {
                                        field.label
                                      }
                                    </small>

                                    <p>
                                      {
                                        value
                                      }
                                    </p>

                                  </div>
                                );
                              },
                            )
                        }

                      </div>
                    )}

                  </div>

                </article>
              );
            },
          )}

        </div>

      </section>


      <section className="portfolio-section">

        <div className="portfolio-section-heading">

          <span>
            04 / VERSION HISTORY
          </span>

          <h2>
            Show the iteration.
          </h2>

          <p>
            Every evidence save can
            become part of a visible
            engineering history.
          </p>

        </div>


        {versions.length >
        0 ? (

          <div className="portfolio-version-list">

            {versions.map(
              (
                version,
              ) => (
                <article
                  key={
                    version.id
                  }
                >

                  <i />

                  <div>

                    <strong>
                      {
                        version.title
                      }
                    </strong>

                    <span>
                      {
                        new Date(
                          version
                            .savedAt,
                        )
                          .toLocaleString()
                      }
                    </span>

                  </div>

                </article>
              ),
            )}

          </div>

        ) : (

          <div className="portfolio-empty">

            Version history starts
            when evidence is saved
            or revised.

          </div>

        )}

      </section>


      <section className="portfolio-section">

        <div className="portfolio-section-heading">

          <span>
            05 / EVIDENCE LINKS
          </span>

          <h2>
            Where can someone
            inspect the work?
          </h2>

        </div>


        {links.length >
        0 ? (

          <div className="portfolio-links">

            {links.map(
              (
                link,
                index,
              ) => (
                <article
                  key={
                    `${link.label}-${index}`
                  }
                >

                  <small>
                    {
                      link.label
                    }
                  </small>

                  <strong>
                    {
                      link.value
                    }
                  </strong>

                </article>
              ),
            )}

          </div>

        ) : (

          <div className="portfolio-empty">

            No project link has
            been documented yet.

          </div>

        )}

      </section>


      <section className="portfolio-section portfolio-drafts">

        <div className="portfolio-section-heading">

          <span>
            06 / APPLICATION
            DRAFTS
          </span>

          <h2>
            Translate the work.
          </h2>

          <p>
            These are starting
            drafts, not final
            admissions language.
          </p>

        </div>


        <article>

          <small>
            ACTIVITY /
            PROJECT DRAFT
          </small>

          <p>
            {
              activityDraft
            }
          </p>

        </article>


        <div className="portfolio-draft-actions">

          <button
            type="button"
            onClick={
              copySummary
            }
          >
            {copied
              ? "COPIED ✓"
              : "COPY PORTFOLIO SUMMARY"}
          </button>


          <button
            type="button"
            onClick={() =>
              window.print()
            }
          >
            PRINT / SAVE PDF
          </button>

        </div>

      </section>


      <section className="portfolio-integrity">

        <span>
          EVIDENCE INTEGRITY
        </span>

        <h2>
          Documented does not
          automatically mean
          externally verified.
        </h2>

        <p>
          This portfolio currently
          shows student-entered
          evidence and links.
          AltWing does not claim
          that an AI or human
          reviewer has independently
          verified authorship.
          A future Evidence Check
          can be added when verified
          accounts and a secure
          backend exist.
        </p>

      </section>

    </main>
  );
}


export default ProjectPortfolio;
