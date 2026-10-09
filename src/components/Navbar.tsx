import React, { useState } from 'react';
import { 
  Building2, 
  PlusCircle, 
  Search, 
  ShieldAlert, 
  Menu, 
  X, 
  Home, 
  Layers, 
  CheckCircle2, 
  Info,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'report' | 'track' | 'authority';
  onNavigate: (tab: 'home' | 'report' | 'track' | 'authority', complaintIdToTrack?: string) => void;
  openIssuesCount: number;
  onOpenSetupModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onNavigate,
  openIssuesCount,
  onOpenSetupModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (tab: 'home' | 'report' | 'track' | 'authority') => {
    onNavigate(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Tagline */}
          <div 
            onClick={() => handleTabClick('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-900 bg-clip-text text-transparent">
                  Civic Connect
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
                  Ward 84
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                Crowdsourced Civic Issue Reporting
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            <button
              onClick={() => handleTabClick('home')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                activeTab === 'home'
                  ? 'bg-emerald-50 text-emerald-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              onClick={() => handleTabClick('report')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                activeTab === 'report'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 font-bold'
                  : 'text-emerald-700 bg-emerald-50/70 hover:bg-emerald-100/80'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Issue</span>
            </button>

            <button
              onClick={() => handleTabClick('track')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                activeTab === 'track'
                  ? 'bg-emerald-50 text-emerald-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Track Complaint</span>
            </button>

            <button
              onClick={() => handleTabClick('authority')}
              className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                activeTab === 'authority'
                  ? 'bg-blue-50 text-blue-700 font-bold shadow-xs border border-blue-200'
                  : 'text-slate-700 hover:text-blue-700 hover:bg-blue-50/50'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-blue-600" />
              <span>Authority Dashboard</span>
              {openIssuesCount > 0 && (
                <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-bold bg-amber-500 text-white rounded-full shadow-xs">
                  {openIssuesCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right helper buttons */}
          <div className="hidden lg:flex items-center gap-2.5">
            <button
              onClick={onOpenSetupModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
              title="How to run this prototype locally"
            >
              <Info className="w-3.5 h-3.5 text-teal-600" />
              <span>Run Locally</span>
            </button>
            <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-lg border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Live API</span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden gap-2">
            <button
              onClick={onOpenSetupModal}
              className="p-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              aria-label="Info"
            >
              <Info className="w-5 h-5 text-teal-600" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg animate-in fade-in slide-in-from-top duration-150">
          <button
            onClick={() => handleTabClick('home')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
              activeTab === 'home'
                ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Home className="w-5 h-5 text-emerald-600" />
            <span>Home</span>
          </button>

          <button
            onClick={() => handleTabClick('report')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
              activeTab === 'report'
                ? 'bg-emerald-600 text-white'
                : 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100'
            }`}
          >
            <PlusCircle className="w-5 h-5" />
            <span>Report an Issue</span>
          </button>

          <button
            onClick={() => handleTabClick('track')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
              activeTab === 'track'
                ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Search className="w-5 h-5 text-emerald-600" />
            <span>Track Complaint</span>
          </button>

          <button
            onClick={() => handleTabClick('authority')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors ${
              activeTab === 'authority'
                ? 'bg-blue-50 text-blue-800 font-bold border border-blue-200'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-blue-600" />
              <span>Authority Dashboard</span>
            </div>
            {openIssuesCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold bg-amber-500 text-white rounded-full">
                {openIssuesCount}
              </span>
            )}
          </button>
        </div>
      )}
    </header>
  );
};
