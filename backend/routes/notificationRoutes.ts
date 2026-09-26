import express from "express";
import {
  getNotifications,
  markNotificationsRead,
} from "../controllers/notificationController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.route("/").get(protect, getNotifications);
router.route("/read").put(protect, markNotificationsRead);

export default router;
