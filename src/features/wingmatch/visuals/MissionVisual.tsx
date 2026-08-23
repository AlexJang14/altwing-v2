import "./mission-visuals.css";

interface MissionVisualProps {
  sceneId: string;
  altitude: string;
  previewOptionId?: string;
}

interface EntryVisualProps {
  altitude: string;
  hasPreview: boolean;
}

function EntryVisual({
  altitude,
  hasPreview,
}: EntryVisualProps) {
  return (
    <div className="mission-viz mission-viz--entry" aria-hidden="true">
      <div className="mission-viz__stars" />

      <svg
        className="entry-viz__trajectory"
        viewBox="0 0 600 300"
      >
        <path
          d="M 65 52 C 190 55, 330 82, 468 216"
          className="entry-viz__path"
        />

        <circle
          cx="65"
          cy="52"
          r="5"
          className="entry-viz__start"
        />
      </svg>

      <div
        className={[
          "entry-viz__capsule",
          hasPreview ? "entry-viz__capsule--active" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="entry-viz__capsule-body" />
        <div className="entry-viz__flame" />
      </div>

      <div className="entry-viz__atmosphere" />

      <div className="entry-viz__mars">
        <div className="entry-viz__mars-glow" />
      </div>

      <div className="mission-viz__readout">
        <span>ALTITUDE</span>
        <strong>{altitude}</strong>
      </div>

      <div className="entry-viz__heat">
        <span>ENTRY HEATING</span>
        <strong>+8%</strong>
      </div>
    </div>
  );
}

interface SensorVisualProps {
  altitude: string;
  previewOptionId?: string;
}

function SensorVisual({
  altitude,
  previewOptionId,
}: SensorVisualProps) {
  const showThirdSignal =
    previewOptionId === "independent-check";

  const emphasizeInertial =
    previewOptionId === "trust-inertial";

  const isolateRadar =
    previewOptionId === "isolate-radar";

  const fuseSignals =
    previewOptionId === "fuse-estimates";

  return (
    <div className="mission-viz mission-viz--sensor" aria-hidden="true">
      <div className="mission-viz__stars" />

      <div className="sensor-viz__title">
        ALTITUDE STATE ESTIMATION
      </div>

      <div
        className={[
          "sensor-viz__track",
          "sensor-viz__track--radar",
          isolateRadar ? "sensor-viz__track--testing" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div>
          <span>RADAR ALTITUDE</span>
          <strong>14.2 km</strong>
        </div>

        <div className="sensor-viz__line" />
      </div>

      <div
        className={[
          "sensor-viz__track",
          "sensor-viz__track--inertial",
          emphasizeInertial ? "sensor-viz__track--active" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div>
          <span>INERTIAL ESTIMATE</span>
          <strong>16.1 km</strong>
        </div>

        <div className="sensor-viz__line" />
      </div>

      <div className="sensor-viz__lander">
        <div className="sensor-viz__lander-body" />

        <div className="sensor-viz__lander-leg sensor-viz__lander-leg--left" />
        <div className="sensor-viz__lander-leg sensor-viz__lander-leg--right" />

        <div className="sensor-viz__beam" />
      </div>

      <div className="sensor-viz__disagreement">
        <span>Δ ALTITUDE</span>
        <strong>1.9 km</strong>
      </div>

      {showThirdSignal && (
        <div className="sensor-viz__third-signal">
          <span>THIRD SIGNAL</span>
          <strong>CHECKING...</strong>
        </div>
      )}

      {isolateRadar && (
        <div className="sensor-viz__fault-check">
          RADAR FAULT ISOLATION
        </div>
      )}

      {fuseSignals && (
        <div className="sensor-viz__fused">
          <span>FUSED STATE</span>
          <strong>15.4 km ±0.6</strong>
        </div>
      )}

      <div className="mission-viz__readout">
        <span>VEHICLE ALTITUDE</span>
        <strong>{altitude}</strong>
      </div>
    </div>
  );
}

function MissionVisual({
  sceneId,
  altitude,
  previewOptionId,
}: MissionVisualProps) {
  if (sceneId === "sensor-disagreement") {
    return (
      <SensorVisual
        altitude={altitude}
        previewOptionId={previewOptionId}
      />
    );
  }

  return (
    <EntryVisual
      altitude={altitude}
      hasPreview={Boolean(previewOptionId)}
    />
  );
}

export default MissionVisual;