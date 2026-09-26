import React from "react";
import { Check, X } from "lucide-react";

interface PasswordCriteriaListProps {
  password: string;
}

const PasswordCriteriaList: React.FC<PasswordCriteriaListProps> = ({ password }) => {
  const criteria = [
    { label: "8 خانات على الأقل", isValid: password.length >= 8 },
    { label: "حرف كبير (A-Z)", isValid: /[A-Z]/.test(password) },
    { label: "حرف صغير (a-z)", isValid: /[a-z]/.test(password) },
    { label: "رقم (0-9)", isValid: /\d/.test(password) },
    { label: "رمز خاص (مثل @, #, $)", isValid: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password) },
  ];

  return (
    <div className="mt-3 space-y-2 text-sm bg-gray-50 p-4 rounded-xl border border-gray-100 text-right" dir="rtl">
      <p className="font-bold text-gray-700 mb-2 text-xs">شروط كلمة المرور:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {criteria.map((item, index) => (
          <div
            key={index}
            className={`flex items-center gap-2 transition-colors duration-200 ${
              item.isValid ? "text-emerald-600 font-medium" : "text-gray-400"
            }`}
          >
            {item.isValid ? (
              <Check size={14} className="shrink-0 text-emerald-500 stroke-[3]" />
            ) : (
              <X size={14} className="shrink-0 text-gray-300 stroke-[3]" />
            )}
            <span className="text-[11px]">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordCriteriaList;
