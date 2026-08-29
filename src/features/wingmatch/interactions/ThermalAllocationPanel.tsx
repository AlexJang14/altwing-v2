import { useEffect, useMemo, useState } from "react";
import "./thermal-allocation.css";

export interface ThermalAllocationResult {
  engine: number;
  battery: number;
  avionics: number;
  reserve: number;
  engineTemp: number;
  batteryRisk: number;
  avionicsMargin: number;
  adjustments: number;
  state:
    | "engine-risk"
    | "battery-risk"
    | "avionics-risk"
    | "low-reserve"
    | "balanced";
}

interface ThermalAllocationPanelProps {
  onLock?: (
    result: ThermalAllocationResult,
  ) => void;

  onPreview?: (
    result: ThermalAllocationResult,
  ) => void;

  locked?: boolean;
}

function ThermalAllocationPanel({
  onLock,
  onPreview,
  locked = false,
}: ThermalAllocationPanelProps) {
  const [engine, setEngine] =
    useState(25);

  const [battery, setBattery] =
    useState(20);

  const [avionics, setAvionics] =
    useState(15);
  const [adjustments, setAdjustments] = useState(0);

  const reserve =
    100 - engine - battery - avionics;

  const metrics = useMemo(() => {
    const engineTemp = Math.round(
      136 - engine * 0.75,
    );

    const batteryRisk = Math.max(
      0,
      Math.round(62 - battery * 1.5),
    );

    const avionicsMargin = Math.max(
      0,
      Math.round(avionics * 2.2),
    );

    let state: ThermalAllocationResult["state"];

    if (engineTemp > 112) {
      state = "engine-risk";
    } else if (batteryRisk > 30) {
      state = "battery-risk";
    } else if (avionicsMargin < 35) {
      state = "avionics-risk";
    } else if (reserve < 10) {
      state = "low-reserve";
    } else {
      state = "balanced";
    }

    return {
      engineTemp,
      batteryRisk,
      avionicsMargin,
      state,
    };
  }, [engine, battery, avionics, reserve]);

  const currentResult =
    useMemo<ThermalAllocationResult>(
      () => ({
        engine,
        battery,
        avionics,
        reserve,

        engineTemp:
          metrics.engineTemp,

        batteryRisk:
          metrics.batteryRisk,

        avionicsMargin:
          metrics.avionicsMargin,

        adjustments,

        state:
          metrics.state,
      }),
      [
        engine,
        battery,
        avionics,
        reserve,
        metrics,
        adjustments,
      ],
    );

  useEffect(() => {
    if (!locked) {
      onPreview?.(
        currentResult,
      );
    }
  }, [
    currentResult,
    locked,
    onPreview,
  ]);

  function updateAllocation(
    system: "engine" | "battery" | "avionics",
    value: number,
  ) {
    const otherTotal =
      system === "engine"
        ? battery + avionics
        : system === "battery"
          ? engine + avionics
          : engine + battery;

    const safeValue = Math.min(
      value,
      100 - otherTotal,
    );

    if (system === "engine") {
      setEngine(safeValue);
    }

    if (system === "battery") {
      setBattery(safeValue);
    }

    if (system === "avionics") {
      setAvionics(safeValue);
    }

    setAdjustments((current) => current + 1);
  }

  function handleLock() {
    onLock?.(
      currentResult,
    );
  }

  return (
    <div className="thermal-allocation">
      <div className="thermal-header">
        <div>
          <span>
            RESOURCE CRISIS
          </span>

          <h2>
            You have 100 cooling points.
          </h2>
        </div>

        <div
          className={`thermal-state thermal-state--${metrics.state}`}
        >
          {metrics.state === "balanced"
            ? "MARGINS DISTRIBUTED"
            : "TRADEOFF ACTIVE"}
        </div>
      </div>

      <p className="thermal-brief">
        Every point you move protects
        one system by giving up margin
        somewhere else. There is no
        perfect allocation.
      </p>

      <div className="thermal-budget">
        <span>
          CONTINGENCY RESERVE
        </span>

        <strong>
          {reserve}
        </strong>

        <small>
          points uncommitted
        </small>
      </div>

      <div className="thermal-budget-rail">
        <div
          className="thermal-budget-used"
          style={{
            width:
              `${
                engine +
                battery +
                avionics
              }%`,
          }}
        />

        <div
          className="thermal-budget-reserve"
          style={{
            width:
              `${reserve}%`,
          }}
        />
      </div>

      <div className="thermal-budget-legend">
        <span>
          {
            engine +
            battery +
            avionics
          } committed
        </span>

        <span>
          {reserve} reserve
        </span>
      </div>

      <div className="thermal-controls">
        <label>
          <div>
            <span>ENGINE COOLING</span>
            <strong>{engine}</strong>
          </div>

          <input
            type="range"
            min="0"
            max="60"
            step="5"
            value={engine}
            disabled={locked}
            onChange={(event) =>
              updateAllocation(
                "engine",
                Number(event.target.value),
              )
            }
          />
        </label>

        <label>
          <div>
            <span>BATTERY COOLING</span>
            <strong>{battery}</strong>
          </div>

          <input
            type="range"
            min="0"
            max="50"
            step="5"
            value={battery}
            disabled={locked}
            onChange={(event) =>
              updateAllocation(
                "battery",
                Number(event.target.value),
              )
            }
          />
        </label>

        <label>
          <div>
            <span>AVIONICS COOLING</span>
            <strong>{avionics}</strong>
          </div>

          <input
            type="range"
            min="0"
            max="50"
            step="5"
            value={avionics}
            disabled={locked}
            onChange={(event) =>
              updateAllocation(
                "avionics",
                Number(event.target.value),
              )
            }
          />
        </label>
      </div>

      <div className="thermal-total">
        <span>TOTAL ALLOCATED</span>

        <strong>
          {engine + battery + avionics}
          <small> / 100</small>
        </strong>
      </div>

      <div className="thermal-metrics">
        <div>
          <span>ENGINE TEMP</span>
          <strong>
            {metrics.engineTemp}%
          </strong>
        </div>

        <div>
          <span>BATTERY RISK</span>
          <strong>
            {metrics.batteryRisk}%
          </strong>
        </div>

        <div>
          <span>AVIONICS MARGIN</span>
          <strong>
            {metrics.avionicsMargin}%
          </strong>
        </div>

        <div>
          <span>RESERVE</span>
          <strong>{reserve}%</strong>
        </div>
      </div>

      <div className="thermal-feedback">
        {metrics.state === "engine-risk" &&
          "You are accepting higher engine temperature to preserve power elsewhere."}

        {metrics.state === "battery-risk" &&
          "You are accepting more battery thermal exposure to preserve margin elsewhere."}

        {metrics.state === "avionics-risk" &&
          "You are trading avionics thermal margin for other systems."}

        {metrics.state === "low-reserve" &&
          "You protected current systems aggressively and left little contingency power."}

        {metrics.state === "balanced" &&
          "No subsystem dominates the budget. You preserved contingency power, but every margin can still be traded."}
      </div>

      <button
        type="button"
        className="thermal-lock"
        disabled={locked}
        onClick={handleLock}
      >
        {locked
          ? "Allocation committed ✓"
          : "Commit allocation →"}
      </button>
    </div>
  );
}

export default ThermalAllocationPanel;