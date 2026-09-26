import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Complaint from "../models/Complaint";
import Notification from "../models/Notification";
import { sendStatusUpdateEmail } from "../utils/emailService"; // تأكد أن الاسم يطابق ملف الـ utils

import Governorate from "../models/Governorate";
import Municipality from "../models/Municipality";
import Service from "../models/Service";

// @desc    Create new complaint
// @route   POST /api/complaints
// @access  Private
export const createComplaint = asyncHandler(async (req: any, res: Response) => {
  const { type, city, municipality, image, location, description } = req.body;

  // 1. جلب معرف المحافظة
  const govObj = await Governorate.findById(city);
  const govIdStr = govObj ? govObj.id : "0";
  const cityId = city;

  // 2. جلب معرف البلدية
  const munObj = await Municipality.findById(municipality);
  const munIdStr = munObj ? munObj.id : "0";
  const municipalityId = municipality;

  // 3. جلب معرف الخدمة
  const servObj = await Service.findById(type);
  const servIdStr = servObj ? servObj.id : "0";

  // 4. رقم متسلسل يبدأ من 0000
  const count = await Complaint.countDocuments();
  const sequenceStr = String(count).padStart(5, "0");

  // تكوين رقم المعاملة حسب المكونات المطلوبة
  const complaintNumber = `${govIdStr}${munIdStr}${servIdStr}${sequenceStr}`;

  const complaint = await Complaint.create({
    user: req.user._id,
    complaintNumber,
    type,
    city: cityId,
    municipality: municipalityId,
    image,
    location,
    description,
    // الافتراضي هو 1 (تم الإرسال) إلا إذا تم تحديد غير ذلك
    status: req.body.status !== undefined ? req.body.status : 1,
  });

  // --- التعديل هنا: إرسال إيميل تأكيد الاستلام الفوري ---
  // نستخدم نفس الدالة لأنها مهيأة لاستقبال الـ status وتمريره لجوجل
  if (req.user && req.user.email) {
    sendStatusUpdateEmail(complaint, req.user);
  }

  // Create notification (تنبيه داخل الموقع)
  await Notification.create({
    user: req.user._id,
    message: `تم تقديم المعاملة بنجاح برقم: ${complaintNumber}`,
    complaintId: complaint._id,
  });

  res.status(201).json(complaint);
});

// @desc    Update complaint status and add response
// @route   PUT /api/complaints/:id
// @access  Private (Admin or Employee)
export const updateComplaintStatus = asyncHandler(async (req: any, res: Response) => {
  const { status, response } = req.body;

  const complaint = await Complaint.findById(req.params.id).populate("user", "name email");

  if (complaint) {
    // Check if employee is restricted to a municipality or service
    if (req.user.role === 2) {
      const userMuns = req.user.allowedMunicipalities && req.user.allowedMunicipalities.length > 0 
        ? req.user.allowedMunicipalities.map((id: any) => id.toString()) 
        : (req.user.municipality ? [req.user.municipality.toString()] : []);
      
      if (userMuns.length > 0 && !userMuns.includes(complaint.municipality?.toString())) {
        res.status(403);
        throw new Error("غير مصرح بتعديل معاملات خارج نطاق بلديتك المسموحة");
      }

      if (req.user.allowedServices && req.user.allowedServices.length > 0 && !req.user.allowedServices.includes(complaint.type)) {
        res.status(403);
        throw new Error("غير مصرح بتعديل هذا النوع من المعاملات ضمن صلاحياتك");
      }
    }

    complaint.status = status !== undefined ? status : complaint.status;
    
    if (response) {
      complaint.response = response;
      complaint.respondedBy = req.user._id;
      complaint.respondedAt = new Date();
    }

    const updatedComplaint = await complaint.save();

    // إرسال إيميل عند تحديث الحالة (Non-blocking)
    if (updatedComplaint.user) {
      sendStatusUpdateEmail(updatedComplaint, updatedComplaint.user);
    }

    // Create notification for the user
    await Notification.create({
      user: complaint.user,
      message: `تم تحديث حالة معاملتك رقم ${complaint.complaintNumber} إلى حالة جديدة`,
      complaintId: complaint._id,
    });

    res.json(updatedComplaint);
  } else {
    res.status(404);
    throw new Error("المعاملة غير موجودة");
  }
});
// @desc    Get user complaints
// @route   GET /api/complaints
// @access  Private
export const getComplaints = asyncHandler(async (req: any, res: Response) => {
  let complaints;
  if (req.user.role === 1) {
    // Admin sees all except 'غير مرسل' (status: 0)
    complaints = await Complaint.find({ status: { $ne: 0 } })
      .sort("-createdAt")
      .populate("user", "name phone")
      .populate("city", "name")
      .populate("municipality", "name")
      .populate("type", "name");
  } else if (req.user.role === 2) {
    // Employee logic based on new permissions system
    const filter: any = { status: { $ne: 0 } };
    
    // Municipalities
    const userMuns = req.user.allowedMunicipalities && req.user.allowedMunicipalities.length > 0 
      ? req.user.allowedMunicipalities 
      : (req.user.municipality ? [req.user.municipality] : []);
      
    if (userMuns.length > 0) {
      filter.municipality = { $in: userMuns };
    }

    // Services
    if (req.user.allowedServices && req.user.allowedServices.length > 0) {
      filter.type = { $in: req.user.allowedServices };
    }

    complaints = await Complaint.find(filter)
      .sort("-createdAt")
      .populate("user", "name phone")
      .populate("city", "name")
      .populate("municipality", "name")
      .populate("type", "name");
  } else {
    // Citizen can only see their own
    complaints = await Complaint.find({ user: req.user._id })
      .sort("-createdAt")
      .populate("city", "name")
      .populate("municipality", "name")
      .populate("type", "name");
  }

  // Transform to return names instead of objects for frontend compatibility
  const transformedComplaints = complaints.map((c: any) => ({
    ...c.toObject(),
    city: c.city?.name || c.city,
    municipality: c.municipality?.name || c.municipality,
    type: c.type?.name || c.type,
  }));

  res.json(transformedComplaints);
});

// @desc    Get complaint by ID
// @route   GET /api/complaints/:id
// @access  Private
export const getComplaintById = asyncHandler(async (req: any, res: Response) => {
  const complaint = await Complaint.findById(req.params.id)
    .populate("user", "name email phone")
    .populate("city", "name")
    .populate("municipality", "name")
    .populate("type", "name");

  if (complaint) {
    if (req.user.role === 3 && complaint.user._id.toString() !== req.user._id.toString()) {
       res.status(403);
       throw new Error("غير مصرح");
    }
    if (req.user.role === 2) {
       const userMuns = req.user.allowedMunicipalities && req.user.allowedMunicipalities.length > 0 
         ? req.user.allowedMunicipalities.map((id: any) => id.toString()) 
         : (req.user.municipality ? [req.user.municipality.toString()] : []);
         
       if (userMuns.length > 0 && !userMuns.includes(complaint.municipality?._id?.toString())) {
          res.status(403);
          throw new Error("غير مصرح، المعاملة خارج نطاق البلديات المسموحة لك");
       }

       if (req.user.allowedServices && req.user.allowedServices.length > 0 && !req.user.allowedServices.includes(complaint.type?._id?.toString())) {
          res.status(403);
          throw new Error("غير مصرح، ليس لديك صلاحية عرض هذا النوع من المعاملات");
       }
    }
    if (complaint.status === 0 && req.user.role !== 3) {
       res.status(403);
       throw new Error("غير مصرح، المعاملة مسودة");
    }

    const transformedComplaint = {
      ...complaint.toObject(),
      city: (complaint.city as any)?.name || complaint.city,
      municipality: (complaint.municipality as any)?.name || complaint.municipality,
      type: (complaint.type as any)?.name || complaint.type,
    };

    res.json(transformedComplaint);
  } else {
    res.status(404);
    throw new Error("الشكوى غير موجودة");
  }
});
