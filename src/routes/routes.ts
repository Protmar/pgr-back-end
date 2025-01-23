import express from "express";
import { empresaTeste } from "../controllers/empresaTeste";
import { dadosCliente } from "../controllers/cliente/cliente";

export const router = express.Router();


//cliente
router.get("/:idcliente/getcliente", dadosCliente.get );
router.post("/postcliente", dadosCliente.post );