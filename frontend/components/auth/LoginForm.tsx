import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import PasswordCriteriaList from "./PasswordCriteriaList";
import { validatePassword } from "../../utils/passwordValidator";

interface LoginFormProps {
  authForm: any;
  setAuthForm: (form: any) => void;
  handleAuth: (e: React.FormEvent) => void;
  loading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({
  authForm,
  setAuthForm,
  handleAuth,
  loading,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'login' | 'request' | 'verify'>('login');
  
  // Forgot Password States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  // Password visibility states for Reset Password step
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Inline message states
  const [requestMessage, setRequestMessage] = useState("");
  const [requestError, setRequestError] = useState("");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authForm.email) {
      setRequestError("الرجاء إدخال البريد الإلكتروني");
      return;
    }
    
    setIsSubmitting(true);
    setRequestMessage("");
    setRequestError("");
    
    // محاكاة الانتظار قليلاً حسب الطلب لتوضيح عملية المعالجة
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      const res = await axios.post("/api/users/forgot-password", { email: authForm.email });
      toast.success(res.data.message || "تم إرسال الايميل، يرجى تفقد الوارد"); 
      setStep('verify');
      setResendTimer(60);
    } catch (error: any) {
      setRequestError(error.response?.data?.message || "حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    
    setIsSubmitting(true);
    try {
      const res = await axios.post("/api/users/forgot-password", { email: authForm.email });
      toast.success(res.data.message || "تم إعادة إرسال الايميل، يرجى تفقد الوارد");
      setResendTimer(60);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      toast.error(passwordValidation.message);
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("كلمة المرور وتأكيد كلمة المرور غير متطابقين");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const res = await axios.post("/api/users/reset-password", { 
        email: authForm.email, 
        otp, 
        newPassword 
      });
      toast.success(res.data.message || "تم تغيير كلمة المرور بنجاح");
      
      // Reset states and go back to login
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
      setStep('login');
      setAuthForm({ ...authForm, password: newPassword });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 'request') {
    return (
      <form onSubmit={handleForgotPasswordSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            أدخل بريدك الإلكتروني لاستعادة كلمة المرور
          </label>
          <input
            type="email"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            placeholder="example@mail.com"
            value={authForm.email}
            onChange={(e) => {
              setAuthForm({ ...authForm, email: e.target.value });
              setRequestError(""); // إخفاء الخطأ عند التعديل
            }}
          />
        </div>
        
        {requestError && (
          <div className="text-sm text-red-600 font-medium text-center">
            {requestError}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-700 transition-all disabled:opacity-50 mt-4"
        >
          {isSubmitting ? "جاري التحقق..." : "إرسال رمز التحقق (OTP)"}
        </button>
        <button
          type="button"
          onClick={() => {
            setStep('login');
            setRequestError("");
          }}
          className="w-full py-2 text-sm text-gray-500 hover:text-emerald-600 font-medium transition-all"
        >
          العودة لتسجيل الدخول
        </button>
      </form>
    );
  }

  if (step === 'verify') {
    return (
      <form onSubmit={handleResetPasswordSubmit} className="space-y-5">
        <div className="text-sm text-gray-600 text-center mb-4">
          تم إرسال رمز التحقق إلى: <span className="font-bold">{authForm.email}</span>
        </div>
        
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            رمز التحقق (OTP)
          </label>
          <input
            type="text"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none text-center tracking-widest transition-all"
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            كلمة المرور الجديدة
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all pl-12"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-600 focus:outline-none"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {newPassword && (
            <PasswordCriteriaList password={newPassword} />
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            تأكيد كلمة المرور الجديدة
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all pl-12"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-600 focus:outline-none"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-700 transition-all disabled:opacity-50 mt-4"
        >
          {isSubmitting ? "جاري التغيير..." : "تعيين كلمة المرور"}
        </button>
        
        <button
          type="button"
          onClick={handleResendOTP}
          disabled={isSubmitting || resendTimer > 0}
          className="w-full py-2 text-sm text-emerald-600 hover:text-emerald-700 disabled:text-gray-400 font-medium transition-all"
        >
          {resendTimer > 0 ? `إعادة الإرسال بعد (${resendTimer}) ثانية` : "إعادة إرسال الرمز"}
        </button>

        <button
          type="button"
          onClick={() => {
            setStep('login');
            setRequestError("");
          }}
          className="w-full py-2 text-sm text-gray-500 hover:text-emerald-600 font-medium transition-all"
        >
          إلغاء والعودة
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleAuth} className="space-y-5">
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
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-bold text-gray-700">
            كلمة المرور
          </label>
          <button
            type="button"
            onClick={() => setStep('request')}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium hover:underline transition-all"
          >
            هل نسيت كلمة السر؟
          </button>
        </div>
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
      </div>
      <button
        disabled={loading}
        className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-700 transition-all disabled:opacity-50 mt-4"
      >
        {loading ? "جاري المعالجة..." : "دخول"}
      </button>
    </form>
  );
};

export default LoginForm;
