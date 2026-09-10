import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../db/storage';
import { CoursesSection } from './components/CoursesSection';
import { calculateCareerReadiness } from '../../utils/calculations';
import { EmptyState } from '../../components/common/EmptyState';
import { AlertCircle } from 'lucide-react';

export const StudentCoursesView: React.FC = () => {
  const { studentProfile } = useAuth();

  if (!studentProfile) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Profile Required"
        description="Please complete your profile to view personalized courses and certifications."
      />
    );
  }

  const studentSkills = db.getStudentSkills(studentProfile.id);
  const careerRoles = db.getCareerRoles();
  const allSkills = db.getSkills();
  const attempts = db.getAssessmentAttempts(studentProfile.id);
  const projects = db.getProjects(studentProfile.id);

  const targetRole = careerRoles.find(r => r.title === studentProfile.careerGoal) || careerRoles[0];
  const careerAnalysis = targetRole
    ? calculateCareerReadiness(studentProfile, studentSkills, targetRole, allSkills, attempts, projects)
    : null;

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Courses & Certifications
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Explore accredited industry courses, certifications, and faculty recommendations mapped directly to your degree and target role.
        </p>
      </div>

      <CoursesSection
        studentProfile={studentProfile}
        studentSkills={studentSkills}
        skillGaps={careerAnalysis?.skillGapList || []}
      />
    </div>
  );
};
