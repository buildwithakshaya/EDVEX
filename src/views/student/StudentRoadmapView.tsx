import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../db/storage';
import {
  CareerRoadmap,
  RoadmapItemStatus,
  LearningTimeOption,
  LearningModeOption,
  TargetPeriodOption
} from '../../types';
import { calculateJobReadiness, calculateCareerReadiness } from '../../utils/calculations';
import { generateAICareerRoadmap } from '../../utils/roadmapGenerator';
import {
  Compass,
  Sparkles,
  CheckCircle2,
  Clock,
  BookOpen,
  FolderGit2,
  Calendar,
  Layers,
  ArrowRight,
  RefreshCw,
  Award,
  TrendingUp,
  AlertCircle,
  ExternalLink,
  Target,
  Briefcase,
  Zap,
  Building2,
  FileCheck2,
  Check
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';

interface StudentRoadmapViewProps {
  onNavigate?: (tab: string, filter?: any) => void;
}

export const StudentRoadmapView: React.FC<StudentRoadmapViewProps> = ({ onNavigate }) => {
  const { studentProfile } = useAuth();

  // Database accessors
  const allSkills = db.getSkills();
  const careerRoles = db.getCareerRoles();
  const allCourses = db.getCourses();
  const branches = db.getBranches();

  // Local state
  const [activeTab, setActiveTab] = useState<'stages' | 'projects' | 'weekly' | 'strategy'>('stages');
  const [isGenerating, setIsGenerating] = useState(false);
  const [projectAddedMessage, setProjectAddedMessage] = useState<string | null>(null);

  // Load existing roadmap from persistent DB
  const [roadmap, setRoadmap] = useState<CareerRoadmap | undefined>(() => {
    if (!studentProfile) return undefined;
    return db.getCareerRoadmap(studentProfile.id);
  });

  // Mode: Show config form if no roadmap exists or if user clicks "Customize / Reconfigure"
  const [isConfiguring, setIsConfiguring] = useState<boolean>(() => !roadmap);

  // Configuration form fields (pre-populated from profile)
  const [targetCareer, setTargetCareer] = useState<string>(() => {
    return roadmap?.targetCareer || studentProfile?.careerGoal || careerRoles[0]?.title || '';
  });

  const [currentSkillLevel, setCurrentSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>(() => {
    return roadmap?.currentSkillLevel || 'Intermediate';
  });

  const [weeklyLearningTime, setWeeklyLearningTime] = useState<LearningTimeOption>(() => {
    return roadmap?.weeklyLearningTime || '5–7 hours/week';
  });

  const [learningMode, setLearningMode] = useState<LearningModeOption>(() => {
    return roadmap?.learningMode || (studentProfile?.preferredWorkMode as LearningModeOption) || 'Hybrid';
  });

  const [targetPeriod, setTargetPeriod] = useState<TargetPeriodOption>(() => {
    return roadmap?.targetPeriod || '6 months';
  });

  if (!studentProfile) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
        <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
        <h2 className="text-base font-bold text-slate-800">Student Profile Required</h2>
        <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
          Please complete your student profile with branch, semester, and academic information before generating an AI Career Roadmap.
        </p>
        {onNavigate && (
          <button
            onClick={() => onNavigate('profile')}
            className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
          >
            Go to My Profile
          </button>
        )}
      </div>
    );
  }

  // Live dynamic student data
  const studentSkills = db.getStudentSkills(studentProfile.id);
  const attempts = db.getAssessmentAttempts(studentProfile.id);
  const projects = db.getProjects(studentProfile.id);
  const certifications = db.getCertifications(studentProfile.id);
  const branch = branches.find(b => b.id === studentProfile.branchId);
  const branchName = branch ? branch.name : (studentProfile.department || 'Engineering');

  const readiness = calculateJobReadiness(studentProfile, studentSkills, attempts, projects, certifications);

  const selectedTargetRole = careerRoles.find(r => r.title.toLowerCase() === targetCareer.toLowerCase()) ||
    careerRoles.find(r => r.branchIds.includes(studentProfile.branchId)) ||
    careerRoles[0];

  const careerAnalysis = selectedTargetRole
    ? calculateCareerReadiness(studentProfile, studentSkills, selectedTargetRole, allSkills, attempts, projects)
    : null;

  // Real identified gaps
  const identifiedGaps = careerAnalysis?.skillGapList?.filter(
    g => g.status === 'Missing' || g.status === 'Needs Improvement'
  ) || [];

  // Handler: Generate or Regenerate Roadmap
  const handleGenerateRoadmap = () => {
    setIsGenerating(true);

    setTimeout(() => {
      try {
        const newRoadmap = generateAICareerRoadmap(
          studentProfile,
          studentSkills,
          attempts,
          projects,
          certifications,
          allSkills,
          careerRoles,
          allCourses,
          branches,
          {
            targetCareer,
            currentSkillLevel,
            weeklyLearningTime,
            learningMode,
            targetPeriod
          }
        );

        db.saveCareerRoadmap(newRoadmap);
        setRoadmap(newRoadmap);
        setIsConfiguring(false);
      } catch (err) {
        console.error('Failed to generate roadmap', err);
      } finally {
        setIsGenerating(false);
      }
    }, 400);
  };

  // Handler: Toggle Item Status
  const handleToggleItemStatus = (itemId: string, currentStatus: RoadmapItemStatus) => {
    if (!roadmap) return;
    const nextStatus: RoadmapItemStatus =
      currentStatus === 'Completed'
        ? 'Not Started'
        : currentStatus === 'In Progress'
        ? 'Completed'
        : 'In Progress';

    db.updateRoadmapItemStatus(roadmap.id, itemId, nextStatus);
    const updated = db.getCareerRoadmap(studentProfile.id);
    if (updated) setRoadmap({ ...updated });
  };

  // Handler: Toggle Project Status
  const handleToggleProjectStatus = (projectId: string, currentStatus: RoadmapItemStatus) => {
    if (!roadmap) return;
    const nextStatus: RoadmapItemStatus =
      currentStatus === 'Completed'
        ? 'Not Started'
        : currentStatus === 'In Progress'
        ? 'Completed'
        : 'In Progress';

    db.updateRoadmapProjectStatus(roadmap.id, projectId, nextStatus);
    const updated = db.getCareerRoadmap(studentProfile.id);
    if (updated) setRoadmap({ ...updated });
  };

  // Handler: Toggle Stage Activity Status
  const handleToggleActivityStatus = (activityId: string, currentStatus: RoadmapItemStatus) => {
    if (!roadmap) return;
    const nextStatus: RoadmapItemStatus = currentStatus === 'Completed' ? 'Not Started' : 'Completed';
    db.updateRoadmapActivityStatus(roadmap.id, activityId, nextStatus);
    const updated = db.getCareerRoadmap(studentProfile.id);
    if (updated) setRoadmap({ ...updated });
  };

  // Handler: Add Recommended Project to Real Student Projects (Fulfills Dynamic DB requirement)
  const handleAddProjectToPortfolio = (roadmapProj: any) => {
    try {
      db.createProject({
        id: `proj_${Date.now()}`,
        studentId: studentProfile.id,
        title: roadmapProj.title,
        description: roadmapProj.description,
        technologies: roadmapProj.skillsReinforced || [],
        skillsUsed: roadmapProj.skillsReinforced || [],
        role: 'Lead Developer / Engineer',
        startDate: new Date().toISOString().split('T')[0]
      });

      // Update project status in roadmap
      if (roadmap) {
        db.updateRoadmapProjectStatus(roadmap.id, roadmapProj.id, 'In Progress');
        const updated = db.getCareerRoadmap(studentProfile.id);
        if (updated) setRoadmap({ ...updated });
      }

      setProjectAddedMessage(`"${roadmapProj.title}" has been added to your official Projects list! Your Job Readiness calculation has automatically refreshed.`);
      setTimeout(() => setProjectAddedMessage(null), 5000);
    } catch (e) {
      console.error('Error adding project', e);
    }
  };

  // ----------------------------------------------------
  // RENDER 1: ENTRY & CUSTOMIZATION SCREEN
  // ----------------------------------------------------
  if (isConfiguring || !roadmap) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 pb-12">
        {/* Top Header */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-slate-900">Build Your AI Career Roadmap</h1>
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Personalized
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                  SkillBridge analyzes your academic profile, verified skills, career goal, and skill gaps to create a personalized, actionable roadmap for your engineering discipline.
                </p>
              </div>
            </div>

            {roadmap && (
              <button
                type="button"
                onClick={() => setIsConfiguring(false)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition self-start sm:self-auto cursor-pointer"
              >
                Back to Current Roadmap
              </button>
            )}
          </div>
        </div>

        {/* Existing Profile Data Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-600" /> Current Student Profile Snapshot
            </h2>
            <span className="text-[11px] text-slate-500 font-medium">Auto-detected from SkillBridge</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                Branch & Degree
              </span>
              <p className="text-xs font-bold text-slate-900 leading-snug">{branchName}</p>
              <p className="text-[11px] text-slate-600">{studentProfile.degree} • Semester {studentProfile.semester || '7'}</p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                Academic Year & CGPA
              </span>
              <p className="text-xs font-bold text-slate-900 leading-snug">{studentProfile.academicYear || 'Final Year'}</p>
              <p className="text-[11px] text-slate-600">CGPA: <b className="text-slate-900">{studentProfile.cgpa || 'N/A'}</b> / 10.0</p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                Current Job Readiness
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-indigo-600">{readiness.overall}%</span>
                <span className="text-[11px] text-slate-500">
                  {readiness.overall >= 70 ? 'Placement Ready' : 'In Progress'}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1.5 overflow-hidden">
                <div
                  className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, readiness.overall)}%` }}
                />
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                Verified Skills
              </span>
              <p className="text-xs font-bold text-slate-900 leading-snug">{studentSkills.length} Mapped</p>
              <p className="text-[11px] text-slate-600">
                {studentSkills.filter(s => s.proficiency === 'Advanced' || s.proficiency === 'Expert').length} Advanced/Expert
              </p>
            </div>
          </div>

          {/* Identified Real Skill Gaps for Target Role */}
          <div className="mt-3 pt-3 border-t border-slate-100">
            <span className="text-[11px] font-semibold text-slate-700 block mb-2">
              Critical Skill Gaps for Selected Career Goal:
            </span>
            {identifiedGaps.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {identifiedGaps.map(g => (
                  <span
                    key={g.skillName}
                    className={`px-2 py-0.5 text-[11px] font-medium rounded-md border flex items-center gap-1 ${
                      g.status === 'Missing'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {g.skillName} ({g.status})
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                Add skills in your profile to run comprehensive role gap calculations. SkillBridge will suggest standard domain foundational skills.
              </p>
            )}
          </div>
        </div>

        {/* Customization Options */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" /> Customize Your Learning Preferences
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize pacing and mode. Pre-filled with your profile defaults.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Target Career Role */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Target Career Goal (Database Roles)
              </label>
              <select
                value={targetCareer}
                onChange={e => setTargetCareer(e.target.value)}
                className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
              >
                {careerRoles.map(role => (
                  <option key={role.id} value={role.title}>
                    {role.title} ({role.category})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 mt-1">
                Roadmap skills and projects will adapt to match the exact requirements of this role.
              </p>
            </div>

            {/* Current Skill Level */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Current Skill Level in Domain
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Beginner', 'Intermediate', 'Advanced'] as const).map(lvl => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setCurrentSkillLevel(lvl)}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition cursor-pointer ${
                      currentSkillLevel === lvl
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                AI will calibrate starting difficulty and pace accordingly.
              </p>
            </div>

            {/* Weekly Learning Time */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Weekly Learning Time
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['2–4 hours/week', '5–7 hours/week', '8–10 hours/week', '10+ hours/week'] as const).map(hrs => (
                  <button
                    key={hrs}
                    type="button"
                    onClick={() => setWeeklyLearningTime(hrs)}
                    className={`py-2 px-2 text-[11px] font-semibold rounded-lg border text-center transition cursor-pointer ${
                      weeklyLearningTime === hrs
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {hrs}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Weekly plans will generate realistic, uncrowded study tasks matching this time budget.
              </p>
            </div>

            {/* Target Completion Period */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Target Completion Period
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['3 months', '6 months', '9 months', '12 months'] as const).map(period => (
                  <button
                    key={period}
                    type="button"
                    onClick={() => setTargetPeriod(period)}
                    className={`py-2 px-2 text-[11px] font-semibold rounded-lg border text-center transition cursor-pointer ${
                      targetPeriod === period
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Determines stage duration milestones and application readiness timeline.
              </p>
            </div>

            {/* Preferred Learning Mode */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Preferred Learning Mode
              </label>
              <div className="flex gap-3">
                {(['Hybrid', 'Online', 'Offline'] as const).map(mode => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setLearningMode(mode)}
                    className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg border text-center transition cursor-pointer ${
                      learningMode === mode
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              Dynamic synthesis based on real database records and verified skill weights.
            </div>

            <button
              type="button"
              disabled={isGenerating}
              onClick={handleGenerateRoadmap}
              className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Analyzing Skills & Generating Roadmap...
                </>
              ) : (
                <>
                  <Compass className="w-4 h-4" />
                  Generate My AI Roadmap
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // RENDER 2: FULL ROADMAP DASHBOARD
  // ----------------------------------------------------
  return (
    <div className="space-y-6 pb-12">
      {/* SUCCESS TOAST MESSAGE */}
      {projectAddedMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between gap-3 shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{projectAddedMessage}</span>
          </div>
          {onNavigate && (
            <button
              onClick={() => onNavigate('dashboard')}
              className="text-xs font-bold text-emerald-700 underline hover:text-emerald-900 cursor-pointer"
            >
              View Updated Readiness
            </button>
          )}
        </div>
      )}

      {/* ROADMAP HERO HEADER */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md flex items-center gap-1">
                <Compass className="w-3 h-3" /> AI Career Roadmap
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-700 rounded-md">
                {roadmap.branchName}
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-700 rounded-md">
                {roadmap.targetPeriod} Target
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-700 rounded-md">
                {roadmap.weeklyLearningTime}
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Career Roadmap for {roadmap.targetCareer}
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl">
              Personalized learning sequence designed for {studentProfile.fullName} based on verified skills and role requirements.
            </p>
          </div>

          {/* Overall Progress Meter & Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 min-w-[200px]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-semibold text-slate-700">Roadmap Progress</span>
                <span className="text-xs font-bold text-indigo-600">{roadmap.overallProgressPercentage}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${roadmap.overallProgressPercentage}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-1.5 block">
                {roadmap.completedActivitiesCount} of {roadmap.totalActivitiesCount} activities completed
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setIsConfiguring(true)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Re-calibrate Preferences
              </button>
            </div>
          </div>
        </div>

        {/* WHY THIS ROADMAP? - Natural Language Rationale */}
        <div className="mt-5 p-4 bg-indigo-50/60 border border-indigo-100 rounded-xl">
          <div className="flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
            <div>
              <h3 className="text-xs font-bold text-indigo-950 uppercase tracking-wider mb-1">
                Why this roadmap was built for you:
              </h3>
              <p className="text-xs text-indigo-900 leading-relaxed font-normal">
                {roadmap.whyThisRoadmap}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* DYNAMIC MILESTONES TIMELINE */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-4 flex items-center gap-2">
          <Target className="w-4 h-4 text-indigo-600" /> Career Milestones Progression
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {roadmap.milestones.map((m, idx) => {
            const isDone = m.status === 'Completed';
            const isCurr = m.status === 'Current';
            return (
              <div
                key={m.id}
                className={`p-3 rounded-xl border transition ${
                  isDone
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                    : isCurr
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-900 ring-1 ring-indigo-400'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-slate-400">Step {idx + 1}</span>
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : isCurr ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-ping" />
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  )}
                </div>
                <p className="text-xs font-bold leading-tight line-clamp-1">{m.title}</p>
                <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-tight">{m.criteria}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* CORE STRATEGY ANSWERS (What do I know? What am I missing? When to apply?) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* What I know */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
            <Check className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold text-slate-900">What do I know?</h3>
          </div>
          <p className="text-[11px] text-slate-500 mb-2">Verified proficiencies recognized by AI:</p>
          <div className="flex flex-wrap gap-1.5">
            {roadmap.whatIKnow.map((item, i) => (
              <span key={i} className="px-2 py-0.5 text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* What am I missing */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
            <AlertCircle className="w-4 h-4 text-rose-500" />
            <h3 className="text-xs font-bold text-slate-900">What am I missing?</h3>
          </div>
          <p className="text-[11px] text-slate-500 mb-2">High-impact gaps targeted by roadmap:</p>
          <div className="flex flex-wrap gap-1.5">
            {roadmap.whatIAmMissing.map((item, i) => (
              <span key={i} className="px-2 py-0.5 text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200 rounded-md">
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* When to apply */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
            <Briefcase className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold text-slate-900">When should I apply?</h3>
          </div>
          <p className="text-[11px] text-slate-700 leading-relaxed">
            {roadmap.whenToApplyAdvice}
          </p>
        </div>
      </div>

      {/* ROADMAP NAVIGATION TABS */}
      <div className="border-b border-slate-200">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('stages')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'stages'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" /> 5-Stage Progression
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'projects'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FolderGit2 className="w-4 h-4" /> Recommended Projects ({roadmap.projects.length})
          </button>
          <button
            onClick={() => setActiveTab('weekly')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'weekly'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" /> Weekly Plan Breakdown
          </button>
        </div>
      </div>

      {/* ------------------------------------------- */}
      {/* TAB CONTENT 1: 5-STAGE PROGRESSION */}
      {/* ------------------------------------------- */}
      {activeTab === 'stages' && (
        <div className="space-y-6">
          {roadmap.stages.map((stage) => {
            const isStageDone = stage.items.every(i => i.status === 'Completed') &&
              (!stage.practiceProject || stage.practiceProject.status === 'Completed') &&
              (!stage.activities || stage.activities.every(a => a.status === 'Completed'));

            return (
              <div
                key={stage.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs"
              >
                {/* Stage Header */}
                <div className="p-5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-600 text-white rounded-md">
                        {stage.name}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {stage.durationWeeks}
                      </span>
                      {isStageDone && (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-md flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Stage Completed
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{stage.title}</h3>
                  </div>

                  {/* Quick stats for this stage */}
                  <div className="text-[11px] text-slate-500 font-medium">
                    {stage.items.filter(i => i.status === 'Completed').length} / {stage.items.length} Skills Mastered
                  </div>
                </div>

                <div className="p-5 space-y-5">
                  {/* Goals */}
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Stage Objectives:
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {stage.goals.map((g, gi) => (
                        <li key={gi} className="text-xs text-slate-700 flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 mt-0.5 shrink-0" />
                          <span>{g}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Stage Skill Items */}
                  {stage.items.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Skills to Acquire & Validate:
                      </h4>

                      <div className="grid grid-cols-1 gap-3">
                        {stage.items.map(item => {
                          const isItemDone = item.status === 'Completed';
                          const isItemProgress = item.status === 'In Progress';

                          return (
                            <div
                              key={item.id}
                              className={`p-4 rounded-xl border transition ${
                                isItemDone
                                  ? 'bg-slate-50/80 border-slate-200'
                                  : isItemProgress
                                  ? 'bg-indigo-50/40 border-indigo-200'
                                  : 'bg-white border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                                <div className="space-y-1.5 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-bold text-slate-900">{item.skillName}</span>
                                    <Badge
                                      variant={
                                        item.priority === 'High'
                                          ? 'danger'
                                          : item.priority === 'Medium'
                                          ? 'warning'
                                          : 'default'
                                      }
                                      size="sm"
                                    >
                                      {item.priority} Priority
                                    </Badge>
                                    <span className="text-[11px] text-slate-500 font-medium">
                                      Proficiency: <b className="text-slate-700">{item.currentProficiency}</b> → <b className="text-indigo-600">{item.targetProficiency}</b>
                                    </span>
                                    <span className="text-[11px] text-slate-400 font-medium">
                                      • ~{item.estimatedHours} hrs
                                    </span>
                                  </div>

                                  <p className="text-xs text-slate-600 leading-relaxed">
                                    {item.whyNeeded}
                                  </p>

                                  {item.practiceTask && (
                                    <div className="text-[11px] text-slate-700 bg-amber-50/60 border border-amber-200/60 p-2 rounded-md mt-1">
                                      <b className="text-amber-800">Practice Task:</b> {item.practiceTask}
                                    </div>
                                  )}
                                </div>

                                {/* Status Toggle & Course Button */}
                                <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 lg:pt-0">
                                  {/* Database Resource Connection */}
                                  {item.resource && item.resource.isAvailableInDB ? (
                                    <button
                                      type="button"
                                      onClick={() => onNavigate && onNavigate('courses')}
                                      className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                                    >
                                      <BookOpen className="w-3.5 h-3.5" /> View Course: {item.resource.provider}
                                    </button>
                                  ) : (
                                    <span className="px-2.5 py-1 text-[11px] text-slate-500 bg-slate-100 border border-slate-200 rounded-md">
                                      No course currently available in SkillBridge
                                    </span>
                                  )}

                                  {/* Interactive Status Switcher */}
                                  <button
                                    type="button"
                                    onClick={() => handleToggleItemStatus(item.id, item.status)}
                                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition flex items-center gap-1.5 cursor-pointer ${
                                      isItemDone
                                        ? 'bg-emerald-600 border-emerald-600 text-white'
                                        : isItemProgress
                                        ? 'bg-amber-500 border-amber-500 text-white'
                                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                                    }`}
                                  >
                                    {isItemDone ? (
                                      <>
                                        <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                                      </>
                                    ) : isItemProgress ? (
                                      <>
                                        <Clock className="w-3.5 h-3.5" /> In Progress
                                      </>
                                    ) : (
                                      <>Mark Started</>
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Stage Activities (for Stage 4 and 5) */}
                  {stage.activities && stage.activities.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Placement & Industry Deliverables:
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {stage.activities.map(act => {
                          const isActDone = act.status === 'Completed';

                          return (
                            <div
                              key={act.id}
                              className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 ${
                                isActDone
                                  ? 'bg-emerald-50/50 border-emerald-200'
                                  : 'bg-white border-slate-200'
                              }`}
                            >
                              <div>
                                <h5 className="text-xs font-bold text-slate-900">{act.title}</h5>
                                <p className="text-[11px] text-slate-600 mt-0.5">{act.description}</p>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleToggleActivityStatus(act.id, act.status)}
                                className={`px-2.5 py-1 text-[11px] font-bold rounded-md border transition shrink-0 cursor-pointer ${
                                  isActDone
                                    ? 'bg-emerald-600 border-emerald-600 text-white'
                                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                                }`}
                              >
                                {isActDone ? '✓ Completed' : 'Mark Done'}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Practice Project for Stage */}
                  {stage.practiceProject && (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1">
                          <FolderGit2 className="w-3.5 h-3.5" /> Stage Capstone Project
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500">
                          {stage.practiceProject.complexity} Complexity
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900">{stage.practiceProject.title}</h4>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {stage.practiceProject.description}
                      </p>
                      <div className="pt-2 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleAddProjectToPortfolio(stage.practiceProject)}
                          className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-white border border-indigo-200 hover:bg-indigo-50 rounded-lg transition shadow-2xs cursor-pointer"
                        >
                          + Add to My Projects Portfolio
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleProjectStatus(stage.practiceProject!.id, stage.practiceProject!.status)}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition shadow-2xs cursor-pointer"
                        >
                          Status: {stage.practiceProject.status}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Checkpoint Assessment */}
                  {stage.checkpointAssessment && (
                    <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <Award className="w-4 h-4 text-indigo-600 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-indigo-950">
                            Checkpoint: {stage.checkpointAssessment.title}
                          </p>
                          <p className="text-[11px] text-indigo-800">
                            {stage.checkpointAssessment.description}
                          </p>
                        </div>
                      </div>

                      {onNavigate && (
                        <button
                          type="button"
                          onClick={() => onNavigate('assessment')}
                          className="px-3 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition shrink-0 cursor-pointer"
                        >
                          Take Assessment
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ------------------------------------------- */}
      {/* TAB CONTENT 2: RECOMMENDED PROJECTS */}
      {/* ------------------------------------------- */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Industry Portfolio Recommendations for {roadmap.targetCareer}
            </h3>
            <p className="text-xs text-slate-500">
              Recruiters evaluate candidate problem-solving through domain projects. Adding and completing these projects directly increases your Job Readiness score!
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {roadmap.projects.map((project) => {
              const isProjectCompleted = project.status === 'Completed';

              return (
                <div
                  key={project.id}
                  className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700 rounded-md">
                          {project.complexity} Project
                        </span>
                        <span className="text-[11px] text-slate-500">Stage {project.stageIndex} Milestone</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{project.title}</h3>
                    </div>

                    {/* Status Pill */}
                    <button
                      type="button"
                      onClick={() => handleToggleProjectStatus(project.id, project.status)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition self-start sm:self-auto cursor-pointer ${
                        isProjectCompleted
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : project.status === 'In Progress'
                          ? 'bg-amber-500 border-amber-500 text-white'
                          : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Status: {project.status}
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Skills Reinforced */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Skills Reinforced:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {project.skillsReinforced.map(sk => (
                        <span key={sk} className="px-2 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-700 rounded-md">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Expected Deliverables / Outcomes */}
                  {project.outcomes && (
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                        Key Deliverables for Your Portfolio:
                      </span>
                      <ul className="space-y-1">
                        {project.outcomes.map((outc, oi) => (
                          <li key={oi} className="text-xs text-slate-700 flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                            <span>{outc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Action: Add to Real Projects */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-[11px] text-slate-500">
                      Adding to portfolio automatically updates your dynamic Job Readiness calculations.
                    </span>

                    <button
                      type="button"
                      onClick={() => handleAddProjectToPortfolio(project)}
                      className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <FolderGit2 className="w-3.5 h-3.5" /> Add to My Projects Portfolio
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ------------------------------------------- */}
      {/* TAB CONTENT 3: WEEKLY PLAN BREAKDOWN */}
      {/* ------------------------------------------- */}
      {activeTab === 'weekly' && (
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Paced Weekly Action Plan ({roadmap.weeklyLearningTime})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Structured weekly milestones to build momentum without interfering with university semester coursework.
              </p>
            </div>
            <span className="px-3 py-1 text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg shrink-0">
              {roadmap.weeklyLearningTime}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roadmap.weeklyPlan.map(week => (
              <div
                key={week.weekNumber}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                      {week.weekNumber}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">{week.title}</h4>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    {week.focusSkillOrTheme}
                  </span>
                </div>

                <div className="space-y-2">
                  {week.tasks.map(task => (
                    <div
                      key={task.id}
                      className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg flex items-start justify-between gap-2"
                    >
                      <div className="flex items-start gap-2">
                        <span
                          className={`px-1.5 py-0.5 text-[9px] font-bold uppercase rounded-md shrink-0 mt-0.5 ${
                            task.type === 'Learn'
                              ? 'bg-blue-100 text-blue-800'
                              : task.type === 'Practice'
                              ? 'bg-amber-100 text-amber-800'
                              : task.type === 'Project'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {task.type}
                        </span>
                        <div>
                          <p className="text-xs text-slate-800 font-medium">{task.description}</p>
                          <span className="text-[10px] text-slate-400">~{task.hours} hrs</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QUICK INTEGRATION FOOTER LINKS */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
          Connected SkillBridge Workflows
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {onNavigate && (
            <>
              <button
                type="button"
                onClick={() => onNavigate('assessment')}
                className="p-3 bg-white border border-slate-200 hover:border-indigo-300 rounded-lg text-left transition shadow-2xs group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <Award className="w-4 h-4 text-indigo-600" />
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition" />
                </div>
                <p className="text-xs font-bold text-slate-900">Take Assessment</p>
                <p className="text-[10px] text-slate-500">Benchmark your technical readiness</p>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('courses')}
                className="p-3 bg-white border border-slate-200 hover:border-indigo-300 rounded-lg text-left transition shadow-2xs group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition" />
                </div>
                <p className="text-xs font-bold text-slate-900">Courses & Certifications</p>
                <p className="text-[10px] text-slate-500">Discover verified learning paths</p>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('companies_matching')}
                className="p-3 bg-white border border-slate-200 hover:border-indigo-300 rounded-lg text-left transition shadow-2xs group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition" />
                </div>
                <p className="text-xs font-bold text-slate-900">Matching Companies</p>
                <p className="text-[10px] text-slate-500">View employers hiring your skill profile</p>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('opportunities')}
                className="p-3 bg-white border border-slate-200 hover:border-indigo-300 rounded-lg text-left transition shadow-2xs group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <Briefcase className="w-4 h-4 text-amber-600" />
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 transition" />
                </div>
                <p className="text-xs font-bold text-slate-900">Jobs & Internships</p>
                <p className="text-[10px] text-slate-500">Apply for live campus opportunities</p>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
