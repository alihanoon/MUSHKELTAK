import express from "express";
import { registerUser, authUser, adminCreateUser, getUsers, updateUserPermissions, forgotPassword, resetPassword, updateUser, deleteUser } from "../controllers/userController";
import { protect, adminOnly } from "../middleware/authMiddleware";

const router = express.Router();

router.route("/").post(registerUser).get(protect, adminOnly, getUsers);
router.post("/login", authUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/admin", protect, adminOnly, adminCreateUser);
router.route("/admin/:id")
  .put(protect, adminOnly, updateUser)
  .delete(protect, adminOnly, deleteUser);
router.put("/admin/:id/permissions", protect, adminOnly, updateUserPermissions);

export default router;
