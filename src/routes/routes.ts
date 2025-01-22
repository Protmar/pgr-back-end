import express from "express";
import { empresaTeste } from "../controllers/empresaTeste";

export const router = express.Router();

router.get("/:client/getdata", empresaTeste.get);
