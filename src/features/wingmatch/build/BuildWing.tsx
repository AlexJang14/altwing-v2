import { useState } from "react";
import "./build-wing.css";

interface BuildWingProps {
  wingId: string;
  wingName: string;
  onBack: () => void;
}

interface BuildStep {
  id: string;
  week: number;
  phase: "EXPLORE" | "BUILD" | "LAUNCH";
  title: string;
  description: string;
  output: string;
}

interface BuildPlan {
  project: string;
  question: string;
  finalArtifact: string;
  steps: BuildStep[];
}

const plans: Record<string, BuildPlan> = {
  systems: {
    project: "Mission Tradeoff Simulator",

    question:
      "How should a spacecraft distribute limited mass, power, thermal margin, and mission resources when improving one system creates a cost somewhere else?",

    finalArtifact:
      "Interactive mission simulator + scenario tests + V1 → V2 comparison + technical brief",

    steps: [
      {
        id: "systems-01",
        week: 1,
        phase: "EXPLORE",
        title: "Define the mission constraints",
        description:
          "Choose four competing mission factors such as mass, power, thermal margin, reliability, science value, or cost.",
        output: "Mission constraint map",
      },
      {
        id: "systems-02",
        week: 1,
        phase: "EXPLORE",
        title: "Create the tradeoff rules",
        description:
          "Define how changing one factor affects at least one other factor. Make a perfect solution impossible.",
        output: "Tradeoff model",
      },
      {
        id: "systems-03",
        week: 2,
        phase: "BUILD",
        title: "Build simulator V1",
        description:
          "Use JavaScript, Python, or a spreadsheet to let a user change mission decisions and see the consequences.",
        output: "Working simulator",
      },
      {
        id: "systems-04",
        week: 2,
        phase: "BUILD",
        title: "Run three mission scenarios",
        description:
          "Test three different mission priorities and compare how the recommended design changes.",
        output: "Scenario comparison",
      },
      {
        id: "systems-05",
        week: 3,
        phase: "LAUNCH",
        title: "Improve one weak assumption",
        description:
          "Find one unrealistic rule in V1, revise it, and show how the result changes.",
        output: "V1 → V2 evidence",
      },
      {
        id: "systems-06",
        week: 3,
        phase: "LAUNCH",
        title: "Publish the engineering story",
        description:
          "Document the problem, model, tests, tradeoffs, limitation, and next engineering question.",
        output: "GitHub + technical brief",
      },
    ],
  },

  gnc: {
    project: "Lander Control Simulator",

    question:
      "How can a lander correct its motion quickly without creating dangerous overshoot or oscillation?",

    finalArtifact:
      "Control simulator + response graphs + controller comparison + technical brief",

    steps: [
      {
        id: "gnc-01",
        week: 1,
        phase: "EXPLORE",
        title: "Define the vehicle response",
        description:
          "Choose one variable such as pitch angle or altitude and define the target state the vehicle must reach.",
        output: "Simple vehicle model",
      },
      {
        id: "gnc-02",
        week: 1,
        phase: "EXPLORE",
        title: "Choose performance metrics",
        description:
          "Track error, overshoot, settling time, and control effort.",
        output: "Control metric sheet",
      },
      {
        id: "gnc-03",
        week: 2,
        phase: "BUILD",
        title: "Build controller V1",
        description:
          "Create a simplified feedback controller and graph the vehicle response.",
        output: "Working controller",
      },
      {
        id: "gnc-04",
        week: 2,
        phase: "BUILD",
        title: "Test multiple gains",
        description:
          "Compare slow, balanced, and aggressive responses under the same starting condition.",
        output: "Response comparison",
      },
      {
        id: "gnc-05",
        week: 3,
        phase: "LAUNCH",
        title: "Improve controller V2",
        description:
          "Use your test evidence to improve stability or response time.",
        output: "V1 → V2 comparison",
      },
      {
        id: "gnc-06",
        week: 3,
        phase: "LAUNCH",
        title: "Publish the experiment",
        description:
          "Explain the model, tests, design decision, limitations, and next experiment.",
        output: "GitHub + technical brief",
      },
    ],
  },
};

const defaultPlan: BuildPlan = {
  project: "Aerospace Engineering Investigation",

  question:
    "Can you turn one aerospace question into something measurable, testable, and worth improving?",

  finalArtifact:
    "Working engineering artifact + test evidence + iteration + portfolio-ready project page",

  steps: [
    {
      id: "default-01",
      week: 1,
      phase: "EXPLORE",
      title: "Define the engineering question",
      description:
        "Choose one specific aerospace problem and write the decision your project should help make.",
      output: "Engineering question",
    },
    {
      id: "default-02",
      week: 1,
      phase: "EXPLORE",
      title: "Map variables and constraints",
      description:
        "Identify what you can change, what you will measure, and what limits the system.",
      output: "Variable + constraint map",
    },
    {
      id: "default-03",
      week: 2,
      phase: "BUILD",
      title: "Build version 1",
      description:
        "Create the smallest simulation, CAD model, analysis, or prototype that can test your idea.",
      output: "Working V1",
    },
    {
      id: "default-04",
      week: 2,
      phase: "BUILD",
      title: "Run comparison tests",
      description:
        "Change important inputs and collect evidence showing how the system responds.",
      output: "Test evidence",
    },
    {
      id: "default-05",
      week: 3,
      phase: "LAUNCH",
      title: "Improve version 2",
      description:
        "Use the evidence to make one meaningful engineering revision.",
      output: "V1 → V2 comparison",
    },
    {
      id: "default-06",
      week: 3,
      phase: "LAUNCH",
      title: "Package the project",
      description:
        "Explain the problem, method, evidence, result, limitation, and next step.",
      output: "Portfolio-ready project",
    },
  ],
};

function BuildWing({
  wingId,
  wingName,
  onBack,
}: BuildWingProps) {
  const plan = plans[wingId] ?? defaultPlan;

  const storageKey = `altwing-build-${wingId}`;

  const [completed, setCompleted] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);

      if (!saved) {
        return [];
      }

      const parsed = JSON.parse(saved);

      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  function toggleStep(stepId: string) {
    setCompleted((current) => {
      const next = current.includes(stepId)
        ? current.filter((id) => id !== stepId)
        : [...current, stepId];

      localStorage.setItem(storageKey, JSON.stringify(next));

      return next;
    });
  }

  const progress = Math.round(
    (completed.length / plan.steps.length) * 100,
  );

  return (
    <main className="build-wing">
      <header className="build-wing-nav">
        <button type="button" onClick={onBack}>
          ← Back to WingMatch
        </button>

        <strong>
          Alt<span>Wing</span>
        </strong>
      </header>

      <section className="build-wing-hero">
        <span className="build-kicker">PUT ON YOUR WING</span>

        <h1>{wingName}</h1>

        <p>
          You discovered how you engineer. Now turn that signal into
          evidence.
        </p>

        <div className="build-project-card">
          <div>
            <span>YOUR 3-WEEK BUILD</span>

            <h2>{plan.project}</h2>

            <p>{plan.question}</p>
          </div>

          <div className="build-progress">
            <strong>{progress}%</strong>

            <span>
              {completed.length} / {plan.steps.length} checkpoints
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

      <section className="build-steps">
        {plan.steps.map((step, index) => {
          const done = completed.includes(step.id);

          return (
            <button
              key={step.id}
              type="button"
              className={`build-step ${
                done ? "build-step--done" : ""
              }`}
              onClick={() => toggleStep(step.id)}
            >
              <div className="build-step-number">
                {done ? "✓" : String(index + 1).padStart(2, "0")}
              </div>

              <div className="build-step-main">
                <span>
                  WEEK {String(step.week).padStart(2, "0")} /{" "}
                  {step.phase}
                </span>

                <h3>{step.title}</h3>

                <p>{step.description}</p>

                <strong>OUTPUT → {step.output}</strong>
              </div>
            </button>
          );
        })}
      </section>

      <section className="build-finish">
        <span>WHAT YOU LEAVE WITH</span>

        <h2>Don't finish with a badge. Finish with evidence.</h2>

        <div className="build-evidence">
          <article>
            <span>01</span>
            <strong>Working artifact</strong>
            <p>
              A simulation, model, CAD design, prototype, or analysis
              you can actually demonstrate.
            </p>
          </article>

          <article>
            <span>02</span>
            <strong>Test evidence</strong>
            <p>
              Data, graphs, screenshots, comparisons, or experiments
              showing what you investigated.
            </p>
          </article>

          <article>
            <span>03</span>
            <strong>Engineering iteration</strong>
            <p>
              Evidence that testing changed your design from V1 to V2.
            </p>
          </article>

          <article>
            <span>04</span>
            <strong>Extracurricular evidence</strong>
            <p>
              A project that can grow into GitHub work, TSA, research,
              a competition, or a portfolio entry.
            </p>
          </article>
        </div>

        <div className="build-final-artifact">
          <span>FINAL ARTIFACT</span>
          <strong>{plan.finalArtifact}</strong>
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
      </section>
    </main>
  );
}

export default BuildWing;