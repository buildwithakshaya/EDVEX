import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../db/storage';
import { Opportunity, Application } from '../../types';
import { calculateOpportunityMatch } from '../../utils/calculations';
import {
  Briefcase,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building,
  Send,
  Sparkles
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';

export const StudentOpportunitiesView: React.FC = () => {
  const { studentProfile } = useAuth();
  const [filterType, setFilterType] = useState<'All' | 'Job' | 'Internship'>('All');
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [coverNote, setCoverNote] = useState('');
  const [appliedSuccess, setAppliedSuccess] = useState<string | null>(null);

  if (!studentProfile) return null;

  const opportunities = db.getOpportunities().filter(o => o.status === 'Open');
  const studentSkills = db.getStudentSkills(studentProfile.id);
  const allSkills = db.getSkills();
  const existingApplications = db.getApplicationsByStudent(studentProfile.id);

  // Set of opportunity IDs already applied to
  const appliedOppIds = new Set(existingApplications.map(a => a.opportunityId));

  // Dynamic calculations for each opportunity
  const matchedList = opportunities
    .filter(opp => filterType === 'All' || opp.type === filterType)
    .map(opp => calculateOpportunityMatch(studentProfile, studentSkills, opp, allSkills))
    .sort((a, b) => b.matchPercentage - a.matchPercentage);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOpportunity) return;

    const matchCalc = calculateOpportunityMatch(studentProfile, studentSkills, selectedOpportunity, allSkills);

    const newApp: Application = {
      id: `app_${Date.now()}`,
      opportunityId: selectedOpportunity.id,
      studentId: studentProfile.id,
      status: 'Applied',
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: coverNote.trim() || 'Applied via SkillBridge Portal with verified academic portfolio.',
      matchScoreAtApply: matchCalc.matchPercentage
    };

    db.createApplication(newApp);

    // Add notification
    db.addNotification({
      id: `notif_${Date.now()}`,
      userId: studentProfile.userId,
      title: 'Application Submitted',
      message: `Your application for ${selectedOpportunity.title} at ${selectedOpportunity.companyName} was successfully recorded.`,
      date: new Date().toISOString(),
      read: false,
      type: 'application'
    });

    setAppliedSuccess(selectedOpportunity.title);
    setSelectedOpportunity(null);
    setCoverNote('');
    setTimeout(() => setAppliedSuccess(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Dynamic Opportunity Matching
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Match scores calculated in real time against your branch eligibility, CGPA, and specific skill proficiencies.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setFilterType('All')}
            className={`px-3 py-1.5 rounded-md transition ${filterType === 'All' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'}`}
          >
            All Openings ({opportunities.length})
          </button>
          <button
            onClick={() => setFilterType('Job')}
            className={`px-3 py-1.5 rounded-md transition ${filterType === 'Job' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'}`}
          >
            Jobs
          </button>
          <button
            onClick={() => setFilterType('Internship')}
            className={`px-3 py-1.5 rounded-md transition ${filterType === 'Internship' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'}`}
          >
            Internships
          </button>
        </div>
      </div>

      {appliedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-emerald-800 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Application successfully submitted for "{appliedSuccess}"! Track status in Applications tab.</span>
        </div>
      )}

      {matchedList.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No matching opportunities available."
          description="New industry opportunities will appear here automatically when posted."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {matchedList.map(({ opportunity, matchPercentage, isEligible, eligibilityReasons, explanation, matchingSkills, missingSkills }) => {
            const hasApplied = appliedOppIds.has(opportunity.id);

            return (
              <div
                key={opportunity.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-indigo-200 transition"
              >
                <div>
                  {/* Top: Company & Match badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-semibold text-indigo-600 flex items-center gap-1">
                        <Building className="w-3.5 h-3.5" />
                        {opportunity.companyName}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 mt-0.5 leading-snug">
                        {opportunity.title}
                      </h3>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 font-extrabold text-xs">
                        <Sparkles className="w-3 h-3 text-indigo-600" />
                        {matchPercentage}% Match
                      </div>
                      <span className="block text-[10px] text-slate-400 mt-0.5">{opportunity.type}</span>
                    </div>
                  </div>

                  {/* Meta tags */}
                  <div className="flex flex-wrap items-center gap-2 mt-3 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {opportunity.location} ({opportunity.workMode})
                    </span>
                    <span>&bull;</span>
                    <span className="font-semibold text-slate-700">{opportunity.salaryOrStipend}</span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      Deadline: {opportunity.deadline}
                    </span>
                  </div>

                  {/* Match Progress & Explanation */}
                  <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1.5">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-semibold text-slate-700">Dynamic Profile Match</span>
                      <span className="font-bold text-indigo-700">{matchPercentage}%</span>
                    </div>
                    <ProgressBar value={matchPercentage} size="sm" color="auto" />
                    <p className="text-[11px] text-slate-600 italic leading-snug pt-0.5">
                      "{explanation}"
                    </p>
                  </div>

                  {/* Description */}
                  <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {opportunity.description}
                  </p>

                  {/* Skills tags */}
                  <div className="mt-3 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Required Skills:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {opportunity.requiredSkills.map(req => {
                        const skillObj = allSkills.find(s => s.id === req.skillId);
                        const name = skillObj ? skillObj.name : req.skillId;
                        const isMatched = matchingSkills.some(ms => ms.startsWith(name));

                        return (
                          <Badge
                            key={req.skillId}
                            variant={isMatched ? 'emerald' : 'slate'}
                            size="sm"
                          >
                            {name} ({req.minProficiency})
                          </Badge>
                        );
                      })}
                    </div>
                  </div>

                  {/* Eligibility Flags */}
                  <div className="flex items-center gap-2 mt-3 text-[11px]">
                    <span
                      className={`inline-flex items-center gap-1 font-medium ${
                        eligibilityReasons.cgpaMet ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      {eligibilityReasons.cgpaMet ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      Min CGPA: {opportunity.minCGPA}
                    </span>
                    <span className="text-slate-300">|</span>
                    <span
                      className={`inline-flex items-center gap-1 font-medium ${
                        eligibilityReasons.branchMet ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      {eligibilityReasons.branchMet ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      Branch Eligible
                    </span>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Openings: <b className="text-slate-700">{opportunity.openings}</b>
                  </span>

                  {hasApplied ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Applied
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setSelectedOpportunity(opportunity)}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition cursor-pointer"
                    >
                      <Send className="w-3 h-3" />
                      Apply Now
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* APPLY MODAL */}
      <Modal
        isOpen={selectedOpportunity !== null}
        onClose={() => setSelectedOpportunity(null)}
        title={`Apply to ${selectedOpportunity?.title}`}
        subtitle={`${selectedOpportunity?.companyName} &bull; ${selectedOpportunity?.location}`}
      >
        {selectedOpportunity && (
          <form onSubmit={handleApply} className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Applicant:</span>
                <span className="font-bold text-slate-900">{studentProfile.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Degree & Branch:</span>
                <span className="font-bold text-slate-900">{studentProfile.degree} ({studentProfile.department})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">CGPA:</span>
                <span className="font-bold text-indigo-700">{studentProfile.cgpa} / 10.0</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Candidate Note / Portfolio Highlights
              </label>
              <textarea
                rows={3}
                placeholder="State your branch domain projects and relevant technical competencies..."
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <p className="text-[11px] text-slate-500">
              By submitting, your dynamic profile (verified skills, projects, assessment scores) will be made visible to {selectedOpportunity.companyName}.
            </p>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedOpportunity(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition"
              >
                Confirm Application
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
