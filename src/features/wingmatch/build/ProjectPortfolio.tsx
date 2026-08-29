import { useState } from "react";
import LaunchPlan from "./LaunchPlan";

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
  wingId: string;
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
  wingId,
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

  const [showLaunch, setShowLaunch] =
    useState(false);

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

  function pickEvidence(
    record: EvidenceRecord | undefined,
    keys: string[],
  ) {
    if (!record) {
      return "";
    }

    for (const key of keys) {
      const value = cleanText(record[key]);

      if (value) {
        return value;
      }
    }

    return "";
  }

  const buildRecord =
    evidence[steps[2]?.id];

  const testRecord =
    evidence[steps[3]?.id];

  const iterationRecord =
    evidence[steps[4]?.id];

  const publishRecord =
    evidence[steps[5]?.id];

  const isPreviewData =
    Object.values(evidence).some(
      (record) =>
        Object.values(record).some(
          (value) =>
            value.startsWith(
              "Preview evidence for",
            ),
        ),
    );

  const activityNames:
    Record<string, string> = {
      "Systems Engineering":
        "Spacecraft Systems Design Project",
      "Guidance, Navigation & Control":
        "Lander Guidance & Control Project",
      Structures:
        "Lunar Lander Structures Project",
      Avionics:
        "Spacecraft Avionics & Fault Detection Project",
      "Thermal Engineering":
        "Spacecraft Thermal Design Project",
      Propulsion:
        "Spacecraft Propulsion Trade Study",
      "Mission Design":
        "Lunar Mission Architecture Project",
    };

  const activityRoles:
    Record<string, string> = {
      "Systems Engineering":
        "Systems Designer & Developer",
      "Guidance, Navigation & Control":
        "Simulation Designer & Developer",
      Structures:
        "CAD Designer & Structural Analyst",
      Avionics:
        "Avionics Developer & Systems Tester",
      "Thermal Engineering":
        "Thermal Modeler & Analyst",
      Propulsion:
        "Propulsion Analyst & Model Developer",
      "Mission Design":
        "Mission Architect & Systems Analyst",
    };

  const activityName =
    activityNames[wingName] ??
    `${project} Independent Project`;

  const activityRole =
    activityRoles[wingName] ??
    "Independent Designer & Developer";

  const buildDetail =
    pickEvidence(
      buildRecord,
      [
        "build",
        "controller",
        "logic",
        "model",
        "loadPath",
        "inputs",
        "outputs",
        "tool",
      ],
    ) || buildEvidence;

  const testDetail =
    pickEvidence(
      testRecord,
      [
        "finding",
        "decision",
        "choice",
        "falseAlarm",
        "result",
        "scenario3",
        "testC",
        "healthy",
      ],
    ) || testEvidence;

  const iterationDetail =
    pickEvidence(
      iterationRecord,
      [
        "revision",
        "change",
        "result",
        "impact",
        "decision",
      ],
    ) || iterationEvidence;

  const finalResult =
    pickEvidence(
      publishRecord,
      [
        "result",
        "decision",
        "summary",
        "architecture",
        "method",
      ],
    ) || publishEvidence;

  const activityDescription =
    isPreviewData
      ? `Preview only — ${project} portfolio output. Complete the real evidence checkpoints to generate an application-ready project description.`
      : shorten(
          [
            buildDetail
              ? `Designed and built ${project}: ${shorten(
                  buildDetail,
                  85,
                )}.`
              : `Designed and built ${project}.`,
            testDetail
              ? `Tested the system and identified ${shorten(
                  testDetail,
                  85,
                )}.`
              : "Tested the system across multiple conditions.",
            iterationDetail
              ? `Iterated V1 → V2 based on evidence by ${shorten(
                  iterationDetail,
                  80,
                )}.`
              : "Iterated V1 → V2 using recorded engineering evidence.",
          ].join(" "),
          300,
        );

  const commonAppDescription =
    isPreviewData
      ? shorten(
          `DEV PREVIEW — ${project}. Complete real evidence to generate the final activity draft.`,
          150,
        )
      : shorten(
          [
            `Built ${project};`,
            testDetail
              ? `tested ${shorten(
                  testDetail,
                  48,
                )};`
              : "tested multiple conditions;",
            "iterated V1→V2 using engineering evidence.",
          ]
            .filter(Boolean)
            .join(" "),
          150,
        );

  const resumeBullet =
    isPreviewData
      ? `DEV PREVIEW — Resume language will be generated from the student's real build, test, and iteration evidence.`
      : shorten(
          [
            `Designed and built ${project} to investigate ${question}`,
            testDetail
              ? `tested the system and identified ${shorten(
                  testDetail,
                  105,
                )}`
              : "tested performance across multiple conditions",
            iterationDetail
              ? `iterated V1 → V2 based on ${shorten(
                  iterationDetail,
                  100,
                )}`
              : "iterated V1 → V2 using recorded engineering evidence",
          ]
            .filter(Boolean)
            .join("; "),
          420,
        );

  const reflection =
    isPreviewData
      ? "This is preview data. Complete the real engineering checkpoints to generate a technical reflection grounded in your work."
      : finalResult ||
        iterationDetail ||
        exploreEvidence ||
        "Complete the evidence checkpoints to generate a stronger project reflection.";

  const fullPortfolioText = [
    `# ${project}`,
    ``,
    `**Wing:** ${wingName}`,
    `**Role:** ${activityRole}`,
    ``,
    `## Engineering Question`,
    question,
    ``,
    `## What I Built`,
    finalArtifact,
    buildDetail || "Build evidence not yet available.",
    ``,
    `## Testing`,
    testDetail || "Testing evidence not yet available.",
    ``,
    `## V1 → V2 Iteration`,
    iterationDetail || "Iteration evidence not yet available.",
    ``,
    `## Technical Reflection`,
    reflection,
    ``,
    `## Activity Name`,
    activityName,
    ``,
    `## Project Description`,
    activityDescription,
    ``,
    `## 150-Character Activity Draft`,
    commonAppDescription,
    ``,
    `## Resume Bullet`,
    resumeBullet,
    ``,
    `---`,
    `Generated from evidence recorded in AltWing.`,
  ].join("\n");

  function downloadPortfolio() {
    const blob = new Blob(
      [fullPortfolioText],
      {
        type: "text/markdown;charset=utf-8",
      },
    );

    const url =
      URL.createObjectURL(blob);

    const anchor =
      document.createElement("a");

    const safeName = project
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    anchor.href = url;
    anchor.download =
      `${safeName || "altwing-project"}-portfolio.md`;

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
  }

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

  if (showLaunch) {
    return (
      <LaunchPlan
        wingId={wingId}
        wingName={wingName}
        project={project}
        onBack={() =>
          setShowLaunch(false)
        }
      />
    );
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

        {isPreviewData && (
          <div className="portfolio-preview-badge">
            DEV PREVIEW DATA — NOT FOR APPLICATION USE
          </div>
        )}

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

      <section className="portfolio-section portfolio-export">
        <div className="portfolio-section-heading">
          <span>
            06 / TAKE IT WITH YOU
          </span>

          <h2>
            Your work should leave AltWing with you.
          </h2>

          <p>
            Copy the complete portfolio or download a Markdown file
            for GitHub, a project website, or your own records.
          </p>
        </div>

        <div className="portfolio-export-actions">
          <button
            type="button"
            onClick={() =>
              copyText(
                "full-portfolio",
                fullPortfolioText,
              )
            }
          >
            {copied === "full-portfolio"
              ? "Copied full portfolio ✓"
              : "Copy full portfolio"}
          </button>

          <button
            type="button"
            onClick={downloadPortfolio}
          >
            Download portfolio .md ↓
          </button>
        </div>

        <small className="portfolio-export-note">
          Keep your final application language accurate to work
          you actually completed and can explain.
        </small>
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

        <button
          type="button"
          className="portfolio-launch-next"
          onClick={() =>
            setShowLaunch(true)
          }
        >
          Launch this project →
        </button>

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