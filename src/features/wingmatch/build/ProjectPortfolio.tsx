import { useState } from "react";

interface PortfolioStep {
  id: string;
  title: string;
  output: string;
}

type EvidenceRecord =
  Record<string, string>;

type EvidenceStore =
  Record<string, EvidenceRecord>;

interface ProjectPortfolioProps {
  wingName: string;
  project: string;
  question: string;
  finalArtifact: string;
  steps: PortfolioStep[];
  evidence: EvidenceStore;
  onBack: () => void;
}

function cleanText(
  value: string | undefined,
) {
  return value
    ?.replace(/\s+/g, " ")
    .trim() ?? "";
}

function firstEvidenceText(
  record:
    | EvidenceRecord
    | undefined,
) {
  if (!record) {
    return "";
  }

  return Object.values(record)
    .map(cleanText)
    .filter(Boolean)
    .join(" ");
}

function shorten(
  value: string,
  maxLength: number,
) {
  const cleaned = cleanText(value);

  if (
    cleaned.length <=
    maxLength
  ) {
    return cleaned;
  }

  return (
    cleaned
      .slice(
        0,
        maxLength - 1,
      )
      .trimEnd() + "…"
  );
}

function ProjectPortfolio({
  wingName,
  project,
  question,
  finalArtifact,
  steps,
  evidence,
  onBack,
}: ProjectPortfolioProps) {
  const [copied, setCopied] =
    useState<string | null>(
      null,
    );

  const completedSteps =
    steps.filter(
      (step) =>
        evidence[step.id] &&
        Object.keys(
          evidence[step.id],
        ).length > 0,
    );

  const exploreEvidence =
    firstEvidenceText(
      evidence[
        steps[0]?.id
      ],
    );

  const buildEvidence =
    firstEvidenceText(
      evidence[
        steps[2]?.id
      ],
    );

  const testEvidence =
    firstEvidenceText(
      evidence[
        steps[3]?.id
      ],
    );

  const iterationEvidence =
    firstEvidenceText(
      evidence[
        steps[4]?.id
      ],
    );

  const publishEvidence =
    firstEvidenceText(
      evidence[
        steps[5]?.id
      ],
    );

  const activityName =
    `${wingName} Independent Engineering Project`;

  const activityRole =
    "Designer & Developer";

  /*
    This description deliberately
    stays grounded in the student's
    saved evidence instead of
    inventing achievements.
  */
  const activityDescription =
    shorten(
      [
        `Developed ${project}.`,
        buildEvidence
          ? `Built and tested ${shorten(
              buildEvidence,
              95,
            )}.`
          : "",
        iterationEvidence
          ? `Iterated using evidence: ${shorten(
              iterationEvidence,
              80,
            )}.`
          : "",
      ]
        .filter(Boolean)
        .join(" "),
      300,
    );

  const commonAppDescription =
    shorten(
      [
        `Built ${project};`,
        testEvidence
          ? `tested ${shorten(
              testEvidence,
              62,
            )};`
          : "",
        iterationEvidence
          ? `iterated ${shorten(
              iterationEvidence,
              55,
            )}.`
          : "",
      ]
        .filter(Boolean)
        .join(" "),
      150,
    );

  const resumeBullet =
    shorten(
      [
        `Built ${project}`,
        `to investigate ${question}`,
        testEvidence
          ? `tested the design using ${shorten(
              testEvidence,
              120,
            )}`
          : "",
        iterationEvidence
          ? `and iterated V1 → V2 based on ${shorten(
              iterationEvidence,
              110,
            )}`
          : "",
      ]
        .filter(Boolean)
        .join("; "),
      420,
    );

  const reflection =
    publishEvidence ||
    iterationEvidence ||
    exploreEvidence ||
    "Complete the evidence checkpoints to generate a stronger project reflection.";

  async function copyText(
    id: string,
    text: string,
  ) {
    try {
      await navigator.clipboard
        .writeText(text);

      setCopied(id);

      window.setTimeout(
        () =>
          setCopied(null),
        1400,
      );
    } catch {
      setCopied(null);
    }
  }

  return (
    <main className="portfolio-shell">
      <header className="portfolio-nav">
        <button
          type="button"
          onClick={onBack}
        >
          ← Back to Build
        </button>

        <strong>
          Alt<span>Wing</span>
        </strong>
      </header>

      <section className="portfolio-hero">
        <span className="portfolio-kicker">
          PROJECT PORTFOLIO
        </span>

        <h1>
          You didn't just explore
          a Wing.
          <br />
          <em>
            You built evidence.
          </em>
        </h1>

        <p>
          This portfolio is assembled
          from the engineering work
          you saved during Build My
          Wing.
        </p>

        <div className="portfolio-summary-card">
          <div>
            <span>
              YOUR PROJECT
            </span>

            <h2>
              {project}
            </h2>

            <p>
              {wingName}
            </p>
          </div>

          <div className="portfolio-completion">
            <strong>
              {
                completedSteps.length
              }
              /{steps.length}
            </strong>

            <span>
              evidence checkpoints
            </span>
          </div>
        </div>
      </section>

      <section className="portfolio-section">
        <div className="portfolio-section-heading">
          <span>
            01 / ENGINEERING QUESTION
          </span>

          <h2>
            What did you actually
            investigate?
          </h2>
        </div>

        <article className="portfolio-feature">
          <p>{question}</p>
        </article>
      </section>

      <section className="portfolio-section">
        <div className="portfolio-section-heading">
          <span>
            02 / EVIDENCE TRAIL
          </span>

          <h2>
            Build → test → iterate.
          </h2>
        </div>

        <div className="portfolio-evidence-grid">
          {steps.map(
            (step, index) => {
              const saved =
                evidence[
                  step.id
                ];

              const text =
                firstEvidenceText(
                  saved,
                );

              return (
                <article
                  key={step.id}
                  className={
                    saved
                      ? "portfolio-evidence-card portfolio-evidence-card--saved"
                      : "portfolio-evidence-card"
                  }
                >
                  <div className="portfolio-evidence-number">
                    {saved
                      ? "✓"
                      : String(
                          index + 1,
                        ).padStart(
                          2,
                          "0",
                        )}
                  </div>

                  <span>
                    {step.output}
                  </span>

                  <h3>
                    {step.title}
                  </h3>

                  <p>
                    {text
                      ? shorten(
                          text,
                          190,
                        )
                      : "No evidence saved yet."}
                  </p>
                </article>
              );
            },
          )}
        </div>
      </section>

      <section className="portfolio-section">
        <div className="portfolio-section-heading">
          <span>
            03 / WHAT I BUILT
          </span>

          <h2>
            The artifact.
          </h2>
        </div>

        <article className="portfolio-feature">
          <strong>
            {finalArtifact}
          </strong>

          {buildEvidence && (
            <p>
              {buildEvidence}
            </p>
          )}
        </article>
      </section>

      <section className="portfolio-section">
        <div className="portfolio-two-column">
          <article className="portfolio-story-card">
            <span>
              TEST
            </span>

            <h3>
              How I tested it
            </h3>

            <p>
              {testEvidence ||
                "Complete the testing checkpoint to document your test evidence."}
            </p>
          </article>

          <article className="portfolio-story-card">
            <span>
              ITERATE
            </span>

            <h3>
              What changed from
              V1 → V2
            </h3>

            <p>
              {iterationEvidence ||
                "Complete the iteration checkpoint to document how evidence changed your design."}
            </p>
          </article>
        </div>
      </section>

      <section className="portfolio-section">
        <div className="portfolio-section-heading">
          <span>
            04 / TECHNICAL REFLECTION
          </span>

          <h2>
            What the project taught
            you.
          </h2>
        </div>

        <article className="portfolio-feature">
          <p>
            {reflection}
          </p>
        </article>
      </section>

      <section className="portfolio-section portfolio-ready-section">
        <div className="portfolio-section-heading">
          <span>
            05 / EXTRACURRICULAR READY
          </span>

          <h2>
            Turn the work into
            something usable.
          </h2>

          <p>
            These drafts are generated
            only from the project and
            evidence already saved in
            AltWing. Review and edit
            them before using them in
            an application.
          </p>
        </div>

        <div className="portfolio-output-list">
          <article className="portfolio-output">
            <div className="portfolio-output-header">
              <span>
                ACTIVITY NAME
              </span>

              <button
                type="button"
                onClick={() =>
                  copyText(
                    "activity-name",
                    activityName,
                  )
                }
              >
                {copied ===
                "activity-name"
                  ? "Copied ✓"
                  : "Copy"}
              </button>
            </div>

            <strong>
              {activityName}
            </strong>
          </article>

          <article className="portfolio-output">
            <div className="portfolio-output-header">
              <span>
                ROLE
              </span>

              <button
                type="button"
                onClick={() =>
                  copyText(
                    "role",
                    activityRole,
                  )
                }
              >
                {copied === "role"
                  ? "Copied ✓"
                  : "Copy"}
              </button>
            </div>

            <strong>
              {activityRole}
            </strong>
          </article>

          <article className="portfolio-output">
            <div className="portfolio-output-header">
              <span>
                PROJECT DESCRIPTION
              </span>

              <button
                type="button"
                onClick={() =>
                  copyText(
                    "description",
                    activityDescription,
                  )
                }
              >
                {copied ===
                "description"
                  ? "Copied ✓"
                  : "Copy"}
              </button>
            </div>

            <p>
              {activityDescription}
            </p>
          </article>

          <article className="portfolio-output">
            <div className="portfolio-output-header">
              <span>
                150-CHARACTER ACTIVITY DRAFT
              </span>

              <button
                type="button"
                onClick={() =>
                  copyText(
                    "common-app",
                    commonAppDescription,
                  )
                }
              >
                {copied ===
                "common-app"
                  ? "Copied ✓"
                  : "Copy"}
              </button>
            </div>

            <p>
              {commonAppDescription}
            </p>

            <small>
              {
                commonAppDescription.length
              }
              /150 characters
            </small>
          </article>

          <article className="portfolio-output">
            <div className="portfolio-output-header">
              <span>
                RESUME-READY BULLET
              </span>

              <button
                type="button"
                onClick={() =>
                  copyText(
                    "resume",
                    resumeBullet,
                  )
                }
              >
                {copied === "resume"
                  ? "Copied ✓"
                  : "Copy"}
              </button>
            </div>

            <p>
              {resumeBullet}
            </p>
          </article>
        </div>
      </section>

      <section className="portfolio-section portfolio-next">
        <span>
          YOUR NEXT FLIGHT
        </span>

        <h2>
          Don't stop at the first
          version.
        </h2>

        <p>
          Use this project as a launch
          point for a deeper build,
          competition entry, TSA
          project, research question,
          GitHub portfolio piece, or
          collaboration with another
          student.
        </p>

        <div className="portfolio-flow">
          DISCOVER
          <b>→</b>
          BUILD
          <b>→</b>
          TEST
          <b>→</b>
          PROVE
          <b>→</b>
          TAKE FLIGHT
        </div>
      </section>
    </main>
  );
}

export default ProjectPortfolio;