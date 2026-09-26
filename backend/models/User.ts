import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "الرجاء إدخال الاسم"],
    },
    phone: {
      type: String,
      required: [true, "الرجاء إدخال رقم الهاتف"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "الرجاء إدخال البريد الإلكتروني"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "الرجاء إدخال كلمة المرور"],
    },
    role: {
      type: Number,
      default: 3, // 1: ادمن, 2: موظف بلدية, 3: مواطن عادي
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Governorate",
    },
    municipality: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Municipality",
    },
    allowedServices: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Service",
      default: [],
    },
    allowedMunicipalities: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Municipality",
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const User: any = mongoose.model("User", userSchema);

export default User;
