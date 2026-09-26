import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { AlertCircle } from "lucide-react";
import LoginForm from "./auth/LoginForm";
import RegisterForm from "./auth/RegisterForm";

interface AuthProps {
  error: string;
  loading: boolean;
  authForm: any;
  setAuthForm: (form: any) => void;
  handleAuth: (e: React.FormEvent) => void;
}

const Auth: React.FC<AuthProps> = ({
  error,
  loading,
  authForm,
  setAuthForm,
  handleAuth,
}) => {
  const location = useLocation();
  const isLogin = location.pathname === "/login" || location.pathname === "/";

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-md border border-white/20"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-emerald-700 mb-2">مشكلتك</h1>
          <h2 className="text-xl font-bold text-gray-600">
            {isLogin ? "تسجيل الدخول" : "إنشاء حساب جديد"}
          </h2>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 border border-red-100">
            <AlertCircle size={20} />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {isLogin ? (
          <LoginForm
            authForm={authForm}
            setAuthForm={setAuthForm}
            handleAuth={handleAuth}
            loading={loading}
          />
        ) : (
          <RegisterForm
            authForm={authForm}
            setAuthForm={setAuthForm}
            handleAuth={handleAuth}
            loading={loading}
          />
        )}

        <p className="mt-8 text-center text-gray-500 text-sm">
          {isLogin ? "ليس لديك حساب؟" : "لديك حساب بالفعل؟"}
          <Link
            to={isLogin ? "/register" : "/login"}
            className="mr-2 text-emerald-600 font-bold hover:underline"
          >
            {isLogin ? "إنشاء حساب ؟" : "سجل دخولك"}
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
