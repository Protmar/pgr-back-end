import express from "express";
import { authController } from "../controllers/authController";
import { dadosCliente } from "../controllers/cliente/cliente";
import { empresaController } from "../controllers/empresaController";
import { pesquisaController } from "../controllers/pesquisas";

export const router = express.Router();
//Auth
router.post("/auth/login", authController.login)

//cliente
router.get("/:idempresa/getclientes", dadosCliente.getAll );
router.get("/:idempresa/:idcliente/getcliente", dadosCliente.get );
router.post("/:idempresa/postcliente", dadosCliente.post );

//empresa
router.post("/postcadastroempresa", empresaController.createNoAuth);

//Rotas de pesquisa filtradas
router.get("/:idempresa/pesquisa/:pesquisa", pesquisaController.getCnpjNome)