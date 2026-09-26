import express from "express";
import { getGovernorates, getMunicipalities, getServices } from "../controllers/lookupController";

const router = express.Router();

router.get("/governorates", getGovernorates);
router.get("/municipalities", getMunicipalities);
router.get("/services", getServices);

export default router;
