/* ==========================================================================
   CV CONTENT — the single source of truth.
   Everything shown on the website AND in the downloadable PDF comes from here.

   Rules of thumb:
   - Leave a list empty ([]) or a text empty ("") to hide that part of the site.
     A section with nothing in it disappears from the page and from the menu.
   - After changing anything, regenerate the PDF:  node scripts/build-pdf.js

   Lines marked  // CONFIRM  were inferred from the old CV and need checking.
   ========================================================================== */

window.CV = {
  person: {
    name: "Alvin Ghindăoanu",
    role: "Industrial Engineering & Business student",
    tagline:
      "I study engineering at POLITEHNICA Bucharest and business at ASE, and I bring the discipline of 13 years of elite karate — World and European titles included — to everything I work on.",
    location: "Bucharest, Romania",
    availability: "",                         // e.g. "Open to internships" — "" hides the badge
    photo: "assets/profile.jpg",
    photoAlt: "Portrait of Alvin Ghindăoanu in a white shirt and black tie",
    email: "alvinmarc17@yahoo.com",
    phone: "",                                // optional — would appear in the PDF only
    links: [
      // { label: "LinkedIn", url: "https://www.linkedin.com/in/..." },
      // { label: "GitHub", url: "https://github.com/..." }
    ],
    pdf: "assets/cv.pdf"
  },

  about: {
    // Big statement that lights up word by word as the visitor scrolls.
    lead:
      "I study engineering and business side by side, and I learned to perform under pressure on the tatami: 13 years of Shotokan karate, three world titles and a European one.",
    paragraphs: [
      "Travelling to national and international championships from an early age made me independent early. I learned to organise my own time, to answer for my own results and to stay composed when it counts.",
      "Balancing elite sport with strong academic results left little room for wasted effort, so I work efficiently and adapt quickly when plans change. I settle into new teams easily, and I want to put the same discipline to work on real engineering and business problems."
    ],
    facts: [
      { label: "Based in", value: "Bucharest, Romania" },
      { label: "Studying", value: "Industrial Engineering · Business Administration" },
      { label: "Languages", value: "Romanian, English (C1–C2), German (A2)" },
      { label: "Licences", value: "Driving B · Motorcycle A2" }
    ],
    stats: [
      { value: 13, suffix: "", label: "Years of competitive karate" },
      { value: 3, suffix: "", label: "World championship titles" },
      { value: 8, suffix: "", label: "World & European medals" },
      { value: 2, suffix: "", label: "Degrees studied in parallel" }   // CONFIRM
    ]
  },

  // Internships, jobs, part-time work. Empty for now, so the section is hidden.
  experience: [
    /* {
      role: "Intern — Process Engineering",
      company: "Company Name",
      url: "",
      location: "Bucharest",
      start: "Jul 2026",
      end: "Sep 2026",
      current: false,
      summary: "One line on what the role was.",
      bullets: [{ text: "What you did, with a number if you have one." }],
      tech: ["Excel", "AutoCAD"]
    } */
  ],

  // University, personal or team projects. Empty for now, so the section is hidden.
  projects: [
    /* {
      title: "Project name",
      description: "What it is, your part in it, and the result.",
      tags: ["SolidWorks", "Team of 4"],
      links: [{ label: "Report", url: "https://..." }],
      image: "assets/projects/name.jpg",
      featured: true
    } */
  ],

  education: [
    {
      degree: "Industrial Engineering",
      school: "POLITEHNICA Bucharest — Faculty of Industrial Engineering and Robotics",
      location: "",
      start: "2023",                          // CONFIRM
      end: "Present",                         // CONFIRM
      details: ""
    },
    {
      degree: "Business Administration (taught in foreign languages)",
      school: "Bucharest University of Economic Studies (ASE) — FABIZ",
      location: "",
      start: "2023",                          // CONFIRM
      end: "Present",                         // CONFIRM
      details: ""
    },
    {
      degree: "Baccalaureate — Mathematics & Computer Science, intensive English",
      school: "I.L. Caragiale National College, Bucharest",
      location: "",
      start: "",
      end: "2023",
      details: "Honourable mentions for academic results in grades 10 and 11."
    }
  ],

  // Shown as a timeline under "Achievements".
  achievements: {
    intro:
      "Thirteen years of Shotokan karate, competing in the WUKF, WADO and SKDUN federations at national, European and world level.",
    items: [
      {
        role: "SKDUN World Karate Championship",
        company: "Chalkida, Greece",
        start: "2023",
        location: "29 Sep – 1 Oct",
        bullets: [
          { label: "Gold", text: "Individual kumite (ippon shobu), youth 18–20, +78 kg" },
          { label: "Gold", text: "Individual kumite (ippon shobu), youth 18–20, open" },
          { label: "Silver", text: "Individual kumite (sanbon shobu), youth 18–20, +78 kg" }
        ],
        tech: ["World champion", "3 medals"]
      },
      {
        role: "SKDUN European Shotokan Karate Championship",
        company: "Lignano Sabbiadoro, Italy",
        start: "2023",
        location: "31 Mar – 2 Apr",
        bullets: [
          { label: "Gold", text: "Team kumite, juniors 16–20, mixed, open" },
          { label: "Silver", text: "Individual kumite (ippon shobu), youth 18–20, +78 kg" },
          { label: "Silver", text: "Individual kumite (sanbon shobu), youth 18–20, +78 kg" }
        ],
        tech: ["European champion", "3 medals"]
      },
      {
        role: "SKDUN National Championship & Romanian Cup",
        company: "Voluntari, Romania",
        start: "2023",
        location: "4 – 5 Mar",
        bullets: [
          { label: "Gold", text: "Individual kumite (ippon shobu), youth 18–20, +78 kg" },
          { label: "Gold", text: "Individual kata, seniors 18+, 3–1 kyu" },
          { label: "Gold", text: "Romanian Karate Cup — individual kumite (ippon shobu), youth 18–20, +78 kg" }
        ],
        tech: ["National champion"]
      },
      {
        role: "SKDUN World Shotokan Karate Championship & World Cup",
        company: "Karlovy Vary, Czech Republic",
        start: "2022",
        location: "30 Sep – 2 Oct",
        bullets: [
          { label: "Gold", text: "Team kumite, juniors 16–20, male, open" },
          { label: "Silver", text: "Individual kumite (ippon shobu), juniors 16–17, +73 kg" }
        ],
        tech: ["World champion", "2 medals"]
      }
    ]
  },

  // Words that scroll across the band between scenes. Empty list = use the skills.
  band: ["Industrial Engineering", "Business Administration", "World Champion", "Shotokan Karate", "Discipline", "Bucharest"],

  skills: [
    { group: "Strengths", items: ["Discipline", "Composure under pressure", "Adaptability", "Organisation", "Responsibility", "Teamwork"] },
    { group: "Digital", items: ["Microsoft Excel", "PowerPoint", "Word", "Managing data & digital content", "Online collaboration tools"] }
    // Add engineering and business tools here, e.g.
    // { group: "Engineering", items: ["AutoCAD", "SolidWorks", "MATLAB"] }
  ],

  certifications: [
    { title: "Fashion and the Circular Economy — Circular Learning Space for Digital Skills", issuer: "EIT RawMaterials", year: "2022", url: "" },
    { title: "National-level kumite referee — examination certificate", issuer: "", year: "", url: "" }
  ],

  volunteering: [
    {
      title: "Chances for the Future (Șanse pentru viitor)",
      issuer: "Socio-educational programme for children and young people — collected school and educational materials for disadvantaged families.",
      year: "2022"
    }
  ],

  languages: [
    { name: "Romanian", level: "Native" },
    { name: "English", level: "C1–C2" },
    { name: "German", level: "A2" }
  ],

  interests: ["Snowboarding", "Wakeboarding", "Basketball", "Karate"],

  contact: {
    headline: "Let's talk.",
    note: "Email is the fastest way to reach me."
  }
};
