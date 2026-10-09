import React, { useState } from 'react';
import { Terminal, Copy, Check, Info, Code2, Server, Globe, Sparkles } from 'lucide-react';

interface LocalSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocalSetupModal: React.FC<LocalSetupModalProps> = ({ isOpen, onClose }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const setupCommands = `# 1. Clone repository or unzip folder
git clone https://github.com/your-username/civic-connect.git
cd civic-connect

# 2. Install all dependencies
npm install

# 3. Start development server (Node + Express + Vite)
npm run dev

# App runs locally on: http://localhost:3000`;

  const apiEndpoints = `// REST API Endpoints:
POST   /api/complaints            // Submit new citizen complaint
GET    /api/complaints            // Retrieve all complaints (supports ?status=&issueType=&search=)
GET    /api/complaints/:id        // Get complaint details by ID (e.g., CC1024)
PATCH  /api/complaints/:id/status // Update complaint status (Submitted -> Assigned -> In Progress -> Resolved)
GET    /api/complaints/check-nearby // Check nearby duplicate reports based on GPS coordinates
GET    /api/stats                 // Fetch civic KPI metrics
POST   /api/reset-demo            // Reset demo dataset for testing`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-6">
        
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
                <Terminal className="w-4 h-4" />
              </span>
              <h3 className="text-xl font-extrabold text-slate-900">
                How to Run Civic Connect Locally
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Complete setup guide for hackathon judges, mentors, and developers.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Step-by-step Quickstart */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <Server className="w-4 h-4 text-emerald-600" />
            <span>1. Quickstart Commands</span>
          </h4>

          <div className="bg-slate-900 rounded-2xl p-4 text-slate-200 font-mono text-xs relative group">
            <button
              onClick={() => copyToClipboard(setupCommands, 'commands')}
              className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Copy commands"
            >
              {copiedCode === 'commands' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <pre className="overflow-x-auto whitespace-pre leading-relaxed">
              {setupCommands}
            </pre>
          </div>
        </div>

        {/* REST API Endpoints Specification */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <Code2 className="w-4 h-4 text-blue-600" />
            <span>2. Backend REST API Architecture (Express.js)</span>
          </h4>

          <div className="bg-slate-900 rounded-2xl p-4 text-teal-300 font-mono text-xs relative group">
            <button
              onClick={() => copyToClipboard(apiEndpoints, 'apis')}
              className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Copy APIs"
            >
              {copiedCode === 'apis' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <pre className="overflow-x-auto whitespace-pre leading-relaxed text-[11px]">
              {apiEndpoints}
            </pre>
          </div>
        </div>

        {/* Architecture Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div>
            <span className="font-bold text-slate-900 block mb-1">Frontend Stack:</span>
            <ul className="text-slate-600 space-y-0.5 list-disc list-inside">
              <li>React 19 + TypeScript + Vite</li>
              <li>Tailwind CSS (Civic Green & Blue Theme)</li>
              <li>Browser Geolocation API (GPS geotagging)</li>
              <li>Responsive mobile & desktop viewports</li>
            </ul>
          </div>

          <div>
            <span className="font-bold text-slate-900 block mb-1">Backend & Persistence:</span>
            <ul className="text-slate-600 space-y-0.5 list-disc list-inside">
              <li>Node.js + Express.js REST APIs</li>
              <li>Persistent JSON database engine in <code className="bg-slate-200 px-1 rounded font-mono">/data</code></li>
              <li>Haversine duplicate detection (&lt; 200m)</li>
              <li>Smart Department router & Priority calculator</li>
            </ul>
          </div>
        </div>

        {/* Close Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Got It, Back to App
          </button>
        </div>

      </div>
    </div>
  );
};
