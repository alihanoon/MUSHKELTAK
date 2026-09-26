import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Notification from "../models/Notification";

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
export const getNotifications = asyncHandler(async (req: any, res: Response) => {
  const notifications = await Notification.find({ user: req.user._id })
    .sort("-createdAt")
    .limit(20);
  res.json(notifications);
});

// @desc    Mark notifications as read
// @route   PUT /api/notifications/read
// @access  Private
export const markNotificationsRead = asyncHandler(async (req: any, res: Response) => {
  await Notification.updateMany(
    { user: req.user._id, read: false },
    { $set: { read: true } }
  );
  res.json({ message: "Notifications marked as read" });
});
