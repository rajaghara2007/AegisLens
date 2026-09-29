import React, { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  ArrowRight,
  ArrowLeft,
  Key,
  Server,
  User,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  Terminal,
  Activity,
  Eye,
  EyeOff,
  Radio,
} from 'lucide-react';

interface Aegis3DLoginScreenProps {
  onLoginSuccess: () => void;
}

export const Aegis3DLoginScreen: React.FC<Aegis3DLoginScreenProps> = ({ onLoginSuccess }) => {
  // Page 1 = Security Gateway Hero, Page 2 = Operator Login Form
  const [currentPage, setCurrentPage] = useState<1 | 2>(1);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [loadingStepText, setLoadingStepText] = useState<string>('Verifying operator cryptographic certificate...');

  // Form State
  const [email, setEmail] = useState('analyst@aegislens.internal');
  const [password, setPassword] = useState('••••••••••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [environment, setEnvironment] = useState('DOCKER_SANDBOX');

  // Mouse Parallax 3D Tilt state
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const x = ((clientX - left) / width - 0.5) * 16; // -8 to +8 deg
    const y = ((clientY - top) / height - 0.5) * -16; // -8 to +8 deg
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Handle Login submission and logo loading animation
  const handlePerformLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsTransitioning(true);
    setLoadingProgress(10);

    const steps = [
      { p: 25, text: 'Establishing isolated RFC1918 sandbox tunnel...' },
      { p: 55, text: 'Synchronizing SHA-256 immutable audit ledger...' },
      { p: 85, text: 'Loading Security Command Center telemetry stream...' },
      { p: 100, text: 'Session Authenticated. Unlocking Command Center...' },
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setLoadingProgress(step.p);
        setLoadingStepText(step.text);
      }, (index + 1) * 380);
    });

    // Complete login transition
    setTimeout(() => {
      onLoginSuccess();
    }, 1900);
  };

  // =========================================================================
  // LOGO LOADER SCREEN (WHEN RENDERING TO DASHBOARD)
  // =========================================================================
  if (isTransitioning) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0B1220] text-slate-100 flex flex-col items-center justify-center p-6 select-none overflow-hidden">
        {/* Ambient radial background glow */}
        <div className="absolute w-[600px] h-[600px] rounded-full bg-teal-500/10 blur-[140px] pointer-events-none" />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />

        {/* 3D Expanding Logo Container */}
        <div className="relative flex flex-col items-center z-10 max-w-md w-full text-center">
          {/* Rotating Radar Rings */}
          <div className="relative w-36 h-36 flex items-center justify-center mb-8">
            <div className="absolute inset-0 rounded-full border border-teal-500/30 animate-radar-spin" />
            <div className="absolute inset-2 rounded-full border border-dashed border-cyan-500/40 animate-spin" style={{ animationDuration: '18s' }} />
            <div className="absolute inset-5 rounded-full border border-teal-500/20" />

            {/* Glowing 3D Shield Logo */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-teal-700 via-teal-500 to-cyan-400 flex items-center justify-center text-white shadow-[0_0_50px_rgba(13,148,136,0.6)] animate-pulse-glow border border-teal-300/40">
              <Shield className="w-10 h-10 stroke-[2.3] filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.4)]" />
            </div>

            {/* Scanning radar sweep */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/20 to-transparent pointer-events-none animate-radar-spin" />
          </div>

          {/* Brand Name */}
          <div className="space-y-1 mb-6">
            <div className="flex items-center justify-center gap-1.5 text-2xl font-black tracking-tight text-white">
              <span>AEGIS</span>
              <span className="text-teal-400">LENS</span>
            </div>
            <p className="text-xs text-slate-400 font-mono tracking-wider uppercase">
              Cybersecurity Command Center
            </p>
          </div>

          {/* Loading Progress Bar */}
          <div className="w-full bg-slate-800/80 rounded-full h-2 p-0.5 border border-slate-700/60 mb-4 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-teal-500 via-emerald-400 to-cyan-400 h-full rounded-full transition-all duration-300 ease-out shadow-[0_0_12px_rgba(13,148,136,0.8)]"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>

          {/* Real-time boot sequence text */}
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-teal-300 h-6">
            <Radio className="w-3.5 h-3.5 text-teal-400 animate-pulse shrink-0" />
            <span className="truncate">{loadingStepText}</span>
          </div>

          <div className="mt-8 flex items-center gap-3 text-[11px] text-slate-500 font-mono">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3 h-3" /> RFC1918 Gated
            </span>
            <span>•</span>
            <span>SHA-256 Ledger Verified</span>
            <span>•</span>
            <span className="text-teal-400">{loadingProgress}%</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden select-none perspective-1200"
    >
      {/* ========================================================================= */}
      {/* 3D BACKGROUND GRID & AMBIENT NEBULA                                       */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-teal-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Brand & Status Navigation */}
      <header className="relative z-20 flex items-center justify-between max-w-6xl mx-auto w-full py-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-sm shadow-teal-500/30">
            <Shield className="w-4 h-4 stroke-[2.3]" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-base font-black tracking-tight text-white">
              AEGIS<span className="text-teal-400">LENS</span>
            </span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold tracking-wider uppercase bg-teal-950 text-teal-300 border border-teal-800">
              SEC-OPS v2.4
            </span>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className={`px-2 py-0.5 rounded-full border transition-all ${currentPage === 1 ? 'bg-teal-950/80 text-teal-300 border-teal-700 font-bold' : 'border-slate-800 text-slate-500'}`}>
            01 Gateway
          </span>
          <span className="text-slate-600">→</span>
          <span className={`px-2 py-0.5 rounded-full border transition-all ${currentPage === 2 ? 'bg-teal-950/80 text-teal-300 border-teal-700 font-bold' : 'border-slate-800 text-slate-500'}`}>
            02 Operator Login
          </span>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN 3D INTERACTIVE CARD CONTAINER (PAGE 1 OR PAGE 2)                     */}
      {/* ========================================================================= */}
      <main className="relative z-20 flex-1 flex items-center justify-center py-6">
        <div
          className="w-full max-w-4xl transition-transform duration-300 ease-out transform-style-3d"
          style={{
            transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
          }}
        >
          {/* ===================================================================== */}
          {/* PAGE 1: 3D CYBERSECURITY DEFENSE GATEWAY HERO                         */}
          {/* ===================================================================== */}
          {currentPage === 1 ? (
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 rounded-3xl p-6 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] relative overflow-hidden transition-all">
              {/* Top Accent Gradient */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-emerald-400 to-cyan-400" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left Hero Text (7 Cols) */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/60 border border-teal-800/80 text-teal-300 text-xs font-bold font-mono">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span>DEFENSE GRID READY · RFC1918 GATED</span>
                  </div>

                  <div className="space-y-2">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                      Enterprise <span className="bg-gradient-to-r from-teal-400 via-emerald-300 to-cyan-400 bg-clip-text text-transparent">Vulnerability</span> Intelligence.
                    </h1>
                    <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-lg">
                      Autonomous vulnerability assessment, deterministic sandbox validation, and explainable CVSS scoring for air-gapped security operations.
                    </p>
                  </div>

                  {/* 3 Core Highlights */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                      <div className="flex items-center gap-1.5 text-teal-400 text-xs font-bold">
                        <Lock className="w-3.5 h-3.5" />
                        <span>RFC1918 Lock</span>
                      </div>
                      <p className="text-[11px] text-slate-400">Strict local loopback & Docker egress isolation</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                      <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-bold">
                        <Activity className="w-3.5 h-3.5" />
                        <span>Retest Engine</span>
                      </div>
                      <p className="text-[11px] text-slate-400">Replays exact HTTP assertion probes</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AI Assistant</span>
                      </div>
                      <p className="text-[11px] text-slate-400">Bounded Gen-AI verification with zero hallucinations</p>
                    </div>
                  </div>

                  {/* Call to Action Button to Page 2 */}
                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                      onClick={() => setCurrentPage(2)}
                      className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 active:scale-95 text-white font-bold text-sm transition-all shadow-[0_4px_25px_rgba(13,148,136,0.4)] group"
                    >
                      <span>Proceed to Operator Authentication</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                      onClick={handlePerformLogin}
                      className="px-4 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 font-semibold text-xs transition-colors text-center"
                    >
                      Instant Demo Session (1-Click)
                    </button>
                  </div>
                </div>

                {/* Right 3D Visual Centerpiece (5 Cols) */}
                <div className="lg:col-span-5 flex items-center justify-center p-4">
                  <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
                    {/* Outer 3D Gyroscope Rings */}
                    <div className="absolute inset-0 rounded-full border-2 border-teal-500/20 animate-radar-spin" />
                    <div className="absolute inset-4 rounded-full border border-dashed border-cyan-500/30 animate-spin" style={{ animationDuration: '24s' }} />
                    <div className="absolute inset-10 rounded-full border border-teal-500/30" />

                    {/* Glowing 3D Shield Cube */}
                    <div className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-teal-700 via-teal-500 to-cyan-400 flex flex-col items-center justify-center text-white shadow-[0_0_60px_rgba(13,148,136,0.5)] border border-teal-300/40 animate-float-slow">
                      <Shield className="w-14 h-14 stroke-[2.3] filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]" />
                      <span className="text-[10px] font-black font-mono tracking-widest mt-1 text-teal-100">
                        AEGIS-LENS
                      </span>
                    </div>

                    {/* Floating Satellite Badges */}
                    <div className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-teal-500/40 text-[10px] font-mono text-teal-300 shadow-lg animate-pulse-glow">
                      SHA-256 LEDGER
                    </div>
                    <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 shadow-lg">
                      PORT 3000 SANDBOX
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ===================================================================== */
            /* PAGE 2: 3D OPERATOR LOGIN FORM                                        */
            /* ===================================================================== */
            <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800/90 rounded-3xl p-6 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.7)] relative overflow-hidden max-w-xl mx-auto transition-all">
              {/* Top Accent Gradient */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-emerald-400 to-cyan-400" />

              <div className="space-y-6">
                {/* Header with Back button */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setCurrentPage(1)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Gateway</span>
                  </button>

                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-950/60 border border-teal-800 text-[10px] font-mono text-teal-300">
                    <Lock className="w-3 h-3 text-teal-400" />
                    <span>AIR-GAPPED AUTH</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-teal-600/30 border border-teal-500/50 flex items-center justify-center text-teal-300">
                      <Key className="w-4 h-4" />
                    </div>
                    <h2 className="text-2xl font-black tracking-tight text-white">
                      Operator Login
                    </h2>
                  </div>
                  <p className="text-xs text-slate-400">
                    Authenticate your session to unlock the AegisLens Security Command Center.
                  </p>
                </div>

                {/* Form Fields */}
                <form onSubmit={handlePerformLogin} className="space-y-4 pt-1">
                  {/* Operator ID / Email */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                      Operator Identity
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-colors"
                        placeholder="analyst@aegislens.internal"
                        required
                      />
                    </div>
                  </div>

                  {/* Target Environment */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                      Target Environment
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Server className="w-4 h-4" />
                      </div>
                      <select
                        value={environment}
                        onChange={(e) => setEnvironment(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-colors appearance-none cursor-pointer"
                      >
                        <option value="DOCKER_SANDBOX">World Monitor (Local Staging) — 127.0.0.1:3000</option>
                        <option value="TEST_VULNERABLE">WM-Canary (Seeded Test Target) — 127.0.0.1:8080</option>
                        <option value="LOCAL">Local Host Isolated Stack — localhost</option>
                      </select>
                    </div>
                  </div>

                  {/* Access Token / Password */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                      Security Key / Token
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-colors"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Role / Clearance Badge */}
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-slate-300 font-medium">Assigned Clearance:</span>
                    </div>
                    <span className="font-mono font-bold text-teal-300">NTRO Lead Analyst</span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-500 hover:from-teal-500 hover:to-cyan-400 active:scale-[0.98] text-white font-bold text-sm transition-all shadow-[0_4px_20px_rgba(13,148,136,0.4)] mt-2"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Authenticate & Enter Command Center</span>
                  </button>
                </form>

                {/* Demo Quick Button */}
                <div className="pt-2 border-t border-slate-800 text-center">
                  <button
                    type="button"
                    onClick={handlePerformLogin}
                    className="text-xs text-teal-400 hover:text-teal-300 transition-colors font-medium"
                  >
                    Skip credentials: Demo 1-Click Authentication
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer Info */}
      <footer className="relative z-20 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-6xl mx-auto w-full text-[11px] text-slate-500 font-mono py-2 border-t border-slate-900">
        <div>
          AegisLens Security Platform · SIH 2026 Submission
        </div>
        <div className="flex items-center gap-4">
          <span>RFC1918 Guardrails Active</span>
          <span>•</span>
          <span>SHA-256 Ledger: PASS</span>
          <span>•</span>
          <span className="text-teal-400">NTRO Operational Session</span>
        </div>
      </footer>
    </div>
  );
};

export default Aegis3DLoginScreen;
