/* ==========================================================================
   CV CONTENT — the single source of truth.
   Everything shown on the website AND in the downloadable PDF comes from here.

   Rules of thumb:
   - Leave a list empty ([]) or a text empty ("") to hide that part of the site.
     A section with nothing in it disappears from the page and from the menu.
   - After changing anything, regenerate the PDF:  node scripts/build-pdf.js

   ========================================================================== */

window.CV = {
  person: {
    name: "Alvin Ghindăoanu",
    role: "Industrial Engineering student",
    tagline:
      "Final-year Industrial Engineering student at POLITEHNICA Bucharest, back from an Erasmus year at UPM Madrid. I design in CATIA, SolidWorks and AutoCAD, and I am looking for an internship or an entry-level engineering role.",
    location: "Bucharest, Romania",
    availability: "Open to internships & entry-level roles",   // "" hides the badge
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
      "I like turning requirements into real parts and working systems: mechanical design in CATIA and SolidWorks, CNC programming in EdgeCAM, and connected prototypes built on Raspberry Pi.",
    paragraphs: [
      "I am in my final year of Industrial Engineering at POLITEHNICA Bucharest and study Business Administration at ASE in parallel. I spent the 2025–26 academic year on Erasmus at Universidad Politécnica de Madrid, working in international teams on a pipeline-inspection drone, a solar-powered wildfire-detection station and two smaller connected products.",
      "Outside engineering I have competed in Shotokan karate for more than 13 years, up to World and European titles. It is where I learned to put in the work, stay disciplined and keep going when it gets hard."
    ],
    facts: [
      { label: "Based in", value: "Bucharest, Romania" },
      { label: "Looking for", value: "Engineering internship or entry-level role" },
      { label: "Graduating", value: "2027" },
      { label: "Languages", value: "Romanian, English (C1–C2), Spanish (B2), German (A2)" },
      { label: "Licences", value: "Driving B · Motorcycle A2" }
    ],
    stats: [
      { value: 7, suffix: "", label: "Engineering projects on this page" },
      { value: 4, suffix: "", label: "Languages spoken" },
      { value: 2, suffix: "", label: "Degrees studied in parallel" },
      { value: 13, suffix: "+", label: "Years of competitive karate" }
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
      bullets: ["What you did, with a number if you have one."],
      tech: ["Excel", "AutoCAD"]
    } */
  ],

  /* Projects. Optional fields:
     meta       small line above the title (where, course, team size)
     role       what YOU did — the line recruiters look for
     highlights up to three numbers with a short label
     image      a picture, or
     model      a binary .stl file shown as a live 3D model
     short      one-sentence version used in the printable CV
     pdf        false keeps the project out of the printable CV                   */
  projects: [
    {
      title: "PipeBot — pipeline inspection drone",
      meta: "UPM Madrid · Mechatronics Systems Design · Team of 4",
      year: "2025–26",
      description:
        "Design of a compact ducted-fan quadcopter for inspecting pipes, ducts and tanks where sending a person in is unsafe. The frame doubles as a collision cage, and the electronics bay seats a flight controller, LiDAR, optical-flow and time-of-flight sensors.",
      short:
        "Compact ducted-fan quadcopter for inspecting pipes and tanks, designed in CATIA; the frame doubles as a collision cage around the sensors and flight electronics.",
      role: "Co-designed the mechanical structure in CATIA and wrote the discussion, conclusions and cost analysis.",
      highlights: [
        { value: "936 g", label: "take-off weight" },
        { value: "525 mm", label: "motor-to-motor span" },
        { value: "≈ €1,000", label: "parts cost" }
      ],
      tags: ["CATIA", "Mechanical design", "Design for 3D printing", "Mechatronics"],
      links: [],
      image: "assets/projects/pipebot.jpg",
      imageAlt: "CATIA model of the PipeBot frame: a central body with four ring-shaped propeller ducts",
      featured: true
    },
    {
      title: "Cover part — CNC milling program",
      meta: "POLITEHNICA Bucharest · EdgeCAM lab · Individual",
      year: "",
      description:
        "Machining program for a 65 × 60 × 27 mm cover on a vertical mill: eight operations, with end mills from 32 mm down to 4 mm and three chamfering passes. The part model was supplied; choosing the tools and building the machining sequence was the exercise. Drag the model to turn it around.",
      short:
        "2.5D machining program in EdgeCAM for a 65 × 60 × 27 mm cover on a vertical mill: eight operations with end mills from 32 mm to 4 mm and three chamfering passes.",
      role: "",
      highlights: [
        { value: "8", label: "machining operations" },
        { value: "7", label: "cutting tools" }
      ],
      tags: ["EdgeCAM", "2.5D milling", "CNC programming"],
      links: [],
      model: "assets/models/cover.stl",
      modelLabel: "65 × 60 × 27 mm"
    },
    {
      title: "Roller chain — parts and assembly",
      meta: "POLITEHNICA Bucharest · SolidWorks · Individual",
      year: "",
      description:
        "A roller chain built from scratch in SolidWorks: five parts modelled one by one — inner and outer link plates, bushing, ring and pin — then mated into a multi-link assembly.",
      short:
        "Roller chain modelled in SolidWorks: five parts (link plates, bushing, ring, pin) mated into a multi-link assembly.",
      role: "",
      highlights: [],
      tags: ["SolidWorks", "Part modelling", "Assembly"],
      links: [],
      image: "assets/projects/chain.jpg",
      imageAlt: "SolidWorks roller chain assembly in red, with its five separate parts shown beside it"
    },
    {
      title: "Smart solar microgrid with wildfire early warning",
      meta: "UPM Madrid · IoT and Raspberry Pi · Team of 2",
      year: "2025–26",
      description:
        "Design of an off-grid forest station that detects early signs of fire and raises the alarm over LoRa radio when there is no internet. We sized the solar, battery and supercapacitor system, checked it with a 24-hour simulation and trained a fire-risk classifier on synthetic sensor data.",
      short:
        "Off-grid forest station that detects early signs of fire and raises the alarm over LoRa radio; solar, battery and supercapacitor system sized and checked with a 24-hour simulation.",
      role: "Sized the solar, battery and supercapacitor system, built the 24-hour simulation and set up the LoRa radio link and its code.",
      highlights: [
        { value: "20 km", label: "LoRa link budget" },
        { value: "40+ days", label: "autonomy without sun" }
      ],
      tags: ["Raspberry Pi", "Python", "LoRa", "Energy system sizing"],
      links: [],
      image: "assets/projects/microgrid.jpg",
      imageAlt: "Simulation plot of temperature and humidity over 24 hours with the fire alarm trigger marked"
    },
    {
      title: "MV Agusta emblem — CAD study",
      meta: "Individual work · Fusion 360",
      year: "",
      description:
        "A relief study of the MV Agusta emblem with my initials, modelled in Fusion 360 at 152 × 90 × 3 mm with stepped relief levels. This is the actual model file — drag it to turn it around.",
      role: "",
      highlights: [],
      tags: ["Fusion 360", "3D modelling"],
      links: [],
      model: "assets/models/emblem.stl",
      modelLabel: "152 × 90 × 3 mm",
      pdf: false                              // a turning model has no place on paper
    },
    {
      title: "PV-powered key tracker",
      meta: "UPM Madrid · Photovoltaic Powered Products · Team of 5",
      year: "2026",
      description:
        "Concept and energy budget for a key finder that never needs charging: a 40 mm disc with an indoor-light solar cell, Bluetooth for short range and assisted GPS for recovery. Sized so indoor light covers standby use and the battery rides out a 72-hour worst case with a 15× margin.",
      short:
        "Concept and energy budget for a key finder that never needs charging: indoor-light solar cell, Bluetooth and assisted GPS in a 40 mm disc.",
      role: "Did most of the work: concept and user analysis, energy consumption profile, solar cell and battery sizing, and the physical layout.",
      highlights: [],
      tags: ["Product design", "Energy budget", "Photovoltaics"],
      links: []
    },
    {
      title: "Smart medicine box",
      meta: "UPM Madrid · Practical IoT with Raspberry Pi · Team of 3",
      year: "2025",
      description:
        "A working prototype that reminds a patient to take medication and confirms it was taken: a web page sets the alarm, a door sensor silences it when the box is opened, and an emergency button alerts a caregiver over MQTT.",
      short:
        "Working Raspberry Pi prototype that reminds a patient to take medication, confirms the box was opened and alerts a caregiver over MQTT.",
      role: "Built most of the prototype: breadboard circuit, Python alarm logic, MQTT alerts and the web page.",
      highlights: [],
      tags: ["Raspberry Pi", "Python", "Flask", "MQTT"],
      links: []
    }
  ],

  // Words that scroll across the band between scenes. Empty list = use the skills.
  band: ["Industrial Engineering", "SolidWorks", "CATIA", "EdgeCAM", "AutoCAD", "Fusion 360", "Mechatronics", "Raspberry Pi"],

  skills: [
    { group: "CAD & CAM", items: ["SolidWorks", "CATIA", "AutoCAD", "Fusion 360", "EdgeCAM"] },
    { group: "Software & prototyping", items: ["Python (Raspberry Pi projects)", "Raspberry Pi", "Excel", "PowerPoint", "Word"] },
    { group: "Strengths", items: ["Discipline", "Determination", "Composure under pressure", "Working in international teams"] }
  ],

  education: [
    {
      degree: "Bachelor's degree — Industrial Engineering",
      school: "POLITEHNICA Bucharest — Faculty of Industrial Engineering and Robotics",
      location: "",
      start: "2023",
      end: "2027",
      details: "Final year."
    },
    {
      degree: "Erasmus+ exchange — full academic year",
      school: "Universidad Politécnica de Madrid (UPM) — ETSIDI",
      location: "",
      start: "2025",
      end: "2026",
      details: "Project-based courses in mechatronics systems design, IoT with Raspberry Pi and photovoltaic-powered products."
    },
    {
      degree: "Bachelor's degree — Business Administration (taught in foreign languages)",
      school: "Bucharest University of Economic Studies (ASE) — FABIZ",
      location: "",
      start: "2023",
      end: "2027",
      details: "Studied in parallel with engineering; paused for one year during the exchange."
    },
    {
      degree: "Baccalaureate — Mathematics & Computer Science, intensive English",
      school: "I.L. Caragiale National College, Bucharest",
      location: "",
      start: "",
      end: "2023",
      details: ""
    }
  ],

  // Kept short on purpose: one line of proof, not a list of results.
  beyond: [
    {
      title: "Shotokan karate — World and European champion",
      note: "More than 13 years of competition and still active. Certified national-level kumite referee.",
      year: ""
    },
    {
      title: "Volunteer — Chances for the Future (Șanse pentru viitor)",
      note: "Collected school and educational materials for disadvantaged children.",
      year: "2022",
      short: ""                               // the printable CV shows the title and year only
    }
  ],

  certifications: [
    { title: "Circular Learning Space for Digital Skills", issuer: "EIT RawMaterials", year: "2022", url: "", pdf: false }
  ],

  languages: [
    { name: "Romanian", level: "Native" },
    { name: "English", level: "C1–C2" },
    { name: "Spanish", level: "B2" },
    { name: "German", level: "A2" }
  ],

  interests: ["Snowboarding", "Wakeboarding", "Basketball"],

  contact: {
    headline: "Let's talk.",
    note: "Open to engineering internships and entry-level roles. Email is the fastest way to reach me."
  }
};
