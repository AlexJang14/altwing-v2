import "./preflight-briefing.css";

interface PreFlightBriefingProps {
  onBack: () => void;
  onStart: () => void;
}

function PreFlightBriefing({
  onBack,
  onStart,
}: PreFlightBriefingProps) {
  return (
    <main className="preflight-shell">
      <header className="preflight-nav">
        <button
          type="button"
          onClick={onBack}
        >
          ← Back
        </button>

        <strong>
          Alt<span>Wing</span>
        </strong>
      </header>

      <section className="preflight-card">
        <div className="preflight-penguin">
          <img
            src="/brand/altwing-penguin.png"
            alt=""
          />

          <i />
        </div>

        <span className="preflight-kicker">
          PRE-FLIGHT BRIEFING
        </span>

        <h1>
          You&apos;re about to fly
          <strong>
            {" "}8 aerospace
            mini-missions.
          </strong>
        </h1>

        <p className="preflight-intro">
          This is not a personality test.
          You&apos;ll make engineering
          decisions and discover the kind
          of aerospace work that feels
          natural to you.
        </p>

        <div className="preflight-facts">
          <article>
            <b>~5 MIN</b>
            <span>
              Short mission
            </span>
          </article>

          <article>
            <b>NO QUIZ</b>
            <span>
              Make decisions
            </span>
          </article>

          <article>
            <b>1 WING</b>
            <span>
              Find your pattern
            </span>
          </article>

          <article>
            <b>1 DISCOVERY</b>
            <span>
              Start your Atlas
            </span>
          </article>
        </div>

        <div className="preflight-rule">
          <span>
            ONE RULE
          </span>

          <strong>
            There is no perfect answer.
          </strong>

          <p>
            Choose what you would actually
            do under pressure.
          </p>
        </div>

        <button
          type="button"
          className="preflight-start"
          onClick={onStart}
        >
          START MISSION →
        </button>

        <button
          type="button"
          className="preflight-back"
          onClick={onBack}
        >
          Explore AltWing first
        </button>
      </section>
    </main>
  );
}

export default PreFlightBriefing;
