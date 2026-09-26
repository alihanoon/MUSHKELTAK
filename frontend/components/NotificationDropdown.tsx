import React from "react";
import { Bell, Clock, CheckCircle } from "lucide-react";
import { Notification } from "../types";

interface NotificationDropdownProps {
  notifications: Notification[];
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  onClose,
}) => {
  return (
    <div className="absolute left-0 mt-4 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 text-right" dir="rtl">
      <div className="p-4 bg-emerald-600 text-white flex items-center justify-between">
        <h3 className="font-bold">الإشعارات</h3>
        <Bell size={18} />
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div
              key={n._id}
              className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${
                !n.read ? "bg-emerald-50/30" : ""
              }`}
            >
              <div className="flex gap-3">
                <div className="mt-1">
                  {n.type === "status_update" ? (
                    <Clock size={16} className="text-blue-500" />
                  ) : (
                    <CheckCircle size={16} className="text-emerald-500" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-800 font-medium leading-relaxed">
                    {n.message}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {new Date(n.createdAt).toLocaleString("ar-JO")}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-400">
            <p className="text-sm">لا توجد إشعارات حالياً</p>
          </div>
        )}
      </div>
      <button
        onClick={onClose}
        className="w-full p-3 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors border-t border-gray-50"
      >
        إغلاق
      </button>
    </div>
  );
};

export default NotificationDropdown;
