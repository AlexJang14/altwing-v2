interface LeadershipPlanProps {
  wingName: string;
  major: string;
  onBack: () => void;
}

const leadershipStages = [
  {
    number: "01",
    label: "CONTRIBUTE",
    title: "Become useful before chasing a title.",
    description:
      "Leadership usually starts with contribution. Learn the work, solve real problems, and become someone a team can rely on.",
    actions: [
      "Own one technical task instead of only attending meetings.",
      "Volunteer for work other students avoid.",
      "Document your contribution so others can build on it.",
    ],
    evidence:
      "Evidence: completed work, technical contribution, teammate feedback",
  },

  {
    number: "02",
    label: "OWN",
    title: "Take responsibility for an outcome.",
    description:
      "Move from helping with a project to being accountable for one part of its success.",
    actions: [
      "Take ownership of a subsystem, model, event, or deliverable.",
      "Set a deadline and define what success looks like.",
      "Solve problems without waiting for someone else to assign every step.",
    ],
    evidence:
      "Evidence: measurable responsibility + completed outcome",
  },

  {
    number: "03",
    label: "LEAD",
    title: "Help a team do better work.",
    description:
      "Leadership becomes stronger when your actions improve the performance of other people, not only your own résumé.",
    actions: [
      "Lead a small engineering or competition team.",
      "Assign roles based on strengths and keep the project moving.",
      "Run design reviews, testing sessions, or team check-ins.",
    ],
    evidence:
      "Evidence: team result + your specific leadership role",
  },

  {
    number: "04",
    label: "CREATE",
    title: "Build an opportunity that did not exist.",
    description:
      "Some of the strongest student leadership comes from identifying a real need and creating a useful response.",
    actions: [
      "Start an aerospace project group or technical initiative.",
      "Create a workshop, challenge, tool, platform, or student resource.",
      "Recruit collaborators instead of trying to do everything alone.",
    ],
    evidence:
      "Evidence: people served + product/program created + continued use",
  },

  {
    number: "05",
    label: "MULTIPLY",
    title: "Make your impact continue without you.",
    description:
      "The deepest form of leadership creates new leaders, systems, or opportunities that can continue after the founder steps away.",
    actions: [
      "Mentor younger students.",
      "Train the next project lead.",
      "Create documentation, systems, or curriculum others can reuse.",
    ],
    evidence:
      "Evidence: students mentored + successors trained + sustained program",
  },
];

const impactExamples = [
  {
    weak: "Member of engineering club",
    strong:
      "Led a 5-student design team through prototype testing and V1 → V2 iteration.",
  },
  {
    weak: "Founder of aerospace club",
    strong:
      "Founded an aerospace project group, recruited 18 students, and launched 3 student-led engineering builds.",
  },
  {
    weak: "Volunteered as mentor",
    strong:
      "Mentored 6 younger students through engineering projects and trained 2 students to become future mentors.",
  },
];

function LeadershipPlan({
  wingName,
  major,
  onBack,
}: LeadershipPlanProps) {
  return (
    <main className="leadership-shell">
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

      <section className="leadership-hero">
        <span className="path-kicker">
          03 / LEADERSHIP
        </span>

        <h1>
          Don't chase titles.
          <br />
          Create impact.
        </h1>

        <p>
          A student exploring{" "}
          <strong>{major}</strong> through the{" "}
          <strong>{wingName}</strong> Wing can build
          leadership by taking increasing responsibility
          for people, projects, and opportunities.
        </p>
      </section>

      <section className="leadership-path-strip">
        <span>CONTRIBUTE</span>
        <b>→</b>
        <span>OWN</span>
        <b>→</b>
        <span>LEAD</span>
        <b>→</b>
        <span>CREATE</span>
        <b>→</b>
        <span>MULTIPLY</span>
      </section>

      <section className="leadership-stages">
        {leadershipStages.map((stage) => (
          <article
            key={stage.label}
            className="leadership-stage"
          >
            <div className="leadership-stage-number">
              {stage.number}
            </div>

            <div className="leadership-stage-main">
              <span>{stage.label}</span>

              <h2>{stage.title}</h2>

              <p>{stage.description}</p>

              <ul>
                {stage.actions.map((action) => (
                  <li key={action}>
                    {action}
                  </li>
                ))}
              </ul>

              <strong>
                {stage.evidence}
              </strong>
            </div>
          </article>
        ))}
      </section>

      <section className="leadership-proof">
        <div className="leadership-proof-heading">
          <span>
            LEADERSHIP EVIDENCE
          </span>

          <h2>
            Show what changed because
            you were there.
          </h2>

          <p>
            Titles are context. Impact is evidence.
            Whenever possible, describe what you created,
            improved, led, taught, or made possible.
          </p>
        </div>

        <div className="leadership-example-grid">
          {impactExamples.map((example) => (
            <article
              key={example.weak}
            >
              <span>WEAK</span>
              <p>{example.weak}</p>

              <b>↓</b>

              <span>STRONGER</span>
              <strong>
                {example.strong}
              </strong>
            </article>
          ))}
        </div>
      </section>

      <section className="leadership-metrics">
        <span>
          TRACK REAL IMPACT
        </span>

        <h2>
          Numbers matter when they are real.
        </h2>

        <div>
          <article>
            <strong>PEOPLE</strong>
            <p>
              Members recruited, students mentored,
              teammates led, users served.
            </p>
          </article>

          <article>
            <strong>OUTPUT</strong>
            <p>
              Projects completed, workshops run,
              resources created, prototypes shipped.
            </p>
          </article>

          <article>
            <strong>IMPROVEMENT</strong>
            <p>
              Participation growth, iteration results,
              performance gains, new opportunities created.
            </p>
          </article>

          <article>
            <strong>CONTINUITY</strong>
            <p>
              Successors trained, systems documented,
              programs that continue beyond one student.
            </p>
          </article>
        </div>
      </section>

      <section className="leadership-rule">
        <span>
          ALTWING LEADERSHIP RULE
        </span>

        <h2>
          Lead something worth leading.
        </h2>

        <p>
          The goal is not to manufacture a title for a
          college application. Find a problem you genuinely
          care about, create value for other people, and keep
          enough evidence to show what you actually changed.
        </p>
      </section>
    </main>
  );
}

export default LeadershipPlan;
