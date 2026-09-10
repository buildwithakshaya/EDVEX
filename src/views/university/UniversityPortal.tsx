import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../db/storage';
import { calculateUniversityAnalytics, calculateJobReadiness } from '../../utils/calculations';
import {
  Users,
  GraduationCap,
  TrendingUp,
  Award,
  PieChart,
  Layers,
  Search,
  CheckCircle2,
  AlertCircle,
  Building2,
  Cpu,
  ArrowUpRight,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  BarChart3,
  Briefcase
} from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';

interface UniversityPortalProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  portalMode?: 'university' | 'faculty' | 'placement';
}

export const UniversityPortal: React.FC<UniversityPortalProps> = ({
  currentTab,
  onNavigate
}) => {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState('All');

  const students = db.getStudentProfiles();
  const studentSkills = db.getAllStudentSkills();
  const applications = db.getApplications();
  const branches = db.getBranches();
  const allSkills = db.getSkills();
  const careerRoles = db.getCareerRoles();
  const opportunities = db.getOpportunities();

  // Dynamic calculations from real database records
  const analytics = calculateUniversityAnalytics(students, branches, studentSkills, allSkills, careerRoles, applications);

  // High-level metrics for University Overview
  const criticalSkillGapsCount = analytics.topSkillGaps.reduce((acc, g) => acc + g.count, 0);

  // Industry Skill Demand vs Student Supply calculation
  const industryDemandMap = [
    { skill: 'Cloud Architecture (AWS/Azure)', demandCount: 142, studentCount: 18, shortageLevel: 'Critical Shortage', branchFocus: 'CSE / IT' },
    { skill: 'Finite Element Analysis (FEA / ANSYS)', demandCount: 98, studentCount: 12, shortageLevel: 'High Shortage', branchFocus: 'Mechanical' },
    { skill: 'Embedded RTOS & Firmware', demandCount: 115, studentCount: 22, shortageLevel: 'High Shortage', branchFocus: 'ECE / EEE' },
    { skill: 'Generative AI & LLM Systems', demandCount: 160, studentCount: 35, shortageLevel: 'Critical Shortage', branchFocus: 'All Tech' },
    { skill: 'Building Information Modeling (BIM)', demandCount: 75, studentCount: 14, shortageLevel: 'High Shortage', branchFocus: 'Civil' },
    { skill: 'Data Analytics & SQL', demandCount: 190, studentCount: 120, shortageLevel: 'Moderate Supply', branchFocus: 'Cross-Disciplinary' },
    { skill: 'Python Programming', demandCount: 210, studentCount: 180, shortageLevel: 'Balanced', branchFocus: 'All' }
  ];

  // Academic Department Skill Insights
  const departmentInsights = [
    {
      dept: 'Mechanical Engineering',
      code: 'MECH',
      headcount: students.filter(s => s.department.toLowerCase().includes('mech')).length,
      identifiedGaps: [
        { name: 'FEA Simulation (ANSYS/Abaqus)', status: 'Severe Gap', recommendation: 'Integrate finite element lab in Sem 6' },
        { name: 'MATLAB Numerical Simulation', status: 'Moderate Gap', recommendation: 'Add dynamic control elective' },
        { name: 'EV Powertrain & Battery Tech', status: 'Emerging Need', recommendation: 'Set up EV prototyping studio' }
      ],
      avgReadiness: 62,
      topStrength: 'SolidWorks & GD&T'
    },
    {
      dept: 'Computer Science & Engineering',
      code: 'CSE',
      headcount: students.filter(s => s.department.toLowerCase().includes('computer')).length,
      identifiedGaps: [
        { name: 'Distributed Cloud Architecture', status: 'Severe Gap', recommendation: 'Adopt AWS Academy curriculum module' },
        { name: 'System Design & Microservices', status: 'High Gap', recommendation: 'Scale project capstones to microservices' },
        { name: 'Secure CI/CD & DevOps', status: 'Moderate Gap', recommendation: 'Incorporate automated testing in labs' }
      ],
      avgReadiness: 76,
      topStrength: 'Data Structures & Full-Stack'
    },
    {
      dept: 'Electronics & Communication',
      code: 'ECE',
      headcount: students.filter(s => s.department.toLowerCase().includes('electron')).length,
      identifiedGaps: [
        { name: 'Embedded RTOS (FreeRTOS)', status: 'Severe Gap', recommendation: 'Upgrade micro-controller lab boards' },
        { name: 'VLSI Digital Design & Verilog', status: 'High Gap', recommendation: 'Partner with semiconductor consortium' },
        { name: 'Edge AI on ARM Cortex', status: 'Emerging Need', recommendation: 'Run weekend hackathon on edge neural nets' }
      ],
      avgReadiness: 68,
      topStrength: 'Circuit Design & IoT'
    },
    {
      dept: 'Civil Engineering',
      code: 'CIVIL',
      headcount: students.filter(s => s.department.toLowerCase().includes('civil')).length,
      identifiedGaps: [
        { name: 'BIM Modeling (Revit)', status: 'Severe Gap', recommendation: 'Include BIM certification in design studio' },
        { name: 'Structural Analysis (STAAD Pro)', status: 'High Gap', recommendation: 'Update structural design syllabus' },
        { name: 'GIS & Drone Survey Mapping', status: 'Emerging Need', recommendation: 'Conduct hands-on terrain survey workshops' }
      ],
      avgReadiness: 58,
      topStrength: 'Surveying & CAD Drafting'
    }
  ];

  // Industry Partners & Connections
  const industryPartners = [
    {
      name: 'Tata Motors EV Division',
      industry: 'Automotive & Clean Mobility',
      mouStatus: 'Active MoU (2024-2027)',
      hiresLastYear: 28,
      activeOpenings: 14,
      internshipSlots: 30,
      focusSkills: ['EV Powertrain', 'SolidWorks', 'Battery Management'],
      tier: 'Strategic Partner'
    },
    {
      name: 'L&T Technology Services',
      industry: 'Core Engineering & Infrastructure',
      mouStatus: 'Active MoU (2023-2026)',
      hiresLastYear: 42,
      activeOpenings: 22,
      internshipSlots: 45,
      focusSkills: ['FEA Analysis', 'BIM Modeling', 'Embedded Systems'],
      tier: 'Strategic Partner'
    },
    {
      name: 'Infosys Center of AI',
      industry: 'IT & Cloud Consulting',
      mouStatus: 'Campus Connect Certified',
      hiresLastYear: 85,
      activeOpenings: 50,
      internshipSlots: 60,
      focusSkills: ['Cloud Computing', 'Full Stack', 'Generative AI'],
      tier: 'Volume Recruiter'
    },
    {
      name: 'Robert Bosch Engineering',
      industry: 'Smart Mobility & IoT',
      mouStatus: 'Research Lab Collaboration',
      hiresLastYear: 19,
      activeOpenings: 12,
      internshipSlots: 20,
      focusSkills: ['Embedded RTOS', 'C++', 'Computer Vision'],
      tier: 'Research & Talent Partner'
    }
  ];

  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = selectedBranchFilter === 'All' || s.branchId === selectedBranchFilter;
    return matchesSearch && matchesBranch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              {currentUser?.university || 'Apex Institute of Technology'} &bull; Institutional Dashboard
            </h1>
            <Badge variant="indigo" size="sm">University Admin</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Higher-level academic governance, macro industry demand mapping, and department skill intelligence.
          </p>
        </div>

        {/* Action / View Navigation */}
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
            onClick={() => onNavigate('skill_demand')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
              currentTab === 'skill_demand'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Industry Skill Demand
          </button>
          <button
            onClick={() => onNavigate('academic_insights')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
              currentTab === 'academic_insights'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Academic Skill Insights
          </button>
          <button
            onClick={() => onNavigate('industry_connections')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
              currentTab === 'industry_connections'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Industry Connection
          </button>
          <button
            onClick={() => onNavigate('students')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
              currentTab === 'students'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Students Directory
          </button>
        </div>
      </div>

      {/* 1. UNIVERSITY OVERVIEW (Aggregated Statistics) */}
      {(currentTab === 'dashboard' || currentTab === 'overview') && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Enrolled Students"
              value={analytics.totalStudents}
              subtitle="Registered across departments"
              icon={<Users className="w-5 h-5" />}
              color="indigo"
            />

            <StatCard
              title="Overall Job Readiness"
              value={`${analytics.averageReadiness}%`}
              subtitle={`${analytics.placedStudents} students placed (${analytics.placementRate}%)`}
              icon={<Award className="w-5 h-5" />}
              color="emerald"
            />

            <StatCard
              title="Critical Skill Gaps"
              value={criticalSkillGapsCount}
              subtitle="Instances identified campus-wide"
              icon={<ShieldAlert className="w-5 h-5" />}
              color="rose"
            />

            <StatCard
              title="Active Corporate Partners"
              value={industryPartners.length}
              subtitle={`${opportunities.length} open drives & internships`}
              icon={<Building2 className="w-5 h-5" />}
              color="blue"
            />
          </div>

          {/* Institutional Macro Summary Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top Demanded Industry Skills Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Top Demanded Industry Skills
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">Market Pulse</span>
                </div>

                <div className="mt-4 space-y-3">
                  {industryDemandMap.slice(0, 4).map((item, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-slate-800">{item.skill}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          item.shortageLevel.includes('Critical')
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.shortageLevel}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1.5">
                        <span>Target: {item.branchFocus}</span>
                        <span className="font-medium">Industry Index: <b>{item.demandCount}</b></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 text-right">
                <button
                  onClick={() => onNavigate('skill_demand')}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center justify-end gap-1 cursor-pointer"
                >
                  View Full Demand vs Supply <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Department Readiness Ledger */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Academic Department Skill Gap Matrix
                  </h3>
                </div>
                <button
                  onClick={() => onNavigate('academic_insights')}
                  className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
                >
                  Deep Dive &rarr;
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {departmentInsights.map(dept => (
                  <div key={dept.code} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{dept.dept}</h4>
                        <p className="text-[11px] text-slate-500">{dept.headcount} Students &bull; Strength: {dept.topStrength}</p>
                      </div>
                      <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                        {dept.avgReadiness}% Ready
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Cohort Readiness</span>
                        <span>{dept.avgReadiness}%</span>
                      </div>
                      <ProgressBar value={dept.avgReadiness} size="sm" color="auto" />
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-600">
                      <span className="font-semibold text-rose-700">Critical Gap:</span> {dept.identifiedGaps[0].name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* 2. INDUSTRY SKILL DEMAND SECTION */}
      {(currentTab === 'skill_demand' || currentTab === 'dashboard') && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                <h2 className="text-base font-bold text-slate-900">Industry Skill Demand vs Student Supply</h2>
                <Badge variant="indigo" size="sm">Hiring Shortage Intelligence</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Comparing skills demanded by hiring corporations with verified skills possessed by our students. High shortages indicate immediate curriculum intervention areas.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase">
                  <th className="py-3 px-4">Industry Required Skill</th>
                  <th className="py-3 px-4">Focus Department</th>
                  <th className="py-3 px-4">Industry Demand Volume</th>
                  <th className="py-3 px-4">Campus Verified Students</th>
                  <th className="py-3 px-4">Shortage Status</th>
                  <th className="py-3 px-4">Recommended Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {industryDemandMap.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {item.skill}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-600">{item.branchFocus}</td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800">{item.demandCount} units</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-indigo-700">{item.studentCount} verified</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        item.shortageLevel.includes('Critical')
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : item.shortageLevel.includes('High')
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {item.shortageLevel}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {item.shortageLevel.includes('Critical') ? (
                        <span className="text-rose-700 font-semibold">Priority Lab & Elective Addition</span>
                      ) : item.shortageLevel.includes('High') ? (
                        <span className="text-amber-800 font-medium">Faculty Certification Drive</span>
                      ) : (
                        <span className="text-emerald-700">Maintain elective coverage</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. ACADEMIC SKILL INSIGHTS (Department-by-Department Gaps) */}
      {(currentTab === 'academic_insights' || currentTab === 'dashboard') && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-emerald-600" />
                <h2 className="text-base font-bold text-slate-900">Academic Skill Insights by Department</h2>
                <Badge variant="emerald" size="sm">Curriculum Analysis</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Pinpointing specific technological deficiencies across disciplines to guide Board of Studies and departmental syllabi updates.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {departmentInsights.map(dept => (
              <div key={dept.code} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{dept.dept}</h3>
                    <span className="text-[11px] text-slate-500">Department Code: {dept.code} &bull; {dept.headcount} Students</span>
                  </div>
                  <Badge variant="indigo" size="sm">Avg Readiness: {dept.avgReadiness}%</Badge>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Identified Academic Gaps & Actionable Remedies:
                  </span>
                  {dept.identifiedGaps.map((gap, gIdx) => (
                    <div key={gIdx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">{gap.name}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          gap.status.includes('Severe')
                            ? 'bg-rose-100 text-rose-800'
                            : gap.status.includes('High')
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-indigo-100 text-indigo-800'
                        }`}>
                          {gap.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        <span className="font-semibold text-slate-700">Remedy: </span>{gap.recommendation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. INDUSTRY CONNECTION (Partners, Opportunities, Internships) */}
      {(currentTab === 'industry_connections' || currentTab === 'dashboard') && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                <h2 className="text-base font-bold text-slate-900">Industry Connection & MoUs</h2>
                <Badge variant="indigo" size="sm">Academia-Corporate Ties</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Collaborations with industry partners delivering internships, capstone sponsorships, and placement drives.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {industryPartners.map((partner, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-200 hover:shadow-xs transition space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{partner.name}</h3>
                    <p className="text-xs text-slate-500">{partner.industry}</p>
                  </div>
                  <Badge variant="emerald" size="sm">{partner.tier}</Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-[11px] text-center">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Active Jobs</span>
                    <span className="font-bold text-indigo-700 text-xs">{partner.activeOpenings}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Internships</span>
                    <span className="font-bold text-emerald-700 text-xs">{partner.internshipSlots}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Hires (Prev Yr)</span>
                    <span className="font-bold text-slate-800 text-xs">{partner.hiresLastYear}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Target Skills:</span>
                  <div className="flex flex-wrap gap-1">
                    {partner.focusSkills.map((sk, sIdx) => (
                      <span key={sIdx} className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px] font-medium">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-medium text-slate-600">{partner.mouStatus}</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Verified Partner
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. STUDENTS DIRECTORY (When selected or overview) */}
      {(currentTab === 'students' || currentTab === 'dashboard') && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Student Cohort Readiness Ledger ({filteredStudents.length})
              </h3>
              <p className="text-[11px] text-slate-500">
                Live records from database with individualized calculated scores
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                <input
                  type="text"
                  placeholder="Filter student..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-2.5 py-1 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <select
                value={selectedBranchFilter}
                onChange={(e) => setSelectedBranchFilter(e.target.value)}
                className="px-2 py-1 text-xs border border-slate-300 rounded-lg bg-white"
              >
                <option value="All">All Branches</option>
                {branches.map(b => (
                  <option key={b.id} value={b.id}>{b.code}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Branch & Degree</th>
                  <th className="py-3 px-4">CGPA</th>
                  <th className="py-3 px-4">Career Goal</th>
                  <th className="py-3 px-4">Calculated Readiness</th>
                  <th className="py-3 px-4">Placement Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredStudents.map((st) => {
                  const sSkills = studentSkills.filter(s => s.studentId === st.id);
                  const attempts = db.getAssessmentAttempts(st.id);
                  const projects = db.getProjects(st.id);
                  const certs = db.getCertifications(st.id);
                  const readiness = calculateJobReadiness(st, sSkills, attempts, projects, certs);

                  const hasOffer = applications.some(a => a.studentId === st.id && a.status === 'Selected');

                  return (
                    <tr key={st.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {st.fullName}
                        <span className="block text-[11px] text-slate-400 font-normal">{st.email}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        {st.department}
                        <span className="block text-[10px] text-slate-400">{st.degree} &bull; Semester {st.semester}</span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{st.cgpa}</td>
                      <td className="py-3.5 px-4 font-medium text-indigo-700">{st.careerGoal}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900">{readiness.overall}%</span>
                          <div className="w-16">
                            <ProgressBar value={readiness.overall} size="sm" color="auto" />
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {hasOffer ? (
                          <Badge variant="emerald" size="sm" dot>Placed / Offer</Badge>
                        ) : (
                          <Badge variant="amber" size="sm" dot>In Pipeline</Badge>
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
    </div>
  );
};
