interface WingMatchGameVisualProps {
  sceneId: string;
  altitude?: string;
  previewOptionId?: string;
}


const sceneNames:
  Record<string, string> = {
    "landing-choice":
      "LANDING ZONE",

    "sensor-problem":
      "SENSOR CHECK",

    "unstable-lander":
      "FLIGHT CONTROL",

    "overheating-system":
      "THERMAL SYSTEM",

    "landing-leg":
      "STRUCTURE",

    "power-budget":
      "POWER BUDGET",
  };


function WingMatchGameVisual({
  sceneId,
  previewOptionId,
}: WingMatchGameVisualProps) {
  return (
    <section
      className="wm-simple-visual"
      data-scene={sceneId}
      data-choice={
        previewOptionId ??
        "none"
      }
    >
      <div
        className="wm-simple-stars"
        aria-hidden="true"
      />

      <div className="wm-simple-label">
        <span>
          MARS MISSION
        </span>

        <strong>
          {
            sceneNames[
              sceneId
            ] ??
            "MISSION"
          }
        </strong>
      </div>


      <div className="wm-scene-art">

        {sceneId ===
          "landing-choice" && (
          <>
            <div className="wm-planet" />

            <div className="wm-lander">
              <i />
            </div>

            <div className="wm-landing-zones">
              <span>A</span>
              <span>B</span>
              <span>C</span>
            </div>
          </>
        )}


        {sceneId ===
          "sensor-problem" && (
          <>
            <div className="wm-rover">
              <i />
            </div>

            <div className="wm-signal wm-signal-a">
              14.2
              <small>km</small>
            </div>

            <div className="wm-signal wm-signal-b">
              16.1
              <small>km</small>
            </div>

            <div className="wm-sensor-wave" />
          </>
        )}


        {sceneId ===
          "unstable-lander" && (
          <>
            <div className="wm-control-target">
              <i />
            </div>

            <div className="wm-control-lander">
              <i />
            </div>

            <div className="wm-control-wave" />
          </>
        )}


        {sceneId ===
          "overheating-system" && (
          <>
            <div className="wm-spacecraft">
              <i className="wm-spacecraft-core" />

              <i className="wm-spacecraft-left" />

              <i className="wm-spacecraft-right" />
            </div>

            <div className="wm-heat-ring" />

            <div className="wm-temperature">
              HOT
            </div>
          </>
        )}


        {sceneId ===
          "landing-leg" && (
          <>
            <div className="wm-leg">
              <i />
              <b />
              <span />
            </div>

            <div className="wm-force-arrow">
              ↓
            </div>

            <div className="wm-ground" />
          </>
        )}


        {sceneId ===
          "power-budget" && (
          <>
            <div className="wm-rover wm-rover-final">
              <i />
            </div>

            <div className="wm-power-battery">
              <i />
              <span>
                20%
              </span>
            </div>

            <div className="wm-earth-signal">
              ◉
            </div>

            <div className="wm-science-target">
              ✦
            </div>
          </>
        )}

      </div>


      <div className="wm-simple-bottom">
        <span>
          {previewOptionId
            ? "CHOICE LOCKED"
            : "WHAT WOULD YOU DO?"}
        </span>

        <strong>
          No right answer.
        </strong>
      </div>
    </section>
  );
}


export default WingMatchGameVisual;
