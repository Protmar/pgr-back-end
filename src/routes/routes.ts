import express from "express";
import { dadosCliente } from "../controllers/cliente/cliente";
import { empresaController } from "../controllers/empresaController";
import { pesquisaController } from "../controllers/pesquisas";

export const router = express.Router();


//cliente
router.get("/:idempresa/getclientes", dadosCliente.getAll );
router.get("/:idempresa/:idcliente/getcliente", dadosCliente.get );
router.post("/:idempresa/postcliente", dadosCliente.post );
router.delete("/:idempresa/:idcliente/deletecliente", dadosCliente.delete);

//empresa
router.post("/postcadastroempresa", empresaController.createNoAuth);

//Rotas de pesquisa filtradas
router.get("/:idempresa/pesquisa/:pesquisa", pesquisaController.getCnpjNome)