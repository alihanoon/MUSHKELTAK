import React from "react";
import { Complaint } from "../../types";

interface AdminStatsProps {
  complaints: Complaint[];
  filter: "all" | "processing" | "resolved";
  setFilter: (f: "all" | "processing" | "resolved") => void;
}

const AdminStats: React.FC<AdminStatsProps> = ({ complaints, filter, setFilter }) => {
  return (
    <div className="grid sm:grid-cols-3 gap-4 md:gap-6">
      <div 
        onClick={() => setFilter("all")}
        className={`bg-emerald-50 p-6 md:p-8 rounded-3xl border text-center transition-all cursor-pointer ${filter === "all" ? "border-emerald-500 ring-2 ring-emerald-200" : "border-emerald-100 hover:border-emerald-300"}`}
      >
        <p className="text-emerald-600 font-bold text-sm mb-2">
          إجمالي المعاملات
        </p>
        <p className="text-3xl md:text-4xl font-black text-emerald-700">
          {complaints.filter((c) => c.status === 1).length}
        </p>
      </div>
      
      <div 
        onClick={() => setFilter("processing")}
        className={`bg-blue-50 p-6 md:p-8 rounded-3xl border text-center transition-all cursor-pointer ${filter === "processing" ? "border-blue-500 ring-2 ring-blue-200" : "border-blue-100 hover:border-blue-300"}`}
      >
        <p className="text-blue-600 font-bold text-sm mb-2">قيد المعالجة</p>
        <p className="text-3xl md:text-4xl font-black text-blue-700">
          {complaints.filter((c) => c.status === 2 || c.status === 3).length}
        </p>
      </div>
      
      <div 
        onClick={() => setFilter("resolved")}
        className={`bg-green-50 p-6 md:p-8 rounded-3xl border text-center transition-all cursor-pointer ${filter === "resolved" ? "border-green-500 ring-2 ring-green-200" : "border-green-100 hover:border-green-300"}`}
      >
        <p className="text-green-600 font-bold text-sm mb-2">تم الرد</p>
        <p className="text-4xl font-black text-green-700">
          {complaints.filter((c) => c.status === 4 || c.status === 5).length}
        </p>
      </div>
    </div>
  );
};

export default AdminStats;
