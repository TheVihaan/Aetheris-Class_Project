import React, { useState } from "react";
import { NatalProfile } from "../types/astrology";
import { CITY_PRESETS, calculateNatalChart } from "../utils/ephemeris";
import { X, Check } from "lucide-react";

interface CalibrateChartModalProps {
  profile: NatalProfile;
  isOpen: boolean;
  onClose: () => void;
  onSaveProfile: (updated: NatalProfile) => void;
}

export const CalibrateChartModal: React.FC<CalibrateChartModalProps> = ({
  profile,
  isOpen,
  onClose,
  onSaveProfile,
}) => {
  const [name, setName] = useState(profile.name);
  const [birthDate, setBirthDate] = useState(profile.birthDate);
  const [birthTime, setBirthTime] = useState(profile.birthTime);
  const [birthLocation, setBirthLocation] = useState(profile.birthLocation);
  const [latitude, setLatitude] = useState(String(profile.latitude));
  const [longitude, setLongitude] = useState(String(profile.longitude));

  if (!isOpen) return null;

  const handleCitySelect = (cityLabel: string) => {
    setBirthLocation(cityLabel);
    const found = CITY_PRESETS.find((c) => c.label === cityLabel);
    if (found) {
      setLatitude(String(found.latitude));
      setLongitude(String(found.longitude));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedChart = calculateNatalChart({
      id: profile.id,
      name: name.trim() || "Celestial Subject",
      birthDate,
      birthTime,
      birthLocation: birthLocation.trim() || "New York, NY, USA",
      latitude: parseFloat(latitude) || 40.7128,
      longitude: parseFloat(longitude) || -74.006,
    });
    onSaveProfile(updatedChart);
    onClose();
  };

  const applyQuickPreset = (preset: {
    name: string;
    birthDate: string;
    birthTime: string;
    city: string;
  }) => {
    setName(preset.name);
    setBirthDate(preset.birthDate);
    setBirthTime(preset.birthTime);
    handleCitySelect(preset.city);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="calibrate-modal-title"
    >
      <div className="w-full max-w-xl bg-[#120B24] border border-[#C084FC]/45 rounded-lg p-6 lg:p-8 space-y-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-[#C084FC]/18 pb-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#C084FC] font-mono-tabular">
              EPHEMERIS CALIBRATION INSTRUMENT
            </div>
            <h2
              id="calibrate-modal-title"
              className="text-2xl font-editorial font-semibold text-[#F6F3FF] mt-1"
            >
              Calibrate Natal Birth Coordinates
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#A99EC2] hover:text-[#F6F3FF] rounded cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Archetype Presets for Instant Testing */}
        <div className="space-y-2">
          <div className="text-xs text-[#A99EC2]">
            Quick-Load Sample Natal Subjects:
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              {
                name: "Clara Vance",
                birthDate: "1994-11-08",
                birthTime: "21:15",
                city: "New York, NY, USA",
              },
              {
                name: "Mateo Silva",
                birthDate: "1991-03-28",
                birthTime: "06:45",
                city: "Buenos Aires, Argentina",
              },
              {
                name: "Kenji Takahashi",
                birthDate: "1996-09-12",
                birthTime: "23:10",
                city: "Tokyo, Japan",
              },
            ].map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => applyQuickPreset(p)}
                className="px-3 py-1.5 text-xs bg-[#080511] border border-[#C084FC]/20 hover:border-[#E5C158] rounded text-[#EAE4F8] transition-colors cursor-pointer"
              >
                {p.name} ({p.birthDate})
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-[#A99EC2] mb-1.5">
              Subject Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-[#080511] border border-[#C084FC]/22 rounded text-[#F6F3FF] focus:outline-none focus:border-[#C084FC]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#A99EC2] mb-1.5">
                Exact Birth Date
              </label>
              <input
                type="date"
                required
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-[#080511] border border-[#C084FC]/22 rounded text-[#F6F3FF] font-mono-tabular focus:outline-none focus:border-[#C084FC]"
              />
            </div>

            <div>
              <label className="block text-xs text-[#A99EC2] mb-1.5">
                Exact Birth Time (24h)
              </label>
              <input
                type="time"
                required
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-[#080511] border border-[#C084FC]/22 rounded text-[#F6F3FF] font-mono-tabular focus:outline-none focus:border-[#C084FC]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-[#A99EC2] mb-1.5">
              Birth City Preset
            </label>
            <select
              value={
                CITY_PRESETS.some((c) => c.label === birthLocation)
                  ? birthLocation
                  : CITY_PRESETS[0].label
              }
              onChange={(e) => handleCitySelect(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-[#080511] border border-[#C084FC]/22 rounded text-[#F6F3FF] focus:outline-none focus:border-[#C084FC]"
            >
              {CITY_PRESETS.map((c) => (
                <option key={c.label} value={c.label}>
                  {c.label} ({c.latitude.toFixed(2)}°, {c.longitude.toFixed(2)}°)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-[#A99EC2] mb-1.5">
                Custom Place Label
              </label>
              <input
                type="text"
                value={birthLocation}
                onChange={(e) => setBirthLocation(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-[#080511] border border-[#C084FC]/22 rounded text-[#F6F3FF] focus:outline-none focus:border-[#C084FC]"
              />
            </div>
            <div>
              <label className="block text-xs text-[#A99EC2] mb-1.5">
                Latitude (°N)
              </label>
              <input
                type="number"
                step="0.0001"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-[#080511] border border-[#C084FC]/22 rounded text-[#F6F3FF] font-mono-tabular focus:outline-none focus:border-[#C084FC]"
              />
            </div>
            <div>
              <label className="block text-xs text-[#A99EC2] mb-1.5">
                Longitude (°E)
              </label>
              <input
                type="number"
                step="0.0001"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-[#080511] border border-[#C084FC]/22 rounded text-[#F6F3FF] font-mono-tabular focus:outline-none focus:border-[#C084FC]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#C084FC]/16 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-[#A99EC2] hover:text-[#F6F3FF] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold bg-gradient-to-r from-[#C084FC] to-[#E5C158] text-[#07050E] rounded hover:opacity-95 transition-opacity cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Calculate Natal Ephemeris</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
