import {
  User,
  Branch,
  Skill,
  CareerRole,
  AssessmentQuestion,
  Opportunity,
  StudentProfile,
  StudentSkill,
  Project,
  Certification,
  AssessmentAttempt,
  Application,
  Notification,
  PlacementDrive,
  FacultyRecommendation,
  CourseItem,
  StudentCourseProgress,
  Hackathon,
  HackathonRegistration,
  PlacementCampaign,
  CareerRoadmap,
  RoadmapItemStatus
} from '../types';

import {
  INITIAL_BRANCHES,
  INITIAL_SKILLS,
  INITIAL_CAREER_ROLES,
  INITIAL_ASSESSMENT_QUESTIONS,
  INITIAL_OPPORTUNITIES,
  INITIAL_USERS,
  INITIAL_STUDENT_PROFILES,
  INITIAL_STUDENT_SKILLS,
  INITIAL_PROJECTS,
  INITIAL_CERTIFICATIONS,
  INITIAL_ASSESSMENT_ATTEMPTS,
  INITIAL_APPLICATIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_PLACEMENT_DRIVES,
  INITIAL_COURSES,
  INITIAL_STUDENT_COURSE_PROGRESS,
  INITIAL_HACKATHONS,
  INITIAL_HACKATHON_REGISTRATIONS,
  INITIAL_PLACEMENT_CAMPAIGNS,
  INITIAL_FACULTY_RECOMMENDATIONS
} from './seeds';

interface DatabaseSchema {
  users: User[];
  branches: Branch[];
  skills: Skill[];
  careerRoles: CareerRole[];
  assessmentQuestions: AssessmentQuestion[];
  opportunities: Opportunity[];
  studentProfiles: StudentProfile[];
  studentSkills: StudentSkill[];
  projects: Project[];
  certifications: Certification[];
  assessmentAttempts: AssessmentAttempt[];
  applications: Application[];
  notifications: Notification[];
  placementDrives: PlacementDrive[];
  facultyRecommendations: FacultyRecommendation[];
  courses: CourseItem[];
  studentCourseProgress: StudentCourseProgress[];
  hackathons: Hackathon[];
  hackathonRegistrations: HackathonRegistration[];
  placementCampaigns: PlacementCampaign[];
  careerRoadmaps: CareerRoadmap[];
}

const STORAGE_KEY = 'skillbridge_db_v2.0';

class PersistentDatabase {
  private data: DatabaseSchema;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.data = this.loadFromStorage();
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY) {
          this.data = this.loadFromStorage();
          this.notify();
        }
      });
    }
  }

  private loadFromStorage(): DatabaseSchema {
    if (typeof window === 'undefined') {
      return this.getDefaultData();
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Ensure new schema arrays exist if loaded from partial cache
        const defaults = this.getDefaultData();
        return {
          ...defaults,
          ...parsed,
          courses: parsed.courses || defaults.courses,
          studentCourseProgress: parsed.studentCourseProgress || defaults.studentCourseProgress,
          hackathons: parsed.hackathons || defaults.hackathons,
          hackathonRegistrations: parsed.hackathonRegistrations || defaults.hackathonRegistrations,
          placementCampaigns: parsed.placementCampaigns || defaults.placementCampaigns,
          facultyRecommendations: parsed.facultyRecommendations || defaults.facultyRecommendations,
          careerRoadmaps: parsed.careerRoadmaps || defaults.careerRoadmaps || []
        };
      }
    } catch (e) {
      console.error('Error reading SkillBridge database from localStorage', e);
    }
    const defaults = this.getDefaultData();
    this.persist(defaults);
    return defaults;
  }

  private getDefaultData(): DatabaseSchema {
    return {
      users: [...INITIAL_USERS],
      branches: [...INITIAL_BRANCHES],
      skills: [...INITIAL_SKILLS],
      careerRoles: [...INITIAL_CAREER_ROLES],
      assessmentQuestions: [...INITIAL_ASSESSMENT_QUESTIONS],
      opportunities: [...INITIAL_OPPORTUNITIES],
      studentProfiles: [...INITIAL_STUDENT_PROFILES],
      studentSkills: [...INITIAL_STUDENT_SKILLS],
      projects: [...INITIAL_PROJECTS],
      certifications: [...INITIAL_CERTIFICATIONS],
      assessmentAttempts: [...INITIAL_ASSESSMENT_ATTEMPTS],
      applications: [...INITIAL_APPLICATIONS],
      notifications: [...INITIAL_NOTIFICATIONS],
      placementDrives: [...INITIAL_PLACEMENT_DRIVES],
      facultyRecommendations: [...INITIAL_FACULTY_RECOMMENDATIONS],
      courses: [...INITIAL_COURSES],
      studentCourseProgress: [...INITIAL_STUDENT_COURSE_PROGRESS],
      hackathons: [...INITIAL_HACKATHONS],
      hackathonRegistrations: [...INITIAL_HACKATHON_REGISTRATIONS],
      placementCampaigns: [...INITIAL_PLACEMENT_CAMPAIGNS],
      careerRoadmaps: []
    };
  }

  private persist(dataToSave: DatabaseSchema = this.data): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      } catch (e) {
        console.error('Failed to persist to localStorage', e);
      }
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('Error in database listener', err);
      }
    });
  }

  public resetToSeeds(): void {
    this.data = this.getDefaultData();
    this.persist();
  }

  public clearAllData(): void {
    this.data = {
      users: [...INITIAL_USERS.filter(u => u.role === 'admin')],
      branches: [...INITIAL_BRANCHES],
      skills: [...INITIAL_SKILLS],
      careerRoles: [...INITIAL_CAREER_ROLES],
      assessmentQuestions: [...INITIAL_ASSESSMENT_QUESTIONS],
      opportunities: [],
      studentProfiles: [],
      studentSkills: [],
      projects: [],
      certifications: [],
      assessmentAttempts: [],
      applications: [],
      notifications: [],
      placementDrives: [],
      facultyRecommendations: [],
      courses: [...INITIAL_COURSES],
      studentCourseProgress: [],
      hackathons: [...INITIAL_HACKATHONS],
      hackathonRegistrations: [],
      placementCampaigns: [],
      careerRoadmaps: []
    };
    this.persist();
  }

  // --- Users & Profiles ---
  public getUsers(): User[] {
    return [...this.data.users];
  }

  public getUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  public getUserByEmail(email: string): User | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public createUser(user: User): User {
    this.data.users.push(user);
    this.persist();
    return user;
  }

  public updateUser(id: string, updates: Partial<User>): User | undefined {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      this.data.users[idx] = { ...this.data.users[idx], ...updates };
      this.persist();
      return this.data.users[idx];
    }
    return undefined;
  }

  public deleteUser(id: string): void {
    this.data.users = this.data.users.filter(u => u.id !== id);
    this.data.studentProfiles = this.data.studentProfiles.filter(p => p.userId !== id);
    this.persist();
  }

  // --- Student Profiles ---
  public getAllStudentProfiles(): StudentProfile[] {
    return [...this.data.studentProfiles];
  }

  public getStudentProfiles(): StudentProfile[] {
    return [...this.data.studentProfiles];
  }

  public getStudentProfileByUserId(userId: string): StudentProfile | undefined {
    return this.data.studentProfiles.find(p => p.userId === userId);
  }

  public getStudentProfileById(profileId: string): StudentProfile | undefined {
    return this.data.studentProfiles.find(p => p.id === profileId);
  }

  public saveStudentProfile(profile: StudentProfile): StudentProfile {
    const idx = this.data.studentProfiles.findIndex(p => p.id === profile.id || p.userId === profile.userId);
    if (idx !== -1) {
      this.data.studentProfiles[idx] = { ...this.data.studentProfiles[idx], ...profile };
    } else {
      this.data.studentProfiles.push(profile);
    }
    this.persist();
    return profile;
  }

  // --- Branches ---
  public getBranches(): Branch[] {
    return [...this.data.branches];
  }

  public getBranchById(id: string): Branch | undefined {
    return this.data.branches.find(b => b.id === id);
  }

  public addBranch(branch: Branch): Branch {
    this.data.branches.push(branch);
    this.persist();
    return branch;
  }

  public deleteBranch(id: string): void {
    this.data.branches = this.data.branches.filter(b => b.id !== id);
    this.persist();
  }

  // --- Skills ---
  public getSkills(): Skill[] {
    return [...this.data.skills];
  }

  public getSkillById(id: string): Skill | undefined {
    return this.data.skills.find(s => s.id === id);
  }

  public addSkill(skill: Skill): Skill {
    this.data.skills.push(skill);
    this.persist();
    return skill;
  }

  public deleteSkill(id: string): void {
    this.data.skills = this.data.skills.filter(s => s.id !== id);
    this.data.studentSkills = this.data.studentSkills.filter(ss => ss.skillId !== id);
    this.persist();
  }

  // --- Student Skills ---
  public getAllStudentSkills(): StudentSkill[] {
    return [...this.data.studentSkills];
  }

  public getStudentSkills(studentId: string): StudentSkill[] {
    return this.data.studentSkills.filter(ss => ss.studentId === studentId);
  }

  public addStudentSkill(studentSkill: StudentSkill): StudentSkill {
    // Check if skill already exists for this student
    const existingIdx = this.data.studentSkills.findIndex(
      ss => ss.studentId === studentSkill.studentId && ss.skillId === studentSkill.skillId
    );
    if (existingIdx !== -1) {
      this.data.studentSkills[existingIdx] = studentSkill;
    } else {
      this.data.studentSkills.push(studentSkill);
    }
    this.persist();
    return studentSkill;
  }

  public updateStudentSkillProficiency(id: string, proficiency: StudentSkill['proficiency']): void {
    const item = this.data.studentSkills.find(ss => ss.id === id);
    if (item) {
      item.proficiency = proficiency;
      this.persist();
    }
  }

  public deleteStudentSkill(id: string): void {
    this.data.studentSkills = this.data.studentSkills.filter(ss => ss.id !== id);
    this.persist();
  }

  // --- Projects ---
  public getProjects(studentId: string): Project[] {
    return this.data.projects.filter(p => p.studentId === studentId);
  }

  public addProject(project: Project): Project {
    this.data.projects.push(project);
    this.persist();
    return project;
  }

  public createProject(project: Project): Project {
    return this.addProject(project);
  }

  public updateProject(id: string, updates: Partial<Project>): void {
    const idx = this.data.projects.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.data.projects[idx] = { ...this.data.projects[idx], ...updates };
      this.persist();
    }
  }

  public deleteProject(id: string): void {
    this.data.projects = this.data.projects.filter(p => p.id !== id);
    this.persist();
  }

  // --- Certifications ---
  public getCertifications(studentId: string): Certification[] {
    return this.data.certifications.filter(c => c.studentId === studentId);
  }

  public addCertification(certification: Certification): Certification {
    this.data.certifications.push(certification);
    this.persist();
    return certification;
  }

  public deleteCertification(id: string): void {
    this.data.certifications = this.data.certifications.filter(c => c.id !== id);
    this.persist();
  }

  // --- Career Roles ---
  public getCareerRoles(): CareerRole[] {
    return [...this.data.careerRoles];
  }

  public getCareerRoleById(id: string): CareerRole | undefined {
    return this.data.careerRoles.find(cr => cr.id === id);
  }

  public addCareerRole(role: CareerRole): CareerRole {
    this.data.careerRoles.push(role);
    this.persist();
    return role;
  }

  public updateCareerRole(id: string, updates: Partial<CareerRole>): void {
    const idx = this.data.careerRoles.findIndex(cr => cr.id === id);
    if (idx !== -1) {
      this.data.careerRoles[idx] = { ...this.data.careerRoles[idx], ...updates };
      this.persist();
    }
  }

  // --- Opportunities (Jobs / Internships) ---
  public getOpportunities(): Opportunity[] {
    return [...this.data.opportunities];
  }

  public getOpportunityById(id: string): Opportunity | undefined {
    return this.data.opportunities.find(o => o.id === id);
  }

  public addOpportunity(opportunity: Opportunity): Opportunity {
    this.data.opportunities.unshift(opportunity);
    this.persist();
    return opportunity;
  }

  public updateOpportunity(id: string, updates: Partial<Opportunity>): void {
    const idx = this.data.opportunities.findIndex(o => o.id === id);
    if (idx !== -1) {
      this.data.opportunities[idx] = { ...this.data.opportunities[idx], ...updates };
      this.persist();
    }
  }

  public deleteOpportunity(id: string): void {
    this.data.opportunities = this.data.opportunities.filter(o => o.id !== id);
    this.persist();
  }

  // --- Applications ---
  public getApplications(): Application[] {
    return [...this.data.applications];
  }

  public getApplicationsByStudent(studentId: string): Application[] {
    return this.data.applications.filter(a => a.studentId === studentId);
  }

  public getApplicationsByOpportunity(opportunityId: string): Application[] {
    return this.data.applications.filter(a => a.opportunityId === opportunityId);
  }

  public createApplication(application: Application): Application {
    this.data.applications.unshift(application);
    this.persist();
    return application;
  }

  public updateApplicationStatus(id: string, status: Application['status'], notes?: string): Application | undefined {
    const app = this.data.applications.find(a => a.id === id);
    if (app) {
      app.status = status;
      app.updatedAt = new Date().toISOString();
      if (notes !== undefined) app.notes = notes;

      // Automatically create a notification for the student
      const studentProfile = this.getStudentProfileById(app.studentId);
      const opportunity = this.getOpportunityById(app.opportunityId);
      if (studentProfile && opportunity) {
        this.addNotification({
          id: `notif_${Date.now()}`,
          userId: studentProfile.userId,
          title: `Application Status: ${status}`,
          message: `${opportunity.companyName} updated your application for "${opportunity.title}" to ${status}.`,
          date: new Date().toISOString(),
          read: false,
          type: 'application'
        });
      }

      this.persist();
      return app;
    }
    return undefined;
  }

  // --- Assessments & Questions ---
  public getAssessmentQuestions(category?: AssessmentQuestion['category']): AssessmentQuestion[] {
    if (category) {
      return this.data.assessmentQuestions.filter(q => q.category === category);
    }
    return [...this.data.assessmentQuestions];
  }

  public addAssessmentQuestion(question: AssessmentQuestion): AssessmentQuestion {
    this.data.assessmentQuestions.push(question);
    this.persist();
    return question;
  }

  public deleteAssessmentQuestion(id: string): void {
    this.data.assessmentQuestions = this.data.assessmentQuestions.filter(q => q.id !== id);
    this.persist();
  }

  public getAssessmentAttempts(studentId: string): AssessmentAttempt[] {
    return this.data.assessmentAttempts.filter(a => a.studentId === studentId);
  }

  public recordAssessmentAttempt(attempt: AssessmentAttempt): AssessmentAttempt {
    this.data.assessmentAttempts.unshift(attempt);
    this.persist();
    return attempt;
  }

  // --- Notifications ---
  public getNotifications(userId: string): Notification[] {
    return this.data.notifications
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public addNotification(notification: Notification): Notification {
    this.data.notifications.unshift(notification);
    this.persist();
    return notification;
  }

  public markNotificationRead(id: string): void {
    const notif = this.data.notifications.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      this.persist();
    }
  }

  public markAllNotificationsRead(userId: string): void {
    this.data.notifications.forEach(n => {
      if (n.userId === userId) n.read = true;
    });
    this.persist();
  }

  // --- Placement Drives ---
  public getPlacementDrives(): PlacementDrive[] {
    return [...this.data.placementDrives];
  }

  public addPlacementDrive(drive: PlacementDrive): PlacementDrive {
    this.data.placementDrives.unshift(drive);
    this.persist();
    return drive;
  }

  // --- Faculty Recommendations ---
  public getAllFacultyRecommendations(): FacultyRecommendation[] {
    return [...this.data.facultyRecommendations];
  }

  public getFacultyRecommendations(studentId: string): FacultyRecommendation[] {
    return this.data.facultyRecommendations.filter(r => r.studentId === studentId);
  }

  public addFacultyRecommendation(rec: FacultyRecommendation): FacultyRecommendation {
    this.data.facultyRecommendations.unshift(rec);
    this.persist();
    return rec;
  }

  // --- Courses & Certifications ---
  public getCourses(): CourseItem[] {
    return [...this.data.courses];
  }

  public getStudentCourseProgress(studentId: string): StudentCourseProgress[] {
    return this.data.studentCourseProgress.filter(p => p.studentId === studentId);
  }

  public setCourseStatus(
    studentId: string,
    courseId: string,
    status: StudentCourseProgress['status'],
    extras?: Partial<StudentCourseProgress>
  ): StudentCourseProgress {
    const existingIndex = this.data.studentCourseProgress.findIndex(
      p => p.studentId === studentId && p.courseId === courseId
    );

    if (existingIndex >= 0) {
      this.data.studentCourseProgress[existingIndex] = {
        ...this.data.studentCourseProgress[existingIndex],
        status,
        updatedAt: new Date().toISOString(),
        ...extras
      };
      this.persist();
      return this.data.studentCourseProgress[existingIndex];
    } else {
      const newProgress: StudentCourseProgress = {
        id: `enr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        studentId,
        courseId,
        status,
        updatedAt: new Date().toISOString(),
        ...extras
      };
      this.data.studentCourseProgress.unshift(newProgress);
      this.persist();
      return newProgress;
    }
  }

  // --- Hackathons ---
  public getHackathons(): Hackathon[] {
    return [...this.data.hackathons];
  }

  public getHackathonRegistrations(studentId?: string): HackathonRegistration[] {
    if (studentId) {
      return this.data.hackathonRegistrations.filter(r => r.studentId === studentId);
    }
    return [...this.data.hackathonRegistrations];
  }

  public registerHackathon(
    studentId: string,
    hackathonId: string,
    teamName?: string
  ): HackathonRegistration {
    const existing = this.data.hackathonRegistrations.find(
      r => r.studentId === studentId && r.hackathonId === hackathonId
    );
    if (existing) {
      return existing;
    }

    const newReg: HackathonRegistration = {
      id: `reg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      hackathonId,
      studentId,
      status: 'Applied',
      appliedAt: new Date().toISOString(),
      teamName: teamName || 'Independent Participant'
    };
    this.data.hackathonRegistrations.unshift(newReg);
    this.persist();
    return newReg;
  }

  // --- Placement Campaigns ---
  public getPlacementCampaigns(): PlacementCampaign[] {
    return [...this.data.placementCampaigns];
  }

  public createPlacementCampaign(campaign: PlacementCampaign): PlacementCampaign {
    this.data.placementCampaigns.unshift(campaign);
    this.persist();
    return campaign;
  }

  // --- Global Helper Accessors for Analytics & Filtering ---
  public getAllStudents(): StudentProfile[] {
    return [...this.data.studentProfiles];
  }

  public getAllProjects(): Project[] {
    return [...this.data.projects];
  }

  public getAllCertifications(): Certification[] {
    return [...this.data.certifications];
  }

  public getAllAssessmentAttempts(): AssessmentAttempt[] {
    return [...this.data.assessmentAttempts];
  }

  // --- Career Roadmaps ---
  public getCareerRoadmap(studentId: string): CareerRoadmap | undefined {
    return this.data.careerRoadmaps.find(r => r.studentId === studentId);
  }

  public saveCareerRoadmap(roadmap: CareerRoadmap): CareerRoadmap {
    const existingIndex = this.data.careerRoadmaps.findIndex(r => r.studentId === roadmap.studentId);
    if (existingIndex >= 0) {
      this.data.careerRoadmaps[existingIndex] = roadmap;
    } else {
      this.data.careerRoadmaps.unshift(roadmap);
    }
    this.persist();
    return roadmap;
  }

  public updateRoadmapItemStatus(roadmapId: string, itemId: string, status: RoadmapItemStatus): void {
    const roadmap = this.data.careerRoadmaps.find(r => r.id === roadmapId);
    if (!roadmap) return;

    for (const stage of roadmap.stages) {
      const item = stage.items.find(i => i.id === itemId);
      if (item) {
        item.status = status;
        if (status === 'Completed') {
          item.completedAt = new Date().toISOString();
        } else {
          item.completedAt = undefined;
        }
        break;
      }
    }

    this.recalculateRoadmapProgress(roadmap);
    this.persist();
  }

  public updateRoadmapProjectStatus(roadmapId: string, projectId: string, status: RoadmapItemStatus): void {
    const roadmap = this.data.careerRoadmaps.find(r => r.id === roadmapId);
    if (!roadmap) return;

    const proj = roadmap.projects.find(p => p.id === projectId);
    if (proj) {
      proj.status = status;
      if (status === 'Completed') {
        proj.completedAt = new Date().toISOString();
      } else {
        proj.completedAt = undefined;
      }
    }

    // Also check inside stages
    for (const stage of roadmap.stages) {
      if (stage.practiceProject && stage.practiceProject.id === projectId) {
        stage.practiceProject.status = status;
        if (status === 'Completed') {
          stage.practiceProject.completedAt = new Date().toISOString();
        } else {
          stage.practiceProject.completedAt = undefined;
        }
      }
    }

    this.recalculateRoadmapProgress(roadmap);
    this.persist();
  }

  public updateRoadmapActivityStatus(roadmapId: string, activityId: string, status: RoadmapItemStatus): void {
    const roadmap = this.data.careerRoadmaps.find(r => r.id === roadmapId);
    if (!roadmap) return;

    for (const stage of roadmap.stages) {
      if (stage.activities) {
        const act = stage.activities.find(a => a.id === activityId);
        if (act) {
          act.status = status;
          break;
        }
      }
    }

    this.recalculateRoadmapProgress(roadmap);
    this.persist();
  }

  public deleteCareerRoadmap(roadmapId: string): void {
    this.data.careerRoadmaps = this.data.careerRoadmaps.filter(r => r.id !== roadmapId);
    this.persist();
  }

  private recalculateRoadmapProgress(roadmap: CareerRoadmap): void {
    let total = 0;
    let completed = 0;

    for (const stage of roadmap.stages) {
      for (const item of stage.items) {
        total++;
        if (item.status === 'Completed') completed++;
      }
      if (stage.practiceProject) {
        total++;
        if (stage.practiceProject.status === 'Completed') completed++;
      }
      if (stage.activities) {
        for (const act of stage.activities) {
          total++;
          if (act.status === 'Completed') completed++;
        }
      }
    }

    roadmap.totalActivitiesCount = total;
    roadmap.completedActivitiesCount = completed;
    roadmap.overallProgressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    roadmap.updatedAt = new Date().toISOString();

    // Update milestones dynamically
    if (roadmap.milestones && roadmap.milestones.length > 0) {
      const stage1 = roadmap.stages[0];
      const stage1Done = stage1 && stage1.items.every(i => i.status === 'Completed');
      const foundationMilestone = roadmap.milestones.find(m => m.title.includes('Foundation'));
      if (foundationMilestone) {
        foundationMilestone.status = stage1Done ? 'Completed' : (stage1 && stage1.items.some(i => i.status === 'In Progress' || i.status === 'Completed') ? 'Current' : 'Pending');
      }

      const stage2 = roadmap.stages[1];
      const stage2Done = stage2 && stage2.items.every(i => i.status === 'Completed');
      const coreMilestone = roadmap.milestones.find(m => m.title.includes('Core'));
      if (coreMilestone) {
        coreMilestone.status = stage2Done ? 'Completed' : (stage1Done ? 'Current' : 'Pending');
      }

      const anyProjectDone = roadmap.projects.some(p => p.status === 'Completed') || this.getProjects(roadmap.studentId).length > 0;
      const projectMilestone = roadmap.milestones.find(m => m.title.includes('Project'));
      if (projectMilestone) {
        projectMilestone.status = anyProjectDone ? 'Completed' : (stage2Done ? 'Current' : 'Pending');
      }

      const placementMilestone = roadmap.milestones.find(m => m.title.includes('Placement Ready'));
      if (placementMilestone) {
        placementMilestone.status = roadmap.overallProgressPercentage >= 70 ? 'Completed' : (anyProjectDone ? 'Current' : 'Pending');
      }
    }
  }
}

export const db = new PersistentDatabase();
