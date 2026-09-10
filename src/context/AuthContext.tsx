import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole, StudentProfile } from '../types';
import { db } from '../db/storage';

interface AuthContextType {
  currentUser: User | null;
  studentProfile: StudentProfile | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    phone?: string;
    branchId?: string;
    degree?: string;
    university?: string;
    companyName?: string;
    industrySector?: string;
    department?: string;
    organization?: string;
    location?: string;
    region?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchUser: (userId: string) => void;
  refreshUserData: () => void;
  allUsers: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_USER_KEY = 'skillbridge_active_user_id';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  const loadActiveUser = useCallback(() => {
    const users = db.getUsers();
    setAllUsers(users);

    const savedUserId = typeof window !== 'undefined' ? localStorage.getItem(AUTH_USER_KEY) : null;
    let targetUser: User | undefined;

    if (savedUserId) {
      targetUser = users.find(u => u.id === savedUserId);
    }

    if (targetUser) {
      setCurrentUser(targetUser);
      if (targetUser.role === 'student') {
        const profile = db.getStudentProfileByUserId(targetUser.id);
        setStudentProfile(profile || null);
      } else {
        setStudentProfile(null);
      }
    } else {
      setCurrentUser(null);
      setStudentProfile(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadActiveUser();
    const unsubscribe = db.subscribe(() => {
      loadActiveUser();
    });
    return () => unsubscribe();
  }, [loadActiveUser]);

  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    if (!email || !email.trim()) {
      return { success: false, error: 'Please enter your email.' };
    }
    if (!password || !password.trim()) {
      return { success: false, error: 'Please enter your password.' };
    }

    const trimmedEmail = email.trim().toLowerCase();
    const user = db.getUsers().find(u => u.email.toLowerCase() === trimmedEmail);
    if (!user) {
      return { success: false, error: 'Invalid email or password.' };
    }

    // Verify password if user has a password set
    if (user.password && user.password !== password) {
      return { success: false, error: 'Invalid email or password.' };
    }

    setCurrentUser(user);
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_USER_KEY, user.id);
    }
    if (user.role === 'student') {
      const profile = db.getStudentProfileByUserId(user.id);
      setStudentProfile(profile || null);
    } else {
      setStudentProfile(null);
    }
    return { success: true };
  };

  const register = async (data: {
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    phone?: string;
    branchId?: string;
    degree?: string;
    university?: string;
    companyName?: string;
    industrySector?: string;
    department?: string;
    organization?: string;
    location?: string;
    region?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    if (!data.name || !data.name.trim()) {
      return { success: false, error: 'Please enter your name.' };
    }
    if (!data.email || !data.email.trim()) {
      return { success: false, error: 'Please enter your email.' };
    }
    if (!data.password || !data.password.trim()) {
      return { success: false, error: 'Please enter your password.' };
    }

    const trimmedEmail = data.email.trim().toLowerCase();
    const existing = db.getUsers().find(u => u.email.toLowerCase() === trimmedEmail);
    if (existing) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newUser: User = {
      id: `u_${Date.now()}`,
      email: trimmedEmail,
      name: data.name.trim(),
      role: data.role,
      password: data.password,
      phone: data.phone || '',
      companyName: data.companyName,
      industrySector: data.industrySector,
      university: data.university,
      department: data.department,
      organization: data.organization,
      location: data.location,
      region: data.region,
      createdAt: new Date().toISOString()
    };

    db.createUser(newUser);

    if (data.role === 'student') {
      const newProfile: StudentProfile = {
        id: `sp_${Date.now()}`,
        userId: newUser.id,
        fullName: data.name.trim(),
        email: trimmedEmail,
        phone: data.phone || '',
        university: data.university || 'State Technical University',
        degree: data.degree || 'B.Tech',
        department: 'Engineering',
        branchId: data.branchId || 'b_mech',
        academicYear: 'Third Year (3rd)',
        semester: 5,
        cgpa: 7.5,
        graduationYear: new Date().getFullYear() + 2,
        careerGoal: 'Mechanical Design Engineer'
      };
      db.saveStudentProfile(newProfile);
      setStudentProfile(newProfile);
    }

    setCurrentUser(newUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_USER_KEY, newUser.id);
    }
    return { success: true };
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_USER_KEY);
    }
    setCurrentUser(null);
    setStudentProfile(null);
  };

  const switchUser = (userId: string) => {
    const user = db.getUserById(userId);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem(AUTH_USER_KEY, user.id);
      if (user.role === 'student') {
        const profile = db.getStudentProfileByUserId(user.id);
        setStudentProfile(profile || null);
      } else {
        setStudentProfile(null);
      }
    }
  };

  const refreshUserData = () => {
    loadActiveUser();
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        studentProfile,
        isLoading,
        login,
        register,
        logout,
        switchUser,
        refreshUserData,
        allUsers
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
