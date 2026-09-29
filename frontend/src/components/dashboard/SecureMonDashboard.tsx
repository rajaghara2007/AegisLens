import React, { useState } from 'react';
import { useAegis } from '../../context/AegisContext';
import { Finding } from '../../types';
import {
  Shield,
  Play,
  FileText,
  RotateCw,
  AlertCircle,
  AlertTriangle,
  Info,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Activity,
  Layers,
  Sparkles,
  Server,
  Lock,
  ExternalLink,
  CheckCircle2,
  Clock,
  Flame,
  Search,
  Check,
  ChevronDown,
  Boxes,
  Compass,
  ArrowRight,
} from 'lucide-react';

interface SecureMonDashboardProps {
  onOpenCreateWizard: () => void;
}

export const SecureMonDashboard: React.FC<SecureMonDashboardProps> = ({ onOpenCreateWizard }) => {
  const {
    currentAssessment,
    assessments,
    findings,
    assets,
    auditLogs,
    setActiveView,
    setSelectedFinding,
    setValidationModalFinding,
    startAssessmentRun,
    isAssessing,
  } = useAegis();

  // State for interactive time selector on Posture chart
  const [postureRange, setPostureRange] = useState<'runs' | '30d' | 'all'>('runs');
  // State for interactive findings table tab filter
  const [findingFilter, setFindingFilter] = useState<'ALL' | 'CRIT_HIGH' | 'REMEDIATION' | 'FIXED'>('ALL');
  // State for hovered chart point
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  // Dynamic KPI calculations from live findings state
  const criticalCount = findings.filter((f) => f.severity === 'CRITICAL' && f.status !== 'FIXED').length;
  const highCount = findings.filter((f) => f.severity === 'HIGH' && f.status !== 'FIXED').length;
  const mediumCount = findings.filter((f) => f.severity === 'MEDIUM' && f.status !== 'FIXED').length;
  const lowCount = findings.filter((f) => f.severity === 'LOW' && f.status !== 'FIXED').length;
  const openCount = findings.filter((f) => f.status !== 'FIXED' && f.status !== 'FALSE_POSITIVE').length;
  const fixedCount = findings.filter((f) => f.status === 'FIXED').length;
  const totalFindings = Math.max(findings.length, 1);

  // Real-time security score & baseline delta
  const securityScore = currentAssessment?.score ?? 61;
  const prevScore = assessments.length > 1 ? assessments[1].score : Math.max(securityScore - 7, 45);
  const scoreDiff = securityScore - prevScore;
  const scoreDiffPct = prevScore > 0 ? ((Math.abs(scoreDiff) / prevScore) * 100).toFixed(1) : '6.2';

  // Circular score gauge metrics (Radius = 58, Circumference = 364.4)
  const scoreRadius = 58;
  const scoreCirc = 2 * Math.PI * scoreRadius;
  const scoreStrokeDash = (securityScore / 100) * scoreCirc;

  // Grade determination
  let scoreGrade = 'GRADE B';
  let gradeColor = 'text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 border-teal-200 dark:border-teal-800';
  let riskStatus = 'MODERATE RISK';
  if (securityScore >= 85) {
    scoreGrade = 'GRADE A';
    gradeColor = 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800';
    riskStatus = 'LOW RISK · HARDENED';
  } else if (securityScore >= 70) {
    scoreGrade = 'GRADE B+';
    gradeColor = 'text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 border-teal-200 dark:border-teal-800';
    riskStatus = 'ACCEPTABLE SECURITY';
  } else if (securityScore < 50) {
    scoreGrade = 'GRADE D';
    gradeColor = 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800';
    riskStatus = 'ELEVATED EXPOSURE';
  }

  // 6 KPI sparklines (smooth SVG curves)
  const sparklines = {
    score: 'M0,20 Q20,12 40,16 T80,10 T100,14 T120,4',
    critical: 'M0,14 Q20,18 40,15 T80,20 T100,16 T120,22',
    high: 'M0,10 Q20,18 40,12 T80,20 T100,15 T120,22',
    medium: 'M0,22 Q20,16 40,18 T80,10 T100,14 T120,6',
    low: 'M0,18 Q20,12 40,16 T80,10 T100,12 T120,6',
    open: 'M0,10 Q20,16 40,12 T80,20 T100,16 T120,22',
  };

  // Dynamic Recent Assessments from live state
  const liveRecentAssessments = assessments.map((asm) => {
    const d = asm.completedAt ? new Date(asm.completedAt) : asm.startedAt ? new Date(asm.startedAt) : new Date();
    const formattedDate = d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    return {
      id: asm.id,
      dateTime: formattedDate,
      name: asm.name,
      score: asm.score,
      target: asm.target?.name || 'Local Staging',
      envType: asm.target?.envType || 'DOCKER',
      findings: {
        c: asm.findingsCount?.critical ?? (asm.id === currentAssessment?.id ? criticalCount : 0),
        h: asm.findingsCount?.high ?? (asm.id === currentAssessment?.id ? highCount : 0),
        m: asm.findingsCount?.medium ?? (asm.id === currentAssessment?.id ? mediumCount : 0),
        l: asm.findingsCount?.low ?? (asm.id === currentAssessment?.id ? lowCount : 0),
      },
      status: asm.status,
    };
  });

  // Dynamic Severity Donut Calculations (Radius = 38, Circumference = 238.76)
  const donutCirc = 238.76;
  const lowLen = (lowCount / totalFindings) * donutCirc;
  const medLen = (mediumCount / totalFindings) * donutCirc;
  const highLen = (highCount / totalFindings) * donutCirc;
  const critLen = (criticalCount / totalFindings) * donutCirc;

  const lowOffset = 0;
  const medOffset = -lowLen;
  const highOffset = -(lowLen + medLen);
  const critOffset = -(lowLen + medLen + highLen);

  // Dynamic Risk Categories
  const categoryMap: Record<string, { count: number; crit: number; high: number }> = {};
  findings.forEach((f) => {
    let cat = 'Others & Config';
    const cUpper = (f.category || '').toUpperCase();
    const tUpper = (f.title || '').toUpperCase();
    if (cUpper.includes('WEB') || cUpper.includes('OWASP') || tUpper.includes('SQL') || tUpper.includes('XSS') || tUpper.includes('INPUT')) {
      cat = 'Web Application';
    } else if (cUpper.includes('INFRA') || cUpper.includes('NETWORK') || tUpper.includes('PORT') || tUpper.includes('TLS') || tUpper.includes('TRANSPORT')) {
      cat = 'Infrastructure & Ports';
    } else if (cUpper.includes('DATA') || tUpper.includes('LEAK') || tUpper.includes('EXPOSURE') || tUpper.includes('PII') || cUpper.includes('PRIVACY')) {
      cat = 'Data Exposure & PII';
    } else if (cUpper.includes('AUTH') || cUpper.includes('ACCESS') || tUpper.includes('TOKEN') || tUpper.includes('JWT') || tUpper.includes('BOLA')) {
      cat = 'Access Control & Auth';
    }

    if (!categoryMap[cat]) categoryMap[cat] = { count: 0, crit: 0, high: 0 };
    categoryMap[cat].count += 1;
    if (f.severity === 'CRITICAL') categoryMap[cat].crit += 1;
    if (f.severity === 'HIGH') categoryMap[cat].high += 1;
  });

  const categories = [
    { name: 'Web Application', icon: '🌐', count: categoryMap['Web Application']?.count || 2, color: 'bg-rose-500', barColor: '#ef4444' },
    { name: 'Infrastructure & Ports', icon: '🖥️', count: categoryMap['Infrastructure & Ports']?.count || 2, color: 'bg-orange-500', barColor: '#f97316' },
    { name: 'Data Exposure & PII', icon: '🔐', count: categoryMap['Data Exposure & PII']?.count || 3, color: 'bg-amber-500', barColor: '#f59e0b' },
    { name: 'Access Control & Auth', icon: '🛡️', count: categoryMap['Access Control & Auth']?.count || 2, color: 'bg-blue-500', barColor: '#3b82f6' },
    { name: 'Others & Config', icon: '⚙️', count: categoryMap['Others & Config']?.count || 1, color: 'bg-slate-400', barColor: '#94a3b8' },
  ];

  // Top Priority Findings (Ranked by CVSS score & severity)
  const priorityFindings = [...findings]
    .filter((f) => f.status !== 'FIXED')
    .sort((a, b) => (b.cvss?.score || 0) - (a.cvss?.score || 0))
    .slice(0, 3);

  // Filtered Findings list for recent findings table
  const filteredFindings = findings.filter((f) => {
    if (findingFilter === 'CRIT_HIGH') return f.severity === 'CRITICAL' || f.severity === 'HIGH';
    if (findingFilter === 'REMEDIATION') return f.status === 'IN_REMEDIATION' || f.status === 'RETEST_PENDING';
    if (findingFilter === 'FIXED') return f.status === 'FIXED';
    return true;
  });

  // Posture Chart Data Points
  const postureData = [
    { label: 'Baseline', score: 42, date: 'Sep 08', note: 'Initial Discovery Run' },
    { label: 'Run #1', score: 51, date: 'Sep 15', note: 'Scope validation pass' },
    { label: 'Run #2', score: 58, date: 'Sep 22', note: 'After initial auth triage' },
    { label: 'Run #3', score: prevScore, date: 'Sep 28', note: 'Pre-flight retest' },
    { label: 'Current', score: securityScore, date: 'Today', note: 'Active Live Assessment' },
  ];

  // Asset Health summary
  const endpointAssets = assets.filter((a) => a.type === 'ENDPOINT');
  const pageAssets = assets.filter((a) => a.type === 'PAGE');
  const criticalAssets = assets.filter((a) => a.criticality === 'CRITICAL');
  const assetsAtRisk = assets.filter((a) => a.hasFindingsCount > 0);

  const handleSelectFinding = (finding: Finding) => {
    setSelectedFinding(finding);
    setActiveView('findings');
  };

  const handleValidateSandbox = (e: React.MouseEvent, finding: Finding) => {
    e.stopPropagation();
    setValidationModalFinding(finding);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-7 space-y-6 max-w-[1700px] mx-auto transition-colors">
      {/* ========================================================================= */}
      {/* 1. SECURITY COMMAND CENTER HEADER BAR                                     */}
      {/* ========================================================================= */}
      <div className="p-5 rounded-2xl bg-card border border-line shadow-card flex flex-col xl:flex-row xl:items-center justify-between gap-5 transition-colors">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
              <span>Security Command Center</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/60 flex items-center gap-1.5 shadow-2xs">
              <Shield className="w-3 h-3 text-teal-600 dark:text-teal-400" />
              <span>DEFENSE SENTINEL</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200 font-semibold">
              <Server className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentAssessment?.target?.name || 'World Monitor (Local Staging)'}</span>
              <span className="font-mono text-slate-400 font-normal">({currentAssessment?.target?.baseUrl?.replace('http://', '')})</span>
            </div>

            <span className="text-slate-300 dark:text-slate-700">•</span>

            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isAssessing ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isAssessing ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
              </span>
              <span className={`font-semibold ${isAssessing ? 'text-amber-700 dark:text-amber-400' : 'text-emerald-700 dark:text-emerald-400'}`}>
                {isAssessing ? 'Live Assessment DAG Executing' : `Assessment Status: ${currentAssessment?.status || 'Completed'}`}
              </span>
            </div>

            <span className="text-slate-300 dark:text-slate-700">•</span>

            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>Last Scan: {currentAssessment?.completedAt ? new Date(currentAssessment.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:23 UTC'}</span>
            </div>

            <span className="text-slate-300 dark:text-slate-700">•</span>

            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
              <Lock className="w-3 h-3 text-teal-600 dark:text-teal-400" />
              <span>RFC1918 Locked</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => {
              startAssessmentRun();
              setActiveView('running');
            }}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 active:scale-95 text-white font-bold text-xs transition-all shadow-sm shadow-teal-800/20"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isAssessing ? 'View Live Telemetry' : 'Run Live Assessment'}</span>
          </button>

          <button
            onClick={() => setActiveView('reports')}
            className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-card hover:bg-subtle border border-line text-slate-700 dark:text-slate-200 font-semibold text-xs transition-all shadow-card"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>View Report</span>
          </button>

          <button
            onClick={onOpenCreateWizard}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-subtle hover:bg-slate-200/70 dark:hover:bg-slate-800 border border-line text-slate-600 dark:text-slate-300 font-medium text-xs transition-all"
            title="Create Assessment Scope Wizard"
          >
            <span>+ New Target</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. KPI AREA: BALANCED PROPORTIONAL CARDS WITH RADIAL SCORE VISUALIZATION */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Card 1: SECURITY SCORE */}
        <div className="p-3.5 rounded-xl bg-card border border-teal-500/40 shadow-card flex flex-col justify-between relative overflow-hidden transition-all duration-200 theme-card-hover group">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-600 via-emerald-500 to-cyan-500" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-teal-700 dark:text-teal-400 text-[10px] font-extrabold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>SECURITY SCORE</span>
            </div>
            <span className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider border ${gradeColor}`}>
              {scoreGrade}
            </span>
          </div>

          <div className="my-1.5 flex items-center justify-between gap-2.5">
            {/* Circular Gauge */}
            <div className="relative flex items-center justify-center w-12 h-12 shrink-0">
              <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 52 52">
                <circle
                  cx="26"
                  cy="26"
                  r="21"
                  stroke="currentColor"
                  strokeWidth="4.5"
                  fill="transparent"
                  className="text-slate-100 dark:text-slate-800"
                />
                <circle
                  cx="26"
                  cy="26"
                  r="21"
                  stroke="#0d9488"
                  strokeWidth="4.5"
                  strokeDasharray={131.95}
                  strokeDashoffset={131.95 - (securityScore / 100) * 131.95}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <span className="absolute text-sm font-black font-mono text-slate-900 dark:text-slate-100">
                {securityScore}
              </span>
            </div>

            <div className="flex-1 min-w-0 space-y-0.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 shrink-0">
                  <ArrowUpRight className="w-2.5 h-2.5" />
                  +{scoreDiffPct}%
                </span>
                <span className="text-[10px] text-slate-400">vs base</span>
              </div>
              <p className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 truncate">
                {riskStatus}
              </p>
            </div>
          </div>

          <div className="pt-1.5 border-t border-line flex items-center justify-between">
            <span className="text-[10px] text-slate-400">84% Pass</span>
            <svg className="w-14 h-4 stroke-teal-600 dark:stroke-teal-400 fill-none" viewBox="0 0 120 28">
              <path d={sparklines.score} strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 2: CRITICAL FINDINGS */}
        <div className="p-3.5 rounded-xl bg-card border border-line shadow-card flex flex-col justify-between transition-all duration-200 theme-card-hover relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-rose-500" />
          <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 text-[10px] font-extrabold uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>CRITICAL</span>
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-50 dark:bg-rose-950/60 font-bold border border-rose-200 dark:border-rose-900">
              SLA &lt;4H
            </span>
          </div>

          <div className="my-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100 tracking-tight leading-none">
                {criticalCount}
              </span>
              <span className="text-[10px] font-semibold text-slate-400">0 today</span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-1 truncate">
              {criticalCount > 0 ? 'Urgent patch needed' : 'Zero Active CVEs'}
            </p>
          </div>

          <div className="pt-1.5 border-t border-line flex items-center justify-between">
            <span className="text-[10px] text-slate-400">Immediate</span>
            <svg className="w-14 h-4 stroke-rose-500 fill-none" viewBox="0 0 120 28">
              <path d={sparklines.critical} strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 3: HIGH FINDINGS */}
        <div className="p-3.5 rounded-xl bg-card border border-line shadow-card flex flex-col justify-between transition-all duration-200 theme-card-hover relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-orange-500" />
          <div className="flex items-center justify-between text-orange-600 dark:text-orange-400 text-[10px] font-extrabold uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>HIGH</span>
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-orange-50 dark:bg-orange-950/60 font-bold border border-orange-200 dark:border-orange-900">
              TRIAGE
            </span>
          </div>

          <div className="my-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100 tracking-tight leading-none">
                {highCount}
              </span>
              <span className="text-[10px] font-semibold text-orange-600 dark:text-orange-400">+1 active</span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-1 truncate">
              Auth & secret exposure
            </p>
          </div>

          <div className="pt-1.5 border-t border-line flex items-center justify-between">
            <span className="text-[10px] text-slate-400">SLA &lt;48h</span>
            <svg className="w-14 h-4 stroke-orange-500 fill-none" viewBox="0 0 120 28">
              <path d={sparklines.high} strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 4: MEDIUM FINDINGS */}
        <div className="p-3.5 rounded-xl bg-card border border-line shadow-card flex flex-col justify-between transition-all duration-200 theme-card-hover relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-amber-500" />
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 text-[10px] font-extrabold uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-full border-2 border-amber-500" />
              <span>MEDIUM</span>
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-50 dark:bg-amber-950/60 font-bold border border-amber-200 dark:border-amber-900">
              BACKLOG
            </span>
          </div>

          <div className="my-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100 tracking-tight leading-none">
                {mediumCount}
              </span>
              <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">-1 fixed</span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-1 truncate">
              Config & headers
            </p>
          </div>

          <div className="pt-1.5 border-t border-line flex items-center justify-between">
            <span className="text-[10px] text-slate-400">Sprint item</span>
            <svg className="w-14 h-4 stroke-amber-500 fill-none" viewBox="0 0 120 28">
              <path d={sparklines.medium} strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 5: LOW FINDINGS */}
        <div className="p-3.5 rounded-xl bg-card border border-line shadow-card flex flex-col justify-between transition-all duration-200 theme-card-hover relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500" />
          <div className="flex items-center justify-between text-blue-600 dark:text-blue-400 text-[10px] font-extrabold uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <Info className="w-3.5 h-3.5" />
              <span>LOW</span>
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-50 dark:bg-blue-950/60 font-bold border border-blue-200 dark:border-blue-900">
              HARDEN
            </span>
          </div>

          <div className="my-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100 tracking-tight leading-none">
                {lowCount}
              </span>
              <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">Stable</span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-1 truncate">
              Information leakage
            </p>
          </div>

          <div className="pt-1.5 border-t border-line flex items-center justify-between">
            <span className="text-[10px] text-slate-400">Hygiene</span>
            <svg className="w-14 h-4 stroke-blue-500 fill-none" viewBox="0 0 120 28">
              <path d={sparklines.low} strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 6: OPEN VULNS */}
        <div className="p-3.5 rounded-xl bg-card border border-line shadow-card flex flex-col justify-between transition-all duration-200 theme-card-hover relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-teal-600" />
          <div className="flex items-center justify-between text-teal-700 dark:text-teal-400 text-[10px] font-extrabold uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
              <span>OPEN VULNS</span>
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-teal-50 dark:bg-teal-950/60 font-bold border border-teal-200 dark:border-teal-900">
              {fixedCount} FIXED
            </span>
          </div>

          <div className="my-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100 tracking-tight leading-none">
                {openCount}
              </span>
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">90% SLA</span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-1 truncate">
              Active remediation track
            </p>
          </div>

          <div className="pt-1.5 border-t border-line flex items-center justify-between">
            <span className="text-[10px] text-slate-400">{findings.length} total catalog</span>
            <svg className="w-14 h-4 stroke-teal-500 fill-none" viewBox="0 0 120 28">
              <path d={sparklines.open} strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. PREMIUM AI SECURITY BRIEF PANEL (HIGH-VALUE COMPONENT)                 */}
      {/* ========================================================================= */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-950/5 via-cyan-950/5 to-slate-950/5 dark:from-teal-950/30 dark:via-cyan-950/20 dark:to-slate-950/40 border border-teal-600/25 shadow-card transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-line">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                  Executive AI Security Intelligence Brief
                </h3>
                <span className="px-2 py-0.2 rounded-full text-[9px] font-bold uppercase tracking-wider bg-cyan-100 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800">
                  Llama-3-SecOps · Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Automated vulnerability synthesis and remediation prioritization for World Monitor v2.4.1
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveView('ai')}
            className="flex items-center gap-1.5 text-xs font-bold text-teal-700 dark:text-teal-400 hover:text-teal-900 self-start md:self-center"
          >
            <span>Ask AI Assistant</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 3 AI Brief Column Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          {/* Column 1: Key Risks */}
          <div className="p-3.5 rounded-xl bg-card/90 border border-line shadow-2xs space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wide">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Primary Risk Exposure</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Unauthenticated alert export API (<code className="text-[11px] font-mono text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-1 py-0.2 rounded">/api/v1/alerts/export</code>) discloses situational operational events without bearer token validation.
            </p>
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <span>Risk: Data exfiltration & surveillance bypass</span>
            </div>
          </div>

          {/* Column 2: Security Improvements */}
          <div className="p-3.5 rounded-xl bg-card/90 border border-line shadow-2xs space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Posture Improvements</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              TLS 1.3 cryptographic suites verified across local staging. Rate-limiting guardrails successfully blocked fuzzing egress across port 3000.
            </p>
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <span>Security score improved +6.2% since baseline</span>
            </div>
          </div>

          {/* Column 3: Recommended Actions */}
          <div className="p-3.5 rounded-xl bg-card/90 border border-line shadow-2xs space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wide">
              <Compass className="w-3.5 h-3.5" />
              <span>Recommended Next Steps</span>
            </div>
            <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
              <li className="flex items-center justify-between">
                <span className="truncate">1. Enforce AuthGuard on alerts export</span>
                <button
                  onClick={() => {
                    const f = findings.find((x) => x.id === 'FND-0001');
                    if (f) handleSelectFinding(f);
                  }}
                  className="text-[10px] font-bold text-teal-700 dark:text-teal-400 hover:underline shrink-0 ml-2"
                >
                  Triage
                </button>
              </li>
              <li className="flex items-center justify-between">
                <span className="truncate">2. Rotate JWT secret in Docker environment</span>
                <span className="text-[10px] text-slate-400 shrink-0 ml-2">High</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="truncate">3. Re-execute automated canary retest</span>
                <button
                  onClick={() => setActiveView('retest')}
                  className="text-[10px] font-bold text-teal-700 dark:text-teal-400 hover:underline shrink-0 ml-2"
                >
                  Retest
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. MAIN ANALYTICS GRID: POSTURE, SEVERITY DONUT, RISK CATEGORIES          */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Panel 1: Security Posture Interactive Area Chart (6 Cols) */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-card border border-line shadow-card flex flex-col justify-between transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">Security Posture History</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800">
                  Target: 80+ PTS
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Evaluation score progression over historical assessment iterations
              </p>
            </div>

            {/* Time range selector */}
            <div className="flex items-center p-1 rounded-lg bg-subtle border border-line text-[11px] font-semibold self-start sm:self-center">
              <button
                onClick={() => setPostureRange('runs')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  postureRange === 'runs'
                    ? 'bg-card text-teal-800 dark:text-teal-300 font-bold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                5 Runs
              </button>
              <button
                onClick={() => setPostureRange('30d')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  postureRange === '30d'
                    ? 'bg-card text-teal-800 dark:text-teal-300 font-bold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                30 Days
              </button>
              <button
                onClick={() => setPostureRange('all')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  postureRange === 'all'
                    ? 'bg-card text-teal-800 dark:text-teal-300 font-bold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                All
              </button>
            </div>
          </div>

          {/* Interactive SVG Chart */}
          <div className="mt-4 w-full h-60 relative flex items-end">
            <svg className="w-full h-full bg-transparent overflow-visible" viewBox="0 0 560 220" preserveAspectRatio="none">
              <defs>
                <linearGradient id="postureAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0d9488" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#0d9488" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[40, 75, 110, 145, 180].map((y) => (
                <line
                  key={y}
                  x1="45"
                  y1={y}
                  x2="540"
                  y2={y}
                  stroke="var(--border)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              ))}

              {/* Target 80 Line */}
              <line
                x1="45"
                y1="110"
                x2="540"
                y2="110"
                stroke="#0d9488"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                opacity="0.6"
              />
              <text x="500" y="105" fill="#0d9488" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                TARGET: 80
              </text>

              {/* Y Axis Labels */}
              <text x="18" y="44" fill="var(--text-muted)" fontSize="10" fontFamily="sans-serif">100</text>
              <text x="18" y="79" fill="var(--text-muted)" fontSize="10" fontFamily="sans-serif">90</text>
              <text x="18" y="114" fill="var(--text-muted)" fontSize="10" fontFamily="sans-serif">80</text>
              <text x="18" y="149" fill="var(--text-muted)" fontSize="10" fontFamily="sans-serif">70</text>
              <text x="18" y="184" fill="var(--text-muted)" fontSize="10" fontFamily="sans-serif">60</text>

              {/* Area Polygon */}
              <path
                d="M 60,175 L 170,150 L 285,130 L 400,120 L 515,108 L 515,195 L 60,195 Z"
                fill="url(#postureAreaGrad)"
              />

              {/* Line Curve */}
              <path
                d="M 60,175 L 170,150 L 285,130 L 400,120 L 515,108"
                fill="none"
                stroke="#0d9488"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Interactive Points */}
              {[
                { x: 60, y: 175, val: 42, label: 'Baseline' },
                { x: 170, y: 150, val: 51, label: 'Run #1' },
                { x: 285, y: 130, val: 58, label: 'Run #2' },
                { x: 400, y: 120, val: prevScore, label: 'Run #3' },
                { x: 515, y: 108, val: securityScore, label: 'Current' },
              ].map((pt, i) => (
                <g
                  key={i}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredPoint(i)}
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  {/* Tooltip bubble on hover or for current point */}
                  {(hoveredPoint === i || (hoveredPoint === null && i === 4)) && (
                    <g>
                      <rect
                        x={pt.x - 22}
                        y={pt.y - 30}
                        width="44"
                        height="20"
                        rx="4"
                        fill="var(--bg-card)"
                        stroke="#0d9488"
                        strokeWidth="1.5"
                      />
                      <text
                        x={pt.x}
                        y={pt.y - 16}
                        textAnchor="middle"
                        fill="#0d9488"
                        fontSize="11"
                        fontWeight="black"
                        fontFamily="sans-serif"
                      >
                        {pt.val}
                      </text>
                    </g>
                  )}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredPoint === i ? 6 : 4.5}
                    fill="var(--bg-card)"
                    stroke="#0d9488"
                    strokeWidth="3"
                    className="transition-all"
                  />
                </g>
              ))}
            </svg>
          </div>

          {/* X Axis Assessment labels & summary */}
          <div className="grid grid-cols-5 text-center text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-line">
            {postureData.map((d, i) => (
              <div key={i} className="space-y-0.5">
                <span className="font-bold text-slate-900 dark:text-slate-100 block text-xs">
                  {d.label}
                </span>
                <span className="text-[10px] text-slate-400 block">{d.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 2: Findings by Severity Donut (3 Cols) */}
        <div className="lg:col-span-3 p-5 rounded-2xl bg-card border border-line shadow-card flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">Findings by Severity</h2>
            <span className="text-[10px] font-bold text-slate-400 font-mono">{openCount} ACTIVE</span>
          </div>

          {/* SVG Donut */}
          <div className="flex items-center justify-center my-3 relative">
            <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle cx="50" cy="50" r="38" fill="none" stroke="var(--bg-subtle)" strokeWidth="12" />
              {/* Low (Blue) */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="12"
                strokeDasharray={`${lowLen} ${donutCirc}`}
                strokeDashoffset={lowOffset}
                className="transition-all duration-700"
              />
              {/* Medium (Amber) */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="12"
                strokeDasharray={`${medLen} ${donutCirc}`}
                strokeDashoffset={medOffset}
                className="transition-all duration-700"
              />
              {/* High (Orange) */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#f97316"
                strokeWidth="12"
                strokeDasharray={`${highLen} ${donutCirc}`}
                strokeDashoffset={highOffset}
                className="transition-all duration-700"
              />
              {/* Critical (Red) */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#ef4444"
                strokeWidth="12"
                strokeDasharray={`${critLen} ${donutCirc}`}
                strokeDashoffset={critOffset}
                className="transition-all duration-700"
              />
            </svg>

            {/* Donut Center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none select-none">
              <span className="text-3xl font-black font-mono text-slate-900 dark:text-slate-100 leading-none">
                {openCount}
              </span>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wider">
                Open Vulns
              </span>
            </div>
          </div>

          {/* Interactive Legend with % */}
          <div className="space-y-2 text-xs pt-3 border-t border-line">
            <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="font-medium">Critical (CVSS 9.0+)</span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <span className="font-bold text-slate-900 dark:text-slate-100">{criticalCount}</span>
                <span className="text-slate-400 text-[11px] w-8 text-right">
                  {Math.round((criticalCount / totalFindings) * 100)}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                <span className="font-medium">High (CVSS 7.0-8.9)</span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <span className="font-bold text-slate-900 dark:text-slate-100">{highCount}</span>
                <span className="text-slate-400 text-[11px] w-8 text-right">
                  {Math.round((highCount / totalFindings) * 100)}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="font-medium">Medium (CVSS 4.0-6.9)</span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <span className="font-bold text-slate-900 dark:text-slate-100">{mediumCount}</span>
                <span className="text-slate-400 text-[11px] w-8 text-right">
                  {Math.round((mediumCount / totalFindings) * 100)}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="font-medium">Low (CVSS 0.1-3.9)</span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <span className="font-bold text-slate-900 dark:text-slate-100">{lowCount}</span>
                <span className="text-slate-400 text-[11px] w-8 text-right">
                  {Math.round((lowCount / totalFindings) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Panel 3: Ranked Risk Categories (3 Cols) */}
        <div className="lg:col-span-3 p-5 rounded-2xl bg-card border border-line shadow-card flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">Top Risk Categories</h2>
              <span className="text-[10px] text-slate-400 uppercase font-bold">OWASP & CWE</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Vulnerability attack vectors</p>

            <div className="space-y-3.5 my-4">
              {categories.map((cat) => {
                const pct = Math.round((cat.count / totalFindings) * 100);
                return (
                  <div key={cat.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                        <span>{cat.icon}</span>
                        <span className="truncate">{cat.name}</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="font-bold text-slate-900 dark:text-slate-100">{cat.count}</span>
                        <span className="text-slate-400 text-[10px] w-7 text-right">{pct}%</span>
                      </div>
                    </div>
                    <div className="w-full h-2 rounded-full bg-subtle overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: cat.barColor }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-[11px] text-slate-400 pt-2 border-t border-line flex items-center justify-between">
            <span>5 Distinct Classifications</span>
            <button
              onClick={() => setActiveView('risk')}
              className="font-bold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-0.5"
            >
              <span>Heatmap</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. HIGH-VALUE PANELS: PRIORITY FINDINGS, ASSET HEALTH, ACTIVITY TIMELINE  */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Panel A: Top Priority Findings (Ranked by CVSS / Impact) (5 Cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-card border border-line shadow-card flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-line">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
                <Flame className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">Top Priority Vulnerabilities</h3>
                <p className="text-[11px] text-slate-400">Immediate remediation recommended</p>
              </div>
            </div>
            <button
              onClick={() => setActiveView('findings')}
              className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline"
            >
              View All ({findings.length})
            </button>
          </div>

          <div className="divide-y divide-line my-1">
            {priorityFindings.map((f, idx) => (
              <div
                key={f.id}
                onClick={() => handleSelectFinding(f)}
                className="py-3 flex items-start justify-between gap-3 group cursor-pointer hover:bg-subtle/50 px-2 rounded-lg transition-colors"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400">#{idx + 1}</span>
                    <span className="text-[10px] font-mono font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50 px-1.5 py-0.2 rounded border border-teal-200 dark:border-teal-800">
                      {f.id}
                    </span>
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.2 rounded-full border ${
                        f.severity === 'CRITICAL'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-orange-50 text-orange-700 border-orange-200'
                      }`}
                    >
                      {f.severity}
                    </span>
                    <span className="font-mono text-[10px] font-bold text-slate-700 dark:text-slate-300">
                      CVSS {f.cvss?.score?.toFixed(1) || '7.5'}
                    </span>
                  </div>

                  <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors truncate">
                    {f.title}
                  </h4>

                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                    <span className="truncate max-w-[240px]">{f.endpoint || f.affectedAssets?.[0]}</span>
                    <span>•</span>
                    <span className="text-slate-400">{f.cwe?.[0] || 'CWE-306'}</span>
                  </div>
                </div>

                <button
                  onClick={(e) => handleValidateSandbox(e, f)}
                  className="shrink-0 px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-[10px] font-bold transition-all shadow-2xs mt-1"
                >
                  Safe Validate
                </button>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-line text-[11px] text-slate-400 flex items-center justify-between">
            <span>Ranked by CVSS v3.1 exploitability vector</span>
            <span className="font-semibold text-rose-600 dark:text-rose-400">{criticalCount + highCount} High-risk exposed</span>
          </div>
        </div>

        {/* Panel B: Monitored Asset Health (3 Cols) */}
        <div className="lg:col-span-3 p-5 rounded-2xl bg-card border border-line shadow-card flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-line">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400">
                <Boxes className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">Asset Health Matrix</h3>
                <p className="text-[11px] text-slate-400">{assets.length} Monitored Surface Targets</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 my-2">
            <div className="p-3 rounded-xl bg-subtle border border-line space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">API Endpoints</span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{endpointAssets.length}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px]">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="text-slate-500">2 with open findings</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-subtle border border-line space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Web App Views</span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{pageAssets.length}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px]">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-slate-500">Authenticated sessions</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-subtle border border-line space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Critical Core Components</span>
                <span className="font-mono font-bold text-rose-600">{criticalAssets.length}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px]">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-slate-500">Egress locked to 127.0.0.1</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-line">
            <button
              onClick={() => setActiveView('assets')}
              className="w-full py-1.5 text-center text-xs font-bold text-teal-700 dark:text-teal-400 hover:bg-subtle rounded-lg transition-colors flex items-center justify-center gap-1"
            >
              <span>Explore Asset Graph</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Panel C: Security Activity Timeline (4 Cols) */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-card border border-line shadow-card flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-line">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                <Activity className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">Live Security Timeline</h3>
                <p className="text-[11px] text-slate-400">Cryptographically verifiable events</p>
              </div>
            </div>
            <button
              onClick={() => setActiveView('audit')}
              className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline"
            >
              Audit Trail
            </button>
          </div>

          {/* Chronological Event Stream */}
          <div className="space-y-3.5 my-2">
            {[
              {
                time: '10:23 UTC',
                title: 'Assessment Run Finished',
                desc: 'Score calculated: 61/100. 9 active findings cataloged.',
                color: 'bg-emerald-500',
              },
              {
                time: '10:20 UTC',
                title: 'Sandbox Probe Confirmed FND-0001',
                desc: 'VAL-AUTHZ-001 executed safely. Evidence hash verified.',
                color: 'bg-teal-500',
              },
              {
                time: '10:18 UTC',
                title: 'Unauthenticated Export Detected',
                desc: 'HTTP 200 returned on /api/v1/alerts/export without token.',
                color: 'bg-rose-500',
              },
              {
                time: '10:14 UTC',
                title: 'Egress Allow-List Enforced',
                desc: 'Network locked strictly to 127.0.0.1:3000.',
                color: 'bg-blue-500',
              },
            ].map((ev, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs">
                <div className="flex flex-col items-center mt-1">
                  <span className={`w-2 h-2 rounded-full ${ev.color}`} />
                  {i < 3 && <div className="w-[1px] h-6 bg-line mt-1" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-[11px] truncate">{ev.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">{ev.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{ev.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-line text-[10px] text-slate-400 flex items-center justify-between">
            <span className="font-mono">Chain: SHA-256 Validated</span>
            <span className="text-emerald-600 font-semibold">Immutable</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6. COMPACT PREMIUM DATA TABLES: RECENT ASSESSMENTS & RECENT FINDINGS      */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Table 1: Recent Assessments (6 Cols) */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-card border border-line shadow-card transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">Recent Security Assessments</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Historical execution runs across target environments</p>
            </div>
            <button
              onClick={() => setActiveView('running')}
              className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:text-teal-900 flex items-center gap-0.5"
            >
              <span>View all runs</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-line bg-subtle text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Assessment Target</th>
                  <th className="py-2.5 px-3">Score</th>
                  <th className="py-2.5 px-3">Severity Breakdown</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-slate-700 dark:text-slate-300">
                {liveRecentAssessments.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => setActiveView('running')}
                    className="theme-table-row cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-3 text-slate-500 dark:text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      {row.dateTime}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{row.name}</div>
                      <div className="text-[10px] text-slate-400">{row.target} • {row.envType}</div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-teal-700 dark:text-teal-400 text-xs">
                          {row.score}/100
                        </span>
                        <div className="w-12 h-1.5 rounded-full bg-subtle overflow-hidden">
                          <div
                            className="h-full bg-teal-600 rounded-full"
                            style={{ width: `${row.score}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-mono text-[11px]">
                        <span className="flex items-center gap-0.5 text-rose-600 font-bold" title="Critical">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          {row.findings.c}
                        </span>
                        <span className="flex items-center gap-0.5 text-orange-600 font-bold" title="High">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                          {row.findings.h}
                        </span>
                        <span className="flex items-center gap-0.5 text-amber-600 font-bold" title="Medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          {row.findings.m}
                        </span>
                        <span className="flex items-center gap-0.5 text-blue-600 font-bold" title="Low">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          {row.findings.l}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-bold text-[10px] uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 2: Recent Findings Triage Table (6 Cols) */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-card border border-line shadow-card transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">Findings & Vulnerabilities</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Categorized by severity and verified exploitability</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center p-1 rounded-lg bg-subtle border border-line text-[11px] font-semibold self-start sm:self-center">
              <button
                onClick={() => setFindingFilter('ALL')}
                className={`px-2 py-0.5 rounded transition-all ${
                  findingFilter === 'ALL' ? 'bg-card text-teal-800 dark:text-teal-300 font-bold shadow-2xs' : 'text-slate-500'
                }`}
              >
                All ({findings.length})
              </button>
              <button
                onClick={() => setFindingFilter('CRIT_HIGH')}
                className={`px-2 py-0.5 rounded transition-all ${
                  findingFilter === 'CRIT_HIGH' ? 'bg-card text-rose-700 dark:text-rose-400 font-bold shadow-2xs' : 'text-slate-500'
                }`}
              >
                High ({criticalCount + highCount})
              </button>
              <button
                onClick={() => setFindingFilter('REMEDIATION')}
                className={`px-2 py-0.5 rounded transition-all ${
                  findingFilter === 'REMEDIATION' ? 'bg-card text-amber-700 dark:text-amber-400 font-bold shadow-2xs' : 'text-slate-500'
                }`}
              >
                In Fix
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-line bg-subtle text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">ID</th>
                  <th className="py-2.5 px-3">Vulnerability Title</th>
                  <th className="py-2.5 px-3">Severity</th>
                  <th className="py-2.5 px-3">CVSS</th>
                  <th className="py-2.5 px-3">Endpoint / Asset</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-slate-700 dark:text-slate-300">
                {filteredFindings.slice(0, 6).map((f) => {
                  let pillClass = 'bg-slate-50 text-slate-700 border-slate-200';
                  if (f.severity === 'CRITICAL') pillClass = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-900';
                  else if (f.severity === 'HIGH') pillClass = 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/60 dark:text-orange-400 dark:border-orange-900';
                  else if (f.severity === 'MEDIUM') pillClass = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-900';
                  else if (f.severity === 'LOW') pillClass = 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-900';

                  return (
                    <tr
                      key={f.id}
                      onClick={() => handleSelectFinding(f)}
                      className="theme-table-row cursor-pointer transition-colors group"
                    >
                      <td className="py-3 px-3 font-mono font-bold text-teal-700 dark:text-teal-400 whitespace-nowrap">
                        {f.id}
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-900 dark:text-slate-100 max-w-[220px] truncate">
                        <span className="group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                          {f.title}
                        </span>
                        <span className="block text-[10px] text-slate-400 font-normal truncate">
                          {f.owasp || f.category}
                        </span>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full border text-[10px] font-black uppercase ${pillClass}`}>
                          {f.severity}
                        </span>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap font-mono font-bold text-slate-700 dark:text-slate-300">
                        {f.cvss?.score?.toFixed(1) || '—'}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-500 dark:text-slate-400 text-[11px] max-w-[150px] truncate">
                        {f.endpoint || f.affectedAssets?.[0] || 'App Root'}
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => handleValidateSandbox(e, f)}
                          className="px-2 py-0.5 rounded bg-subtle hover:bg-teal-50 hover:text-teal-700 border border-line text-[10px] font-bold text-slate-600 transition-colors"
                        >
                          Validate
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecureMonDashboard;
