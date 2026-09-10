export type UserRole = 
  | 'student' 
  | 'university' 
  | 'faculty' 
  | 'industry' 
  | 'placement' 
  | 'government' 
  | 'admin';

export type SkillProficiency = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export type SkillCategory = 
  | 'Programming'
  | 'AI/ML'
  | 'Data'
  | 'Cloud'
  | 'Cybersecurity'
  | 'Electronics'
  | 'Electrical'
  | 'Mechanical'
  | 'Civil'
  | 'Design'
  | 'Management'
  | 'Communication'
  | 'Domain'
  | 'Other';

export type OpportunityType = 'Job' | 'Internship';
export type WorkMode = 'On-site' | 'Remote' | 'Hybrid';

export type ApplicationStatus = 
  | 'Applied' 
  | 'Under Review' 
  | 'Shortlisted' 
  | 'Interview' 
  | 'Selected' 
  | 'Rejected';

export type AssessmentCategory = 'Technical' | 'Aptitude' | 'Communication';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  password?: string;
  avatar?: string;
  phone?: string;
  companyName?: string;
  industrySector?: string;
  university?: string;
  department?: string;
  organization?: string;
  location?: string;
  region?: string;
  createdAt: string;
}

export interface Branch {
  id: string;
  name: string;
  category: 'Engineering' | 'Management' | 'Science' | 'Commerce' | 'Computer Applications' | 'Other';
  code: string;
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  description?: string;
}

export interface StudentSkill {
  id: string;
  studentId: string;
  skillId: string;
  proficiency: SkillProficiency;
  verified?: boolean;
}

export interface Project {
  id: string;
  studentId: string;
  title: string;
  description: string;
  technologies: string[];
  skillsUsed: string[];
  role: string;
  projectLink?: string;
  startDate?: string;
  endDate?: string;
}

export interface Certification {
  id: string;
  studentId: string;
  name: string;
  provider: string;
  issueDate: string;
  credentialLink?: string;
  skills?: string[];
}

export interface StudentProfile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  photoUrl?: string;
  university: string;
  degree: string;
  department: string;
  branchId: string;
  specialization?: string;
  academicYear: string;
  semester: number;
  cgpa: number;
  graduationYear: number;
  careerGoal: string;
  preferredLocation?: string;
  preferredWorkMode?: WorkMode;
  bio?: string;
}

export interface CareerRoleSkillRequirement {
  skillId: string;
  minProficiency: SkillProficiency;
  importance: 'Required' | 'Preferred';
}

export interface CareerRole {
  id: string;
  title: string;
  category: string;
  description: string;
  branchIds: string[];
  requiredSkills: CareerRoleSkillRequirement[];
  averageStartingSalary?: string;
}

export interface Opportunity {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo?: string;
  title: string;
  description: string;
  type: OpportunityType;
  location: string;
  workMode: WorkMode;
  eligibleDegree?: string[];
  eligibleDegrees?: string[];
  eligibleBranchIds: string[];
  requiredSkills: { skillId: string; minProficiency: SkillProficiency; importance?: 'Required' | 'Preferred' }[];
  minCGPA: number;
  deadline: string;
  salaryOrStipend: string;
  status: 'Open' | 'Closed';
  openings: number;
  createdAt: string;
}

export interface Application {
  id: string;
  opportunityId: string;
  studentId: string;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt: string;
  notes?: string;
  matchScoreAtApply?: number;
}

export interface AssessmentQuestion {
  id: string;
  category: AssessmentCategory;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  skillId?: string;
  skillName: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface AssessmentAttempt {
  id: string;
  studentId: string;
  category: AssessmentCategory;
  scorePercentage: number;
  totalQuestions: number;
  correctCount: number;
  completedAt: string;
  topicBreakdown?: Record<string, number>;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'application' | 'recommendation' | 'assessment' | 'placement' | 'system';
  link?: string;
}

export interface FacultyRecommendation {
  id: string;
  facultyId: string;
  facultyName: string;
  studentId: string;
  recommendedSkill?: string;
  recommendedProject?: string;
  recommendedLearningArea?: string;
  courseOrCertName: string;
  type: 'Course' | 'Certification' | 'Skill' | 'Project';
  reason?: string;
  createdAt: string;
}

export interface CourseItem {
  id: string;
  title: string;
  provider: string;
  type: 'Course' | 'Certification' | 'Learning Program';
  branchIds: string[];
  skillsTaught: string[];
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  rating?: number;
  description: string;
  link?: string;
}

export interface StudentCourseProgress {
  id: string;
  studentId: string;
  courseId: string;
  status: 'Interested' | 'In Progress' | 'Completed';
  recommendedByFaculty?: boolean;
  facultyName?: string;
  facultyReason?: string;
  updatedAt: string;
}

export interface Hackathon {
  id: string;
  name: string;
  organizer: string;
  theme: string;
  description: string;
  eligibleBranches: string[];
  requiredSkills: string[];
  registrationDeadline: string;
  eventDate: string;
  mode: 'Online' | 'Offline' | 'Hybrid';
  teamRequirement: string;
  prizePool?: string;
  registrationLink?: string;
}

export interface HackathonRegistration {
  id: string;
  hackathonId: string;
  studentId: string;
  status: 'Not Applied' | 'Applied' | 'Registered' | 'Completed';
  appliedAt: string;
  teamName?: string;
}

export type CampaignActivityType = 
  | 'Technical Assessment'
  | 'Aptitude Training'
  | 'Communication Training'
  | 'Resume Review'
  | 'Mock Interview'
  | 'Coding Practice'
  | 'Domain Training';

export interface CampaignActivity {
  id: string;
  title: string;
  type: CampaignActivityType;
  description: string;
  deadline?: string;
}

export interface PlacementCampaign {
  id: string;
  name: string;
  targetBranchIds: string[];
  targetBatch: string;
  targetRoles: string[];
  startDate: string;
  endDate: string;
  activities: CampaignActivity[];
  assignedStudentIds: string[];
  createdAt: string;
}

export type PlacementRiskLevel = 'Low' | 'Medium' | 'High';

export interface StudentPlacementRisk {
  studentId: string;
  studentName: string;
  branchName: string;
  cgpa: number;
  readinessScore: number;
  riskLevel: PlacementRiskLevel;
  reasons: string[];
  recommendedActions: string[];
}

export interface PlacementDrive {
  id: string;
  placementOfficerId: string;
  company: string;
  role: string;
  eligibleBranchIds: string[];
  minCGPA: number;
  deadline: string;
  driveDate: string;
  packageDetails: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
  createdAt: string;
}

export interface JobReadinessBreakdown {
  overall: number; // 0-100
  academicScore: number; // 0-100
  skillsScore: number; // 0-100
  assessmentScore: number; // 0-100
  projectsScore: number; // 0-100
  certificationsScore: number; // 0-100
  isComplete: boolean;
  incompleteReasons: string[];
}

export interface SkillGapItem {
  skillId: string;
  skillName: string;
  category: SkillCategory;
  requiredProficiency: SkillProficiency;
  studentProficiency: SkillProficiency | 'Missing';
  status: 'Strong' | 'Needs Improvement' | 'Missing';
  gapScore: number; // 0 (none) to 100 (full gap)
}

export interface CareerReadinessResult {
  careerRole: CareerRole;
  careerReadiness: number; // 0-100
  skillGapList: SkillGapItem[];
  strongCount: number;
  needsImprovementCount: number;
  missingCount: number;
}

export interface OpportunityMatchResult {
  opportunity: Opportunity;
  matchPercentage: number;
  isEligible: boolean;
  eligibilityReasons: {
    cgpaMet: boolean;
    branchMet: boolean;
    degreeMet: boolean;
  };
  explanation: string;
  matchingSkills: string[];
  missingSkills: string[];
}

export type RoadmapItemStatus = 'Not Started' | 'In Progress' | 'Completed';
export type RoadmapItemPriority = 'High' | 'Medium' | 'Low';
export type LearningTimeOption = '2–4 hours/week' | '5–7 hours/week' | '8–10 hours/week' | '10+ hours/week';
export type LearningModeOption = 'Online' | 'Offline' | 'Hybrid';
export type TargetPeriodOption = '3 months' | '6 months' | '9 months' | '12 months';

export interface RoadmapResource {
  courseId?: string;
  title: string;
  provider: string;
  type: 'Course' | 'Certification' | 'Learning Program';
  duration: string;
  level: string;
  link?: string;
  isAvailableInDB: boolean;
}

export interface RoadmapItem {
  id: string;
  title: string;
  skillName: string;
  skillId?: string;
  category: string;
  priority: RoadmapItemPriority;
  status: RoadmapItemStatus;
  currentProficiency: string;
  targetProficiency: string;
  estimatedHours: number;
  whyNeeded: string;
  resource?: RoadmapResource;
  practiceTask?: string;
  completedAt?: string;
}

export interface RoadmapProject {
  id: string;
  title: string;
  description: string;
  skillsReinforced: string[];
  status: RoadmapItemStatus;
  complexity: 'Beginner' | 'Intermediate' | 'Advanced';
  stageIndex: number;
  outcomes: string[];
  completedAt?: string;
  addedToStudentProjects?: boolean;
}

export interface RoadmapStageActivity {
  id: string;
  title: string;
  description: string;
  status: RoadmapItemStatus;
}

export interface RoadmapStage {
  id: string;
  stageNumber: number;
  name: string;
  title: string;
  durationWeeks: string;
  goals: string[];
  items: RoadmapItem[];
  practiceProject?: RoadmapProject;
  checkpointAssessment?: {
    category: AssessmentCategory;
    title: string;
    description: string;
    completed: boolean;
  };
  activities?: RoadmapStageActivity[];
}

export interface WeeklyPlanTask {
  id: string;
  type: 'Learn' | 'Practice' | 'Assessment' | 'Project';
  description: string;
  hours: number;
  status: RoadmapItemStatus;
}

export interface WeeklyPlanWeek {
  weekNumber: number;
  title: string;
  focusSkillOrTheme: string;
  tasks: WeeklyPlanTask[];
}

export interface RoadmapMilestone {
  id: string;
  title: string;
  description: string;
  status: 'Completed' | 'Current' | 'Pending';
  completedAt?: string;
  criteria: string;
}

export interface CareerRoadmap {
  id: string;
  studentId: string;
  targetCareer: string;
  careerRoleId?: string;
  branchName: string;
  branchId: string;
  degree: string;
  currentYear: string;
  currentCGPA: number;
  initialReadinessScore: number;
  initialSkillGaps: string[];
  initialStrengths: string[];
  
  // Customization preferences
  weeklyLearningTime: LearningTimeOption;
  learningMode: LearningModeOption;
  targetPeriod: TargetPeriodOption;
  currentSkillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  
  // High-level explanation: "Why this roadmap?"
  whyThisRoadmap: string;
  
  // Synthesis
  whatIKnow: string[];
  whatIAmMissing: string[];
  whatToLearnFirst: string;
  whatToLearnNext: string;
  capstoneProjectSummary: string;
  whenToApplyAdvice: string;
  placementReadinessStrategy: string;
  
  // Stages
  stages: RoadmapStage[];
  
  // Recommended projects
  projects: RoadmapProject[];
  
  // Weekly Breakdown
  weeklyPlan: WeeklyPlanWeek[];
  
  // Milestones timeline
  milestones: RoadmapMilestone[];
  
  // Progress tracking
  totalActivitiesCount: number;
  completedActivitiesCount: number;
  overallProgressPercentage: number;
  
  createdAt: string;
  updatedAt: string;
}
