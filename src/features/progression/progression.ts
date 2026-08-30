import {
  maybeAwardCosmicForMilestone,
} from "./cosmic-packs";

export type PlayerSkillKey =
  | "systemsThinking"
  | "tradeoffs"
  | "evidenceReasoning"
  | "technicalBuild"
  | "leadership";

export interface PlayerSkills {
  systemsThinking: number;
  tradeoffs: number;
  evidenceReasoning: number;
  technicalBuild: number;
  leadership: number;
}

export interface PlayerProgress {
  xp: number;
  skills: PlayerSkills;
  completedMilestones: string[];
}

export interface ProgressAwardDetail {
  milestoneId: string;
  label: string;
  xpReward: number;
  previous: PlayerProgress;
  current: PlayerProgress;
  previousLevel: number;
  currentLevel: number;
}

export const PLAYER_PROGRESS_EVENT =
  "altwing:progress-awarded";

const PLAYER_PROGRESS_KEY =
  "altwing-player-progress-v1";

const INITIAL_PROGRESS: PlayerProgress = {
  xp: 0,

  skills: {
    systemsThinking: 0,
    tradeoffs: 0,
    evidenceReasoning: 0,
    technicalBuild: 0,
    leadership: 0,
  },

  completedMilestones: [],
};

function freshInitialProgress():
  PlayerProgress {
  return {
    xp: INITIAL_PROGRESS.xp,

    skills: {
      ...INITIAL_PROGRESS.skills,
    },

    completedMilestones: [],
  };
}

export function readPlayerProgress():
  PlayerProgress {
  try {
    const raw =
      localStorage.getItem(
        PLAYER_PROGRESS_KEY,
      );

    if (!raw) {
      return freshInitialProgress();
    }

    const parsed =
      JSON.parse(raw) as
        Partial<PlayerProgress>;

    return {
      xp:
        typeof parsed.xp === "number"
          ? parsed.xp
          : 0,

      skills: {
        ...INITIAL_PROGRESS.skills,
        ...(parsed.skills ?? {}),
      },

      completedMilestones:
        parsed.completedMilestones ?? [],
    };
  } catch {
    return freshInitialProgress();
  }
}

export function savePlayerProgress(
  progress: PlayerProgress,
) {
  localStorage.setItem(
    PLAYER_PROGRESS_KEY,
    JSON.stringify(progress),
  );
}

const LEVEL_THRESHOLDS = [
  0,
  100,
  300,
  700,
  1300,
  2200,
];

export function getPlayerLevel(
  xp: number,
) {
  let level = 1;

  LEVEL_THRESHOLDS.forEach(
    (threshold, index) => {
      if (xp >= threshold) {
        level = index + 1;
      }
    },
  );

  return Math.min(level, 6);
}

export function getPlayerRank(
  level: number,
) {
  switch (level) {
    case 1:
      return "EXPLORER";

    case 2:
      return "APPRENTICE";

    case 3:
      return "BUILDER";

    case 4:
      return "CREATOR";

    case 5:
      return "MISSION LEAD";

    default:
      return "COMMUNITY BUILDER";
  }
}

export function getLevelFloorXP(
  level: number,
) {
  return (
    LEVEL_THRESHOLDS[
      Math.max(
        0,
        Math.min(level - 1, 5),
      )
    ] ?? 0
  );
}

export function getNextLevelXP(
  level: number,
) {
  if (level >= 6) {
    return null;
  }

  return (
    LEVEL_THRESHOLDS[level] ??
    null
  );
}

export function awardMilestone(
  milestoneId: string,
  xpReward: number,
  skillRewards:
    Partial<PlayerSkills> = {},
  label = "Progress earned",
) {
  const current =
    readPlayerProgress();

  if (
    current.completedMilestones.includes(
      milestoneId,
    )
  ) {
    return {
      progress: current,
      awarded: false,
    };
  }

  const previousLevel =
    getPlayerLevel(current.xp);

  const next: PlayerProgress = {
    xp:
      current.xp +
      xpReward,

    skills: {
      systemsThinking:
        current.skills.systemsThinking +
        (skillRewards.systemsThinking ??
          0),

      tradeoffs:
        current.skills.tradeoffs +
        (skillRewards.tradeoffs ??
          0),

      evidenceReasoning:
        current.skills
          .evidenceReasoning +
        (skillRewards
          .evidenceReasoning ?? 0),

      technicalBuild:
        current.skills.technicalBuild +
        (skillRewards.technicalBuild ??
          0),

      leadership:
        current.skills.leadership +
        (skillRewards.leadership ??
          0),
    },

    completedMilestones: [
      ...current.completedMilestones,
      milestoneId,
    ],
  };

  savePlayerProgress(next);

  const currentLevel =
    getPlayerLevel(next.xp);

  const detail: ProgressAwardDetail = {
    milestoneId,
    label,
    xpReward,
    previous: current,
    current: next,
    previousLevel,
    currentLevel,
  };

  window.dispatchEvent(
    new CustomEvent(
      PLAYER_PROGRESS_EVENT,
      {
        detail,
      },
    ),
  );

maybeAwardCosmicForMilestone({
    milestoneId,
    label,
    previousLevel,
    currentLevel,
  });

  return {
    progress: next,
    awarded: true,
  };
}
