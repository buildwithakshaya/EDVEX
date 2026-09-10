import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../db/storage';
import { StudentProfile, WorkMode } from '../../types';
import { Save, Check, User, GraduationCap, Compass } from 'lucide-react';

export const StudentProfileView: React.FC = () => {
  const { currentUser, studentProfile, refreshUserData } = useAuth();
  const branches = db.getBranches();
  const careerRoles = db.getCareerRoles();

  const [formData, setFormData] = useState<Partial<StudentProfile>>({
    fullName: studentProfile?.fullName || currentUser?.name || '',
    email: studentProfile?.email || currentUser?.email || '',
    phone: studentProfile?.phone || currentUser?.phone || '',
    location: studentProfile?.location || 'Pune, Maharashtra',
    university: studentProfile?.university || 'National Institute of Technology',
    degree: studentProfile?.degree || 'B.Tech',
    department: studentProfile?.department || 'Department of Mechanical Engineering',
    branchId: studentProfile?.branchId || 'b_mech',
    specialization: studentProfile?.specialization || 'Design & Automation',
    academicYear: studentProfile?.academicYear || 'Final Year (4th)',
    semester: studentProfile?.semester || 7,
    cgpa: studentProfile?.cgpa ?? 7.8,
    graduationYear: studentProfile?.graduationYear || 2027,
    careerGoal: studentProfile?.careerGoal || 'Mechanical Design Engineer',
    preferredLocation: studentProfile?.preferredLocation || 'Pune / Bengaluru',
    preferredWorkMode: (studentProfile?.preferredWorkMode as WorkMode) || 'On-site',
    bio: studentProfile?.bio || ''
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const profileToSave: StudentProfile = {
      id: studentProfile?.id || `sp_${Date.now()}`,
      userId: currentUser.id,
      fullName: formData.fullName || currentUser.name,
      email: formData.email || currentUser.email,
      phone: formData.phone,
      location: formData.location,
      university: formData.university || 'University',
      degree: formData.degree || 'B.Tech',
      department: formData.department || 'Engineering',
      branchId: formData.branchId || 'b_mech',
      specialization: formData.specialization,
      academicYear: formData.academicYear || 'Final Year (4th)',
      semester: Number(formData.semester) || 1,
      cgpa: Number(formData.cgpa) || 0,
      graduationYear: Number(formData.graduationYear) || 2027,
      careerGoal: formData.careerGoal || 'Software Developer',
      preferredLocation: formData.preferredLocation,
      preferredWorkMode: formData.preferredWorkMode,
      bio: formData.bio
    };

    db.saveStudentProfile(profileToSave);
    refreshUserData();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Student Profile</h1>
          <p className="text-xs text-slate-500">
            Edit your personal, academic, and career parameters. Calculations across the portal update immediately upon saving.
          </p>
        </div>
        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg animate-in fade-in">
            <Check className="w-4 h-4" />
            Saved & Recalculated!
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* PERSONAL INFORMATION */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <User className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">Personal Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Current Location (City, State)</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* ACADEMIC DETAILS */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">Academic Details (SIH Multi-Branch Mapping)</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">University / Institute</label>
              <input
                type="text"
                required
                value={formData.university}
                onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Degree</label>
              <select
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
              >
                <option value="B.Tech">B.Tech (Bachelor of Technology)</option>
                <option value="B.E.">B.E. (Bachelor of Engineering)</option>
                <option value="M.Tech">M.Tech (Master of Technology)</option>
                <option value="BCA">BCA (Computer Applications)</option>
                <option value="MCA">MCA (Computer Applications)</option>
                <option value="BBA">BBA (Business Administration)</option>
                <option value="MBA">MBA (Business Administration)</option>
                <option value="BSc">B.Sc (Bachelor of Science)</option>
                <option value="MSc">M.Sc (Master of Science)</option>
                <option value="Diploma">Diploma / Polytechnic</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Branch of Study <span className="text-indigo-600 font-bold">(Stored in DB, All Branches Supported)</span>
              </label>
              <select
                value={formData.branchId}
                onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                {branches.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.code}) — Category: {b.category}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 mt-1">
                Supports Computer, Mechanical, Electrical, Electronics, Civil, Chemical, Aerospace, Biotech, and Management.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Cumulative CGPA (Scale of 10.0)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                required
                value={formData.cgpa}
                onChange={(e) => setFormData({ ...formData, cgpa: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-bold text-indigo-700"
              />
              <p className="text-[10px] text-slate-400 mt-0.5">Directly influences Academic 20% weight in Job Readiness.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Current Semester</label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value, 10) || 1 })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Graduation Year</label>
              <input
                type="number"
                value={formData.graduationYear}
                onChange={(e) => setFormData({ ...formData, graduationYear: parseInt(e.target.value, 10) || 2027 })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Specialization / Minor</label>
              <input
                type="text"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                placeholder="E.g. Thermal Engineering or AI Systems"
              />
            </div>
          </div>
        </div>

        {/* CAREER PREFERENCES */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Compass className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">Career Goals & Preferences</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Career Target Role</label>
              <select
                value={formData.careerGoal}
                onChange={(e) => setFormData({ ...formData, careerGoal: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 font-semibold text-slate-800"
              >
                {careerRoles.map(cr => (
                  <option key={cr.id} value={cr.title}>
                    {cr.title} ({cr.category})
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-500 mt-1">
                Changing this immediately recomputes your Skill Gap and Career Readiness metrics!
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Work Mode</label>
              <select
                value={formData.preferredWorkMode}
                onChange={(e) => setFormData({ ...formData, preferredWorkMode: e.target.value as WorkMode })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
              >
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Job Locations</label>
              <input
                type="text"
                value={formData.preferredLocation}
                onChange={(e) => setFormData({ ...formData, preferredLocation: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                placeholder="E.g. Pune, Bengaluru, Hyderabad, Chennai, Delhi NCR"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Save Profile & Recalculate Metrics
          </button>
        </div>
      </form>
    </div>
  );
};
