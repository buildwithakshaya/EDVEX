import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../db/storage';
import { calculateCareerReadiness } from '../../utils/calculations';
import { Target, TrendingUp, CheckCircle, AlertTriangle, XCircle, ArrowRight, Compass } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { EmptyState } from '../../components/common/EmptyState';

interface StudentSkillGapViewProps {
  onNavigate?: (tab: string) => void;
}

export const StudentSkillGapView: React.FC<StudentSkillGapViewProps> = ({ onNavigate }) => {
  const { studentProfile } = useAuth();
  const careerRoles = db.getCareerRoles();
  const allSkills = db.getSkills();

  const [selectedRoleId, setSelectedRoleId] = useState<string>(() => {
    if (studentProfile?.careerGoal) {
      const matched = careerRoles.find(r => r.title === studentProfile.careerGoal);
      if (matched) return matched.id;
    }
    return careerRoles[0]?.id || '';
  });

  if (!studentProfile) return null;

  const studentSkills = db.getStudentSkills(studentProfile.id);
  const attempts = db.getAssessmentAttempts(studentProfile.id);
  const projects = db.getProjects(studentProfile.id);

  const selectedCareerRole = careerRoles.find(r => r.id === selectedRoleId) || careerRoles[0];

  const analysis = selectedCareerRole
    ? calculateCareerReadiness(studentProfile, studentSkills, selectedCareerRole, allSkills, attempts, projects)
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Dynamic Career Skill Gap Analyzer</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare your actual verified skills with role requirements across engineering and technology domains.
          </p>
        </div>
        {onNavigate && (
          <button
            onClick={() => onNavigate('roadmap')}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition shadow-xs cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Compass className="w-4 h-4" />
            AI Career Roadmap
          </button>
        )}
      </div>

      {/* CAREER SELECTOR */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Target Career Role (Database Driven)
            </label>
            <select
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              className="w-full md:w-96 px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white font-bold text-indigo-900 focus:ring-2 focus:ring-indigo-500"
            >
              {careerRoles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.title} &bull; {role.category}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              Selecting a different career role immediately re-analyzes all required skills and recomputes readiness!
            </p>
          </div>

          {/* Career Readiness Hero Metric */}
          {analysis && (
            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-right">
                <span className="text-xs font-semibold text-slate-500">Career Readiness</span>
                <p className="text-2xl font-extrabold text-indigo-700">{analysis.careerReadiness}%</p>
              </div>
              <div className="w-24">
                <ProgressBar value={analysis.careerReadiness} size="md" color="auto" />
              </div>
            </div>
          )}
        </div>

        {selectedCareerRole && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600">
            <p className="max-w-2xl">{selectedCareerRole.description}</p>
            {selectedCareerRole.averageStartingSalary && (
              <Badge variant="indigo" size="sm">
                Avg Starting: {selectedCareerRole.averageStartingSalary}
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* GAP SUMMARY STATS */}
      {analysis && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-emerald-800 font-semibold">Strong Competencies</p>
              <p className="text-xl font-bold text-emerald-950">{analysis.strongCount} Skills</p>
              <p className="text-[10px] text-emerald-700">Meets or exceeds target requirements</p>
            </div>
          </div>

          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-amber-800 font-semibold">Needs Improvement</p>
              <p className="text-xl font-bold text-amber-950">{analysis.needsImprovementCount} Skills</p>
              <p className="text-[10px] text-amber-700">Increase proficiency level</p>
            </div>
          </div>

          <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-100 text-rose-700">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-rose-800 font-semibold">Missing Skills</p>
              <p className="text-xl font-bold text-rose-950">{analysis.missingCount} Skills</p>
              <p className="text-[10px] text-rose-700">Not found in student profile</p>
            </div>
          </div>
        </div>
      )}

      {/* DETAILED SKILL GAP COMPARISON TABLE */}
      {analysis && analysis.skillGapList.length > 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Competency Breakdown ({analysis.skillGapList.length} Required Skills)
            </h3>
            <span className="text-[11px] text-slate-500">
              Formula: (Matched Level / Required Level) &times; Weight
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Skill Requirement</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Required Proficiency</th>
                  <th className="py-3 px-4">Your Actual Level</th>
                  <th className="py-3 px-4">Gap Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {analysis.skillGapList.map((item) => (
                  <tr key={item.skillId} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-bold text-slate-900">{item.skillName}</td>
                    <td className="py-3 px-4">
                      <Badge variant="slate" size="sm">{item.category}</Badge>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {item.requiredProficiency}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-semibold ${
                          item.studentProficiency === 'Missing'
                            ? 'text-rose-600 italic'
                            : 'text-slate-900'
                        }`}
                      >
                        {item.studentProficiency}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          item.status === 'Strong'
                            ? 'emerald'
                            : item.status === 'Needs Improvement'
                            ? 'amber'
                            : 'rose'
                        }
                        size="sm"
                        dot={true}
                      >
                        {item.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {item.status !== 'Strong' && onNavigate && (
                        <button
                          type="button"
                          onClick={() => onNavigate('skills')}
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 ml-auto cursor-pointer"
                        >
                          {item.status === 'Missing' ? 'Acquire Skill' : 'Upgrade Level'}
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Target}
          title="No skill requirements defined for this role."
          description="Career requirements can be configured in the database by administrators."
        />
      )}
    </div>
  );
};
