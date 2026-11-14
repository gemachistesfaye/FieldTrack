import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Radio,
  WifiOff,
  Database,
  ShieldCheck,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
  GitPullRequest,
  Users,
  HardHat,
  Shield,
  Sparkles,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

/**
 * Modern FieldTrack Landing Page
 * Grounded in the visual aesthetic of the industrial reference guides (6030449798499995434_121.jpg & 6030449798499995438_121.jpg).
 * Features deep charcoal hero surfaces, sleek high-contrast slate accents,
 * clean white cards, structured typography hierarchy, and clear CTAs.
 */
export const LandingPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleDemoLogin = async (email: string) => {
    try {
      await login({ email, password: 'Password123!' });
      navigate('/');
    } catch {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/welcome" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white shadow-2xs group-hover:scale-105 transition-transform">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 tracking-tight text-lg">FieldTrack</span>
                <span className="text-xs uppercase font-extrabold px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                  PRO
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Offline Field Operations</p>
            </div>
          </Link>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-bold text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors">
              How It Works
            </a>
            <a href="#roles" className="hover:text-slate-900 transition-colors">
              Roles & Triage
            </a>
            <a href="#architecture" className="hover:text-slate-900 transition-colors">
              Architecture
            </a>
          </nav>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5">
            <Link to="/login">
              <Button variant="outline" size="sm" className="font-bold border-slate-200 text-slate-700">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button
                variant="primary"
                size="sm"
                className="font-bold shadow-xs text-white"
                rightIcon={<ArrowRight className="w-3.5 h-3.5 text-white" />}
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 sm:px-8 pt-8 sm:pt-12 pb-16 max-w-7xl mx-auto w-full">
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-12 lg:p-16 border border-slate-800 shadow-sm relative overflow-hidden">
          {/* Subtle Industrial Grid Background */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              Offline-First Municipal Incident Management
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Reliable Field Operations. <br />
              <span className="text-slate-200 underline decoration-slate-600">Zero Signal Required.</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
              Empower municipal technicians and utility crews to report water point outages,
              electrical faults, and heavy equipment breakdowns anywhere. All incidents persist
              instantly in browser storage and reconcile automatically when connectivity restores.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <Link to="/register">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto font-extrabold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 shadow-md text-sm px-6 h-12"
                  rightIcon={<ArrowRight className="w-4 h-4 text-white" />}
                >
                  Create Field Worker Account
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto font-bold bg-white/10 text-white border-white/20 hover:bg-white/20 h-12 text-sm"
                >
                  Sign In to Command Center
                </Button>
              </Link>
            </div>

            {/* Quick Demo Access Bar */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-bold text-white tracking-wide">Welcome Back</span>
                <span className="text-slate-400 font-semibold">Test Account Role:</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('admin@fieldtrack.local')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/15 text-white border border-white/30 hover:bg-white/25 transition-all cursor-pointer shadow-2xs"
                >
                  👑 Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('marcus.vance@fieldtrack.local')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all cursor-pointer shadow-2xs"
                >
                  🛡️ Coordinator
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('amina.osei@fieldtrack.local')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all cursor-pointer shadow-2xs"
                >
                  👷 Worker
                </button>
              </div>
            </div>

            {/* Quick Metrics Strip */}
            <div className="pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-left">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">100%</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Offline-Ready Local Storage</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">&lt; 15ms</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">IndexedDB Mutation Latency</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">PostgreSQL</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Reliable Relational Core</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">RBAC</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Granular Role Permissions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="px-4 sm:px-8 py-12 max-w-7xl mx-auto w-full space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Industrial Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Built for Real-World Field Conditions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Engineered specifically to solve the fragility of network-dependent field software.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3 hover:border-slate-400 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
              <WifiOff className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Offline-First Engine</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Technicians can create, edit, and queue fault submissions in areas without any cellular
              signal. Powered by client-side Dexie.js IndexedDB with idempotency UUID keying.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3 hover:border-slate-400 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
              <GitPullRequest className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Coordinator Triage Board</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Regional coordinators oversee incoming reports, prioritize critical safety hazards, and
              dispatch assignments to field specialists with single-click workflow transitions.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3 hover:border-slate-400 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">High-Precision Geolocation</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Capture GPS coordinates and sector landmark metadata with interactive radar pin previews,
              ensuring repair teams reach the exact borehole, pump, or transformer line.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3 hover:border-slate-400 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Role-Based Security</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Field workers are safely isolated to their own records, coordinators manage assignment
              pipelines, and system administrators maintain full governance and audit authority.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3 hover:border-slate-400 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Audit Trail & History</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every status change, reassignment, and sync reconciliation is logged immutably in
              PostgreSQL for total regulatory compliance and incident transparency.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3 hover:border-slate-400 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Idempotent Delta Sync</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Network fluctuations will never produce duplicate records. The sync engine uses
              client-generated UUIDs and server-enforced validation to prevent data collisions.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works (4-Step Pipeline) */}
      <section id="how-it-works" className="px-4 sm:px-8 py-12 max-w-7xl mx-auto w-full space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Operational Lifecycle
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How FieldTrack Works in 4 Steps
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            From remote field failure to verified municipal repair.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              step: '01',
              title: 'Record Offline Incident',
              desc: 'Field technician captures equipment category, severity, description, and GPS coordinates without connectivity.',
            },
            {
              step: '02',
              title: 'Instant Local Buffer',
              desc: 'Report is securely committed to IndexedDB with a unique client ID, ensuring zero data loss if the device powers down.',
            },
            {
              step: '03',
              title: 'Automatic Reconciliation',
              desc: 'When device detects Wi-Fi or cellular signal, the sync engine pushes queued deltas and updates server timestamps.',
            },
            {
              step: '04',
              title: 'Dispatch & Resolution',
              desc: 'Coordinator assigns work order, repair specialist executes physical fix, and report transitions to RESOLVED.',
            },
          ].map(s => (
            <div key={s.step} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3 relative">
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {s.step}
              </span>
              <h4 className="text-sm font-bold text-slate-900">{s.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Roles & Permissions Section */}
      <section id="roles" className="px-4 sm:px-8 py-12 max-w-7xl mx-auto w-full space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            User Personas
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Tailored Workspaces for Every Role
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Dedicated dashboards engineered for field crews, dispatch coordinators, and supervisors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Role 1 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
              <HardHat className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Field Technician
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">Frontline Operations</h3>
            </div>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-slate-700 shrink-0" />
                <span>Offline report creation & drafting</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-slate-700 shrink-0" />
                <span>Automated GPS coordinate tagging</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-slate-700 shrink-0" />
                <span>Personal submission tracking</span>
              </li>
            </ul>
          </div>

          {/* Role 2 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Coordinator / Dispatcher
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">Triage & Assignment</h3>
            </div>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-slate-700 shrink-0" />
                <span>Incoming report review & triage queue</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-slate-700 shrink-0" />
                <span>1-click technician dispatch modal</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-slate-700 shrink-0" />
                <span>Workflow Kanban boards</span>
              </li>
            </ul>
          </div>

          {/* Role 3 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                System Administrator
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">Governance & Telemetry</h3>
            </div>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-slate-700 shrink-0" />
                <span>Live PostgreSQL connection health</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-slate-700 shrink-0" />
                <span>Global user roster & role provisioning</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-slate-700 shrink-0" />
                <span>System-wide audit trail inspection</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="px-4 sm:px-8 py-12 max-w-7xl mx-auto w-full">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 border border-slate-800 shadow-lg">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-white/10 text-white items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to modernise your field operations?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Deploy FieldTrack today and ensure your team never loses critical incident data again.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/register">
              <Button
                variant="primary"
                size="lg"
                className="font-extrabold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-6 h-12 text-sm shadow-md"
                rightIcon={<ArrowRight className="w-4 h-4 text-white" />}
              >
                Get Started Free
              </Button>
            </Link>
            <Link to="/login">
              <Button
                variant="outline"
                size="lg"
                className="font-bold bg-white/10 text-white border-white/20 hover:bg-white/20 h-12 text-sm"
              >
                Sign In With Demo Accounts
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white py-6 px-4 sm:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-slate-900 text-white flex items-center justify-center font-extrabold text-xs">
              FT
            </div>
            <span className="font-bold text-slate-800">FieldTrack v0.1.0</span>
            <span>• Offline-First Field Issue Management</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <Link to="/welcome" className="hover:text-slate-600 transition-colors">
              Landing
            </Link>
            <Link to="/login" className="hover:text-slate-600 transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="hover:text-slate-600 transition-colors">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
