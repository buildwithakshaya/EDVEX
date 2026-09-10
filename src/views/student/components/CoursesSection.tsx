import React, { useState } from 'react';
import { db } from '../../../db/storage';
import { CourseItem, StudentProfile, StudentSkill, SkillGapItem } from '../../../types';
import { BookOpen, Award, CheckCircle2, Clock, ExternalLink, Bookmark, Sparkles, UserCheck } from 'lucide-react';
import { Badge } from '../../../components/common/Badge';

interface CoursesSectionProps {
  studentProfile: StudentProfile;
  studentSkills: StudentSkill[];
  skillGaps?: SkillGapItem[];
  limit?: number;
  onViewAll?: () => void;
}

export const CoursesSection: React.FC<CoursesSectionProps> = ({
  studentProfile,
  studentSkills,
  skillGaps = [],
  limit,
  onViewAll
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const allCourses = db.getCourses();
  const studentProgressList = db.getStudentCourseProgress(studentProfile.id);
  const facultyRecs = db.getFacultyRecommendations(studentProfile.id);

  // Missing skills from career gap
  const missingSkillNames = new Set(
    skillGaps
      .filter(g => g.status === 'Missing' || g.status === 'Needs Improvement')
      .map(g => g.skillName.toLowerCase())
  );

  // Recommendation score calculation
  const scoredCourses = allCourses.map(course => {
    let score = 0;
    const reasons: string[] = [];

    // 1. Branch match
    if (course.branchIds.includes(studentProfile.branchId) || course.branchIds.includes('All')) {
      score += 30;
      reasons.push('Branch Aligned');
    }

    // 2. Teaches a skill the student has as gap
    const addressesGap = course.skillsTaught.some(skill => 
      missingSkillNames.has(skill.toLowerCase())
    );
    if (addressesGap) {
      score += 40;
      reasons.push('Fixes Skill Gap');
    }

    // 3. Faculty recommendation
    const facultyRec = facultyRecs.find(r => 
      r.courseOrCertName?.toLowerCase() === course.title.toLowerCase() ||
      course.skillsTaught.some(s => s.toLowerCase() === r.recommendedSkill.toLowerCase())
    );
    if (facultyRec) {
      score += 50;
      reasons.push(`Recommended by ${facultyRec.facultyName}`);
    }

    // 4. Check enrollment status
    const progress = studentProgressList.find(p => p.courseId === course.id);

    return {
      course,
      score,
      reasons,
      progress,
      facultyRec
    };
  });

  // Sort by recommendation score descending
  const filtered = scoredCourses
    .filter(item => {
      if (filterType === 'all') return true;
      if (filterType === 'enrolled') return !!item.progress;
      if (filterType === 'faculty') return !!item.facultyRec;
      if (filterType === 'Certification') return item.course.type === 'Certification';
      if (filterType === 'Course') return item.course.type === 'Course';
      return true;
    })
    .sort((a, b) => b.score - a.score);

  const displayed = limit ? filtered.slice(0, limit) : filtered;

  const handleUpdateStatus = (courseId: string, newStatus: 'Interested' | 'In Progress' | 'Completed') => {
    db.setCourseStatus(studentProfile.id, courseId, newStatus);
    setToastMessage(`Course status updated to "${newStatus}"`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Recommended Courses & Certifications</h2>
            <Badge variant="indigo" size="sm">Dynamic AI Matching</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Curated programs addressing your career skill gaps and verified faculty recommendations for {studentProfile.careerGoal || 'your branch'}.
          </p>
        </div>

        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition cursor-pointer"
          >
            View All ({allCourses.length}) &rarr;
          </button>
        )}
      </div>

      {toastMessage && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-medium flex items-center justify-between">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-emerald-700 hover:underline">Dismiss</button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
            filterType === 'all'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All Recommendations
        </button>
        <button
          onClick={() => setFilterType('faculty')}
          className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
            filterType === 'faculty'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Faculty Recommended ({scoredCourses.filter(c => c.facultyRec).length})
        </button>
        <button
          onClick={() => setFilterType('enrolled')}
          className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
            filterType === 'enrolled'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          My Tracked ({studentProgressList.length})
        </button>
        <button
          onClick={() => setFilterType('Certification')}
          className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
            filterType === 'Certification'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Certifications
        </button>
      </div>

      {/* Grid of Courses */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
        {displayed.map(({ course, reasons, progress, facultyRec }) => {
          const currentStatus = progress?.status || 'Not Started';

          return (
            <div
              key={course.id}
              className="flex flex-col justify-between p-4 rounded-xl border border-slate-200/90 hover:border-indigo-300 hover:shadow-xs transition bg-white"
            >
              <div className="space-y-2.5">
                {/* Badges / Header */}
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    {course.provider}
                  </span>
                  <Badge
                    variant={course.type === 'Certification' ? 'emerald' : 'indigo'}
                    size="sm"
                  >
                    {course.type}
                  </Badge>
                </div>

                <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                  {course.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2">
                  {course.description}
                </p>

                {/* Faculty Callout if applicable */}
                {facultyRec && (
                  <div className="p-2 bg-amber-50/80 border border-amber-200 rounded-lg text-[11px] text-amber-900 space-y-0.5">
                    <div className="flex items-center gap-1 font-semibold text-amber-800">
                      <UserCheck className="w-3.5 h-3.5 text-amber-700" />
                      <span>Recommended by {facultyRec.facultyName}</span>
                    </div>
                    <p className="text-amber-800/90 italic line-clamp-2">"{facultyRec.reason}"</p>
                  </div>
                )}

                {/* Skills Taught */}
                <div className="flex flex-wrap gap-1">
                  {course.skillsTaught.map((sk, idx) => {
                    const isGap = missingSkillNames.has(sk.toLowerCase());
                    return (
                      <span
                        key={idx}
                        className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                          isGap
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {sk} {isGap && '★ Skill Gap'}
                      </span>
                    );
                  })}
                </div>

                {/* Meta details */}
                <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {course.duration}
                  </span>
                  <span>&bull;</span>
                  <span>{course.level}</span>
                  <span>&bull;</span>
                  <span className="text-amber-600 font-semibold">★ {course.rating}</span>
                </div>
              </div>

              {/* Action Buttons / Status Tracker */}
              <div className="pt-4 mt-3 border-t border-slate-100 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">My Status:</span>
                  <span
                    className={`font-semibold ${
                      currentStatus === 'Completed'
                        ? 'text-emerald-700'
                        : currentStatus === 'In Progress'
                        ? 'text-indigo-700'
                        : currentStatus === 'Interested'
                        ? 'text-amber-700'
                        : 'text-slate-400'
                    }`}
                  >
                    {currentStatus}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                  <button
                    onClick={() => handleUpdateStatus(course.id, 'Interested')}
                    className={`py-1 rounded font-medium transition cursor-pointer border ${
                      currentStatus === 'Interested'
                        ? 'bg-amber-100 border-amber-300 text-amber-900 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Bookmark
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(course.id, 'In Progress')}
                    className={`py-1 rounded font-medium transition cursor-pointer border ${
                      currentStatus === 'In Progress'
                        ? 'bg-indigo-100 border-indigo-300 text-indigo-900 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(course.id, 'Completed')}
                    className={`py-1 rounded font-medium transition cursor-pointer border ${
                      currentStatus === 'Completed'
                        ? 'bg-emerald-100 border-emerald-300 text-emerald-900 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Completed
                  </button>
                </div>

                {course.link && (
                  <a
                    href={course.link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 flex items-center justify-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition text-center"
                  >
                    View Provider Details <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {displayed.length === 0 && (
        <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-400 text-xs">
          No courses matching the selected filter.
        </div>
      )}
    </div>
  );
};
