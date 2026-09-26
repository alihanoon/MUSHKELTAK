import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../models/User";
import { validatePassword } from "../utils/passwordValidator";
import Governorate from "../models/Governorate";
import Municipality from "../models/Municipality";
import Service from "../models/Service";
import PasswordReset from "../models/PasswordReset";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { encrypt, decrypt } from "../utils/securityUtils";
import { sendWelcomeEmail, sendOTPEmail } from "../utils/emailService";

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "secret", {
    expiresIn: "30d",
  });
};

// @desc    Register a new user (Citizen only)
// @route   POST /api/users
// @access  Public
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, phone } = req.body;

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    res.status(400);
    throw new Error(passwordValidation.message);
  }

  const userExists = await User.findOne({ $or: [{ email }, { phone }] });

  if (userExists) {
    res.status(400);
    throw new Error("المستخدم موجود مسبقاً");
  }

  const user = await User.create({
    name,
    email,
    password: encrypt(password),
    phone,
    role: 3, // Always Citizen for public registration
  });

  if (user) {
    // Send welcome email (non-blocking)
    sendWelcomeEmail(user);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id.toString()),
    });
  } else {
    res.status(400);
    throw new Error("بيانات المستخدم غير صالحة");
  }
});

// @desc    Admin create a new user with role
// @route   POST /api/users/admin
// @access  Private/Admin
export const adminCreateUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, phone, role, city, municipality } = req.body;

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    res.status(400);
    throw new Error(passwordValidation.message);
  }

  const userExists = await User.findOne({ $or: [{ email }, { phone }] });

  if (userExists) {
    res.status(400);
    throw new Error("المستخدم موجود مسبقاً");
  }

  let allowedServices: any[] = [];
  let allowedMunicipalities: any[] = [];

  if (role === 2) {
    if (municipality) {
      allowedMunicipalities.push(municipality);
    }
    const services = await Service.find({}, '_id');
    allowedServices = services.map(s => s._id);
  }

  const user = await User.create({
    name,
    email,
    password: encrypt(password),
    phone,
    role: role || 3,
    city: role === 2 && city ? city : undefined,
    municipality: role === 2 && municipality ? municipality : undefined,
    allowedServices,
    allowedMunicipalities
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      city: user.city,
      municipality: user.municipality,
    });
  } else {
    res.status(400);
    throw new Error("بيانات المستخدم غير صالحة");
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.find({})
    .populate("city", "name")
    .populate("municipality", "name");
  
  const decryptedUsers = users.map((u: any) => {
    let rawPassword = "";
    if (u.password && !u.password.startsWith("$2a$") && !u.password.startsWith("$2b$")) {
      rawPassword = decrypt(u.password);
    }
    return {
      _id: u._id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role,
      city: u.city?._id || u.city,
      municipality: u.municipality?._id || u.municipality,
      allowedServices: u.allowedServices || [],
      allowedMunicipalities: u.allowedMunicipalities || [],
      password: rawPassword,
    };
  });
  res.json(decryptedUsers);
});

// @desc    Update user
// @route   PUT /api/users/admin/:id
// @access  Private/Admin
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const user: any = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.role = req.body.role || user.role;
    
    if (req.body.city !== undefined) {
      user.city = req.body.city ? req.body.city : undefined;
    }
    if (req.body.municipality !== undefined) {
      user.municipality = req.body.municipality ? req.body.municipality : undefined;
    }
    if (req.body.password) {
      const passwordValidation = validatePassword(req.body.password);
      if (!passwordValidation.isValid) {
        res.status(400);
        throw new Error(passwordValidation.message);
      }
      user.password = encrypt(req.body.password);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      city: updatedUser.city,
      municipality: updatedUser.municipality,
    });
  } else {
    res.status(404);
    throw new Error("المستخدم غير موجود");
  }
});

// @desc    Delete user
// @route   DELETE /api/users/admin/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await User.deleteOne({ _id: user._id });
    res.json({ message: "تم حذف المستخدم بنجاح" });
  } else {
    res.status(404);
    throw new Error("المستخدم غير موجود");
  }
});

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
export const authUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user: any = await User.findOne({ email }).populate("city", "name").populate("municipality", "name");

  if (!user) {
    res.status(401);
    throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
  }

  let isMatch = false;

  if (user.password.startsWith("$2a$") || user.password.startsWith("$2b$")) {
    isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      user.password = encrypt(password);
      await user.save();
    }
  } else {
    const decryptedPass = decrypt(user.password);
    if (decryptedPass === password) {
      isMatch = true;
    } else if (user.password === password) {
      isMatch = true;
      user.password = encrypt(password);
      await user.save();
    }
  }

  if (isMatch) {
    // Clear any existing OTP since the user remembered their password
    await PasswordReset.deleteOne({ email: user.email });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      city: user.city?.name || user.city,
      municipality: user.municipality?.name || user.municipality,
      token: generateToken(user._id.toString()),
    });
  } else {
    res.status(401);
    throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
  }
});

// @desc    Update user permissions
// @route   PUT /api/users/admin/:id/permissions
// @access  Private/Admin
export const updateUserPermissions = asyncHandler(async (req: Request, res: Response) => {
  const user: any = await User.findById(req.params.id);

  if (user) {
    if (req.body.allowedServices !== undefined) {
      user.allowedServices = req.body.allowedServices;
    }
    if (req.body.allowedMunicipalities !== undefined) {
      user.allowedMunicipalities = req.body.allowedMunicipalities;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      allowedServices: updatedUser.allowedServices,
      allowedMunicipalities: updatedUser.allowedMunicipalities,
    });
  } else {
    res.status(404);
    throw new Error("المستخدم غير موجود");
  }
});

// @desc    Forgot Password - Generate and send OTP
// @route   POST /api/users/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  const user: any = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("لا يوجد حساب مرتبط بهذا البريد الإلكتروني");
  }

  // Only allow citizens (role === 3) to use the forgot password flow
  if (user.role !== 3) {
    res.status(403);
    throw new Error("يرجى التواصل مع مسؤول النظام لإعادة ضبط كلمة السر الخاصة بك.");
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Hash the OTP using encrypt function and store in PasswordReset model
  const hashedOTP = encrypt(otp);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

  await PasswordReset.findOneAndUpdate(
    { email },
    { otp: hashedOTP, expiresAt },
    { upsert: true, new: true }
  );

  // Send OTP via email
  await sendOTPEmail(user, otp);

  res.status(200).json({ message: "تم إرسال الايميل، يرجى تفقد الوارد" });
});

// @desc    Reset Password using OTP
// @route   POST /api/users/reset-password
// @access  Public
export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp, newPassword } = req.body;

  const user: any = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("المستخدم غير موجود");
  }

  const resetRecord: any = await PasswordReset.findOne({ email });

  if (!resetRecord) {
    res.status(400);
    throw new Error("بيانات غير صالحة أو لم يتم طلب إعادة تعيين كلمة المرور");
  }

  // Check if OTP is expired
  if (resetRecord.expiresAt < new Date()) {
    res.status(400);
    throw new Error("انتهت صلاحية رمز التحقق");
  }

  // Compare decrypted OTP
  const decryptedOTP = decrypt(resetRecord.otp);
  if (decryptedOTP !== otp) {
    res.status(400);
    throw new Error("رمز التحقق غير صحيح");
  }

  const passwordValidation = validatePassword(newPassword);
  if (!passwordValidation.isValid) {
    res.status(400);
    throw new Error(passwordValidation.message);
  }

  // Success: Update password and clear OTP
  user.password = encrypt(newPassword);
  await user.save();
  await PasswordReset.deleteOne({ email });

  res.status(200).json({ message: "تم تغيير كلمة المرور بنجاح" });
});
