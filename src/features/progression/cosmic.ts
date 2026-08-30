export type CosmicRarity =
  | "COMMON"
  | "UNCOMMON"
  | "RARE"
  | "EPIC"
  | "LEGENDARY";

export type CosmicRewardTier =
  | "level"
  | "project"
  | "evidence"
  | "leadership"
  | "community";

export type CosmicUnlockMode =
  | "RANDOM"
  | "ACHIEVEMENT";

export interface CelestialObject {
  id: string;
  name: string;
  rarity: CosmicRarity;
  category: string;
  shortType: string;
  fact: string;

  unlockMode?:
    CosmicUnlockMode;

  unlockRequirement?:
    string;
}

export interface CosmicHistoryItem {
  objectId: string;
  sourceId: string;
  sourceLabel: string;
  discoveredAt: string;
  duplicate: boolean;
}

export interface CosmicCollection {
  discoveredIds: string[];
  discoverySources: string[];
  stardust: number;
  history: CosmicHistoryItem[];
}

export interface CosmicDiscoveryDetail {
  object: CelestialObject;
  duplicate: boolean;
  stardustGain: number;
  sourceLabel: string;
  collection: CosmicCollection;
}

export const COSMIC_DISCOVERY_EVENT =
  "altwing:cosmic-discovery";

const COSMIC_STORAGE_KEY =
  "altwing-cosmic-atlas-v1";


export const CELESTIAL_OBJECTS:
  CelestialObject[] = [

    /* =========================
       COMMON
       ========================= */

    {
      id: "rocky-world",
      name: "Rocky World",
      rarity: "COMMON",
      category: "PLANET",
      shortType:
        "Terrestrial Planet",
      fact:
        "Rocky planets are built mainly from rock and metal, like Earth, Mars, Venus, and Mercury.",
    },

    {
      id: "ice-world",
      name: "Ice World",
      rarity: "COMMON",
      category: "PLANET",
      shortType:
        "Frozen World",
      fact:
        "Ice-rich worlds can preserve frozen water and other volatile materials for billions of years.",
    },

    {
      id: "gas-giant",
      name: "Gas Giant",
      rarity: "COMMON",
      category: "PLANET",
      shortType:
        "Giant Planet",
      fact:
        "Gas giants are enormous worlds dominated by hydrogen and helium, similar to Jupiter and Saturn.",
    },

    {
      id: "desert-world",
      name: "Desert World",
      rarity: "COMMON",
      category: "PLANET",
      shortType:
        "Dry Terrestrial World",
      fact:
        "A dry rocky world can experience extreme temperature changes when little water or atmosphere moderates its climate.",
    },

    {
      id: "ringed-giant",
      name: "Ringed Giant",
      rarity: "COMMON",
      category: "PLANET",
      shortType:
        "Ring System World",
      fact:
        "Planetary rings are made from countless pieces of ice, rock, and dust orbiting together.",
    },

    {
      id: "dwarf-planet",
      name: "Dwarf Planet",
      rarity: "COMMON",
      category: "SMALL WORLD",
      shortType:
        "Planetary Body",
      fact:
        "Dwarf planets orbit the Sun and are rounded by gravity but have not cleared their orbital neighborhoods.",
    },

    {
      id: "moon-world",
      name: "Moon World",
      rarity: "COMMON",
      category: "MOON",
      shortType:
        "Natural Satellite",
      fact:
        "Moons can contain oceans, volcanoes, atmospheres, ice, and geological histories of their own.",
    },


    /* =========================
       UNCOMMON
       ========================= */

    {
      id: "super-earth",
      name: "Super-Earth",
      rarity: "UNCOMMON",
      category: "EXOPLANET",
      shortType:
        "Large Rocky Exoplanet",
      fact:
        "Super-Earths are exoplanets larger than Earth but smaller than planets such as Neptune.",
    },

    {
      id: "ocean-world",
      name: "Ocean World",
      rarity: "UNCOMMON",
      category: "PLANET",
      shortType:
        "Water-Rich World",
      fact:
        "Ocean worlds may contain enormous reservoirs of liquid water or subsurface oceans beneath ice.",
    },

    {
      id: "lava-world",
      name: "Lava World",
      rarity: "UNCOMMON",
      category: "EXOPLANET",
      shortType:
        "Ultra-Hot Rocky World",
      fact:
        "Some rocky exoplanets orbit so close to their stars that portions of their surfaces may remain molten.",
    },

    {
      id: "mini-neptune",
      name: "Mini-Neptune",
      rarity: "UNCOMMON",
      category: "EXOPLANET",
      shortType:
        "Sub-Neptune",
      fact:
        "Mini-Neptunes are smaller than Neptune but often retain thick atmospheres around dense interiors.",
    },

    {
      id: "hot-neptune",
      name: "Hot Neptune",
      rarity: "UNCOMMON",
      category: "EXOPLANET",
      shortType:
        "Irradiated Neptune",
      fact:
        "Hot Neptunes orbit close to their stars, where strong radiation can reshape or strip their atmospheres.",
    },

    {
      id: "circumbinary-planet",
      name: "Circumbinary Planet",
      rarity: "UNCOMMON",
      category: "EXOPLANET",
      shortType:
        "Two-Star Planet",
      fact:
        "A circumbinary planet orbits two stars at once instead of orbiting a single star.",
    },

    {
      id: "ice-giant",
      name: "Ice Giant",
      rarity: "UNCOMMON",
      category: "PLANET",
      shortType:
        "Uranus-Class World",
      fact:
        "Ice giants contain large amounts of water, ammonia, and methane compounds beneath hydrogen-rich atmospheres.",
    },

    {
      id: "tidally-locked-world",
      name: "Tidally Locked World",
      rarity: "UNCOMMON",
      category: "EXOPLANET",
      shortType:
        "Synchronous World",
      fact:
        "A tidally locked planet keeps nearly the same side facing its star as it orbits.",
    },


    /* =========================
       RARE
       ========================= */

    {
      id: "kepler-186f",
      name: "Kepler-186f",
      rarity: "RARE",
      category: "EXOPLANET",
      shortType:
        "Earth-Size Exoplanet",
      fact:
        "Kepler-186f was the first Earth-size planet discovered in the habitable zone of another star.",
    },

    {
      id: "rogue-planet",
      name: "Rogue Planet",
      rarity: "RARE",
      category: "PLANET",
      shortType:
        "Free-Floating Planet",
      fact:
        "Rogue planets travel through interstellar space without orbiting a normal host star.",
    },

    {
      id: "hot-jupiter",
      name: "Hot Jupiter",
      rarity: "RARE",
      category: "EXOPLANET",
      shortType:
        "Ultra-Hot Gas Giant",
      fact:
        "Hot Jupiters are giant planets orbiting extremely close to their stars, sometimes completing an orbit in only days.",
    },

    {
      id: "trappist-1e",
      name: "TRAPPIST-1e",
      rarity: "RARE",
      category: "EXOPLANET",
      shortType:
        "Earth-Size Rocky World",
      fact:
        "TRAPPIST-1e is one of seven known Earth-size planets orbiting the small TRAPPIST-1 star.",
    },

    {
      id: "toi-700-d",
      name: "TOI-700 d",
      rarity: "RARE",
      category: "EXOPLANET",
      shortType:
        "Habitable-Zone World",
      fact:
        "TOI-700 d is an Earth-size exoplanet orbiting within its star's habitable zone.",
    },

    {
      id: "55-cancri-e",
      name: "55 Cancri e",
      rarity: "RARE",
      category: "EXOPLANET",
      shortType:
        "Ultra-Hot Super-Earth",
      fact:
        "55 Cancri e is an extremely hot super-Earth that completes an orbit in less than one Earth day.",
    },

    {
      id: "proxima-centauri-b",
      name: "Proxima Centauri b",
      rarity: "RARE",
      category: "EXOPLANET",
      shortType:
        "Nearby Exoplanet",
      fact:
        "Proxima Centauri b orbits Proxima Centauri, the closest star to the Sun.",
    },

    {
      id: "kepler-452b",
      name: "Kepler-452b",
      rarity: "RARE",
      category: "EXOPLANET",
      shortType:
        "Super-Earth Candidate",
      fact:
        "Kepler-452b orbits a Sun-like star in a roughly year-long orbit and became famous as an Earth-cousin candidate.",
    },


    /* =========================
       EPIC
       ========================= */

    {
      id: "pulsar",
      name: "Pulsar",
      rarity: "EPIC",
      category:
        "STELLAR REMNANT",
      shortType:
        "Rotating Neutron Star",
      fact:
        "Pulsars are rapidly rotating neutron stars whose radiation beams can sweep past Earth like cosmic lighthouse beams.",
    },

    {
      id: "magnetar",
      name: "Magnetar",
      rarity: "EPIC",
      category:
        "STELLAR REMNANT",
      shortType:
        "Magnetic Neutron Star",
      fact:
        "Magnetars are neutron stars with extraordinarily intense magnetic fields.",
    },

    {
      id: "white-dwarf",
      name: "White Dwarf",
      rarity: "EPIC",
      category:
        "STELLAR REMNANT",
      shortType:
        "Collapsed Stellar Core",
      fact:
        "A white dwarf is the hot, dense remnant left after a Sun-like star sheds its outer layers.",
    },

    {
      id: "neutron-star",
      name: "Neutron Star",
      rarity: "EPIC",
      category:
        "STELLAR REMNANT",
      shortType:
        "Ultra-Dense Star",
      fact:
        "Neutron stars pack more mass than the Sun into an object roughly the size of a city.",
    },

    {
      id: "supernova-remnant",
      name: "Supernova Remnant",
      rarity: "EPIC",
      category: "DEEP SPACE",
      shortType:
        "Explosion Debris",
      fact:
        "A supernova remnant is an expanding cloud of energized material left behind after a stellar explosion.",
    },

    {
      id: "planetary-nebula",
      name: "Planetary Nebula",
      rarity: "EPIC",
      category: "NEBULA",
      shortType:
        "Stellar Shell",
      fact:
        "Planetary nebulae form when aging Sun-like stars expel glowing shells of gas into space.",
    },

    {
      id: "blazar",
      name: "Blazar",
      rarity: "EPIC",
      category: "ACTIVE GALAXY",
      shortType:
        "Relativistic Jet",
      fact:
        "A blazar is an active galactic nucleus whose powerful jet happens to point nearly toward Earth.",
    },


    /* =========================
       LEGENDARY
       ========================= */

    {
      id: "stellar-black-hole",
      name: "Stellar Black Hole",
      rarity: "LEGENDARY",
      category: "BLACK HOLE",
      shortType:
        "Collapsed Stellar Core",
      fact:
        "A stellar-mass black hole can form when the core of a sufficiently massive star collapses.",
    },

    {
      id: "supermassive-black-hole",
      name: "Supermassive Black Hole",
      rarity: "LEGENDARY",
      category: "BLACK HOLE",
      shortType:
        "Galactic Black Hole",
      fact:
        "Supermassive black holes contain millions or billions of times the Sun's mass and occupy the centers of many galaxies.",
    },

    {
      id: "quasar",
      name: "Quasar",
      rarity: "LEGENDARY",
      category: "ACTIVE GALAXY",
      shortType:
        "Luminous Galactic Core",
      fact:
        "Quasars are extraordinarily luminous galactic nuclei powered by matter falling toward supermassive black holes.",
    },

    {
      id: "sagittarius-a-star",
      name: "Sagittarius A*",
      rarity: "LEGENDARY",
      category: "BLACK HOLE",
      shortType:
        "Milky Way Black Hole",
      fact:
        "Sagittarius A* is the supermassive black hole at the center of the Milky Way.",
      unlockMode:
        "ACHIEVEMENT",
      unlockRequirement:
        "Become a verified Mission Lead by helping another explorer launch a real build.",
    },

    {
      id: "m87-star",
      name: "M87*",
      rarity: "LEGENDARY",
      category: "BLACK HOLE",
      shortType:
        "Imaged Black Hole",
      fact:
        "M87* became famous when the Event Horizon Telescope produced the first image of a black hole's shadow.",
      unlockMode:
        "ACHIEVEMENT",
      unlockRequirement:
        "Help 3 explorers launch verified real-world builds.",
    },

    {
      id: "ton-618",
      name: "TON 618",
      rarity: "LEGENDARY",
      category: "QUASAR",
      shortType:
        "Ultramassive Black Hole System",
      fact:
        "TON 618 is an extremely luminous quasar associated with an extraordinarily massive black hole.",
      unlockMode:
        "ACHIEVEMENT",
      unlockRequirement:
        "Reach Community Builder through verified peer impact.",
    },
  ];


const EMPTY_COLLECTION:
  CosmicCollection = {
    discoveredIds: [],
    discoverySources: [],
    stardust: 0,
    history: [],
  };


export function readCosmicCollection():
  CosmicCollection {
  try {
    const raw =
      localStorage.getItem(
        COSMIC_STORAGE_KEY,
      );

    if (!raw) {
      return {
        ...EMPTY_COLLECTION,
        discoveredIds: [],
        discoverySources: [],
        history: [],
      };
    }

    const parsed =
      JSON.parse(raw) as
        Partial<CosmicCollection>;

    return {
      discoveredIds:
        parsed.discoveredIds ?? [],

      discoverySources:
        parsed.discoverySources ?? [],

      stardust:
        parsed.stardust ?? 0,

      history:
        parsed.history ?? [],
    };
  } catch {
    return {
      ...EMPTY_COLLECTION,
      discoveredIds: [],
      discoverySources: [],
      history: [],
    };
  }
}


function saveCosmicCollection(
  collection: CosmicCollection,
) {
  localStorage.setItem(
    COSMIC_STORAGE_KEY,
    JSON.stringify(
      collection,
    ),
  );
}


const rarityOrder:
  CosmicRarity[] = [
    "COMMON",
    "UNCOMMON",
    "RARE",
    "EPIC",
    "LEGENDARY",
  ];


const weights:
  Record<
    CosmicRewardTier,
    number[]
  > = {
    level:
      [55, 25, 13, 6, 1],

    project:
      [32, 34, 23, 10, 1],

    evidence:
      [18, 29, 31, 18, 4],

    leadership:
      [5, 15, 30, 40, 10],

    community:
      [0, 5, 20, 45, 30],
  };


const duplicateStardust:
  Record<CosmicRarity, number> = {
    COMMON: 20,
    UNCOMMON: 35,
    RARE: 70,
    EPIC: 150,
    LEGENDARY: 300,
  };


function rollRarity(
  tier: CosmicRewardTier,
) {
  const values =
    weights[tier];

  const roll =
    Math.random() * 100;

  let running = 0;

  for (
    let index = 0;
    index < values.length;
    index += 1
  ) {
    running +=
      values[index];

    if (roll <= running) {
      return rarityOrder[
        index
      ];
    }
  }

  return "COMMON";
}


function chooseObject(
  rarity: CosmicRarity,
) {
  const candidates =
    CELESTIAL_OBJECTS.filter(
      (item) =>
        item.rarity ===
          rarity &&
        item.unlockMode !==
          "ACHIEVEMENT",
    );

  return candidates[
    Math.floor(
      Math.random() *
        candidates.length,
    )
  ];
}


function saveDiscovery(
  object: CelestialObject,
  sourceId: string,
  sourceLabel: string,
) {
  const collection =
    readCosmicCollection();

  if (
    collection.discoverySources.includes(
      sourceId,
    )
  ) {
    return null;
  }

  const duplicate =
    collection.discoveredIds.includes(
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

  saveCosmicCollection(next);

  const detail:
    CosmicDiscoveryDetail = {
      object,
      duplicate,
      stardustGain,
      sourceLabel,
      collection: next,
    };

  window.dispatchEvent(
    new CustomEvent(
      COSMIC_DISCOVERY_EVENT,
      {
        detail,
      },
    ),
  );

  return detail;
}


function awardDiscovery(
  sourceId: string,
  sourceLabel: string,
  tier: CosmicRewardTier,
) {
  const rarity =
    rollRarity(tier);

  const object =
    chooseObject(rarity);

  return saveDiscovery(
    object,
    sourceId,
    sourceLabel,
  );
}


function awardSpecificDiscovery(
  objectId: string,
  sourceId: string,
  sourceLabel: string,
) {
  const object =
    CELESTIAL_OBJECTS.find(
      (item) =>
        item.id === objectId,
    );

  if (!object) {
    return null;
  }

  return saveDiscovery(
    object,
    sourceId,
    sourceLabel,
  );
}


interface MilestoneCosmicInput {
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
}: MilestoneCosmicInput) {

  /*
   * Future verified Crew milestones.
   * These must eventually come from
   * authenticated multi-user activity,
   * not a self-reported button.
   */

  if (
    milestoneId ===
    "leadership:crew:verified:1"
  ) {
    return awardSpecificDiscovery(
      "sagittarius-a-star",
      "cosmic:achievement:mission-lead",
      "Verified Mission Lead",
    );
  }

  if (
    milestoneId ===
    "leadership:crew:verified:3"
  ) {
    return awardSpecificDiscovery(
      "m87-star",
      "cosmic:achievement:crew-3",
      "Three explorers launched",
    );
  }

  if (
    milestoneId ===
    "leadership:community:verified:5"
  ) {
    return awardSpecificDiscovery(
      "ton-618",
      "cosmic:achievement:community",
      "Verified Community Builder",
    );
  }

  let tier:
    CosmicRewardTier | null =
      null;

  let sourceId:
    string | null =
      null;

  let sourceLabel =
    label;

  if (
    milestoneId.startsWith(
      "leadership:community",
    )
  ) {
    tier = "community";

    sourceId =
      `cosmic:${milestoneId}`;

  } else if (
    milestoneId.startsWith(
      "leadership:",
    )
  ) {
    tier = "leadership";

    sourceId =
      `cosmic:${milestoneId}`;

  } else if (
    milestoneId.startsWith(
      "evidence:",
    )
  ) {
    tier = "evidence";

    sourceId =
      `cosmic:${milestoneId}`;

  } else if (
    milestoneId.startsWith(
      "project:",
    )
  ) {
    tier = "project";

    sourceId =
      `cosmic:${milestoneId}`;

  } else if (
    currentLevel >
    previousLevel
  ) {
    tier = "level";

    sourceId =
      `cosmic:level:${currentLevel}`;

    sourceLabel =
      `Reached LV.${currentLevel}`;
  }

  if (
    !tier ||
    !sourceId
  ) {
    return null;
  }

  return awardDiscovery(
    sourceId,
    sourceLabel,
    tier,
  );
}
