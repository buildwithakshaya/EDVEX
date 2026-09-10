import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../db/storage';
import { Notification } from '../../types';
import { 
  Bell, 
  UserCheck, 
  LogOut, 
  RefreshCw, 
  Compass, 
  RotateCcw,
  CheckCheck
} from 'lucide-react';
import { Badge } from '../common/Badge';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onOpenAuthModal?: () => void;
  onNavigate?: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab: _currentTab, onTabChange: _onTabChange, onOpenAuthModal, onNavigate }) => {
  const { currentUser, logout, switchUser, allUsers } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifPopover, setShowNotifPopover] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    const loadNotifs = () => {
      setNotifications(db.getNotifications(currentUser.id));
    };
    loadNotifs();
    const unsub = db.subscribe(loadNotifs);
    return () => unsub();
  }, [currentUser]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    if (currentUser) {
      db.markAllNotificationsRead(currentUser.id);
    }
  };

  const handleResetData = () => {
    if (window.confirm('Reset database to default SIH seed records? All changes will be reinitialized.')) {
      db.resetToSeeds();
      window.location.reload();
    }
  };

  const handleLogout = () => {
    logout();
    if (onNavigate) {
      onNavigate('/');
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-white border-b border-slate-200">
      {/* Brand */}
      <div 
        onClick={() => onNavigate && onNavigate('/')}
        className="flex items-center gap-3 cursor-pointer hover:opacity-95 transition"
      >
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-600 text-white font-black shadow-xs">
          <Compass className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold tracking-tight text-slate-900">SkillBridge</span>
            <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-indigo-50 text-indigo-700 rounded border border-indigo-100">
              SIH Edition
            </span>
          </div>
          <p className="hidden md:block text-[11px] text-slate-500">
            Dynamic Academia-Industry Skill & Placement Engine
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Role Switcher for seamless evaluation */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowRoleSwitcher(!showRoleSwitcher);
              setShowNotifPopover(false);
            }}
            className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition border border-slate-200 cursor-pointer"
            title="Switch evaluation role"
          >
            <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Role:</span>
            <span className="capitalize text-indigo-700 font-bold">{currentUser?.role || 'Guest'}</span>
          </button>

          {showRoleSwitcher && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-slate-200 p-2 z-50 animate-in fade-in">
              <div className="px-2 py-1.5 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-900">SIH Role Switcher</p>
                <p className="text-[11px] text-slate-500">Test dashboards across all 7 user roles</p>
              </div>
              <div className="py-1 max-h-64 overflow-y-auto space-y-0.5">
                {allUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      switchUser(u.id);
                      setShowRoleSwitcher(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 text-left text-xs rounded-lg transition ${
                      currentUser?.id === u.id
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <p className="font-medium">{u.name}</p>
                      <p className="text-[10px] text-slate-400 capitalize">{u.role} &bull; {u.email}</p>
                    </div>
                    <Badge size="sm" variant={currentUser?.id === u.id ? 'indigo' : 'slate'}>
                      {u.role}
                    </Badge>
                  </button>
                ))}
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleResetData}
                  className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800 transition px-2 py-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset Demo DB
                </button>
                {onOpenAuthModal && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowRoleSwitcher(false);
                      onOpenAuthModal();
                    }}
                    className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 px-2 py-1"
                  >
                    + New Register
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowNotifPopover(!showNotifPopover);
              setShowRoleSwitcher(false);
            }}
            className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-rose-600 rounded-full animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifPopover && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 p-2 z-50">
              <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-slate-100">
                <span className="text-xs font-semibold text-slate-900">Notifications ({unreadCount})</span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium"
                  >
                    <CheckCheck className="w-3 h-3" /> Mark all read
                  </button>
                )}
              </div>
              <div className="py-1 max-h-72 overflow-y-auto space-y-1">
                {notifications.length === 0 ? (
                  <p className="p-4 text-center text-xs text-slate-400">No notifications yet</p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => db.markNotificationRead(notif.id)}
                      className={`p-2.5 rounded-lg text-xs transition cursor-pointer ${
                        notif.read ? 'bg-white hover:bg-slate-50 text-slate-600' : 'bg-indigo-50/70 border border-indigo-100 text-slate-900 font-medium'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800">{notif.title}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(notif.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-600 leading-snug">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Current User Info / Logout */}
        {currentUser ? (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('/')}
                className="hidden lg:inline-flex items-center px-2 py-1 text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                title="View Landing Page"
              >
                Landing
              </button>
            )}
            <div className="hidden md:block text-right">
              <p className="text-xs font-semibold text-slate-900 truncate max-w-[120px]">{currentUser.name}</p>
              <p className="text-[10px] text-slate-400 capitalize">{currentUser.role}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out to Landing Page"
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 rounded-lg transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => onNavigate ? onNavigate('/login') : onOpenAuthModal && onOpenAuthModal()}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition cursor-pointer"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};
