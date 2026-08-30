import MyUniversePanel from "./MyUniversePanel";

import "./my-universe-page.css";

interface MyUniversePageProps {
  onBack: () => void;
  onStartMission: () => void;
}

function MyUniversePage({
  onBack,
  onStartMission,
}: MyUniversePageProps) {
  return (
    <main className="universe-page">
      <header className="universe-page-nav">
        <button
          type="button"
          onClick={onBack}
        >
          ← Home
        </button>

        <strong>
          Alt<span>Wing</span>
        </strong>

        <button
          type="button"
          onClick={onStartMission}
        >
          Play →
        </button>
      </header>

      <section className="universe-page-hero">
        <span>
          MY UNIVERSE
        </span>

        <h1>
          Everything you&apos;ve
          <br />
          actually earned.
        </h1>

        <p>
          Your Wing, builds, evidence,
          cosmic discoveries, and future
          leadership live in one place.
        </p>
      </section>

      <div className="universe-page-content">
        <MyUniversePanel />
      </div>
    </main>
  );
}

export default MyUniversePage;
