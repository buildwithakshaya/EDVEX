import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../db/storage';
import { CompaniesMatchingSection } from './components/CompaniesMatchingSection';
import { EmptyState } from '../../components/common/EmptyState';
import { AlertCircle } from 'lucide-react';

interface StudentMatchingCompaniesViewProps {
  onNavigate?: (tab: string) => void;
}

export const StudentMatchingCompaniesView: React.FC<StudentMatchingCompaniesViewProps> = ({ onNavigate }) => {
  const { studentProfile } = useAuth();

  if (!studentProfile) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Profile Required"
        description="Please complete your profile to view companies matching your skills."
      />
    );
  }

  const studentSkills = db.getStudentSkills(studentProfile.id);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Companies Matching You
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Detailed dynamic match explanations analyzing your verified skills against live corporate requirements.
        </p>
      </div>

      <CompaniesMatchingSection
        studentProfile={studentProfile}
        studentSkills={studentSkills}
        onNavigateToApplications={() => onNavigate && onNavigate('applications')}
      />
    </div>
  );
};
