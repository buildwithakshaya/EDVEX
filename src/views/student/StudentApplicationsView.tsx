import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../db/storage';
import { ApplicationStatus } from '../../types';
import { FileCheck, Building, Calendar, ArrowRight } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';

interface StudentApplicationsViewProps {
  onNavigate?: (tab: string) => void;
}

export const StudentApplicationsView: React.FC<StudentApplicationsViewProps> = ({ onNavigate }) => {
  const { studentProfile } = useAuth();

  if (!studentProfile) return null;

  const applications = db.getApplicationsByStudent(studentProfile.id);
  const opportunities = db.getOpportunities();

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'Applied':
        return <Badge variant="blue" size="sm" dot>Applied</Badge>;
      case 'Under Review':
        return <Badge variant="amber" size="sm" dot>Under Review</Badge>;
      case 'Shortlisted':
        return <Badge variant="indigo" size="sm" dot>Shortlisted</Badge>;
      case 'Interview':
        return <Badge variant="purple" size="sm" dot>Interview Scheduled</Badge>;
      case 'Selected':
        return <Badge variant="emerald" size="sm" dot>Selected / Offer</Badge>;
      case 'Rejected':
        return <Badge variant="rose" size="sm" dot>Archived / Rejected</Badge>;
      default:
        return <Badge variant="slate" size="sm">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Application Tracking</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time status tracking for your submitted internship and placement applications.
          </p>
        </div>
      </div>

      {applications.length === 0 ? (
        <EmptyState
          icon={FileCheck}
          title="No applications yet."
          description="Explore matched opportunities and apply with your verified skills and academic record."
          actionLabel="Explore Opportunities"
          onAction={() => onNavigate && onNavigate('opportunities')}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Opportunity</th>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Applied Date</th>
                  <th className="py-3 px-4">Match at Application</th>
                  <th className="py-3 px-4">Current Status (Live)</th>
                  <th className="py-3 px-4">Applicant Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {applications.map((app) => {
                  const opp = opportunities.find(o => o.id === app.opportunityId);

                  return (
                    <tr key={app.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {opp ? opp.title : 'Opportunity'}
                        <span className="block text-[10px] text-slate-400 font-normal mt-0.5">
                          {opp?.type} &bull; {opp?.location}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-medium text-slate-800">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          {opp?.companyName || 'Company'}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(app.appliedAt).toLocaleDateString()}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                          {app.matchScoreAtApply || 85}% Match
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {getStatusBadge(app.status)}
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate" title={app.notes}>
                        {app.notes || '—'}
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
