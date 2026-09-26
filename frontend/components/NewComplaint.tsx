import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, FileText, Send } from "lucide-react";

import LocationPicker from "./complaints/LocationPicker";
import ImageUpload from "./complaints/ImageUpload";

interface NewComplaintProps {
  complaintForm: any;
  setComplaintForm: (form: any) => void;
  handleCreateComplaint: (e: React.FormEvent, status?: number) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
  governorates: any[];
  municipalities: any[];
  services: any[];
}

const NewComplaint: React.FC<NewComplaintProps> = ({
  complaintForm,
  setComplaintForm,
  handleCreateComplaint,
  handleImageUpload,
  loading,
  governorates,
  municipalities,
  services,
}) => {
  const navigate = useNavigate();
  
  // Find the service name for display
  const serviceName = services.find(s => s._id === complaintForm.type)?.name || complaintForm.type;
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate("/")}
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <ChevronLeft size={24} className="rotate-180" />
        </button>
        <h1 className="text-2xl font-black text-gray-800">
          تقديم طلب: {serviceName}
        </h1>
      </div>

      <form
        onSubmit={(e) => handleCreateComplaint(e, 1)}
        className="space-y-6"
      >
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                المحافظة
              </label>
              <select
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                value={complaintForm.city}
                onChange={(e) =>
                  setComplaintForm({
                    ...complaintForm,
                    city: e.target.value,
                    municipality: "",
                  })
                }
              >
                <option value="">اختر المحافظة...</option>
                {governorates.map((gov) => (
                  <option key={gov._id} value={gov._id}>
                    {gov.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                البلدية
              </label>
              <select
                required
                disabled={!complaintForm.city}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none disabled:bg-gray-50"
                value={complaintForm.municipality}
                onChange={(e) =>
                  setComplaintForm({
                    ...complaintForm,
                    municipality: e.target.value,
                  })
                }
              >
                <option value="">اختر البلدية...</option>
                {municipalities
                  .filter((mun) => mun.governorate === complaintForm.city)
                  .map((mun) => (
                    <option key={mun._id} value={mun._id}>
                      {mun.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              وصف الطلب / الشكوى
            </label>
            <textarea
              required
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
              placeholder="اشرح التفاصيل هنا..."
              value={complaintForm.description}
              onChange={(e) =>
                setComplaintForm({
                  ...complaintForm,
                  description: e.target.value,
                })
              }
            />
          </div>

          <ImageUpload
            image={complaintForm.image}
            handleImageUpload={handleImageUpload}
          />

          <LocationPicker
            lat={complaintForm.location.lat}
            lng={complaintForm.location.lng}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={(e) => handleCreateComplaint(e as any, 0)}
            disabled={loading}
            className="py-4 bg-gray-200 text-gray-700 font-bold rounded-2xl shadow-md hover:bg-gray-300 transition-all flex items-center justify-center gap-3"
          >
            {loading ? (
              "جاري المعالجة..."
            ) : (
              <>
                <FileText size={20} />
                <span>حفظ كمسودة</span>
              </>
            )}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-3"
          >
            {loading ? (
              "جاري الإرسال..."
            ) : (
              <>
                <Send size={20} />
                <span>إرسال الطلب</span>
              </>
            )}
          </button>
        </div>
      </form>
    </main>
  );
};

export default NewComplaint;
