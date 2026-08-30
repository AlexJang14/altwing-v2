import {
  getPlayerLevel,
  getPlayerRank,
  readPlayerProgress,
  type PlayerProgress,
} from "./progression";

import {
  CELESTIAL_OBJECTS,
  readCosmicCollection,
  type CosmicCollection,
  type CosmicRarity,
} from "./cosmic";


const rarityValue:
  Record<CosmicRarity, number> = {
    COMMON: 5,
    UNCOMMON: 10,
    RARE: 25,
    EPIC: 55,
    LEGENDARY: 100,
  };


export function getImpactSnapshot(
  progress:
    PlayerProgress =
      readPlayerProgress(),

  collection:
    CosmicCollection =
      readCosmicCollection(),
) {
  const milestones =
    progress.completedMilestones;

  const missions =
    milestones.filter(
      (id) =>
        id.startsWith(
          "aerospace:mission:",
        ),
    ).length;

  const campaignComplete =
    milestones.includes(
      "aerospace:wingmatch:complete",
    );

  const builds =
    milestones.filter(
      (id) =>
        id.startsWith(
          "project:",
        ) &&
        id.includes(
          ":build-complete",
        ),
    ).length;

  const evidence =
    milestones.filter(
      (id) =>
        id.startsWith(
          "evidence:",
        ),
    ).length;

  const leadership =
    milestones.filter(
      (id) =>
        id.startsWith(
          "leadership:",
        ),
    ).length;

  const objects =
    collection.discoveredIds
      .map(
        (id) =>
          CELESTIAL_OBJECTS.find(
            (object) =>
              object.id === id,
          ),
      )
      .filter(
        (
          object,
        ): object is
          NonNullable<
            typeof object
          > =>
          Boolean(object),
      );

  const cosmicBonus =
    objects.reduce(
      (sum, object) =>
        sum +
        rarityValue[
          object.rarity
        ],
      0,
    );

  const explorerScore =
    missions * 20 +
    (campaignComplete
      ? 100
      : 0) +
    builds * 200 +
    evidence * 250 +
    leadership * 300 +
    cosmicBonus;

  const sortedObjects =
    [...objects].sort(
      (a, b) =>
        rarityValue[b.rarity] -
        rarityValue[a.rarity],
    );

  const rarest =
    sortedObjects[0] ??
    null;

  return {
    level:
      getPlayerLevel(
        progress.xp,
      ),

    rank:
      getPlayerRank(
        getPlayerLevel(
          progress.xp,
        ),
      ),

    xp:
      progress.xp,

    missions,
    campaignComplete,
    builds,
    evidence,
    leadership,

    discoveries:
      collection.discoveredIds
        .length,

    stardust:
      collection.stardust,

    explorerScore,
    rarest,

    verifiedExplorersHelped:
      null as number | null,
  };
}


export function getNextQuest(
  progress:
    PlayerProgress =
      readPlayerProgress(),
) {
  const milestones =
    progress.completedMilestones;

  if (
    !milestones.includes(
      "aerospace:wingmatch:complete",
    )
  ) {
    return {
      title:
        "Finish the Aerospace campaign",
      detail:
        "Complete the mini-missions and reveal your first Wing.",
      stage:
        "EXPLORE",
    };
  }

  const hasProject =
    milestones.some(
      (id) =>
        id.startsWith(
          "project:",
        ),
    );

  if (!hasProject) {
    return {
      title:
        "Launch your first Build",
      detail:
        "Turn your Wing into one real engineering project.",
      stage:
        "BUILD",
    };
  }

  const buildComplete =
    milestones.some(
      (id) =>
        id.includes(
          ":build-complete",
        ),
    );

  if (!buildComplete) {
    return {
      title:
        "Finish your Build Quest",
      detail:
        "Complete the active project path and leave evidence.",
      stage:
        "BUILD",
    };
  }

  const hasEvidence =
    milestones.some(
      (id) =>
        id.startsWith(
          "evidence:",
        ),
    );

  if (!hasEvidence) {
    return {
      title:
        "Publish your evidence",
      detail:
        "Make the work visible so someone else can inspect it.",
      stage:
        "PROVE",
    };
  }

  const hasLeadership =
    milestones.some(
      (id) =>
        id.startsWith(
          "leadership:",
        ),
    );

  if (!hasLeadership) {
    return {
      title:
        "Lead another explorer",
      detail:
        "The verified Crew system will measure whether your work helps someone else launch.",
      stage:
        "LEAD",
    };
  }

  return {
    title:
      "Grow the community",
    detail:
      "Keep building, documenting, and helping other explorers move forward.",
    stage:
      "IMPACT",
  };
}
