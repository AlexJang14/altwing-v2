import { useState } from "react";
import MissionPreview from "./components/MissionPreview";
import WingMatchMission from "./features/wingmatch/WingMatchMission";

type AppView = "home" | "wingmatch";

function App() {
  const [view, setView] = useState<AppView>("home");

  if (view === "wingmatch") {
    return (
      <WingMatchMission
        onExit={() => {
          setView("home");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    );
  }

  return (
    <div className="app">
      <header className="site-header">
        <nav className="nav">
          <a className="brand" href="#top" aria-label="AltWing home">
            <span className="brand-alt">Alt</span>
            <span className="brand-wing">Wing</span>
          </a>

          <div className="nav-links">
            <button
              type="button"
              className="nav-text-button"
              onClick={() => setView("wingmatch")}
            >
              WingMatch
            </button>

            <a href="#journey">Build</a>
            <a href="#journey">College Launch</a>

            <button
              type="button"
              className="nav-launch"
              onClick={() => setView("wingmatch")}
            >
              Explore
            </button>
          </div>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <div>
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              Aerospace exploration for high-school students
            </div>

            <h1>
              Don&apos;t choose a career.
              <br />
              <span className="hero-highlight">Test one.</span>
            </h1>

            <p className="hero-copy">
              Step inside realistic aerospace decisions, discover how you solve
              problems, build something real, and turn that experience into your
              next academic move.
            </p>

            <div className="hero-actions">
              <button
                type="button"
                className="button button-primary"
                onClick={() => setView("wingmatch")}
              >
                Explore WingMatch
              </button>

              <a className="button button-secondary" href="#journey">
                See how AltWing works
              </a>
            </div>

            <p className="hero-note">
              Explore. Build. Launch. — no personality test required.
            </p>
          </div>

          <button
            type="button"
            className="mission-preview-button"
            onClick={() => setView("wingmatch")}
            aria-label="Launch Mars descent WingMatch mission"
          >
            <MissionPreview />
          </button>
        </section>

        <section className="journey-section" id="journey">
          <div className="journey-inner">
            <div className="section-label">The AltWing Loop</div>

            <h2>
              Career exploration should end with more than a quiz result.
            </h2>

            <div className="journey-grid">
              <article className="journey-card">
                <div className="journey-number">01 / EXPLORE</div>
                <h3>Test how you think.</h3>

                <p>
                  Make decisions inside an aerospace mission and reveal the
                  engineering instincts behind them.
                </p>
              </article>

              <article className="journey-card">
                <div className="journey-number">02 / BUILD</div>
                <h3>Create real evidence.</h3>

                <p>
                  Turn a promising Wing into an authentic technical challenge
                  and eventually a project worth showing.
                </p>
              </article>

              <article className="journey-card">
                <div className="journey-number">03 / LAUNCH</div>
                <h3>Know your next move.</h3>

                <p>
                  Connect your Wing to majors, colleges, preparation gaps, and
                  specific actions you can take next.
                </p>
              </article>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;