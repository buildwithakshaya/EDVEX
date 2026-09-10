import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../db/storage';
import {
  calculateJobReadiness,
  calculateCareerReadiness,
  calculateOpportunityMatch
} from '../../utils/calculations';
import {
  Briefcase,
  Award,
  Zap,
  TrendingUp,
  FileCheck,
  ChevronRight,
  AlertCircle,
  FolderGit2,
  Compass
} from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { CoursesSection } from './components/CoursesSection';
import { HackathonsSection } from './components/HackathonsSection';
import { CompaniesMatchingSection } from './components/CompaniesMatchingSection';

interface StudentDashboardProps {
  onNavigate: (tab: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigate }) => {
  const { studentProfile } = useAuth();

  if (!studentProfile) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Complete your profile to calculate Job Readiness."
        description="Your profile provides the baseline data for branch mapping, academic performance, and career goals."
        actionLabel="Create Profile"
        onAction={() => onNavigate('profile')}
      />
    );
  }

  // Load real records from the persistent database
  const studentSkills = db.getStudentSkills(studentProfile.id);
  const projects = db.getProjects(studentProfile.id);
  const certs = db.getCertifications(studentProfile.id);
  const attempts = db.getAssessmentAttempts(studentProfile.id);
  const applications = db.getApplicationsByStudent(studentProfile.id);
  const allSkills = db.getSkills();
  const opportunities = db.getOpportunities().filter(o => o.status === 'Open');
  const careerRoles = db.getCareerRoles();
  const branches = db.getBranches();

  const studentBranch = branches.find(b => b.id === studentProfile.branchId);

  // 10. Dynamic Job Readiness Calculation
  const readiness = calculateJobReadiness(studentProfile, studentSkills, attempts, projects, certs);

  // 11-13. Target Career & Skill Gap
  const targetRole = careerRoles.find(r => r.title === studentProfile.careerGoal) || careerRoles[0];
  const careerAnalysis = targetRole 
    ? calculateCareerReadiness(studentProfile, studentSkills, targetRole, allSkills, attempts, projects)
    : null;

  // 16. Dynamic matching opportunities
  const matchedOpportunities = opportunities
    .map(opp => calculateOpportunityMatch(studentProfile, studentSkills, opp, allSkills))
    .sort((a, b) => b.matchPercentage - a.matchPercentage)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Top Welcome / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Welcome back, {studentProfile.fullName}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {studentBranch ? studentBranch.name : 'Engineering'} &bull; CGPA {studentProfile.cgpa > 0 ? studentProfile.cgpa.toFixed(1) : 'Not entered'} &bull; Target: <span className="font-semibold text-slate-700">{studentProfile.careerGoal || 'Not selected'}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('skills')}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition shadow-xs cursor-pointer"
          >
            + Add Skill
          </button>
          <button
            onClick={() => onNavigate('assessment')}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition shadow-xs cursor-pointer"
          >
            Take Assessment
          </button>
          <button
            onClick={() => onNavigate('roadmap')}
            className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 rounded-lg transition shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-indigo-600" />
            AI Career Roadmap
          </button>
        </div>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Job Readiness"
          value={readiness.isComplete ? `${readiness.overall}%` : 'Incomplete'}
          subtitle={readiness.isComplete ? 'Dynamic calculation' : 'Profile needs info'}
          icon={<Award className="w-5 h-5" />}
          highlight={true}
          color="indigo"
          onClick={() => onNavigate('profile')}
        />

        <StatCard
          title="Verified Skills"
          value={studentSkills.length}
          subtitle={studentSkills.length === 0 ? 'No skills mapped' : `${studentSkills.filter(s => s.proficiency === 'Advanced' || s.proficiency === 'Expert').length} advanced/expert`}
          icon={<Zap className="w-5 h-5" />}
          color="blue"
          onClick={() => onNavigate('skills')}
        />

        <StatCard
          title="Target Role Fit"
          value={careerAnalysis ? `${careerAnalysis.careerReadiness}%` : 'N/A'}
          subtitle={targetRole ? targetRole.title : 'Select career'}
          icon={<TrendingUp className="w-5 h-5" />}
          color="emerald"
          onClick={() => onNavigate('skillgap')}
        />

        <StatCard
          title="Applications"
          value={applications.length}
          subtitle={applications.length === 0 ? 'No applications yet' : `${applications.filter(a => a.status === 'Shortlisted' || a.status === 'Selected').length} active offers/shortlists`}
          icon={<FileCheck className="w-5 h-5" />}
          color="amber"
          onClick={() => onNavigate('applications')}
        />
      </div>

      {/* HERO SECTION: JOB READINESS BREAKDOWN */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Dynamic Job Readiness Engine</h2>
              <Badge variant="indigo" size="sm">Calculated from Real DB</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Formula: Academic (20%) + Skills (40%) + Assessments (20%) + Projects (10%) + Certifications (10%)
            </p>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900">
              {readiness.isComplete ? `${readiness.overall}%` : '0%'}
            </span>
            <span className="text-xs text-slate-500">
              {readiness.overall >= 75 ? 'Industry Ready' : readiness.overall >= 50 ? 'Intermediate Prep' : 'Needs Development'}
            </span>
          </div>
        </div>

        {!readiness.isComplete ? (
          <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-xs font-semibold text-amber-800">
              Complete your profile to calculate Job Readiness.
            </p>
            <ul className="mt-1 text-xs text-amber-700 list-disc list-inside space-y-0.5">
              {readiness.incompleteReasons.map((reason, idx) => (
                <li key={idx}>{reason}</li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mt-5">
            {/* Academic */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">Academic</span>
                <span className="font-bold text-slate-900">{readiness.academicScore}%</span>
              </div>
              <ProgressBar value={readiness.academicScore} size="sm" color="auto" />
              <p className="text-[11px] text-slate-500">Weight 20% &bull; CGPA {studentProfile.cgpa}</p>
            </div>

            {/* Skills */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">Skills</span>
                <span className="font-bold text-slate-900">{readiness.skillsScore}%</span>
              </div>
              <ProgressBar value={readiness.skillsScore} size="sm" color="auto" />
              <p className="text-[11px] text-slate-500">Weight 40% &bull; {studentSkills.length} skills mapped</p>
            </div>

            {/* Assessments */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">Assessment</span>
                <span className="font-bold text-slate-900">{readiness.assessmentScore}%</span>
              </div>
              <ProgressBar value={readiness.assessmentScore} size="sm" color="auto" />
              <p className="text-[11px] text-slate-500">Weight 20% &bull; {attempts.length} attempts</p>
            </div>

            {/* Projects */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">Projects</span>
                <span className="font-bold text-slate-900">{readiness.projectsScore}%</span>
              </div>
              <ProgressBar value={readiness.projectsScore} size="sm" color="auto" />
              <p className="text-[11px] text-slate-500">Weight 10% &bull; {projects.length} added</p>
            </div>

            {/* Certifications */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">Certs</span>
                <span className="font-bold text-slate-900">{readiness.certificationsScore}%</span>
              </div>
              <ProgressBar value={readiness.certificationsScore} size="sm" color="auto" />
              <p className="text-[11px] text-slate-500">Weight 10% &bull; {certs.length} verified</p>
            </div>
          </div>
        )}
      </div>

      {/* TWO COLUMN GRID: SKILL GAP & MATCHING OPPORTUNITIES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SKILL GAP OVERVIEW */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Career Skill Gap Analysis</h3>
                <p className="text-xs text-slate-500">Target Role: {targetRole?.title}</p>
              </div>
              <button
                onClick={() => onNavigate('skillgap')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                Full Gap Map <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {careerAnalysis && careerAnalysis.skillGapList.length > 0 ? (
              <div className="mt-4 space-y-2.5">
                {careerAnalysis.skillGapList.slice(0, 4).map((item) => (
                  <div
                    key={item.skillId}
                    className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs"
                  >
                    <div>
                      <span className="font-semibold text-slate-800">{item.skillName}</span>
                      <span className="text-[11px] text-slate-400 ml-2">
                        Req: {item.requiredProficiency} &bull; Mine: {item.studentProficiency}
                      </span>
                    </div>
                    <Badge
                      variant={
                        item.status === 'Strong'
                          ? 'emerald'
                          : item.status === 'Needs Improvement'
                          ? 'amber'
                          : 'rose'
                      }
                      size="sm"
                    >
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="p-6 text-center text-xs text-slate-400">
                Add skills to compare against required career competencies.
              </p>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Strong: <b>{careerAnalysis?.strongCount || 0}</b> &bull; Needs Work: <b>{careerAnalysis?.needsImprovementCount || 0}</b> &bull; Missing: <b>{careerAnalysis?.missingCount || 0}</b>
            </span>
            <button
              onClick={() => onNavigate('skills')}
              className="text-indigo-600 font-semibold hover:underline cursor-pointer"
            >
              Update Skills
            </button>
          </div>
        </div>

        {/* DYNAMIC MATCHING OPPORTUNITIES */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Top Matching Opportunities</h3>
                <p className="text-xs text-slate-500">Calculated from your branch, CGPA, & skills</p>
              </div>
              <button
                onClick={() => onNavigate('opportunities')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                View All ({opportunities.length}) <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {matchedOpportunities.length > 0 ? (
              <div className="mt-4 space-y-3">
                {matchedOpportunities.map(({ opportunity, matchPercentage, explanation }) => (
                  <div
                    key={opportunity.id}
                    className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-lg border border-slate-200/80 transition"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-bold text-slate-900">{opportunity.title}</span>
                        <p className="text-[11px] text-slate-500">{opportunity.companyName} &bull; {opportunity.location}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                          {matchPercentage}% Match
                        </span>
                        <p className="text-[10px] text-slate-400 mt-0.5">{opportunity.type}</p>
                      </div>
                    </div>
                    <p className="mt-1.5 text-[11px] text-slate-600 italic leading-snug">
                      "{explanation}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="p-6 text-center text-xs text-slate-400">
                No matching opportunities available.
              </p>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-right">
            <button
              onClick={() => onNavigate('opportunities')}
              className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
            >
              Apply to opportunities &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: COMPANIES MATCHING YOU */}
      <CompaniesMatchingSection
        studentProfile={studentProfile}
        studentSkills={studentSkills}
        limit={3}
        onViewAll={() => onNavigate('companies_matching')}
        onNavigateToApplications={() => onNavigate('applications')}
      />

      {/* SECTION 2: COURSES & CERTIFICATIONS */}
      <CoursesSection
        studentProfile={studentProfile}
        studentSkills={studentSkills}
        skillGaps={careerAnalysis?.skillGapList || []}
        limit={3}
        onViewAll={() => onNavigate('courses')}
      />

      {/* SECTION 3: HACKATHONS */}
      <HackathonsSection
        studentProfile={studentProfile}
        studentSkills={studentSkills}
        limit={2}
        onViewAll={() => onNavigate('hackathons')}
      />
    </div>
  );
};
