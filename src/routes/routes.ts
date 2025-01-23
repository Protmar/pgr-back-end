import express from "express";
import { empresaController } from "../controllers/empresaController";


export const router = express.Router();

router.post("/postcadastroempresa", empresaController.createNoAuth);