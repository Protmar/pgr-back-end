import express from "express";
import { authController } from "../controllers/authController";
import { dadosCliente } from "../controllers/cliente/cliente";
import { empresaController } from "../controllers/empresaController";
import { pesquisaController } from "../controllers/pesquisas";
import { dadosServicos } from "../controllers/servicos/index";
import { ensureUserAuth } from "../middleware";



export const router = express.Router();
//Auth
router.post("/auth/login", authController.login);

//cliente
router.get("/getclientes", ensureUserAuth ,dadosCliente.getAll );
router.get("/:idcliente/getcliente", ensureUserAuth, dadosCliente.get );
router.post("/postcliente", ensureUserAuth, dadosCliente.post );
router.delete("/:idcliente/deletecliente", ensureUserAuth, dadosCliente.delete);
router.put("/:idcliente/editcliente", ensureUserAuth, dadosCliente.put);

//Servicos
router.post("/postservico", ensureUserAuth, dadosServicos.post);
router.get("/:idcliente/getservicosbycliente", ensureUserAuth, dadosServicos.getServicosByCliente);
router.get("/:idservico/getservico", ensureUserAuth, dadosServicos.get);
router.put("/:idservico/editservico", ensureUserAuth, dadosServicos.put);
router.delete("/:idservico/deleteservico", ensureUserAuth, dadosServicos.delete);

//empresa
router.post("/postcadastroempresa", ensureUserAuth, empresaController.createNoAuth);

//Rotas de pesquisa filtradas
router.get("/pesquisa/:pesquisa", ensureUserAuth, pesquisaController.getCnpjNome)
router.get("/pesquisaservicos/:pesquisa", ensureUserAuth, pesquisaController.getDadosPesquisaDescDtIniDtFim)