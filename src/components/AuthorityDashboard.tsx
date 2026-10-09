import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  UserCheck, 
  Wrench, 
  Building2, 
  ExternalLink, 
  SlidersHorizontal,
  ChevronDown,
  Layers,
  LayoutGrid,
  Table as TableIcon,
  RotateCcw,
  AlertTriangle,
  Eye,
  Check
} from 'lucide-react';
import { Complaint, ComplaintStatus, IssueType, PriorityLevel } from '../types/complaint.ts';
import { fetchAllComplaints, updateComplaintStatus, resetDemoDataset, fetchStats } from '../services/api.ts';
import { ISSUE_CONFIG } from '../constants/civic.ts';

interface AuthorityDashboardProps {
  onNavigateToTrack: (complaintId: string) => void;
}

export const AuthorityDashboard: React.FC<AuthorityDashboardProps> = ({
  onNavigateToTrack,
}) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Updating modal state
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [targetStatus, setTargetStatus] = useState<ComplaintStatus>('In Progress');
  const [officerName, setOfficerName] = useState('');
  const [updateComment, setUpdateComment] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccessMsg, setUpdateSuccessMsg] = useState<string | null>(null);

  // Photo viewer modal
  const [previewPhoto, setPreviewPhoto] = useState<{ src: string; title: string } | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAllComplaints({
        status: statusFilter,
        issueType: typeFilter,
        priority: priorityFilter,
        search: searchQuery,
      });
      setComplaints(data);
    } catch (err) {
      console.error('Error fetching complaints for authority:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter, typeFilter, priorityFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const openUpdateModal = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setTargetStatus(complaint.status);
    setOfficerName(complaint.assignedOfficer || '');
    setUpdateComment('');
    setUpdateSuccessMsg(null);
  };

  const handleSaveStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    setIsUpdating(true);
    try {
      const updated = await updateComplaintStatus(
        selectedComplaint.complaintId,
        targetStatus,
        updateComment.trim() || `Status updated to ${targetStatus} by Ward Control Room`,
        officerName.trim() || undefined
      );

      // Update in local state
      setComplaints((prev) =>
        prev.map((c) => (c.complaintId === updated.complaintId ? updated : c))
      );
      setSelectedComplaint(updated);
      setUpdateSuccessMsg(`Status successfully changed to "${targetStatus}"!`);

      setTimeout(() => {
        setSelectedComplaint(null);
        setUpdateSuccessMsg(null);
      }, 1500);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error updating complaint status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleResetData = async () => {
    if (confirm('Reset demo complaints back to initial dataset?')) {
      try {
        await resetDemoDataset();
        await loadData();
      } catch (err) {
        alert('Could not reset data');
      }
    }
  };

  // Aggregated counts
  const totalCount = complaints.length;
  const submittedCount = complaints.filter((c) => c.status === 'Submitted').length;
  const assignedCount = complaints.filter((c) => c.status === 'Assigned').length;
  const inProgressCount = complaints.filter((c) => c.status === 'In Progress').length;
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200 mb-2">
            <ShieldAlert className="w-3.5 h-3.5 text-blue-600" />
            <span>Municipal Authority Portal • Ward 84 Control Room</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Civic Grievance Dispatch Console
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Review incoming citizen reports, dispatch municipal taskforces, and update resolution milestones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-xs"
            title="Refresh list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleResetData}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors border border-slate-200"
            title="Reset sample complaints"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 mb-8">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Total Reports</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 block">
            {totalCount}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">All Ward Grievances</span>
        </div>

        <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80 shadow-xs">
          <span className="text-xs font-semibold text-amber-800 block">Submitted (New)</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-amber-900 mt-1 block">
            {submittedCount}
          </span>
          <span className="text-[11px] text-amber-700 mt-1 block">Awaiting Assignment</span>
        </div>

        <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-200/80 shadow-xs">
          <span className="text-xs font-semibold text-blue-800 block">Assigned</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-blue-900 mt-1 block">
            {assignedCount}
          </span>
          <span className="text-[11px] text-blue-700 mt-1 block">Work Order Issued</span>
        </div>

        <div className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-200/80 shadow-xs">
          <span className="text-xs font-semibold text-indigo-800 block">In Progress</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-indigo-900 mt-1 block">
            {inProgressCount}
          </span>
          <span className="text-[11px] text-indigo-700 mt-1 block">Crew On Ground</span>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200/80 shadow-xs">
          <span className="text-xs font-semibold text-emerald-800 block">Resolved</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-900 mt-1 block">
            {resolvedCount}
          </span>
          <span className="text-[11px] text-emerald-700 mt-1 block">
            {totalCount > 0 ? `${Math.round((resolvedCount / totalCount) * 100)}% Closed` : '0%'}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search box */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by ID (e.g. CC1024), street name, or description..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
            />
          </form>

          {/* Quick status filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {['All', 'Submitted', 'Assigned', 'In Progress', 'Resolved'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* View switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start md:self-auto">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'cards' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Secondary filters: Category & Priority */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500">Category:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-800"
            >
              <option value="All">All Categories</option>
              <option value="Pothole">Pothole</option>
              <option value="Garbage">Garbage</option>
              <option value="Drainage">Drainage</option>
              <option value="Streetlight">Streetlight</option>
              <option value="Sanitation">Sanitation</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-800"
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="ml-auto text-slate-400">
            Showing <span className="font-bold text-slate-700">{complaints.length}</span> complaints
          </div>
        </div>
      </div>

      {/* Empty State */}
      {complaints.length === 0 && !loading && (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">No Complaints Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No complaints match your active filter criteria. Try resetting filters or clicking Reset Demo Data.
          </p>
          <button
            onClick={() => {
              setStatusFilter('All');
              setTypeFilter('All');
              setPriorityFilter('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Cards View */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {complaints.map((item) => (
            <div
              key={item.complaintId}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden group"
            >
              {/* Photo & Badge header */}
              <div className="relative h-44 bg-slate-100 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.issueType}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${
                    item.status === 'Resolved'
                      ? 'bg-emerald-600 text-white'
                      : item.status === 'In Progress'
                      ? 'bg-indigo-600 text-white'
                      : item.status === 'Assigned'
                      ? 'bg-blue-600 text-white'
                      : 'bg-amber-600 text-white'
                  }`}>
                    {item.status}
                  </span>
                </div>

                {/* Priority Badge */}
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold shadow-sm ${
                    item.priority === 'High'
                      ? 'bg-red-500 text-white'
                      : item.priority === 'Medium'
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-600 text-white'
                  }`}>
                    {item.priority}
                  </span>
                </div>

                {/* Zoom photo button */}
                <button
                  onClick={() => setPreviewPhoto({ src: item.image, title: `${item.complaintId} - ${item.issueType}` })}
                  className="absolute bottom-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 rounded-lg text-white transition-colors"
                  title="Expand photo"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Content body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      {item.complaintId}
                    </span>
                    <span>
                      {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-1.5">
                    <span>{item.issueType}</span>
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Location & Department */}
                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-start gap-1.5 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="truncate">
                      {item.locationAddress || `Lat: ${item.latitude.toFixed(4)}, Lon: ${item.longitude.toFixed(4)}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="truncate font-medium text-slate-800">
                      {item.department}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => openUpdateModal(item)}
                    className="flex-1 py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Update Status</span>
                  </button>

                  <button
                    onClick={() => onNavigateToTrack(item.complaintId)}
                    className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
                    title="View citizen tracking timeline"
                  >
                    <span>Track</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Complaint ID</th>
                  <th className="py-3 px-4">Photo</th>
                  <th className="py-3 px-4">Issue Type</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {complaints.map((item) => (
                  <tr key={item.complaintId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {item.complaintId}
                    </td>
                    <td className="py-3.5 px-4">
                      <img
                        src={item.image}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200 cursor-pointer hover:opacity-80"
                        onClick={() => setPreviewPhoto({ src: item.image, title: item.complaintId })}
                      />
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-800 block">{item.issueType}</span>
                      <span className="text-[11px] text-slate-400 block truncate max-w-[150px]">{item.department}</span>
                    </td>
                    <td className="py-3.5 px-4 max-w-[200px]">
                      <span className="truncate block font-medium text-slate-700">{item.locationAddress}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        item.priority === 'High' ? 'bg-red-100 text-red-700' : item.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {item.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        item.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'In Progress'
                          ? 'bg-indigo-100 text-indigo-800'
                          : item.status === 'Assigned'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openUpdateModal(item)}
                          className="px-2.5 py-1 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 text-xs"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => onNavigateToTrack(item.complaintId)}
                          className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                          title="Track as citizen"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                  Municipal Action Workflow
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
                  Update Ticket: {selectedComplaint.complaintId}
                </h3>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {updateSuccessMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{updateSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveStatus} className="space-y-4">
              {/* Target Status Selection */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Select New Resolution Status *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Submitted', 'Assigned', 'In Progress', 'Resolved'] as ComplaintStatus[]).map((st) => (
                    <button
                      type="button"
                      key={st}
                      onClick={() => setTargetStatus(st)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all text-left flex items-center justify-between ${
                        targetStatus === st
                          ? 'bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-500/20'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>{st}</span>
                      {targetStatus === st && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Assign Officer / Field Crew */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Assignee / Duty Officer
                </label>
                <input
                  type="text"
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  placeholder="e.g. Officer M. Kulkarni / Rapid Response Team"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              {/* Official Action Comments */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Field Action Notes / Citizen Remark
                </label>
                <textarea
                  rows={3}
                  value={updateComment}
                  onChange={(e) => setUpdateComment(e.target.value)}
                  placeholder="e.g. Jetting machine deployed to clear silt and debris. Pothole filled with cold asphalt mix..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
                <span className="text-[11px] text-slate-400 block mt-1">
                  This note will appear immediately in the Citizen Tracking pipeline timeline!
                </span>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedComplaint(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/30 flex items-center gap-2"
                >
                  {isUpdating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>Save Status Change</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Photo Preview Modal */}
      {previewPhoto && (
        <div 
          onClick={() => setPreviewPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in"
        >
          <div className="relative max-w-2xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl p-2">
            <img src={previewPhoto.src} alt="" className="w-full h-auto max-h-[80vh] object-contain rounded-xl" />
            <div className="p-3 text-white text-xs flex justify-between items-center">
              <span className="font-bold">{previewPhoto.title}</span>
              <button onClick={() => setPreviewPhoto(null)} className="text-slate-400 hover:text-white">Close ✕</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
