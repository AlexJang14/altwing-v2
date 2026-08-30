import type {
  PrimaryWingId,
} from "../engine/wingmatchV5";


export type OpportunityScope =
  | "STATE"
  | "NATIONAL"
  | "INTERNATIONAL"
  | "SCHOOL";


export type OpportunityStatus =
  | "OPEN"
  | "UPCOMING"
  | "WATCH"
  | "TEAM";


export interface Opportunity {
  id: string;

  title: string;

  organization: string;

  scope:
    OpportunityScope;

  status:
    OpportunityStatus;

  summary: string;

  timing: string;

  eligibility: string;

  officialSource: string;

  lastVerified: string;

  /*
   * Optional state-specific
   * availability.
   */
  stateCode?: string;

  /*
   * NATIONAL is kept internally so
   * nationwide U.S. opportunities can
   * appear under any State search.
   * There is no National tab in the UI.
   */
  availableInAllStates?: boolean;

  wingMatches:
    PrimaryWingId[];
}


/*
 * Seed opportunities are based on
 * official-source information.
 *
 * Dates and eligibility can change.
 * The UI therefore shows
 * LAST VERIFIED and avoids
 * inventing future deadlines.
 */

export const OPPORTUNITIES:
  Opportunity[] = [

  {
    id:
      "gtri-hsi-2027",

    title:
      "2027 STEM@GTRI High School Summer Internship",

    organization:
      "Georgia Tech Research Institute",

    scope:
      "STATE",

    stateCode:
      "GA",

    status:
      "UPCOMING",

    summary:
      "Five-week paid STEM research internship hosted in GTRI labs.",

    timing:
      "Pre-application planned for Dec. 11, 2026.",

    eligibility:
      "Current listing: Georgia high-school student, at least 16 by Apr. 4, 2027, graduating class 2027–2029, plus listed US-person requirements.",

    officialSource:
      "GTRI High School Summer Internship",

    lastVerified:
      "2026-08-30",

    wingMatches: [
      "gnc",
      "avionics",
      "structures",
      "thermal",
      "propulsion",
      "mission-design",
    ],
  },


  {
    id:
      "ga-scioly-2027",

    title:
      "Georgia Science Olympiad — Division C",

    organization:
      "Georgia Science Olympiad",

    scope:
      "STATE",

    stateCode:
      "GA",

    status:
      "OPEN",

    summary:
      "School-team competition pathway with 2027 events including Astronomy, Thermodynamics, Electric Vehicle, Mission Possible, Wright Stuff, and Engineering CAD.",

    timing:
      "2026–27 team registration is currently active; current Georgia schedule lists registration closing Oct. 31, 2026.",

    eligibility:
      "Division C is the high-school division. Participation normally runs through a registered school team.",

    officialSource:
      "Georgia Science Olympiad / Science Olympiad",

    lastVerified:
      "2026-08-30",

    wingMatches: [
      "gnc",
      "avionics",
      "structures",
      "thermal",
      "propulsion",
      "mission-design",
    ],
  },


  {
    id:
      "yellow-jacket-2027",

    title:
      "Yellow Jacket Invitational 2027",

    organization:
      "Science Olympiad at Georgia Tech",

    scope:
      "STATE",

    stateCode:
      "GA",

    status:
      "OPEN",

    summary:
      "Division B and C Science Olympiad invitational held on the Georgia Tech campus.",

    timing:
      "Tournament: Feb. 6, 2027. Current regular team registration runs through Dec. 13.",

    eligibility:
      "Team-based Science Olympiad event. Registration is handled by participating teams/schools.",

    officialSource:
      "Science Olympiad at Georgia Tech",

    lastVerified:
      "2026-08-30",

    wingMatches: [
      "gnc",
      "structures",
      "thermal",
      "propulsion",
      "mission-design",
    ],
  },


  {
    id:
      "physics-team-path",

    title:
      "F=ma → USAPhO → U.S. Physics Team Path",

    organization:
      "American Association of Physics Teachers",

    scope:
      "INTERNATIONAL",

    status:
      "WATCH",

    summary:
      "Physics competition pathway that can lead from F=ma and USAPhO toward the U.S. Physics Team and international competition.",

    timing:
      "Watch for the 2027 cycle. The 2026 exam cycle is complete.",

    eligibility:
      "Important: 2026 F=ma eligibility included U.S. citizens, permanent residents, or students attending a U.S. school while in the U.S.; USAPhO required U.S. citizenship or permanent residency. Re-check 2027 rules when posted.",

    officialSource:
      "AAPT U.S. Physics Team",

    lastVerified:
      "2026-08-30",

    wingMatches: [
      "gnc",
      "structures",
      "thermal",
      "propulsion",
    ],
  },


  {
    id:
      "tsa-flight",

    title:
      "TSA Flight Endurance",

    organization:
      "Technology Student Association",

    scope:
      "SCHOOL",

    status:
      "TEAM",

    summary:
      "Design, build, fly, and trim a rubber-band powered model aircraft for endurance.",

    timing:
      "National TSA high-school competitive event; confirm the current Georgia/state event offering with your chapter.",

    eligibility:
      "Participation normally runs through a TSA chapter. State event availability can differ from the national list.",

    officialSource:
      "Technology Student Association",

    lastVerified:
      "2026-08-30",

    wingMatches: [
      "gnc",
      "structures",
      "propulsion",
    ],
  },


  {
    id:
      "tsa-drone",

    title:
      "TSA Drone Challenge (UAV)",

    organization:
      "Technology Student Association",

    scope:
      "SCHOOL",

    status:
      "TEAM",

    summary:
      "Design, assemble, document, program, and test-fly an open-source UAV.",

    timing:
      "National TSA competitive event; confirm local/state availability with the chapter.",

    eligibility:
      "Team/chapter participation; documentation and flight testing are part of the national event description.",

    officialSource:
      "Technology Student Association",

    lastVerified:
      "2026-08-30",

    wingMatches: [
      "gnc",
      "avionics",
      "structures",
    ],
  },


  {
    id:
      "tsa-engineering",

    title:
      "TSA Engineering Design",

    organization:
      "Technology Student Association",

    scope:
      "SCHOOL",

    status:
      "TEAM",

    summary:
      "Develop an engineering solution with documentation, a model or prototype, and presentation/interview components.",

    timing:
      "National TSA competitive event; state participation details can vary.",

    eligibility:
      "Normally entered through a TSA chapter.",

    officialSource:
      "Technology Student Association",

    lastVerified:
      "2026-08-30",

    wingMatches: [
      "structures",
      "thermal",
      "propulsion",
      "mission-design",
    ],
  },


  {
    id:
      "ceismc-peaks",

    title:
      "Georgia Tech Summer PEAKS",

    organization:
      "Georgia Tech CEISMC",

    scope:
      "STATE",

    stateCode:
      "GA",

    status:
      "WATCH",

    summary:
      "Hands-on STEAM summer experiences on the Georgia Tech campus, including high-school programming.",

    timing:
      "The 2026 summer cycle has ended. Watch the official CEISMC site for the next high-school cycle.",

    eligibility:
      "The 2026 high-school sessions served rising 9th–12th graders. Re-check 2027 program-specific requirements when released.",

    officialSource:
      "Georgia Tech CEISMC Expanded Learning",

    lastVerified:
      "2026-08-30",

    wingMatches: [
      "gnc",
      "avionics",
      "structures",
      "thermal",
      "propulsion",
      "mission-design",
    ],
  },
];
