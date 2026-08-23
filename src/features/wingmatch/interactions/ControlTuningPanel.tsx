import { useMemo, useState } from "react";
import type { ControllerTuningConfig } from "../engine/types";
import "./control-tuning.css";

export interface ControllerTuningResult {
  value: number;
  adjustments: number;
  visitedValues: number[];
  overshoot: number;
  settlingTime: number;
  controlEffort: number;
  responseState: "slow" | "balanced" | "oscillating";
}

interface ControlTuningPanelProps {
  config: ControllerTuningConfig;
  onLock?: (result: ControllerTuningResult) => void;
  locked?: boolean;
}

function calculateMetrics(
  gain: number,
  stableMin: number,
  stableMax: number,
) {
  let overshoot: number;
  let settlingTime: number;

  if (gain < stableMin) {
    overshoot = Math.max(
      3,
      Math.round(7 - (stableMin - gain) * 8),
    );

    settlingTime =
      5.8 + (stableMin - gain) * 14;
  } else if (gain <= stableMax) {
    overshoot =
      7 + Math.abs(gain - 0.8) * 12;

    settlingTime =
      4.1 + Math.abs(gain - 0.8) * 5;
  } else {
    overshoot =
      8 + (gain - stableMax) * 65;

    settlingTime =
      4.6 + (gain - stableMax) * 16;
  }

  const controlEffort = Math.min(
    100,
    28 + gain * 37,
  );

  let responseState:
    | "slow"
    | "balanced"
    | "oscillating";

  if (gain < stableMin) {
    responseState = "slow";
  } else if (gain <= stableMax) {
    responseState = "balanced";
  } else {
    responseState = "oscillating";
  }

  return {
    overshoot: Math.round(overshoot),
    settlingTime: Number(settlingTime.toFixed(1)),
    controlEffort: Math.round(controlEffort),
    responseState,
  };
}

function buildWaveformPath(gain: number) {
  const width = 560;
  const centerY = 92;

  const normalizedGain =
    (gain - 0.4) / (1.4 - 0.4);

  const frequency =
    1.8 + normalizedGain * 4.5;

  const amplitude =
    gain > 0.9
      ? 43 + (gain - 0.9) * 35
      : 34;

  const damping =
    gain < 0.7
      ? 1.8
      : gain <= 0.9
        ? 4.4
        : Math.max(
            0.7,
            3.1 - (gain - 0.9) * 4.4,
          );

  const points: string[] = [];

  for (let index = 0; index <= 80; index += 1) {
    const progress = index / 80;

    const x = progress * width;

    const oscillation =
      Math.sin(progress * Math.PI * frequency) *
      amplitude *
      Math.exp(-progress * damping);

    const slowBias =
      gain < 0.7
        ? (1 - progress) * 24
        : 0;

    const y =
      centerY + oscillation + slowBias;

    points.push(
      `${index === 0 ? "M" : "L"} ${x.toFixed(
        1,
      )} ${y.toFixed(1)}`,
    );
  }

  return points.join(" ");
}

function ControlTuningPanel({
  config,
  onLock,
  locked = false,
}: ControlTuningPanelProps) {
  const [gain, setGain] = useState(
    config.initialValue,
  );

  const [visitedValues, setVisitedValues] =
    useState<number[]>([config.initialValue]);

  const metrics = useMemo(
    () =>
      calculateMetrics(
        gain,
        config.stableRange.min,
        config.stableRange.max,
      ),
    [
      gain,
      config.stableRange.min,
      config.stableRange.max,
    ],
  );

  const waveformPath = useMemo(
    () => buildWaveformPath(gain),
    [gain],
  );

  function handleGainChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const nextGain = Number(event.target.value);

    setGain(nextGain);

    setVisitedValues((current) => {
      const lastValue =
        current[current.length - 1];

      if (lastValue === nextGain) {
        return current;
      }

      return [...current, nextGain];
    });
  }

  function handleLock() {
    const result: ControllerTuningResult = {
      value: gain,
      adjustments: Math.max(
        0,
        visitedValues.length - 1,
      ),
      visitedValues,
      ...metrics,
    };

    console.group(
      "AltWing Controller Tuning",
    );

    console.log("Final gain:", gain);
    console.log(
      "Adjustments:",
      result.adjustments,
    );
    console.log(
      "Visited values:",
      visitedValues,
    );
    console.log("Result:", result);

    console.groupEnd();

    onLock?.(result);
  }

  return (
    <div className="control-tuning">
      <div className="control-tuning__header">
        <div>
          <span>FLIGHT CONTROL</span>
          <h2>Tune the response.</h2>
        </div>

        <div
          className={`control-state control-state--${metrics.responseState}`}
        >
          {metrics.responseState === "slow" &&
            "SLOW RESPONSE"}

          {metrics.responseState ===
            "balanced" && "BALANCED"}

          {metrics.responseState ===
            "oscillating" && "OSCILLATING"}
        </div>
      </div>

      <div className="control-waveform">
        <div className="control-waveform__label">
          PITCH RESPONSE
        </div>

        <svg
          viewBox="0 0 560 184"
          role="img"
          aria-label="Vehicle pitch response"
        >
          <line
            className="control-waveform__target"
            x1="0"
            y1="92"
            x2="560"
            y2="92"
          />

          <path
            className={`control-waveform__response control-waveform__response--${metrics.responseState}`}
            d={waveformPath}
          />
        </svg>

        <div className="control-waveform__legend">
          <span>
            <i className="control-dot control-dot--target" />
            TARGET
          </span>

          <span>
            <i className="control-dot control-dot--vehicle" />
            VEHICLE
          </span>
        </div>
      </div>

      <div className="control-slider-block">
        <div className="control-slider-heading">
          <div>
            <span>
              {config.parameterLabel}
            </span>

            <strong>
              {gain.toFixed(2)}
            </strong>
          </div>

          <small>
            {visitedValues.length > 1
              ? `${visitedValues.length - 1} adjustment${
                  visitedValues.length - 1 ===
                  1
                    ? ""
                    : "s"
                }`
              : "Move the slider to test the response"}
          </small>
        </div>

        <input
          className="control-slider"
          type="range"
          min={config.min}
          max={config.max}
          step={config.step}
          value={gain}
          disabled={locked}
          onChange={handleGainChange}
          aria-label={config.parameterLabel}
        />

        <div className="control-slider-labels">
          <span>
            {config.min.toFixed(2)}
            <small>
              {config.labels.low}
            </small>
          </span>

          <span>
            {config.max.toFixed(2)}
            <small>
              {config.labels.high}
            </small>
          </span>
        </div>
      </div>

      <div className="control-metrics">
        <div className="control-metric">
          <span>OVERSHOOT</span>
          <strong>
            {metrics.overshoot}%
          </strong>
        </div>

        <div className="control-metric">
          <span>SETTLING TIME</span>
          <strong>
            {metrics.settlingTime}s
          </strong>
        </div>

        <div className="control-metric">
          <span>CONTROL EFFORT</span>
          <strong>
            {metrics.controlEffort}%
          </strong>
        </div>
      </div>

      <div className="control-tradeoff">
        {metrics.responseState === "slow" && (
          <>
            <strong>
              Stable, but sluggish.
            </strong>

            <p>
              Overshoot is low, but the lander
              takes longer to reach the commanded
              attitude.
            </p>
          </>
        )}

        {metrics.responseState ===
          "balanced" && (
          <>
            <strong>
              Response is settling.
            </strong>

            <p>
              The controller responds quickly
              without repeatedly overshooting the
              target.
            </p>
          </>
        )}

        {metrics.responseState ===
          "oscillating" && (
          <>
            <strong>
              Corrections are feeding the
              oscillation.
            </strong>

            <p>
              The response is fast, but each
              correction creates a larger
              counter-correction.
            </p>
          </>
        )}
      </div>

      <button
        className="control-lock-button"
        type="button"
        disabled={locked}
        onClick={handleLock}
      >
        {locked
          ? "Control setting locked"
          : "Lock control setting"}
      </button>
    </div>
  );
}

export default ControlTuningPanel;