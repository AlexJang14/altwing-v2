interface ActivityPlanProps {
  wingName: string;
  major: string;
  onBack: () => void;
}

const activityPaths = [
  {
    stage: "JOIN",
    number: "01",
    title: "Find one technical community.",
    description:
      "Join a place where you can meet students with similar interests and gain access to teams, competitions, mentors, or equipment.",
    items: [
      {
        name: "TSA",
        fit: "HIGH FIT",
        why:
          "Strong fit for engineering design, competitions, technical teamwork, and eventually project leadership.",
      },
      {
        name: "Robotics / Engineering Club",
        fit: "HIGH FIT",
        why:
          "Useful for controls, mechanisms, coding, electronics, prototyping, and collaborative engineering.",
      },
      {
        name: "Astronomy / Space Club",
        fit: "RELEVANT",
        why:
          "Builds sustained space interest and can become more valuable if you create observations, projects, talks, or outreach.",
      },
      {
        name: "Science Olympiad / STEM Team",
        fit: "OPTION",
        why:
          "Can develop technical problem solving and competition experience when the events match your interests.",
      },
    ],
  },

  {
    stage: "BUILD",
    number: "02",
    title: "Create something that belongs to you.",
    description:
      "The strongest activity usually produces evidence. Build something you can test, explain, improve, and show.",
    items: [
      {
        name: "Wing Engineering Project",
        fit: "TOP PRIORITY",
        why:
          "Continue your AltWing project into a deeper technical build rather than starting another unrelated activity.",
      },
      {
        name: "GitHub Technical Project",
        fit: "STRONG",
        why:
          "Publish code, CAD, simulation results, documentation, testing, and iteration so others can inspect your work.",
      },
      {
        name: "Competition Entry",
        fit: "STRONG",
        why:
          "A competition gives your project a deadline, external requirements, and a reason to improve the work.",
      },
      {
        name: "Research-Style Investigation",
        fit: "ADVANCED",
        why:
          "Turn one engineering question into a measurable experiment, simulation, comparison, or technical paper.",
      },
    ],
  },

  {
    stage: "DEEPEN",
    number: "03",
    title: "Make one activity matter more.",
    description:
      "Depth is usually more valuable than adding another line to a résumé. Improve the quality, ownership, and reach of what you already do.",
    items: [
      {
        name: "Own a Technical Problem",
        fit: "IMPORTANT",
        why:
          "Become the person responsible for one real subsystem, model, design problem, or technical decision.",
      },
      {
        name: "Test and Iterate",
        fit: "IMPORTANT",
        why:
          "Document what failed, what changed, and why V2 is better than V1. That is much stronger evidence than simply finishing.",
      },
      {
        name: "Get External Feedback",
        fit: "STRONG",
        why:
          "Ask a teacher, engineer, mentor, or student team to review the work and use that critique to improve it.",
      },
      {
        name: "Share the Result",
        fit: "STRONG",
        why:
          "Present, publish, demonstrate, teach, or submit the work so it has a life outside your own laptop.",
      },
    ],
  },
];

function ActivityPlan({
  wingName,
  major,
  onBack,
}: ActivityPlanProps) {
  return (
    <main className="activity-shell">
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

      <section className="activity-hero">
        <span className="path-kicker">
          02 / ACTIVITY PLAN
        </span>

        <h1>
          Don't collect clubs.
          <br />
          Build momentum.
        </h1>

        <p>
          For a student exploring{" "}
          <strong>{major}</strong> through the{" "}
          <strong>{wingName}</strong> Wing, the goal is
          not to join every STEM organization. Choose a
          community, create evidence, and deepen the work
          until you have real ownership.
        </p>
      </section>

      <section className="activity-focus">
        <span>RECOMMENDED STRATEGY</span>

        <h2>
          One community + one serious build.
        </h2>

        <p>
          Three shallow STEM clubs are not automatically
          stronger than one activity where you design,
          test, contribute, and eventually lead.
        </p>
      </section>

      <section className="activity-paths">
        {activityPaths.map((path) => (
          <article
            key={path.stage}
            className="activity-stage"
          >
            <div className="activity-stage-heading">
              <span>{path.number} / {path.stage}</span>
              <h2>{path.title}</h2>
              <p>{path.description}</p>
            </div>

            <div className="activity-item-grid">
              {path.items.map((item) => (
                <div
                  key={item.name}
                  className="activity-item"
                >
                  <div>
                    <h3>{item.name}</h3>
                    <span>{item.fit}</span>
                  </div>

                  <p>{item.why}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="activity-next">
        <span>NEXT / LEADERSHIP</span>

        <h2>
          Participation is only the beginning.
        </h2>

        <p>
          Once you have something worth contributing to,
          the next question becomes: can you lead people,
          create an opportunity, teach others, or improve
          the community around the work?
        </p>

        <strong>
          JOIN → BUILD → DEEPEN → LEAD
        </strong>
      </section>
    </main>
  );
}

export default ActivityPlan;
