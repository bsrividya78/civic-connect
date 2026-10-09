import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Clock, 
  Building2, 
  UserCheck, 
  AlertCircle, 
  RefreshCw, 
  CheckCircle2, 
  ArrowRight, 
  Share2, 
  Check, 
  ExternalLink,
  Shield,
  FileText
} from 'lucide-react';
import { Complaint, ComplaintStatus } from '../types/complaint.ts';
import { fetchComplaintById } from '../services/api.ts';
import { StatusTimeline } from './StatusTimeline.tsx';
import { MapPreview } from './MapPreview.tsx';
import { ISSUE_CONFIG } from '../constants/civic.ts';

interface TrackComplaintPageProps {
  initialId?: string;
  onNavigateToAuthority: () => void;
  onNavigateToReport: () => void;
}

export const TrackComplaintPage: React.FC<TrackComplaintPageProps> = ({
  initialId = 'CC1024',
  onNavigateToAuthority,
  onNavigateToReport,
}) => {
  const [complaintIdInput, setComplaintIdInput] = useState(initialId);
  const [currentComplaint, setCurrentComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const loadComplaint = async (id: string) => {
    if (!id.trim()) return;
    setLoading(true);
    setErrorMessage(null);

    try {
      const data = await fetchComplaintById(id);
      setCurrentComplaint(data);
    } catch (err) {
      setCurrentComplaint(null);
      setErrorMessage(err instanceof Error ? err.message : `Complaint "${id}" not found.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      setComplaintIdInput(initialId);
      loadComplaint(initialId);
    }
  }, [initialId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadComplaint(complaintIdInput);
  };

  const handleQuickPick = (id: string) => {
    setComplaintIdInput(id);
    loadComplaint(id);
  };

  const handleShare = () => {
    if (currentComplaint) {
      navigator.clipboard.writeText(
        `Check civic issue ${currentComplaint.complaintId} on Civic Connect: ${currentComplaint.issueType} (${currentComplaint.status})`
      );
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      {/* Page Header */}
      <div className="mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-100 text-teal-800 border border-teal-200 mb-2">
          <Clock className="w-3.5 h-3.5 text-teal-600" />
          <span>Real-Time Citizen Tracking</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Track Your Civic Complaint
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-1">
          Monitor investigation, municipal officer assignment, field repair progress, and final sign-off.
        </p>
      </div>

      {/* Search Bar Container */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs mb-8">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={complaintIdInput}
              onChange={(e) => setComplaintIdInput(e.target.value.toUpperCase())}
              placeholder="Enter Complaint ID (e.g. CC1024, CC1025)"
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-300 font-mono text-base font-bold text-slate-900 placeholder:font-sans placeholder:font-normal placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden uppercase tracking-wider"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-transform active:scale-95"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>Track Status</span>
          </button>
        </form>

        {/* Quick Sample Picks */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Try Sample Tickets:</span>
          {['CC1024', 'CC1025', 'CC1026', 'CC1027', 'CC1028'].map((id) => (
            <button
              key={id}
              onClick={() => handleQuickPick(id)}
              className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg transition-colors border ${
                complaintIdInput.toUpperCase() === id
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {id}
            </button>
          ))}
        </div>
      </div>

      {/* Error state */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center space-y-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-red-900">Ticket Not Found</h3>
          <p className="text-sm text-red-700 max-w-md mx-auto">{errorMessage}</p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => handleQuickPick('CC1024')}
              className="px-4 py-2 bg-white text-slate-800 border border-slate-200 rounded-xl text-xs font-semibold hover:bg-slate-50"
            >
              Load Demo CC1024
            </button>
            <button
              onClick={onNavigateToReport}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700"
            >
              Report a New Issue
            </button>
          </div>
        </div>
      )}

      {/* Complaint Details View */}
      {currentComplaint && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* Main Status Header Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono text-xl sm:text-2xl font-black text-slate-900 tracking-wider">
                    {currentComplaint.complaintId}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    currentComplaint.status === 'Resolved'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : currentComplaint.status === 'In Progress'
                      ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                      : currentComplaint.status === 'Assigned'
                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {currentComplaint.status}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    currentComplaint.priority === 'High'
                      ? 'bg-red-100 text-red-700'
                      : currentComplaint.priority === 'Medium'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {currentComplaint.priority} Priority
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Logged on {new Date(currentComplaint.createdAt).toLocaleDateString(undefined, { 
                    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                  })}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => loadComplaint(currentComplaint.complaintId)}
                  className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                  title="Refresh status"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
                  title="Copy shareable link"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied' : 'Share'}</span>
                </button>
                <button
                  onClick={onNavigateToAuthority}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors border border-blue-200"
                >
                  <Shield className="w-3.5 h-3.5 text-blue-600" />
                  <span>Update in Authority Panel</span>
                </button>
              </div>
            </div>

            {/* Visual Resolution Pipeline (Submitted -> Assigned -> In Progress -> Resolved) */}
            <div className="pt-6">
              <StatusTimeline
                currentStatus={currentComplaint.status}
                history={currentComplaint.statusHistory}
              />
            </div>
          </div>

          {/* Issue Overview & Photo Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Column: Photo & Evidence */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center justify-between">
                <span>Field Photo Evidence</span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {currentComplaint.issueType}
                </span>
              </h3>

              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 relative group">
                <img
                  src={currentComplaint.image}
                  alt={currentComplaint.issueType}
                  className="w-full h-64 object-cover group-hover:scale-102 transition-transform duration-300"
                />
                <div className="absolute bottom-3 left-3 right-3 bg-slate-950/80 backdrop-blur-xs text-white p-3 rounded-xl text-xs flex items-center justify-between">
                  <div>
                    <span className="font-bold block">{currentComplaint.issueType}</span>
                    <span className="text-[11px] text-slate-300">Photo captured by citizen device</span>
                  </div>
                </div>
              </div>

              {/* Description box */}
              <div className="space-y-1.5 pt-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Citizen Problem Statement
                </span>
                <p className="text-sm text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                  "{currentComplaint.description}"
                </p>
              </div>

              {/* Resolution Notes if resolved */}
              {currentComplaint.resolutionNotes && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Official Resolution Note</span>
                  </span>
                  <p className="text-xs text-emerald-900">
                    {currentComplaint.resolutionNotes}
                  </p>
                </div>
              )}
            </div>

            {/* Right Column: Location & Department Routing */}
            <div className="space-y-6">
              
              {/* Department & Officer Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-teal-600" />
                  <span>Responsible Civic Authority</span>
                </h3>

                <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 rounded-2xl p-4 space-y-3">
                  <div>
                    <span className="text-xs font-bold text-teal-700 uppercase tracking-wider block">
                      Allocated Department
                    </span>
                    <span className="font-extrabold text-slate-900 text-base block mt-0.5">
                      {currentComplaint.department}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-teal-200/60 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-500 font-medium block">Nodal Officer:</span>
                      <span className="font-bold text-slate-800">
                        {currentComplaint.assignedOfficer || 'Auto-allocated to Ward 84 Duty Engineer'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500 font-medium block">Complainant:</span>
                      <span className="font-bold text-slate-800">
                        {currentComplaint.citizenName || 'Registered Resident'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Timeline History Log */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Action Trail & Remarks
                  </span>
                  <div className="space-y-2">
                    {currentComplaint.statusHistory.map((item, index) => (
                      <div key={index} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                        <div className="flex items-center justify-between font-semibold text-slate-800 mb-0.5">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                            {item.status}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {new Date(item.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        {item.comment && (
                          <p className="text-slate-600 mt-1 pl-3.5 text-[11px]">
                            {item.comment}
                          </p>
                        )}
                        {item.updatedBy && (
                          <span className="text-[10px] text-slate-400 pl-3.5 block mt-0.5">
                            By: {item.updatedBy}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Exact Geolocation Preview */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  <span>GPS Incident Location</span>
                </h3>

                <MapPreview
                  latitude={currentComplaint.latitude}
                  longitude={currentComplaint.longitude}
                  address={currentComplaint.locationAddress}
                  landmark={currentComplaint.landmark}
                  issueType={currentComplaint.issueType}
                />
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};
