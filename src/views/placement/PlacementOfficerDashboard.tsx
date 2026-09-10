import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../db/storage';
import {
  calculatePlacementReadinessCohorts,
  calculateStudentPlacementRisk,
  calculateJobReadiness
} from '../../utils/calculations';
import {
  Target,
  FolderKanban,
  AlertTriangle,
  Compass,
  PieChart,
  Calendar,
  Users,
  Award,
  Building2,
  CheckCircle2,
  Filter,
  Search,
  Plus,
  ArrowRight,
  ShieldAlert,
  HeartHandshake,
  Clock,
  Sparkles
} from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { PlacementCampaign, CampaignActivity } from '../../types';

interface PlacementOfficerDashboardProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export const PlacementOfficerDashboard: React.FC<PlacementOfficerDashboardProps> = ({
  currentTab,
  onNavigate
}) => {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>('All');
  const [selectedBatchFilter, setSelectedBatchFilter] = useState<string>('All');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Campaign creation modal state
  const [isNewCampaignOpen, setIsNewCampaignOpen] = useState(false);
  const [newCampaignTitle, setNewCampaignTitle] = useState('');
  const [newCampaignDesc, setNewCampaignDesc] = useState('');
  const [newCampaignDept, setNewCampaignDept] = useState('All');
  const [newCampaignRole, setNewCampaignRole] = useState('All');
  const [newCampaignEndDate, setNewCampaignEndDate] = useState('2026-10-30');

  // Load live records
  const allStudents = db.getAllStudents();
  const studentSkills = db.getAllStudentSkills();
  const allSkills = db.getSkills();
  const attempts = db.getAllAssessmentAttempts();
  const projects = db.getAllProjects();
  const certs = db.getAllCertifications();
  const applications = db.getApplications();
  const branches = db.getBranches();
  const careerRoles = db.getCareerRoles();
  const campaigns = db.getPlacementCampaigns();
  const drives = db.getPlacementDrives();

  // Cohorts grouping
  const cohorts = calculatePlacementReadinessCohorts(
    allStudents,
    studentSkills,
    attempts,
    projects,
    certs
  );

  // AI Placement Risk Detector evaluations
  const studentRiskList = allStudents.map(student =>
    calculateStudentPlacementRisk(student, studentSkills, attempts, projects, certs, careerRoles, branches)
  );

  const highRiskStudents = studentRiskList.filter(s => s.riskLevel === 'High' || s.riskLevel === 'Medium');

  // Filtered students for Readiness Analysis
  const filteredAnalysisStudents = allStudents.filter(s => {
    const matchesSearch = s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.careerGoal.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = selectedBranchFilter === 'All' || s.branchId === selectedBranchFilter;
    const matchesBatch = selectedBatchFilter === 'All' || s.graduationYear.toString() === selectedBatchFilter;
    const matchesRole = selectedRoleFilter === 'All' || s.careerGoal.toLowerCase().includes(selectedRoleFilter.toLowerCase());
    return matchesSearch && matchesBranch && matchesBatch && matchesRole;
  });

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaignTitle) return;

    const assignedIds = allStudents.filter(s => newCampaignDept === 'All' || s.branchId === newCampaignDept).map(s => s.id);

    const newCamp: PlacementCampaign = {
      id: `camp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: newCampaignTitle,
      targetBranchIds: newCampaignDept === 'All' ? branches.map(b => b.id) : [newCampaignDept],
      targetBatch: '2026',
      targetRoles: [newCampaignRole || 'Engineering'],
      startDate: new Date().toISOString().split('T')[0],
      endDate: newCampaignEndDate,
      assignedStudentIds: assignedIds,
      createdAt: new Date().toISOString(),
      activities: [
        {
          id: `act_${Date.now()}_1`,
          title: 'Resume Screening & ATS Optimization',
          type: 'Resume Review',
          description: 'Comprehensive review with ATS parser score',
          deadline: 'In 7 Days'
        },
        {
          id: `act_${Date.now()}_2`,
          title: 'Technical & Domain Aptitude Assessment',
          type: 'Technical Assessment',
          description: 'Core problem-solving and domain aptitude testing',
          deadline: 'In 14 Days'
        },
        {
          id: `act_${Date.now()}_3`,
          title: 'Faculty & Industry Mock Interview Round',
          type: 'Mock Interview',
          description: 'Simulated technical interview with actionable feedback',
          deadline: 'In 21 Days'
        }
      ]
    };

    db.createPlacementCampaign(newCamp);
    setToastMessage(`Placement Campaign "${newCampaignTitle}" initialized!`);
    setIsNewCampaignOpen(false);
    setNewCampaignTitle('');
    setNewCampaignDesc('');
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Placement Officer Command Center
            </h1>
            <Badge variant="indigo" size="sm">Training & Placement Cell</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Placement readiness cohort tracking, proactive student risk intervention, preparatory campaigns, and recruitment drives.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
              currentTab === 'dashboard'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onNavigate('preparation')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
              currentTab === 'preparation'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Cohorts ({allStudents.length})
          </button>
          <button
            onClick={() => onNavigate('risk_detector')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
              currentTab === 'risk_detector'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            AI Risk Detector ({highRiskStudents.length})
          </button>
          <button
            onClick={() => onNavigate('campaigns')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
              currentTab === 'campaigns'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Campaign Planner
          </button>
          <button
            onClick={() => onNavigate('readiness_analysis')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
              currentTab === 'readiness_analysis'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Readiness Analysis
          </button>
          <button
            onClick={() => onNavigate('placement_drives')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
              currentTab === 'placement_drives'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Company Drives ({drives.length})
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-700 hover:underline">Dismiss</button>
        </div>
      )}

      {/* 1. PLACEMENT OVERVIEW */}
      {(currentTab === 'dashboard' || currentTab === 'overview') && (
        <>
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Placement Ready"
              value={cohorts.ready.length}
              subtitle="Readiness >= 75% (Immediate Drive Pool)"
              icon={<Award className="w-5 h-5" />}
              color="emerald"
            />

            <StatCard
              title="Almost Ready"
              value={cohorts.almostReady.length}
              subtitle="Readiness 60% - 74% (1-2 skills gap)"
              icon={<Compass className="w-5 h-5" />}
              color="blue"
            />

            <StatCard
              title="Needs Preparation"
              value={cohorts.needsPreparation.length}
              subtitle="Readiness 45% - 59% (Action required)"
              icon={<FolderKanban className="w-5 h-5" />}
              color="amber"
            />

            <StatCard
              title="Support Queue (AI Risk)"
              value={highRiskStudents.length}
              subtitle="Students flagged for early mentoring"
              icon={<HeartHandshake className="w-5 h-5" />}
              color="rose"
            />
          </div>

          {/* High-Level Cohort Distribution & Risk Callout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cohort Breakdown Summary */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Placement Readiness Tiers
                  </h3>
                  <Badge variant="indigo" size="sm">Campus Cohort</Badge>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-emerald-950">Ready for Placement</span>
                      <p className="text-[10px] text-emerald-700">Eligible for Day 1 core & premium drives</p>
                    </div>
                    <span className="text-sm font-extrabold text-emerald-800">{cohorts.ready.length} students</span>
                  </div>

                  <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-blue-950">Almost Ready</span>
                      <p className="text-[10px] text-blue-700">Require fast-track certification polish</p>
                    </div>
                    <span className="text-sm font-extrabold text-blue-800">{cohorts.almostReady.length} students</span>
                  </div>

                  <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-amber-950">Needs Preparation</span>
                      <p className="text-[10px] text-amber-700">Enrolled in bootcamp & mock drives</p>
                    </div>
                    <span className="text-sm font-extrabold text-amber-800">{cohorts.needsPreparation.length} students</span>
                  </div>

                  <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-rose-950">High Support Priority</span>
                      <p className="text-[10px] text-rose-700">Proactive 1-on-1 counseling underway</p>
                    </div>
                    <span className="text-sm font-extrabold text-rose-800">{cohorts.highRisk.length} students</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 text-right">
                <button
                  onClick={() => onNavigate('preparation')}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center justify-end gap-1 cursor-pointer"
                >
                  Inspect Cohorts <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* AI Risk Detector Preview Card */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    AI Placement Risk Detector &bull; Early Support Feed
                  </h3>
                </div>
                <Badge variant="amber" size="sm">Decision Support Only</Badge>
              </div>

              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs text-indigo-900 leading-snug">
                <span className="font-bold">Purpose of Risk Detector: </span>
                This system flags students who might miss placement thresholds (due to missing technical projects, assessment voids, or skill deficits) so counselors can intervene <i>before</i> recruiters arrive. It is strictly forbidden from being used for student disqualification.
              </div>

              <div className="space-y-2.5 pt-1">
                {highRiskStudents.slice(0, 3).map((risk) => (
                  <div key={risk.studentId} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-bold text-slate-900">{risk.studentName}</span>
                        <span className="text-[11px] text-slate-500 ml-2">
                          {risk.branchName} &bull; CGPA: {risk.cgpa}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                        {risk.riskLevel} Support Risk ({risk.readinessScore}%)
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600 space-y-0.5">
                      <span className="font-semibold text-slate-700">Root Causes: </span>
                      {risk.reasons.join(' ')}
                    </div>

                    <div className="pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                      <span className="text-indigo-700 font-medium">
                        <b>Intervention:</b> {risk.recommendedActions[0]}
                      </span>
                      <button
                        onClick={() => onNavigate('risk_detector')}
                        className="text-indigo-600 font-bold hover:underline cursor-pointer"
                      >
                        Action Plan &rarr;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* 2. PLACEMENT PREPARATION (Cohorts Breakdown) */}
      {(currentTab === 'preparation' || currentTab === 'dashboard') && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-indigo-600" />
                <h2 className="text-base font-bold text-slate-900">Placement Preparation Cohorts</h2>
                <Badge variant="indigo" size="sm">Dynamic Readiness Grouping</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Students grouped dynamically by readiness score to organize customized bootcamp tracks, aptitude training, and corporate interview scheduling.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Cohort 1: Ready */}
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-emerald-200/60">
                <span className="font-bold text-xs text-emerald-950 uppercase">Ready for Placement</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800">
                  {cohorts.ready.length}
                </span>
              </div>
              <p className="text-[11px] text-emerald-800">Score ≥ 75%. Verified projects, assessments, and high skill match.</p>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {cohorts.ready.map(({ student, readiness }) => (
                  <div key={student.id} className="p-2.5 bg-white rounded-lg border border-emerald-100 text-xs shadow-2xs">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{student.fullName}</span>
                      <span className="text-emerald-700">{readiness}%</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block">{student.department} &bull; {student.careerGoal}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cohort 2: Almost Ready */}
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/30 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-blue-200/60">
                <span className="font-bold text-xs text-blue-950 uppercase">Almost Ready</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-blue-100 text-blue-800">
                  {cohorts.almostReady.length}
                </span>
              </div>
              <p className="text-[11px] text-blue-800">Score 60%–74%. Typically missing 1 niche technical certification.</p>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {cohorts.almostReady.map(({ student, readiness }) => (
                  <div key={student.id} className="p-2.5 bg-white rounded-lg border border-blue-100 text-xs shadow-2xs">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{student.fullName}</span>
                      <span className="text-blue-700">{readiness}%</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block">{student.department} &bull; {student.careerGoal}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cohort 3: Needs Preparation */}
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-amber-200/60">
                <span className="font-bold text-xs text-amber-950 uppercase">Needs Preparation</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800">
                  {cohorts.needsPreparation.length}
                </span>
              </div>
              <p className="text-[11px] text-amber-800">Score 45%–59%. Requires technical tests & lab project completion.</p>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {cohorts.needsPreparation.map(({ student, readiness }) => (
                  <div key={student.id} className="p-2.5 bg-white rounded-lg border border-amber-100 text-xs shadow-2xs">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{student.fullName}</span>
                      <span className="text-amber-700">{readiness}%</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block">{student.department} &bull; {student.careerGoal}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cohort 4: High Placement Risk */}
            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/30 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-rose-200/60">
                <span className="font-bold text-xs text-rose-950 uppercase">Support Priority</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-rose-100 text-rose-800">
                  {cohorts.highRisk.length}
                </span>
              </div>
              <p className="text-[11px] text-rose-800">Score &lt; 45%. Zero assessment attempts or unverified profiles.</p>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {cohorts.highRisk.map(({ student, readiness }) => (
                  <div key={student.id} className="p-2.5 bg-white rounded-lg border border-rose-100 text-xs shadow-2xs">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{student.fullName}</span>
                      <span className="text-rose-700">{readiness}%</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block">{student.department} &bull; {student.careerGoal}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. AI PLACEMENT RISK DETECTOR (Early-Warning & Support Tool) */}
      {(currentTab === 'risk_detector' || currentTab === 'dashboard') && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h2 className="text-base font-bold text-slate-900">AI Placement Risk Detector</h2>
                <Badge variant="amber" size="sm">Early-Warning Support System</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Multi-factor early warning diagnosing why students might struggle in upcoming drives. Designed strictly for student support and targeted mentoring.
              </p>
            </div>
          </div>

          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900">
            <span className="font-bold">Guidance for Placement Officers: </span>
            Every student listed below has an assigned proactive intervention plan (mock interview, resume clinic, or course enrollment). Click "Trigger Support Task" to send guidance into the student's dashboard.
          </div>

          <div className="space-y-3 pt-2">
            {highRiskStudents.map((risk) => (
              <div
                key={risk.studentId}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-amber-300 hover:shadow-xs transition space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{risk.studentName}</h3>
                    <p className="text-xs text-slate-500">
                      {risk.branchName} &bull; CGPA: <span className="font-semibold text-slate-800">{risk.cgpa}</span> &bull; Current Readiness: <span className="font-bold text-indigo-700">{risk.readinessScore}%</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      risk.riskLevel === 'High'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {risk.riskLevel} Risk Level
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                    <span className="font-bold text-slate-900 text-[11px] uppercase tracking-wider block">
                      Diagnostic Root Causes:
                    </span>
                    <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                      {risk.reasons.map((r, idx) => (
                        <li key={idx}>{r}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-100 space-y-1">
                    <span className="font-bold text-indigo-900 text-[11px] uppercase tracking-wider block">
                      Recommended Officer Actions:
                    </span>
                    <ul className="list-disc list-inside text-indigo-950 space-y-0.5">
                      {risk.recommendedActions.map((act, idx) => (
                        <li key={idx}>{act}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">
                    Proactive intervention active &bull; Notification will reflect in student portal
                  </span>
                  <button
                    onClick={() => {
                      setToastMessage(`Support intervention dispatched to ${risk.studentName}!`);
                      setTimeout(() => setToastMessage(null), 3500);
                    }}
                    className="px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 rounded-lg transition cursor-pointer"
                  >
                    Dispatch Support Action
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. PLACEMENT CAMPAIGN PLANNER */}
      {(currentTab === 'campaigns' || currentTab === 'dashboard') && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-indigo-600" />
                <h2 className="text-base font-bold text-slate-900">Placement Campaign Planner</h2>
                <Badge variant="indigo" size="sm">Structured Prep Sprints</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Launch targeted preparation sprints (e.g. Core Engineering Prep, IT & Analytics Bootcamps) and assign activities to students.
              </p>
            </div>

            <button
              onClick={() => setIsNewCampaignOpen(true)}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Create Campaign
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {campaigns.map((camp) => (
              <div key={camp.id} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{camp.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Target Batch: {camp.targetBatch} &bull; Focus: {camp.targetRoles.join(', ')}
                      </p>
                    </div>
                    <Badge variant="emerald" size="sm">
                      Active
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Target branches: {camp.targetBranchIds.map(id => branches.find(b => b.id === id)?.code || id).join(', ')}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" /> {camp.assignedStudentIds.length} Enrolled
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> Ends {camp.endDate}
                    </span>
                  </div>

                  {/* Activities List */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Campaign Activities ({camp.activities.length}):
                    </span>
                    {camp.activities.map((act) => (
                      <div key={act.id} className="p-2 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-semibold text-slate-800">{act.title}</span>
                          <span className="text-[10px] text-slate-400 block">{act.type} &bull; {act.description}</span>
                        </div>
                        <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                          {act.deadline || 'Active'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => {
                      setToastMessage(`Campaign notification sent to ${camp.assignedStudentIds.length} students!`);
                      setTimeout(() => setToastMessage(null), 3000);
                    }}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                  >
                    Broadcast Reminder &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* New Campaign Modal */}
          {isNewCampaignOpen && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-lg space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">New Placement Campaign</h3>
                    <p className="text-xs text-slate-500">Structured preparatory sprint for hiring drives</p>
                  </div>
                  <button onClick={() => setIsNewCampaignOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                    ✕
                  </button>
                </div>

                <form onSubmit={handleCreateCampaign} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Campaign Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Core Engineering OEM Placement Prep"
                      value={newCampaignTitle}
                      onChange={(e) => setNewCampaignTitle(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Target Department
                    </label>
                    <select
                      value={newCampaignDept}
                      onChange={(e) => setNewCampaignDept(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                    >
                      <option value="All">All Departments</option>
                      {branches.map(b => (
                        <option key={b.id} value={b.name}>{b.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Target Job Role / Sector
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mechanical Design Engineer or IT Software Dev"
                      value={newCampaignRole}
                      onChange={(e) => setNewCampaignRole(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Campaign Description & Instructions
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Brief overview of what students will accomplish during this drive preparation..."
                      value={newCampaignDesc}
                      onChange={(e) => setNewCampaignDesc(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsNewCampaignOpen(false)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs cursor-pointer"
                    >
                      Launch Campaign
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. PLACEMENT READINESS ANALYSIS (Multi-Filter Ledger) */}
      {(currentTab === 'readiness_analysis' || currentTab === 'dashboard') && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs space-y-4 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-indigo-600" />
                <h2 className="text-base font-bold text-slate-900">Placement Readiness Analysis</h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Filter students by department, batch/graduation year, and target career role to export candidate rosters for visiting companies.
              </p>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Search Student</label>
              <input
                type="text"
                placeholder="Search name or goal..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs p-1.5 bg-white border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Branch</label>
              <select
                value={selectedBranchFilter}
                onChange={(e) => setSelectedBranchFilter(e.target.value)}
                className="w-full text-xs p-1.5 bg-white border border-slate-300 rounded-lg"
              >
                <option value="All">All Branches</option>
                {branches.map(b => (
                  <option key={b.id} value={b.id}>{b.code} ({b.name})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Graduation Batch</label>
              <select
                value={selectedBatchFilter}
                onChange={(e) => setSelectedBatchFilter(e.target.value)}
                className="w-full text-xs p-1.5 bg-white border border-slate-300 rounded-lg"
              >
                <option value="All">All Batches</option>
                <option value="2026">Class of 2026 (Final Year)</option>
                <option value="2027">Class of 2027 (Pre-Final Year)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Target Role</label>
              <select
                value={selectedRoleFilter}
                onChange={(e) => setSelectedRoleFilter(e.target.value)}
                className="w-full text-xs p-1.5 bg-white border border-slate-300 rounded-lg"
              >
                <option value="All">All Career Goals</option>
                {careerRoles.map(r => (
                  <option key={r.id} value={r.title}>{r.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Department & Batch</th>
                  <th className="py-3 px-4">CGPA</th>
                  <th className="py-3 px-4">Target Role</th>
                  <th className="py-3 px-4">Job Readiness</th>
                  <th className="py-3 px-4">Placement Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredAnalysisStudents.map(student => {
                  const sSkills = studentSkills.filter(s => s.studentId === student.id);
                  const sAttempts = attempts.filter(a => a.studentId === student.id);
                  const sProjects = projects.filter(p => p.studentId === student.id);
                  const sCerts = certs.filter(c => c.studentId === student.id);
                  const readiness = calculateJobReadiness(student, sSkills, sAttempts, sProjects, sCerts);
                  const isPlaced = applications.some(a => a.studentId === student.id && a.status === 'Selected');

                  return (
                    <tr key={student.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {student.fullName}
                        <span className="block text-[11px] text-slate-400 font-normal">{student.email}</span>
                      </td>
                      <td className="py-3 px-4">
                        {student.department}
                        <span className="block text-[10px] text-slate-400">Class of {student.graduationYear} &bull; Sem {student.semester}</span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">{student.cgpa}</td>
                      <td className="py-3 px-4 font-semibold text-indigo-700">{student.careerGoal}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900">{readiness.overall}%</span>
                          <div className="w-16">
                            <ProgressBar value={readiness.overall} size="sm" color="auto" />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {isPlaced ? (
                          <Badge variant="emerald" size="sm" dot>Selected / Placed</Badge>
                        ) : (
                          <Badge variant="amber" size="sm" dot>In Process</Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. COMPANY DRIVES (Preserved from existing functionality) */}
      {(currentTab === 'placement_drives' || currentTab === 'dashboard') && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600" />
                <h2 className="text-base font-bold text-slate-900">Scheduled Company Recruitment Drives</h2>
                <Badge variant="indigo" size="sm">Campus Hiring</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Upcoming on-campus and virtual hiring drives, minimum qualification criteria, and registered applicants.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {drives.map(drive => (
              <div key={drive.id} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{drive.company}</h3>
                    <p className="text-xs text-slate-500">{drive.role} &bull; {drive.packageDetails}</p>
                  </div>
                  <Badge variant={drive.status === 'Completed' ? 'slate' : 'emerald'} size="sm">
                    {drive.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Drive Date</span>
                    <span className="font-bold text-slate-800">{drive.driveDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Min CGPA</span>
                    <span className="font-semibold text-slate-700">{drive.minCGPA}</span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-slate-200/60 flex justify-between text-slate-600">
                    <span>Deadline: <b>{drive.deadline}</b></span>
                    <span>Status: <b className="text-emerald-700">{drive.status}</b></span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Eligible: {drive.eligibleBranchIds.map(id => branches.find(b => b.id === id)?.code || id).join(', ')}</span>
                  <span className="text-indigo-600 font-semibold cursor-pointer hover:underline">
                    Manage Shortlist &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
