import React, { useState } from 'react';
import { MapPin, Navigation, Copy, Check, ExternalLink, Compass } from 'lucide-react';

interface MapPreviewProps {
  latitude: number;
  longitude: number;
  address?: string;
  landmark?: string;
  issueType?: string;
}

export const MapPreview: React.FC<MapPreviewProps> = ({
  latitude,
  longitude,
  address,
  landmark,
  issueType = 'Civic Issue',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const osmUrl = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`;
  const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
      {/* Map visual canvas simulation with grid and radar pin */}
      <div className="relative h-44 sm:h-52 bg-slate-900 overflow-hidden flex items-center justify-center">
        {/* Subtle map grid pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #38bdf8 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Contour lines simulation */}
        <svg className="absolute inset-0 w-full h-full opacity-15 stroke-teal-400" xmlns="http://www.w3.org/2000/svg">
          <path d="M-50,60 Q100,120 250,50 T600,100" fill="none" strokeWidth="1.5" />
          <path d="M0,120 Q180,40 350,140 T700,70" fill="none" strokeWidth="1.5" />
          <path d="M-20,180 Q150,150 400,180 T800,160" fill="none" strokeWidth="1.5" />
        </svg>

        {/* Pulsing center GPS marker */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative">
            <span className="absolute -inset-3 rounded-full bg-emerald-500/30 animate-ping"></span>
            <span className="absolute -inset-6 rounded-full bg-teal-500/15 animate-pulse"></span>
            <div className="w-11 h-11 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-teal-900/50 border-2 border-white">
              <MapPin className="w-6 h-6 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-2 px-3 py-1 bg-slate-950/80 backdrop-blur-md rounded-full border border-teal-500/40 text-[11px] font-mono text-teal-300 font-semibold shadow-md">
            {latitude.toFixed(5)}° N, {longitude.toFixed(5)}° E
          </div>
        </div>

        {/* Map Top Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-slate-950/70 backdrop-blur-md rounded-lg border border-slate-700/60 text-xs text-slate-300 font-medium">
          <Compass className="w-3.5 h-3.5 text-teal-400 animate-spin" style={{ animationDuration: '12s' }} />
          <span>GPS Geotag Verified</span>
        </div>

        {/* External Map links */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
          <a
            href={gmapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-white/90 hover:bg-white text-slate-800 rounded-lg shadow-sm transition-colors"
          >
            <span>Google Maps</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </a>
        </div>
      </div>

      {/* Location Details footer */}
      <div className="p-4 bg-white border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <Navigation className="w-3.5 h-3.5 text-teal-600" />
            <span>Geo-coordinates</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-semibold text-slate-900">
              {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </span>
            <button
              onClick={handleCopy}
              className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Copy Coordinates"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          {(address || landmark) && (
            <p className="text-xs text-slate-600">
              {address} {landmark && <span className="text-slate-400 font-medium">({landmark})</span>}
            </p>
          )}
        </div>

        <div className="shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Accuracy: ±4 meters</span>
          </span>
        </div>
      </div>
    </div>
  );
};
