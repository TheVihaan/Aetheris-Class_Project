import React, { useState } from "react";
import { ChartAspect, NatalProfile, PlanetName, PlanetPlacement } from "../types/astrology";
import { ZODIAC_SIGNS } from "../utils/ephemeris";

interface NatalWheelSvgProps {
  profile: NatalProfile;
  secondaryProfile?: NatalProfile | null;
  selectedPlanet?: PlanetName | null;
  onSelectPlanet?: (planet: PlanetName) => void;
  size?: number;
}

export const NatalWheelSvg: React.FC<NatalWheelSvgProps> = ({
  profile,
  secondaryProfile = null,
  selectedPlanet = null,
  onSelectPlanet,
  size = 500,
}) => {
  const [hoveredPlanet, setHoveredPlanet] = useState<PlanetPlacement | null>(null);

  const cx = size / 2;
  const cy = size / 2;
  const outerRadius = size * 0.45;
  const zodiacInnerRadius = size * 0.37;
  const houseInnerRadius = secondaryProfile ? size * 0.25 : size * 0.28;
  const aspectRadius = size * 0.21;

  const ascLongitude =
    profile.placements.find((p) => p.planet === "Ascendant")?.eclipticLongitude || 0;

  const lonToAngleRad = (eclipticLon: number) => {
    const deg = 180 - (eclipticLon - ascLongitude);
    return (deg * Math.PI) / 180;
  };

  const polarToCartesian = (r: number, eclipticLon: number) => {
    const rad = lonToAngleRad(eclipticLon);
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  };

  const activeFocusPlanet = hoveredPlanet?.planet || selectedPlanet;

  const elementStrokeColor = (el: string) => {
    switch (el) {
      case "Fire":
        return "#FBBF24";
      case "Earth":
        return "#34D399";
      case "Air":
        return "#DDD6FE";
      case "Water":
        return "#C084FC";
      default:
        return "#E5C158";
    }
  };

  const aspectColor = (harmony: ChartAspect["harmony"]) => {
    if (harmony === "harmonious") return "#C084FC";
    if (harmony === "challenging") return "#FB7185";
    return "#E5C158";
  };

  const computePlottedPositions = (placements: PlanetPlacement[], baseR: number) => {
    const sorted = [...placements].sort((a, b) => a.eclipticLongitude - b.eclipticLongitude);
    return sorted.map((p, idx) => {
      const prev = sorted[(idx - 1 + sorted.length) % sorted.length];
      const diff = Math.abs(p.eclipticLongitude - prev.eclipticLongitude);
      const radiusOffset = diff < 8 && idx % 2 === 1 ? -16 : 0;
      const pos = polarToCartesian(baseR + radiusOffset, p.eclipticLongitude);
      return { placement: p, x: pos.x, y: pos.y };
    });
  };

  const primaryNodes = computePlottedPositions(
    profile.placements,
    secondaryProfile ? size * 0.325 : size * 0.325
  );
  const secondaryNodes = secondaryProfile
    ? computePlottedPositions(secondaryProfile.placements, size * 0.255)
    : [];

  return (
    <div className="relative flex flex-col items-center select-none">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full max-w-[500px] h-auto cursor-crosshair"
        role="img"
        aria-label={`Celestial Natal Chart Wheel for ${profile.name}`}
      >
        <defs>
          <radialGradient id="obsidianVioletDial" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1B1136" />
            <stop offset="68%" stopColor="#0E081E" />
            <stop offset="100%" stopColor="#07050E" />
          </radialGradient>
        </defs>

        {/* Outer Dial Background */}
        <circle
          cx={cx}
          cy={cy}
          r={outerRadius + 8}
          fill="none"
          stroke="rgba(192, 132, 252, 0.22)"
          strokeWidth="1"
        />
        <circle
          cx={cx}
          cy={cy}
          r={outerRadius}
          fill="url(#obsidianVioletDial)"
          stroke="rgba(192, 132, 252, 0.48)"
          strokeWidth="1.25"
        />

        {/* Degree Tick Marks around Ecliptic */}
        {Array.from({ length: 72 }).map((_, i) => {
          const deg = i * 5;
          const isMajor = deg % 30 === 0;
          const isTen = deg % 10 === 0;
          const innerTick = isMajor ? zodiacInnerRadius : isTen ? outerRadius - 8 : outerRadius - 4;
          const p1 = polarToCartesian(outerRadius, deg);
          const p2 = polarToCartesian(innerTick, deg);
          return (
            <line
              key={`tick-${deg}`}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke={isMajor ? "rgba(229, 193, 88, 0.55)" : "rgba(216, 180, 254, 0.18)"}
              strokeWidth={isMajor ? "1" : "0.75"}
            />
          );
        })}

        {/* Zodiac Ring Inner Boundary */}
        <circle
          cx={cx}
          cy={cy}
          r={zodiacInnerRadius}
          fill="none"
          stroke="rgba(192, 132, 252, 0.35)"
          strokeWidth="1"
        />

        {/* 12 Zodiac Sign Glyphs & Labels */}
        {ZODIAC_SIGNS.map((z) => {
          const midLon = z.startDegree + 15;
          const pos = polarToCartesian((outerRadius + zodiacInnerRadius) / 2, midLon);
          return (
            <g key={z.sign}>
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill={elementStrokeColor(z.element)}
                className="text-[15px] font-serif"
              >
                {z.glyph}
              </text>
            </g>
          );
        })}

        {/* 12 House Cusps & Numerals */}
        {Array.from({ length: 12 }).map((_, idx) => {
          const houseNum = idx + 1;
          const cuspLon = (Math.floor(ascLongitude / 30) * 30 + idx * 30) % 360;
          const pOuter = polarToCartesian(zodiacInnerRadius, cuspLon);
          const pInner = polarToCartesian(aspectRadius, cuspLon);
          const isCardinalAxis = houseNum === 1 || houseNum === 4 || houseNum === 7 || houseNum === 10;

          const labelMidLon = (cuspLon + 15) % 360;
          const labelPos = polarToCartesian((houseInnerRadius + aspectRadius) / 2, labelMidLon);

          return (
            <g key={`house-${houseNum}`}>
              <line
                x1={pOuter.x}
                y1={pOuter.y}
                x2={pInner.x}
                y2={pInner.y}
                stroke={isCardinalAxis ? "rgba(229, 193, 88, 0.6)" : "rgba(192, 132, 252, 0.14)"}
                strokeWidth={isCardinalAxis ? "1.4" : "0.75"}
                strokeDasharray={isCardinalAxis ? undefined : "2 3"}
              />
              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill="rgba(169, 158, 194, 0.72)"
                className="text-[9px] font-mono-tabular"
              >
                {houseNum}
              </text>
            </g>
          );
        })}

        {/* Secondary Synastry Ring Boundary if Comparing Two Charts */}
        {secondaryProfile && (
          <circle
            cx={cx}
            cy={cy}
            r={size * 0.285}
            fill="none"
            stroke="rgba(229, 193, 88, 0.32)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
        )}

        {/* Inner Aspect Ring Boundary */}
        <circle
          cx={cx}
          cy={cy}
          r={aspectRadius}
          fill="#080511"
          stroke="rgba(192, 132, 252, 0.35)"
          strokeWidth="1"
        />

        {/* Aspect Chords inside the Central Core */}
        {profile.aspects.map((asp) => {
          const pA = profile.placements.find((p) => p.planet === asp.planetA);
          const pB = profile.placements.find((p) => p.planet === asp.planetB);
          if (!pA || !pB) return null;

          const posA = polarToCartesian(aspectRadius - 2, pA.eclipticLongitude);
          const posB = polarToCartesian(aspectRadius - 2, pB.eclipticLongitude);

          const isHighlighted =
            !activeFocusPlanet ||
            activeFocusPlanet === asp.planetA ||
            activeFocusPlanet === asp.planetB;

          return (
            <line
              key={asp.id}
              x1={posA.x}
              y1={posA.y}
              x2={posB.x}
              y2={posB.y}
              stroke={aspectColor(asp.harmony)}
              strokeWidth={
                activeFocusPlanet &&
                (activeFocusPlanet === asp.planetA || activeFocusPlanet === asp.planetB)
                  ? "1.75"
                  : "0.85"
              }
              strokeOpacity={isHighlighted ? 0.78 : 0.14}
            />
          );
        })}

        {/* Primary Chart Planet Nodes */}
        {primaryNodes.map(({ placement, x, y }) => {
          const isSelected = activeFocusPlanet === placement.planet;
          const rimPoint = polarToCartesian(aspectRadius, placement.eclipticLongitude);

          return (
            <g
              key={`primary-${placement.planet}`}
              className="cursor-pointer transition-opacity duration-150"
              onMouseEnter={() => setHoveredPlanet(placement)}
              onMouseLeave={() => setHoveredPlanet(null)}
              onClick={() => onSelectPlanet?.(placement.planet)}
            >
              <line
                x1={x}
                y1={y}
                x2={rimPoint.x}
                y2={rimPoint.y}
                stroke={isSelected ? "#E5C158" : "rgba(192, 132, 252, 0.25)"}
                strokeWidth={isSelected ? "1.2" : "0.6"}
              />
              <circle
                cx={x}
                cy={y}
                r={isSelected ? 13 : 11}
                fill={isSelected ? "#C084FC" : "#150D2A"}
                stroke={isSelected ? "#F6F3FF" : "rgba(192, 132, 252, 0.6)"}
                strokeWidth={isSelected ? "1.5" : "1"}
              />
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fill={isSelected ? "#07050E" : "#F6F3FF"}
                className="text-[11px] font-semibold font-serif"
              >
                {placement.glyph}
              </text>
            </g>
          );
        })}

        {/* Secondary Chart Planet Nodes (When in Synastry Mode) */}
        {secondaryNodes.map(({ placement, x, y }) => (
          <g
            key={`secondary-${placement.planet}`}
            className="cursor-pointer"
            onMouseEnter={() => setHoveredPlanet(placement)}
            onMouseLeave={() => setHoveredPlanet(null)}
          >
            <circle
              cx={x}
              cy={y}
              r={9.5}
              fill="#1E1338"
              stroke="#E5C158"
              strokeWidth="1"
            />
            <text
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#FDE68A"
              className="text-[9.5px] font-serif"
            >
              {placement.glyph}
            </text>
          </g>
        ))}

        {/* Center Axis Crosshair */}
        <line
          x1={cx - 8}
          y1={cy}
          x2={cx + 8}
          y2={cy}
          stroke="rgba(192, 132, 252, 0.45)"
          strokeWidth="0.75"
        />
        <line
          x1={cx}
          y1={cy - 8}
          x2={cx}
          y2={cy + 8}
          stroke="rgba(192, 132, 252, 0.45)"
          strokeWidth="0.75"
        />
      </svg>

      {/* Precision Telemetry Readout Bar Beneath the Wheel */}
      <div className="w-full mt-3 pt-3 border-t border-[#C084FC]/16 flex flex-wrap items-center justify-between gap-2 text-xs text-[#A99EC2] font-mono-tabular">
        {hoveredPlanet ? (
          <>
            <span className="text-[#F6F3FF] font-medium">
              {hoveredPlanet.glyph} {hoveredPlanet.planet} in {hoveredPlanet.sign}
            </span>
            <span className="text-[#C084FC]">
              {hoveredPlanet.degree}°{String(hoveredPlanet.minute).padStart(2, "0")}&apos; · House{" "}
              {hoveredPlanet.house} · {hoveredPlanet.element} / {hoveredPlanet.modality}
              {hoveredPlanet.retrograde ? " · Rx" : ""}
            </span>
          </>
        ) : (
          <>
            <span>
              ECLIPTIC EPOCH · {profile.birthDate} · {profile.birthTime}
            </span>
            <span>
              LAT {profile.latitude.toFixed(2)}° · LON {profile.longitude.toFixed(2)}°
            </span>
          </>
        )}
      </div>
    </div>
  );
};
