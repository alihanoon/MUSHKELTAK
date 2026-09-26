import React from "react";
import PasswordCriteriaList from "../auth/PasswordCriteriaList";


interface AddUserFormProps {
  authForm: any;
  setAuthForm: (form: any) => void;
  handleAdminCreateUser: (e: React.FormEvent) => void;
  loading: boolean;
  governorates: any[];
  municipalities: any[];
}

const AddUserForm: React.FC<AddUserFormProps> = ({
  authForm,
  setAuthForm,
  handleAdminCreateUser,
  loading,
  governorates,
  municipalities
}) => {
  return (
    <div
      className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-12 text-right"
      dir="rtl"
    >
      <h3 className="text-xl font-bold mb-6">
        إضافة مستخدم جديد (موظف / مسؤول)
      </h3>
      <form
        onSubmit={handleAdminCreateUser}
        className="grid md:grid-cols-2 gap-6"
      >
        {/* حقل الاسم */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            الاسم
          </label>
          <input
            type="text"
            required
            placeholder="الاسم  "
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            value={authForm.name}
            onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
          />
        </div>

        {/* حقل البريد الإلكتروني */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            البريد الإلكتروني
          </label>
          <input
            type="email"
            required
            placeholder="example@moshkeltak.com"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            value={authForm.email}
            onChange={(e) =>
              setAuthForm({ ...authForm, email: e.target.value })
            }
          />
        </div>

        {/* حقل كلمة المرور */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            كلمة المرور
          </label>
          <input
            type="password"
            required
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            value={authForm.password}
            onChange={(e) =>
              setAuthForm({ ...authForm, password: e.target.value })
            }
          />
          {authForm.password && (
            <PasswordCriteriaList password={authForm.password} />
          )}
        </div>

        {/* حقل رقم الهاتف */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            رقم الهاتف
          </label>
          <input
            type="tel"
            maxLength={10}
            minLength={10}
            required
            placeholder="07xxxxxxxx"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            value={authForm.phone}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, ""); 
              if (value.length <= 10) {
                setAuthForm({ ...authForm, phone: value });
              }
            }}
          />
        </div>

        {/* حقل اختيار الدور */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            الدور
          </label>
          <select
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            value={authForm.role === 3 ? "" : (authForm.role || "")}
            onChange={(e) => {
              const val = e.target.value;
              const roleVal = val === "" ? "" : parseInt(val);
              
              // تحديث الدور وتنظيف بيانات المحافظة/البلدية إذا لم يكن المستخدم "موظف بلدية"
              setAuthForm({ 
                ...authForm, 
                role: roleVal,
                ...(roleVal !== 2 && { city: "", municipality: "" })
              });
            }}
          >
            <option value="" disabled>اختر الدور</option>
            <option value={2}>موظف بلدية</option>
            <option value={1}>مسؤول (Admin)</option>
          </select>
        </div>

        {/* حقول اختيار الموقع - تظهر فقط للموظف */}
        {authForm.role === 2 && (
          <>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                المحافظة
              </label>
              <select
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                value={authForm.city || ""}
                onChange={(e) =>
                  setAuthForm({
                    ...authForm,
                    city: e.target.value,
                    municipality: "", // تصفير البلدية عند تغيير المحافظة
                  })
                }
              >
                <option value="">اختر المحافظة...</option>
                {governorates.map((gov) => (
                  <option key={gov._id} value={gov._id}>
                    {gov.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                البلدية
              </label>
              <select
                required
                disabled={!authForm.city}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed transition-all"
                value={authForm.municipality || ""}
                onChange={(e) =>
                  setAuthForm({
                    ...authForm,
                    municipality: e.target.value,
                  })
                }
              >
                <option value="">اختر البلدية...</option>
                {municipalities
                  .filter((mun) => mun.governorate === authForm.city)
                  .map((mun) => (
                    <option key={mun._id} value={mun._id}>
                      {mun.name}
                    </option>
                  ))}
              </select>
            </div>
          </>
        )}

        {/* زر الإرسال */}
        <div className="flex items-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                جاري الإضافة...
              </span>
            ) : (
              "إضافة المستخدم"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUserForm;