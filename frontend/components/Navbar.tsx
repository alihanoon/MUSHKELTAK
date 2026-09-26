import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { Bell, LogOut, User as UserIcon, Search, Plus, List, Menu, X } from "lucide-react";
import { User, Notification } from "../types";
import NotificationDropdown from "./NotificationDropdown";

interface NavbarProps {
  user: User | null;
  notifications: Notification[];
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  logout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  user,
  notifications,
  showNotifications,
  setShowNotifications,
  logout,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [showPermissionsDropdown, setShowPermissionsDropdown] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const getDashboardRoute = () => {
    return user?.role === 1 || user?.role === 2 ? "/admin-dashboard" : "/user-dashboard";
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-full mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Right - Logo */}
        <div className="flex items-center gap-2">
          <button 
            className="md:hidden p-2 text-gray-500 hover:bg-gray-50 rounded-lg"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div 
            onClick={() => navigate(getDashboardRoute())}
            className="flex items-center gap-2 cursor-pointer"
          >
            <img 
      src="/favicon-32x32.png" 
      alt="لوغو مشكلتك" 
      className="w-8 h-8 object-contain" 
    />
            {/* <img src="../public/favicon1.ico" alt="Logo" className="w-8 h-8 text-emerald-700" /> */}
            <h1 className="text-2xl font-black text-emerald-700">
              مشكلتك
            </h1>
          </div>
        </div>
          
        {/* Center - Navigation */}
        <div className="hidden md:flex items-center justify-center gap-4 flex-1">
          <button
            onClick={() => navigate(getDashboardRoute())}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              location.pathname === getDashboardRoute() ? "bg-emerald-50 text-emerald-700" : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            الرئيسية
          </button>
          {user?.role === 3 && (
            <button
              onClick={() => navigate("/my-requests")}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                location.pathname === "/my-requests" ? "bg-emerald-50 text-emerald-700" : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              طلباتي
            </button>
          )}
          <button
            onClick={() => navigate("/search")}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              location.pathname === "/search" ? "bg-emerald-50 text-emerald-700" : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            بحث عن معاملة
          </button>
          {user?.role === 1 && (
            <>
              <button
                onClick={() => navigate("/users")}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  location.pathname === "/users" ? "bg-emerald-50 text-emerald-700" : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                إدارة المستخدمين
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowPermissionsDropdown(!showPermissionsDropdown)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    location.pathname.startsWith("/permissions") ? "bg-emerald-50 text-emerald-700" : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  الصلاحيات
                </button>
                {showPermissionsDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden py-2 z-50">
                    <button
                      onClick={() => { navigate("/permissions/services"); setShowPermissionsDropdown(false); }}
                      className="w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      صلاحيات الخدمات
                    </button>
                    <button
                      onClick={() => { navigate("/permissions/municipalities"); setShowPermissionsDropdown(false); }}
                      className="w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      صلاحيات البلديات
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Left - Notifications & User */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-3 bg-gray-50 rounded-xl text-gray-500 hover:bg-gray-100 transition-all relative"
            >
              <Bell size={20} />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </button>
            {showNotifications && (
              <NotificationDropdown 
                notifications={notifications} 
                onClose={() => setShowNotifications(false)} 
                />
            )}
          </div>

          <div className="flex items-center gap-3 pr-4 border-r border-gray-100">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-gray-800">{user?.name}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                {user?.role === 1 ? "مسؤول النظام" : user?.role === 2 ? "موظف بلدية" : "مواطن"}
              </p>
            </div>
            <button
              onClick={logout}
              className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-2">
          <button
            onClick={() => { navigate(getDashboardRoute()); setIsMobileMenuOpen(false); }}
            className={`w-full text-right px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              location.pathname === getDashboardRoute() ? "bg-emerald-50 text-emerald-700" : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            الرئيسية
          </button>
          {user?.role === 3 && (
            <button
              onClick={() => { navigate("/my-requests"); setIsMobileMenuOpen(false); }}
              className={`w-full text-right px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                location.pathname === "/my-requests" ? "bg-emerald-50 text-emerald-700" : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              طلباتي
            </button>
          )}
          <button
            onClick={() => { navigate("/search"); setIsMobileMenuOpen(false); }}
            className={`w-full text-right px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              location.pathname === "/search" ? "bg-emerald-50 text-emerald-700" : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            بحث عن معاملة
          </button>
          {user?.role === 1 && (
            <button
              onClick={() => { navigate("/users"); setIsMobileMenuOpen(false); }}
              className={`w-full text-right px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                location.pathname === "/users" ? "bg-emerald-50 text-emerald-700" : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              إدارة المستخدمين
            </button>
          )}
          {user?.role === 1 && (
            <>
              <button
                onClick={() => { navigate("/permissions/services"); setIsMobileMenuOpen(false); }}
                className={`w-full text-right px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  location.pathname === "/permissions/services" ? "bg-emerald-50 text-emerald-700" : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                صلاحيات الخدمات
              </button>
              <button
                onClick={() => { navigate("/permissions/municipalities"); setIsMobileMenuOpen(false); }}
                className={`w-full text-right px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  location.pathname === "/permissions/municipalities" ? "bg-emerald-50 text-emerald-700" : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                صلاحيات البلديات
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
