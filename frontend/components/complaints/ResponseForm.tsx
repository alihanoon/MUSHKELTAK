import React from "react";
import { STATUS_MAP } from "../../types";

interface ResponseFormProps {
  currentStatus: number;
  responseForm: any;
  setResponseForm: (form: any) => void;
  handleUpdateStatus: (e: React.FormEvent) => void;
  loading: boolean;
}

const ResponseForm: React.FC<ResponseFormProps> = ({
  currentStatus,
  responseForm,
  setResponseForm,
  handleUpdateStatus,
  loading,
}) => {
  const mainStatus = (responseForm.status === 4 || responseForm.status === 5) ? "reply" : responseForm.status.toString();

  return (
    <div className="bg-white p-8 rounded-3xl shadow-lg border border-emerald-100 text-right" dir="rtl">
      <h3 className="text-xl font-bold text-emerald-800 mb-6">تحديث حالة المعاملة والرد</h3>
      <form onSubmit={handleUpdateStatus} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">الحالة الجديدة</label>
          <select
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none disabled:bg-gray-100 disabled:text-gray-400"
            value={mainStatus}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "reply") {
                setResponseForm({ ...responseForm, status: 4 }); // default to "تم الموافقة"
              } else {
                setResponseForm({ ...responseForm, status: parseInt(val) });
              }
            }}
          >
            <option value="0" disabled={currentStatus > 0}>غير مرسل</option>
            <option value="1" disabled={currentStatus > 1}>تم الارسال</option>
            <option value="2" disabled={currentStatus > 2}>قيد التحقق</option>
            <option value="3" disabled={currentStatus > 3}>بإنتظار الموافقات</option>
            <option value="reply" disabled={currentStatus > 5}>الرد</option>
          </select>
        </div>
        
        {mainStatus === "reply" && (
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">نوع الرد</label>
            <select
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
              value={responseForm.status}
              onChange={(e) => setResponseForm({ ...responseForm, status: parseInt(e.target.value) })}
            >
              <option value="4">تم الموافقة</option>
              <option value="5">تم الرفض</option>
            </select>
          </div>
        )}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">الرد الرسمي</label>
          <textarea
            required
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
            placeholder="اكتب الرد الرسمي هنا..."
            value={responseForm.response}
            onChange={(e) => setResponseForm({ ...responseForm, response: e.target.value })}
          />
        </div>
        <button
          disabled={loading}
          className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-700 transition-all disabled:opacity-50"
        >
          {loading ? "جاري التحديث..." : "تحديث المعاملة"}
        </button>
      </form>
    </div>
  );
};

export default ResponseForm;
