import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import asyncHandler from "express-async-handler";

export const protect = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "secret");
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        res.status(401);
        throw new Error("المستخدم غير موجود");
      }
      next();
    } catch (error) {
      res.status(401);
      throw new Error("غير مصرح، فشل التحقق من الرمز");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("غير مصرح، لا يوجد رمز");
  }
});

export const adminOnly = (req: any, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 1) {
    next();
  } else {
    res.status(401);
    throw new Error("غير مصرح، للمسؤولين فقط");
  }
};
