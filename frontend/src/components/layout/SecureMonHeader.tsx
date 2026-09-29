import React from 'react';
import { useAegis } from '../../context/AegisContext';
import {
  Menu,
  Search,
  Bell,
  ShieldCheck,
  ChevronRight,
  Sun,
  Moon,
  Play,
  RotateCw,
  Terminal,
  Activity,
  LogOut,
} from 'lucide-react';

interface SecureMonHeaderProps {
  onToggleSidebar?: () => void;
}

export const SecureMonHeader: React.FC<SecureMonHeaderProps> = ({ onToggleSidebar }) => {
  const {
    setCommandPaletteOpen,
    currentAssessment,
    findings,
    setActiveView,
    theme,
    toggleTheme,
    isAssessing,
    startAssessmentRun,
    logout,
  } = useAegis();

  const urgentAlertsCount = findings.filter((f) => f.severity === 'CRITICAL' || f.severity === 'HIGH').length;

  return (
    <header className="h-14 bg-topbar border-b border-line sticky top-0 z-30 px-5 flex items-center justify-between gap-4 select-none transition-colors backdrop-blur-md">
      {/* Left: Hamburger & Hierarchical Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-subtle transition-colors"
          title="Toggle Navigation"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <span
            onClick={() => setActiveView('dashboard')}
            className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer font-medium"
          >
            SecOps
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0" />
          <span className="text-slate-900 dark:text-slate-100 font-semibold truncate max-w-[200px] sm:max-w-[280px]">
            {currentAssessment?.name || 'World Monitor Platform'}
          </span>
          <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-line ml-1">
            {currentAssessment?.target?.envType || 'DOCKER SANDBOX'}
          </span>
        </div>
      </div>

      {/* Right: Search, Quick Action, Live Indicator, Theme, Bell, Avatar */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Global Search Button */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="hidden sm:flex items-center justify-between gap-3 w-56 md:w-72 px-3 py-1.5 rounded-lg bg-subtle hover:bg-slate-200/60 dark:hover:bg-slate-800/80 border border-line text-xs text-slate-500 dark:text-slate-400 transition-all text-left shadow-2xs group"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors shrink-0" />
            <span className="truncate text-[11px]">Search CVEs, assets, CWE-306...</span>
          </div>
          <kbd className="px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-card text-slate-500 dark:text-slate-400 border border-line shrink-0 shadow-2xs">
            ⌘K
          </kbd>
        </button>

        {/* Live Status Pill */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold tracking-tight">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isAssessing ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isAssessing ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
          </span>
          <span className="text-[10px] tracking-wider uppercase font-extrabold">
            {isAssessing ? 'SCAN RUNNING' : 'EGRESS LOCKED'}
          </span>
        </div>

        {/* Quick Run Assessment Button */}
        <button
          onClick={() => {
            if (!isAssessing) startAssessmentRun();
            setActiveView('running');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 active:scale-95 text-white font-semibold text-xs transition-all shadow-xs"
        >
          <Play className="w-3 h-3 fill-current" />
          <span className="hidden sm:inline">{isAssessing ? 'Live Telemetry' : 'Run Scan'}</span>
        </button>

        <div className="h-5 w-[1px] bg-line mx-0.5" />

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-subtle transition-colors cursor-pointer"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setActiveView('findings')}
            className="p-1.5 rounded-lg hover:bg-subtle text-slate-600 dark:text-slate-300 transition-colors relative"
            title={`${urgentAlertsCount} Urgent Vulnerabilities`}
          >
            <Bell className="w-4 h-4" />
            {urgentAlertsCount > 0 && (
              <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-rose-600 text-[9px] font-black text-white flex items-center justify-center border-2 border-topbar">
                {urgentAlertsCount}
              </span>
            )}
          </button>
        </div>

        {/* Analyst Monogram Avatar & Lock Session */}
        <div className="flex items-center gap-1.5 pl-1">
          <div
            onClick={() => setActiveView('audit')}
            className="w-7 h-7 rounded-lg bg-slate-900 dark:bg-teal-900/60 text-teal-300 font-mono font-bold text-[11px] flex items-center justify-center border border-slate-700 hover:ring-2 hover:ring-teal-500 transition-all shadow-xs cursor-pointer"
            title="Security Analyst Session · NTRO"
          >
            AS
          </div>
          <button
            onClick={logout}
            className="p-1.5 rounded-lg hover:bg-subtle text-slate-400 hover:text-rose-600 transition-colors"
            title="Lock Session (Sign Out to 3D Gateway)"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};

