import React, { useState } from "react";
import { User } from "../../types";
import { Edit2, Trash2, X, Save } from "lucide-react";
import { toast } from "react-toastify";
import PasswordCriteriaList from "../auth/PasswordCriteriaList";
import { validatePassword } from "../../utils/passwordValidator";

interface UserListProps {
  users: User[];
  currentUser?: User | null;
  fetchUsers?: (token: string) => void;
}

const UserList: React.FC<UserListProps> = ({ users, currentUser, fetchUsers }) => {
  const [filterRole, setFilterRole] = useState<number | "all">("all");
  
  // Edit Modal State
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});
  const [loading, setLoading] = useState(false);

  // Delete Modal State
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  // Filter out citizens (role === 3)
  const staffUsers = users.filter(u => u.role !== 3);
  
  // Apply additional drop-down filter
  const displayedUsers = staffUsers.filter(u => {
    if (filterRole === "all") return true;
    return u.role === filterRole;
  });

  const confirmDelete = (userId: string) => {
    setUserToDelete(userId);
  };

  const handleDelete = async () => {
    if (!currentUser || currentUser.role !== 1 || !userToDelete) return;

    try {
      const res = await fetch(`/api/users/admin/${userToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${currentUser.token}`
        }
      });
      if (res.ok) {
        toast.success("تم حذف المستخدم بنجاح");
        if (fetchUsers) fetchUsers(currentUser.token!);
      } else {
        toast.error("فشل حذف المستخدم");
      }
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ بالاتصال");
    } finally {
      setUserToDelete(null);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || currentUser.role !== 1 || !editingUser) return;
    
    if (editForm.password) {
      const passwordValidation = validatePassword(editForm.password);
      if (!passwordValidation.isValid) {
        toast.error(passwordValidation.message);
        return;
      }
    }
    
    setLoading(true);
    try {
      const res = await fetch(`/api/users/admin/${editingUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`
        },
        body: JSON.stringify(editForm)
      });
      if (res.ok) {
        toast.success("تم تعديل المستخدم بنجاح");
        setEditingUser(null);
        if (fetchUsers) fetchUsers(currentUser.token!);
      } else {
        const data = await res.json();
        toast.error(data.message || "فشل تعديل المستخدم");
      }
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ بالاتصال");
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      password: user.password || ""
    });
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      
      {/* Filter Dropdown */}
      <div className="flex bg-white p-4 rounded-2xl shadow-sm border border-gray-100 gap-4 items-center">
        <label className="text-sm font-bold text-gray-700">تصفية حسب الدور:</label>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value === "all" ? "all" : Number(e.target.value))}
          className="px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-emerald-500"
        >
          <option value="all">جميع الموظفين</option>
          <option value={1}>المسؤولين (Admins)</option>
          <option value={2}>موظفي البلدية</option>
        </select>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden text-right" dir="rtl">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-sm font-bold text-gray-600">الاسم</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-600">البريد الإلكتروني</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-600">الدور</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-600">الهاتف</th>
                {currentUser?.role === 1 && (
                  <th className="px-6 py-4 text-sm font-bold text-gray-600">الإجراءات</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayedUsers.length > 0 ? displayedUsers.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-800">{u.name}</td>
                  <td className="px-6 py-4 text-gray-600">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      u.role === 1 ? "bg-purple-100 text-purple-700" :
                      u.role === 2 ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
                    }`}>
                      {u.role === 1 ? "مسؤول" : u.role === 2 ? "موظف" : "مواطن"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{u.phone}</td>
                  
                  {/* Actions Column (Admins Only) */}
                  {currentUser?.role === 1 && (
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => openEditModal(u)}
                          className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                          title="تعديل حساب المستخدم"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => confirmDelete(u._id)}
                          className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                          title="حذف حساب الموظف"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">لا يوجد بيانات لعرضها</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg p-8 relative">
            <button 
              onClick={() => setEditingUser(null)}
              className="absolute top-6 left-6 text-gray-400 hover:text-gray-800 transition-colors"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-black mb-6 text-gray-800">تعديل حساب المستخدم</h2>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">الاسم</label>
                <input 
                  type="text" 
                  value={editForm.name || ""} 
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 text-left" 
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">البريد الإلكتروني</label>
                <input 
                  type="email" 
                  value={editForm.email || ""} 
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 text-left" 
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">كلمة المرور (مفككة التشفير)</label>
                <div className="relative">
                  <input 
                    type="text"
                    value={editForm.password || ""} 
                    onChange={(e) => setEditForm({...editForm, password: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-amber-200 bg-amber-50 outline-none focus:border-amber-500 font-mono text-left" 
                    dir="ltr"
                  />
                </div>
                {editForm.password && (
                  <PasswordCriteriaList password={editForm.password} />
                )}
                <p className="text-xs text-amber-600 mt-1">تنبيه: كن حذراً، سيتم حفظ هذه الكلمة ككلمة السر الجديدة للمستخدم.</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">رقم الهاتف</label>
                <input 
                  type="text" 
                  value={editForm.phone || ""} 
                  onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 text-left"
                  dir="ltr" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">الدور</label>
                <select 
                  value={editForm.role}
                  onChange={(e) => setEditForm({...editForm, role: Number(e.target.value)})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-emerald-500"
                >
                  <option value={1}>مسؤول</option>
                  <option value={2}>موظف</option>
                  <option value={3}>مواطن (سيتم إخفاؤه من هذه القائمة)</option>
                </select>
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  {loading ? "جاري الحفظ..." : "حفظ التعديلات"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm p-8 text-center relative">
            <h2 className="text-xl font-bold mb-4 text-gray-800">تأكيد الحذف</h2>
            <p className="text-gray-600 mb-6">هل أنت متأكد من حذف هذا المستخدم نهائياً؟ لا يمكن التراجع عن هذا الإجراء.</p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => setUserToDelete(null)}
                className="px-6 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition"
              >
                إلغاء
              </button>
              <button 
                onClick={handleDelete}
                className="px-6 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition"
              >
                تأكيد الحذف
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserList;
