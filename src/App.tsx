import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { HomePage } from './components/HomePage.tsx';
import { ReportIssuePage } from './components/ReportIssuePage.tsx';
import { TrackComplaintPage } from './components/TrackComplaintPage.tsx';
import { AuthorityDashboard } from './components/AuthorityDashboard.tsx';
import { LocalSetupModal } from './components/LocalSetupModal.tsx';
import { fetchStats } from './services/api.ts';
import { Building2, Heart, Shield, Terminal, ArrowUpRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'report' | 'track' | 'authority'>('home');
  const [trackComplaintId, setTrackComplaintId] = useState<string>('CC1024');
  const [openIssuesCount, setOpenIssuesCount] = useState<number>(0);
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);

  const refreshStats = () => {
    fetchStats()
      .then((data) => {
        setOpenIssuesCount(data.openIssues);
      })
      .catch(() => {});
  };

  useEffect(() => {
    refreshStats();
    const interval = setInterval(refreshStats, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleNavigate = (tab: 'home' | 'report' | 'track' | 'authority', idToTrack?: string) => {
    if (idToTrack) {
      setTrackComplaintId(idToTrack);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    refreshStats();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onNavigate={handleNavigate}
        openIssuesCount={openIssuesCount}
        onOpenSetupModal={() => setIsSetupModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            openIssuesCount={openIssuesCount}
          />
        )}

        {activeTab === 'report' && (
          <ReportIssuePage
            onSuccessTrack={(id) => handleNavigate('track', id)}
            onNavigateToAuthority={() => handleNavigate('authority')}
          />
        )}

        {activeTab === 'track' && (
          <TrackComplaintPage
            initialId={trackComplaintId}
            onNavigateToAuthority={() => handleNavigate('authority')}
            onNavigateToReport={() => handleNavigate('report')}
          />
        )}

        {activeTab === 'authority' && (
          <AuthorityDashboard
            onNavigateToTrack={(id) => handleNavigate('track', id)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-xs">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-slate-900 text-base">Civic Connect</span>
                <p className="text-xs text-slate-500">
                  Crowdsourced Civic Issue Reporting & Resolution System
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-600">
              <button
                onClick={() => handleNavigate('home')}
                className="hover:text-emerald-700 transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => handleNavigate('report')}
                className="hover:text-emerald-700 transition-colors"
              >
                Report Issue
              </button>
              <button
                onClick={() => handleNavigate('track')}
                className="hover:text-emerald-700 transition-colors"
              >
                Track Complaint
              </button>
              <button
                onClick={() => handleNavigate('authority')}
                className="hover:text-emerald-700 transition-colors"
              >
                Authority Dashboard
              </button>
              <button
                onClick={() => setIsSetupModalOpen(true)}
                className="text-teal-700 hover:text-teal-900 transition-colors flex items-center gap-1"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Local Setup Guide</span>
              </button>
            </div>

            <div className="text-xs text-slate-400">
              College Hackathon Prototype • Ward 84 Municipal Demonstration
            </div>

          </div>
        </div>
      </footer>

      {/* Local Setup Modal */}
      <LocalSetupModal
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
      />
    </div>
  );
}
