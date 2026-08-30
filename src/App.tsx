import { useState } from "react";
import "./App.css";
import MissionPreview from "./components/MissionPreview";
import WingMatchMission from "./features/wingmatch/engine/WingMatchMission";
import PreFlightBriefing from "./features/wingmatch/briefing/PreFlightBriefing";
import MyUniversePage from "./features/progression/MyUniversePage";

type AppView = "home" | "preflight" | "wingmatch" | "universe";

function App() {
  const [view, setView] = useState<AppView>("home");

  if (view === "preflight") {
    return (
      <PreFlightBriefing
        onBack={() =>
          setView("home")
        }
        onStart={() =>
          setView("wingmatch")
        }
      />
    );
  }

  if (view === "universe") {
    return (
      <MyUniversePage
        onBack={() =>
          setView("home")
        }
        onStartMission={() =>
          setView("preflight")
        }
      />
    );
  }

  if (view === "wingmatch") {
    return (
      <WingMatchMission
        onExit={() => {
          setView("home");
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }}
      />
    );
  }

  return (
    <div className="app">
      <header className="site-header">
        <nav className="nav">
          <a
            className="brand"
            href="#top"
            aria-label="AltWing home"
          >
            <span className="brand-alt">
              Alt
            </span>
            <span className="brand-wing">
              Wing
            </span>
          </a>

          <div className="nav-links">
            <button
              type="button"
              className="nav-text-button"
              onClick={() =>
                setView("preflight")
              }
            >
              Find My Wing
            </button>

            <a href="#journey">
              Explore
            </a>

            <button
              type="button"
              className="nav-launch"
              onClick={() =>
                setView("universe")
              }
            >
              My Universe
            </button>
          </div>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <div>
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              Aerospace exploration for
              high-school students
            </div>

            <h1>
              Don&apos;t choose a career.
              <br />
              <span className="hero-highlight">
                Test one.
              </span>
            </h1>

            <p className="hero-copy">
              Step inside realistic aerospace
              decisions, discover how you solve
              problems, build something real,
              and turn that experience into your
              next academic move.
            </p>

            <div className="hero-actions">
              <button
                type="button"
                className="button button-primary"
                onClick={() =>
                  setView("preflight")
                }
              >
                Find My Wing
              </button>

              <a
                className="button button-secondary"
                href="#journey"
              >
                Explore Aerospace
              </a>
            </div>

            <p className="hero-note">
              Explore. Build. Launch. — no
              personality test required.
            </p>
          </div>

          <button
            type="button"
            className="mission-preview-button"
            onClick={() =>
              setView("preflight")
            }
            aria-label="Launch Mars descent WingMatch mission"
          >
            <MissionPreview />
          </button>
        </section>

        <section className="simple-gateway">
          <div className="simple-gateway-heading">
            <span>
              START HERE
            </span>

            <h2>
              Three ways into AltWing.
            </h2>

            <p>
              Play first, browse aerospace,
              or open everything you&apos;ve
              already earned.
            </p>
          </div>

          <div className="simple-gateway-grid">
            <button
              type="button"
              className="gateway-card gateway-card-main"
              onClick={() =>
                setView("preflight")
              }
            >
              <span>🚀</span>

              <div>
                <small>
                  RECOMMENDED
                </small>

                <strong>
                  Find My Wing
                </strong>

                <p>
                  Play a five-minute
                  aerospace mission.
                </p>
              </div>

              <b>→</b>
            </button>

            <a
              className="gateway-card"
              href="#journey"
            >
              <span>◉</span>

              <div>
                <small>
                  FOR EVERYONE
                </small>

                <strong>
                  Explore Aerospace
                </strong>

                <p>
                  Careers, engineering
                  paths, projects, and
                  colleges.
                </p>
              </div>

              <b>→</b>
            </a>

            <button
              type="button"
              className="gateway-card"
              onClick={() =>
                setView("universe")
              }
            >
              <span>🐧</span>

              <div>
                <small>
                  YOUR PROGRESS
                </small>

                <strong>
                  My Universe
                </strong>

                <p>
                  Level, impact,
                  Cosmic Atlas, and
                  discoveries.
                </p>
              </div>

              <b>→</b>
            </button>
          </div>
        </section>

        <section
          className="journey-section"
          id="journey"
        >
          <div className="journey-inner">
            <div className="section-label">
              The AltWing Loop
            </div>

            <h2>
              Career exploration should end
              with evidence, not a label.
            </h2>

            <p className="journey-intro">
              AltWing moves from curiosity to
              action. Discover how you think,
              build proof, and use that evidence
              to make better academic and
              college decisions.
            </p>

            <div className="journey-grid">
              <article className="journey-card">
                <div className="journey-number">
                  01 / EXPLORE
                </div>

                <h3>
                  Test how you think.
                </h3>

                <p>
                  Make decisions inside an
                  aerospace mission and reveal
                  the engineering instincts
                  behind them.
                </p>
              </article>

              <article className="journey-card">
                <div className="journey-number">
                  02 / BUILD
                </div>

                <h3>
                  Turn curiosity into work.
                </h3>

                <p>
                  Take your Wing into a
                  structured technical build
                  instead of stopping at a
                  career recommendation.
                </p>
              </article>

              <article className="journey-card">
                <div className="journey-number">
                  03 / PROVE
                </div>

                <h3>
                  Leave evidence.
                </h3>

                <p>
                  Test, iterate, document, and
                  turn your work into portfolio
                  evidence another person can
                  actually inspect.
                </p>
              </article>

              <article className="journey-card">
                <div className="journey-number">
                  04 / PLAN
                </div>

                <h3>
                  Build your runway.
                </h3>

                <p>
                  Connect the evidence to
                  courses, activities,
                  leadership, and colleges that
                  fit the direction you are
                  testing.
                </p>
              </article>

              <article className="journey-card">
                <div className="journey-number">
                  05 / LAUNCH
                </div>

                <h3>
                  Know what comes next.
                </h3>

                <p>
                  Build a college shortlist,
                  compare readiness, and leave
                  with a focused 90-day action
                  plan.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section
          className="outcomes-section"
          id="build"
        >
          <div className="home-section-shell">
            <div className="section-label">
              What You Leave With
            </div>

            <div className="home-section-heading">
              <h2>
                Not another result screen.
                <br />
                A body of work.
              </h2>

              <p>
                Every stage is designed to leave
                behind something useful for your
                next project, activity, or
                college-planning decision.
              </p>
            </div>

            <div className="outcomes-grid">
              <article className="outcome-card">
                <span>01</span>
                <h3>
                  Engineering Evidence
                </h3>
                <p>
                  Constraints, testing,
                  iteration, reflection, and a
                  final technical artifact.
                </p>
              </article>

              <article className="outcome-card">
                <span>02</span>
                <h3>
                  Project Portfolio
                </h3>
                <p>
                  Evidence turned into a project
                  description, activity draft,
                  résumé bullet, and exportable
                  portfolio.
                </p>
              </article>

              <article className="outcome-card">
                <span>03</span>
                <h3>
                  Academic Runway
                </h3>
                <p>
                  Courses and preparation
                  priorities connected to the
                  technical direction you are
                  exploring.
                </p>
              </article>

              <article className="outcome-card">
                <span>04</span>
                <h3>
                  Leadership Path
                </h3>
                <p>
                  Move from simply participating
                  to owning outcomes, creating
                  opportunities, and helping
                  others.
                </p>
              </article>

              <article className="outcome-card">
                <span>05</span>
                <h3>
                  College Shortlist
                </h3>
                <p>
                  Save aerospace programs,
                  understand different admission
                  contexts, and compare schools
                  that actually fit.
                </p>
              </article>

              <article className="outcome-card">
                <span>06</span>
                <h3>
                  90-Day Strategy
                </h3>
                <p>
                  Combine overlapping needs
                  across your shortlist into a
                  small number of high-leverage
                  next actions.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="why-section">
          <div className="home-section-shell">
            <div className="section-label">
              Why AltWing Exists
            </div>

            <div className="why-grid">
              <div className="why-copy">
                <h2>
                  Students are asked to choose
                  a future before they have had
                  a chance to test one.
                </h2>

                <p>
                  Career quizzes can help start
                  a conversation. The problem is
                  when the experience ends with
                  a label.
                </p>

                <p>
                  AltWing asks a different
                  question: what happens if a
                  student can try the work,
                  create evidence, and use what
                  they learn to decide what to
                  do next?
                </p>
              </div>

              <div className="why-contrast">
                <article>
                  <span>
                    TYPICAL CAREER QUIZ
                  </span>

                  <strong>
                    Answer
                    <b> → </b>
                    Match
                    <b> → </b>
                    Result
                  </strong>

                  <p>
                    Useful signal. Often no
                    pathway to actually test it.
                  </p>
                </article>

                <article className="why-altwing">
                  <span>
                    ALTWING
                  </span>

                  <strong>
                    Explore
                    <b> → </b>
                    Build
                    <b> → </b>
                    Prove
                    <b> → </b>
                    Plan
                    <b> → </b>
                    Launch
                  </strong>

                  <p>
                    A signal becomes work,
                    evidence, and a next move.
                  </p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="founder-section">
          <div className="home-section-shell">
            <div className="founder-grid">
              <div className="founder-copy">
                <div className="section-label">
                  Student-Built / Founder
                </div>

                <h2>
                  Built from the problem
                  it was created to solve.
                </h2>

                <p>
                  AltWing was designed and built
                  by a high-school student
                  exploring aerospace and
                  confronting the same problem:
                  knowing what sounds interesting
                  is not the same as knowing
                  whether you want to do the work.
                </p>

                <p>
                  The goal became bigger than
                  finding one career: build a
                  system other students can use
                  to explore, create evidence,
                  and make their next decision
                  from experience.
                </p>
              </div>

              <div className="founder-proof">
                <article>
                  <span>
                    01 / PROBLEM
                  </span>

                  <h3>
                    Career guidance often stops
                    before action begins.
                  </h3>
                </article>

                <article>
                  <span>
                    02 / BUILD
                  </span>

                  <h3>
                    Turned that gap into an
                    end-to-end student product.
                  </h3>
                </article>

                <article>
                  <span>
                    03 / LEADERSHIP
                  </span>

                  <h3>
                    Build something useful,
                    invite others into it, and
                    improve it from evidence.
                  </h3>
                </article>

                <article>
                  <span>
                    04 / NEXT
                  </span>

                  <h3>
                    Pilot AltWing with real
                    students and measure what
                    actually helps.
                  </h3>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section
          className="launch-section"
          id="college-launch"
        >
          <div className="home-section-shell">
            <div className="launch-panel">
              <div>
                <div className="section-label">
                  Ready to Test a Wing?
                </div>

                <h2>
                  Find your Wing.
                  <br />
                  Then build the proof.
                </h2>

                <p>
                  Start with the mission. Leave
                  with evidence and a direction
                  you have actually tested.
                </p>
              </div>

              <button
                type="button"
                className="button button-primary"
                onClick={() =>
                  setView("preflight")
                }
              >
                Find My Wing →
              </button>
            </div>

            <p className="launch-note">
              No personality test required.
              No fake admission probability.
              Your work stays at the center.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
