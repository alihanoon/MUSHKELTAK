import React from "react";
import { STATUS_MAP } from "../../types";

interface StatusTimelineProps {
  currentStatus: number;
}

const StatusTimeline: React.FC<StatusTimelineProps> = ({ currentStatus }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-right" dir="rtl">
      <h3 className="font-bold text-gray-800 mb-6">حالة المعاملة</h3>
      <div className="relative space-y-8">
        {[1, 2, 3, 4].map((step) => {
          // step 4 represents the final state (either 4 or 5)
          const isCompleted = step === 4 ? (currentStatus >= 4) : (currentStatus >= step);
          const isCurrent = step === 4 ? (currentStatus === 4 || currentStatus === 5) : (currentStatus === step);

          let label = STATUS_MAP[step].label;
          if (step === 4) {
            if (currentStatus === 4) label = "تم الموافقة";
            else if (currentStatus === 5) label = "تم الرفض";
            else label = "بإنتظار الرد";
          }

          return (
            <div key={step} className="flex items-start gap-4">
              <div className="relative z-10">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    isCompleted
                      ? (currentStatus === 5 && step === 4 ? "bg-red-500 text-white" : "bg-emerald-600 text-white")
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {step}
                </div>
                {step < 4 && (
                  <div
                    className={`absolute top-8 right-4 w-0.5 h-8 -mr-0.25 ${
                      currentStatus > step ? "bg-emerald-600" : "bg-gray-200"
                    }`}
                  ></div>
                )}
              </div>
              <div>
                <p
                  className={`text-sm font-bold ${
                    isCompleted 
                      ? (currentStatus === 5 && step === 4 ? "text-red-600" : "text-emerald-700") 
                      : "text-gray-400"
                  }`}
                >
                  {label}
                </p>
                {isCurrent && (
                  <p className={`text-xs mt-1 ${currentStatus === 5 ? "text-red-500" : "text-emerald-600"}`}>
                    الحالة الحالية
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusTimeline;
