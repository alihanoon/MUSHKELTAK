import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    complaintNumber: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: [true, "الرجاء إدخال نوع الشكوى"],
    },
    status: {
      type: Number,
      required: true,
      default: 1, // 0: غير مرسل, 1: تم الارسال, 2: قيد التحقق, 3: بإنتظار الموافقات, 4: تم الموافقة, 5: تم الحل
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Governorate",
      required: [true, "الرجاء إدخال المدينة (المحافظة)"],
    },
    municipality: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Municipality",
      required: [true, "الرجاء إدخال البلدية"],
    },
    image: {
      type: String,
    },
    location: {
      lat: Number,
      lng: Number,
      address: String,
    },
    description: {
      type: String,
      required: [true, "الرجاء إدخال وصف الشكوى"],
    },
    response: {
      type: String,
    },
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    respondedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Complaint = mongoose.model("Complaint", complaintSchema);

export default Complaint;
