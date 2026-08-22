import "../styles/mission-preview.css";

function MissionPreview() {
  return (
    <section
      className="mission-visual"
      aria-label="Mars descent mission preview"
    >
      <div className="mission-visual__stars" />

      <div className="mission-visual__header">
        <div>
          <span className="mission-visual__live-dot" />
          MISSION PREVIEW
        </div>

        <span>T−08:18</span>
      </div>

      <div className="mission-visual__scene">
        <div className="mission-visual__trajectory">
          <svg
            viewBox="0 0 500 270"
            role="img"
            aria-label="Mars descent trajectory"
          >
            <path
              className="mission-visual__trajectory-path"
              d="M 88 28 C 190 56, 318 84, 372 195"
            />

            <circle
              className="mission-visual__trajectory-start"
              cx="88"
              cy="28"
              r="4"
            />
          </svg>
        </div>

        <div className="mission-visual__lander" aria-hidden="true">
          <div className="mission-visual__lander-body" />
          <div className="mission-visual__lander-leg mission-visual__lander-leg--left" />
          <div className="mission-visual__lander-leg mission-visual__lander-leg--right" />

          <div className="mission-visual__thruster mission-visual__thruster--left" />
          <div className="mission-visual__thruster mission-visual__thruster--right" />
        </div>

        <div className="mission-visual__target" aria-hidden="true">
          <div className="mission-visual__target-ring mission-visual__target-ring--outer" />
          <div className="mission-visual__target-ring mission-visual__target-ring--inner" />
          <div className="mission-visual__target-dot" />
        </div>

        <div className="mission-visual__mars" aria-hidden="true">
          <div className="mission-visual__mars-glow" />
          <div className="mission-visual__mars-crater mission-visual__mars-crater--one" />
          <div className="mission-visual__mars-crater mission-visual__mars-crater--two" />
          <div className="mission-visual__mars-crater mission-visual__mars-crater--three" />
        </div>

        <div className="mission-visual__status">
          <span>DESCENT VECTOR</span>
          <strong>−4.8°</strong>
        </div>
      </div>

      <div className="mission-visual__question">
        <span>MARS DESCENT</span>

        <h2>
          Your sensors disagree.
          <br />
          What do you trust first?
        </h2>
      </div>

      <div className="mission-visual__telemetry">
        <div className="mission-visual__metric">
          <span>ALTITUDE</span>
          <strong>22.4 km</strong>
        </div>

        <div className="mission-visual__metric">
          <span>FUEL</span>
          <strong>31%</strong>
        </div>

        <div className="mission-visual__metric">
          <span>NAVIGATION</span>
          <strong className="mission-visual__uncertain">UNCERTAIN</strong>
        </div>

        <div className="mission-visual__metric">
          <span>VEHICLE</span>
          <strong className="mission-visual__warning">OSCILLATING</strong>
        </div>
      </div>

      <div className="mission-visual__footer">
        <span>ALTWING / WINGMATCH</span>
        <span>DECISION 03 / 08</span>
      </div>
    </section>
  );
}

export default MissionPreview;