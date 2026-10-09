import React, { useEffect, useState } from 'react';
import { 
  Building2, 
  PlusCircle, 
  Search, 
  Camera, 
  MapPin, 
  Route, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Users, 
  Sparkles, 
  Activity,
  Layers,
  PhoneCall,
  Wrench,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Complaint } from '../types/complaint.ts';
import { fetchAllComplaints } from '../services/api.ts';
import { ISSUE_CONFIG } from '../constants/civic.ts';

interface HomePageProps {
  onNavigate: (tab: 'home' | 'report' | 'track' | 'authority', complaintIdToTrack?: string) => void;
  openIssuesCount: number;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  openIssuesCount,
}) => {
  const [recentComplaints, setRecentComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    fetchAllComplaints()
      .then((data) => setRecentComplaints(data.slice(0, 3)))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-14 sm:pt-14 sm:pb-20 bg-gradient-to-b from-emerald-50/70 via-teal-50/30 to-slate-50 border-b border-slate-200/60">
        
        {/* Subtle geometric background accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden opacity-30">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-emerald-300 blur-3xl"></div>
          <div className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-cyan-200 blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            
            {/* Civic Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-200 shadow-2xs animate-in fade-in slide-in-from-top-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Next-Gen Smart City Grievance Network</span>
            </div>

            {/* Platform Title & Tagline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight sm:leading-none">
                Civic <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Connect</span>
              </h1>
              
              <p className="text-xl sm:text-2xl font-extrabold text-teal-900 tracking-tight">
                “Report. Resolve. Build Better Cities.”
              </p>
            </div>

            {/* Short Explanation */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
              A crowdsourced civic problem reporting and resolution system. Spot potholes, overflowing garbage, drainage blocks, or broken streetlights, capture GPS coordinates, and track repairs with complete transparency.
            </p>

            {/* Main Action CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button
                onClick={() => onNavigate('report')}
                className="w-full sm:w-auto px-7 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl font-bold shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2.5 transition-transform hover:-translate-y-0.5 text-base"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Report an Issue</span>
              </button>

              <button
                onClick={() => onNavigate('track')}
                className="w-full sm:w-auto px-7 py-4 bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 hover:border-slate-300 rounded-2xl font-bold shadow-xs flex items-center justify-center gap-2.5 transition-all text-base"
              >
                <Search className="w-5 h-5 text-teal-600" />
                <span>Track Complaint</span>
              </button>
            </div>

            {/* City Live Stats Bar */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-500 border-t border-slate-200/70">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Verified Municipal Routing</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-600" />
                <span>Average 24–48h Dispatch SLA</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Open Citizen Accountability</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Core Technology Pillars
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
            How Civic Connect Bridges Citizens & Authorities
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Engineered for fast, reliable reporting without bureaucracy or lost paperwork.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Feature 1 */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4 hover:border-emerald-300 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">
                Photo-Based Reporting
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                Take an instant photo using your smartphone or upload evidence. Clear visual proof eliminates ambiguity for inspection teams.
              </p>
            </div>
            <div className="pt-2 text-xs font-semibold text-emerald-700 flex items-center gap-1">
              <span>High-res preview & tags</span>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4 hover:border-teal-300 group">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">
                GPS Location Pinpoint
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                One-tap browser Geolocation API collects accurate latitude & longitude coordinates. Pinpoints issues directly to ward grids.
              </p>
            </div>
            <div className="pt-2 text-xs font-semibold text-teal-700 flex items-center gap-1">
              <span>±4m geo-coordinate accuracy</span>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4 hover:border-blue-300 group">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Route className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">
                Smart Complaint Routing
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                Intelligent routing automatically directs grievances to Roads, Sanitation, Drainage, or Electrical departments without delay.
              </p>
            </div>
            <div className="pt-2 text-xs font-semibold text-blue-700 flex items-center gap-1">
              <span>Duplicate detection active</span>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4 hover:border-indigo-300 group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">
                Transparent Tracking
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                Live 4-step pipeline: Submitted → Assigned → In Progress → Resolved. Citizens monitor exact officer notes and timestamps.
              </p>
            </div>
            <div className="pt-2 text-xs font-semibold text-indigo-700 flex items-center gap-1">
              <span>Audit trail logged</span>
            </div>
          </div>

        </div>
      </section>

      {/* Interactive Workflow Diagram Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          
          <div className="relative z-10 max-w-2xl mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-300 bg-teal-950/80 px-3 py-1 rounded-full border border-teal-500/30">
              End-To-End Lifecycle
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-3">
              From Citizen Report to Ground Resolution
            </h2>
            <p className="text-slate-300 text-sm mt-2">
              Every ticket follows an auditable digital pipeline connecting citizens, dispatchers, and field teams.
            </p>
          </div>

          {/* Stepper Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
            
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-xs">
                1
              </div>
              <h4 className="font-bold text-white text-base">Citizen Reports</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Citizen snaps issue photo, captures GPS geolocation, and submits grievance in under 30 seconds.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-2">
              <div className="w-8 h-8 rounded-full bg-teal-500 text-white font-bold flex items-center justify-center text-xs">
                2
              </div>
              <h4 className="font-bold text-white text-base">Backend Dispatch</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Node.js & Express REST APIs validate payload, generate ticket CC1024, check duplicates, and auto-route.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center text-xs">
                3
              </div>
              <h4 className="font-bold text-white text-base">Authority Action</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Municipal inspectors review on dashboard, assign crew, and advance status to In Progress with field notes.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-2">
              <div className="w-8 h-8 rounded-full bg-green-500 text-white font-bold flex items-center justify-center text-xs">
                4
              </div>
              <h4 className="font-bold text-white text-base">Verified Resolved</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Repair signed off, status marked Resolved, and citizen tracking timeline updates instantaneously.
              </p>
            </div>

          </div>

          {/* Action to Authority Portal */}
          <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
            <div className="text-xs text-slate-300 text-center sm:text-left">
              Want to see how municipal officers manage grievances in real time?
            </div>
            <button
              onClick={() => onNavigate('authority')}
              className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-md flex items-center gap-2"
            >
              <span>Open Authority Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* Live Recent Grievances Showcase */}
      {recentComplaints.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Live Public Transparency
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Recent Ward 84 Grievances
              </h2>
            </div>
            <button
              onClick={() => onNavigate('authority')}
              className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 self-start sm:self-auto"
            >
              <span>View all in authority log</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentComplaints.map((item) => (
              <div
                key={item.complaintId}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-40 bg-slate-100">
                    <img src={item.image} alt={item.issueType} className="w-full h-full object-cover" />
                    <div className="absolute top-2.5 left-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        item.status === 'Resolved' ? 'bg-emerald-600 text-white' : item.status === 'In Progress' ? 'bg-indigo-600 text-white' : 'bg-amber-600 text-white'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="absolute top-2.5 right-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/60 text-white backdrop-blur-xs">
                        {item.complaintId}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">{item.issueType}</span>
                      <span className="text-slate-400 text-[11px]">
                        {new Date(item.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 pt-1 truncate">
                      <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span className="truncate">{item.locationAddress}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    onClick={() => onNavigate('track', item.complaintId)}
                    className="w-full py-2 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-xl text-xs font-bold border border-slate-200 hover:border-emerald-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Track Ticket #{item.complaintId}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Smart Department Routing Reference Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-100/80 rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-4">
          <div className="max-w-xl">
            <h3 className="font-extrabold text-slate-900 text-lg">
              Automated Municipal Department Routing Matrix
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Incoming citizen complaints are instantly categorized and assigned to corresponding civic utility authorities:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {[
              { type: 'Pothole', dept: 'Roads & Infrastructure Department', time: '24-48 Hours' },
              { type: 'Garbage Dump', dept: 'Solid Waste & Sanitation Department', time: '12-24 Hours' },
              { type: 'Drainage Overflow', dept: 'Water Supply & Drainage Board', time: '6-12 Hours' },
              { type: 'Streetlight', dept: 'Municipal Electrical Department', time: '24-48 Hours' },
              { type: 'Public Sanitation', dept: 'Public Health & Sanitation Wing', time: '12-24 Hours' },
              { type: 'Other Grievance', dept: 'Civic Grievance Cell', time: '48-72 Hours' },
            ].map((route, i) => (
              <div key={i} className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">{route.type}</span>
                  <span className="text-slate-500 text-[11px] block mt-0.5">{route.dept}</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {route.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
