export type WingId =
  | "propulsion"
  | "aerodynamics"
  | "structures"
  | "gnc"
  | "avionics"
  | "mission-design"
  | "thermal"
  | "systems";

export type ReasoningSignal =
  | "evidence-first"
  | "feedback-control"
  | "physical-modeling"
  | "structural-thinking"
  | "thermal-reasoning"
  | "optimization"
  | "mission-tradeoffs"
  | "systems-integration"
  | "risk-tolerance"
  | "iteration"
  | "quantitative-reasoning";

export type TelemetryStatus =
  | "nominal"
  | "warning"
  | "critical"
  | "uncertain";

export interface TelemetryItem {
  label: string;
  value: string;
  status?: TelemetryStatus;
}

export interface ScoreMap {
  wings?: Partial<Record<WingId, number>>;
  reasoning?: Partial<Record<ReasoningSignal, number>>;
}

export interface MissionOption {
  id: string;
  title: string;
  description: string;
  consequence: string;
  telemetryChanges: TelemetryItem[];
  scores: ScoreMap;
}

export interface MissionScene {
  id: string;
  missionNumber: number;
  totalMissions: number;
  phase: string;
  timeRemaining: string;
  altitude: string;
  situation: string;
  question: string;
  telemetry: TelemetryItem[];
  options: MissionOption[];
}