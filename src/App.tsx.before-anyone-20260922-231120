import { useState } from "react";
import "./App.css";
import MissionPreview from "./components/MissionPreview";
import WingMatchMission from "./features/wingmatch/v7/WingMatchV7";
import PreFlightBriefing from "./features/wingmatch/briefing/PreFlightBriefing";
import MyUniversePage from "./features/progression/MyUniversePage";
import PathDashboard from "./features/wingmatch/path/PathDashboard";
import SavedWingHomeCard from "./features/wingmatch/result/SavedWingHomeCard";
import HomeLaunchPad from "./features/home/HomeLaunchPad";

type AppView =
  | "home"
  | "preflight"
  | "wingmatch"
  | "path"
  | "universe";

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

  if (view === "path") {
    return (
      <PathDashboard
        wingName="Not selected yet"
        major="Aerospace Engineering"
        grade={0}
        onBack={() => {
          setView("home");

          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }}
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

            <button
              type="button"
              className="nav-text-button"
              onClick={() =>
                setView("path")
              }
            >
              Explore
            </button>

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
              FOR HIGH-SCHOOL STUDENTS CURIOUS ABOUT AEROSPACE
            </div>

            <h1>
              Don&apos;t choose a career.
              <br />
              <span className="hero-highlight">
                Test one.
              </span>
            </h1>

            <p className="hero-copy">
              Not sure what part of aerospace
              fits you? Start with a five-minute
              Mars mission. Discover a direction,
              try the work, build something real,
              and figure out what to do next for
              school, clubs, and college.
            </p>

            <div className="hero-actions">
              <button
                type="button"
                className="button button-primary"
                onClick={() =>
                  setView("preflight")
                }
              >
                Start WingMatch — 5 min
              </button>

              <button
                type="button"
                className="button button-secondary"
                onClick={() =>
                  setView("path")
                }
              >
                See How AltWing Works
              </button>
            </div>

            <p className="hero-note">
              No aerospace experience required.
              Start with curiosity.
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



        <section className="home-value-section">

          <div className="home-value-inner">

            <div className="home-value-heading">

              <span>
                WHY USE ALTWING?
              </span>

              <h2>
                Go from
                “space sounds cool”
                to
                “I actually tried it.”
              </h2>

              <p>
                You do not need to know
                aerospace before you start.
                That is the point.
              </p>

            </div>


            <div className="home-value-grid">

              <article>

                <b>01</b>

                <strong>
                  Find a direction.
                </strong>

                <p>
                  Try aerospace decisions
                  and see which kind of
                  engineering work feels
                  worth exploring further.
                </p>

              </article>


              <article>

                <b>02</b>

                <strong>
                  Try the work.
                </strong>

                <p>
                  Build a small project
                  instead of trusting a
                  career quiz or job title.
                </p>

              </article>


              <article>

                <b>03</b>

                <strong>
                  Know what to do next.
                </strong>

                <p>
                  Connect what you learned
                  to classes, clubs,
                  competitions, projects,
                  and college ideas.
                </p>

              </article>

            </div>

          </div>

        </section>


        <SavedWingHomeCard
          onOpenUniverse={() =>
            setView(
              "universe",
            )
          }
          onRetake={() =>
            setView(
              "preflight",
            )
          }
        />

        <HomeLaunchPad
          onStartWingMatch={() =>
            setView("preflight")
          }
          onOpenUniverse={() =>
            setView("universe")
          }
        />

        <section className="simple-gateway">
          <div className="simple-gateway-heading">
            <span>
              START HERE
            </span>

            <h2>
              Choose the easiest next step.
            </h2>

            <p>
              New here? Start with WingMatch.
              Already exploring aerospace?
              Browse paths or open your progress.
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
                  A five-minute Mars mission.
                  No aerospace knowledge needed.
                </p>
              </div>

              <b>→</b>
            </button>

            <button
              type="button"
              className="gateway-card"
              onClick={() =>
                setView("path")
              }
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
                  Academics, activities,
                  leadership, colleges,
                  readiness, and decisions.
                </p>
              </div>

              <b>→</b>
            </button>

            <button
              type="button"
              className="gateway-card"
              onClick={() =>
                setView("universe")
              }
            >
              <span className="gateway-penguin">
                <img
                  src="/brand/altwing-penguin.png"
                  alt=""
                />
              </span>

              <div>
                <small>
                  YOUR PROGRESS
                </small>

                <strong>
                  My Universe
                </strong>

                <p>
                  See your saved Wing,
                  projects, progress,
                  and discoveries.
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
              HOW ALTWING WORKS
            </div>

            <h2>
              Try it. Build it.
              Then decide.
            </h2>

            <p className="journey-intro">
              You do not have to choose your
              future before you have tried the
              work. Start small, learn from the
              experience, and use it to make
              your next decision.
            </p>

            <div className="journey-grid">
              <article className="journey-card">
                <div className="journey-number">
                  01 / EXPLORE
                </div>

                <h3>
                  Try a mission.
                </h3>

                <p>
                  Make real aerospace
                  tradeoffs and notice which
                  problems you want to keep
                  solving.
                </p>
              </article>

              <article className="journey-card">
                <div className="journey-number">
                  02 / BUILD
                </div>

                <h3>
                  Build something small.
                </h3>

                <p>
                  Follow a beginner-friendly
                  project and experience what
                  the work is actually like.
                </p>
              </article>

              <article className="journey-card">
                <div className="journey-number">
                  03 / PROVE
                </div>

                <h3>
                  Keep what you made.
                </h3>

                <p>
                  Save your design,
                  screenshots, results, and
                  improvements so you have
                  something real to show.
                </p>
              </article>

              <article className="journey-card">
                <div className="journey-number">
                  04 / PLAN
                </div>

                <h3>
                  Choose your next move.
                </h3>

                <p>
                  Find classes, clubs,
                  activities, and colleges that
                  connect to the direction you
                  just tested.
                </p>
              </article>

              <article className="journey-card">
                <div className="journey-number">
                  05 / LAUNCH
                </div>

                <h3>
                  Take it outside AltWing.
                </h3>

                <p>
                  Turn the experience into a
                  competition idea, portfolio
                  project, leadership move, or
                  simple 90-day plan.
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
              WHAT YOU CAN LEAVE WITH
            </div>

            <div className="home-section-heading">
              <h2>
                More than a quiz result.
                <br />
                Something you can actually use.
              </h2>

              <p>
                Go as far as you want. AltWing
                can help you leave with a real
                project, something to show,
                college ideas, and a clear next
                step.
              </p>
            </div>

            <div className="outcomes-grid">
              <article className="outcome-card">
                <span>01</span>
                <h3>
                  A Real Project
                </h3>
                <p>
                  Build, test, and improve
                  something connected to the
                  aerospace path you explored.
                </p>
              </article>

              <article className="outcome-card">
                <span>02</span>
                <h3>
                  Something You Can Show
                </h3>
                <p>
                  Turn your work into a project
                  description, portfolio entry,
                  activity draft, or résumé bullet.
                </p>
              </article>

              <article className="outcome-card">
                <span>03</span>
                <h3>
                  What to Learn Next
                </h3>
                <p>
                  See which classes and skills
                  would help you go deeper in
                  the direction you tested.
                </p>
              </article>

              <article className="outcome-card">
                <span>04</span>
                <h3>
                  How to Grow the Project
                </h3>
                <p>
                  Turn a solo project into a
                  club activity, team effort,
                  event, or something that helps
                  other students.
                </p>
              </article>

              <article className="outcome-card">
                <span>05</span>
                <h3>
                  Colleges to Explore
                </h3>
                <p>
                  Find aerospace programs and
                  compare schools that match
                  what you are starting to care
                  about.
                </p>
              </article>

              <article className="outcome-card">
                <span>06</span>
                <h3>
                  Your Next 90 Days
                </h3>
                <p>
                  Leave with a short list of
                  realistic next actions instead
                  of wondering what to do next.
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
