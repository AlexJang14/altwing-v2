import { useState } from "react";
import "./build-wing.css";

interface BuildWingProps {
  wingId: string;
  wingName: string;
  onBack: () => void;
}

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
  phase: "EXPLORE" | "BUILD" | "LAUNCH";
  title: string;
  description: string;
  output: string;
  why: string;
  evidenceFields: EvidenceField[];
}

interface BuildPlan {
  project: string;
  question: string;
  finalArtifact: string;
  steps: BuildStep[];
}

type EvidenceRecord = Record<string, string>;
type EvidenceStore = Record<string, EvidenceRecord>;

const systemsPlan: BuildPlan = {
  project: "Mission Tradeoff Simulator",

  question:
    "How should a spacecraft distribute limited mass, power, thermal margin, and mission resources when improving one system creates a cost somewhere else?",

  finalArtifact:
    "Interactive mission simulator + mission constraint map + scenario tests + V1 → V2 comparison + technical brief",

  steps: [
    {
      id: "systems-01",
      week: 1,
      phase: "EXPLORE",
      title: "Define the mission constraints",

      description:
        "Turn a vague spacecraft mission into a system with measurable limits and competing priorities.",

      output: "Mission constraint map",

      why:
        "Systems engineers cannot maximize everything. A real mission is shaped by limits, priorities, and tradeoffs.",

      evidenceFields: [
        {
          key: "objective",
          label: "MISSION OBJECTIVE",
          placeholder:
            "Example: Deliver a small science payload to the lunar surface and operate for 24 hours.",
          multiline: true,
          required: true,
        },
        {
          key: "mass",
          label: "MASS LIMIT",
          placeholder: "Example: Total spacecraft mass ≤ 180 kg",
          required: true,
        },
        {
          key: "power",
          label: "POWER LIMIT",
          placeholder: "Example: Average available electrical power ≤ 450 W",
          required: true,
        },
        {
          key: "thermal",
          label: "THERMAL CONSTRAINT",
          placeholder:
            "Example: Battery must remain between 0°C and 40°C",
          required: true,
        },
        {
          key: "priority",
          label: "MISSION PRIORITY",
          placeholder:
            "Example: Protect landing reliability before maximizing science return",
          multiline: true,
          required: true,
        },
        {
          key: "tradeoff",
          label: "TRADEOFF QUESTION",
          placeholder:
            "What must you sacrifice if you increase performance somewhere else?",
          multiline: true,
          required: true,
        },
      ],
    },

    {
      id: "systems-02",
      week: 1,
      phase: "EXPLORE",
      title: "Create the tradeoff rules",

      description:
        "Define how changing one subsystem affects another so that there is no perfect solution.",

      output: "Tradeoff model",

      why:
        "The value of a systems model comes from relationships. If every variable can improve independently, there is no engineering decision to make.",

      evidenceFields: [
        {
          key: "variableA",
          label: "VARIABLE 01",
          placeholder: "Example: Battery capacity",
          required: true,
        },
        {
          key: "effectA",
          label: "WHAT DOES IT IMPROVE?",
          placeholder: "Example: Mission operating time",
          required: true,
        },
        {
          key: "costA",
          label: "WHAT DOES IT COST?",
          placeholder: "Example: More mass and thermal load",
          required: true,
        },
        {
          key: "rule",
          label: "TRADEOFF RULE",
          placeholder:
            "Example: Every +10 Wh of battery capacity adds +0.6 kg and increases thermal demand.",
          multiline: true,
          required: true,
        },
      ],
    },

    {
      id: "systems-03",
      week: 2,
      phase: "BUILD",
      title: "Build simulator V1",

      description:
        "Create the smallest working simulator that makes your mission tradeoffs visible.",

      output: "Working simulator",

      why:
        "A model becomes useful when another person can change an input and immediately see the engineering consequence.",

      evidenceFields: [
        {
          key: "tool",
          label: "BUILD TOOL",
          placeholder: "JavaScript, Python, Excel, Google Sheets...",
          required: true,
        },
        {
          key: "inputs",
          label: "SIMULATOR INPUTS",
          placeholder:
            "What can the user change?",
          multiline: true,
          required: true,
        },
        {
          key: "outputs",
          label: "SIMULATOR OUTPUTS",
          placeholder:
            "What does the model calculate or display?",
          multiline: true,
          required: true,
        },
        {
          key: "link",
          label: "PROJECT LINK OR FILE NOTE",
          placeholder:
            "GitHub URL, Replit URL, filename, or where your working version is stored",
          required: true,
        },
      ],
    },

    {
      id: "systems-04",
      week: 2,
      phase: "BUILD",
      title: "Run three mission scenarios",

      description:
        "Change the mission priorities and determine whether the recommended design changes.",

      output: "Scenario comparison",

      why:
        "One successful run proves very little. Engineering confidence comes from testing the system under different conditions.",

      evidenceFields: [
        {
          key: "scenario1",
          label: "SCENARIO 01 — SAFETY FIRST",
          placeholder:
            "What inputs did you use and what happened?",
          multiline: true,
          required: true,
        },
        {
          key: "scenario2",
          label: "SCENARIO 02 — PERFORMANCE FIRST",
          placeholder:
            "What inputs did you use and what happened?",
          multiline: true,
          required: true,
        },
        {
          key: "scenario3",
          label: "SCENARIO 03 — BALANCED",
          placeholder:
            "What inputs did you use and what happened?",
          multiline: true,
          required: true,
        },
        {
          key: "finding",
          label: "MOST IMPORTANT FINDING",
          placeholder:
            "What changed across the three scenarios, and why does it matter?",
          multiline: true,
          required: true,
        },
      ],
    },

    {
      id: "systems-05",
      week: 3,
      phase: "LAUNCH",
      title: "Improve one weak assumption",

      description:
        "Find something unrealistic in V1 and use evidence to make V2 stronger.",

      output: "V1 → V2 evidence",

      why:
        "Iteration is stronger evidence than merely finishing. It shows that testing changed your engineering thinking.",

      evidenceFields: [
        {
          key: "weakness",
          label: "V1 WEAKNESS",
          placeholder:
            "What assumption, rule, or model behavior was too simple or unrealistic?",
          multiline: true,
          required: true,
        },
        {
          key: "evidence",
          label: "EVIDENCE THAT EXPOSED IT",
          placeholder:
            "Which test, graph, comparison, or observation showed the problem?",
          multiline: true,
          required: true,
        },
        {
          key: "revision",
          label: "V2 REVISION",
          placeholder:
            "What exactly did you change?",
          multiline: true,
          required: true,
        },
        {
          key: "impact",
          label: "WHAT CHANGED AFTER THE REVISION?",
          placeholder:
            "How did the results or behavior improve?",
          multiline: true,
          required: true,
        },
      ],
    },

    {
      id: "systems-06",
      week: 3,
      phase: "LAUNCH",
      title: "Publish the engineering story",

      description:
        "Turn the build into evidence another person can understand and evaluate.",

      output: "GitHub + technical brief",

      why:
        "A project becomes useful for a portfolio, competition, club, research conversation, or college application only when someone else can understand what you did.",

      evidenceFields: [
        {
          key: "problem",
          label: "THE PROBLEM",
          placeholder:
            "In 2–3 sentences, what engineering problem did you investigate?",
          multiline: true,
          required: true,
        },
        {
          key: "method",
          label: "WHAT YOU BUILT",
          placeholder:
            "Describe your simulator/model and how it works.",
          multiline: true,
          required: true,
        },
        {
          key: "result",
          label: "WHAT YOU DISCOVERED",
          placeholder:
            "What is the strongest result from your testing?",
          multiline: true,
          required: true,
        },
        {
          key: "limitation",
          label: "LIMITATION + NEXT STEP",
          placeholder:
            "What can your project not yet do, and what would you improve next?",
          multiline: true,
          required: true,
        },
        {
          key: "portfolio",
          label: "PUBLISHED PROJECT LINK",
          placeholder:
            "GitHub, portfolio page, Drive document, demo video...",
          required: true,
        },
      ],
    },
  ],
};

const genericPlan: BuildPlan = {
  project: "Aerospace Engineering Investigation",

  question:
    "Can you turn one aerospace question into something measurable, testable, and worth improving?",

  finalArtifact:
    "Working engineering artifact + test evidence + design iteration + portfolio-ready technical story",

  steps: [
    {
      id: "generic-01",
      week: 1,
      phase: "EXPLORE",
      title: "Define the engineering problem",
      description:
        "Choose one focused problem and identify the decision your project should help make.",
      output: "Engineering problem statement",
      why:
        "Strong engineering projects begin with a specific question, not a broad topic.",
      evidenceFields: [
        {
          key: "problem",
          label: "ENGINEERING QUESTION",
          placeholder: "What exactly are you trying to determine?",
          multiline: true,
          required: true,
        },
        {
          key: "importance",
          label: "WHY IT MATTERS",
          placeholder: "Why is this worth investigating?",
          multiline: true,
          required: true,
        },
        {
          key: "success",
          label: "SUCCESS CRITERIA",
          placeholder: "How will you know whether the design worked?",
          multiline: true,
          required: true,
        },
      ],
    },

    {
      id: "generic-02",
      week: 1,
      phase: "EXPLORE",
      title: "Map variables and constraints",
      description:
        "Identify what can change, what you will measure, and what limits the system.",
      output: "Variable map",
      why:
        "Variables turn an idea into something testable.",
      evidenceFields: [
        {
          key: "inputs",
          label: "INPUT VARIABLES",
          placeholder: "What can you change?",
          multiline: true,
          required: true,
        },
        {
          key: "outputs",
          label: "OUTPUT METRICS",
          placeholder: "What will you measure?",
          multiline: true,
          required: true,
        },
        {
          key: "constraints",
          label: "CONSTRAINTS",
          placeholder: "What limits the design?",
          multiline: true,
          required: true,
        },
      ],
    },

    {
      id: "generic-03",
      week: 2,
      phase: "BUILD",
      title: "Build version 1",
      description:
        "Create the smallest working model, simulation, CAD design, or analysis.",
      output: "Working V1",
      why:
        "A small working model produces more evidence than a large unfinished idea.",
      evidenceFields: [
        {
          key: "tool",
          label: "BUILD TOOL",
          placeholder: "Python, CAD, JavaScript, spreadsheet...",
          required: true,
        },
        {
          key: "build",
          label: "WHAT WORKS IN V1?",
          placeholder: "Describe the current working version.",
          multiline: true,
          required: true,
        },
        {
          key: "link",
          label: "PROJECT LOCATION",
          placeholder: "GitHub link, filename, Drive link...",
          required: true,
        },
      ],
    },

    {
      id: "generic-04",
      week: 2,
      phase: "BUILD",
      title: "Test the design",
      description:
        "Run multiple conditions and record what happens.",
      output: "Test evidence",
      why:
        "Engineering claims need evidence.",
      evidenceFields: [
        {
          key: "test1",
          label: "TEST 01",
          placeholder: "Condition + result",
          multiline: true,
          required: true,
        },
        {
          key: "test2",
          label: "TEST 02",
          placeholder: "Condition + result",
          multiline: true,
          required: true,
        },
        {
          key: "finding",
          label: "KEY FINDING",
          placeholder: "What did the tests reveal?",
          multiline: true,
          required: true,
        },
      ],
    },

    {
      id: "generic-05",
      week: 3,
      phase: "LAUNCH",
      title: "Improve version 2",
      description:
        "Use evidence to make one meaningful revision.",
      output: "V1 → V2 evidence",
      why:
        "Iteration demonstrates engineering judgment.",
      evidenceFields: [
        {
          key: "weakness",
          label: "V1 WEAKNESS",
          placeholder: "What needed improvement?",
          multiline: true,
          required: true,
        },
        {
          key: "change",
          label: "V2 CHANGE",
          placeholder: "What did you change and why?",
          multiline: true,
          required: true,
        },
        {
          key: "result",
          label: "NEW RESULT",
          placeholder: "What improved?",
          multiline: true,
          required: true,
        },
      ],
    },

    {
      id: "generic-06",
      week: 3,
      phase: "LAUNCH",
      title: "Package the project",
      description:
        "Turn the project into something another person can evaluate.",
      output: "Portfolio-ready project",
      why:
        "Documentation turns private work into visible evidence.",
      evidenceFields: [
        {
          key: "summary",
          label: "PROJECT SUMMARY",
          placeholder: "Problem → method → result",
          multiline: true,
          required: true,
        },
        {
          key: "limitation",
          label: "LIMITATION",
          placeholder: "What does your project not yet prove?",
          multiline: true,
          required: true,
        },
        {
          key: "next",
          label: "NEXT STEP",
          placeholder: "What would you build or test next?",
          multiline: true,
          required: true,
        },
        {
          key: "link",
          label: "PUBLISHED LINK",
          placeholder: "GitHub, portfolio, technical brief...",
          required: true,
        },
      ],
    },
  ],
};

function BuildWing({
  wingId,
  wingName,
  onBack,
}: BuildWingProps) {
  const plan =
    wingId === "systems"
      ? systemsPlan
      : genericPlan;

  /*
    New storage key on purpose.
    Old click-only completion data does not count as evidence.
  */
  const storageKey = `altwing-evidence-v1-${wingId}`;

  const [evidence, setEvidence] =
    useState<EvidenceStore>(() => {
      try {
        const saved =
          localStorage.getItem(storageKey);

        if (!saved) {
          return {};
        }

        const parsed = JSON.parse(saved);

        return parsed &&
          typeof parsed === "object"
          ? parsed
          : {};
      } catch {
        return {};
      }
    });

  const [activeStepId, setActiveStepId] =
    useState(plan.steps[0].id);

  const [draft, setDraft] =
    useState<EvidenceRecord>(() => {
      return (
        evidence[plan.steps[0].id] ??
        {}
      );
    });

  const activeStep =
    plan.steps.find(
      (step) =>
        step.id === activeStepId,
    ) ?? plan.steps[0];

  const completedCount =
    plan.steps.filter(
      (step) =>
        evidence[step.id] &&
        Object.keys(
          evidence[step.id],
        ).length > 0,
    ).length;

  const progress = Math.round(
    (completedCount /
      plan.steps.length) *
      100,
  );

  const requiredFields =
    activeStep.evidenceFields.filter(
      (field) =>
        field.required !== false,
    );

  const canSave =
    requiredFields.every(
      (field) =>
        Boolean(
          draft[field.key]?.trim(),
        ),
    );

  const isSaved =
    Boolean(evidence[activeStep.id]);

  function openStep(
    step: BuildStep,
  ) {
    setActiveStepId(step.id);

    setDraft(
      evidence[step.id] ?? {},
    );

    window.setTimeout(() => {
      document
        .getElementById(
          "evidence-workspace",
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 20);
  }

  function updateField(
    key: string,
    value: string,
  ) {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function saveEvidence() {
    if (!canSave) {
      return;
    }

    const next: EvidenceStore = {
      ...evidence,
      [activeStep.id]: draft,
    };

    setEvidence(next);

    localStorage.setItem(
      storageKey,
      JSON.stringify(next),
    );
  }

  function resetEvidence() {
    const confirmed =
      window.confirm(
        "Reset all saved Build My Wing evidence for this Wing?",
      );

    if (!confirmed) {
      return;
    }

    localStorage.removeItem(
      storageKey,
    );

    setEvidence({});
    setActiveStepId(
      plan.steps[0].id,
    );
    setDraft({});
  }

  return (
    <main className="build-wing">
      <header className="build-wing-nav">
        <button
          type="button"
          onClick={onBack}
        >
          ← Back to WingMatch
        </button>

        <strong>
          Alt<span>Wing</span>
        </strong>
      </header>

      <section className="build-wing-hero">
        <span className="build-kicker">
          PUT ON YOUR WING
        </span>

        <h1>{wingName}</h1>

        <p>
          You discovered how you
          engineer. Now turn that
          signal into evidence.
        </p>

        <div className="build-project-card">
          <div>
            <span>
              YOUR 3-WEEK BUILD
            </span>

            <h2>{plan.project}</h2>

            <p>{plan.question}</p>
          </div>

          <div className="build-progress">
            <strong>
              {progress}%
            </strong>

            <span>
              {completedCount} /{" "}
              {plan.steps.length}{" "}
              evidence checkpoints
            </span>

            <div>
              <i
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="build-workbench">
        <aside className="build-checkpoints">
          <div className="build-section-heading">
            <span>
              01 / BUILD PATH
            </span>

            <h2>
              Your three-week flight
              plan
            </h2>

            <p>
              A checkpoint only
              counts after evidence
              is saved.
            </p>
          </div>

          <div className="build-step-list">
            {plan.steps.map(
              (step, index) => {
                const done =
                  Boolean(
                    evidence[
                      step.id
                    ],
                  );

                const active =
                  step.id ===
                  activeStep.id;

                return (
                  <button
                    key={step.id}
                    type="button"
                    className={[
                      "build-step",
                      done
                        ? "build-step--done"
                        : "",
                      active
                        ? "build-step--active"
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() =>
                      openStep(step)
                    }
                  >
                    <div className="build-step-number">
                      {done
                        ? "✓"
                        : String(
                            index + 1,
                          ).padStart(
                            2,
                            "0",
                          )}
                    </div>

                    <div className="build-step-main">
                      <span>
                        WEEK{" "}
                        {String(
                          step.week,
                        ).padStart(
                          2,
                          "0",
                        )}{" "}
                        / {step.phase}
                      </span>

                      <h3>
                        {step.title}
                      </h3>

                      <p>
                        {
                          step.description
                        }
                      </p>

                      <strong>
                        OUTPUT →{" "}
                        {step.output}
                      </strong>
                    </div>
                  </button>
                );
              },
            )}
          </div>
        </aside>

        <section
          className="evidence-workspace"
          id="evidence-workspace"
        >
          <div className="evidence-topline">
            <div>
              <span>
                CHECKPOINT{" "}
                {String(
                  plan.steps.findIndex(
                    (step) =>
                      step.id ===
                      activeStep.id,
                  ) + 1,
                ).padStart(2, "0")}
              </span>

              <strong>
                {isSaved
                  ? "EVIDENCE SAVED"
                  : "IN PROGRESS"}
              </strong>
            </div>
          </div>

          <div className="evidence-heading">
            <span>
              {activeStep.phase} /
              ENGINEERING EVIDENCE
            </span>

            <h2>
              {activeStep.title}
            </h2>

            <p>
              {
                activeStep.description
              }
            </p>
          </div>

          <div className="evidence-why">
            <span>
              WHY THIS MATTERS
            </span>

            <p>{activeStep.why}</p>
          </div>

          <div className="evidence-form">
            {activeStep.evidenceFields.map(
              (field) => (
                <label
                  key={field.key}
                  className="evidence-field"
                >
                  <span>
                    {field.label}

                    {field.required !==
                      false && (
                      <b>*</b>
                    )}
                  </span>

                  {field.multiline ? (
                    <textarea
                      value={
                        draft[
                          field.key
                        ] ?? ""
                      }
                      placeholder={
                        field.placeholder
                      }
                      onChange={(
                        event,
                      ) =>
                        updateField(
                          field.key,
                          event.target
                            .value,
                        )
                      }
                    />
                  ) : (
                    <input
                      type="text"
                      value={
                        draft[
                          field.key
                        ] ?? ""
                      }
                      placeholder={
                        field.placeholder
                      }
                      onChange={(
                        event,
                      ) =>
                        updateField(
                          field.key,
                          event.target
                            .value,
                        )
                      }
                    />
                  )}
                </label>
              ),
            )}
          </div>

          <div className="evidence-save-area">
            <div>
              <span>
                REQUIRED EVIDENCE
              </span>

              <p>
                Complete every
                required field before
                this checkpoint can
                count.
              </p>
            </div>

            <button
              type="button"
              disabled={!canSave}
              onClick={saveEvidence}
            >
              {isSaved
                ? "Update evidence"
                : "Save evidence"}
            </button>
          </div>

          {isSaved && (
            <div className="evidence-saved">
              <span>✓</span>

              <div>
                <strong>
                  Checkpoint evidence
                  saved
                </strong>

                <p>
                  This work now counts
                  toward your Build My
                  Wing progress.
                </p>
              </div>
            </div>
          )}
        </section>
      </section>

      <section className="build-finish">
        <span>
          WHAT YOU LEAVE WITH
        </span>

        <h2>
          Don't finish with a badge.
          Finish with evidence.
        </h2>

        <div className="build-evidence-grid">
          <article>
            <span>01</span>

            <strong>
              Working artifact
            </strong>

            <p>
              A simulation, model,
              CAD design, prototype,
              or analysis you can
              demonstrate.
            </p>
          </article>

          <article>
            <span>02</span>

            <strong>
              Test evidence
            </strong>

            <p>
              Data, graphs,
              screenshots, and
              comparisons showing
              what you investigated.
            </p>
          </article>

          <article>
            <span>03</span>

            <strong>
              Engineering iteration
            </strong>

            <p>
              Proof that testing
              changed the design from
              V1 to V2.
            </p>
          </article>

          <article>
            <span>04</span>

            <strong>
              Extracurricular
              evidence
            </strong>

            <p>
              Work that can grow into
              a portfolio, TSA,
              competition, research,
              or independent project.
            </p>
          </article>
        </div>

        <div className="build-final-artifact">
          <span>
            FINAL ARTIFACT
          </span>

          <strong>
            {plan.finalArtifact}
          </strong>
        </div>

        <div className="build-flow">
          BUILD
          <b>→</b>
          TEST
          <b>→</b>
          ITERATE
          <b>→</b>
          DOCUMENT
          <b>→</b>
          SHARE
        </div>

        {completedCount > 0 && (
          <button
            type="button"
            className="build-reset"
            onClick={resetEvidence}
          >
            Reset project evidence
          </button>
        )}
      </section>
    </main>
  );
}

export default BuildWing;