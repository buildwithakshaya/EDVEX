import React from 'react';
import { db } from '../../db/storage';
import { calculateUniversityAnalytics } from '../../utils/calculations';
import {
  PieChart,
  ShieldCheck,
  TrendingUp,
  FileText,
  Building,
  Users,
  Compass,
  AlertTriangle,
  Award
} from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';

export const GovernmentPortal: React.FC = () => {
  const students = db.getStudentProfiles();
  const studentSkills = db.getAllStudentSkills();
  const applications = db.getApplications();
  const branches = db.getBranches();
  const opportunities = db.getOpportunities();
  const allSkills = db.getSkills();
  const careerRoles = db.getCareerRoles();

  const analytics = calculateUniversityAnalytics(students, branches, studentSkills, allSkills, careerRoles, applications);

  // High-demand skills across posted jobs
  const industryDemandMap: Record<string, number> = {};
  opportunities.forEach(opp => {
    opp.requiredSkills.forEach(req => {
      industryDemandMap[req.skillId] = (industryDemandMap[req.skillId] || 0) + 1;
    });
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              National Skill Intelligence & Policy Observatory
            </h1>
            <Badge variant="indigo" size="sm">Govt. of India (SIH)</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time macro analysis bridging higher education curricula with national industrial workforce demands.
          </p>
        </div>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Monitored Institutions"
          value="4"
          subtitle="NITs, IITs & State Universities"
          icon={<Building className="w-5 h-5" />}
          color="indigo"
        />

        <StatCard
          title="Total Student Base"
          value={students.length}
          subtitle="Active engineering cohorts"
          icon={<Users className="w-5 h-5" />}
          color="blue"
        />

        <StatCard
          title="Overall Placement Rate"
          value={`${analytics.placementRate}%`}
          subtitle="Dynamic national average"
          icon={<Award className="w-5 h-5" />}
          color="emerald"
        />

        <StatCard
          title="Workforce Preparedness"
          value={`${analytics.averageReadiness}%`}
          subtitle="Composite competency score"
          icon={<TrendingUp className="w-5 h-5" />}
          color="amber"
        />
      </div>

      {/* BRANCH INTELLIGENCE & CURRICULUM DEFICIT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Engineering Branch Employability & Industry Alignment
            </h3>
            <span className="text-[11px] text-slate-500">Based on Verified Assessments & Placement</span>
          </div>

          <div className="space-y-3">
            {analytics.branchWiseBreakdown.map((item) => (
              <div key={item.branchId} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-slate-900">{item.branchName}</span>
                  <span className="font-extrabold text-indigo-700">{item.avgReadiness}% Readiness</span>
                </div>
                <ProgressBar value={item.avgReadiness} size="sm" color="auto" />
                <div className="flex justify-between items-center text-[11px] text-slate-500 mt-2">
                  <span>Enrolled: {item.studentCount} candidates</span>
                  <span>Placement Absorption: {item.studentCount > 0 ? Math.round((item.placedCount / item.studentCount) * 100) : 0}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Deficit Alerts */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Critical Workforce Deficits
              </h3>
            </div>

            <div className="mt-4 space-y-3">
              {analytics.topSkillGaps.map((gap, idx) => (
                <div key={gap.name} className="p-2.5 bg-rose-50/70 border border-rose-200 rounded-lg text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-rose-900">{gap.name}</span>
                    <Badge variant="rose" size="sm">Deficit: {gap.count} students</Badge>
                  </div>
                  <p className="text-[11px] text-rose-700 mt-1">
                    Recommendation: Deploy fast-track institutional workshops in semester syllabus.
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            Source: SkillBridge Real-time Aggregation Node &bull; SIH-2024
          </div>
        </div>
      </div>
    </div>
  );
};
