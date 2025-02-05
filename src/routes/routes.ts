import express from "express";
import { authController } from "../controllers/authController";
import { dadosCliente } from "../controllers/cliente/cliente";
import { empresaController } from "../controllers/empresaController";
import { pesquisaController } from "../controllers/pesquisas";
import { dadosServicos } from "../controllers/servicos/index";
import { ensureUserAuth } from "../middleware";
import { dadosCadastroGerencia } from "../controllers/cadastros/gerencia";
import { dadosCadastroCargo } from "../controllers/cadastros/cargo";
import { dadosCadastrosetor } from "../controllers/cadastros/setor";
import { dadosTrabalhador } from "../controllers/trabalhador";
import { dadosCadastroFuncao } from "../controllers/cadastros/funcao";
import { dadosCadastroCursoObrigatorio } from "../controllers/cadastros/cursoobrigatorio";
import { dadosCadastroTeto } from "../controllers/cadastros/teto";
import { dadosCadastroRac } from "../controllers/cadastros/rac";
import { dadosCadastroIluminacao } from "../controllers/cadastros/iluminacao";
import { dadosCadastroEquipamento } from "../controllers/cadastros/equipamento";




export const router = express.Router();
//Auth
router.post("/auth/login", authController.login)
router.post("/auth/forgotPassword", authController.forgotPassword)
router.post("/auth/resetPassword/:token", authController.resetPassword)

//cliente
router.get("/getclientes", ensureUserAuth, dadosCliente.getAll);
router.get("/:idcliente/getcliente", ensureUserAuth, dadosCliente.get);
router.post("/postcliente", ensureUserAuth, dadosCliente.post);
router.delete("/:idcliente/deletecliente", ensureUserAuth, dadosCliente.delete);
router.put("/:idcliente/editcliente", ensureUserAuth, dadosCliente.put);

//Servicos
router.post("/postservico", ensureUserAuth, dadosServicos.post);
router.get("/:idcliente/getservicosbycliente", ensureUserAuth, dadosServicos.getServicosByCliente);
router.get("/:idservico/getservico", ensureUserAuth, dadosServicos.get);
router.put("/:idservico/editservico", ensureUserAuth, dadosServicos.put);
router.delete("/:idservico/deleteservico", ensureUserAuth, dadosServicos.delete);

//empresa
router.post("/postcadastroempresa", empresaController.createNoAuth);

//Rotas de pesquisa filtradas
router.get("/pesquisa/:pesquisa", ensureUserAuth, pesquisaController.getCnpjNome);
router.get("/pesquisaservicos/:pesquisa", ensureUserAuth, pesquisaController.getDadosPesquisaDescDtIniDtFim);
router.get("/pesquisagerencia/:pesquisa", ensureUserAuth, pesquisaController.getDadosPesquisaGerencia);
router.get("/pesquisacargo/:pesquisa", ensureUserAuth, pesquisaController.getDadosPesquisaCargo);
router.get("/pesquisasetor/:pesquisa", ensureUserAuth, pesquisaController.getDadosPesquisaSetor);
router.get("/pesquisatrabalhadores/:pesquisa", ensureUserAuth, pesquisaController.getDadosPesquisaTrabalhador);
router.get("/pesquisafuncao/:pesquisa", ensureUserAuth, pesquisaController.getDadosPesquisaFuncao);
router.get("/pesquisacursoobrigatorio/:pesquisa", ensureUserAuth, pesquisaController.getDadosPesquisaCursoObrigatorio);
router.get("/pesquisateto/:pesquisa", ensureUserAuth, pesquisaController.getDadosPesquisaTeto);
router.get("/pesquisarac/:pesquisa", ensureUserAuth, pesquisaController.getDadosPesquisaRac);
router.get("/pesquisailuminacao/:pesquisa", ensureUserAuth, pesquisaController.getDadosPesquisaIluminacao);
router.get("/pesquisaequipamento/:pesquisa", ensureUserAuth, pesquisaController.getDadosPesquisaEquipamento);

//Cadastros
    //Gerencia
    router.post("/cadastro/postgerencia", ensureUserAuth, dadosCadastroGerencia.post);
    router.get("/cadastro/getallgerencia", ensureUserAuth, dadosCadastroGerencia.getAll);
    router.get("/:idgerencia/getgerencia", ensureUserAuth, dadosCadastroGerencia.get);
    router.put("/:idgerencia/editgerencia", ensureUserAuth, dadosCadastroGerencia.put);
    router.delete("/:idgerencia/deletegerencia", ensureUserAuth, dadosCadastroGerencia.delete);
    //Cargo
    router.post("/cadastro/postcargo", ensureUserAuth, dadosCadastroCargo.post);
    router.get("/cadastro/getallcargo", ensureUserAuth, dadosCadastroCargo.getAll);
    router.get("/:idcargo/getcargo", ensureUserAuth, dadosCadastroCargo.get);
    router.put("/:idcargo/editcargo", ensureUserAuth, dadosCadastroCargo.put);
    router.delete("/:idcargo/deletecargo", ensureUserAuth, dadosCadastroCargo.delete);
    //Setor
    router.post("/cadastro/postsetor", ensureUserAuth, dadosCadastrosetor.post);
    router.get("/cadastro/getallsetor", ensureUserAuth, dadosCadastrosetor.getAll);
    router.get("/:idsetor/getsetor", ensureUserAuth, dadosCadastrosetor.get);
    router.put("/:idsetor/editsetor", ensureUserAuth, dadosCadastrosetor.put);
    router.delete("/:idsetor/deletesetor", ensureUserAuth, dadosCadastrosetor.delete);
    //Funcao
    router.post("/cadastro/postfuncao", ensureUserAuth, dadosCadastroFuncao.post);
    router.get("/cadastro/getallfuncao", ensureUserAuth, dadosCadastroFuncao.getAll);
    router.get("/:idfuncao/getfuncao", ensureUserAuth, dadosCadastroFuncao.get);
    router.put("/:idfuncao/editfuncao", ensureUserAuth, dadosCadastroFuncao.put);
    router.delete("/:idfuncao/deletefuncao", ensureUserAuth, dadosCadastroFuncao.delete);
    //Curso Obrigatório
    router.post("/cadastro/postcursoobrigatorio", ensureUserAuth, dadosCadastroCursoObrigatorio.post);
    router.get("/cadastro/getallcursoobrigatorio", ensureUserAuth, dadosCadastroCursoObrigatorio.getAll);
    router.get("/:idcursoobrigatorio/getcursoobrigatorio", ensureUserAuth, dadosCadastroCursoObrigatorio.get);
    router.put("/:idcursoobrigatorio/editcursoobrigatorio", ensureUserAuth, dadosCadastroCursoObrigatorio.put);
    router.delete("/:idcursoobrigatorio/deletecursoobrigatorio", ensureUserAuth, dadosCadastroCursoObrigatorio.delete);
    //Teto
    router.post("/cadastro/postteto", ensureUserAuth, dadosCadastroTeto.post);
    router.get("/cadastro/getallteto", ensureUserAuth, dadosCadastroTeto.getAll);
    router.get("/:idteto/getteto", ensureUserAuth, dadosCadastroTeto.get);
    router.put("/:idteto/editteto", ensureUserAuth, dadosCadastroTeto.put);
    router.delete("/:idteto/deleteteto", ensureUserAuth, dadosCadastroTeto.delete);
    //Rac
    router.post("/cadastro/postrac", ensureUserAuth, dadosCadastroRac.post);
    router.get("/cadastro/getallrac", ensureUserAuth, dadosCadastroRac.getAll);
    router.get("/:idrac/getrac", ensureUserAuth, dadosCadastroRac.get);
    router.put("/:idrac/editrac", ensureUserAuth, dadosCadastroRac.put);
    router.delete("/:idrac/deleterac", ensureUserAuth, dadosCadastroRac.delete);
    //Iluminação
    router.post("/cadastro/postiluminacao", ensureUserAuth, dadosCadastroIluminacao.post);
    router.get("/cadastro/getalliluminacao", ensureUserAuth, dadosCadastroIluminacao.getAll);
    router.get("/:idiluminacao/getiluminacao", ensureUserAuth, dadosCadastroIluminacao.get);
    router.put("/:idiluminacao/editiluminacao", ensureUserAuth, dadosCadastroIluminacao.put);
    router.delete("/:idiluminacao/deleteiluminacao", ensureUserAuth, dadosCadastroIluminacao.delete);
    //Iluminação
    router.post("/cadastro/postequipamento", ensureUserAuth, dadosCadastroEquipamento.post);
    router.get("/cadastro/getallequipamento", ensureUserAuth, dadosCadastroEquipamento.getAll);
    router.get("/:idequipamento/getequipamento", ensureUserAuth, dadosCadastroEquipamento.get);
    router.put("/:idequipamento/editequipamento", ensureUserAuth, dadosCadastroEquipamento.put);
    router.delete("/:idequipamento/deleteequipamento", ensureUserAuth, dadosCadastroEquipamento.delete);

//Trabalhador
router.post("/posttrabalhador", ensureUserAuth, dadosTrabalhador.postTrabalhador);
router.get("/gettrabalhadores", ensureUserAuth, dadosTrabalhador.getAllTrabalhadores);
router.get("/:idtrabalhador/gettrabalhador", ensureUserAuth, dadosTrabalhador.getTrabalhador);
router.put("/:idtrabalhador/edittrabalhador", ensureUserAuth, dadosTrabalhador.putTrabalhador);
router.delete("/:idtrabalhador/deletetrabalhador", ensureUserAuth, dadosTrabalhador.deleteTrabalhador);