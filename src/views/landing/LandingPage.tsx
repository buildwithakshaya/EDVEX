import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Compass,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Building,
  Users,
  Briefcase,
  Layers,
  Award,
  ShieldCheck,
  Target,
  FileCheck,
  Sparkles,
  ChevronRight,
  Menu,
  X,
  LogIn,
  UserPlus
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (path: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { currentUser, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDashboardPath = () => {
    if (!currentUser) return '/login';
    return `/${currentUser.role}/dashboard`;
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="top" className="min-h-screen bg-white text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 font-sans">
      {/* 1. HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('/')}>
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-600 text-white font-bold shadow-xs">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-slate-900">SkillBridge</span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold uppercase bg-indigo-50 text-indigo-700 rounded border border-indigo-100">
                  SIH
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600">
            <button
              onClick={() => scrollToSection('top')}
              className="hover:text-indigo-600 transition cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-indigo-600 transition cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('stakeholders')}
              className="hover:text-indigo-600 transition cursor-pointer"
            >
              For Students
            </button>
            <button
              onClick={() => scrollToSection('stakeholders')}
              className="hover:text-indigo-600 transition cursor-pointer"
            >
              For Institutions
            </button>
            <button
              onClick={() => scrollToSection('stakeholders')}
              className="hover:text-indigo-600 transition cursor-pointer"
            >
              For Industry
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="hover:text-indigo-600 transition cursor-pointer"
            >
              About
            </button>
          </nav>

          {/* Right Side Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {currentUser ? (
              <>
                <button
                  onClick={() => onNavigate(getDashboardPath())}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition cursor-pointer"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={logout}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-slate-50 rounded-lg transition cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('/login')}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-indigo-600 transition cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={() => onNavigate('/register')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition cursor-pointer"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile menu hamburger */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2">
            <button
              onClick={() => scrollToSection('top')}
              className="block w-full text-left py-2 text-xs font-semibold text-slate-700"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="block w-full text-left py-2 text-xs font-semibold text-slate-700"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('stakeholders')}
              className="block w-full text-left py-2 text-xs font-semibold text-slate-700"
            >
              Stakeholders
            </button>
            <button
              onClick={() => scrollToSection('core-features')}
              className="block w-full text-left py-2 text-xs font-semibold text-slate-700"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="block w-full text-left py-2 text-xs font-semibold text-slate-700"
            >
              About
            </button>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              {currentUser ? (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigate(getDashboardPath());
                    }}
                    className="w-full text-center py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg"
                  >
                    Go to Dashboard
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-center py-2 text-xs font-semibold text-rose-600 bg-rose-50 rounded-lg"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigate('/login');
                    }}
                    className="w-full text-center py-2 text-xs font-semibold text-slate-700 border border-slate-200 rounded-lg"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigate('/register');
                    }}
                    className="w-full text-center py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <section className="py-14 sm:py-20 lg:py-24 bg-gradient-to-b from-slate-50 to-white border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Smart India Hackathon &bull; Problem Statement</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            Bridge Skills. Academia. Industry. Careers.
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 leading-relaxed">
            SkillBridge connects students, universities, faculty, industry and placement teams through skill mapping, career readiness and opportunity matching.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {currentUser ? (
              <button
                onClick={() => onNavigate(getDashboardPath())}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition cursor-pointer"
              >
                <span>Go to Dashboard ({currentUser.name})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('/register')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition cursor-pointer"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('/login')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-2xs transition cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </button>
              </>
            )}
          </div>

          {/* Visual representation of SkillBridge ecosystem */}
          <div className="pt-10 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-4">
                The SkillBridge Dynamic Progression Flow
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-2 items-center">
                {/* Step 1 */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <div className="w-7 h-7 mx-auto rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-1.5">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 block">Student</span>
                  <span className="text-[10px] text-slate-500">Multi-Branch</span>
                </div>

                {/* Step 2 */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <div className="w-7 h-7 mx-auto rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-1.5">
                    <Layers className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 block">Skills</span>
                  <span className="text-[10px] text-slate-500">Self & Verified</span>
                </div>

                {/* Step 3 */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <div className="w-7 h-7 mx-auto rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-1.5">
                    <Target className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 block">Skill Gap</span>
                  <span className="text-[10px] text-slate-500">Live Analysis</span>
                </div>

                {/* Step 4 */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <div className="w-7 h-7 mx-auto rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-1.5">
                    <Award className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 block">Career Readiness</span>
                  <span className="text-[10px] text-slate-500">Weighted Index</span>
                </div>

                {/* Step 5 */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <div className="w-7 h-7 mx-auto rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center mb-1.5">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 block">Industry Opportunity</span>
                  <span className="text-[10px] text-slate-500">Algorithmic Match</span>
                </div>

                {/* Step 6 */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <div className="w-7 h-7 mx-auto rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center mb-1.5">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 block">Placement</span>
                  <span className="text-[10px] text-slate-500">Confirmed Career</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PROBLEM / SOLUTION */}
      <section className="py-14 sm:py-18 bg-white border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600">The Problem & The Bridge</h2>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900">Why SkillBridge Matters</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* The Problem */}
            <div className="p-6 rounded-2xl bg-rose-50/60 border border-rose-200/80 space-y-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-600" />
                <h3 className="text-base font-bold text-rose-950">The Challenge</h3>
              </div>
              <ul className="space-y-3 text-xs text-rose-900/90 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">&bull;</span>
                  <span><b>Students</b> may have skills but lack visibility into critical industry skill gaps and matching opportunities.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">&bull;</span>
                  <span><b>Universities</b> need direct, accurate visibility into student skill readiness across departments.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">&bull;</span>
                  <span><b>Industry</b> struggles to identify candidates whose verified skills align with actual project requirements.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">&bull;</span>
                  <span><b>Placement teams</b> need better data to identify eligible students efficiently without manual paperwork.</span>
                </li>
              </ul>
            </div>

            {/* The Solution */}
            <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-emerald-950">The SkillBridge Solution</h3>
              </div>
              <p className="text-xs text-emerald-900/90 leading-relaxed">
                SkillBridge creates <b>one connected platform</b> for skill mapping, career readiness, internships, jobs and placement insights.
              </p>
              <div className="space-y-2.5 pt-1 text-xs text-emerald-900/90">
                <div className="p-2.5 bg-white/80 rounded-lg border border-emerald-200/60 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Unified portal for students, universities, faculty, recruiters and policy makers.</span>
                </div>
                <div className="p-2.5 bg-white/80 rounded-lg border border-emerald-200/60 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Real dynamic formulas replacing arbitrary static demo scores.</span>
                </div>
                <div className="p-2.5 bg-white/80 rounded-lg border border-emerald-200/60 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Transparent matching explanations highlighting both strong and missing skills.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW SKILLBRIDGE WORKS */}
      <section id="how-it-works" className="py-14 sm:py-18 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600">Step-by-Step Architecture</h2>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900">How SkillBridge Works</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Step 01 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-2xl font-extrabold text-indigo-600">01</span>
                <h4 className="text-sm font-bold text-slate-900">Build Profile</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Students enter academic information, skills, projects and certifications.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-indigo-600 font-semibold">
                <span>Multi-branch taxonomy</span>
              </div>
            </div>

            {/* Step 02 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-2xl font-extrabold text-indigo-600">02</span>
                <h4 className="text-sm font-bold text-slate-900">Measure Skills</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Assessments and skill information identify strengths and gaps.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-indigo-600 font-semibold">
                <span>Interactive quizzes</span>
              </div>
            </div>

            {/* Step 03 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-2xl font-extrabold text-indigo-600">03</span>
                <h4 className="text-sm font-bold text-slate-900">Discover Opportunities</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Jobs and internships are matched according to the student's actual profile.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-indigo-600 font-semibold">
                <span>Algorithmic match %</span>
              </div>
            </div>

            {/* Step 04 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-2xl font-extrabold text-indigo-600">04</span>
                <h4 className="text-sm font-bold text-slate-900">Build Careers</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Students improve their readiness and connect with industry opportunities.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-indigo-600 font-semibold">
                <span>Direct application pipeline</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. STAKEHOLDERS */}
      <section id="stakeholders" className="py-14 sm:py-18 bg-white border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600">Built for Every Role</h2>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900">Empowering All Stakeholders</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Student */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-200 transition space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Student</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Build your skill profile, identify gaps and discover relevant career opportunities.
              </p>
            </div>

            {/* University */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-200 transition space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                <Building className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">University</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Understand student skill readiness and industry demand.
              </p>
            </div>

            {/* Faculty */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-200 transition space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Faculty</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Guide students based on their skill gaps and career goals.
              </p>
            </div>

            {/* Industry */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-200 transition space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                <Briefcase className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Industry</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Find candidates based on actual skills and requirements.
              </p>
            </div>

            {/* Placement Officer */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-200 transition space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <FileCheck className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Placement Officer</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Manage opportunities and understand placement readiness.
              </p>
            </div>

            {/* Government */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-200 transition space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Government</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Understand aggregated skill demand and supply.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CORE FEATURES */}
      <section id="core-features" className="py-14 sm:py-18 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600">Platform Capabilities</h2>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900">Core Implemented Features</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'Skill Mapping', desc: 'Categorized taxonomy spanning mechanical, civil, electronics, computing and management disciplines.' },
              { title: 'Skill Assessment', desc: 'Category-based technical and aptitude assessments with live scoring and recorded attempts.' },
              { title: 'Skill Gap Analysis', desc: 'Role-specific comparison categorizing skills into Strong, Needs Improvement, and Missing.' },
              { title: 'Job Readiness', desc: 'Dynamic weighted formula (20% Academic + 40% Skills + 20% Assessment + 10% Projects + 10% Certs).' },
              { title: 'Career Readiness', desc: 'Target career threshold matching with instant gap feedback when switching career roles.' },
              { title: 'Job & Internship Matching', desc: 'Live match percentage derived from degree, branch, CGPA, and overlapping verified skills.' },
              { title: 'Applications', desc: 'Real-time application pipeline with recruiter status tracking (Shortlisted, Interview, Selected).' },
              { title: 'Placement Insights', desc: 'University and institutional analytics tracking branch employability and placement rates.' },
              { title: 'Industry Collaboration', desc: 'Recruiter portal to publish openings, search qualified candidate directories, and review applicants.' }
            ].map((feature) => (
              <div key={feature.title} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-1.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-xs font-bold text-slate-900">{feature.title}</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. DYNAMIC DATA MESSAGE */}
      <section className="py-14 sm:py-18 bg-white border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-md space-y-4">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Core Architectural Principle</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Your readiness is calculated from your data.
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              SkillBridge does not rely on fixed scores. Your skills, academic information, assessments, projects and career goals influence your readiness and recommendations.
            </p>

            {/* Formula Breakdown Cards */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
              <div className="bg-white/10 rounded-xl p-2.5 border border-white/10">
                <span className="font-extrabold text-amber-300 text-sm block">20%</span>
                <span className="text-[10px] text-slate-300">Academic CGPA</span>
              </div>
              <div className="bg-white/10 rounded-xl p-2.5 border border-white/10">
                <span className="font-extrabold text-indigo-300 text-sm block">40%</span>
                <span className="text-[10px] text-slate-300">Skills Bank</span>
              </div>
              <div className="bg-white/10 rounded-xl p-2.5 border border-white/10">
                <span className="font-extrabold text-emerald-300 text-sm block">20%</span>
                <span className="text-[10px] text-slate-300">Assessments</span>
              </div>
              <div className="bg-white/10 rounded-xl p-2.5 border border-white/10">
                <span className="font-extrabold text-purple-300 text-sm block">10%</span>
                <span className="text-[10px] text-slate-300">Projects</span>
              </div>
              <div className="bg-white/10 rounded-xl p-2.5 border border-white/10 col-span-2 sm:col-span-1">
                <span className="font-extrabold text-cyan-300 text-sm block">10%</span>
                <span className="text-[10px] text-slate-300">Certifications</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CALL TO ACTION */}
      <section className="py-14 sm:py-20 bg-slate-50 text-center border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Ready to build your career with SkillBridge?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Join thousands of engineering students, prestigious universities, and forward-thinking recruiters accelerating career readiness.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('/register')}
              className="w-full sm:w-auto px-6 py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition cursor-pointer"
            >
              Create Account
            </button>
            <button
              onClick={() => onNavigate('/login')}
              className="w-full sm:w-auto px-6 py-3 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-2xs transition cursor-pointer"
            >
              Login
            </button>
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer id="about" className="py-10 bg-white text-slate-600 text-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-bold text-slate-900">SkillBridge</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Connecting skills, academia and industry.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-600">
            <button
              onClick={() => scrollToSection('top')}
              className="hover:text-indigo-600 cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('/login')}
              className="hover:text-indigo-600 cursor-pointer"
            >
              Login
            </button>
            <button
              onClick={() => onNavigate('/register')}
              className="hover:text-indigo-600 cursor-pointer"
            >
              Register
            </button>
            <button
              onClick={() => scrollToSection('stakeholders')}
              className="hover:text-indigo-600 cursor-pointer"
            >
              About
            </button>
          </div>

          <div className="text-[11px] text-slate-400">
            &copy; SkillBridge
          </div>
        </div>
      </footer>
    </div>
  );
};
