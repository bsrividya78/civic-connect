import React from 'react';
import { ComplaintStatus, StatusHistoryEntry } from '../types/complaint.ts';
import { Check, Clock, AlertCircle, Sparkles, UserCheck, Wrench, ShieldCheck } from 'lucide-react';

interface StatusTimelineProps {
  currentStatus: ComplaintStatus;
  history?: StatusHistoryEntry[];
}

const STEPS: { status: ComplaintStatus; label: string; desc: string; icon: React.ReactNode }[] = [
  {
    status: 'Submitted',
    label: 'Submitted',
    desc: 'Complaint received and ticket generated',
    icon: <Clock className="w-5 h-5" />,
  },
  {
    status: 'Assigned',
    label: 'Assigned',
    desc: 'Routed to nodal department officer',
    icon: <UserCheck className="w-5 h-5" />,
  },
  {
    status: 'In Progress',
    label: 'In Progress',
    desc: 'Field team or contractor on site',
    icon: <Wrench className="w-5 h-5" />,
  },
  {
    status: 'Resolved',
    label: 'Resolved',
    desc: 'Civic issue rectified and verified',
    icon: <ShieldCheck className="w-5 h-5" />,
  },
];

const ORDER: Record<ComplaintStatus, number> = {
  'Submitted': 0,
  'Assigned': 1,
  'In Progress': 2,
  'Resolved': 3,
};

export const StatusTimeline: React.FC<StatusTimelineProps> = ({ currentStatus, history = [] }) => {
  const currentIndex = ORDER[currentStatus] ?? 0;

  return (
    <div className="w-full bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-slate-900 text-base sm:text-lg flex items-center gap-2">
            <span>Visual Resolution Pipeline</span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
              currentStatus === 'Resolved'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : currentStatus === 'In Progress'
                ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                : currentStatus === 'Assigned'
                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                : 'bg-amber-100 text-amber-800 border border-amber-300'
            }`}>
              {currentStatus}
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Real-time status progression monitored by civic authorities</p>
        </div>
      </div>

      {/* Desktop Horizontal Stepper */}
      <div className="hidden md:block">
        <div className="grid grid-cols-4 gap-2 relative">
          {/* Connector bar */}
          <div className="absolute top-6 left-12 right-12 h-1 bg-slate-200 -z-0">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-500"
              style={{ width: `${(currentIndex / 3) * 100}%` }}
            />
          </div>

          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const isPending = idx > currentIndex;

            // Find matching history entry
            const historyItem = history.find((h) => h.status === step.status);

            return (
              <div key={step.status} className="flex flex-col items-center text-center relative z-10 px-2">
                {/* Circle Icon */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30'
                      : isCurrent
                      ? 'bg-teal-600 text-white ring-4 ring-teal-100 shadow-lg shadow-teal-500/40 animate-pulse'
                      : 'bg-slate-100 text-slate-400 border-2 border-slate-200'
                  }`}
                >
                  {isCompleted ? <Check className="w-6 h-6 stroke-[3]" /> : step.icon}
                </div>

                <div className="mt-3">
                  <span
                    className={`block text-sm font-bold ${
                      isCurrent
                        ? 'text-teal-900'
                        : isCompleted
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                  <p className="text-xs text-slate-500 mt-0.5 leading-snug line-clamp-2">
                    {step.desc}
                  </p>
                  {historyItem && (
                    <span className="inline-block mt-1 text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                      {new Date(historyItem.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Vertical Stepper */}
      <div className="md:hidden space-y-4">
        {STEPS.map((step, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isPending = idx > currentIndex;
          const historyItem = history.find((h) => h.status === step.status);

          return (
            <div key={step.status} className="flex items-start gap-4 relative">
              {idx < STEPS.length - 1 && (
                <div 
                  className={`absolute left-5 top-10 bottom-0 w-0.5 -ml-[1px] ${
                    isCompleted ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                  style={{ height: 'calc(100% - 10px)' }}
                />
              )}

              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold z-10 transition-colors ${
                  isCompleted
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : isCurrent
                    ? 'bg-teal-600 text-white ring-4 ring-teal-100 animate-pulse'
                    : 'bg-slate-100 text-slate-400 border border-slate-300'
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5 stroke-[2.5]" /> : step.icon}
              </div>

              <div className="flex-1 pb-4">
                <div className="flex items-center justify-between">
                  <h4 className={`text-sm font-bold ${isCurrent ? 'text-teal-900' : isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                    {step.label}
                  </h4>
                  {historyItem && (
                    <span className="text-[11px] font-mono text-slate-400">
                      {new Date(historyItem.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {step.desc}
                </p>
                {historyItem?.comment && (
                  <p className="text-xs text-slate-600 mt-1 italic bg-slate-50 p-2 rounded border border-slate-100">
                    "{historyItem.comment}"
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
