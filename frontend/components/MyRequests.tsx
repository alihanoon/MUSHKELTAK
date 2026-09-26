import React from "react";
import { useNavigate } from "react-router-dom";
import { FileText, ChevronLeft, Clock } from "lucide-react";
import { Complaint, STATUS_MAP } from "../types";

interface MyRequestsProps {
  complaints: Complaint[];
}

const MyRequests: React.FC<MyRequestsProps> = ({
  complaints,
}) => {
  const navigate = useNavigate();
  return (
    <main className="max-w-4xl mx-auto px-6 py-12 text-right" dir="rtl">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black text-gray-800">طلباتي السابقة</h2>
        <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl">
          <Clock size={18} />
          <span className="text-sm font-bold">إجمالي الطلبات: {complaints.length}</span>
        </div>
      </div>

      <div className="grid gap-4">
        {complaints.map((c) => (
          <div
            key={c._id}
            onClick={() => {
              navigate(`/complaints/${c._id}`);
            }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <FileText size={28} />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-lg">{c.type}</h4>
                <p className="text-sm text-gray-400 mt-1">رقم المعاملة: {c.complaintNumber}</p>
                <p className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleDateString('ar-JO')}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <span className={`px-4 py-2 rounded-full text-xs font-bold ${STATUS_MAP[c.status].color}`}>
                {STATUS_MAP[c.status].label}
              </span>
              <ChevronLeft size={20} className="text-gray-300 group-hover:text-emerald-600 transition-colors" />
            </div>
          </div>
        ))}
        {complaints.length === 0 && (
          <div className="bg-white p-12 rounded-3xl border border-dashed border-gray-200 text-center">
            <p className="text-gray-400 text-lg">لا يوجد لديك طلبات سابقة حالياً</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 text-emerald-600 font-bold hover:underline"
            >
              تقديم طلب جديد الآن
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default MyRequests;
