import { useEffect, useMemo, useState } from "react";

import ControlTuningPanel from "../interactions/ControlTuningPanel";
import type { ControllerTuningResult } from "../interactions/ControlTuningPanel";

import ThermalAllocationPanel from "../interactions/ThermalAllocationPanel";
import type { ThermalAllocationResult } from "../interactions/ThermalAllocationPanel";

import LandingSitePanel from "../interactions/LandingSitePanel";
import type { LandingSiteResult } from "../interactions/LandingSitePanel";

import StructureScanPanel from "../interactions/StructureScanPanel";
import type { StructureScanResult } from "../interactions/StructureScanPanel";

import FaultIsolationPanel from "../interactions/FaultIsolationPanel";
import type { FaultIsolationResult } from "../interactions/FaultIsolationPanel";

import FinalMissionPanel from "../interactions/FinalMissionPanel";
import type { FinalMissionResult } from "../interactions/FinalMissionPanel";

import WingMatchResult from "../result/WingMatchResult";
import WingRevealLoading from "../result/WingRevealLoading";
import PlayerProgressHUD from "../../progression/PlayerProgressHUD";
import { awardMilestone } from "../../progression/progression";
import BuildWing from "../build/BuildWing";
import MissionVisual from "../visuals/MissionVisual";

import {
  controlOscillationMission,
  missionScenes,
} from "./missionScenes";

import { thermalManagementMission } from "../missions/thermalMission";
import { landingSiteMission } from "../missions/landingMission";
import { structureMission } from "../missions/structureMission";
import { faultIsolationMission } from "../missions/faultMission";
import { finalMission } from "../missions/finalMission";

import type {
  ControllerMissionScene,
  MissionOption,
  MissionScene,
  ReasoningSignal,
  TelemetryItem,
  WingId,
} from "./types";

import "../styles/wingmatch.css";

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

interface LiveMissionState {
  safety: number;
  science: number;
  resources: number;
  confidence: number;
}

interface LiveMissionDelta {
  safety?: number;
  science?: number;
  resources?: number;
  confidence?: number;
}

interface PersistedMissionSnapshot {
  sceneIndex: number;
  wingScores: WingScores;
  reasoningScores: ReasoningScores;
  missionHistory: MissionHistoryItem[];
  missionState: LiveMissionState;
}

const MISSION_STATE_STORAGE_KEY =
  "altwing-wingmatch-v3-state";

const INITIAL_MISSION_STATE: LiveMissionState = {
  safety: 72,
  science: 58,
  resources: 70,
  confidence: 62,
};

function clampMissionValue(
  value: number,
) {
  return Math.max(
    0,
    Math.min(
      100,
      Math.round(value),
    ),
  );
}

function applyMissionDelta(
  current: LiveMissionState,
  delta: LiveMissionDelta,
): LiveMissionState {
  return {
    safety: clampMissionValue(
      current.safety +
        (delta.safety ?? 0),
    ),

    science: clampMissionValue(
      current.science +
        (delta.science ?? 0),
    ),

    resources: clampMissionValue(
      current.resources +
        (delta.resources ?? 0),
    ),

    confidence: clampMissionValue(
      current.confidence +
        (delta.confidence ?? 0),
    ),
  };
}

function readMissionSnapshot():
  | PersistedMissionSnapshot
  | null {
  try {
    const raw =
      localStorage.getItem(
        MISSION_STATE_STORAGE_KEY,
      );

    if (!raw) {
      return null;
    }

    const parsed =
      JSON.parse(raw) as
        PersistedMissionSnapshot;

    if (
      typeof parsed.sceneIndex !==
        "number" ||
      !parsed.missionState
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function getOptionMissionDelta(
  option: MissionOption,
): LiveMissionDelta {
  const reasoning =
    option.scores.reasoning ?? {};

  const wings =
    option.scores.wings ?? {};

  const risk =
    reasoning[
      "risk-tolerance"
    ] ?? 0;

  const systems =
    reasoning[
      "systems-integration"
    ] ?? 0;

  const tradeoff =
    reasoning[
      "mission-tradeoffs"
    ] ?? 0;

  const optimization =
    reasoning.optimization ?? 0;

  const quantitative =
    reasoning[
      "quantitative-reasoning"
    ] ?? 0;

  const iteration =
    reasoning.iteration ?? 0;

  const missionDesign =
    wings[
      "mission-design"
    ] ?? 0;

  return {
    safety:
      systems * 2 +
      tradeoff -
      risk * 2,

    science:
      missionDesign * 2 +
      risk * 2,

    resources:
      optimization * 2 -
      risk,

    confidence:
      quantitative * 2 +
      iteration,
  };
}

function getControllerMissionDelta(
  result: ControllerTuningResult,
): LiveMissionDelta {
  if (
    result.responseState ===
    "balanced"
  ) {
    return {
      safety: 9,
      resources: -2,
      confidence: 10,
    };
  }

  if (
    result.responseState ===
    "slow"
  ) {
    return {
      safety: 4,
      resources: -4,
      confidence: 2,
    };
  }

  return {
    safety: -9,
    resources: -3,
    confidence: -7,
  };
}

function getThermalMissionDelta(
  result: ThermalAllocationResult,
): LiveMissionDelta {
  switch (result.state) {
    case "balanced":
      return {
        safety: 10,
        resources: 4,
        confidence: 7,
      };

    case "engine-risk":
      return {
        safety: -8,
        resources: 4,
        confidence: -3,
      };

    case "battery-risk":
      return {
        safety: -5,
        resources: 2,
        confidence: -2,
      };

    case "avionics-risk":
      return {
        safety: -7,
        confidence: -5,
      };

    case "low-reserve":
      return {
        safety: 4,
        resources: -12,
        confidence: -2,
      };

    default:
      return {};
  }
}

function getLandingMissionDelta(
  result: LandingSiteResult,
): LiveMissionDelta {
  if (result.siteId === "site-a") {
    return {
      safety: 10,
      science: -6,
      resources: -7,
      confidence: 6,
    };
  }

  if (result.siteId === "site-b") {
    return {
      safety: 4,
      science: 7,
      resources: 3,
      confidence: 5,
    };
  }

  return {
    safety: -8,
    science: 13,
    resources: -4,
    confidence: -3,
  };
}

function getStructureMissionDelta(
  result: StructureScanResult,
): LiveMissionDelta {
  switch (result.zoneId) {
    case "main-strut":
      return {
        safety: 10,
        resources: -9,
        confidence: 7,
      };

    case "lower-joint":
      return {
        safety: 7,
        resources: -4,
        confidence: 6,
      };

    case "upper-joint":
      return {
        safety: 2,
        resources: -3,
        confidence: 1,
      };

    case "footpad":
      return {
        safety: 3,
        resources: -5,
        confidence: 1,
      };

    default:
      return {};
  }
}

function getFaultMissionDelta(
  result: FaultIsolationResult,
): LiveMissionDelta {
  if (
    result.faultId === "rf-path" &&
    result.foundRfEvidence
  ) {
    return {
      safety: 5,
      resources: -2,
      confidence: 13,
    };
  }

  if (
    result.faultId === "rf-path"
  ) {
    return {
      safety: 1,
      resources: -1,
      confidence: -4,
    };
  }

  return {
    safety: -5,
    resources: -3,
    confidence: -10,
  };
}

function getFinalMissionDelta(
  result: FinalMissionResult,
): LiveMissionDelta {
  return {
    safety:
      (result.allocations.safety -
        25) /
      2,

    science:
      (result.allocations.science -
        25) /
      2,

    resources:
      (result.allocations
        .communications -
        25) /
      4,

    confidence:
      (result.allocations
        .verification -
        25) /
      2,
  };
}

const activeMissionScenes: MissionScene[] = [
  ...missionScenes,
  controlOscillationMission,
  thermalManagementMission,
  landingSiteMission,
  structureMission,
  faultIsolationMission,
  finalMission,
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
      label: "COOLING SPLIT",
      value:
        `E${result.engine} / B${result.battery} / A${result.avionics}`,
      status: "nominal",
    },
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
    {
      label: "FUEL COST",
      value: result.fuelCost,
      status:
        result.fuelCost === "HIGH"
          ? "warning"
          : "nominal",
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
      value: result.bucklingMargin.toFixed(2),
      status:
        result.bucklingMargin < 1.3
          ? "warning"
          : "nominal",
    },
    {
      label: "ADDED MASS",
      value: `+${result.reinforcementMass} kg`,
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
      label: "RECOVERY",
      value:
        result.recoveryActionName,
      status: "nominal",
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

function getFinalEffects(
  result: FinalMissionResult,
): TelemetryItem[] {
  return [
    {
      label: "COMMS",
      value: `${result.allocations.communications} pts`,
      status: "nominal",
    },
    {
      label: "SAFETY",
      value: `${result.allocations.safety} pts`,
      status: "nominal",
    },
    {
      label: "SCIENCE",
      value: `${result.allocations.science} pts`,
      status: "nominal",
    },
    {
      label: "VERIFY",
      value: `${result.allocations.verification} pts`,
      status: "nominal",
    },
  ];
}

function getFinalConsequence(
  result: FinalMissionResult,
) {
  switch (result.dominantPriority) {
    case "communications":
      return "You made restoring the communication link the mission's highest priority, protecting the ability to return data and command the vehicle.";

    case "safety":
      return "You prioritized vehicle survival and system margin before extending surface operations.";

    case "science":
      return "You accepted tighter operational margins to protect the remaining science opportunity.";

    case "verification":
      return "You prioritized confidence in the vehicle state before committing additional mission resources.";

    default:
      return "You created a final systems-level mission plan under competing constraints.";
  }
}

function WingMatchMission({
  onExit,
}: WingMatchMissionProps) {
  const [showBuild, setShowBuild] =
    useState(false);

  const [
    missionFlyby,
    setMissionFlyby,
  ] = useState(false);

  const [persistedSnapshot] =
    useState(() =>
      readMissionSnapshot(),
    );
const [sceneIndex, setSceneIndex] =
  useState(() => {
    const params =
      new URLSearchParams(
        window.location.search,
      );

    const requestedMission =
      Number(
        params.get("mission"),
      );

    if (
      requestedMission >= 1 &&
      requestedMission <=
        activeMissionScenes.length
    ) {
      return requestedMission - 1;
    }

    return (
      persistedSnapshot?.sceneIndex ??
      0
    );
  });

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
    finalLocked,
    setFinalLocked,
  ] = useState(false);

  const [
    finalResult,
    setFinalResult,
  ] =
    useState<FinalMissionResult | null>(
      null,
    );

  const [
    showResult,
    setShowResult,
  ] = useState(false);

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
  ] = useState<WingScores>(
    persistedSnapshot?.wingScores ??
      {},
  );

  const [
    reasoningScores,
    setReasoningScores,
  ] =
    useState<ReasoningScores>(
      persistedSnapshot
        ?.reasoningScores ?? {},
    );

  const [
    missionHistory,
    setMissionHistory,
  ] =
    useState<MissionHistoryItem[]>(
      persistedSnapshot
        ?.missionHistory ?? [],
    );

  const [
    missionState,
    setMissionState,
  ] = useState<LiveMissionState>(
    persistedSnapshot
      ?.missionState ??
      INITIAL_MISSION_STATE,
  );

  useEffect(() => {
    const snapshot:
      PersistedMissionSnapshot = {
        sceneIndex,
        wingScores,
        reasoningScores,
        missionHistory,
        missionState,
      };

    localStorage.setItem(
      MISSION_STATE_STORAGE_KEY,
      JSON.stringify(snapshot),
    );
  }, [
    sceneIndex,
    wingScores,
    reasoningScores,
    missionHistory,
    missionState,
  ]);

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
    scene.id === "landing-site-selection"
      ? scene
      : null;

  const structureScene =
    scene.id === "structural-load-path"
      ? scene
      : null;

  const faultScene =
    scene.id === "avionics-fault-isolation"
      ? scene
      : null;

  const finalScene =
    scene.id === "mission-command"
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
        finalScene &&
        finalResult
      ) {
        return getFinalEffects(
          finalResult,
        );
      }

      if (
        controllerScene ||
        thermalScene ||
        landingScene ||
        structureScene ||
        faultScene ||
        finalScene ||
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
      finalScene,
      thermalResult,
      landingResult,
      structureResult,
      faultResult,
      finalResult,
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

  const previewMissionState =
    useMemo(() => {
      if (
        !previewOption ||
        committedOption ||
        controllerScene ||
        thermalScene ||
        landingScene ||
        structureScene ||
        faultScene ||
        finalScene
      ) {
        return missionState;
      }

      return applyMissionDelta(
        missionState,
        getOptionMissionDelta(
          previewOption,
        ),
      );
    }, [
      missionState,
      previewOption,
      committedOption,
      controllerScene,
      thermalScene,
      landingScene,
      structureScene,
      faultScene,
      finalScene,
    ]);

  const missionStateItems = [
    {
      label: "SAFETY",
      value:
        previewMissionState.safety,
      base: missionState.safety,
    },
    {
      label: "SCIENCE",
      value:
        previewMissionState.science,
      base: missionState.science,
    },
    {
      label: "RESOURCES",
      value:
        previewMissionState.resources,
      base: missionState.resources,
    },
    {
      label: "CONFIDENCE",
      value:
        previewMissionState.confidence,
      base: missionState.confidence,
    },
  ];

  const hasNextBuiltScene =
    sceneIndex <
    activeMissionScenes.length - 1;

  function resetMissionState() {
    setMissionFlyby(false);
    setSceneIndex(0);

    setPreviewOption(null);
    setCommittedOption(null);

    setControllerLocked(false);

    setThermalLocked(false);
    setThermalResult(null);

    setLandingLocked(false);
    setLandingResult(null);

    setStructureLocked(false);
    setStructureResult(null);

    setFaultLocked(false);
    setFaultResult(null);

    setFinalLocked(false);
    setFinalResult(null);

    setCommitFlash(null);

    setWingScores({});
    setReasoningScores({});
    setMissionHistory([]);

    setMissionState(
      INITIAL_MISSION_STATE,
    );

    localStorage.removeItem(
      MISSION_STATE_STORAGE_KEY,
    );

    setShowResult(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

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

    setThermalLocked(false);
    setThermalResult(null);

    setLandingLocked(false);
    setLandingResult(null);

    setStructureLocked(false);
    setStructureResult(null);

    setFaultLocked(false);
    setFaultResult(null);

    setFinalLocked(false);
    setFinalResult(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function showDecisionFlash(
    title: string,
    effects: TelemetryItem[],
  ) {
    awardMilestone(
      `aerospace:mission:${scene.id}`,
      10,
      {},
      `${scene.phase} cleared`,
    );

    setCommitFlash({
      title,
      effects,
      continues: hasNextBuiltScene,
    });

    window.setTimeout(() => {
      setCommitFlash(null);

      if (hasNextBuiltScene) {
        setMissionFlyby(true);

        window.setTimeout(() => {
          advanceMission();
          setMissionFlyby(false);
        }, 700);
      }
    }, 820);
  }

  function showFinalResult(
    title: string,
    effects: TelemetryItem[],
  ) {
    setCommitFlash({
      title,
      effects,
      continues: false,
    });

    window.setTimeout(() => {
      setCommitFlash(null);
      setShowResult(true);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 1200);
  }

  function handleChoose(
    option: MissionOption,
  ) {
    if (committedOption) {
      return;
    }

    setPreviewOption(option);
    handleChoiceCommit(option);
  }

  function handleChoiceCommit(
    optionOverride?: MissionOption,
  ) {
    const choice =
      optionOverride ??
      previewOption;
    if (
      !choice ||
      committedOption ||
      controllerScene ||
      thermalScene ||
      landingScene ||
      structureScene ||
      faultScene ||
      finalScene
    ) {
      return;
    }

    const nextWingScores =
      addScores(
        wingScores,
        choice.scores.wings,
      );

    const nextReasoningScores =
      addScores(
        reasoningScores,
        choice.scores.reasoning,
      );

    const historyItem:
      MissionHistoryItem = {
        sceneId: scene.id,
        phase: scene.phase,
        title: choice.title,
        consequence:
          choice.consequence,
        effects:
          choice.telemetryChanges,
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

    setMissionState(
      (current) =>
        applyMissionDelta(
          current,
          getOptionMissionDelta(
            choice,
          ),
        ),
    );

    setCommittedOption(
      choice,
    );

    showDecisionFlash(
      choice.title,
      choice.telemetryChanges,
    );  }

  function handleControllerLock(
    result: ControllerTuningResult,
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

    setMissionState(
      (current) =>
        applyMissionDelta(
          current,
          getControllerMissionDelta(
            result,
          ),
        ),
    );

    setControllerLocked(true);

    showDecisionFlash(
      title,
      effects,
    );
  }

  function handleThermalLock(
    result: ThermalAllocationResult,
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

    setMissionState(
      (current) =>
        applyMissionDelta(
          current,
          getThermalMissionDelta(
            result,
          ),
        ),
    );

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

    setMissionState(
      (current) =>
        applyMissionDelta(
          current,
          getLandingMissionDelta(
            result,
          ),
        ),
    );

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

    setMissionState(
      (current) =>
        applyMissionDelta(
          current,
          getStructureMissionDelta(
            result,
          ),
        ),
    );

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

    setMissionState(
      (current) =>
        applyMissionDelta(
          current,
          getFaultMissionDelta(
            result,
          ),
        ),
    );

    setFaultResult(result);
    setFaultLocked(true);

    showDecisionFlash(
      title,
      effects,
    );
  }

  function handleFinalLock(
    result: FinalMissionResult,
  ) {
    if (
      !finalScene ||
      finalLocked
    ) {
      return;
    }

    const balanceScore =
      result.balanceSpread <= 20
        ? 3
        : result.balanceSpread <= 40
          ? 2
          : 1;

    const iterationScore =
      result.adjustments >= 12
        ? 3
        : result.adjustments >= 6
          ? 2
          : 1;

    const incomingWingScores:
      WingScores = {
        systems: 3,

        avionics:
          result.allocations
            .communications >= 25
            ? 2
            : 1,

        "mission-design":
          result.allocations
            .science >= 25
            ? 2
            : 1,

        gnc:
          result.allocations
            .verification >= 25
            ? 2
            : 1,
      };

    const incomingReasoningScores:
      ReasoningScores = {
        "systems-integration": 3,
        "mission-tradeoffs": 3,

        optimization:
          balanceScore,

        iteration:
          iterationScore,

        "quantitative-reasoning":
          2,
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
      getFinalEffects(result);

    const consequence =
      getFinalConsequence(
        result,
      );

    const title =
      `${result.dominantPriorityName} prioritized`;

    const finalHistory = [
      ...missionHistory,
      {
        sceneId: scene.id,
        phase: scene.phase,
        title,
        consequence,
        effects,
      },
    ];

    setWingScores(
      nextWingScores,
    );

    setReasoningScores(
      nextReasoningScores,
    );

    setMissionHistory(
      finalHistory,
    );

    setMissionState(
      (current) =>
        applyMissionDelta(
          current,
          getFinalMissionDelta(
            result,
          ),
        ),
    );

    setFinalResult(result);
    setFinalLocked(true);

    console.group(
      "AltWing WingMatch — COMPLETE",
    );

    console.log(
      "Final Wing scores:",
      nextWingScores,
    );

    console.log(
      "Final Reasoning scores:",
      nextReasoningScores,
    );

    console.log(
      "Mission history:",
      finalHistory,
    );

    console.groupEnd();

    awardMilestone(
      "aerospace:wingmatch:complete",
      50,
      {
        systemsThinking: 1,
        tradeoffs: 1,
        evidenceReasoning: 1,
      },
      "Aerospace WingMatch complete",
    );

    showFinalResult(
      title,
      effects,
    );
  }

  const topWingEntry = Object.entries(wingScores).sort(
    ([, scoreA], [, scoreB]) =>
      (scoreB ?? 0) - (scoreA ?? 0),
  )[0];

  const topWingId = topWingEntry?.[0] ?? "systems";

  const wingNames: Record<string, string> = {
    systems: "Systems Engineering",
    gnc: "Guidance, Navigation & Control",
    avionics: "Avionics",
    structures: "Structures",
    thermal: "Thermal Engineering",
    propulsion: "Propulsion",
    "mission-design": "Mission Design",
  };

  const topWingName =
    wingNames[topWingId] ?? "Aerospace Engineering";

  if (showBuild) {
    return (
      <BuildWing
        wingId={topWingId}
        wingName={topWingName}
        onBack={() => setShowBuild(false)}
      />
    );
  }

  if (showResult) {
    return (
      <WingRevealLoading>
        <WingMatchResult
          wingScores={
            wingScores
          }
          reasoningScores={
            reasoningScores
          }
          missionHistory={
            missionHistory
          }
          onRestart={
            resetMissionState
          }
          onContinue={() =>
            setShowBuild(true)
          }
        />
      </WingRevealLoading>
    );
  }

  return (
    <main className="wingmatch-shell">
      <PlayerProgressHUD />

      {missionFlyby && (
        <div
          className="mission-flyby"
          aria-hidden="true"
        >
          <div className="mission-flyby__trail" />

          <img
            src="/brand/altwing-penguin.png"
            alt=""
            className="mission-flyby__penguin"
          />

          <div className="mission-flyby__label">
            <span>NEXT</span>

            <strong>
              MISSION{" "}
              {String(
                sceneIndex + 2,
              ).padStart(2, "0")}{" "}
              INCOMING
            </strong>
          </div>
        </div>
      )}

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
                : "GENERATING WINGMATCH"}
            </p>
          </div>
        </div>
      )}

      <header className="wingmatch-header">
        <button
          className="wingmatch-brand"
          type="button"
          onClick={onExit}
          aria-label="Return to AltWing home"
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

          <div className="mission-state">
            <div className="mission-state-heading">
              <div>
                <span className="wingmatch-live-dot" />
                MISSION STATE
              </div>

              <span>
                {previewOption &&
                !committedOption &&
                !controllerScene &&
                !thermalScene &&
                !landingScene &&
                !structureScene &&
                !faultScene &&
                !finalScene
                  ? "PREVIEWING CONSEQUENCES"
                  : "LIVE"}
              </span>
            </div>

            <div className="mission-state-grid">
              {missionStateItems.map(
                (item) => {
                  const delta =
                    item.value -
                    item.base;

                  const projected =
                    delta !== 0;

                  return (
                    <div
                      key={item.label}
                      className={[
                        "mission-state-item",
                        projected
                          ? "mission-state-item--projected"
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <div className="mission-state-item-top">
                        <span>
                          {item.label}
                        </span>

                        <strong>
                          {item.value}
                        </strong>
                      </div>

                      <div className="mission-state-track">
                        <div
                          className="mission-state-fill"
                          style={{
                            width: `${item.value}%`,
                          }}
                        />
                      </div>

                      {projected && (
                        <small
                          className={
                            delta > 0
                              ? "mission-state-delta mission-state-delta--up"
                              : "mission-state-delta mission-state-delta--down"
                          }
                        >
                          {delta > 0
                            ? "+"
                            : ""}
                          {delta}
                        </small>
                      )}
                    </div>
                  );
                },
              )}
            </div>
          </div>

          {!controllerScene &&
            !thermalScene &&
            !landingScene &&
            !structureScene &&
            !faultScene &&
            !finalScene && (
              <MissionVisual
                sceneId={
                  scene.id
                }
                altitude={
                  scene.altitude
                }
                previewOptionId={
                  previewOption?.id
                }
              />
            )}

          {(controllerScene ||
            thermalScene ||
            landingScene ||
            structureScene ||
            faultScene ||
            finalScene) && (
            <div className="wingmatch-phase">
              <span>
                {scene.phase}
              </span>

              <h1>
                {scene.situation}
              </h1>
            </div>
          )}

          {!controllerScene &&
            !thermalScene &&
            !landingScene &&
            !structureScene &&
            !faultScene &&
            !finalScene &&
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
                      : finalScene
                        ? "MISSION COMMAND"
                        : `${scene.phase} / ${String(
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
                Change the gain and
                watch how the vehicle
                responds. Test the
                control behavior before
                locking the setting.
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
                Cooling power is
                limited. Protect
                critical systems while
                preserving reserve.
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
                Compare the reachable
                sites before committing
                the landing.
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
                Inspect the load path
                and choose where
                reinforcement matters
                most.
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
                diagnostic tests.
                Gather evidence before
                committing to a fault
                hypothesis.
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
            </>
          ) : finalScene ? (
            <>
              <p className="decision-hint">
                You control the final
                100 mission points.
                Allocate them across
                competing objectives
                before executing the
                final mission plan.
              </p>

              <div
                style={{
                  marginTop:
                    "18px",
                }}
              >
                <FinalMissionPanel
                  locked={
                    finalLocked
                  }
                  onLock={
                    handleFinalLock
                  }
                />
              </div>

              {finalLocked &&
                finalResult && (
                  <div className="committed-status">
                    <div>
                      <span>
                        FINAL PLAN
                        EXECUTED
                      </span>

                      <strong>
                        {
                          finalResult.dominantPriorityName
                        }
                      </strong>
                    </div>

                    <p>
                      {getFinalConsequence(
                        finalResult,
                      )}
                    </p>

                    <div className="committed-next">
                      Generating your
                      WingMatch...
                    </div>
                  </div>
                )}
            </>
          ) : (
            <>
              <div className="decision-options decision-options--console">
                {scene.options.map(
                  (option) => {
                    const isCommitted =
                      committedOption?.id ===
                      option.id;

                    return (
                      <button
                        type="button"
                        key={option.id}
                        className={[
                          "decision-option",
                          "decision-option--action",
                          isCommitted
                            ? "decision-option--committed"
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
                          →
                        </div>

                        <div className="decision-option-copy">
                          <strong>
                            {option.title}
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
            </>
          )}
        </aside>
      </section>
    </main>
  );
}

export default WingMatchMission;