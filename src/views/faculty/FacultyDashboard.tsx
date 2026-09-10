import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../db/storage';
import {
  calculateFacultyClassAnalytics,
  calculateJobReadiness,
  calculateCareerReadiness
} from '../../utils/calculations';
import {
  Users,
  Award,
  BookOpen,
  Cpu,
  Search,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Send,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Lightbulb,
  UserCheck
} from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';

interface FacultyDashboardProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({
  currentTab,
  onNavigate
}) => {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudentForRec, setSelectedStudentForRec] = useState<string>('');
  const [recSkill, setRecSkill] = useState('');
  const [recCourseName, setRecCourseName] = useState('');
  const [recReason, setRecReason] = useState('');
  const [recUrgency, setRecUrgency] = useState<'High' | 'Medium' | 'Low'>('High');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Determine faculty department
  const facultyDept = currentUser?.department || 'Mechanical Engineering';

  // Load database records
  const allStudents = db.getAllStudents();
  const studentSkills = db.getAllStudentSkills();
  const allSkills = db.getSkills();
  const careerRoles = db.getCareerRoles();
  const attempts = db.getAllAssessmentAttempts();
  const projects = db.getAllProjects();
  const certs = db.getAllCertifications();
  const courses = db.getCourses();
  const existingRecs = db.getAllFacultyRecommendations();

  // Run calculation for faculty's class
  const facultyAnalytics = calculateFacultyClassAnalytics(
    facultyDept,
    allStudents,
    studentSkills,
    allSkills,
    careerRoles,
    attempts,
    projects,
    certs
  );

  // Filter students under this faculty
  const deptStudents = allStudents.filter(
    s => s.department.toLowerCase().includes('mech') || s.department.toLowerCase() === facultyDept.toLowerCase()
  );

  const filteredStudents = deptStudents.filter(
    s => s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
         s.careerGoal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Emerging technologies curated for faculty curriculum innovation
  const emergingTechs = [
    {
      title: 'Generative AI & LLMs in Engineering Design',
      domain: 'Cross-Disciplinary (CAD, Code, Systems)',
      maturity: 'Rapid Industry Adoption',
      industryDemand: 'High (+180% YoY)',
      summary: 'Prompt-driven topological optimization, generative stress simulations, and automated code-assistance in industrial PLM.',
      suggestedCurriculumUpdate: 'Introduce a 2-credit elective on "AI for Engineering Systems" in Semester 7.'
    },
    {
      title: 'Electric Vehicle (EV) Powertrain & BMS Architecture',
      domain: 'Mechanical / EEE / Automotive',
      maturity: 'Commercial High Growth',
      industryDemand: 'Very High (+240% YoY)',
      summary: 'Battery thermal management, motor drive simulation in MATLAB/Simulink, and CAN-bus protocol integration.',
      suggestedCurriculumUpdate: 'Convert standard IC Engine Lab into a hybrid Clean Powertrain & Battery testing bench.'
    },
    {
      title: 'Green Hydrogen Production & Fuel Cell Tech',
      domain: 'Mechanical / Chemical / Energy',
      maturity: 'National Mission Priority',
      industryDemand: 'Emerging (Government Mandate)',
      summary: 'Electrolyzer thermodynamics, cryogenic fluid transport, and renewable micro-grid hydrogen storage.',
      suggestedCurriculumUpdate: 'Include hydrogen combustion safety and fuel cell chemistry modules in Advanced Thermodynamics.'
    },
    {
      title: 'Industry 4.0, IIoT & Digital Twins',
      domain: 'Manufacturing & Smart Automation',
      maturity: 'Factory Floor Standard',
      industryDemand: 'Steady High (+120% YoY)',
      summary: 'Real-time telemetry from CNC machines, MQTT vibration sensors, and predictive maintenance dashboards.',
      suggestedCurriculumUpdate: 'Equip workshop machines with low-cost IoT vibration probes for student predictive maintenance projects.'
    }
  ];

  const handleSendRecommendation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForRec || !recSkill) return;

    const student = allStudents.find(s => s.id === selectedStudentForRec);
    if (!student) return;

    db.addFacultyRecommendation({
      id: `frec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      studentId: student.id,
      facultyId: currentUser?.id || 'fac_1',
      facultyName: currentUser?.fullName || 'Dr. K. S. Verma',
      recommendedSkill: recSkill,
      courseOrCertName: recCourseName || recSkill,
      type: 'Course',
      reason: recReason || `Targeted guidance to strengthen weak areas for ${student.careerGoal}`,
      createdAt: new Date().toISOString()
    });

    setToastMessage(`Recommendation for "${recSkill}" successfully dispatched to ${student.fullName}!`);
    setRecSkill('');
    setRecCourseName('');
    setRecReason('');
    setSelectedStudentForRec('');
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Faculty Mentoring & Academic Portal
            </h1>
            <Badge variant="indigo" size="sm">{facultyDept}</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Mentoring students in your section, analyzing classroom skill gaps, recommending courses, and tracking academic progress.
          </p>
        </div>

        {/* Tab switcher */}
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
            onClick={() => onNavigate('my_students')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
              currentTab === 'my_students'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            My Students ({deptStudents.length})
          </button>
          <button
            onClick={() => onNavigate('skill_analysis')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
              currentTab === 'skill_analysis'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Student Skill Analysis
          </button>
          <button
            onClick={() => onNavigate('recommendations')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
              currentTab === 'recommendations'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Course Recommendations
          </button>
          <button
            onClick={() => onNavigate('emerging_tech')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
              currentTab === 'emerging_tech'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Emerging Tech
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-700 hover:underline">Dismiss</button>
        </div>
      )}

      {/* 1. FACULTY OVERVIEW */}
      {(currentTab === 'dashboard' || currentTab === 'overview') && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Assigned Students"
              value={facultyAnalytics.totalStudents}
              subtitle={`Department: ${facultyDept}`}
              icon={<Users className="w-5 h-5" />}
              color="indigo"
            />

            <StatCard
              title="Class Avg Readiness"
              value={`${facultyAnalytics.averageReadiness}%`}
              subtitle="Job readiness score"
              icon={<Award className="w-5 h-5" />}
              color="emerald"
            />

            <StatCard
              title="Students Needing Guidance"
              value={facultyAnalytics.studentsNeedingAttention.length}
              subtitle="Readiness < 60% or critical gap"
              icon={<AlertTriangle className="w-5 h-5" />}
              color="rose"
            />

            <StatCard
              title="Faculty Recommendations"
              value={existingRecs.length}
              subtitle="Delivered to student portals"
              icon={<BookOpen className="w-5 h-5" />}
              color="blue"
            />
          </div>

          {/* Mentoring Priority & Classroom Strengths */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Immediate Attention Callout */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Students Requiring Immediate Mentoring
                    </h3>
                  </div>
                  <Badge variant="rose" size="sm">Priority</Badge>
                </div>

                <div className="mt-4 space-y-3">
                  {facultyAnalytics.studentsNeedingAttention.map(({ student, readiness, reason }) => (
                    <div key={student.id} className="p-3 bg-rose-50/50 rounded-xl border border-rose-100 text-xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-bold text-slate-900">{student.fullName}</span>
                          <span className="block text-[11px] text-slate-500">
                            Target: {student.careerGoal} &bull; CGPA: {student.cgpa}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-rose-100 text-rose-800">
                          {readiness}% Ready
                        </span>
                      </div>
                      <p className="text-[11px] text-rose-800 mt-2">
                        <b>Issue:</b> {reason}
                      </p>
                      <div className="pt-2 mt-2 border-t border-rose-100/80 flex justify-end">
                        <button
                          onClick={() => {
                            setSelectedStudentForRec(student.id);
                            onNavigate('recommendations');
                          }}
                          className="text-[11px] font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 cursor-pointer"
                        >
                          Recommend Course/Skill &rarr;
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Department Class Strengths vs Common Gaps */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Classroom Strengths & Common Deficiencies
                </h3>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-2">
                    Top Verified Competencies in Class:
                  </span>
                  <div className="space-y-2">
                    {facultyAnalytics.topStrengths.map((str, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-emerald-50/60 rounded-lg text-xs">
                        <span className="font-semibold text-slate-800">{str.skillName}</span>
                        <span className="text-emerald-800 font-bold text-[11px]">
                          {str.verifiedCount} students ({str.proficiencyPct}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block mb-2">
                    Common Gaps to Address in Lectures/Labs:
                  </span>
                  <div className="space-y-2">
                    {facultyAnalytics.commonGaps.map((gap, idx) => (
                      <div key={idx} className="p-2 bg-amber-50/60 rounded-lg text-xs space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-slate-800">{gap.skillName}</span>
                          <span className="text-amber-800 font-bold text-[10px]">
                            {gap.missingCount} missing
                          </span>
                        </div>
                        <p className="text-[10px] text-amber-900 italic">
                          Action: {gap.recommendation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 2. MY STUDENTS SECTION */}
      {(currentTab === 'my_students' || currentTab === 'dashboard') && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <h2 className="text-base font-bold text-slate-900">My Mentored Students</h2>
                <Badge variant="indigo" size="sm">Section: {facultyDept}</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Individual student profiles, calculated readiness scores, CGPA, and career aspirations.
              </p>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by student name, goal..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 w-56"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
            {filteredStudents.map(student => {
              const sSkills = studentSkills.filter(s => s.studentId === student.id);
              const sAttempts = attempts.filter(a => a.studentId === student.id);
              const sProjects = projects.filter(p => p.studentId === student.id);
              const sCerts = certs.filter(c => c.studentId === student.id);
              const readiness = calculateJobReadiness(student, sSkills, sAttempts, sProjects, sCerts);

              return (
                <div key={student.id} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-200 hover:shadow-xs transition flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{student.fullName}</h4>
                        <span className="text-[11px] text-slate-500">{student.email}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-extrabold ${
                        readiness.overall >= 75
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : readiness.overall >= 55
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {readiness.overall}% Ready
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2 rounded-lg text-slate-600">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">CGPA</span>
                        <span className="font-bold text-slate-800">{student.cgpa}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Target Goal</span>
                        <span className="font-semibold text-indigo-700 truncate block">{student.careerGoal}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Verified Skills ({sSkills.length}):</span>
                      <div className="flex flex-wrap gap-1">
                        {sSkills.slice(0, 4).map(sk => {
                          const obj = allSkills.find(s => s.id === sk.skillId);
                          return (
                            <span key={sk.id} className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px]">
                              {obj ? obj.name : sk.skillId}
                            </span>
                          );
                        })}
                        {sSkills.length > 4 && (
                          <span className="text-[10px] text-slate-400 px-1 py-0.5">+{sSkills.length - 4} more</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">
                      Projects: {sProjects.length} &bull; Certs: {sCerts.length}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedStudentForRec(student.id);
                        onNavigate('recommendations');
                      }}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                    >
                      Give Guidance &rarr;
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. STUDENT SKILL ANALYSIS SECTION */}
      {(currentTab === 'skill_analysis' || currentTab === 'dashboard') && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <h2 className="text-base font-bold text-slate-900">Classroom Skill Deficiency & Mastery Analysis</h2>
                <Badge variant="emerald" size="sm">Deep Skill Telemetry</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Detailed diagnostic breakdown identifying specific mechanical and engineering competencies where students require faculty intervention.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Skill Mastery Distribution ({deptStudents.length} Students)
              </h3>
              {facultyAnalytics.topStrengths.map((sk, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-800">{sk.skillName}</span>
                    <span className="font-semibold text-emerald-700">{sk.proficiencyPct}% Mastery</span>
                  </div>
                  <ProgressBar value={sk.proficiencyPct} size="sm" color="auto" />
                  <p className="text-[10px] text-slate-400">{sk.verifiedCount} of {deptStudents.length} students verified proficient</p>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-rose-800">
                Deficiency Radar & Recommended Pedagogical Adjustments
              </h3>
              {facultyAnalytics.commonGaps.map((gap, idx) => (
                <div key={idx} className="p-3 bg-rose-50/40 rounded-xl border border-rose-100 space-y-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">{gap.skillName}</span>
                    <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded">
                      {gap.missingCount} Missing
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    <b>Faculty Action:</b> {gap.recommendation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. COURSE & CERTIFICATION RECOMMENDATIONS (Mentoring Tool) */}
      {(currentTab === 'recommendations' || currentTab === 'dashboard') && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">Recommend Courses & Certifications</h2>
              <Badge variant="indigo" size="sm">Direct Mentoring</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Issue personalized learning guidance directly to a student's dashboard. Recommendations appear with your faculty endorsement tag.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recommendation Form */}
            <form onSubmit={handleSendRecommendation} className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Create Faculty Guidance Notice
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Student <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={selectedStudentForRec}
                  onChange={(e) => setSelectedStudentForRec(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">-- Choose student from section --</option>
                  {deptStudents.map(st => (
                    <option key={st.id} value={st.id}>
                      {st.fullName} ({st.department} &bull; Target: {st.careerGoal})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Recommended Skill / Subject <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ANSYS FEA Structural Analysis or Python for Engineers"
                  value={recSkill}
                  onChange={(e) => setRecSkill(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Associated Course or Certification (Optional)
                </label>
                <select
                  value={recCourseName}
                  onChange={(e) => setRecCourseName(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg"
                >
                  <option value="">-- Select from platform course registry --</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.title}>
                      [{c.provider}] {c.title} ({c.type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mentoring Advice / Why they need this
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. You have strong CAD fundamentals, but core automotive OEM placements require finite element stress verification."
                  value={recReason}
                  onChange={(e) => setRecReason(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-slate-600">Urgency:</span>
                  <select
                    value={recUrgency}
                    onChange={(e: any) => setRecUrgency(e.target.value)}
                    className="text-xs p-1 bg-white border border-slate-300 rounded"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Informational</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" /> Dispatch to Student
                </button>
              </div>
            </form>

            {/* Existing Recommendations Feed */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Recently Dispatched Faculty Recommendations ({existingRecs.length})
              </h3>

              {existingRecs.length > 0 ? (
                <div className="space-y-3 overflow-y-auto max-h-[480px] pr-1">
                  {existingRecs.map(rec => {
                    const student = allStudents.find(s => s.id === rec.studentId);
                    const studentName = student ? student.fullName : 'Student';
                    return (
                      <div key={rec.id} className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5 text-xs">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="font-bold text-slate-900">{studentName}</span>
                            <span className="text-[11px] text-slate-400 block">{rec.createdAt ? rec.createdAt.split('T')[0] : 'Recent'}</span>
                          </div>
                          <Badge variant="indigo" size="sm">
                            {rec.type}
                          </Badge>
                        </div>

                        <div className="p-2 bg-indigo-50/60 border border-indigo-100 rounded-lg text-indigo-950 font-medium">
                          Skill: <span className="font-bold">{rec.recommendedSkill || rec.courseOrCertName}</span>
                          {rec.courseOrCertName && (
                            <span className="block text-[11px] text-indigo-700 font-normal mt-0.5">
                              Course: {rec.courseOrCertName}
                            </span>
                          )}
                        </div>

                        {rec.reason && (
                          <p className="text-[11px] text-slate-600 italic">
                            "{rec.reason}"
                          </p>
                        )}

                        <div className="pt-1 text-[10px] text-slate-400 flex items-center gap-1">
                          <UserCheck className="w-3 h-3 text-slate-400" />
                          Signed: {rec.facultyName}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-400 text-xs">
                  No recommendations sent yet. Use the form to guide your students.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. EMERGING TECHNOLOGIES SECTION */}
      {(currentTab === 'emerging_tech' || currentTab === 'dashboard') && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-indigo-600" />
                <h2 className="text-base font-bold text-slate-900">Emerging Industry Technologies</h2>
                <Badge variant="indigo" size="sm">Curriculum Modernization</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Explore frontier industrial paradigms to propose curriculum revisions, laboratory upgrades, and semester electives.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emergingTechs.map((tech, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-200 hover:shadow-xs transition space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{tech.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{tech.domain}</p>
                  </div>
                  <Badge variant="emerald" size="sm">{tech.maturity}</Badge>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {tech.summary}
                </p>

                <div className="p-2.5 bg-indigo-50/70 border border-indigo-100 rounded-lg text-xs space-y-1">
                  <div className="flex items-center gap-1 font-bold text-indigo-900">
                    <Lightbulb className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Faculty Curriculum Action Suggestion:</span>
                  </div>
                  <p className="text-indigo-950/90 text-[11px]">
                    {tech.suggestedCurriculumUpdate}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">Industry Pulse: {tech.industryDemand}</span>
                  <span className="text-indigo-600 font-medium">Ready for Syllabus Board</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
