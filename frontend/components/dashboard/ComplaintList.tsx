import React from "react";
import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Complaint, STATUS_MAP } from "../../types";

interface ComplaintListProps {
  complaints: Complaint[];
}

const ComplaintList: React.FC<ComplaintListProps> = ({
  complaints,
}) => {
  const navigate = useNavigate();
  return (
    <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
      <h3 className="text-xl font-bold mb-6">آخر المعاملات</h3>
      <div className="grid gap-4">
        {complaints.map((c) => (
          <div
            key={c._id}
            onClick={() => {
              navigate(`/complaints/${c._id}`);
            }}
            className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-50 rounded-xl flex shrink-0 items-center justify-center text-emerald-600">
                <FileText size={20} className="md:w-6 md:h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-sm md:text-base">{c.type}</h4>
                <p className="text-xs text-gray-400 mt-1">
                  بواسطة: {c.user?.name} | {c.complaintNumber}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-4 md:gap-6 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-gray-50 sm:border-none">
              <div className="text-right sm:text-left">
                <p className="text-xs text-gray-400 mb-1">تاريخ التقديم</p>
                <p className="text-xs md:text-sm font-semibold text-gray-700">
                  {new Date(c.createdAt).toLocaleDateString("ar-EG", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <span
                className={`px-3 md:px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
                  STATUS_MAP[c.status].color
                }`}
              >
                {STATUS_MAP[c.status].label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComplaintList;
