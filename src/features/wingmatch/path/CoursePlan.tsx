interface CoursePlanProps {
  wingName: string;
  major: string;
  grade: number;
  onBack: () => void;
}

const courseGroups = [
  {
    label: "TOP PRIORITY",
    title: "Build the math + physics core",
    courses: [
      {
        name: "AP Physics C: Mechanics",
        level: "HIGH PRIORITY",
        why:
          "Calculus-based mechanics connects directly to aerospace dynamics, structures, forces, energy, and motion.",
      },
      {
        name: "AP Calculus BC",
        level: "HIGH PRIORITY",
        why:
          "Calculus is foundational for university-level aerospace engineering, physics, controls, and modeling.",
      },
      {
        name: "AP Physics C: Electricity & Magnetism",
        level: "STRONG",
        why:
          "Especially useful for avionics, spacecraft systems, sensors, power, and controls.",
      },
    ],
  },

  {
    label: "TECHNICAL DEPTH",
    title: "Add computing + engineering",
    courses: [
      {
        name: "AP Computer Science A",
        level: "STRONG",
        why:
          "Programming supports simulation, GNC, controls, optimization, data analysis, and technical projects.",
      },
      {
        name: "Engineering / Research",
        level: "STRONG",
        why:
          "A project-based engineering course can turn classroom knowledge into design, testing, and evidence.",
      },
      {
        name: "Astronomy / Space Science",
        level: "RELEVANT",
        why:
          "Useful for building domain knowledge and showing sustained interest in space-related questions.",
      },
    ],
  },

  {
    label: "IF AVAILABLE",
    title: "Go beyond the standard sequence",
    courses: [
      {
        name: "Multivariable Calculus",
        level: "ADVANCED",
        why:
          "Extends calculus into multiple dimensions and connects strongly with engineering analysis.",
      },
      {
        name: "Linear Algebra",
        level: "ADVANCED",
        why:
          "Important for controls, simulation, optimization, machine learning, and engineering computation.",
      },
      {
        name: "Dual Enrollment Engineering / Physics",
        level: "OPTION",
        why:
          "Can add rigor when your high school course sequence is already exhausted.",
      },
    ],
  },
];

function CoursePlan({
  wingName,
  major,
  grade,
  onBack,
}: CoursePlanProps) {
  return (
    <main className="course-shell">
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

      <section className="course-hero">
        <span className="path-kicker">
          01 / ACADEMIC RUNWAY
        </span>

        <h1>
          Take classes that
          <br />
          strengthen the story.
        </h1>

        <p>
          For a Grade {grade} student exploring{" "}
          <strong>{major}</strong> through the{" "}
          <strong>{wingName}</strong> Wing, the goal
          is not simply to collect AP classes. Build
          the strongest math, physics, computing, and
          engineering foundation available at your school.
        </p>
      </section>

      <section className="course-priority-banner">
        <div>
          <span>NEXT-YEAR PRIORITY</span>
          <strong>
            Calculus-based physics + advanced math
          </strong>
        </div>

        <p>
          Prioritize rigor that is relevant to the field
          rather than adding unrelated advanced classes
          only for the AP count.
        </p>
      </section>

      <section className="course-groups">
        {courseGroups.map((group) => (
          <article
            key={group.label}
            className="course-group"
          >
            <div className="course-group-heading">
              <span>{group.label}</span>
              <h2>{group.title}</h2>
            </div>

            <div className="course-list">
              {group.courses.map((course) => (
                <div
                  key={course.name}
                  className="course-item"
                >
                  <div className="course-item-title">
                    <h3>{course.name}</h3>
                    <span>{course.level}</span>
                  </div>

                  <p>{course.why}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="course-rule">
        <span>ALTWING RULE</span>

        <h2>
          Rigor matters.
          Context matters more.
        </h2>

        <p>
          Students should pursue challenging coursework
          available to them without assuming that every
          advanced course is required. Course availability,
          prerequisites, workload, grades, and the rest of
          the student's profile all matter.
        </p>
      </section>
    </main>
  );
}

export default CoursePlan;
