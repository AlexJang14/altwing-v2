import {
  CELESTIAL_OBJECTS,
  readCosmicCollection,
  type CelestialObject,
  type CosmicCollection,
  type CosmicDiscoveryDetail,
  type CosmicRarity,
} from "./cosmic";


export type CosmicPackType =
  | "MISSION"
  | "LEVEL"
  | "BUILDER"
  | "EVIDENCE"
  | "MISSION_LEAD"
  | "LEGENDARY";


export interface CosmicPack {
  id: string;
  type: CosmicPackType;

  sourceId: string;
  sourceLabel: string;

  earnedAt: string;

  openedAt?: string;

  guaranteedObjectId?: string;
}


export interface CosmicPackInventory {
  packs: CosmicPack[];
}


export interface CosmicPackAwardDetail {
  pack: CosmicPack;

  inventory:
    CosmicPackInventory;
}


export interface CosmicPackOpenResult {
  pack: CosmicPack;

  cards:
    CosmicDiscoveryDetail[];

  collection:
    CosmicCollection;
}


export const COSMIC_PACK_AWARDED_EVENT =
  "altwing:cosmic-pack-awarded";


export const COSMIC_PACK_OPENED_EVENT =
  "altwing:cosmic-pack-opened";


const PACK_STORAGE_KEY =
  "altwing-cosmic-packs-v1";


const COSMIC_STORAGE_KEY =
  "altwing-cosmic-atlas-v1";


const rarityOrder:
  CosmicRarity[] = [
    "COMMON",
    "UNCOMMON",
    "RARE",
    "EPIC",
    "LEGENDARY",
  ];


const packWeights:
  Record<
    CosmicPackType,
    number[]
  > = {

    MISSION:
      [55, 27, 13, 4, 1],

    LEVEL:
      [50, 28, 15, 6, 1],

    BUILDER:
      [25, 35, 25, 13, 2],

    EVIDENCE:
      [10, 30, 35, 20, 5],

    MISSION_LEAD:
      [0, 15, 35, 40, 10],

    LEGENDARY:
      [0, 0, 0, 0, 100],
  };


const duplicateStardust:
  Record<
    CosmicRarity,
    number
  > = {
    COMMON: 20,
    UNCOMMON: 35,
    RARE: 70,
    EPIC: 150,
    LEGENDARY: 300,
  };


export function readCosmicPackInventory():
  CosmicPackInventory {

  try {
    const raw =
      localStorage.getItem(
        PACK_STORAGE_KEY,
      );

    if (!raw) {
      return {
        packs: [],
      };
    }

    const parsed =
      JSON.parse(raw) as
        Partial<
          CosmicPackInventory
        >;

    return {
      packs:
        parsed.packs ?? [],
    };

  } catch {
    return {
      packs: [],
    };
  }
}


function savePackInventory(
  inventory:
    CosmicPackInventory,
) {
  localStorage.setItem(
    PACK_STORAGE_KEY,
    JSON.stringify(
      inventory,
    ),
  );
}


function saveCollection(
  collection:
    CosmicCollection,
) {
  localStorage.setItem(
    COSMIC_STORAGE_KEY,
    JSON.stringify(
      collection,
    ),
  );
}


export function awardCosmicPack(
  sourceId: string,
  type: CosmicPackType,
  sourceLabel: string,
  guaranteedObjectId?: string,
) {
  const inventory =
    readCosmicPackInventory();


  const existing =
    inventory.packs.find(
      (pack) =>
        pack.sourceId ===
        sourceId,
    );


  if (existing) {
    return {
      pack: existing,
      inventory,
      awarded: false,
    };
  }


  const pack:
    CosmicPack = {
      id:
        `pack:${sourceId}`,

      type,

      sourceId,

      sourceLabel,

      earnedAt:
        new Date()
          .toISOString(),

      ...(guaranteedObjectId
        ? {
            guaranteedObjectId,
          }
        : {}),
    };


  const next:
    CosmicPackInventory = {
      packs: [
        ...inventory.packs,
        pack,
      ],
    };


  savePackInventory(next);


  const detail:
    CosmicPackAwardDetail = {
      pack,

      inventory: next,
    };


  window.dispatchEvent(
    new CustomEvent(
      COSMIC_PACK_AWARDED_EVENT,
      {
        detail,
      },
    ),
  );


  return {
    pack,
    inventory: next,
    awarded: true,
  };
}


function rollRarity(
  type: CosmicPackType,
): CosmicRarity {

  const weights =
    packWeights[type];

  const roll =
    Math.random() * 100;

  let running = 0;


  for (
    let index = 0;
    index < weights.length;
    index += 1
  ) {
    running +=
      weights[index];


    if (roll <= running) {
      return (
        rarityOrder[index] ??
        "COMMON"
      );
    }
  }


  return "COMMON";
}


function chooseObject(
  rarity: CosmicRarity,
  excludeIds:
    string[] = [],
) {
  const available =
    CELESTIAL_OBJECTS.filter(
      (object) =>
        object.rarity ===
          rarity &&

        object.unlockMode !==
          "ACHIEVEMENT" &&

        !excludeIds.includes(
          object.id,
        ),
    );


  const fallback =
    CELESTIAL_OBJECTS.filter(
      (object) =>
        object.rarity ===
          rarity &&

        object.unlockMode !==
          "ACHIEVEMENT",
    );


  const candidates =
    available.length > 0
      ? available
      : fallback;


  if (
    candidates.length === 0
  ) {
    return undefined;
  }


  return candidates[
    Math.floor(
      Math.random() *
        candidates.length,
    )
  ];
}


function addObjectToCollection(
  object: CelestialObject,
  sourceId: string,
  sourceLabel: string,
): CosmicDiscoveryDetail {

  const collection =
    readCosmicCollection();


  const duplicate =
    collection.discoveredIds
      .includes(
        object.id,
      );


  const stardustGain =
    duplicate
      ? duplicateStardust[
          object.rarity
        ]
      : 0;


  const next:
    CosmicCollection = {

      discoveredIds:
        duplicate
          ? [
              ...collection
                .discoveredIds,
            ]
          : [
              ...collection
                .discoveredIds,
              object.id,
            ],


      discoverySources: [
        ...collection
          .discoverySources,
        sourceId,
      ],


      stardust:
        collection.stardust +
        stardustGain,


      history: [
        ...collection.history,

        {
          objectId:
            object.id,

          sourceId,

          sourceLabel,

          discoveredAt:
            new Date()
              .toISOString(),

          duplicate,
        },
      ],
    };


  saveCollection(next);


  return {
    object,

    duplicate,

    stardustGain,

    sourceLabel,

    collection: next,
  };
}


export function openCosmicPack(
  packId: string,
):
  CosmicPackOpenResult | null {

  const inventory =
    readCosmicPackInventory();


  const pack =
    inventory.packs.find(
      (item) =>
        item.id === packId,
    );


  if (
    !pack ||
    pack.openedAt
  ) {
    return null;
  }


  const cardCount =
    pack.type ===
    "LEGENDARY"
      ? 1
      : 3;


  const cards:
    CosmicDiscoveryDetail[] = [];


  const chosenIds:
    string[] = [];


  for (
    let index = 0;
    index < cardCount;
    index += 1
  ) {
    let object:
      CelestialObject | undefined;


    if (
      index === 0 &&
      pack.guaranteedObjectId
    ) {
      object =
        CELESTIAL_OBJECTS.find(
          (item) =>
            item.id ===
            pack.guaranteedObjectId,
        );
    }


    if (!object) {
      const rarity =
        rollRarity(
          pack.type,
        );

      object =
        chooseObject(
          rarity,
          chosenIds,
        );
    }


    if (!object) {
      continue;
    }


    chosenIds.push(
      object.id,
    );


    cards.push(
      addObjectToCollection(
        object,

        `${pack.id}:card:${
          index + 1
        }`,

        `${pack.sourceLabel} · Card ${
          index + 1
        }`,
      ),
    );
  }


  const openedPack:
    CosmicPack = {
      ...pack,

      openedAt:
        new Date()
          .toISOString(),
  };


  const nextInventory:
    CosmicPackInventory = {
      packs:
        inventory.packs.map(
          (item) =>
            item.id ===
            pack.id
              ? openedPack
              : item,
        ),
  };


  savePackInventory(
    nextInventory,
  );


  const result:
    CosmicPackOpenResult = {
      pack:
        openedPack,

      cards,

      collection:
        readCosmicCollection(),
  };


  window.dispatchEvent(
    new CustomEvent(
      COSMIC_PACK_OPENED_EVENT,
      {
        detail: result,
      },
    ),
  );


  return result;
}


interface MilestonePackInput {
  milestoneId: string;

  label: string;

  previousLevel: number;

  currentLevel: number;
}


export function maybeAwardCosmicForMilestone({
  milestoneId,
  label,
  previousLevel,
  currentLevel,
}: MilestonePackInput) {


  /* VERIFIED ACHIEVEMENT LEGENDARIES */

  if (
    milestoneId ===
    "leadership:crew:verified:1"
  ) {
    return awardCosmicPack(
      "achievement:mission-lead",
      "LEGENDARY",
      "Verified Mission Lead",
      "sagittarius-a-star",
    );
  }


  if (
    milestoneId ===
    "leadership:crew:verified:3"
  ) {
    return awardCosmicPack(
      "achievement:crew-3",
      "LEGENDARY",
      "Three Explorers Launched",
      "m87-star",
    );
  }


  if (
    milestoneId ===
    "leadership:community:verified:5"
  ) {
    return awardCosmicPack(
      "achievement:community-builder",
      "LEGENDARY",
      "Verified Community Builder",
      "ton-618",
    );
  }


  /* WINGMATCH */

  if (
    milestoneId ===
    "aerospace:wingmatch:complete"
  ) {
    return awardCosmicPack(
      `reward:${milestoneId}`,
      "MISSION",
      "Aerospace Mission Complete",
    );
  }


  /* BUILD */

  if (
    milestoneId.startsWith(
      "project:",
    ) &&
    milestoneId.includes(
      ":build-complete",
    )
  ) {
    return awardCosmicPack(
      `reward:${milestoneId}`,
      "BUILDER",
      label,
    );
  }


  /* EVIDENCE */

  if (
    milestoneId.startsWith(
      "evidence:",
    )
  ) {
    return awardCosmicPack(
      `reward:${milestoneId}`,
      "EVIDENCE",
      label,
    );
  }


  /* LEADERSHIP */

  if (
    milestoneId.startsWith(
      "leadership:",
    )
  ) {
    return awardCosmicPack(
      `reward:${milestoneId}`,
      "MISSION_LEAD",
      label,
    );
  }


  /* LEVEL UP */

  if (
    currentLevel >
    previousLevel
  ) {
    return awardCosmicPack(
      `level:${currentLevel}`,
      "LEVEL",
      `Reached LV.${currentLevel}`,
    );
  }


  return null;
}
