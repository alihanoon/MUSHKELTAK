import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Governorate from "../models/Governorate";
import Municipality from "../models/Municipality";
import Service from "../models/Service";

// @desc    Get all governorates
// @route   GET /api/lookups/governorates
// @access  Public
export const getGovernorates = asyncHandler(async (req: Request, res: Response) => {
  const governorates = await Governorate.find({}).sort("id");
  res.json(governorates);
});

// @desc    Get all municipalities
// @route   GET /api/lookups/municipalities
// @access  Public
export const getMunicipalities = asyncHandler(async (req: Request, res: Response) => {
  const municipalities = await Municipality.find({}).sort("id");
  res.json(municipalities);
});

// @desc    Get all services
// @route   GET /api/lookups/services
// @access  Public
export const getServices = asyncHandler(async (req: Request, res: Response) => {
  const services = await Service.find({}).sort("id");
  res.json(services);
});
