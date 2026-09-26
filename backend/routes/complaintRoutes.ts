import express from "express";
import {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
} from "../controllers/complaintController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.route("/").post(protect, createComplaint).get(protect, getComplaints);
router.route("/:id").get(protect, getComplaintById).put(protect, updateComplaintStatus);

export default router;
