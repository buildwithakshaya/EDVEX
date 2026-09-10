import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../db/storage';
import { Opportunity, OpportunityType, ApplicationStatus } from '../../types';
import {
  Briefcase,
  Users,
  Building2,
  FileCheck,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  Award
} from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { calculateJobReadiness } from '../../utils/calculations';

interface IndustryPortalProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export const IndustryPortal: React.FC<IndustryPortalProps> = ({ currentTab, onNavigate }) => {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  // New Job Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<OpportunityType>('Internship');
  const [location, setLocation] = useState('Pune, Maharashtra');
  const [workMode, setWorkMode] = useState<'On-site' | 'Hybrid' | 'Remote'>('Hybrid');
  const [minCGPA, setMinCGPA] = useState(7.0);
  const [salary, setSalary] = useState('₹35,000 / month');
  const [openings, setOpenings] = useState(3);
  const [deadline, setDeadline] = useState('2027-05-30');
  const [description, setDescription] = useState('');
  const [selectedBranches, setSelectedBranches] = useState<string[]>(['b_mech', 'b_cse']);

  // All data from DB
  const opportunities = db.getOpportunities();
  const applications = db.getApplications();
  const allStudents = db.getStudentProfiles();
  const allStudentSkills = db.getAllStudentSkills();
  const allSkills = db.getSkills();
  const branches = db.getBranches();

  // Company-specific filtering
  const companyName = currentUser?.companyName || 'Tata Technologies';
  const myOpportunities = opportunities.filter(o => o.companyName.toLowerCase().includes(companyName.toLowerCase().slice(0, 4)));
  const myOppIds = new Set(myOpportunities.map(o => o.id));
  const myApplications = applications.filter(a => myOppIds.has(a.opportunityId));

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newOpp: Opportunity = {
      id: `opp_${Date.now()}`,
      companyId: currentUser?.id || 'comp_1',
      companyName: companyName,
      title: title.trim(),
      type,
      location,
      workMode,
      description: description.trim() || 'Exciting engineering role working on real-world projects with dedicated mentorship.',
      eligibleDegrees: ['B.Tech', 'B.E.', 'M.Tech'],
      eligibleBranchIds: selectedBranches,
      minCGPA,
      requiredSkills: [
        { skillId: 'sk_solidworks', minProficiency: 'Intermediate', importance: 'Required' },
        { skillId: 'sk_autocad', minProficiency: 'Intermediate', importance: 'Required' }
      ],
      salaryOrStipend: salary,
      openings,
      deadline,
      status: 'Open',
      createdAt: new Date().toISOString()
    };

    db.addOpportunity(newOpp);
    setIsPostModalOpen(false);
    setTitle('');
    setDescription('');
  };

  const handleUpdateAppStatus = (appId: string, status: ApplicationStatus) => {
    db.updateApplicationStatus(appId, status);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              {companyName} &bull; Talent & Placements
            </h1>
            <Badge variant="indigo" size="sm">Industry Verified</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Post opportunities, review candidate readiness scores, and manage talent pipeline dynamically.
          </p>
        </div>

        <button
          onClick={() => setIsPostModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Post New Job / Internship
        </button>
      </div>

      {/* DASHBOARD TAB */}
      {(currentTab === 'dashboard' || currentTab === 'jobs_internships') && (
        <div className="space-y-6">
          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <StatCard
              title="Active Postings"
              value={myOpportunities.length}
              subtitle="Published to portal"
              icon={<Briefcase className="w-5 h-5" />}
              color="indigo"
            />
            <StatCard
              title="Total Applicants"
              value={myApplications.length}
              subtitle="From university partners"
              icon={<Users className="w-5 h-5" />}
              color="blue"
            />
            <StatCard
              title="Shortlisted / In Review"
              value={myApplications.filter(a => a.status === 'Shortlisted' || a.status === 'Interview' || a.status === 'Under Review').length}
              subtitle="Active pipeline"
              icon={<FileCheck className="w-5 h-5" />}
              color="amber"
            />
            <StatCard
              title="Hired / Selected"
              value={myApplications.filter(a => a.status === 'Selected').length}
              subtitle="Offers confirmed"
              icon={<CheckCircle2 className="w-5 h-5" />}
              color="emerald"
            />
          </div>

          {/* Active Job Postings Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                My Posted Opportunities ({myOpportunities.length})
              </h3>
              <span className="text-[11px] text-slate-500">Live on Student Portal</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase">
                    <th className="py-3 px-4">Role Title</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Min CGPA</th>
                    <th className="py-3 px-4">Stipend / CTC</th>
                    <th className="py-3 px-4">Applicants</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {myOpportunities.map((opp) => {
                    const applicantCount = applications.filter(a => a.opportunityId === opp.id).length;
                    return (
                      <tr key={opp.id} className="hover:bg-slate-50 transition">
                        <td className="py-3.5 px-4 font-bold text-slate-900">{opp.title}</td>
                        <td className="py-3.5 px-4"><Badge variant="slate" size="sm">{opp.type}</Badge></td>
                        <td className="py-3.5 px-4">{opp.location} ({opp.workMode})</td>
                        <td className="py-3.5 px-4 font-semibold text-slate-900">{opp.minCGPA}</td>
                        <td className="py-3.5 px-4 font-medium text-slate-800">{opp.salaryOrStipend}</td>
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => onNavigate('applications')}
                            className="font-bold text-indigo-600 hover:underline cursor-pointer"
                          >
                            {applicantCount} applied &rarr;
                          </button>
                        </td>
                        <td className="py-3.5 px-4"><Badge variant="emerald" size="sm">{opp.status}</Badge></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CANDIDATES DIRECTORY */}
      {currentTab === 'candidates' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search candidates by name, branch, skills (e.g. Mechanical, SolidWorks)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allStudents.map((st) => {
              const skills = allStudentSkills.filter(s => s.studentId === st.id);
              const attempts = db.getAssessmentAttempts(st.id);
              const projects = db.getProjects(st.id);
              const certs = db.getCertifications(st.id);
              const readiness = calculateJobReadiness(st, skills, attempts, projects, certs);

              return (
                <div key={st.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{st.fullName}</h4>
                      <p className="text-[11px] text-slate-500">{st.degree} &bull; {st.department}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        {readiness.overall}% Ready
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1">
                    <p>University: <span className="font-semibold text-slate-800">{st.university}</span></p>
                    <p>CGPA: <span className="font-bold text-slate-900">{st.cgpa}</span> &bull; Grad: {st.graduationYear}</p>
                    <p>Career Goal: <span className="text-indigo-600 font-medium">{st.careerGoal}</span></p>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Verified Skills:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {skills.slice(0, 4).map(sk => {
                        const base = allSkills.find(s => s.id === sk.skillId);
                        return (
                          <Badge key={sk.id} variant="slate" size="sm">
                            {base ? base.name : sk.skillId} ({sk.proficiency})
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* APPLICATIONS TAB */}
      {currentTab === 'applications' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Candidate Applications Pipeline ({myApplications.length})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Update candidate status. Students will immediately see the updated status in their application tracker.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase">
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Applied Role</th>
                  <th className="py-3 px-4">Calculated Match</th>
                  <th className="py-3 px-4">Applied Date</th>
                  <th className="py-3 px-4">Update Status (Interactive)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {myApplications.map((app) => {
                  const student = allStudents.find(s => s.id === app.studentId);
                  const opp = opportunities.find(o => o.id === app.opportunityId);

                  return (
                    <tr key={app.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {student ? student.fullName : app.studentId}
                        <span className="block text-[11px] text-slate-500 font-normal">
                          {student?.department} &bull; CGPA {student?.cgpa}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-slate-800">
                        {opp ? opp.title : 'Opportunity'}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                          {app.matchScoreAtApply || 85}%
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-500">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={app.status}
                          onChange={(e) => handleUpdateAppStatus(app.id, e.target.value as ApplicationStatus)}
                          className="text-xs font-semibold px-2.5 py-1 rounded-md border border-slate-300 bg-white cursor-pointer"
                        >
                          <option value="Applied">Applied</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Interview">Interview Scheduled</option>
                          <option value="Selected">Selected / Offer</option>
                          <option value="Rejected">Rejected / Archived</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* POST NEW JOB MODAL */}
      <Modal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        title="Post New Job or Internship"
        subtitle="Specify branch eligibility, required skills, and criteria"
      >
        <form onSubmit={handleCreateJob} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Opportunity Title</label>
            <input
              type="text"
              required
              placeholder="E.g. Junior Mechanical Design Engineer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as OpportunityType)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
              >
                <option value="Internship">Internship</option>
                <option value="Job">Full-time Job</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Work Mode</label>
              <select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
              >
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Min CGPA</label>
              <input
                type="number"
                step="0.1"
                value={minCGPA}
                onChange={(e) => setMinCGPA(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Stipend / CTC</label>
              <input
                type="text"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Eligible Branches (from Database)</label>
            <div className="grid grid-cols-2 gap-2 p-2 border border-slate-200 rounded-lg max-h-32 overflow-y-auto text-xs">
              {branches.map(b => (
                <label key={b.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedBranches.includes(b.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedBranches([...selectedBranches, b.id]);
                      } else {
                        setSelectedBranches(selectedBranches.filter(id => id !== b.id));
                      }
                    }}
                  />
                  <span>{b.code} ({b.name})</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsPostModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition"
            >
              Publish Opportunity
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
