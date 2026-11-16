import React, { useEffect, useRef, useState } from "react";

export interface RealCatalogStar {
  id: string;
  name: string;
  designation: string;
  constellation: string;
  constellationSubtitle: string;
  magnitude: string;
  spectralClass: string;
  distanceLy: string;
  eclipticPosition: string;
  colorHex: string;
  glowRgb: string;
  astrologicalMeaning: string;
  // Normalized sky coordinates (0..1) carefully mapped to preserve real constellation geometry
  nx: number;
  ny: number;
  baseRadius: number;
}

export interface ConstellationGroup {
  id: string;
  name: string;
  subtitle: string;
  labelX: number;
  labelY: number;
  stars: RealCatalogStar[];
  // Pairs of star IDs forming the authentic astronomical constellation lines
  edges: [string, string][];
}

interface BackgroundPinpointStar {
  nx: number;
  ny: number;
  radius: number;
  alpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  rgb: string;
  name: string;
  constellation: string;
  magnitude: string;
  eclipticPosition: string;
  astrologicalMeaning: string;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  life: number;
  maxLife: number;
}

/**
 * Authentic Astronomical Constellations with Accurate Relative Geometry
 */
export const REAL_CONSTELLATIONS: ConstellationGroup[] = [
  {
    id: "orion",
    name: "ORION",
    subtitle: "The Celestial Hunter",
    labelX: 0.17,
    labelY: 0.43,
    stars: [
      {
        id: "betelgeuse",
        name: "Betelgeuse",
        designation: "α Orionis",
        constellation: "Orion",
        constellationSubtitle: "The Celestial Hunter",
        magnitude: "+0.50",
        spectralClass: "M1-2 Ia-ab Red Supergiant",
        distanceLy: "548 ly",
        eclipticPosition: "29°00' Gemini",
        colorHex: "#FDBA74",
        glowRgb: "251, 146, 60",
        astrologicalMeaning:
          "The Martial Shoulder of Orion — bestows sovereign breakthroughs, strategic ingenuity, and enduring public honor.",
        nx: 0.145,
        ny: 0.48,
        baseRadius: 3.4,
      },
      {
        id: "bellatrix",
        name: "Bellatrix",
        designation: "γ Orionis",
        constellation: "Orion",
        constellationSubtitle: "The Celestial Hunter",
        magnitude: "+1.64",
        spectralClass: "B2 III Blue Giant",
        distanceLy: "250 ly",
        eclipticPosition: "21°11' Gemini",
        colorHex: "#BAE6FD",
        glowRgb: "125, 211, 252",
        astrologicalMeaning:
          "The Amazon Star — awakens decisive courage, clear-eyed speech, and shadow integration.",
        nx: 0.205,
        ny: 0.495,
        baseRadius: 2.6,
      },
      {
        id: "meissa",
        name: "Meissa",
        designation: "λ Orionis",
        constellation: "Orion",
        constellationSubtitle: "The Celestial Hunter",
        magnitude: "+3.33",
        spectralClass: "O8 III Blue Giant",
        distanceLy: "1,100 ly",
        eclipticPosition: "24°06' Gemini",
        colorHex: "#E0F2FE",
        glowRgb: "186, 230, 253",
        astrologicalMeaning:
          "The Shining Head of Orion — illuminates higher intellectual synthesis and contemplative focus.",
        nx: 0.175,
        ny: 0.445,
        baseRadius: 2.0,
      },
      {
        id: "mintaka",
        name: "Mintaka",
        designation: "δ Orionis",
        constellation: "Orion",
        constellationSubtitle: "The Celestial Hunter",
        magnitude: "+2.23",
        spectralClass: "O9.5 II Multiple Star",
        distanceLy: "1,200 ly",
        eclipticPosition: "22°36' Gemini",
        colorHex: "#E0F2FE",
        glowRgb: "192, 132, 252",
        astrologicalMeaning:
          "Western jewel of Orion's Belt — bridges architectural symmetry and fortunate timing.",
        nx: 0.19,
        ny: 0.575,
        baseRadius: 2.3,
      },
      {
        id: "alnilam",
        name: "Alnilam",
        designation: "ε Orionis",
        constellation: "Orion",
        constellationSubtitle: "The Celestial Hunter",
        magnitude: "+1.69",
        spectralClass: "B0 Ia Blue Supergiant",
        distanceLy: "2,000 ly",
        eclipticPosition: "23°42' Gemini",
        colorHex: "#F5F3FF",
        glowRgb: "216, 180, 254",
        astrologicalMeaning:
          "String of Pearls at the center of Orion's Belt — gathers fleeting efforts into lasting form.",
        nx: 0.176,
        ny: 0.585,
        baseRadius: 2.6,
      },
      {
        id: "alnitak",
        name: "Alnitak",
        designation: "ζ Orionis",
        constellation: "Orion",
        constellationSubtitle: "The Celestial Hunter",
        magnitude: "+1.77",
        spectralClass: "O9.7 Ib Triple Star",
        distanceLy: "1,260 ly",
        eclipticPosition: "24°55' Gemini",
        colorHex: "#EDE9FE",
        glowRgb: "192, 132, 252",
        astrologicalMeaning:
          "Eastern anchor of Orion's Belt — channels historical stewardship and archival memory.",
        nx: 0.162,
        ny: 0.595,
        baseRadius: 2.4,
      },
      {
        id: "saiph",
        name: "Saiph",
        designation: "κ Orionis",
        constellation: "Orion",
        constellationSubtitle: "The Celestial Hunter",
        magnitude: "+2.09",
        spectralClass: "B0.5 Ia Supergiant",
        distanceLy: "650 ly",
        eclipticPosition: "26°38' Gemini",
        colorHex: "#BAE6FD",
        glowRgb: "125, 211, 252",
        astrologicalMeaning:
          "Sword of the Giant — represents mastery of craft and alchemical transformation.",
        nx: 0.15,
        ny: 0.675,
        baseRadius: 2.4,
      },
      {
        id: "rigel",
        name: "Rigel",
        designation: "β Orionis",
        constellation: "Orion",
        constellationSubtitle: "The Celestial Hunter",
        magnitude: "+0.13",
        spectralClass: "B8 Ia Blue-White Supergiant",
        distanceLy: "863 ly",
        eclipticPosition: "17°04' Gemini",
        colorHex: "#E0F2FE",
        glowRgb: "147, 197, 253",
        astrologicalMeaning:
          "The Luminous Foot of Orion — blends technical brilliance, mentorship, and rapid elevation.",
        nx: 0.212,
        ny: 0.665,
        baseRadius: 3.5,
      },
    ],
    edges: [
      ["meissa", "betelgeuse"],
      ["meissa", "bellatrix"],
      ["betelgeuse", "bellatrix"],
      ["betelgeuse", "alnitak"],
      ["bellatrix", "mintaka"],
      ["alnitak", "alnilam"],
      ["alnilam", "mintaka"],
      ["alnitak", "saiph"],
      ["mintaka", "rigel"],
      ["saiph", "rigel"],
    ],
  },
  {
    id: "ursa_major",
    name: "URSA MAJOR",
    subtitle: "The Great Bear",
    labelX: 0.23,
    labelY: 0.11,
    stars: [
      {
        id: "dubhe",
        name: "Dubhe",
        designation: "α Ursae Majoris",
        constellation: "Ursa Major",
        constellationSubtitle: "The Great Bear",
        magnitude: "+1.79",
        spectralClass: "K0 III Orange Giant",
        distanceLy: "123 ly",
        eclipticPosition: "15°26' Leo",
        colorHex: "#FDE68A",
        glowRgb: "229, 193, 88",
        astrologicalMeaning:
          "Northern Pointer to Polaris — supplies calm executive strength, maternal protection, and endurance.",
        nx: 0.13,
        ny: 0.16,
        baseRadius: 2.8,
      },
      {
        id: "merak",
        name: "Merak",
        designation: "β Ursae Majoris",
        constellation: "Ursa Major",
        constellationSubtitle: "The Great Bear",
        magnitude: "+2.37",
        spectralClass: "A1 V White Main-Sequence",
        distanceLy: "79.7 ly",
        eclipticPosition: "19°40' Leo",
        colorHex: "#F5F3FF",
        glowRgb: "216, 180, 254",
        astrologicalMeaning:
          "Southern Pointer of the Plough — fosters philosophical command and patient observation.",
        nx: 0.142,
        ny: 0.225,
        baseRadius: 2.3,
      },
      {
        id: "phecda",
        name: "Phecda",
        designation: "γ Ursae Majoris",
        constellation: "Ursa Major",
        constellationSubtitle: "The Great Bear",
        magnitude: "+2.44",
        spectralClass: "A0 Ve White Star",
        distanceLy: "83.2 ly",
        eclipticPosition: "00°43' Virgo",
        colorHex: "#F5F3FF",
        glowRgb: "192, 132, 252",
        astrologicalMeaning:
          "Thigh of the Bear — anchors civilizational order and measured instinct.",
        nx: 0.205,
        ny: 0.235,
        baseRadius: 2.3,
      },
      {
        id: "megrez",
        name: "Megrez",
        designation: "δ Ursae Majoris",
        constellation: "Ursa Major",
        constellationSubtitle: "The Great Bear",
        magnitude: "+3.31",
        spectralClass: "A3 V White Star",
        distanceLy: "80.5 ly",
        eclipticPosition: "01°18' Virgo",
        colorHex: "#EDE9FE",
        glowRgb: "192, 132, 252",
        astrologicalMeaning:
          "Root of the Bear's Tail — the hinge point uniting contemplative thought and physical action.",
        nx: 0.208,
        ny: 0.18,
        baseRadius: 2.0,
      },
      {
        id: "alioth",
        name: "Alioth",
        designation: "ε Ursae Majoris",
        constellation: "Ursa Major",
        constellationSubtitle: "The Great Bear",
        magnitude: "+1.77",
        spectralClass: "A1 III-IVp Peculiar Star",
        distanceLy: "82.6 ly",
        eclipticPosition: "09°10' Virgo",
        colorHex: "#F5F3FF",
        glowRgb: "216, 180, 254",
        astrologicalMeaning:
          "Brightest jewel of Ursa Major — channels unwavering devotion to truth and creative perseverance.",
        nx: 0.26,
        ny: 0.175,
        baseRadius: 2.8,
      },
      {
        id: "mizar",
        name: "Mizar & Alcor",
        designation: "ζ Ursae Majoris",
        constellation: "Ursa Major",
        constellationSubtitle: "The Great Bear",
        magnitude: "+2.04",
        spectralClass: "A2 V Quadruple Binary",
        distanceLy: "82.9 ly",
        eclipticPosition: "15°56' Virgo",
        colorHex: "#F5F3FF",
        glowRgb: "192, 132, 252",
        astrologicalMeaning:
          "The Horse and Rider binary test of vision — signifies kinship, discernment, and shared pilgrimage.",
        nx: 0.305,
        ny: 0.165,
        baseRadius: 2.5,
      },
      {
        id: "alkaid",
        name: "Alkaid",
        designation: "η Ursae Majoris",
        constellation: "Ursa Major",
        constellationSubtitle: "The Great Bear",
        magnitude: "+1.86",
        spectralClass: "B3 V Blue Main-Sequence",
        distanceLy: "103.9 ly",
        eclipticPosition: "27°10' Virgo",
        colorHex: "#BAE6FD",
        glowRgb: "147, 197, 253",
        astrologicalMeaning:
          "Leader of the Daughters of the Bier — governs sacred rites, endings, and ancestral wisdom.",
        nx: 0.358,
        ny: 0.195,
        baseRadius: 2.7,
      },
    ],
    edges: [
      ["dubhe", "merak"],
      ["merak", "phecda"],
      ["phecda", "megrez"],
      ["megrez", "dubhe"],
      ["megrez", "alioth"],
      ["alioth", "mizar"],
      ["mizar", "alkaid"],
    ],
  },
  {
    id: "cassiopeia",
    name: "CASSIOPEIA",
    subtitle: "The Seated Queen",
    labelX: 0.77,
    labelY: 0.11,
    stars: [
      {
        id: "caph",
        name: "Caph",
        designation: "β Cassiopeiae",
        constellation: "Cassiopeia",
        constellationSubtitle: "The Seated Queen",
        magnitude: "+2.28",
        spectralClass: "F2 III Giant",
        distanceLy: "54.7 ly",
        eclipticPosition: "05°28' Taurus",
        colorHex: "#FEF3C7",
        glowRgb: "229, 193, 88",
        astrologicalMeaning:
          "The Stained Hand — marks the equinoctial colure and the Measure of Time.",
        nx: 0.71,
        ny: 0.16,
        baseRadius: 2.4,
      },
      {
        id: "schedar",
        name: "Schedar",
        designation: "α Cassiopeiae",
        constellation: "Cassiopeia",
        constellationSubtitle: "The Seated Queen",
        magnitude: "+2.24",
        spectralClass: "K0 IIIa Orange Giant",
        distanceLy: "228 ly",
        eclipticPosition: "08°01' Taurus",
        colorHex: "#FDE68A",
        glowRgb: "229, 193, 88",
        astrologicalMeaning:
          "The Queen's Breast — unites regal dignity with mystical contemplation and courtly poise.",
        nx: 0.745,
        ny: 0.215,
        baseRadius: 2.6,
      },
      {
        id: "gamma_cas",
        name: "Tsih",
        designation: "γ Cassiopeiae",
        constellation: "Cassiopeia",
        constellationSubtitle: "The Seated Queen",
        magnitude: "+2.15",
        spectralClass: "B0.5 IVe Subgiant",
        distanceLy: "550 ly",
        eclipticPosition: "14°12' Taurus",
        colorHex: "#BAE6FD",
        glowRgb: "125, 211, 252",
        astrologicalMeaning:
          "Center jewel of the W — radiates sudden creative illumination and electric magnetism.",
        nx: 0.78,
        ny: 0.175,
        baseRadius: 2.5,
      },
      {
        id: "ruchbah",
        name: "Ruchbah",
        designation: "δ Cassiopeiae",
        constellation: "Cassiopeia",
        constellationSubtitle: "The Seated Queen",
        magnitude: "+2.68",
        spectralClass: "A5 III-IV Eclipsing Binary",
        distanceLy: "99.4 ly",
        eclipticPosition: "18°09' Taurus",
        colorHex: "#F5F3FF",
        glowRgb: "192, 132, 252",
        astrologicalMeaning:
          "The Knee of the Queen — symbolizes grounded humility amidst high authority.",
        nx: 0.818,
        ny: 0.22,
        baseRadius: 2.2,
      },
      {
        id: "segin",
        name: "Segin",
        designation: "ε Cassiopeiae",
        constellation: "Cassiopeia",
        constellationSubtitle: "The Seated Queen",
        magnitude: "+3.37",
        spectralClass: "B3 III Blue-White Giant",
        distanceLy: "410 ly",
        eclipticPosition: "24°50' Taurus",
        colorHex: "#E0F2FE",
        glowRgb: "192, 132, 252",
        astrologicalMeaning:
          "Eastern wing of the Throne — inspires pattern recognition and strategic foresight.",
        nx: 0.855,
        ny: 0.165,
        baseRadius: 2.1,
      },
    ],
    edges: [
      ["caph", "schedar"],
      ["schedar", "gamma_cas"],
      ["gamma_cas", "ruchbah"],
      ["ruchbah", "segin"],
    ],
  },
  {
    id: "scorpius",
    name: "SCORPIUS",
    subtitle: "The Royal Scorpion",
    labelX: 0.79,
    labelY: 0.62,
    stars: [
      {
        id: "acrab",
        name: "Acrab",
        designation: "β Scorpii",
        constellation: "Scorpius",
        constellationSubtitle: "The Royal Scorpion",
        magnitude: "+2.50",
        spectralClass: "B1 V Multiple System",
        distanceLy: "400 ly",
        eclipticPosition: "03°25' Sagittarius",
        colorHex: "#BAE6FD",
        glowRgb: "147, 197, 253",
        astrologicalMeaning:
          "The Northern Claw — sharpens investigative intellect and unmasks hidden motives.",
        nx: 0.74,
        ny: 0.56,
        baseRadius: 2.3,
      },
      {
        id: "dschubba",
        name: "Dschubba",
        designation: "δ Scorpii",
        constellation: "Scorpius",
        constellationSubtitle: "The Royal Scorpion",
        magnitude: "+2.31",
        spectralClass: "B0.3 IV Subgiant",
        distanceLy: "440 ly",
        eclipticPosition: "02°48' Sagittarius",
        colorHex: "#E0F2FE",
        glowRgb: "192, 132, 252",
        astrologicalMeaning:
          "Forehead of the Scorpion — governs deep research, esoteric archives, and quiet power.",
        nx: 0.735,
        ny: 0.605,
        baseRadius: 2.4,
      },
      {
        id: "antares",
        name: "Antares",
        designation: "α Scorpii",
        constellation: "Scorpius",
        constellationSubtitle: "The Royal Scorpion",
        magnitude: "+1.06",
        spectralClass: "M1.5 Iab-Ib Red Supergiant",
        distanceLy: "550 ly",
        eclipticPosition: "10°00' Sagittarius",
        colorHex: "#FDA4AF",
        glowRgb: "244, 63, 94",
        astrologicalMeaning:
          "Royal Watcher of the West & Heart of the Scorpion — ignites fearless intensity, metamorphosis, and passion.",
        nx: 0.775,
        ny: 0.635,
        baseRadius: 3.6,
      },
      {
        id: "larawag",
        name: "Larawag",
        designation: "ε Scorpii",
        constellation: "Scorpius",
        constellationSubtitle: "The Royal Scorpion",
        magnitude: "+2.29",
        spectralClass: "K1 III Orange Giant",
        distanceLy: "63.7 ly",
        eclipticPosition: "15°40' Sagittarius",
        colorHex: "#FDE68A",
        glowRgb: "229, 193, 88",
        astrologicalMeaning:
          "The Signalers' Star — marks pivotal turning points in long-term creative undertakings.",
        nx: 0.81,
        ny: 0.71,
        baseRadius: 2.3,
      },
      {
        id: "sargas",
        name: "Sargas",
        designation: "θ Scorpii",
        constellation: "Scorpius",
        constellationSubtitle: "The Royal Scorpion",
        magnitude: "+1.87",
        spectralClass: "F0 II Bright Giant",
        distanceLy: "300 ly",
        eclipticPosition: "25°50' Sagittarius",
        colorHex: "#FEF3C7",
        glowRgb: "229, 193, 88",
        astrologicalMeaning:
          "Southern curve of the Tail — channels ancestral intuition and philosophical depth.",
        nx: 0.855,
        ny: 0.79,
        baseRadius: 2.5,
      },
      {
        id: "shaula",
        name: "Shaula",
        designation: "λ Scorpii",
        constellation: "Scorpius",
        constellationSubtitle: "The Royal Scorpion",
        magnitude: "+1.62",
        spectralClass: "B1.5 IV Triple Star",
        distanceLy: "570 ly",
        eclipticPosition: "24°49' Sagittarius",
        colorHex: "#BAE6FD",
        glowRgb: "192, 132, 252",
        astrologicalMeaning:
          "The Raised Stinger — awakens piercing spiritual liberation and uncompromising truth.",
        nx: 0.89,
        ny: 0.755,
        baseRadius: 2.7,
      },
    ],
    edges: [
      ["acrab", "dschubba"],
      ["dschubba", "antares"],
      ["antares", "larawag"],
      ["larawag", "sargas"],
      ["sargas", "shaula"],
    ],
  },
  {
    id: "leo",
    name: "LEO",
    subtitle: "The Sovereign Lion",
    labelX: 0.34,
    labelY: 0.71,
    stars: [
      {
        id: "regulus",
        name: "Regulus",
        designation: "α Leonis",
        constellation: "Leo",
        constellationSubtitle: "The Sovereign Lion",
        magnitude: "+1.35",
        spectralClass: "B8 IVn Quadruple System",
        distanceLy: "79.3 ly",
        eclipticPosition: "00°05' Virgo",
        colorHex: "#FEF08A",
        glowRgb: "234, 179, 8",
        astrologicalMeaning:
          "Royal Watcher of the North & Heart of the Lion — confers noble sovereignty, generosity, and creative leadership.",
        nx: 0.295,
        ny: 0.81,
        baseRadius: 3.5,
      },
      {
        id: "algieba",
        name: "Algieba",
        designation: "γ Leonis",
        constellation: "Leo",
        constellationSubtitle: "The Sovereign Lion",
        magnitude: "+2.08",
        spectralClass: "K1-III + G7-III Binary",
        distanceLy: "130 ly",
        eclipticPosition: "28°08' Leo",
        colorHex: "#FDE68A",
        glowRgb: "229, 193, 88",
        astrologicalMeaning:
          "The Lion's Mane — illuminates patronage, artistic warmth, and magnetic presence.",
        nx: 0.31,
        ny: 0.735,
        baseRadius: 2.5,
      },
      {
        id: "ras_elased",
        name: "Algenubi",
        designation: "ε Leonis",
        constellation: "Leo",
        constellationSubtitle: "The Sovereign Lion",
        magnitude: "+2.98",
        spectralClass: "G1 II Bright Giant",
        distanceLy: "247 ly",
        eclipticPosition: "20°56' Leo",
        colorHex: "#FEF3C7",
        glowRgb: "229, 193, 88",
        astrologicalMeaning:
          "Apex of the Lion's Sickle — sharpens dramatic expression and architectural vision.",
        nx: 0.275,
        ny: 0.695,
        baseRadius: 2.1,
      },
      {
        id: "zosma",
        name: "Zosma",
        designation: "δ Leonis",
        constellation: "Leo",
        constellationSubtitle: "The Sovereign Lion",
        magnitude: "+2.56",
        spectralClass: "A4 V White Star",
        distanceLy: "58.4 ly",
        eclipticPosition: "11°33' Virgo",
        colorHex: "#F5F3FF",
        glowRgb: "192, 132, 252",
        astrologicalMeaning:
          "Hip of the Lion — heightens prophetic sensitivity and somatic intuition.",
        nx: 0.39,
        ny: 0.745,
        baseRadius: 2.3,
      },
      {
        id: "denebola",
        name: "Denebola",
        designation: "β Leonis",
        constellation: "Leo",
        constellationSubtitle: "The Sovereign Lion",
        magnitude: "+2.14",
        spectralClass: "A3 Va White Main-Sequence",
        distanceLy: "35.9 ly",
        eclipticPosition: "21°51' Virgo",
        colorHex: "#EDE9FE",
        glowRgb: "192, 132, 252",
        astrologicalMeaning:
          "Tail of the Lion — bestows counter-cultural originality and crystalline integrity.",
        nx: 0.435,
        ny: 0.79,
        baseRadius: 2.6,
      },
    ],
    edges: [
      ["regulus", "algieba"],
      ["algieba", "ras_elased"],
      ["algieba", "zosma"],
      ["zosma", "denebola"],
      ["denebola", "regulus"],
    ],
  },
  {
    id: "cygnus",
    name: "CYGNUS",
    subtitle: "The Northern Cross",
    labelX: 0.58,
    labelY: 0.16,
    stars: [
      {
        id: "deneb",
        name: "Deneb",
        designation: "α Cygni",
        constellation: "Cygnus",
        constellationSubtitle: "The Northern Cross",
        magnitude: "+1.25",
        spectralClass: "A2 Ia White Supergiant",
        distanceLy: "2,615 ly",
        eclipticPosition: "05°34' Pisces",
        colorHex: "#F5F3FF",
        glowRgb: "216, 180, 254",
        astrologicalMeaning:
          "Crown of the Northern Cross — quickens symbolic fluency, high scholarship, and transcendent art.",
        nx: 0.56,
        ny: 0.14,
        baseRadius: 3.3,
      },
      {
        id: "sadr",
        name: "Sadr",
        designation: "γ Cygni",
        constellation: "Cygnus",
        constellationSubtitle: "The Northern Cross",
        magnitude: "+2.23",
        spectralClass: "F8 Iab Supergiant",
        distanceLy: "1,800 ly",
        eclipticPosition: "25°02' Aquarius",
        colorHex: "#FEF3C7",
        glowRgb: "229, 193, 88",
        astrologicalMeaning:
          "Heart of the Swan — radiates compassionate leadership and poetic magnetism.",
        nx: 0.545,
        ny: 0.215,
        baseRadius: 2.5,
      },
      {
        id: "albireo",
        name: "Albireo",
        designation: "β Cygni",
        constellation: "Cygnus",
        constellationSubtitle: "The Northern Cross",
        magnitude: "+3.08",
        spectralClass: "K3 II + B8 V Gold-Sapphire Binary",
        distanceLy: "430 ly",
        eclipticPosition: "01°29' Aquarius",
        colorHex: "#FDE68A",
        glowRgb: "229, 193, 88",
        astrologicalMeaning:
          "Beak of the Swan — the celebrated Gold & Sapphire binary symbolizing harmonious partnership.",
        nx: 0.525,
        ny: 0.305,
        baseRadius: 2.3,
      },
      {
        id: "gienah_cyg",
        name: "Aljanah",
        designation: "ε Cygni",
        constellation: "Cygnus",
        constellationSubtitle: "The Northern Cross",
        magnitude: "+2.48",
        spectralClass: "K0 III Orange Giant",
        distanceLy: "72.7 ly",
        eclipticPosition: "27°59' Aquarius",
        colorHex: "#FDE68A",
        glowRgb: "192, 132, 252",
        astrologicalMeaning:
          "Eastern Wing of the Swan — elevates imagination and cross-disciplinary synthesis.",
        nx: 0.605,
        ny: 0.235,
        baseRadius: 2.3,
      },
      {
        id: "fawaris",
        name: "Fawaris",
        designation: "δ Cygni",
        constellation: "Cygnus",
        constellationSubtitle: "The Northern Cross",
        magnitude: "+2.87",
        spectralClass: "B9.5 III Triple Star",
        distanceLy: "165 ly",
        eclipticPosition: "16°31' Aquarius",
        colorHex: "#E0F2FE",
        glowRgb: "192, 132, 252",
        astrologicalMeaning:
          "Western Wing of the Swan — supports spiritual poise and nocturnal contemplation.",
        nx: 0.49,
        ny: 0.195,
        baseRadius: 2.2,
      },
    ],
    edges: [
      ["deneb", "sadr"],
      ["sadr", "albireo"],
      ["fawaris", "sadr"],
      ["sadr", "gienah_cyg"],
    ],
  },
  {
    id: "lyra",
    name: "LYRA",
    subtitle: "The Orphic Harp",
    labelX: 0.43,
    labelY: 0.28,
    stars: [
      {
        id: "vega",
        name: "Vega",
        designation: "α Lyrae",
        constellation: "Lyra",
        constellationSubtitle: "The Orphic Harp",
        magnitude: "+0.03",
        spectralClass: "A0 Va Luminous Blue-White",
        distanceLy: "25.04 ly",
        eclipticPosition: "15°33' Capricorn",
        colorHex: "#E0F2FE",
        glowRgb: "192, 132, 252",
        astrologicalMeaning:
          "The Harp Star of Orpheus — inspires enchanting charisma, sacred music, and visionary aesthetics.",
        nx: 0.42,
        ny: 0.31,
        baseRadius: 3.6,
      },
      {
        id: "sheliak",
        name: "Sheliak",
        designation: "β Lyrae",
        constellation: "Lyra",
        constellationSubtitle: "The Orphic Harp",
        magnitude: "+3.52",
        spectralClass: "B8 II Eclipsing Binary",
        distanceLy: "960 ly",
        eclipticPosition: "19°07' Capricorn",
        colorHex: "#DDD6FE",
        glowRgb: "192, 132, 252",
        astrologicalMeaning:
          "Base of the Lyre — channels rhythmic resonance and emotional depth in art.",
        nx: 0.405,
        ny: 0.365,
        baseRadius: 2.1,
      },
      {
        id: "sulafat",
        name: "Sulafat",
        designation: "γ Lyrae",
        constellation: "Lyra",
        constellationSubtitle: "The Orphic Harp",
        magnitude: "+3.25",
        spectralClass: "B9 III Blue-White Giant",
        distanceLy: "620 ly",
        eclipticPosition: "22°09' Capricorn",
        colorHex: "#E0F2FE",
        glowRgb: "192, 132, 252",
        astrologicalMeaning:
          "Tortoise-Shell Frame of the Harp — preserves lyrical memory and harmonic form.",
        nx: 0.435,
        ny: 0.37,
        baseRadius: 2.2,
      },
    ],
    edges: [
      ["vega", "sheliak"],
      ["sheliak", "sulafat"],
      ["sulafat", "vega"],
    ],
  },
  {
    id: "taurus",
    name: "TAURUS",
    subtitle: "The Hyades & Pleiades",
    labelX: 0.84,
    labelY: 0.36,
    stars: [
      {
        id: "aldebaran",
        name: "Aldebaran",
        designation: "α Tauri",
        constellation: "Taurus",
        constellationSubtitle: "The Hyades & Pleiades",
        magnitude: "+0.86",
        spectralClass: "K5+ III Orange Giant",
        distanceLy: "65.3 ly",
        eclipticPosition: "10°02' Gemini",
        colorHex: "#FDBA74",
        glowRgb: "249, 115, 22",
        astrologicalMeaning:
          "Royal Watcher of the East & Eye of the Bull — governs material abundance, steadfastness, and integrity.",
        nx: 0.815,
        ny: 0.425,
        baseRadius: 3.4,
      },
      {
        id: "alcyone",
        name: "Alcyone (Pleiades)",
        designation: "η Tauri",
        constellation: "Taurus",
        constellationSubtitle: "The Hyades & Pleiades",
        magnitude: "+2.87",
        spectralClass: "B7 IIIe Eclipsing Cluster Core",
        distanceLy: "440 ly",
        eclipticPosition: "00°14' Gemini",
        colorHex: "#DDD6FE",
        glowRgb: "192, 132, 252",
        astrologicalMeaning:
          "Central jewel of the Seven Sisters — deepens inner vision, ancestral memory, and mystical grace.",
        nx: 0.76,
        ny: 0.375,
        baseRadius: 2.6,
      },
      {
        id: "elnath",
        name: "Elnath",
        designation: "β Tauri",
        constellation: "Taurus",
        constellationSubtitle: "The Hyades & Pleiades",
        magnitude: "+1.65",
        spectralClass: "B7 III Giant",
        distanceLy: "134 ly",
        eclipticPosition: "22°49' Gemini",
        colorHex: "#BAE6FD",
        glowRgb: "147, 197, 253",
        astrologicalMeaning:
          "Northern Horn of the Bull — supplies pioneering momentum and constructive force.",
        nx: 0.885,
        ny: 0.38,
        baseRadius: 2.7,
      },
      {
        id: "tianguan",
        name: "Tianguan",
        designation: "ζ Tauri",
        constellation: "Taurus",
        constellationSubtitle: "The Hyades & Pleiades",
        magnitude: "+3.01",
        spectralClass: "B2 IIIpe Subgiant",
        distanceLy: "440 ly",
        eclipticPosition: "25°01' Gemini",
        colorHex: "#E0F2FE",
        glowRgb: "192, 132, 252",
        astrologicalMeaning:
          "Southern Horn & Celestial Gate — opens thresholds between earthly craft and cosmic order.",
        nx: 0.89,
        ny: 0.45,
        baseRadius: 2.2,
      },
    ],
    edges: [
      ["alcyone", "aldebaran"],
      ["aldebaran", "elnath"],
      ["aldebaran", "tianguan"],
    ],
  },
];

// Flatten all constellation stars for fast lookup
const ALL_CONSTELLATION_STARS: RealCatalogStar[] =
  REAL_CONSTELLATIONS.flatMap((c) => c.stars);

const STAR_BY_ID: Record<string, RealCatalogStar> = {};
ALL_CONSTELLATION_STARS.forEach((s) => {
  STAR_BY_ID[s.id] = s;
});

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9173.37) * 10000;
  return x - Math.floor(x);
}

const DEEP_SKY_CATALOG_NAMES = [
  { name: "Spica", constellation: "Virgo", mag: "+0.97", pos: "24°05' Libra", meaning: "The Wheat Ear — confers artistic brilliance and protective grace." },
  { name: "Sirius", constellation: "Canis Major", mag: "-1.46", pos: "14°19' Cancer", meaning: "The Dog Star — amplifies sacred devotion and high impact." },
  { name: "Arcturus", constellation: "Boötes", mag: "-0.05", pos: "24°28' Libra", meaning: "Guardian of the Bear — guides pathfinders forging new territory." },
  { name: "Fomalhaut", constellation: "Piscis Austrinus", mag: "+1.16", pos: "04°06' Pisces", meaning: "Watcher of the South — channels poetic alchemy and spiritual legacy." },
  { name: "Altair", constellation: "Aquila", mag: "+0.76", pos: "01°01' Aquarius", meaning: "The Flying Eagle — awakens bold decisiveness and high-altitude vision." },
  { name: "Capella", constellation: "Auriga", mag: "+0.08", pos: "22°06' Gemini", meaning: "The Little She-Goat — nurtures inquisitive freedom and love of learning." },
  { name: "Castor", constellation: "Gemini", mag: "+1.58", pos: "20°28' Cancer", meaning: "The Mortal Twin — sharpens literary craftsmanship and wit." },
  { name: "Pollux", constellation: "Gemini", mag: "+1.14", pos: "23°27' Cancer", meaning: "The Immortal Twin — channels somatic resilience and protective valor." },
  { name: "Procyon", constellation: "Canis Minor", mag: "+0.34", pos: "26°01' Cancer", meaning: "Before the Dog — brings rapid opportunity and threshold transitions." },
  { name: "Polaris", constellation: "Ursa Minor", mag: "+1.98", pos: "28°48' Gemini", meaning: "The North Pole Star — anchors unwavering moral direction." },
  { name: "Alpheratz", constellation: "Andromeda", mag: "+2.06", pos: "14°32' Aries", meaning: "Head of Andromeda — bestows independence and intellectual grace." },
  { name: "Mirach", constellation: "Andromeda", mag: "+2.05", pos: "00°38' Taurus", meaning: "Girdle of Andromeda — inspires harmonious bonds and artistic receptivity." },
  { name: "Hamal", constellation: "Aries", mag: "+2.00", pos: "07°54' Taurus", meaning: "Horn of the Ram — channels self-directed sovereignty." },
  { name: "Algol", constellation: "Perseus", mag: "+2.12", pos: "26°24' Taurus", meaning: "The Blinking Demon Star — raw protective intensity and unflinching truth." },
  { name: "Alphecca", constellation: "Corona Borealis", mag: "+2.23", pos: "12°32' Scorpio", meaning: "Pearl of the Northern Crown — artistic grace unlocked through love." },
  { name: "Rasalhague", constellation: "Ophiuchus", mag: "+2.08", pos: "22°41' Sagittarius", meaning: "The Healer's Head — restorative wisdom and somatic repair." },
  { name: "Sadalsuud", constellation: "Aquarius", mag: "+2.91", pos: "23°38' Aquarius", meaning: "Luckiest of the Lucky — intuitive flow and gentle awakening." },
  { name: "Markab", constellation: "Pegasus", mag: "+2.48", pos: "23°43' Pisces", meaning: "Saddle of Pegasus — steadfastness across long mental voyages." },
];

function buildMilkyWayPinpoints(count: number): BackgroundPinpointStar[] {
  const list: BackgroundPinpointStar[] = [];
  const rgbs = [
    "246, 243, 255",
    "216, 180, 254",
    "254, 243, 199",
    "186, 230, 253",
    "233, 213, 255",
  ];

  for (let i = 0; i < count; i++) {
    // Cluster ~45% of background stars along a diagonal Milky Way band from top-right to bottom-left
    const inBand = i % 10 < 5;
    let nx = seededRandom(i * 19 + 7);
    let ny = seededRandom(i * 31 + 13);

    if (inBand) {
      const t = seededRandom(i * 41 + 3);
      const spread = (seededRandom(i * 53) - 0.5) * 0.28;
      nx = Math.min(0.97, Math.max(0.03, t + spread));
      ny = Math.min(0.96, Math.max(0.04, 1 - t * 0.85 + spread * 0.9));
    }

    const cat = DEEP_SKY_CATALOG_NAMES[i % DEEP_SKY_CATALOG_NAMES.length];

    list.push({
      nx,
      ny,
      radius: 0.65 + seededRandom(i * 11) * 1.15,
      alpha: 0.22 + seededRandom(i * 23) * 0.52,
      twinkleSpeed: 0.7 + seededRandom(i * 37) * 1.6,
      twinklePhase: seededRandom(i * 61) * Math.PI * 2,
      rgb: rgbs[i % rgbs.length],
      name: cat.name,
      constellation: cat.constellation,
      magnitude: cat.mag,
      eclipticPosition: cat.pos,
      astrologicalMeaning: cat.meaning,
    });
  }

  return list;
}

interface InteractiveSkyCanvasProps {
  onScrollToContent?: () => void;
}

export const InteractiveSkyCanvas: React.FC<InteractiveSkyCanvasProps> = ({
  onScrollToContent,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -9999,
    y: -9999,
    active: false,
  });

  const [hoveredStar, setHoveredStar] = useState<{
    name: string;
    designation: string;
    constellation: string;
    magnitude: string;
    spectralClass?: string;
    distanceLy?: string;
    eclipticPosition: string;
    astrologicalMeaning: string;
    x: number;
    y: number;
  } | null>(null);

  const pinpointsRef = useRef<BackgroundPinpointStar[]>(
    buildMilkyWayPinpoints(280)
  );
  const shootingStarsRef = useRef<ShootingStar[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId = 0;
    let width = 0;
    let height = 0;

    const updateDimensions = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    const spawnShootingStar = () => {
      if (width === 0 || height === 0) return;
      const startX = Math.random() * width * 0.8 + width * 0.1;
      const startY = Math.random() * height * 0.42;
      const angle = (Math.PI / 180) * (20 + Math.random() * 25);
      const speed = 10 + Math.random() * 6;
      const dir = Math.random() > 0.35 ? 1 : -1;

      shootingStarsRef.current.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed * dir,
        vy: Math.sin(angle) * speed,
        length: 145 + Math.random() * 85,
        life: 0,
        maxLife: 46 + Math.random() * 28,
      });
    };

    const initialTimer = window.setTimeout(spawnShootingStar, 700);

    let time = 0;
    const proximityRadius = 240;

    const render = () => {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      // 1. Deep Obsidian-Amethyst Galactic & Milky Way Nebula Clouds
      const mwGrad = ctx.createLinearGradient(width * 0.85, 0, width * 0.15, height);
      mwGrad.addColorStop(0, "rgba(88, 28, 135, 0.16)");
      mwGrad.addColorStop(0.35, "rgba(126, 34, 206, 0.24)");
      mwGrad.addColorStop(0.55, "rgba(109, 40, 217, 0.20)");
      mwGrad.addColorStop(0.8, "rgba(88, 28, 135, 0.15)");
      mwGrad.addColorStop(1, "rgba(15, 7, 30, 0.05)");
      ctx.fillStyle = mwGrad;
      ctx.fillRect(0, 0, width, height);

      const coreNebula = ctx.createRadialGradient(
        width * 0.5,
        height * 0.5,
        20,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.56
      );
      coreNebula.addColorStop(0, "rgba(168, 85, 247, 0.22)");
      coreNebula.addColorStop(0.42, "rgba(91, 33, 182, 0.14)");
      coreNebula.addColorStop(0.75, "rgba(30, 12, 60, 0.08)");
      coreNebula.addColorStop(1, "rgba(7, 5, 14, 0)");
      ctx.fillStyle = coreNebula;
      ctx.fillRect(0, 0, width, height);

      // 2. Subtle Celestial Observatory Equatorial & Ecliptic Rings behind the Stars
      const centerR = Math.min(width, height) * 0.34;
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.strokeStyle = "rgba(192, 132, 252, 0.11)";
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(0, 0, centerR, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = "rgba(229, 193, 88, 0.12)";
      ctx.setLineDash([3, 6]);
      ctx.beginPath();
      ctx.arc(0, 0, centerR * 1.18, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      const { x: mx, y: my, active: mouseActive } = mouseRef.current;

      // 3. Soft Cursor Proximity Searchlight Aura
      if (mouseActive) {
        const cursorAura = ctx.createRadialGradient(
          mx,
          my,
          4,
          mx,
          my,
          proximityRadius
        );
        cursorAura.addColorStop(0, "rgba(216, 180, 254, 0.18)");
        cursorAura.addColorStop(0.45, "rgba(168, 85, 247, 0.07)");
        cursorAura.addColorStop(1, "rgba(7, 5, 14, 0)");
        ctx.fillStyle = cursorAura;
        ctx.beginPath();
        ctx.arc(mx, my, proximityRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Render Background Milky Way Pinpoint Stars with Distance-Weighted Cursor Proximity Lighting
      const pinpoints = pinpointsRef.current;
      for (let i = 0; i < pinpoints.length; i++) {
        const p = pinpoints[i];
        const sx = p.nx * width;
        const sy = p.ny * height;

        let prox = 0;
        if (mouseActive) {
          const d = Math.hypot(mx - sx, my - sy);
          if (d < proximityRadius) {
            const lin = 1 - d / proximityRadius;
            prox = lin * lin;
          }
        }

        const twinkle =
          0.65 + 0.35 * Math.sin(time * p.twinkleSpeed + p.twinklePhase);
        const alpha = Math.min(1, p.alpha * twinkle + prox * 0.82);
        const r = p.radius * (1 + prox * 1.35);

        if (prox > 0.12) {
          const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 4.5);
          glow.addColorStop(0, `rgba(${p.rgb}, ${prox * 0.48})`);
          glow.addColorStop(1, "rgba(7, 5, 14, 0)");
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(sx, sy, r * 4.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = `rgba(${p.rgb}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // 5. Render Authentic Constellations (Lines, Labels, and Optical PSF Stars)
      for (const constellation of REAL_CONSTELLATIONS) {
        // Compute max proximity across any star in this constellation
        let maxConstellationProx = 0;
        if (mouseActive) {
          for (const st of constellation.stars) {
            const d = Math.hypot(mx - st.nx * width, my - st.ny * height);
            if (d < proximityRadius * 1.15) {
              const p = Math.max(0, 1 - d / (proximityRadius * 1.15));
              if (p > maxConstellationProx) maxConstellationProx = p;
            }
          }
        }

        // Draw authentic constellation lines
        for (const [idA, idB] of constellation.edges) {
          const starA = STAR_BY_ID[idA];
          const starB = STAR_BY_ID[idB];
          if (!starA || !starB) continue;

          const x1 = starA.nx * width;
          const y1 = starA.ny * height;
          const x2 = starB.nx * width;
          const y2 = starB.ny * height;

          const baseLineAlpha = 0.18;
          const litAlpha = baseLineAlpha + maxConstellationProx * 0.58;

          ctx.strokeStyle =
            maxConstellationProx > 0.2
              ? `rgba(229, 193, 88, ${litAlpha})`
              : `rgba(192, 132, 252, ${litAlpha})`;
          ctx.lineWidth = 0.75 + maxConstellationProx * 0.9;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }

        // Draw Constellation Cartography Label (brightens when cursor is near)
        const lx = constellation.labelX * width;
        const ly = constellation.labelY * height;
        const labelAlpha = 0.28 + maxConstellationProx * 0.68;
        ctx.font = "500 10px 'JetBrains Mono', monospace";
        ctx.fillStyle = `rgba(216, 180, 254, ${labelAlpha})`;
        ctx.letterSpacing = "2px";
        ctx.fillText(constellation.name, lx, ly);

        if (maxConstellationProx > 0.25) {
          ctx.font = "italic 11px 'Cormorant Garamond', Georgia, serif";
          ctx.fillStyle = `rgba(229, 193, 88, ${maxConstellationProx * 0.85})`;
          ctx.fillText(constellation.subtitle, lx, ly + 13);
        }

        // Draw Photorealistic Optical PSF Stars (Multi-layer radial glow + white-hot core, no cartoon star shapes)
        for (const s of constellation.stars) {
          const sx = s.nx * width;
          const sy = s.ny * height;

          let prox = 0;
          if (mouseActive) {
            const dist = Math.hypot(mx - sx, my - sy);
            if (dist < proximityRadius) {
              const lin = 1 - dist / proximityRadius;
              prox = lin * lin * 0.65 + lin * 0.35;
            }
          }

          const r = s.baseRadius * (1 + prox * 0.95);
          const outerHaloR = r * (4.2 + prox * 4.8);

          // Layer 1: Wide Spectral Airy Halo
          const outerHalo = ctx.createRadialGradient(
            sx,
            sy,
            r * 0.2,
            sx,
            sy,
            outerHaloR
          );
          outerHalo.addColorStop(
            0,
            `rgba(${s.glowRgb}, ${Math.min(0.85, 0.38 + prox * 0.55)})`
          );
          outerHalo.addColorStop(
            0.4,
            `rgba(${s.glowRgb}, ${Math.min(0.45, 0.14 + prox * 0.32)})`
          );
          outerHalo.addColorStop(1, "rgba(7, 5, 14, 0)");
          ctx.fillStyle = outerHalo;
          ctx.beginPath();
          ctx.arc(sx, sy, outerHaloR, 0, Math.PI * 2);
          ctx.fill();

          // Layer 2: Chromatic Corona Disc
          ctx.fillStyle = s.colorHex;
          ctx.beginPath();
          ctx.arc(sx, sy, r * 1.15, 0, Math.PI * 2);
          ctx.fill();

          // Layer 3: Incandescent White-Hot Photospheric Core
          ctx.fillStyle = "#FFFFFF";
          ctx.beginPath();
          ctx.arc(sx, sy, r * 0.65, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 6. Spawn & Render Shooting Stars (Meteors)
      if (Math.random() < 0.018 && shootingStarsRef.current.length < 3) {
        spawnShootingStar();
      }

      for (let i = shootingStarsRef.current.length - 1; i >= 0; i--) {
        const st = shootingStarsRef.current[i];
        st.x += st.vx;
        st.y += st.vy;
        st.life += 1;

        const progress = st.life / st.maxLife;
        const opacity =
          progress < 0.2
            ? progress / 0.2
            : progress > 0.72
            ? (1 - progress) / 0.28
            : 1;

        const speedMag = Math.hypot(st.vx, st.vy) || 1;
        const tailX = st.x - (st.vx / speedMag) * st.length;
        const tailY = st.y - (st.vy / speedMag) * st.length;

        const grad = ctx.createLinearGradient(st.x, st.y, tailX, tailY);
        grad.addColorStop(0, `rgba(255, 255, 255, ${opacity * 0.98})`);
        grad.addColorStop(0.25, `rgba(229, 193, 88, ${opacity * 0.75})`);
        grad.addColorStop(0.6, `rgba(192, 132, 252, ${opacity * 0.45})`);
        grad.addColorStop(1, "rgba(88, 28, 135, 0)");

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(st.x, st.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        // Meteor head glow
        const headGlow = ctx.createRadialGradient(
          st.x,
          st.y,
          0,
          st.x,
          st.y,
          8
        );
        headGlow.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
        headGlow.addColorStop(1, "rgba(229, 193, 88, 0)");
        ctx.fillStyle = headGlow;
        ctx.beginPath();
        ctx.arc(st.x, st.y, 8, 0, Math.PI * 2);
        ctx.fill();

        if (
          st.life >= st.maxLife ||
          st.x < -200 ||
          st.x > width + 200 ||
          st.y > height + 200
        ) {
          shootingStarsRef.current.splice(i, 1);
        }
      }

      animationFrameId = window.requestAnimationFrame(render);
    };

    animationFrameId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.clearTimeout(initialTimer);
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;
    const width = rect.width;
    const height = rect.height;

    mouseRef.current = { x: localX, y: localY, active: true };

    // 1. Check real constellation stars first (generous 24px capture radius)
    let closestConstellationStar: RealCatalogStar | null = null;
    let minConstDist = 24;

    for (const s of ALL_CONSTELLATION_STARS) {
      const sx = s.nx * width;
      const sy = s.ny * height;
      const dist = Math.hypot(localX - sx, localY - sy);
      if (dist < minConstDist) {
        minConstDist = dist;
        closestConstellationStar = s;
      }
    }

    if (closestConstellationStar) {
      setHoveredStar({
        name: closestConstellationStar.name,
        designation: closestConstellationStar.designation,
        constellation: `${closestConstellationStar.constellation} (${closestConstellationStar.constellationSubtitle})`,
        magnitude: closestConstellationStar.magnitude,
        spectralClass: closestConstellationStar.spectralClass,
        distanceLy: closestConstellationStar.distanceLy,
        eclipticPosition: closestConstellationStar.eclipticPosition,
        astrologicalMeaning: closestConstellationStar.astrologicalMeaning,
        x: closestConstellationStar.nx * width,
        y: closestConstellationStar.ny * height,
      });
      return;
    }

    // 2. Otherwise check background Milky Way catalog stars (16px capture radius)
    let closestPin: BackgroundPinpointStar | null = null;
    let minPinDist = 16;

    for (const p of pinpointsRef.current) {
      const sx = p.nx * width;
      const sy = p.ny * height;
      const dist = Math.hypot(localX - sx, localY - sy);
      if (dist < minPinDist) {
        minPinDist = dist;
        closestPin = p;
      }
    }

    if (closestPin) {
      setHoveredStar({
        name: closestPin.name,
        designation: "IAU Catalog Star",
        constellation: closestPin.constellation,
        magnitude: closestPin.magnitude,
        eclipticPosition: closestPin.eclipticPosition,
        astrologicalMeaning: closestPin.astrologicalMeaning,
        x: closestPin.nx * width,
        y: closestPin.ny * height,
      });
    } else {
      setHoveredStar(null);
    }
  };

  const handleMouseLeave = () => {
    mouseRef.current.active = false;
    setHoveredStar(null);
  };

  return (
    <section
      aria-label="Aetheris Celestial Observatory Home"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-[86vh] flex items-center justify-center overflow-hidden rounded-2xl border border-[#C084FC]/28 bg-gradient-to-b from-[#0E0620] via-[#090415] to-[#07050E] mb-14 shadow-[0_0_90px_rgba(88,28,135,0.28)] cursor-crosshair select-none"
    >
      {/* Interactive Deep-Sky & Authentic Constellation Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Atmospheric Vignette Framing */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.08) 0%, rgba(10, 5, 22, 0.25) 62%, rgba(7, 5, 14, 0.85) 100%)",
        }}
      />

      {/* Delicate Engraved Astrolabe Ring Framing the "Aetheris" Wordmark */}
      <div className="relative z-10 flex flex-col items-center justify-center px-8 py-12 pointer-events-none">
        <div
          onClick={onScrollToContent}
          className="relative flex items-center justify-center pointer-events-auto cursor-pointer group"
        >
          {/* Subtle Concentric Astrolabe Geometry Behind Title */}
          <svg
            viewBox="0 0 360 360"
            className="absolute w-[280px] sm:w-[360px] lg:w-[440px] h-auto opacity-45 group-hover:opacity-75 transition-opacity duration-500 pointer-events-none"
            aria-hidden="true"
          >
            <circle
              cx="180"
              cy="180"
              r="165"
              fill="none"
              stroke="rgba(229, 193, 88, 0.28)"
              strokeWidth="0.75"
              strokeDasharray="2 6"
            />
            <circle
              cx="180"
              cy="180"
              r="142"
              fill="none"
              stroke="rgba(192, 132, 252, 0.25)"
              strokeWidth="0.75"
            />
            <line
              x1="0"
              y1="180"
              x2="360"
              y2="180"
              stroke="rgba(229, 193, 88, 0.18)"
              strokeWidth="0.6"
            />
            <line
              x1="180"
              y1="0"
              x2="180"
              y2="360"
              stroke="rgba(229, 193, 88, 0.18)"
              strokeWidth="0.6"
            />
          </svg>

          <h1 className="relative text-7xl sm:text-8xl lg:text-[124px] font-editorial font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-[#FFFFFF] via-[#F5F0FF] to-[#D8B4FE] drop-shadow-[0_0_55px_rgba(192,132,252,0.45)] transition-transform duration-300 group-hover:scale-[1.02]">
            Aetheris
          </h1>
        </div>
      </div>

      {/* Hover Star & Constellation Identification Tooltip */}
      {hoveredStar && (
        <div
          className="absolute z-30 pointer-events-none px-4 py-3.5 rounded-lg bg-[#0D071B]/95 backdrop-blur-md border border-[#E5C158]/60 shadow-2xl max-w-[310px]"
          style={{
            left: `clamp(16px, ${hoveredStar.x + 20}px, calc(100% - 325px))`,
            top: `clamp(16px, ${hoveredStar.y - 28}px, calc(100% - 175px))`,
          }}
        >
          <div className="flex items-center justify-between gap-3 text-[11px] font-mono-tabular text-[#E5C158]">
            <span>{hoveredStar.designation}</span>
            <span>
              MAG {hoveredStar.magnitude}
              {hoveredStar.distanceLy ? ` · ${hoveredStar.distanceLy}` : ""}
            </span>
          </div>
          <div className="text-lg font-editorial font-semibold text-[#F6F3FF] mt-0.5">
            {hoveredStar.name}
          </div>
          <div className="text-[11px] font-mono-tabular text-[#C084FC] mt-0.5">
            {hoveredStar.constellation} · {hoveredStar.eclipticPosition}
          </div>
          {hoveredStar.spectralClass && (
            <div className="text-[10px] font-mono-tabular text-[#A99EC2] mt-0.5">
              Class: {hoveredStar.spectralClass}
            </div>
          )}
          <p className="text-xs text-[#EAE4F8] leading-relaxed mt-2 border-t border-[#C084FC]/20 pt-1.5">
            {hoveredStar.astrologicalMeaning}
          </p>
        </div>
      )}
    </section>
  );
};
