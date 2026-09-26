import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, MapPin, User as UserIcon, Phone, ChevronLeft } from "lucide-react";
import { Complaint, STATUS_MAP, User } from "../types";
import StatusTimeline from "./complaints/StatusTimeline";
import ResponseForm from "./complaints/ResponseForm";
import LocationPicker from "./complaints/LocationPicker";

interface ComplaintDetailsProps {
  selectedComplaint: Complaint | null;
  user: User | null;
  responseForm: any;
  setResponseForm: (form: any) => void;
  handleUpdateStatus: (e: React.FormEvent) => void;
  loading: boolean;
}

const ComplaintDetails: React.FC<ComplaintDetailsProps> = ({
  selectedComplaint,
  user,
  responseForm,
  setResponseForm,
  handleUpdateStatus,
  loading,
}) => {
  if (!selectedComplaint) return null;
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedComplaint?.status === 0 && user?.role === 3) {
      setResponseForm({ status: 1, response: "" });
    }
  }, [selectedComplaint, user, setResponseForm]);

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 space-y-6 text-right" dir="rtl">
      <div className="flex items-center gap-4 mb-2">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <ChevronLeft size={24} className="rotate-180" />
        </button>
        <h1 className="text-2xl font-black text-gray-800">تفاصيل المعاملة</h1>
      </div>
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8">
        <div className="flex items-center justify-between border-b border-gray-50 pb-6">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase mb-1">
              رقم المعاملة
            </p>
            <h2 className="text-xl font-black text-gray-800">
              {selectedComplaint.complaintNumber}
            </h2>
          </div>
          <span
            className={`px-6 py-2 rounded-full text-sm font-bold ${
              STATUS_MAP[selectedComplaint.status].color
            }`}
          >
            {STATUS_MAP[selectedComplaint.status].label}
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <FileText size={20} className="text-[#D4AF37]" />
              <div>
                <p className="text-xs text-gray-400">نوع الخدمة</p>
                <p className="font-bold">{selectedComplaint.type}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={20} className="text-[#D4AF37]" />
              <div>
                <p className="text-xs text-gray-400">الموقع</p>
                <p className="font-bold">
                  {selectedComplaint.municipality}، {selectedComplaint.city}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl">
            <p className="text-xs text-gray-400 mb-2">تاريخ التقديم</p>
            <p className="font-bold">
              {new Date(selectedComplaint.createdAt).toLocaleString("ar-JO")}
            </p>
          </div>
        </div>

        {(user?.role === 1 || user?.role === 2) &&
          selectedComplaint.user &&
          typeof selectedComplaint.user === "object" && (
            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
              <p className="text-xs font-bold text-emerald-600 mb-3 uppercase tracking-wider">
                معلومات مقدم الطلب
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <UserIcon size={18} className="text-emerald-600" />
                  <div>
                    <p className="text-[10px] text-emerald-600/70">الاسم الكامل</p>
                    <p className="font-bold text-gray-800">
                      {selectedComplaint.user.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-emerald-600" />
                  <div>
                    <p className="text-[10px] text-emerald-600/70">رقم الهاتف</p>
                    <a
                      href={`tel:${selectedComplaint.user.phone}`}
                      className="font-bold text-emerald-700 hover:underline"
                    >
                      {selectedComplaint.user.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

        {selectedComplaint.image && (
          <div>
            <p className="text-xs font-bold text-gray-400 mb-3">الصورة المرفقة</p>
            <div className="w-full h-64 rounded-2xl overflow-hidden border border-gray-100">
              <img
                src={selectedComplaint.image}
                alt="Complaint"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        <div>
          <p className="text-xs font-bold text-gray-400 mb-3">التفاصيل</p>
          <div className="bg-gray-50 p-6 rounded-2xl text-gray-700 leading-relaxed">
            {selectedComplaint.description}
          </div>
        </div>

        {selectedComplaint.location && (
          <LocationPicker
            lat={selectedComplaint.location.lat}
            lng={selectedComplaint.location.lng}
          />
        )}

        {selectedComplaint.status === 0 && user?.role === 3 && (
          <form
            onSubmit={handleUpdateStatus}
            className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl flex flex-col items-center justify-center gap-4 mt-6"
          >
            <p className="text-emerald-700 font-bold">هذا الطلب مسودة (غير مرسل). لم يتم ارساله الى الجهات المختصة بعد.</p>
            <button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-xl transition-colors w-full sm:w-auto"
            >
              {loading ? "جاري الإرسال..." : "إرسال هذا الطلب"}
            </button>
          </form>
        )}

        <StatusTimeline currentStatus={selectedComplaint.status} />

        {(user?.role === 1 || user?.role === 2) && (
          <ResponseForm
            currentStatus={selectedComplaint.status}
            responseForm={responseForm}
            setResponseForm={setResponseForm}
            handleUpdateStatus={handleUpdateStatus}
            loading={loading}
          />
        )}

        {selectedComplaint.response && (
          <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
            <p className="text-xs font-bold text-emerald-600 mb-2">الرد الرسمي</p>
            <p className="text-gray-800 leading-relaxed">
              {selectedComplaint.response}
            </p>
            <p className="text-[10px] text-emerald-400 mt-2">
              تم الرد في:{" "}
              {new Date(selectedComplaint.respondedAt!).toLocaleString("ar-JO")}
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default ComplaintDetails;
