export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: number; // 1: ادمن, 2: موظف بلدية, 3: مواطن عادي
  token: string;
  password?: string;
  city?: string;
  municipality?: string;
  allowedServices?: string[];
  allowedMunicipalities?: string[];
}

export interface Complaint {
  _id: string;
  complaintNumber: string;
  type: string;
  status: number;
  city: string;
  municipality: string;
  image?: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  description: string;
  response?: string;
  respondedBy?: string | User;
  respondedAt?: string;
  createdAt: string;
  user?: User;
}

export interface Notification {
  _id: string;
  message: string;
  read: boolean;
  type?: string;
  complaintId?: string;
  createdAt: string;
}

export const STATUS_MAP: Record<number, { label: string; color: string }> = {
  0: { label: "غير مرسل", color: "bg-gray-100 text-gray-800" },
  1: { label: "تم الارسال", color: "bg-emerald-100 text-emerald-800" },
  2: { label: "قيد التحقق", color: "bg-blue-100 text-blue-800" },
  3: { label: "بإنتظار الموافقات", color: "bg-yellow-100 text-yellow-800" },
  4: { label: "تم الموافقة", color: "bg-green-100 text-green-800" },
  5: { label: "تم الرفض", color: "bg-red-100 text-red-800" },
};
