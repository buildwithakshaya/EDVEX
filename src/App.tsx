import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { AuthModal } from './components/auth/AuthModal';

// Landing and Auth pages
import { LandingPage } from './views/landing/LandingPage';
import { LoginPage } from './views/auth/LoginPage';
import { RegisterPage } from './views/auth/RegisterPage';

// Student views
import { StudentDashboard } from './views/student/StudentDashboard';
import { StudentProfileView } from './views/student/StudentProfileView';
import { StudentSkillsView } from './views/student/StudentSkillsView';
import { StudentProjectsView } from './views/student/StudentProjectsView';
import { StudentAssessmentView } from './views/student/StudentAssessmentView';
import { StudentSkillGapView } from './views/student/StudentSkillGapView';
import { StudentOpportunitiesView } from './views/student/StudentOpportunitiesView';
import { StudentApplicationsView } from './views/student/StudentApplicationsView';
import { StudentCoursesView } from './views/student/StudentCoursesView';
import { StudentHackathonsView } from './views/student/StudentHackathonsView';
import { StudentMatchingCompaniesView } from './views/student/StudentMatchingCompaniesView';
import { StudentRoadmapView } from './views/student/StudentRoadmapView';

// Stakeholder portals
import { IndustryPortal } from './views/industry/IndustryPortal';
import { UniversityPortal } from './views/university/UniversityPortal';
import { FacultyDashboard } from './views/faculty/FacultyDashboard';
import { PlacementOfficerDashboard } from './views/placement/PlacementOfficerDashboard';
import { GovernmentPortal } from './views/government/GovernmentPortal';
import { AdminPortal } from './views/admin/AdminPortal';

import { Menu, PlayCircle, X, CheckCircle2, ChevronRight, HelpCircle, ShieldAlert } from 'lucide-react';
import { UserRole } from './types';

function AppContent() {
  const { currentUser, switchUser, isLoading } = useAuth();
  
  // Track URL path
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showDemoGuide, setShowDemoGuide] = useState(false);
  const [accessDeniedMessage, setAccessDeniedMessage] = useState<string | null>(null);

  // Synchronize browser history and path changes
  const navigate = useCallback((newPath: string) => {
    setCurrentPath(newPath);
    setAccessDeniedMessage(null);
    if (typeof window !== 'undefined') {
      if (window.location.pathname !== newPath) {
        window.history.pushState(null, '', newPath);
      }
    }
  }, []);

  // Listen to popstate (browser Back and Forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
      setAccessDeniedMessage(null);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync tab with path if user is navigating dashboard tabs
  useEffect(() => {
    const parts = currentPath.split('/').filter(Boolean);
    if (parts.length >= 2 && ['student', 'industry', 'university', 'faculty', 'placement', 'government', 'admin'].includes(parts[0])) {
      setCurrentTab(parts[1]);
    } else if (parts.length === 1 && ['student', 'industry', 'university', 'faculty', 'placement', 'government', 'admin'].includes(parts[0])) {
      setCurrentTab('dashboard');
    }
  }, [currentPath]);

  // When switching tab via sidebar or in-view navigation
  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    if (currentUser) {
      navigate(`/${currentUser.role}/${tab}`);
    }
  };

  // Wait for initial auth state loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-500">Loading SkillBridge...</span>
        </div>
      </div>
    );
  }

  // 1. LANDING PAGE ROUTE
  if (currentPath === '/' || currentPath === '') {
    return <LandingPage onNavigate={navigate} />;
  }

  // 2. LOGIN ROUTE
  if (currentPath === '/login') {
    // If already logged in, redirect to user's dashboard
    if (currentUser) {
      const targetDashboard = `/${currentUser.role}/dashboard`;
      navigate(targetDashboard);
      return null;
    }
    return <LoginPage onNavigate={navigate} />;
  }

  // 3. REGISTER ROUTE
  if (currentPath === '/register') {
    // If already logged in, redirect to user's dashboard
    if (currentUser) {
      const targetDashboard = `/${currentUser.role}/dashboard`;
      navigate(targetDashboard);
      return null;
    }
    return <RegisterPage onNavigate={navigate} />;
  }

  // 4. PROTECTED DASHBOARD ROUTES (/student/*, /industry/*, etc.)
  const isDashboardRoute = /^\/(student|industry|university|faculty|placement|government|admin)(\/.*)?$/.test(currentPath);

  if (isDashboardRoute) {
    // Unauthenticated user attempting to access dashboard
    if (!currentUser) {
      navigate('/login');
      return null;
    }

    // Role-based protection check:
    // Extract target role from the path
    const targetRoleMatch = currentPath.match(/^\/(student|industry|university|faculty|placement|government|admin)/);
    const targetRole = targetRoleMatch ? (targetRoleMatch[1] as UserRole) : null;

    if (targetRole && targetRole !== currentUser.role) {
      // If user tries to access another role's dashboard without switching
      // Prevent cross-role access and redirect to their own dashboard
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-6 shadow-xs text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-slate-900">Access Restricted</h2>
            <p className="text-xs text-slate-600">
              You are signed in as a <b className="capitalize text-slate-900">{currentUser.role}</b>. You cannot access the <b className="capitalize text-slate-900">{targetRole}</b> portal directly.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
              <button
                onClick={() => navigate(`/${currentUser.role}/dashboard`)}
                className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition cursor-pointer"
              >
                Go to My Dashboard
              </button>
              <button
                onClick={() => {
                  // Allow quick switch for demonstration purposes if desired
                  const matchingUser = (currentUser as any).allUsers?.find((u: any) => u.role === targetRole);
                  if (matchingUser) {
                    switchUser(matchingUser.id);
                  } else {
                    navigate(`/${currentUser.role}/dashboard`);
                  }
                }}
                className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
              >
                Switch Role to {targetRole}
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  // 5. RENDER AUTHENTICATED DASHBOARD VIEWS
  const renderCurrentView = () => {
    if (!currentUser) return null;

    switch (currentUser.role) {
      case 'student':
        switch (currentTab) {
          case 'dashboard':
            return <StudentDashboard onNavigate={handleTabChange} />;
          case 'profile':
            return <StudentProfileView />;
          case 'skills':
            return <StudentSkillsView />;
          case 'projects':
            return <StudentProjectsView />;
          case 'assessment':
            return <StudentAssessmentView />;
          case 'skillgap':
            return <StudentSkillGapView onNavigate={handleTabChange} />;
          case 'roadmap':
            return <StudentRoadmapView onNavigate={handleTabChange} />;
          case 'courses':
            return <StudentCoursesView />;
          case 'hackathons':
            return <StudentHackathonsView />;
          case 'companies_matching':
            return <StudentMatchingCompaniesView />;
          case 'opportunities':
            return <StudentOpportunitiesView />;
          case 'applications':
            return <StudentApplicationsView onNavigate={handleTabChange} />;
          default:
            return <StudentDashboard onNavigate={handleTabChange} />;
        }

      case 'industry':
        return <IndustryPortal currentTab={currentTab} onNavigate={handleTabChange} />;

      case 'university':
        return <UniversityPortal currentTab={currentTab} onNavigate={handleTabChange} portalMode="university" />;

      case 'faculty':
        return <FacultyDashboard currentTab={currentTab} onNavigate={handleTabChange} />;

      case 'placement':
        return <PlacementOfficerDashboard currentTab={currentTab} onNavigate={handleTabChange} />;

      case 'government':
        return <GovernmentPortal />;

      case 'admin':
        return <AdminPortal currentTab={currentTab} />;

      default:
        return <StudentDashboard onNavigate={handleTabChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onTabChange={handleTabChange}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onNavigate={navigate}
      />

      {/* Main Shell */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          role={currentUser?.role || 'student'}
          currentTab={currentTab}
          onSelectTab={handleTabChange}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Content View Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {/* Mobile hamburger row */}
          <div className="lg:hidden flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 text-slate-600 hover:bg-slate-200/60 rounded-lg flex items-center gap-1.5 text-xs font-semibold"
            >
              <Menu className="w-4 h-4" />
              <span>Menu</span>
            </button>
            <span className="text-xs font-bold text-slate-700 capitalize">
              {currentUser?.role || 'Guest'} &bull; {currentTab}
            </span>
          </div>

          {/* Render Active View */}
          <div className="max-w-6xl mx-auto">
            {renderCurrentView()}
          </div>
        </main>
      </div>

      {/* SIH Final Demonstration Walkthrough Floating Helper */}
      <aside aria-label="SIH Dynamic Demo Flow" className="fixed bottom-4 right-4 z-40">
        {!showDemoGuide ? (
          <button
            onClick={() => setShowDemoGuide(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-indigo-950 text-white rounded-full shadow-lg hover:bg-slate-900 transition border border-indigo-700 text-xs font-bold cursor-pointer"
          >
            <PlayCircle className="w-4 h-4 text-emerald-400" />
            <span>SIH Demo Guide (19 Steps)</span>
          </button>
        ) : (
          <div className="w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <PlayCircle className="w-4 h-4 text-emerald-600" />
                <h2 className="text-xs font-bold text-slate-900">SIH Dynamic Verification Flow</h2>
              </div>
              <button
                onClick={() => setShowDemoGuide(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-2 max-h-72 overflow-y-auto space-y-2 text-[11px] text-slate-600 leading-snug">
              <div className="p-2 rounded-lg bg-indigo-50/70 border border-indigo-100">
                <span className="font-bold text-indigo-900">1. Student Profile & Multi-Branch:</span>
                <p className="mt-0.5 text-slate-600">
                  Open <b>My Profile</b>. Notice branch (Mechanical/Civil/CSE) & CGPA. Change CGPA or branch & click Save.
                </p>
              </div>

              <div className="p-2 rounded-lg bg-indigo-50/70 border border-indigo-100">
                <span className="font-bold text-indigo-900">2. Dynamic Job Readiness:</span>
                <p className="mt-0.5 text-slate-600">
                  Job readiness is calculated: Academic (20%) + Skills (40%) + Assessment (20%) + Projects (10%) + Certs (10%).
                </p>
              </div>

              <div className="p-2 rounded-lg bg-indigo-50/70 border border-indigo-100">
                <span className="font-bold text-indigo-900">3. Live Recalculation on Skill Change:</span>
                <p className="mt-0.5 text-slate-600">
                  Go to <b>Skills</b>. Change proficiency of a skill from Beginner to Expert, or add a skill. Return to Dashboard: readiness immediately jumps!
                </p>
              </div>

              <div className="p-2 rounded-lg bg-indigo-50/70 border border-indigo-100">
                <span className="font-bold text-indigo-900">4. Dynamic Career Skill Gap:</span>
                <p className="mt-0.5 text-slate-600">
                  Go to <b>Skill Gap</b>. Change career goal from 'Mechanical Design Engineer' to 'Data Analyst'. Missing and strong skills re-analyze instantly!
                </p>
              </div>

              <div className="p-2 rounded-lg bg-indigo-50/70 border border-indigo-100">
                <span className="font-bold text-indigo-900">5. Assessment Scoring:</span>
                <p className="mt-0.5 text-slate-600">
                  Go to <b>Assessment</b>. Take a test. Instant score updates your assessment quota in Job Readiness.
                </p>
              </div>

              <div className="p-2 rounded-lg bg-indigo-50/70 border border-indigo-100">
                <span className="font-bold text-indigo-900">6. Real Opportunity Matching:</span>
                <p className="mt-0.5 text-slate-600">
                  Go to <b>Opportunities</b>. Match % and reason (e.g. "Strong match in SolidWorks...") are computed from actual profile data. Click <b>Apply</b>.
                </p>
              </div>

              <div className="p-2 rounded-lg bg-indigo-50/70 border border-indigo-100">
                <span className="font-bold text-indigo-900">7. Switch to Industry / University:</span>
                <p className="mt-0.5 text-slate-600">
                  Use the <b>Role Switcher</b> in the top navbar. In Industry, update application status to 'Shortlisted'. Switch back to Student: status is live!
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
              <span>Dynamic DB Engine Active</span>
              <button
                onClick={() => {
                  switchUser('u_industry');
                  setShowDemoGuide(false);
                }}
                className="text-indigo-600 font-bold hover:underline cursor-pointer"
              >
                Quick Switch to Industry &rarr;
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Auth / Register Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
