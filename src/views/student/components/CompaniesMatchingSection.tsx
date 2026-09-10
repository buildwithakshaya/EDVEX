import React, { useState } from 'react';
import { db } from '../../../db/storage';
import { StudentProfile, StudentSkill } from '../../../types';
import { calculateOpportunityMatch } from '../../../utils/calculations';
import { Sparkles, Building2, MapPin, IndianRupee, CheckCircle2, ChevronRight, ExternalLink, ArrowRight } from 'lucide-react';
import { Badge } from '../../../components/common/Badge';

interface CompaniesMatchingSectionProps {
  studentProfile: StudentProfile;
  studentSkills: StudentSkill[];
  limit?: number;
  onViewAll?: () => void;
  onNavigateToApplications?: () => void;
}

export const CompaniesMatchingSection: React.FC<CompaniesMatchingSectionProps> = ({
  studentProfile,
  studentSkills,
  limit,
  onViewAll,
  onNavigateToApplications
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const opportunities = db.getOpportunities().filter(o => o.status === 'Open');
  const allSkills = db.getSkills();
  const applications = db.getApplicationsByStudent(studentProfile.id);

  // Compute dynamic match for each opportunity
  const matchedList = opportunities
    .map(opp => calculateOpportunityMatch(studentProfile, studentSkills, opp, allSkills))
    .sort((a, b) => b.matchPercentage - a.matchPercentage);

  const displayed = limit ? matchedList.slice(0, limit) : matchedList;

  const handleApply = (opportunityId: string, matchScore: number) => {
    const opp = opportunities.find(o => o.id === opportunityId);
    if (!opp) return;

    db.createApplication({
      id: `app_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      opportunityId,
      studentId: studentProfile.id,
      status: 'Applied',
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      matchScoreAtApply: matchScore,
      notes: `Applied with dynamic match score of ${matchScore}%.`
    });

    setToastMessage(`Application successfully submitted to ${opp.companyName}!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Companies Matching You</h2>
            <Badge variant="indigo" size="sm">Dynamic Match Algorithm</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time percentage matching based on your branch, CGPA ({studentProfile.cgpa.toFixed(1)}), target role, and verified skills.
          </p>
        </div>

        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition cursor-pointer"
          >
            Browse All ({opportunities.length}) &rarr;
          </button>
        )}
      </div>

      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-700 hover:underline">Dismiss</button>
        </div>
      )}

      {/* Matching Opportunities Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
        {displayed.map(({ opportunity, matchPercentage, isEligible, explanation, matchingSkills, missingSkills }) => {
          const application = applications.find(a => a.opportunityId === opportunity.id);
          const hasApplied = !!application;

          const matchBadgeColor =
            matchPercentage >= 80
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : matchPercentage >= 60
              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
              : 'bg-amber-50 text-amber-700 border-amber-200';

          return (
            <div
              key={opportunity.id}
              className="flex flex-col justify-between p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition bg-white"
            >
              <div className="space-y-3">
                {/* Header: Company & Match % */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block leading-tight">
                      {opportunity.title}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 mt-0.5">
                      <Building2 className="w-3 h-3 text-slate-400" />
                      <span>{opportunity.companyName}</span>
                    </div>
                  </div>
                  <div className={`px-2.5 py-1 rounded-lg border text-xs font-extrabold shrink-0 text-center ${matchBadgeColor}`}>
                    {matchPercentage}% Match
                  </div>
                </div>

                {/* Location & Package */}
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" /> {opportunity.location} ({opportunity.workMode})
                  </span>
                  <span>&bull;</span>
                  <span className="font-semibold text-slate-700">{opportunity.salaryOrStipend}</span>
                </div>

                {/* Natural Language Explanation Format */}
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 text-[11px] text-slate-700 space-y-1">
                  <span className="font-bold text-slate-900 block">Why you match:</span>
                  <p className="leading-relaxed italic">
                    "{explanation}"
                  </p>
                </div>

                {/* Skills Analysis */}
                <div className="space-y-1.5 text-[11px]">
                  {matchingSkills.length > 0 && (
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-semibold block">Matching Skills</span>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {matchingSkills.map((sk, idx) => (
                          <span key={idx} className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded text-[10px] font-medium">
                            ✓ {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {missingSkills.length > 0 && (
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-semibold block">Recommended to Acquire</span>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {missingSkills.map((sk, idx) => (
                          <span key={idx} className="bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded text-[10px] font-medium">
                            + {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  Min CGPA: <b>{opportunity.minCGPA}</b>
                </span>

                {hasApplied ? (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Applied ({application?.status})
                  </span>
                ) : (
                  <button
                    onClick={() => handleApply(opportunity.id, matchPercentage)}
                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition shadow-xs cursor-pointer flex items-center gap-1"
                  >
                    Apply Now <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {displayed.length === 0 && (
        <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-400 text-xs">
          No matching open opportunities currently recorded in the database.
        </div>
      )}
    </div>
  );
};
