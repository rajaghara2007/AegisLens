import React from 'react';
import { useAegis, ViewType } from '../../context/AegisContext';
import {
  Shield,
  LayoutDashboard,
  ClipboardList,
  Boxes,
  AlertTriangle,
  FolderLock,
  Flame,
  Wrench,
  RotateCcw,
  BarChart3,
  Sparkles,
  ScrollText,
  Settings,
  Radio,
  Lock,
} from 'lucide-react';

interface SecureMonSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const SecureMonSidebar: React.FC<SecureMonSidebarProps> = ({ isOpen = true }) => {
  const { activeView, setActiveView, findings, isAssessing, currentAssessment } = useAegis();

  const urgentCount = findings.filter((f) => f.severity === 'CRITICAL' || f.severity === 'HIGH').length;
  const retestCount = findings.filter((f) => f.status === 'RETEST_PENDING' || f.status === 'FIX_APPLIED').length;

  interface NavItem {
    id: ViewType;
    label: string;
    icon: React.ReactNode;
    badge?: React.ReactNode;
  }

  interface NavGroup {
    title: string;
    items: NavItem[];
  }

  const navGroups: NavGroup[] = [
    {
      title: 'COMMAND & OVERVIEW',
      items: [
        {
          id: 'overview',
          label: 'Command Center',
          icon: <LayoutDashboard className="w-4 h-4" />,
        },
        {
          id: 'running',
          label: 'Assessments',
          icon: <ClipboardList className="w-4 h-4" />,
          badge: isAssessing ? (
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              LIVE
            </span>
          ) : undefined,
        },
        {
          id: 'assets',
          label: 'Asset Inventory',
          icon: <Boxes className="w-4 h-4" />,
        },
        {
          id: 'findings',
          label: 'Findings & Vulns',
          icon: <AlertTriangle className="w-4 h-4" />,
          badge: urgentCount > 0 ? (
            <span className="px-1.5 py-0.5 rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 text-[10px] font-bold border border-rose-200 dark:border-rose-900/60">
              {urgentCount} crit
            </span>
          ) : undefined,
        },
      ],
    },
    {
      title: 'SECURITY OPERATIONS',
      items: [
        { id: 'scope', label: 'Evidence & Scope', icon: <FolderLock className="w-4 h-4" /> },
        { id: 'risk', label: 'Risk Intelligence', icon: <Flame className="w-4 h-4" /> },
        { id: 'remediation', label: 'Remediation', icon: <Wrench className="w-4 h-4" /> },
        {
          id: 'retest',
          label: 'Retesting Center',
          icon: <RotateCcw className="w-4 h-4" />,
          badge: retestCount > 0 ? (
            <span className="px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 text-[10px] font-bold border border-amber-200">
              {retestCount}
            </span>
          ) : undefined,
        },
      ],
    },
    {
      title: 'INTELLIGENCE & AUDIT',
      items: [
        { id: 'reports', label: 'Reports & Compliance', icon: <BarChart3 className="w-4 h-4" /> },
        {
          id: 'ai',
          label: 'AI Security Assistant',
          icon: <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />,
          badge: (
            <span className="px-1.5 py-0.2 rounded bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 text-[9px] font-bold tracking-wider border border-cyan-200 dark:border-cyan-800">
              GEN-AI
            </span>
          ),
        },
        { id: 'audit', label: 'Audit Logs (SHA-256)', icon: <ScrollText className="w-4 h-4" /> },
      ],
    },
    {
      title: 'CONFIGURATION',
      items: [
        { id: 'settings', label: 'Guardrails & Settings', icon: <Settings className="w-4 h-4" /> },
      ],
    },
  ];

  return (
    <aside
      className={`w-64 bg-sidebar border-r border-line flex flex-col shrink-0 min-h-screen select-none transition-all duration-200 z-40 ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      {/* Brand Header */}
      <div className="px-5 py-4 border-b border-line flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-700 via-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-sm shadow-teal-700/20 border border-teal-600/30">
              <Shield className="w-5 h-5 stroke-[2.3]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black tracking-tight text-slate-900 dark:text-slate-100">
                  AEGIS<span className="text-teal-600 dark:text-teal-400">LENS</span>
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold tracking-wider uppercase bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/60">
                  ENTERPRISE
                </span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                Vulnerability Intelligence
              </span>
            </div>
          </div>
        </div>

        {/* Live Sentinel status pill */}
        <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-subtle border border-line text-[10px]">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium truncate">
            <Radio className="w-3 h-3 text-emerald-500 animate-pulse shrink-0" />
            <span className="truncate">Target: {currentAssessment?.target?.baseUrl?.replace('http://', '') || '127.0.0.1:3000'}</span>
          </div>
          <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider shrink-0">
            LOCKED
          </span>
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 py-3 px-3 space-y-5 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-0.5">
            <div className="px-3 pb-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider">
              {group.title}
            </div>
            {group.items.map((item) => {
              const isActive =
                activeView === item.id ||
                (item.id === 'overview' && activeView === 'dashboard');

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full group relative flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all duration-150 ${
                    isActive
                      ? 'bg-teal-50/80 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 font-semibold shadow-2xs border border-teal-600/15'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-subtle font-medium border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Active left indicator bar */}
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-teal-600 rounded-r-full" />
                    )}
                    <span
                      className={`transition-colors shrink-0 ${
                        isActive
                          ? 'text-teal-700 dark:text-teal-400'
                          : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && <div className="shrink-0">{item.badge}</div>}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Profile & Environment Verification Status */}
      <div className="p-3 border-t border-line bg-subtle/80 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-teal-300 font-mono font-bold text-xs flex items-center justify-center border border-slate-700 shadow-2xs">
              SEC
            </div>
            <div className="flex flex-col text-[11px] leading-tight">
              <span className="font-bold text-slate-800 dark:text-slate-200">Security Analyst</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">NTRO · Air-Gapped Session</span>
            </div>
          </div>
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">
            <Lock className="w-2.5 h-2.5" />
            <span>RFC1918</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

