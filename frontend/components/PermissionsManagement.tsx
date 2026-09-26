import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Shield, Check, X, Save } from "lucide-react";

import { User } from "../types";
import { toast } from "react-toastify";

interface PermissionsManagementProps {
  user: User | null;
  users: User[];
  fetchUsers: (token: string) => void;
  governorates: any[];
  municipalities: any[];
  services: any[];
}

const PermissionsManagement: React.FC<PermissionsManagementProps> = ({ user, users, fetchUsers, governorates, municipalities, services }) => {
  const { type } = useParams<{ type: "services" | "municipalities" }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<number | "">("");
  const [selectedGov, setSelectedGov] = useState<string>("");
  const [selectedMun, setSelectedMun] = useState<string>("");
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const isServices = type === "services";

  // When selectedUserId changes, set default checks
  useEffect(() => {
    if (!selectedUserId) {
      setCheckedItems([]);
      return;
    }
    const targetUser = users.find((u) => u._id === selectedUserId);
    if (targetUser) {
      if (isServices) {
        if (!targetUser.allowedServices || targetUser.allowedServices.length === 0) {
          // Default: all services
          setCheckedItems(services.map((s) => s._id));
        } else {
          setCheckedItems(targetUser.allowedServices);
        }
      } else {
        // Municipalities
        if (!targetUser.allowedMunicipalities || targetUser.allowedMunicipalities.length === 0) {
          if (targetUser.role === 1 || (targetUser.role === 2 && !targetUser.municipality && !targetUser.city)) {
            setCheckedItems(municipalities.map(m => m._id));
          } else if (targetUser.municipality) {
            setCheckedItems([targetUser.municipality]);
          } else {
            setCheckedItems([]);
          }
        } else {
          setCheckedItems(targetUser.allowedMunicipalities);
        }
      }
    }
  }, [selectedUserId, users, isServices]);

  // Handle Checkbox Change
  const handleCheck = (id: string) => {
    if (checkedItems.includes(id)) {
      setCheckedItems(checkedItems.filter((i) => i !== id));
    } else {
      setCheckedItems([...checkedItems, id]);
    }
  };

  const handleSave = async () => {
    if (!user || user.role !== 1 || !selectedUserId) return;
    
    setLoading(true);
    const body: any = {};
    if (isServices) {
      body.allowedServices = checkedItems;
    } else {
      body.allowedMunicipalities = checkedItems;
    }

    try {
      const res = await fetch(`/api/users/admin/${selectedUserId}/permissions`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success("تم تخصيص الصلاحيات بنجاح");
        fetchUsers(user.token); // Refresh users list
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "فشل حفظ الصلاحيات");
      }
    } catch (err) {
      toast.error("حدث خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (selectedRole !== "" && u.role !== selectedRole) return false;
    if (selectedMun !== "" && u.municipality !== selectedMun) return false;
    return true;
  });

  if (user?.role !== 1) {
    return (
      <div className="p-12 text-center text-gray-500 font-bold">
        غير مصرح لك بمشاهدة هذه الصفحة
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-12 text-right" dir="rtl">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
          <Shield size={28} />
        </div>
        <h1 className="text-3xl font-black text-gray-800">
          إدارة {isServices ? "صلاحيات الخدمات" : "صلاحيات البلديات"}
        </h1>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8">
        <h3 className="text-xl font-bold text-gray-800 border-b pb-4">
          1. تحديد الموظف
        </h3>
        <div className="grid md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">الدور</label>
            <select
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value === "" ? "" : parseInt(e.target.value));
              }}
            >
              <option value="">اختر الدور...</option>
              <option value="1">مسؤول (Admin)</option>
              <option value="2">موظف بلدية</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">المحافظة</label>
            <select
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
              value={selectedGov}
              onChange={(e) => {
                setSelectedGov(e.target.value);
                setSelectedMun("");
                setSelectedUserId("");
              }}
            >
              <option value="">اختر المحافظة...</option>
              {governorates.map((gov) => (
                <option key={gov._id} value={gov._id}>{gov.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">البلدية</label>
            <select
              disabled={!selectedGov}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none disabled:bg-gray-50"
              value={selectedMun}
              onChange={(e) => {
                setSelectedMun(e.target.value);
                setSelectedUserId("");
              }}
            >
              <option value="">اختر البلدية...</option>
              {municipalities
                .filter(m => m.governorate === selectedGov)
                .map((mun) => (
                  <option key={mun._id} value={mun._id}>{mun.name}</option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">الموظف</label>
            <select
              disabled={!selectedRole && !selectedMun}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none disabled:bg-gray-50 bg-emerald-50/50"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
            >
              <option value="">اختر المستهدف...</option>
              {filteredUsers.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} - {u.email}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedUserId && (
          <div className="mt-8 pt-8 border-t border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-bold text-gray-800">
                  2. تعيين الصلاحيات
                </h3>
                <button
                  onClick={() => {
                    if (isServices) {
                      if (checkedItems.length === services.length) {
                        setCheckedItems([]);
                      } else {
                        setCheckedItems(services.map((s) => s._id));
                      }
                    } else {
                      if (checkedItems.length >= municipalities.length) {
                        setCheckedItems([]);
                      } else {
                        setCheckedItems(municipalities.map(m => m._id));
                      }
                    }
                  }}
                  className="px-3 py-1.5 text-sm font-bold text-emerald-600 border border-emerald-200 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                >
                  {(isServices && checkedItems.length === services.length) || (!isServices && checkedItems.length >= municipalities.length) 
                    ? "إلغاء تحديد الكل" 
                    : "تحديد الكل"}
                </button>
              </div>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-700 transition-all flex items-center gap-2"
              >
                {loading ? "جاري الحفظ..." : <><Save size={20} /> حفظ التعديلات</>}
              </button>
            </div>

            {isServices ? (
              <div className="grid md:grid-cols-3 gap-4">
                {services.map((srv) => (
                  <label
                    key={srv._id}
                    className="flex items-center gap-3 p-4 border border-gray-100 rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                      checked={checkedItems.includes(srv._id)}
                      onChange={() => handleCheck(srv._id)}
                    />
                    <span className="font-bold text-gray-700">{srv.name}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {governorates.map((gov) => {
                  const muns = municipalities.filter(m => m.governorate === gov._id);
                  return (
                    <div key={gov._id} className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                      <h4 className="font-black text-gray-800 mb-4 text-emerald-700">{gov.name}</h4>
                      <div className="grid md:grid-cols-4 gap-4">
                        {muns.map((mun) => (
                          <label
                            key={mun._id}
                            className="flex items-center gap-2 p-3 bg-white border border-gray-100 rounded-xl cursor-pointer hover:border-emerald-200 transition-colors"
                          >
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                              checked={checkedItems.includes(mun._id)}
                              onChange={() => handleCheck(mun._id)}
                            />
                            <span className="text-sm font-bold text-gray-700 truncate" title={mun.name}>{mun.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default PermissionsManagement;
