import { useMemo, useState } from "react";

import ControlTuningPanel from "./ControlTuningPanel";
import type { ControllerTuningResult } from "./ControlTuningPanel";

import ThermalAllocationPanel from "./ThermalAllocationPanel";
import type { ThermalAllocationResult } from "./ThermalAllocationPanel";

import LandingSitePanel from "./LandingSitePanel";
import type { LandingSiteResult } from "./LandingSitePanel";

import StructureScanPanel from "./StructureScanPanel";
import type { StructureScanResult } from "./StructureScanPanel";

import FaultIsolationPanel from "./FaultIsolationPanel";
import type { FaultIsolationResult } from "./FaultIsolationPanel";

import MissionVisual from "./MissionVisual";

import {
  controlOscillationMission,
  missionScenes,
} from "./missionScenes";

import { thermalManagementMission } from "./thermalMission";
import { landingSiteMission } from "./landingMission";
import { structureMission } from "./structureMission";
import { faultIsolationMission } from "./faultMission";

import type {
  ControllerMissionScene,
  MissionOption,
  MissionScene,
  ReasoningSignal,
  TelemetryItem,
  WingId,
} from "./types";

import "./wingmatch.css";

interface WingMatchMissionProps {
  onExit: () => void;
}

type WingScores = Partial<Record<WingId, number>>;
type ReasoningScores = Partial<
  Record<ReasoningSignal, number>
>;

interface MissionHistoryItem {
  sceneId: string;
  phase: string;
  title: string;
  consequence: string;
  effects: TelemetryItem[];
}

interface CommitFlashData {
  title: string;
  effects: TelemetryItem[];
  continues: boolean;
}

const activeMissionScenes: MissionScene[] = [
  ...missionScenes,
  controlOscillationMission,
  thermalManagementMission,
  landingSiteMission,
  structureMission,
  faultIsolationMission,
];

function isControllerMission(
  scene: MissionScene,
): scene is ControllerMissionScene {
  return (
    "interaction" in scene &&
    (scene as ControllerMissionScene).interaction ===
      "controller-tuning"
  );
}

function mergeTelemetry(
  baseTelemetry: TelemetryItem[],
  changes: TelemetryItem[],
) {
  const merged = [...baseTelemetry];

  changes.forEach((change) => {
    const existingIndex = merged.findIndex(
      (item) => item.label === change.label,
    );

    if (existingIndex >= 0) {
      merged[existingIndex] = change;
    } else {
      merged.push(change);
    }
  });

  return merged;
}

function addScores<T extends string>(
  current: Partial<Record<T, number>>,
  incoming:
    | Partial<Record<T, number>>
    | undefined,
) {
  const next = { ...current };

  if (!incoming) {
    return next;
  }

  Object.entries(incoming).forEach(
    ([key, value]) => {
      if (typeof value !== "number") {
        return;
      }

      const typedKey = key as T;

      next[typedKey] =
        (next[typedKey] ?? 0) + value;
    },
  );

  return next;
}

function getThermalEffects(
  result: ThermalAllocationResult,
): TelemetryItem[] {
  return [
    {
      label: "ENGINE TEMP",
      value: `${result.engineTemp}%`,
      status:
        result.engineTemp <= 112
          ? "nominal"
          : "warning",
    },
    {
      label: "BATTERY RISK",
      value: `${result.batteryRisk}%`,
      status:
        result.batteryRisk <= 30
          ? "nominal"
          : "warning",
    },
    {
      label: "AVIONICS MARGIN",
      value: `${result.avionicsMargin}%`,
      status:
        result.avionicsMargin >= 35
          ? "nominal"
          : "warning",
    },
    {
      label: "RESERVE",
      value: `${result.reserve}%`,
      status:
        result.reserve >= 10
          ? "nominal"
          : "warning",
    },
  ];
}

function getThermalConsequence(
  result: ThermalAllocationResult,
) {
  switch (result.state) {
    case "balanced":
      return "Critical systems remain protected while the vehicle preserves cooling reserve for the rest of the descent.";

    case "engine-risk":
      return "The vehicle preserves power elsewhere, but engine temperature remains above the preferred thermal margin.";

    case "battery-risk":
      return "Engine cooling improves, but battery thermal risk remains elevated.";

    case "avionics-risk":
      return "The thermal plan leaves too little avionics margin for the remaining descent.";

    case "low-reserve":
      return "Current temperatures improve, but almost no cooling reserve remains for unexpected conditions.";

    default:
      return "The thermal allocation changes the vehicle's remaining margins.";
  }
}

function getLandingEffects(
  result: LandingSiteResult,
): TelemetryItem[] {
  return [
    {
      label: "LANDING SITE",
      value: result.siteName,
      status: "nominal",
    },
    {
      label: "SLOPE",
      value: `${result.slope}°`,
      status:
        result.slope <= 4
          ? "nominal"
          : "warning",
    },
    {
      label: "ROCK RISK",
      value: result.rockRisk,
      status:
        result.rockRisk === "LOW"
          ? "nominal"
          : "warning",
    },
    {
      label: "SCIENCE",
      value: result.scienceValue,
      status: "nominal",
    },
  ];
}

function getLandingConsequence(
  result: LandingSiteResult,
) {
  if (result.siteId === "site-a") {
    return "You prioritized safer terrain, accepting a larger fuel cost and more limited science return.";
  }

  if (result.siteId === "site-b") {
    return "You accepted moderate terrain risk for a strong balance of fuel efficiency and science value.";
  }

  return "You accepted greater surface hazard in exchange for the highest science opportunity.";
}

function getStructureEffects(
  result: StructureScanResult,
): TelemetryItem[] {
  return [
    {
      label: "TARGET",
      value: result.zoneName,
      status: "nominal",
    },
    {
      label: "STRAIN",
      value: `${result.strain}%`,
      status:
        result.strain >= 65
          ? "warning"
          : "nominal",
    },
    {
      label: "BUCKLING MARGIN",
      value:
        result.bucklingMargin.toFixed(2),
      status:
        result.bucklingMargin < 1.3
          ? "warning"
          : "nominal",
    },
    {
      label: "ADDED MASS",
      value:
        `+${result.reinforcementMass} kg`,
      status:
        result.reinforcementMass <= 1.5
          ? "nominal"
          : "warning",
    },
  ];
}

function getStructureConsequence(
  result: StructureScanResult,
) {
  switch (result.zoneId) {
    case "main-strut":
      return "You reinforced the highest-compression member. Buckling risk falls, but the reinforcement consumes a significant share of the remaining mass margin.";

    case "lower-joint":
      return "You reinforced a joint carrying combined compression and bending, gaining protection with relatively modest added mass.";

    case "upper-joint":
      return "You reinforced a structurally healthy load-transfer point, preserving it further but leaving higher-load regions unchanged.";

    case "footpad":
      return "You reinforced the surface-contact element. Contact robustness improves, but the primary compression load path receives little additional support.";

    default:
      return "The reinforcement changes the landing leg's structural margin.";
  }
}

function getFaultEffects(
  result: FaultIsolationResult,
): TelemetryItem[] {
  return [
    {
      label: "DIAGNOSIS",
      value: result.faultName,
      status:
        result.faultId === "rf-path"
          ? "nominal"
          : "warning",
    },
    {
      label: "TESTS RUN",
      value: `${result.testCount} / 3`,
      status:
        result.testCount >= 2
          ? "nominal"
          : "warning",
    },
    {
      label: "RF EVIDENCE",
      value:
        result.foundRfEvidence
          ? "FOUND"
          : "NOT TESTED",
      status:
        result.foundRfEvidence
          ? "nominal"
          : "warning",
    },
    {
      label: "COMM LINK",
      value:
        result.faultId === "rf-path"
          ? "FAULT ISOLATED"
          : "UNCERTAIN",
      status:
        result.faultId === "rf-path"
          ? "nominal"
          : "warning",
    },
  ];
}

function getFaultConsequence(
  result: FaultIsolationResult,
) {
  if (
    result.faultId === "rf-path" &&
    result.foundRfEvidence
  ) {
    return "Your diagnosis matches the strongest collected evidence: the vehicle remains powered and online while the RF path shows abnormal loss.";
  }

  if (
    result.faultId === "rf-path" &&
    !result.foundRfEvidence
  ) {
    return "You suspected the RF path, but committed before directly testing the communication hardware. The hypothesis may be right, but the evidence chain is incomplete.";
  }

  if (result.faultId === "power") {
    return "You attributed the failure to vehicle power even though the initial telemetry reported a nominal power bus.";
  }

  if (result.faultId === "computer") {
    return "You attributed the failure to the flight computer even though the computer remained online during the communication loss.";
  }

  return "You attributed the fault to the data bus. That remains possible, but the strongest communication-path evidence points elsewhere.";
}

function WingMatchMission({
  onExit,
}: WingMatchMissionProps) {
  const [sceneIndex, setSceneIndex] =
    useState(0);

  const [
    previewOption,
    setPreviewOption,
  ] =
    useState<MissionOption | null>(
      null,
    );

  const [
    committedOption,
    setCommittedOption,
  ] =
    useState<MissionOption | null>(
      null,
    );

  const [
    controllerLocked,
    setControllerLocked,
  ] = useState(false);

const [
  ,
  setControllerResult,
] =
  useState<ControllerTuningResult | null>(
    null,
  );

  const [
    thermalLocked,
    setThermalLocked,
  ] = useState(false);

  const [
    thermalResult,
    setThermalResult,
  ] =
    useState<ThermalAllocationResult | null>(
      null,
    );

  const [
    landingLocked,
    setLandingLocked,
  ] = useState(false);

  const [
    landingResult,
    setLandingResult,
  ] =
    useState<LandingSiteResult | null>(
      null,
    );

  const [
    structureLocked,
    setStructureLocked,
  ] = useState(false);

  const [
    structureResult,
    setStructureResult,
  ] =
    useState<StructureScanResult | null>(
      null,
    );

  const [
    faultLocked,
    setFaultLocked,
  ] = useState(false);

  const [
    faultResult,
    setFaultResult,
  ] =
    useState<FaultIsolationResult | null>(
      null,
    );

  const [
    commitFlash,
    setCommitFlash,
  ] =
    useState<CommitFlashData | null>(
      null,
    );

  const [
    wingScores,
    setWingScores,
  ] = useState<WingScores>({});

  const [
    reasoningScores,
    setReasoningScores,
  ] =
    useState<ReasoningScores>({});

  const [
    missionHistory,
    setMissionHistory,
  ] = useState<MissionHistoryItem[]>(
    [],
  );

  const scene =
    activeMissionScenes[sceneIndex];

  const controllerScene =
    isControllerMission(scene)
      ? scene
      : null;

  const thermalScene =
    scene.id === "thermal-management"
      ? scene
      : null;

  const landingScene =
    scene.id ===
    "landing-site-selection"
      ? scene
      : null;

  const structureScene =
    scene.id ===
    "structural-load-path"
      ? scene
      : null;

  const faultScene =
    scene.id ===
    "avionics-fault-isolation"
      ? scene
      : null;

  const previousDecision =
    missionHistory.length > 0
      ? missionHistory[
          missionHistory.length - 1
        ]
      : null;

  const visibleTelemetry =
    useMemo(() => {
      if (
        thermalScene &&
        thermalResult
      ) {
        return getThermalEffects(
          thermalResult,
        );
      }

      if (
        landingScene &&
        landingResult
      ) {
        return getLandingEffects(
          landingResult,
        );
      }

      if (
        structureScene &&
        structureResult
      ) {
        return getStructureEffects(
          structureResult,
        );
      }

      if (
        faultScene &&
        faultResult
      ) {
        return getFaultEffects(
          faultResult,
        );
      }

      if (
        controllerScene ||
        thermalScene ||
        landingScene ||
        structureScene ||
        faultScene ||
        !previewOption
      ) {
        return scene.telemetry;
      }

      return mergeTelemetry(
        scene.telemetry,
        previewOption.telemetryChanges,
      );
    }, [
      controllerScene,
      thermalScene,
      landingScene,
      structureScene,
      faultScene,
      thermalResult,
      landingResult,
      structureResult,
      faultResult,
      previewOption,
      scene.telemetry,
    ]);

  const projectedLabels =
    useMemo(() => {
      return new Set(
        previewOption?.telemetryChanges.map(
          (item) => item.label,
        ) ?? [],
      );
    }, [previewOption]);

  const hasNextBuiltScene =
    sceneIndex <
    activeMissionScenes.length - 1;

  function advanceMission() {
    if (!hasNextBuiltScene) {
      return;
    }

    setSceneIndex(
      (current) => current + 1,
    );

    setPreviewOption(null);
    setCommittedOption(null);

    setControllerLocked(false);
    setControllerResult(null);

    setThermalLocked(false);
    setThermalResult(null);

    setLandingLocked(false);
    setLandingResult(null);

    setStructureLocked(false);
    setStructureResult(null);

    setFaultLocked(false);
    setFaultResult(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function showDecisionFlash(
    title: string,
    effects: TelemetryItem[],
  ) {
    setCommitFlash({
      title,
      effects,
      continues: hasNextBuiltScene,
    });

    window.setTimeout(() => {
      setCommitFlash(null);

      if (hasNextBuiltScene) {
        advanceMission();
      }
    }, 1200);
  }

  function handleChoose(
    option: MissionOption,
  ) {
    if (committedOption) {
      return;
    }

    setPreviewOption(option);
  }

  function handleChoiceCommit() {
    if (
      !previewOption ||
      committedOption ||
      controllerScene ||
      thermalScene ||
      landingScene ||
      structureScene ||
      faultScene
    ) {
      return;
    }

    const nextWingScores =
      addScores(
        wingScores,
        previewOption.scores.wings,
      );

    const nextReasoningScores =
      addScores(
        reasoningScores,
        previewOption.scores.reasoning,
      );

    const historyItem:
      MissionHistoryItem = {
        sceneId: scene.id,
        phase: scene.phase,
        title:
          previewOption.title,
        consequence:
          previewOption.consequence,
        effects:
          previewOption.telemetryChanges,
      };

    setWingScores(
      nextWingScores,
    );

    setReasoningScores(
      nextReasoningScores,
    );

    setMissionHistory([
      ...missionHistory,
      historyItem,
    ]);

    setCommittedOption(
      previewOption,
    );

    showDecisionFlash(
      previewOption.title,
      previewOption.telemetryChanges,
    );
  }

  function handleControllerLock(
    result:
      ControllerTuningResult,
  ) {
    if (
      !controllerScene ||
      controllerLocked
    ) {
      return;
    }

    const iterationScore =
      result.adjustments >= 3
        ? 3
        : result.adjustments >= 1
          ? 2
          : 1;

    const incomingWingScores:
      WingScores = {
        gnc: 3,
        systems: 1,
      };

    const incomingReasoningScores:
      ReasoningScores = {
        "feedback-control":
          result.adjustments >= 2
            ? 3
            : 2,

        iteration:
          iterationScore,

        "quantitative-reasoning":
          result.adjustments >= 2
            ? 2
            : 1,

        optimization:
          result.responseState ===
          "balanced"
            ? 2
            : 1,
      };

    const nextWingScores =
      addScores(
        wingScores,
        incomingWingScores,
      );

    const nextReasoningScores =
      addScores(
        reasoningScores,
        incomingReasoningScores,
      );

    const effects:
      TelemetryItem[] = [
        {
          label: "GAIN",
          value:
            result.value.toFixed(2),
          status:
            result.responseState ===
            "balanced"
              ? "nominal"
              : "warning",
        },
        {
          label: "OVERSHOOT",
          value:
            `${result.overshoot}%`,
          status:
            result.overshoot <= 12
              ? "nominal"
              : "warning",
        },
        {
          label: "SETTLING",
          value:
            `${result.settlingTime}s`,
          status:
            result.settlingTime <= 6
              ? "nominal"
              : "warning",
        },
      ];

    const consequence =
      result.responseState ===
      "balanced"
        ? "The lander settles toward the commanded attitude without feeding the oscillation."
        : result.responseState ===
            "slow"
          ? "The lander remains stable, but the control response is slow."
          : "The response remains aggressive and continues to overshoot the target.";

    const title =
      `Controller gain ${result.value.toFixed(
        2,
      )}`;

    setWingScores(
      nextWingScores,
    );

    setReasoningScores(
      nextReasoningScores,
    );

    setMissionHistory([
      ...missionHistory,
      {
        sceneId: scene.id,
        phase: scene.phase,
        title,
        consequence,
        effects,
      },
    ]);

    setControllerResult(result);
    setControllerLocked(true);

    showDecisionFlash(
      title,
      effects,
    );
  }

  function handleThermalLock(
    result:
      ThermalAllocationResult,
  ) {
    if (
      !thermalScene ||
      thermalLocked
    ) {
      return;
    }

    const balanced =
      result.state === "balanced";

    const incomingWingScores:
      WingScores = {
        thermal: 3,
        systems: 2,

        propulsion:
          result.engine >= 35
            ? 1
            : 0,

        avionics:
          result.avionics >= 20
            ? 1
            : 0,
      };

    const incomingReasoningScores:
      ReasoningScores = {
        "thermal-reasoning": 3,

        "systems-integration": 2,

        "mission-tradeoffs":
          balanced ? 3 : 2,

        optimization:
          balanced ? 3 : 1,

        iteration:
          result.adjustments >= 6
            ? 3
            : result.adjustments >= 2
              ? 2
              : 1,

        "quantitative-reasoning":
          result.adjustments >= 2
            ? 2
            : 1,
      };

    const nextWingScores =
      addScores(
        wingScores,
        incomingWingScores,
      );

    const nextReasoningScores =
      addScores(
        reasoningScores,
        incomingReasoningScores,
      );

    const effects =
      getThermalEffects(result);

    const consequence =
      getThermalConsequence(
        result,
      );

    const title =
      balanced
        ? "Balanced thermal allocation"
        : "Thermal allocation locked";

    setWingScores(
      nextWingScores,
    );

    setReasoningScores(
      nextReasoningScores,
    );

    setMissionHistory([
      ...missionHistory,
      {
        sceneId: scene.id,
        phase: scene.phase,
        title,
        consequence,
        effects,
      },
    ]);

    setThermalResult(result);
    setThermalLocked(true);

    showDecisionFlash(
      title,
      effects,
    );
  }

  function handleLandingLock(
    result: LandingSiteResult,
  ) {
    if (
      !landingScene ||
      landingLocked
    ) {
      return;
    }

    const comparisonScore =
      result.comparisons >= 3
        ? 3
        : result.comparisons >= 2
          ? 2
          : 1;

    const incomingWingScores:
      WingScores = {
        "mission-design": 3,
        systems: 2,
        gnc: 1,
      };

    const incomingReasoningScores:
      ReasoningScores = {
        "mission-tradeoffs": 3,

        optimization:
          comparisonScore,

        "systems-integration":
          comparisonScore,

        "risk-tolerance":
          result.siteId === "site-c"
            ? 3
            : result.siteId === "site-b"
              ? 2
              : 1,

        "quantitative-reasoning":
          result.comparisons >= 2
            ? 2
            : 1,
      };

    const nextWingScores =
      addScores(
        wingScores,
        incomingWingScores,
      );

    const nextReasoningScores =
      addScores(
        reasoningScores,
        incomingReasoningScores,
      );

    const effects =
      getLandingEffects(result);

    const consequence =
      getLandingConsequence(
        result,
      );

    const title =
      `${result.siteName} selected`;

    setWingScores(
      nextWingScores,
    );

    setReasoningScores(
      nextReasoningScores,
    );

    setMissionHistory([
      ...missionHistory,
      {
        sceneId: scene.id,
        phase: scene.phase,
        title,
        consequence,
        effects,
      },
    ]);

    setLandingResult(result);
    setLandingLocked(true);

    showDecisionFlash(
      title,
      effects,
    );
  }

  function handleStructureLock(
    result: StructureScanResult,
  ) {
    if (
      !structureScene ||
      structureLocked
    ) {
      return;
    }

    const inspectionScore =
      result.inspections >= 4
        ? 3
        : result.inspections >= 2
          ? 2
          : 1;

    const incomingWingScores = {
      structures: 3,
      systems: 2,
      "mission-design": 1,
    } as WingScores;

    const incomingReasoningScores:
      ReasoningScores = {
        "systems-integration":
          inspectionScore,

        "quantitative-reasoning":
          inspectionScore,

        "mission-tradeoffs":
          result.reinforcementMass <=
          1.5
            ? 3
            : 2,

        optimization:
          result.zoneId ===
          "main-strut"
            ? 3
            : result.zoneId ===
                "lower-joint"
              ? 2
              : 1,

        iteration:
          inspectionScore,
      };

    const nextWingScores =
      addScores(
        wingScores,
        incomingWingScores,
      );

    const nextReasoningScores =
      addScores(
        reasoningScores,
        incomingReasoningScores,
      );

    const effects =
      getStructureEffects(result);

    const consequence =
      getStructureConsequence(
        result,
      );

    const title =
      `${result.zoneName} reinforced`;

    setWingScores(
      nextWingScores,
    );

    setReasoningScores(
      nextReasoningScores,
    );

    setMissionHistory([
      ...missionHistory,
      {
        sceneId: scene.id,
        phase: scene.phase,
        title,
        consequence,
        effects,
      },
    ]);

    setStructureResult(result);
    setStructureLocked(true);

    showDecisionFlash(
      title,
      effects,
    );
  }

  function handleFaultLock(
    result: FaultIsolationResult,
  ) {
    if (
      !faultScene ||
      faultLocked
    ) {
      return;
    }

    const evidenceScore =
      result.testCount >= 3
        ? 3
        : result.testCount >= 2
          ? 2
          : 1;

    const diagnosisScore =
      result.faultId === "rf-path"
        ? 3
        : 1;

    const evidenceQuality =
      result.foundRfEvidence
        ? 3
        : 1;

    const incomingWingScores:
      WingScores = {
        avionics: 3,
        systems: 2,
      };

    const incomingReasoningScores:
      ReasoningScores = {
        "systems-integration":
          evidenceScore,

        "quantitative-reasoning":
          evidenceQuality,

        optimization:
          diagnosisScore,

        iteration:
          evidenceScore,

        "mission-tradeoffs":
          result.testCount >= 2
            ? 2
            : 1,
      };

    const nextWingScores =
      addScores(
        wingScores,
        incomingWingScores,
      );

    const nextReasoningScores =
      addScores(
        reasoningScores,
        incomingReasoningScores,
      );

    const effects =
      getFaultEffects(result);

    const consequence =
      getFaultConsequence(
        result,
      );

    const title =
      `${result.faultName} diagnosis`;

    setWingScores(
      nextWingScores,
    );

    setReasoningScores(
      nextReasoningScores,
    );

    setMissionHistory([
      ...missionHistory,
      {
        sceneId: scene.id,
        phase: scene.phase,
        title,
        consequence,
        effects,
      },
    ]);

    setFaultResult(result);
    setFaultLocked(true);

    console.group(
      "AltWing WingMatch — Mission 07",
    );

    console.log(
      "Fault diagnosis:",
      result,
    );

    console.log(
      "Tests selected:",
      result.testsRun,
    );

    console.log(
      "Behavior scoring:",
      incomingReasoningScores,
    );

    console.log(
      "Cumulative Wing scores:",
      nextWingScores,
    );

    console.log(
      "Cumulative Reasoning scores:",
      nextReasoningScores,
    );

    console.groupEnd();

    showDecisionFlash(
      title,
      effects,
    );
  }

  return (
    <main className="wingmatch-shell">
      {commitFlash && (
        <div
          className="commit-flash"
          role="status"
        >
          <div className="commit-flash-inner">
            <span>
              DECISION COMMITTED
            </span>

            <strong>
              {commitFlash.title}
            </strong>

            <div className="commit-flash-effects">
              {commitFlash.effects.map(
                (change) => (
                  <div
                    key={
                      change.label
                    }
                  >
                    <small>
                      {
                        change.label
                      }
                    </small>

                    <b>
                      {
                        change.value
                      }
                    </b>
                  </div>
                ),
              )}
            </div>

            <p>
              {commitFlash.continues
                ? "MISSION CONTINUES"
                : "MISSION DATA RECORDED"}
            </p>
          </div>
        </div>
      )}

      <header className="wingmatch-header">
        <button
          className="wingmatch-brand"
          type="button"
          onClick={onExit}
        >
          <span>Alt</span>
          <strong>Wing</strong>
        </button>

        <div className="wingmatch-progress">
          <span>
            MISSION{" "}
            {String(
              scene.missionNumber,
            ).padStart(2, "0")}{" "}
            /{" "}
            {String(
              scene.totalMissions,
            ).padStart(2, "0")}
          </span>

          <div className="wingmatch-progress-track">
            <div
              className="wingmatch-progress-fill"
              style={{
                width: `${
                  (scene.missionNumber /
                    scene.totalMissions) *
                  100
                }%`,
              }}
            />
          </div>
        </div>

        <button
          type="button"
          className="wingmatch-exit"
          onClick={onExit}
        >
          Exit mission
        </button>
      </header>

      <section className="wingmatch-main">
        <div className="wingmatch-flight">
          <div className="wingmatch-flight-topline">
            <div>
              <span className="wingmatch-live-dot" />
              LIVE MISSION
            </div>

            <span>
              {scene.timeRemaining}
            </span>
          </div>

          {sceneIndex > 0 &&
            previousDecision && (
              <div className="mission-continuity">
                <div className="mission-continuity-label">
                  PREVIOUS DECISION
                </div>

                <div className="mission-continuity-main">
                  <strong>
                    {
                      previousDecision.title
                    }
                  </strong>

                  <span>
                    {
                      previousDecision.phase
                    }
                  </span>
                </div>

                <div className="mission-continuity-effects">
                  {previousDecision.effects.map(
                    (change) => (
                      <div
                        key={
                          change.label
                        }
                      >
                        <small>
                          {
                            change.label
                          }
                        </small>

                        <b>
                          {
                            change.value
                          }
                        </b>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

          {!controllerScene &&
            !thermalScene &&
            !landingScene &&
            !structureScene &&
            !faultScene && (
              <MissionVisual
                sceneId={scene.id}
                altitude={
                  scene.altitude
                }
                previewOptionId={
                  previewOption?.id
                }
              />
            )}

          <div className="wingmatch-phase">
            <span>
              {scene.phase}
            </span>

            <h1>
              {scene.situation}
            </h1>
          </div>

          {!controllerScene &&
            !thermalScene &&
            !landingScene &&
            !structureScene &&
            !faultScene &&
            previewOption &&
            !committedOption && (
              <div className="projected-effect">
                <div className="projected-effect-heading">
                  PROJECTED EFFECT
                </div>

                <div className="projected-effect-items">
                  {previewOption.telemetryChanges.map(
                    (change) => (
                      <div
                        className={`projected-effect-item projected-effect-item--${
                          change.status ??
                          "nominal"
                        }`}
                        key={
                          change.label
                        }
                      >
                        <span>
                          {
                            change.label
                          }
                        </span>

                        <strong>
                          {
                            change.value
                          }
                        </strong>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

          <div className="wingmatch-telemetry">
            {visibleTelemetry.map(
              (item) => {
                const isProjected =
                  projectedLabels.has(
                    item.label,
                  );

                return (
                  <div
                    className={[
                      "wingmatch-metric",
                      `wingmatch-metric--${
                        item.status ??
                        "nominal"
                      }`,
                      isProjected
                        ? "wingmatch-metric--projected"
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    key={
                      item.label
                    }
                  >
                    <div className="wingmatch-metric-heading">
                      <span>
                        {
                          item.label
                        }
                      </span>

                      {isProjected &&
                        !committedOption && (
                          <em>
                            PROJECTED
                          </em>
                        )}
                    </div>

                    <strong>
                      {item.value}
                    </strong>
                  </div>
                );
              },
            )}
          </div>
        </div>

        <aside className="decision-panel">
          <div className="decision-kicker">
            {controllerScene
              ? "FLIGHT CONTROL"
              : thermalScene
                ? "THERMAL CONTROL"
                : landingScene
                  ? "LANDING ANALYSIS"
                  : structureScene
                    ? "STRUCTURAL ANALYSIS"
                    : faultScene
                      ? "AVIONICS DIAGNOSTICS"
                      : `DECISION ${String(
                          scene.missionNumber,
                        ).padStart(
                          2,
                          "0",
                        )}`}
          </div>

          <h2>
            {scene.question}
          </h2>

          {controllerScene ? (
            <>
              <p className="decision-hint">
                Change the gain and watch
                how the vehicle responds.
              </p>

              <div
                style={{
                  marginTop:
                    "18px",
                }}
              >
                <ControlTuningPanel
                  config={
                    controllerScene.controller
                  }
                  locked={
                    controllerLocked
                  }
                  onLock={
                    handleControllerLock
                  }
                />
              </div>
            </>
          ) : thermalScene ? (
            <>
              <p className="decision-hint">
                Cooling power is limited.
                Protect critical systems
                while preserving reserve.
              </p>

              <div
                style={{
                  marginTop:
                    "18px",
                }}
              >
                <ThermalAllocationPanel
                  locked={
                    thermalLocked
                  }
                  onLock={
                    handleThermalLock
                  }
                />
              </div>
            </>
          ) : landingScene ? (
            <>
              <p className="decision-hint">
                Compare the reachable sites
                before committing the
                landing.
              </p>

              <div
                style={{
                  marginTop:
                    "18px",
                }}
              >
                <LandingSitePanel
                  locked={
                    landingLocked
                  }
                  onLock={
                    handleLandingLock
                  }
                />
              </div>
            </>
          ) : structureScene ? (
            <>
              <p className="decision-hint">
                Inspect the load path and
                choose where reinforcement
                matters most.
              </p>

              <div
                style={{
                  marginTop:
                    "18px",
                }}
              >
                <StructureScanPanel
                  locked={
                    structureLocked
                  }
                  onLock={
                    handleStructureLock
                  }
                />
              </div>
            </>
          ) : faultScene ? (
            <>
              <p className="decision-hint">
                You can run only three
                diagnostic tests. Gather
                evidence before committing
                to a fault hypothesis.
              </p>

              <div
                style={{
                  marginTop:
                    "18px",
                }}
              >
                <FaultIsolationPanel
                  locked={
                    faultLocked
                  }
                  onLock={
                    handleFaultLock
                  }
                />
              </div>

              {faultLocked &&
                faultResult && (
                  <div className="committed-status">
                    <div>
                      <span>
                        DIAGNOSIS LOCKED
                      </span>

                      <strong>
                        {
                          faultResult.faultName
                        }
                      </strong>
                    </div>

                    <p>
                      Ran{" "}
                      {
                        faultResult.testCount
                      }{" "}
                      of 3 available
                      diagnostic tests.
                    </p>

                    <p>
                      {getFaultConsequence(
                        faultResult,
                      )}
                    </p>

                    <div className="committed-next">
                      Mission 08 —
                      final mission
                    </div>
                  </div>
                )}
            </>
          ) : (
            <>
              <p className="decision-hint">
                No perfect answer. Choose
                the tradeoff you would
                accept.
              </p>

              <div className="decision-options">
                {scene.options.map(
                  (
                    option,
                    index,
                  ) => {
                    const isSelected =
                      previewOption?.id ===
                      option.id;

                    return (
                      <button
                        type="button"
                        key={
                          option.id
                        }
                        className={[
                          "decision-option",
                          isSelected
                            ? "decision-option--selected"
                            : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        onClick={() =>
                          handleChoose(
                            option,
                          )
                        }
                        disabled={Boolean(
                          committedOption,
                        )}
                      >
                        <div className="decision-option-number">
                          {String(
                            index +
                              1,
                          ).padStart(
                            2,
                            "0",
                          )}
                        </div>

                        <div className="decision-option-copy">
                          <strong>
                            {
                              option.title
                            }
                          </strong>

                          <p>
                            {
                              option.description
                            }
                          </p>
                        </div>
                      </button>
                    );
                  },
                )}
              </div>

              {!committedOption && (
                <button
                  type="button"
                  className="commit-button"
                  disabled={
                    !previewOption
                  }
                  onClick={
                    handleChoiceCommit
                  }
                >
                  {previewOption
                    ? "Commit decision"
                    : "Select a tradeoff"}
                </button>
              )}
            </>
          )}
        </aside>
      </section>
    </main>
  );
}

export default WingMatchMission;