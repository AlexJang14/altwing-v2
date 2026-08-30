export type TestingPolicy =
  | "REQUIRED"
  | "OPTIONAL"
  | "NOT_USED"
  | "SPECIAL"
  | "CHECK_CURRENT";

export interface CollegeProfile {
  id: string;
  name: string;
  shortName: string;
  location: string;

  major: string;
  aerospaceFit: string;

  testingPolicy: TestingPolicy;
  testingPolicyNote: string;

  sat25: number | null;
  sat50: number | null;
  sat75: number | null;

  act25: number | null;
  act50: number | null;
  act75: number | null;

  scoreContext: string;

  averageGpa: string;
  gpaNote: string;

  admissionRate: string;

  source: string;
  sourceYear: string;

  strengths: string[];
}

export const colleges: CollegeProfile[] = [
  {
    id: "gatech",
    name: "Georgia Institute of Technology",
    shortName: "Georgia Tech",
    location: "Atlanta, Georgia",

    major: "Aerospace Engineering",
    aerospaceFit: "DIRECT MAJOR",

    testingPolicy: "CHECK_CURRENT",
    testingPolicyNote:
      "Use the current Georgia Tech first-year admissions policy for your application cycle. The score profile below is institution-level admissions context.",

    sat25: 1370,
    sat50: 1460,
    sat75: 1530,

    act25: 31,
    act50: 33,
    act75: 35,

    scoreContext:
      "Institution-level Common Data Set profile.",

    averageGpa:
      "Not reported as one simple average",

    gpaNote:
      "Use Georgia Tech's official GPA and class-rank context rather than an unofficial internet average.",

    admissionRate:
      "~13% overall, Fall 2025",

    source:
      "Georgia Tech Common Data Set",

    sourceYear: "2025–26",

    strengths: [
      "Dedicated Aerospace Engineering major",
      "Large aerospace research ecosystem",
      "Atlanta engineering and technology access",
      "Extensive undergraduate project opportunities",
    ],
  },

  {
    id: "michigan",
    name:
      "University of Michigan–Ann Arbor",
    shortName: "Michigan",
    location: "Ann Arbor, Michigan",

    major: "Aerospace Engineering",
    aerospaceFit: "DIRECT MAJOR",

    testingPolicy: "CHECK_CURRENT",
    testingPolicyNote:
      "Verify Michigan's standardized-testing policy for your exact application cycle. Scores below are institution-level context.",

    sat25: 1370,
    sat50: 1470,
    sat75: 1530,

    act25: 32,
    act50: 33,
    act75: 34,

    scoreContext:
      "Institution-level Common Data Set profile.",

    averageGpa: "3.9",

    gpaNote:
      "Official CDS average among enrolled first-year students who submitted GPA.",

    admissionRate:
      "~16% overall, Fall 2025",

    source:
      "University of Michigan Common Data Set",

    sourceYear: "2025–26",

    strengths: [
      "Dedicated Aerospace Engineering major",
      "Large engineering research ecosystem",
      "Strong student design organizations",
      "Broad university resources",
    ],
  },

  {
    id: "mit",
    name:
      "Massachusetts Institute of Technology",
    shortName: "MIT",
    location: "Cambridge, Massachusetts",

    major:
      "Aeronautics and Astronautics",
    aerospaceFit: "DIRECT MAJOR",

    testingPolicy: "REQUIRED",
    testingPolicyNote:
      "MIT uses standardized testing as one part of holistic first-year admission. Always verify the current application requirements before applying.",

    sat25: 1520,
    sat50: 1550,
    sat75: 1570,

    act25: 34,
    act50: 35,
    act75: 35,

    scoreContext:
      "Institution-level Common Data Set profile.",

    averageGpa: "Not reported",

    gpaNote:
      "MIT does not report one average high-school GPA in this profile.",

    admissionRate:
      "~4.6% overall, Fall 2025",

    source:
      "MIT Common Data Set",

    sourceYear: "2025–26",

    strengths: [
      "Aeronautics and Astronautics major",
      "Exceptional aerospace research depth",
      "Strong systems and design culture",
      "Extensive undergraduate research",
    ],
  },

  {
    id: "stanford",
    name: "Stanford University",
    shortName: "Stanford",
    location: "Stanford, California",

    major:
      "Aeronautics and Astronautics",
    aerospaceFit: "DIRECT MAJOR",

    testingPolicy: "CHECK_CURRENT",
    testingPolicyNote:
      "Verify Stanford's standardized-testing requirement for the exact year you apply.",

    sat25: 1520,
    sat50: 1550,
    sat75: 1570,

    act25: 34,
    act50: 35,
    act75: 36,

    scoreContext:
      "Institution-level admissions context.",

    averageGpa: "Not reported",

    gpaNote:
      "Stanford does not publish a minimum GPA requirement; academic achievement is reviewed in school context.",

    admissionRate:
      "~3.8% overall, Fall 2025",

    source:
      "Stanford Common Data Set + Undergraduate Admission",

    sourceYear: "2025–26",

    strengths: [
      "Aeronautics and Astronautics BS",
      "Aircraft and spacecraft design",
      "Student Space Initiative ecosystem",
      "Research and entrepreneurship environment",
    ],
  },

  {
    id: "purdue",
    name:
      "Purdue University–West Lafayette",
    shortName: "Purdue",
    location: "West Lafayette, Indiana",

    major:
      "Aeronautical and Astronautical Engineering",
    aerospaceFit: "DIRECT MAJOR",

    testingPolicy: "CHECK_CURRENT",
    testingPolicyNote:
      "Verify Purdue's current testing requirement for your application cycle.",

    sat25: 1220,
    sat50: 1360,
    sat75: 1470,

    act25: 28,
    act50: 32,
    act75: 34,

    scoreContext:
      "University-level score context; engineering admission can be more competitive.",

    averageGpa:
      "3.81–4.00 Engineering middle 50%",

    gpaNote:
      "Purdue's Engineering freshman profile is more relevant to an aerospace applicant than a university-wide GPA average.",

    admissionRate:
      "49.8% university / 46.1% Engineering, Fall 2024",

    source:
      "Purdue CDS + Undergraduate Admissions Class Profile",

    sourceYear:
      "2025–26 CDS; Fall 2024 Engineering profile",

    strengths: [
      "Aeronautical and Astronautical Engineering",
      "Aircraft and spacecraft curriculum",
      "Large aerospace engineering community",
      "Strong propulsion, structures, controls and design pathways",
    ],
  },

  {
    id: "uiuc",
    name:
      "University of Illinois Urbana-Champaign",
    shortName: "UIUC",
    location:
      "Urbana-Champaign, Illinois",

    major: "Aerospace Engineering",
    aerospaceFit: "DIRECT MAJOR",

    testingPolicy: "CHECK_CURRENT",
    testingPolicyNote:
      "Verify Illinois' current standardized-testing policy for your application cycle.",

    sat25: 1390,
    sat50: 1470,
    sat75: 1520,

    act25: 30,
    act50: 33,
    act75: 34,

    scoreContext:
      "Institution-level score context; Grainger Engineering is more selective than the university overall.",

    averageGpa:
      "3.89–4.00 Grainger middle 50%",

    gpaNote:
      "Current Illinois admissions data reports this middle-50% GPA range for Grainger College of Engineering.",

    admissionRate:
      "36.6% university / 21.2% Grainger, 2025",

    source:
      "Illinois CDS + Illinois Admissions Class Profile",

    sourceYear:
      "2024–25 CDS; 2025 profile",

    strengths: [
      "Dedicated Aerospace Engineering major",
      "Grainger College of Engineering",
      "Strong aerospace research",
      "Excellent engineering project ecosystem",
    ],
  },

  {
    id: "tamu",
    name: "Texas A&M University",
    shortName: "Texas A&M",
    location:
      "College Station, Texas",

    major: "Aerospace Engineering",
    aerospaceFit: "DIRECT MAJOR",

    testingPolicy: "CHECK_CURRENT",
    testingPolicyNote:
      "Verify Texas A&M's first-year testing policy for the year you apply.",

    sat25: 1160,
    sat50: 1280,
    sat75: 1390,

    act25: 24,
    act50: 28,
    act75: 32,

    scoreContext:
      "Institution-level Common Data Set profile.",

    averageGpa: "Not reported",

    gpaNote:
      "Texas A&M's CDS does not report one simple average high-school GPA. Class-rank context is more useful.",

    admissionRate:
      "~51.7% overall, Fall 2025",

    source:
      "Texas A&M Common Data Set",

    sourceYear: "2025–26",

    strengths: [
      "BS in Aerospace Engineering",
      "Aerodynamics and propulsion",
      "Structures, dynamics and controls",
      "Two-semester aerospace design sequence",
    ],
  },

  {
    id: "erau",
    name:
      "Embry-Riddle Aeronautical University–Daytona Beach",
    shortName: "Embry-Riddle",
    location:
      "Daytona Beach, Florida",

    major: "Aerospace Engineering",
    aerospaceFit: "DIRECT MAJOR",

    testingPolicy: "CHECK_CURRENT",
    testingPolicyNote:
      "Verify the current admission policy. AltWing flags the score data below because the latest official CDS currently available is older.",

    sat25: 1160,
    sat50: 1250,
    sat75: 1330,

    act25: 24,
    act50: 27,
    act75: 30,

    scoreContext:
      "Older official Common Data Set; use cautiously.",

    averageGpa:
      "No comparable 4.0 average reported",

    gpaNote:
      "Published GPAs are weighted, so AltWing does not convert them into an invented unweighted average.",

    admissionRate:
      "Use with older-data caution",

    source:
      "Embry-Riddle Daytona Beach Common Data Set",

    sourceYear: "2023–24",

    strengths: [
      "Aerospace-focused university",
      "Dedicated Aerospace Engineering major",
      "Strong aviation and space identity",
      "Hands-on aerospace orientation",
    ],
  },

  /* =====================================================
     NEW V2 SCHOOLS
     ===================================================== */

  {
    id: "caltech",
    name:
      "California Institute of Technology",
    shortName: "Caltech",
    location:
      "Pasadena, California",

    major:
      "Aerospace Minor + another undergraduate BS option",
    aerospaceFit:
      "AEROSPACE MINOR",

    testingPolicy: "SPECIAL",

    testingPolicyNote:
      "Fall 2027 applicants must submit SAT or ACT. Caltech evaluates individual sections using buckets instead of relying on the composite score: SAT 780–800 = A, 750–770 = B, below 750 = C; ACT 35–36 = A, 33–34 = B, below 33 = C.",

    sat25: null,
    sat50: null,
    sat75: null,

    act25: null,
    act50: null,
    act75: null,

    scoreContext:
      "Composite percentile comparison intentionally disabled because the current admissions process uses section-level buckets.",

    averageGpa:
      "No simple target GPA",

    gpaNote:
      "Caltech requires strong STEM preparation. For Fall 2027, applicants must demonstrate mastery in calculus, chemistry and physics, with limited approved alternatives when courses are unavailable.",

    admissionRate:
      "Highly selective; AltWing does not convert institutional selectivity into a personal probability.",

    source:
      "Caltech Undergraduate Admissions + Caltech Academic Catalog",

    sourceYear:
      "Fall 2027 admissions / 2025–26 catalog",

    strengths: [
      "Aerospace minor",
      "GALCIT aerospace research environment",
      "Close connection to JPL ecosystem",
      "Exceptional physics and engineering depth",
    ],
  },

  {
    id: "utaustin",
    name:
      "The University of Texas at Austin",
    shortName: "UT Austin",
    location: "Austin, Texas",

    major:
      "B.S. Aerospace Engineering",
    aerospaceFit: "DIRECT MAJOR",

    testingPolicy: "REQUIRED",

    testingPolicyNote:
      "Current first-year applicants must submit an official SAT or ACT. Cockrell Engineering applicants must also demonstrate calculus readiness. SAT Math 620+ is one accepted route to satisfy calculus readiness.",

    sat25: null,
    sat50: null,
    sat75: null,

    act25: null,
    act50: null,
    act75: null,

    scoreContext:
      "Current testing requirement is shown, but AltWing is not displaying a percentile range here until the current institutional profile is separately verified.",

    averageGpa:
      "No single major-level target GPA",

    gpaNote:
      "Admission to UT Austin and admission to a specific Cockrell Engineering major are different decisions. Engineering admission is competitive.",

    admissionRate:
      "For Summer/Fall 2027, eligible Texas applicants in the top 5% qualify for automatic university admission; this does not automatically guarantee an engineering major.",

    source:
      "UT Austin Admissions + Cockrell School of Engineering",

    sourceYear:
      "2027 first-year cycle",

    strengths: [
      "BS in Aerospace Engineering",
      "CubeSat and spacecraft opportunities",
      "Strong research centers and laboratories",
      "Austin technology and engineering ecosystem",
    ],
  },

  {
    id: "ucf",
    name:
      "University of Central Florida",
    shortName: "UCF",
    location: "Orlando, Florida",

    major:
      "Aerospace Engineering (BSAE)",
    aerospaceFit: "DIRECT MAJOR",

    testingPolicy:
      "CHECK_CURRENT",

    testingPolicyNote:
      "UCF's current published CDS lists SAT/ACT testing as required for the Fall 2026 cycle. Verify the exact requirement again for the year you apply.",

    sat25: 1220,
    sat50: 1280,
    sat75: 1350,

    act25: 25,
    act50: 28,
    act75: 30,

    scoreContext:
      "2025–26 Common Data Set, enrolled first-year students.",

    averageGpa: "4.18",

    gpaNote:
      "UCF reports an average high-school GPA of 4.18 for the CDS cohort; the institution's GPA practices can include weighting.",

    admissionRate:
      "59,629 applicants / 25,522 admitted, Fall 2025",

    source:
      "UCF Common Data Set + UCF Aerospace Engineering BSAE",

    sourceYear: "2025–26",

    strengths: [
      "Dedicated Aerospace Engineering BSAE",
      "Aerodynamics, structures and propulsion",
      "Orbital mechanics and flight mechanics",
      "Orlando / Florida aerospace industry ecosystem",
    ],
  },

  {
    id: "cuboulder",
    name:
      "University of Colorado Boulder",
    shortName: "CU Boulder",
    location: "Boulder, Colorado",

    major:
      "Aerospace Engineering Sciences (BSAE)",
    aerospaceFit: "DIRECT MAJOR",

    testingPolicy: "OPTIONAL",

    testingPolicyNote:
      "SAT and ACT are optional for 2027 first-year applicants. Scores below represent students who asked CU Boulder to consider their scores.",

    sat25: 1300,
    sat50: null,
    sat75: 1450,

    act25: 29,
    act50: null,
    act75: 34,

    scoreContext:
      "2026 admitted first-year middle-50% profile, all majors; test scores are from applicants who elected to have them considered.",

    averageGpa:
      "3.70–4.26 weighted middle 50%",

    gpaNote:
      "CU Boulder recalculates GPA on a standardized weighted scale and emphasizes classroom performance and course rigor.",

    admissionRate:
      "Holistic admission; profile shown is institution-level rather than Aerospace-major-specific.",

    source:
      "CU Boulder Undergraduate Admissions + Aerospace Engineering Sciences",

    sourceYear:
      "2027 application / 2026 admitted profile",

    strengths: [
      "Aerospace Engineering Sciences BSAE",
      "Interdisciplinary systems perspective",
      "Hands-on design curriculum",
      "Orbital mechanics, remote sensing and space systems",
    ],
  },

  {
    id: "calpoly",
    name:
      "California Polytechnic State University, San Luis Obispo",
    shortName: "Cal Poly SLO",
    location:
      "San Luis Obispo, California",

    major:
      "Aerospace Engineering, BS",
    aerospaceFit: "DIRECT MAJOR",

    testingPolicy: "NOT_USED",

    testingPolicyNote:
      "Cal Poly does not use SAT or ACT scores in the admissions selection process. Scores may be used after admission for placement purposes.",

    sat25: null,
    sat50: null,
    sat75: null,

    act25: null,
    act50: null,
    act75: null,

    scoreContext:
      "SAT/ACT comparison intentionally disabled because the CSU does not use the tests in admission selection.",

    averageGpa:
      "4.14–4.25 Engineering middle 50%",

    gpaNote:
      "2025 preliminary selected-student profile for the College of Engineering. Cal Poly evaluates applicants by intended major and uses its own weighted GPA methodology.",

    admissionRate:
      "Admission is by major. 2025 preliminary Engineering profile: 21,393 applied / 5,008 selected.",

    source:
      "Cal Poly Admissions + Aerospace Engineering",

    sourceYear:
      "2025 preliminary profile / 2026–27 admissions guidance",

    strengths: [
      "Aerospace Engineering BS",
      "Aeronautics concentration",
      "Astronautics concentration",
      "Learn by Doing and extensive aerospace laboratories",
    ],
  },

  /* =====================================================
     EXPANDED COLLEGE CATALOG V3
     Admissions metrics intentionally unverified
     ===================================================== */

  {
    id: "maryland",
    name: "University of Maryland, College Park",
    shortName: "Maryland",
    location: "College Park, Maryland",

    major: "Aerospace Engineering",
    aerospaceFit: "DIRECT MAJOR",

    testingPolicy:
      "CHECK_CURRENT",

    testingPolicyNote:
      "AltWing has not yet verified this school's testing policy for the current application cycle. Check the official first-year admissions page before making a testing decision.",

    sat25: null,
    sat50: null,
    sat75: null,

    act25: null,
    act50: null,
    act75: null,

    scoreContext:
      "No verified current SAT/ACT percentile profile is loaded yet. AltWing will not manufacture a comparison.",

    averageGpa:
      "Verify current official profile",

    gpaNote:
      "No verified comparable GPA profile is loaded yet. GPA methodology can vary by institution.",

    admissionRate:
      "Verify current official source",

    source:
      "Official undergraduate program + first-year admissions pages",

    sourceYear:
      "VERIFY CURRENT",

    strengths: [
      "Aerospace Engineering",
      "Dedicated or direct aerospace-focused undergraduate pathway",
      "Engineering design and technical project opportunities",
      "Aerospace-relevant research ecosystem",
    ],
  },

  {
    id: "vatech",
    name: "Virginia Polytechnic Institute and State University",
    shortName: "Virginia Tech",
    location: "Blacksburg, Virginia",

    major: "Aerospace Engineering",
    aerospaceFit: "DIRECT MAJOR",

    testingPolicy:
      "CHECK_CURRENT",

    testingPolicyNote:
      "AltWing has not yet verified this school's testing policy for the current application cycle. Check the official first-year admissions page before making a testing decision.",

    sat25: null,
    sat50: null,
    sat75: null,

    act25: null,
    act50: null,
    act75: null,

    scoreContext:
      "No verified current SAT/ACT percentile profile is loaded yet. AltWing will not manufacture a comparison.",

    averageGpa:
      "Verify current official profile",

    gpaNote:
      "No verified comparable GPA profile is loaded yet. GPA methodology can vary by institution.",

    admissionRate:
      "Verify current official source",

    source:
      "Official undergraduate program + first-year admissions pages",

    sourceYear:
      "VERIFY CURRENT",

    strengths: [
      "Aerospace Engineering",
      "Dedicated or direct aerospace-focused undergraduate pathway",
      "Engineering design and technical project opportunities",
      "Aerospace-relevant research ecosystem",
    ],
  },

  {
    id: "pennstate",
    name: "Pennsylvania State University",
    shortName: "Penn State",
    location: "University Park, Pennsylvania",

    major: "Aerospace Engineering",
    aerospaceFit: "DIRECT MAJOR",

    testingPolicy:
      "CHECK_CURRENT",

    testingPolicyNote:
      "AltWing has not yet verified this school's testing policy for the current application cycle. Check the official first-year admissions page before making a testing decision.",

    sat25: null,
    sat50: null,
    sat75: null,

    act25: null,
    act50: null,
    act75: null,

    scoreContext:
      "No verified current SAT/ACT percentile profile is loaded yet. AltWing will not manufacture a comparison.",

    averageGpa:
      "Verify current official profile",

    gpaNote:
      "No verified comparable GPA profile is loaded yet. GPA methodology can vary by institution.",

    admissionRate:
      "Verify current official source",

    source:
      "Official undergraduate program + first-year admissions pages",

    sourceYear:
      "VERIFY CURRENT",

    strengths: [
      "Aerospace Engineering",
      "Dedicated or direct aerospace-focused undergraduate pathway",
      "Engineering design and technical project opportunities",
      "Aerospace-relevant research ecosystem",
    ],
  },

  {
    id: "ohio-state",
    name: "The Ohio State University",
    shortName: "Ohio State",
    location: "Columbus, Ohio",

    major: "Aerospace Engineering",
    aerospaceFit: "DIRECT MAJOR",

    testingPolicy:
      "CHECK_CURRENT",

    testingPolicyNote:
      "AltWing has not yet verified this school's testing policy for the current application cycle. Check the official first-year admissions page before making a testing decision.",

    sat25: null,
    sat50: null,
    sat75: null,

    act25: null,
    act50: null,
    act75: null,

    scoreContext:
      "No verified current SAT/ACT percentile profile is loaded yet. AltWing will not manufacture a comparison.",

    averageGpa:
      "Verify current official profile",

    gpaNote:
      "No verified comparable GPA profile is loaded yet. GPA methodology can vary by institution.",

    admissionRate:
      "Verify current official source",

    source:
      "Official undergraduate program + first-year admissions pages",

    sourceYear:
      "VERIFY CURRENT",

    strengths: [
      "Aerospace Engineering",
      "Dedicated or direct aerospace-focused undergraduate pathway",
      "Engineering design and technical project opportunities",
      "Aerospace-relevant research ecosystem",
    ],
  },

  {
    id: "minnesota",
    name: "University of Minnesota Twin Cities",
    shortName: "Minnesota",
    location: "Minneapolis, Minnesota",

    major: "Aerospace Engineering and Mechanics",
    aerospaceFit: "DIRECT MAJOR",

    testingPolicy:
      "CHECK_CURRENT",

    testingPolicyNote:
      "AltWing has not yet verified this school's testing policy for the current application cycle. Check the official first-year admissions page before making a testing decision.",

    sat25: null,
    sat50: null,
    sat75: null,

    act25: null,
    act50: null,
    act75: null,

    scoreContext:
      "No verified current SAT/ACT percentile profile is loaded yet. AltWing will not manufacture a comparison.",

    averageGpa:
      "Verify current official profile",

    gpaNote:
      "No verified comparable GPA profile is loaded yet. GPA methodology can vary by institution.",

    admissionRate:
      "Verify current official source",

    source:
      "Official undergraduate program + first-year admissions pages",

    sourceYear:
      "VERIFY CURRENT",

    strengths: [
      "Aerospace Engineering and Mechanics",
      "Dedicated or direct aerospace-focused undergraduate pathway",
      "Engineering design and technical project opportunities",
      "Aerospace-relevant research ecosystem",
    ],
  },

  {
    id: "usc",
    name: "University of Southern California",
    shortName: "USC",
    location: "Los Angeles, California",

    major: "Aerospace / Astronautical Engineering",
    aerospaceFit: "DIRECT MAJOR",

    testingPolicy:
      "CHECK_CURRENT",

    testingPolicyNote:
      "AltWing has not yet verified this school's testing policy for the current application cycle. Check the official first-year admissions page before making a testing decision.",

    sat25: null,
    sat50: null,
    sat75: null,

    act25: null,
    act50: null,
    act75: null,

    scoreContext:
      "No verified current SAT/ACT percentile profile is loaded yet. AltWing will not manufacture a comparison.",

    averageGpa:
      "Verify current official profile",

    gpaNote:
      "No verified comparable GPA profile is loaded yet. GPA methodology can vary by institution.",

    admissionRate:
      "Verify current official source",

    source:
      "Official undergraduate program + first-year admissions pages",

    sourceYear:
      "VERIFY CURRENT",

    strengths: [
      "Aerospace / Astronautical Engineering",
      "Dedicated or direct aerospace-focused undergraduate pathway",
      "Engineering design and technical project opportunities",
      "Aerospace-relevant research ecosystem",
    ],
  },

  {
    id: "ucla",
    name: "University of California, Los Angeles",
    shortName: "UCLA",
    location: "Los Angeles, California",

    major: "Aerospace Engineering",
    aerospaceFit: "DIRECT MAJOR",

    testingPolicy:
      "CHECK_CURRENT",

    testingPolicyNote:
      "AltWing has not yet verified this school's testing policy for the current application cycle. Check the official first-year admissions page before making a testing decision.",

    sat25: null,
    sat50: null,
    sat75: null,

    act25: null,
    act50: null,
    act75: null,

    scoreContext:
      "No verified current SAT/ACT percentile profile is loaded yet. AltWing will not manufacture a comparison.",

    averageGpa:
      "Verify current official profile",

    gpaNote:
      "No verified comparable GPA profile is loaded yet. GPA methodology can vary by institution.",

    admissionRate:
      "Verify current official source",

    source:
      "Official undergraduate program + first-year admissions pages",

    sourceYear:
      "VERIFY CURRENT",

    strengths: [
      "Aerospace Engineering",
      "Dedicated or direct aerospace-focused undergraduate pathway",
      "Engineering design and technical project opportunities",
      "Aerospace-relevant research ecosystem",
    ],
  },

  {
    id: "ucsd",
    name: "University of California, San Diego",
    shortName: "UC San Diego",
    location: "La Jolla, California",

    major: "Aerospace Engineering",
    aerospaceFit: "DIRECT MAJOR",

    testingPolicy:
      "CHECK_CURRENT",

    testingPolicyNote:
      "AltWing has not yet verified this school's testing policy for the current application cycle. Check the official first-year admissions page before making a testing decision.",

    sat25: null,
    sat50: null,
    sat75: null,

    act25: null,
    act50: null,
    act75: null,

    scoreContext:
      "No verified current SAT/ACT percentile profile is loaded yet. AltWing will not manufacture a comparison.",

    averageGpa:
      "Verify current official profile",

    gpaNote:
      "No verified comparable GPA profile is loaded yet. GPA methodology can vary by institution.",

    admissionRate:
      "Verify current official source",

    source:
      "Official undergraduate program + first-year admissions pages",

    sourceYear:
      "VERIFY CURRENT",

    strengths: [
      "Aerospace Engineering",
      "Dedicated or direct aerospace-focused undergraduate pathway",
      "Engineering design and technical project opportunities",
      "Aerospace-relevant research ecosystem",
    ],
  },

  {
    id: "florida",
    name: "University of Florida",
    shortName: "Florida",
    location: "Gainesville, Florida",

    major: "Aerospace Engineering",
    aerospaceFit: "DIRECT MAJOR",

    testingPolicy:
      "CHECK_CURRENT",

    testingPolicyNote:
      "AltWing has not yet verified this school's testing policy for the current application cycle. Check the official first-year admissions page before making a testing decision.",

    sat25: null,
    sat50: null,
    sat75: null,

    act25: null,
    act50: null,
    act75: null,

    scoreContext:
      "No verified current SAT/ACT percentile profile is loaded yet. AltWing will not manufacture a comparison.",

    averageGpa:
      "Verify current official profile",

    gpaNote:
      "No verified comparable GPA profile is loaded yet. GPA methodology can vary by institution.",

    admissionRate:
      "Verify current official source",

    source:
      "Official undergraduate program + first-year admissions pages",

    sourceYear:
      "VERIFY CURRENT",

    strengths: [
      "Aerospace Engineering",
      "Dedicated or direct aerospace-focused undergraduate pathway",
      "Engineering design and technical project opportunities",
      "Aerospace-relevant research ecosystem",
    ],
  },

  {
    id: "auburn",
    name: "Auburn University",
    shortName: "Auburn",
    location: "Auburn, Alabama",

    major: "Aerospace Engineering",
    aerospaceFit: "DIRECT MAJOR",

    testingPolicy:
      "CHECK_CURRENT",

    testingPolicyNote:
      "AltWing has not yet verified this school's testing policy for the current application cycle. Check the official first-year admissions page before making a testing decision.",

    sat25: null,
    sat50: null,
    sat75: null,

    act25: null,
    act50: null,
    act75: null,

    scoreContext:
      "No verified current SAT/ACT percentile profile is loaded yet. AltWing will not manufacture a comparison.",

    averageGpa:
      "Verify current official profile",

    gpaNote:
      "No verified comparable GPA profile is loaded yet. GPA methodology can vary by institution.",

    admissionRate:
      "Verify current official source",

    source:
      "Official undergraduate program + first-year admissions pages",

    sourceYear:
      "VERIFY CURRENT",

    strengths: [
      "Aerospace Engineering",
      "Dedicated or direct aerospace-focused undergraduate pathway",
      "Engineering design and technical project opportunities",
      "Aerospace-relevant research ecosystem",
    ],
  },

  {
    id: "alabama",
    name: "The University of Alabama",
    shortName: "Alabama",
    location: "Tuscaloosa, Alabama",

    major: "Aerospace Engineering and Mechanics",
    aerospaceFit: "DIRECT MAJOR",

    testingPolicy:
      "CHECK_CURRENT",

    testingPolicyNote:
      "AltWing has not yet verified this school's testing policy for the current application cycle. Check the official first-year admissions page before making a testing decision.",

    sat25: null,
    sat50: null,
    sat75: null,

    act25: null,
    act50: null,
    act75: null,

    scoreContext:
      "No verified current SAT/ACT percentile profile is loaded yet. AltWing will not manufacture a comparison.",

    averageGpa:
      "Verify current official profile",

    gpaNote:
      "No verified comparable GPA profile is loaded yet. GPA methodology can vary by institution.",

    admissionRate:
      "Verify current official source",

    source:
      "Official undergraduate program + first-year admissions pages",

    sourceYear:
      "VERIFY CURRENT",

    strengths: [
      "Aerospace Engineering and Mechanics",
      "Dedicated or direct aerospace-focused undergraduate pathway",
      "Engineering design and technical project opportunities",
      "Aerospace-relevant research ecosystem",
    ],
  },

  {
    id: "ncstate",
    name: "North Carolina State University",
    shortName: "NC State",
    location: "Raleigh, North Carolina",

    major: "Aerospace Engineering",
    aerospaceFit: "DIRECT MAJOR",

    testingPolicy:
      "CHECK_CURRENT",

    testingPolicyNote:
      "AltWing has not yet verified this school's testing policy for the current application cycle. Check the official first-year admissions page before making a testing decision.",

    sat25: null,
    sat50: null,
    sat75: null,

    act25: null,
    act50: null,
    act75: null,

    scoreContext:
      "No verified current SAT/ACT percentile profile is loaded yet. AltWing will not manufacture a comparison.",

    averageGpa:
      "Verify current official profile",

    gpaNote:
      "No verified comparable GPA profile is loaded yet. GPA methodology can vary by institution.",

    admissionRate:
      "Verify current official source",

    source:
      "Official undergraduate program + first-year admissions pages",

    sourceYear:
      "VERIFY CURRENT",

    strengths: [
      "Aerospace Engineering",
      "Dedicated or direct aerospace-focused undergraduate pathway",
      "Engineering design and technical project opportunities",
      "Aerospace-relevant research ecosystem",
    ],
  },

  {
    id: "iowastate",
    name: "Iowa State University",
    shortName: "Iowa State",
    location: "Ames, Iowa",

    major: "Aerospace Engineering",
    aerospaceFit: "DIRECT MAJOR",

    testingPolicy:
      "CHECK_CURRENT",

    testingPolicyNote:
      "AltWing has not yet verified this school's testing policy for the current application cycle. Check the official first-year admissions page before making a testing decision.",

    sat25: null,
    sat50: null,
    sat75: null,

    act25: null,
    act50: null,
    act75: null,

    scoreContext:
      "No verified current SAT/ACT percentile profile is loaded yet. AltWing will not manufacture a comparison.",

    averageGpa:
      "Verify current official profile",

    gpaNote:
      "No verified comparable GPA profile is loaded yet. GPA methodology can vary by institution.",

    admissionRate:
      "Verify current official source",

    source:
      "Official undergraduate program + first-year admissions pages",

    sourceYear:
      "VERIFY CURRENT",

    strengths: [
      "Aerospace Engineering",
      "Dedicated or direct aerospace-focused undergraduate pathway",
      "Engineering design and technical project opportunities",
      "Aerospace-relevant research ecosystem",
    ],
  },

  {
    id: "asu",
    name: "Arizona State University",
    shortName: "Arizona State",
    location: "Tempe, Arizona",

    major: "Aerospace Engineering",
    aerospaceFit: "DIRECT MAJOR",

    testingPolicy:
      "CHECK_CURRENT",

    testingPolicyNote:
      "AltWing has not yet verified this school's testing policy for the current application cycle. Check the official first-year admissions page before making a testing decision.",

    sat25: null,
    sat50: null,
    sat75: null,

    act25: null,
    act50: null,
    act75: null,

    scoreContext:
      "No verified current SAT/ACT percentile profile is loaded yet. AltWing will not manufacture a comparison.",

    averageGpa:
      "Verify current official profile",

    gpaNote:
      "No verified comparable GPA profile is loaded yet. GPA methodology can vary by institution.",

    admissionRate:
      "Verify current official source",

    source:
      "Official undergraduate program + first-year admissions pages",

    sourceYear:
      "VERIFY CURRENT",

    strengths: [
      "Aerospace Engineering",
      "Dedicated or direct aerospace-focused undergraduate pathway",
      "Engineering design and technical project opportunities",
      "Aerospace-relevant research ecosystem",
    ],
  },

  {
    id: "arizona",
    name: "University of Arizona",
    shortName: "Arizona",
    location: "Tucson, Arizona",

    major: "Aerospace Engineering",
    aerospaceFit: "DIRECT MAJOR",

    testingPolicy:
      "CHECK_CURRENT",

    testingPolicyNote:
      "AltWing has not yet verified this school's testing policy for the current application cycle. Check the official first-year admissions page before making a testing decision.",

    sat25: null,
    sat50: null,
    sat75: null,

    act25: null,
    act50: null,
    act75: null,

    scoreContext:
      "No verified current SAT/ACT percentile profile is loaded yet. AltWing will not manufacture a comparison.",

    averageGpa:
      "Verify current official profile",

    gpaNote:
      "No verified comparable GPA profile is loaded yet. GPA methodology can vary by institution.",

    admissionRate:
      "Verify current official source",

    source:
      "Official undergraduate program + first-year admissions pages",

    sourceYear:
      "VERIFY CURRENT",

    strengths: [
      "Aerospace Engineering",
      "Dedicated or direct aerospace-focused undergraduate pathway",
      "Engineering design and technical project opportunities",
      "Aerospace-relevant research ecosystem",
    ],
  },

  {
    id: "berkeley",
    name: "University of California, Berkeley",
    shortName: "UC Berkeley",
    location: "Berkeley, California",

    major: "Aerospace Engineering",
    aerospaceFit: "DIRECT MAJOR",

    testingPolicy:
      "CHECK_CURRENT",

    testingPolicyNote:
      "AltWing has not yet verified this school's testing policy for the current application cycle. Check the official first-year admissions page before making a testing decision.",

    sat25: null,
    sat50: null,
    sat75: null,

    act25: null,
    act50: null,
    act75: null,

    scoreContext:
      "No verified current SAT/ACT percentile profile is loaded yet. AltWing will not manufacture a comparison.",

    averageGpa:
      "Verify current official profile",

    gpaNote:
      "No verified comparable GPA profile is loaded yet. GPA methodology can vary by institution.",

    admissionRate:
      "Verify current official source",

    source:
      "Official undergraduate program + first-year admissions pages",

    sourceYear:
      "VERIFY CURRENT",

    strengths: [
      "Aerospace Engineering",
      "Dedicated or direct aerospace-focused undergraduate pathway",
      "Engineering design and technical project opportunities",
      "Aerospace-relevant research ecosystem",
    ],
  },

  {
    id: "rpi",
    name: "Rensselaer Polytechnic Institute",
    shortName: "RPI",
    location: "Troy, New York",

    major: "Aeronautical Engineering",
    aerospaceFit: "DIRECT MAJOR",

    testingPolicy:
      "CHECK_CURRENT",

    testingPolicyNote:
      "AltWing has not yet verified this school's testing policy for the current application cycle. Check the official first-year admissions page before making a testing decision.",

    sat25: null,
    sat50: null,
    sat75: null,

    act25: null,
    act50: null,
    act75: null,

    scoreContext:
      "No verified current SAT/ACT percentile profile is loaded yet. AltWing will not manufacture a comparison.",

    averageGpa:
      "Verify current official profile",

    gpaNote:
      "No verified comparable GPA profile is loaded yet. GPA methodology can vary by institution.",

    admissionRate:
      "Verify current official source",

    source:
      "Official undergraduate program + first-year admissions pages",

    sourceYear:
      "VERIFY CURRENT",

    strengths: [
      "Aeronautical Engineering",
      "Dedicated or direct aerospace-focused undergraduate pathway",
      "Engineering design and technical project opportunities",
      "Aerospace-relevant research ecosystem",
    ],
  },

  {
    id: "mst",
    name: "Missouri University of Science and Technology",
    shortName: "Missouri S&T",
    location: "Rolla, Missouri",

    major: "Aerospace Engineering",
    aerospaceFit: "DIRECT MAJOR",

    testingPolicy:
      "CHECK_CURRENT",

    testingPolicyNote:
      "AltWing has not yet verified this school's testing policy for the current application cycle. Check the official first-year admissions page before making a testing decision.",

    sat25: null,
    sat50: null,
    sat75: null,

    act25: null,
    act50: null,
    act75: null,

    scoreContext:
      "No verified current SAT/ACT percentile profile is loaded yet. AltWing will not manufacture a comparison.",

    averageGpa:
      "Verify current official profile",

    gpaNote:
      "No verified comparable GPA profile is loaded yet. GPA methodology can vary by institution.",

    admissionRate:
      "Verify current official source",

    source:
      "Official undergraduate program + first-year admissions pages",

    sourceYear:
      "VERIFY CURRENT",

    strengths: [
      "Aerospace Engineering",
      "Dedicated or direct aerospace-focused undergraduate pathway",
      "Engineering design and technical project opportunities",
      "Aerospace-relevant research ecosystem",
    ],
  },

  {
    id: "cornell",
    name: "Cornell University",
    shortName: "Cornell",
    location: "Ithaca, New York",

    major: "Mechanical Engineering + aerospace-related study",
    aerospaceFit: "RELATED ENGINEERING PATH",

    testingPolicy:
      "CHECK_CURRENT",

    testingPolicyNote:
      "AltWing has not yet verified this school's testing policy for the current application cycle. Check the official first-year admissions page before making a testing decision.",

    sat25: null,
    sat50: null,
    sat75: null,

    act25: null,
    act50: null,
    act75: null,

    scoreContext:
      "No verified current SAT/ACT percentile profile is loaded yet. AltWing will not manufacture a comparison.",

    averageGpa:
      "Verify current official profile",

    gpaNote:
      "No verified comparable GPA profile is loaded yet. GPA methodology can vary by institution.",

    admissionRate:
      "Verify current official source",

    source:
      "Official undergraduate program + first-year admissions pages",

    sourceYear:
      "VERIFY CURRENT",

    strengths: [
      "Mechanical Engineering + aerospace-related study",
      "Strong adjacent engineering pathway",
      "Aerospace-relevant design, systems, or research opportunities",
      "Useful option for students who want broader engineering flexibility",
    ],
  },

  {
    id: "princeton",
    name: "Princeton University",
    shortName: "Princeton",
    location: "Princeton, New Jersey",

    major: "Mechanical and Aerospace Engineering",
    aerospaceFit: "RELATED ENGINEERING PATH",

    testingPolicy:
      "CHECK_CURRENT",

    testingPolicyNote:
      "AltWing has not yet verified this school's testing policy for the current application cycle. Check the official first-year admissions page before making a testing decision.",

    sat25: null,
    sat50: null,
    sat75: null,

    act25: null,
    act50: null,
    act75: null,

    scoreContext:
      "No verified current SAT/ACT percentile profile is loaded yet. AltWing will not manufacture a comparison.",

    averageGpa:
      "Verify current official profile",

    gpaNote:
      "No verified comparable GPA profile is loaded yet. GPA methodology can vary by institution.",

    admissionRate:
      "Verify current official source",

    source:
      "Official undergraduate program + first-year admissions pages",

    sourceYear:
      "VERIFY CURRENT",

    strengths: [
      "Mechanical and Aerospace Engineering",
      "Strong adjacent engineering pathway",
      "Aerospace-relevant design, systems, or research opportunities",
      "Useful option for students who want broader engineering flexibility",
    ],
  },

  {
    id: "cmu",
    name: "Carnegie Mellon University",
    shortName: "Carnegie Mellon",
    location: "Pittsburgh, Pennsylvania",

    major: "Mechanical Engineering + Robotics / autonomy",
    aerospaceFit: "RELATED ENGINEERING PATH",

    testingPolicy:
      "CHECK_CURRENT",

    testingPolicyNote:
      "AltWing has not yet verified this school's testing policy for the current application cycle. Check the official first-year admissions page before making a testing decision.",

    sat25: null,
    sat50: null,
    sat75: null,

    act25: null,
    act50: null,
    act75: null,

    scoreContext:
      "No verified current SAT/ACT percentile profile is loaded yet. AltWing will not manufacture a comparison.",

    averageGpa:
      "Verify current official profile",

    gpaNote:
      "No verified comparable GPA profile is loaded yet. GPA methodology can vary by institution.",

    admissionRate:
      "Verify current official source",

    source:
      "Official undergraduate program + first-year admissions pages",

    sourceYear:
      "VERIFY CURRENT",

    strengths: [
      "Mechanical Engineering + Robotics / autonomy",
      "Strong adjacent engineering pathway",
      "Aerospace-relevant design, systems, or research opportunities",
      "Useful option for students who want broader engineering flexibility",
    ],
  },

  {
    id: "duke",
    name: "Duke University",
    shortName: "Duke",
    location: "Durham, North Carolina",

    major: "Mechanical Engineering + aerospace-related pathways",
    aerospaceFit: "RELATED ENGINEERING PATH",

    testingPolicy:
      "CHECK_CURRENT",

    testingPolicyNote:
      "AltWing has not yet verified this school's testing policy for the current application cycle. Check the official first-year admissions page before making a testing decision.",

    sat25: null,
    sat50: null,
    sat75: null,

    act25: null,
    act50: null,
    act75: null,

    scoreContext:
      "No verified current SAT/ACT percentile profile is loaded yet. AltWing will not manufacture a comparison.",

    averageGpa:
      "Verify current official profile",

    gpaNote:
      "No verified comparable GPA profile is loaded yet. GPA methodology can vary by institution.",

    admissionRate:
      "Verify current official source",

    source:
      "Official undergraduate program + first-year admissions pages",

    sourceYear:
      "VERIFY CURRENT",

    strengths: [
      "Mechanical Engineering + aerospace-related pathways",
      "Strong adjacent engineering pathway",
      "Aerospace-relevant design, systems, or research opportunities",
      "Useful option for students who want broader engineering flexibility",
    ],
  },

];
