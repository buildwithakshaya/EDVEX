import React from 'react';
import { UserRole } from '../../types';
import {
  LayoutDashboard,
  User,
  Zap,
  Award,
  TrendingUp,
  Briefcase,
  FileCheck,
  Building2,
  Users,
  GraduationCap,
  PieChart,
  ShieldCheck,
  FileText,
  Target,
  Layers,
  HelpCircle,
  BookOpen,
  Trophy,
  Sparkles,
  AlertTriangle,
  FolderKanban,
  Cpu,
  Compass
} from 'lucide-react';

interface SidebarProps {
  role: UserRole;
  currentTab: string;
  onSelectTab: (tabId: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const Sidebar: React.FC<SidebarProps> = ({
  role,
  currentTab,
  onSelectTab,
  isOpenMobile = false,
  onCloseMobile
}) => {
  const getNavItems = (): NavItem[] => {
    switch (role) {
      case 'student':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'profile', label: 'My Profile', icon: User },
          { id: 'skills', label: 'Skills', icon: Zap },
          { id: 'assessment', label: 'Assessment', icon: Award },
          { id: 'skillgap', label: 'Skill Gap', icon: TrendingUp },
          { id: 'roadmap', label: 'AI Career Roadmap', icon: Compass },
          { id: 'courses', label: 'Courses & Certifications', icon: BookOpen },
          { id: 'hackathons', label: 'Hackathons', icon: Trophy },
          { id: 'companies_matching', label: 'Companies', icon: Sparkles },
          { id: 'opportunities', label: 'Jobs & Internships', icon: Briefcase },
          { id: 'applications', label: 'Applications', icon: FileCheck }
        ];

      case 'industry':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'company_profile', label: 'Company Profile', icon: Building2 },
          { id: 'jobs_internships', label: 'Jobs & Internships', icon: Briefcase },
          { id: 'candidates', label: 'Candidates', icon: Users },
          { id: 'applications', label: 'Applications', icon: FileCheck }
        ];

      case 'university':
        return [
          { id: 'dashboard', label: 'University Overview', icon: LayoutDashboard },
          { id: 'skill_demand', label: 'Industry Skill Demand', icon: TrendingUp },
          { id: 'academic_insights', label: 'Academic Skill Insights', icon: PieChart },
          { id: 'industry_connections', label: 'Industry Connection', icon: Building2 },
          { id: 'students', label: 'Students Directory', icon: Users }
        ];

      case 'faculty':
        return [
          { id: 'dashboard', label: 'Faculty Overview', icon: LayoutDashboard },
          { id: 'my_students', label: 'My Students', icon: Users },
          { id: 'skill_analysis', label: 'Student Skill Analysis', icon: PieChart },
          { id: 'recommendations', label: 'Course Recommendations', icon: BookOpen },
          { id: 'emerging_tech', label: 'Emerging Technologies', icon: Cpu }
        ];

      case 'placement':
        return [
          { id: 'dashboard', label: 'Placement Overview', icon: LayoutDashboard },
          { id: 'preparation', label: 'Placement Preparation', icon: FolderKanban },
          { id: 'risk_detector', label: 'AI Placement Risk Detector', icon: AlertTriangle },
          { id: 'campaigns', label: 'Campaign Planner', icon: Compass },
          { id: 'readiness_analysis', label: 'Readiness Analysis', icon: PieChart },
          { id: 'placement_drives', label: 'Company Drives', icon: Target }
        ];

      case 'government':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'skill_intelligence', label: 'Skill Intelligence', icon: PieChart },
          { id: 'reports', label: 'Reports', icon: FileText }
        ];

      case 'admin':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'users', label: 'Users', icon: Users },
          { id: 'branches', label: 'Branches', icon: Layers },
          { id: 'skills', label: 'Skills', icon: Zap },
          { id: 'career_roles', label: 'Career Roles', icon: Target },
          { id: 'assessments', label: 'Assessments', icon: HelpCircle }
        ];

      default:
        return [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }];
    }
  };

  const navItems = getNavItems();

  const roleTitleMap: Record<UserRole, string> = {
    student: 'Student Portal',
    industry: 'Industry Portal',
    university: 'University Portal',
    faculty: 'Faculty Mentor',
    placement: 'Placement Officer',
    government: 'Government Policy',
    admin: 'System Admin'
  };

  const content = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 w-64 select-none">
      {/* Role Banner */}
      <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/70">
        <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">Current View</p>
        <div className="flex items-center gap-2 mt-0.5">
          <ShieldCheck className="w-4 h-4 text-indigo-600" />
          <span className="text-sm font-bold text-slate-800">{roleTitleMap[role] || 'Dashboard'}</span>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold rounded-xl transition duration-150 cursor-pointer text-left ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-100 text-[11px] text-slate-400">
        <div className="flex items-center justify-between font-medium">
          <span>SkillBridge SIH</span>
          <span className="text-indigo-600">v2.0 Active</span>
        </div>
        <p className="mt-1 text-[10px] text-slate-400">Dynamic AI & Criteria Engine</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block shrink-0">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 z-50 flex shadow-2xl animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
