import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../db/storage';
import { Project, Certification } from '../../types';
import { Plus, Trash2, FolderGit2, Award, ExternalLink, Calendar } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';

export const StudentProjectsView: React.FC = () => {
  const { studentProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'projects' | 'certifications'>('projects');

  // Project Modal State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectTech, setProjectTech] = useState('');
  const [projectRole, setProjectRole] = useState('');
  const [projectLink, setProjectLink] = useState('');

  // Cert Modal State
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [certName, setCertName] = useState('');
  const [certProvider, setCertProvider] = useState('');
  const [certDate, setCertDate] = useState('');
  const [certLink, setCertLink] = useState('');

  if (!studentProfile) return null;

  const projects = db.getProjects(studentProfile.id);
  const certs = db.getCertifications(studentProfile.id);

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle.trim()) return;

    const newProj: Project = {
      id: `proj_${Date.now()}`,
      studentId: studentProfile.id,
      title: projectTitle.trim(),
      description: projectDesc.trim(),
      technologies: projectTech.split(',').map(t => t.trim()).filter(Boolean),
      skillsUsed: [],
      role: projectRole.trim() || 'Contributor',
      projectLink: projectLink.trim()
    };

    db.addProject(newProj);
    setIsProjectModalOpen(false);
    setProjectTitle('');
    setProjectDesc('');
    setProjectTech('');
    setProjectRole('');
    setProjectLink('');
  };

  const handleDeleteProject = (id: string) => {
    if (window.confirm('Delete this project? Job readiness calculation will update.')) {
      db.deleteProject(id);
    }
  };

  const handleAddCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certName.trim()) return;

    const newCert: Certification = {
      id: `cert_${Date.now()}`,
      studentId: studentProfile.id,
      name: certName.trim(),
      provider: certProvider.trim(),
      issueDate: certDate || new Date().toISOString().split('T')[0],
      credentialLink: certLink.trim()
    };

    db.addCertification(newCert);
    setIsCertModalOpen(false);
    setCertName('');
    setCertProvider('');
    setCertDate('');
    setCertLink('');
  };

  const handleDeleteCert = (id: string) => {
    if (window.confirm('Delete this certification? Job readiness calculation will update.')) {
      db.deleteCertification(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Projects & Certifications</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified proof of hands-on technical competence. Accounts for 20% total weight in Job Readiness.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'projects' ? (
            <button
              onClick={() => setIsProjectModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Project
            </button>
          ) : (
            <button
              onClick={() => setIsCertModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Certification
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('projects')}
          className={`pb-2.5 px-4 text-xs font-semibold border-b-2 transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'projects'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FolderGit2 className="w-4 h-4" />
          Projects ({projects.length})
        </button>
        <button
          onClick={() => setActiveTab('certifications')}
          className={`pb-2.5 px-4 text-xs font-semibold border-b-2 transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'certifications'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          Certifications ({certs.length})
        </button>
      </div>

      {/* PROJECTS TAB */}
      {activeTab === 'projects' && (
        <>
          {projects.length === 0 ? (
            <EmptyState
              icon={FolderGit2}
              title="No projects added yet."
              description="Adding technical projects demonstrates practical application of your branch skills."
              actionLabel="+ Add First Project"
              onAction={() => setIsProjectModalOpen(true)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">{proj.title}</h3>
                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded transition"
                        title="Delete project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-[11px] font-medium text-indigo-600 mt-1">Role: {proj.role}</p>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{proj.description}</p>

                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {proj.technologies.map((t, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-700 rounded"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {proj.projectLink && (
                    <div className="pt-3 mt-4 border-t border-slate-100">
                      <a
                        href={proj.projectLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        View Project Repository / Deliverable
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* CERTIFICATIONS TAB */}
      {activeTab === 'certifications' && (
        <>
          {certs.length === 0 ? (
            <EmptyState
              icon={Award}
              title="No certifications added yet."
              description="Add verified industry credentials from Dassault, AWS, NPTEL, Coursera, or professional bodies."
              actionLabel="+ Add First Certification"
              onAction={() => setIsCertModalOpen(true)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certs.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                          <Award className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-slate-900 leading-snug">{cert.name}</h3>
                          <p className="text-[11px] text-slate-500">{cert.provider}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteCert(cert.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded transition"
                        title="Delete certification"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 mt-3 text-[11px] text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Issued: {cert.issueDate}</span>
                    </div>
                  </div>

                  {cert.credentialLink && (
                    <div className="pt-3 mt-3 border-t border-slate-100">
                      <a
                        href={cert.credentialLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Verify Credential
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* PROJECT MODAL */}
      <Modal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        title="Add Academic or Industrial Project"
        subtitle="Saved to database; immediately recalculates job readiness"
      >
        <form onSubmit={handleAddProject} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Project Title</label>
            <input
              type="text"
              required
              placeholder="E.g. FEA Analysis of Formula Student Brake Caliper"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Your Role / Responsibility</label>
            <input
              type="text"
              placeholder="E.g. Lead CAD Designer or Structural Analyst"
              value={projectRole}
              onChange={(e) => setProjectRole(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Technologies & Tools (comma separated)</label>
            <input
              type="text"
              placeholder="SolidWorks, ANSYS, GD&T, 3D Printing"
              value={projectTech}
              onChange={(e) => setProjectTech(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              rows={3}
              required
              placeholder="Describe objectives, engineering design decisions, and results achieved..."
              value={projectDesc}
              onChange={(e) => setProjectDesc(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Project Link / Repository (optional)</label>
            <input
              type="url"
              placeholder="https://github.com/..."
              value={projectLink}
              onChange={(e) => setProjectLink(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsProjectModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition cursor-pointer"
            >
              Save Project
            </button>
          </div>
        </form>
      </Modal>

      {/* CERTIFICATION MODAL */}
      <Modal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        title="Add Verified Certification"
        subtitle="Contributes to verified certifications weight in Job Readiness"
      >
        <form onSubmit={handleAddCert} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Certificate Name</label>
            <input
              type="text"
              required
              placeholder="E.g. Certified SOLIDWORKS Associate (CSWA)"
              value={certName}
              onChange={(e) => setCertName(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Issuing Organization / Provider</label>
            <input
              type="text"
              required
              placeholder="E.g. Dassault Systèmes, Autodesk, AWS, NPTEL"
              value={certProvider}
              onChange={(e) => setCertProvider(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Issue Date</label>
            <input
              type="date"
              value={certDate}
              onChange={(e) => setCertDate(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Credential URL (optional)</label>
            <input
              type="url"
              placeholder="https://..."
              value={certLink}
              onChange={(e) => setCertLink(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCertModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition cursor-pointer"
            >
              Save Certification
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
