import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../db/storage';
import { HackathonsSection } from './components/HackathonsSection';
import { EmptyState } from '../../components/common/EmptyState';
import { AlertCircle } from 'lucide-react';

export const StudentHackathonsView: React.FC = () => {
  const { studentProfile } = useAuth();

  if (!studentProfile) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Profile Required"
        description="Please complete your profile to explore and register for hackathons."
      />
    );
  }

  const studentSkills = db.getStudentSkills(studentProfile.id);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Hackathons & Competitions
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Compete in Smart India Hackathon (SIH) problem statements, national innovation sprints, and industry challenges.
        </p>
      </div>

      <HackathonsSection
        studentProfile={studentProfile}
        studentSkills={studentSkills}
      />
    </div>
  );
};
