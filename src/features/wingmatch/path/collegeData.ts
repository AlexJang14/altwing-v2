export interface CollegeProfile {
  id: string;
  name: string;
  shortName: string;
  location: string;

  major: string;
  aerospaceFit: string;

  sat25: number;
  sat50: number;
  sat75: number;

  act25: number;
  act50: number;
  act75: number;

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

    sat25: 1370,
    sat50: 1460,
    sat75: 1530,

    act25: 31,
    act50: 33,
    act75: 35,

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
      "Major aerospace research university",
      "Strong Atlanta engineering and technology ecosystem",
      "Extensive undergraduate technical project opportunities",
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

    sat25: 1370,
    sat50: 1470,
    sat75: 1530,

    act25: 32,
    act50: 33,
    act75: 34,

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
      "Strong design and technical organizations",
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

    sat25: 1520,
    sat50: 1550,
    sat75: 1570,

    act25: 34,
    act50: 35,
    act75: 35,

    averageGpa: "Not reported",
    gpaNote:
      "MIT's official 2025–26 CDS does not report an average high-school GPA.",

    admissionRate:
      "~4.6% overall, Fall 2025",

    source:
      "MIT Common Data Set",
    sourceYear: "2025–26",

    strengths: [
      "Aeronautics and Astronautics major",
      "Exceptional aerospace research depth",
      "Strong systems and technical design culture",
      "Extensive undergraduate research opportunities",
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

    sat25: 1520,
    sat50: 1550,
    sat75: 1570,

    act25: 34,
    act50: 35,
    act75: 36,

    averageGpa: "Not reported",
    gpaNote:
      "Stanford does not publish a minimum GPA requirement. Academic achievement is evaluated in the context of the student's school and available curriculum.",

    admissionRate:
      "~3.8% overall, Fall 2025",

    source:
      "Stanford Common Data Set + Stanford Undergraduate Admission",
    sourceYear: "2025–26",

    strengths: [
      "Aeronautics and Astronautics BS",
      "Aircraft and spacecraft design curriculum",
      "Stanford Student Space Initiative ecosystem",
      "Strong research, innovation, and entrepreneurship environment",
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

    sat25: 1220,
    sat50: 1360,
    sat75: 1470,

    act25: 28,
    act50: 32,
    act75: 34,

    averageGpa:
      "3.81–4.00 Engineering middle 50%",
    gpaNote:
      "Purdue's official Engineering freshman profile reports a 3.81–4.00 unweighted middle-50% GPA range. This is more relevant to an aerospace applicant than the university-wide number.",

    admissionRate:
      "49.8% university / 46.1% Engineering, Fall 2024",

    source:
      "Purdue CDS + Purdue Undergraduate Admissions Class Profile",
    sourceYear:
      "2025–26 CDS; Fall 2024 Engineering profile",

    strengths: [
      "Aeronautical and Astronautical Engineering program",
      "Aircraft and spacecraft curriculum",
      "Large aerospace engineering community",
      "Strong design, propulsion, structures, controls, and industry pathways",
    ],
  },

  {
    id: "uiuc",
    name:
      "University of Illinois Urbana-Champaign",
    shortName: "UIUC",
    location: "Urbana-Champaign, Illinois",

    major: "Aerospace Engineering",
    aerospaceFit: "DIRECT MAJOR",

    sat25: 1390,
    sat50: 1470,
    sat75: 1520,

    act25: 30,
    act50: 33,
    act75: 34,

    averageGpa:
      "3.89–4.00 Grainger middle 50%",
    gpaNote:
      "Current Illinois admissions data reports a 3.89–4.00 middle-50% GPA range for Grainger College of Engineering. The SAT percentile values shown above are institution-level CDS context.",

    admissionRate:
      "36.6% university / 21.2% Grainger, 2025",

    source:
      "Illinois Common Data Set + Illinois Admissions Class Profile",
    sourceYear:
      "2024–25 CDS; 2025 admissions profile",

    strengths: [
      "Dedicated Aerospace Engineering major",
      "Grainger College of Engineering",
      "Strong aerospace research and technical depth",
      "Excellent engineering clubs and project ecosystem",
    ],
  },

  {
    id: "tamu",
    name: "Texas A&M University",
    shortName: "Texas A&M",
    location: "College Station, Texas",

    major: "Aerospace Engineering",
    aerospaceFit: "DIRECT MAJOR",

    sat25: 1160,
    sat50: 1280,
    sat75: 1390,

    act25: 24,
    act50: 28,
    act75: 32,

    averageGpa: "Not reported",
    gpaNote:
      "Texas A&M's current CDS reports high-school GPA as N/A. Class rank is much more informative: 71.56% of reporting first-years ranked in the top 10%.",

    admissionRate:
      "~51.7% overall, Fall 2025",

    source:
      "Texas A&M Common Data Set",
    sourceYear: "2025–26",

    strengths: [
      "Bachelor of Science in Aerospace Engineering",
      "Aerodynamics, propulsion, structures, dynamics, and controls",
      "Two-semester aerospace design sequence",
      "Strong aerospace industry and research connections",
    ],
  },

  {
    id: "erau",
    name:
      "Embry-Riddle Aeronautical University–Daytona Beach",
    shortName: "Embry-Riddle",
    location: "Daytona Beach, Florida",

    major: "Aerospace Engineering",
    aerospaceFit: "DIRECT MAJOR",

    sat25: 1160,
    sat50: 1250,
    sat75: 1330,

    act25: 24,
    act50: 27,
    act75: 30,

    averageGpa:
      "No comparable 4.0 average reported",
    gpaNote:
      "Embry-Riddle's published 2023–24 CDS notes that its reported high-school GPAs are weighted, so AltWing does not convert them into a fake 4.0-scale average.",

    admissionRate:
      "Use with older-data caution",

    source:
      "Embry-Riddle Daytona Beach Common Data Set",
    sourceYear: "2023–24",

    strengths: [
      "Aerospace-focused university environment",
      "Dedicated Aerospace Engineering major",
      "Strong aviation and space identity",
      "Hands-on engineering and aerospace industry orientation",
    ],
  },
];
