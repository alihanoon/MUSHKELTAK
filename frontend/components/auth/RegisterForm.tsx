import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import PasswordCriteriaList from "./PasswordCriteriaList";

interface RegisterFormProps {
  authForm: any;
  setAuthForm: (form: any) => void;
  handleAuth: (e: React.FormEvent) => void;
  loading: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  authForm,
  setAuthForm,
  handleAuth,
  loading,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={handleAuth} className="space-y-5">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          الاسم الكامل
        </label>
        <input
          type="text"
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
          placeholder="أدخل اسمك الكامل"
          value={authForm.name}
          onChange={(e) =>
            setAuthForm({ ...authForm, name: e.target.value })
          }
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          البريد الإلكتروني
        </label>
        <input
          type="email"
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
          placeholder="example@mail.com"
          value={authForm.email}
          onChange={(e) =>
            setAuthForm({ ...authForm, email: e.target.value })
          }
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          رقم الهاتف
        </label>
          <input
            type="tel"
            maxLength={10}
            minLength={10}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
            value={authForm.phone}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              if (value.length <= 10) {
                setAuthForm({ ...authForm, phone: value });
              }
              // setAuthForm({ ...authForm, phone: e.target.value })
            }}
          />
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          كلمة المرور
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all pl-12"
            placeholder="••••••••"
            value={authForm.password}
            onChange={(e) =>
              setAuthForm({ ...authForm, password: e.target.value })
            }
          />
          <button
            type="button"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-600 focus:outline-none"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {authForm.password && (
          <PasswordCriteriaList password={authForm.password} />
        )}
      </div>
      <button
        disabled={loading}
        className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-700 transition-all disabled:opacity-50 mt-4"
      >
        {loading ? "جاري المعالجة..." : "إنشاء حساب"}
      </button>
    </form>
  );
};

export default RegisterForm;
