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
import { dadosCadastroMobiliarios } from "../controllers/cadastros/mobiliario";
import { dadosCadastroParede } from "../controllers/cadastros/parede";
import { dadosCadastroPiso } from "../controllers/cadastros/piso";

import { dadosCadastroTeto } from "../controllers/cadastros/teto";
import { dadosCadastroRac } from "../controllers/cadastros/rac";
import { dadosCadastroIluminacao } from "../controllers/cadastros/iluminacao";
import { dadosCadastroEquipamento } from "../controllers/cadastros/equipamento";
import { dadosCadastroEdificacao } from "../controllers/cadastros/edificacao";
import { dadosCadastroTipoPgr } from "../controllers/cadastros/tipoPgr";
import { dadosCadastroVentilacao } from "../controllers/cadastros/ventilacao";
import { dadosCadastroVeiculo } from "../controllers/cadastros/veiculo";
import { gesController } from "../controllers/ges";
import { dadosCadastroTecnicaUtilizada } from "../controllers/cadastros/tecnicautilizada";
import { dadosCadastroFonteGeradora } from "../controllers/cadastros/fontegeradora";
import { dadosCadastroExposicao } from "../controllers/cadastros/exposicao";
import { dadosCadastroEpi } from "../controllers/cadastros/epi";
import { dadosCadastroMeioDePropagacao } from "../controllers/cadastros/meiodepropagacao";
import { dadosCadastroTrajetoria } from "../controllers/cadastros/trajetoria";
import { dadosCadastroMedidaDeControle } from "../controllers/cadastros/medidadecontrole";




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
router.get("/pesquisamobiliarios/:pesquisa", ensureUserAuth, pesquisaController.getDadosPesquisaMobiliarios);
router.get("/pesquisaparede/:pesquisa", ensureUserAuth, pesquisaController.getDadosPesquisaParede);
router.get("/pesquisapiso/:pesquisa", ensureUserAuth, pesquisaController.getDadosPesquisaPiso);
router.get("/pesquisafuncao/:pesquisa", ensureUserAuth, pesquisaController.getDadosPesquisaFuncao);
router.get("/pesquisacursoobrigatorio/:pesquisa", ensureUserAuth, pesquisaController.getDadosPesquisaCursoObrigatorio);
router.get("/pesquisateto/:pesquisa", ensureUserAuth, pesquisaController.getDadosPesquisaTeto);
router.get("/pesquisarac/:pesquisa", ensureUserAuth, pesquisaController.getDadosPesquisaRac);
router.get("/pesquisailuminacao/:pesquisa", ensureUserAuth, pesquisaController.getDadosPesquisaIluminacao);
router.get("/pesquisaequipamento/:pesquisa", ensureUserAuth, pesquisaController.getDadosPesquisaEquipamento);
router.get("/pesquisaedificacao/:pesquisa", ensureUserAuth, pesquisaController.getDadosPesquisaEdificacao);
router.get("/pesquisatipopgr/:pesquisa", ensureUserAuth, pesquisaController.getDadosPesquisaTipoPgr);
router.get("/pesquisaventilacao/:pesquisa", ensureUserAuth, pesquisaController.getDadosPesquisaVentilacao);
router.get("/pesquisaveiculo/:pesquisa", ensureUserAuth, pesquisaController.getDadosPesquisaVeiculo);
router.get("/pesquisatecnicautilizada/:pesquisa", ensureUserAuth, pesquisaController.getDadosPesquisaTecnicaUtilizada);
router.get("/pesquisafontegeradora/:pesquisa", ensureUserAuth, pesquisaController.getDadosPesquisaFonteGeradora);
router.get("/pesquisaexposicao/:pesquisa", ensureUserAuth, pesquisaController.getDadosPesquisaExposicao);
router.get("/pesquisaepi/:pesquisa", ensureUserAuth, pesquisaController.getDadosPesquisaEpi);
router.get("/pesquisameiodepropagacao/:pesquisa", ensureUserAuth, pesquisaController.getDadosPesquisaMeioDePropagacao);
router.get("/pesquisatrajetoria/:pesquisa", ensureUserAuth, pesquisaController.getDadosPesquisaTrajetoria);
router.get("/pesquisamedidadecontrole/:pesquisa", ensureUserAuth, pesquisaController.getDadosPesquisaMedidaDeControle);

//Trabalhador
router.post("/posttrabalhador", ensureUserAuth, dadosTrabalhador.postTrabalhador);
router.get("/gettrabalhadores", ensureUserAuth, dadosTrabalhador.getAllTrabalhadores);
router.get("/:idtrabalhador/gettrabalhador", ensureUserAuth, dadosTrabalhador.getTrabalhador);
router.put("/:idtrabalhador/edittrabalhador", ensureUserAuth, dadosTrabalhador.putTrabalhador);
router.delete("/:idtrabalhador/deletetrabalhador", ensureUserAuth, dadosTrabalhador.deleteTrabalhador);



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

    //mobiliarios
    router.post("/cadastro/postmobiliariosbrigatorio", ensureUserAuth, dadosCadastroMobiliarios.post);
    router.get("/cadastro/getallmobiliariosbrigatorio", ensureUserAuth, dadosCadastroMobiliarios.getAll);
    router.get("/:idmobiliariosbrigatorio/getmobiliariosbrigatorio", ensureUserAuth, dadosCadastroMobiliarios.get);
    router.put("/:idmobiliariosbrigatorio/editmobiliariosbrigatorio", ensureUserAuth, dadosCadastroMobiliarios.put);
    router.delete("/:idmobiliariosbrigatorio/deletemobiliariosbrigatorio", ensureUserAuth, dadosCadastroMobiliarios.delete);
     //parede
    router.post("/cadastro/postparede", ensureUserAuth, dadosCadastroParede.post);
    router.get("/cadastro/getallparede", ensureUserAuth, dadosCadastroParede.getAll);
    router.get("/:idparede/getparede", ensureUserAuth, dadosCadastroParede.get);
    router.put("/:idparede/editparede", ensureUserAuth, dadosCadastroParede.put);
    router.delete("/:idparede/deleteparede", ensureUserAuth, dadosCadastroParede.delete);
    //piso
    router.post("/cadastro/postpiso", ensureUserAuth, dadosCadastroPiso.post);
    router.get("/cadastro/getallpiso", ensureUserAuth, dadosCadastroPiso.getAll);
    router.get("/:idpiso/getpiso", ensureUserAuth, dadosCadastroPiso.get);
    router.put("/:idpiso/editpiso", ensureUserAuth, dadosCadastroPiso.put);
    router.delete("/:idpiso/deletepiso", ensureUserAuth, dadosCadastroPiso.delete);
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
    //Equipamento
    router.post("/cadastro/postequipamento", ensureUserAuth, dadosCadastroEquipamento.post);
    router.get("/cadastro/getallequipamento", ensureUserAuth, dadosCadastroEquipamento.getAll);
    router.get("/:idequipamento/getequipamento", ensureUserAuth, dadosCadastroEquipamento.get);
    router.put("/:idequipamento/editequipamento", ensureUserAuth, dadosCadastroEquipamento.put);
    router.delete("/:idequipamento/deleteequipamento", ensureUserAuth, dadosCadastroEquipamento.delete);
    //Edificação
    router.post("/cadastro/postedificacao", ensureUserAuth, dadosCadastroEdificacao.post);
    router.get("/cadastro/getalledificacao", ensureUserAuth, dadosCadastroEdificacao.getAll);
    router.get("/:idedificacao/getedificacao", ensureUserAuth, dadosCadastroEdificacao.get);
    router.put("/:idedificacao/editedificacao", ensureUserAuth, dadosCadastroEdificacao.put);
    router.delete("/:idedificacao/deleteedificacao", ensureUserAuth, dadosCadastroEdificacao.delete);
    //Tipo de Pgr
    router.post("/cadastro/posttipopgr", ensureUserAuth, dadosCadastroTipoPgr.post);
    router.get("/cadastro/getalltipopgr", ensureUserAuth, dadosCadastroTipoPgr.getAll);
    router.get("/:idtipopgr/gettipopgr", ensureUserAuth, dadosCadastroTipoPgr.get);
    router.put("/:idtipopgr/edittipopgr", ensureUserAuth, dadosCadastroTipoPgr.put);
    router.delete("/:idtipopgr/deletetipopgr", ensureUserAuth, dadosCadastroTipoPgr.delete);
    //Ventilação
    router.post("/cadastro/postventilacao", ensureUserAuth, dadosCadastroVentilacao.post);
    router.get("/cadastro/getallventilacao", ensureUserAuth, dadosCadastroVentilacao.getAll);
    router.get("/:idventilacao/getventilacao", ensureUserAuth, dadosCadastroVentilacao.get);
    router.put("/:idventilacao/editventilacao", ensureUserAuth, dadosCadastroVentilacao.put);
    router.delete("/:idventilacao/deleteventilacao", ensureUserAuth, dadosCadastroVentilacao.delete);
    //Veículo
    router.post("/cadastro/postveiculo", ensureUserAuth, dadosCadastroVeiculo.post);
    router.get("/cadastro/getallveiculo", ensureUserAuth, dadosCadastroVeiculo.getAll);
    router.get("/:idveiculo/getveiculo", ensureUserAuth, dadosCadastroVeiculo.get);
    router.put("/:idveiculo/editveiculo", ensureUserAuth, dadosCadastroVeiculo.put);
    router.delete("/:idveiculo/deleteveiculo", ensureUserAuth, dadosCadastroVeiculo.delete);
    //Técnica Utilizada
    router.post("/cadastro/posttecnicautilizada", ensureUserAuth, dadosCadastroTecnicaUtilizada.post);
    router.get("/cadastro/getalltecnicautilizada", ensureUserAuth, dadosCadastroTecnicaUtilizada.getAll);
    router.get("/:idtecnicautilizada/gettecnicautilizada", ensureUserAuth, dadosCadastroTecnicaUtilizada.get);
    router.put("/:idtecnicautilizada/edittecnicautilizada", ensureUserAuth, dadosCadastroTecnicaUtilizada.put);
    router.delete("/:idtecnicautilizada/deletetecnicautilizada", ensureUserAuth, dadosCadastroTecnicaUtilizada.delete);
    //Fonte Geradora
    router.post("/cadastro/postfontegeradora", ensureUserAuth, dadosCadastroFonteGeradora.post);
    router.get("/cadastro/getallfontegeradora", ensureUserAuth, dadosCadastroFonteGeradora.getAll);
    router.get("/:idfontegeradora/getfontegeradora", ensureUserAuth, dadosCadastroFonteGeradora.get);
    router.put("/:idfontegeradora/editfontegeradora", ensureUserAuth, dadosCadastroFonteGeradora.put);
    router.delete("/:idfontegeradora/deletefontegeradora", ensureUserAuth, dadosCadastroFonteGeradora.delete);
    //Exposição
    router.post("/cadastro/postexposicao", ensureUserAuth, dadosCadastroExposicao.post);
    router.get("/cadastro/getallexposicao", ensureUserAuth, dadosCadastroExposicao.getAll);
    router.get("/:idexposicao/getexposicao", ensureUserAuth, dadosCadastroExposicao.get);
    router.put("/:idexposicao/editexposicao", ensureUserAuth, dadosCadastroExposicao.put);
    router.delete("/:idexposicao/deleteexposicao", ensureUserAuth, dadosCadastroExposicao.delete);
    //EPI
    router.post("/cadastro/postepi", ensureUserAuth, dadosCadastroEpi.post);
    router.get("/cadastro/getallepi", ensureUserAuth, dadosCadastroEpi.getAll);
    router.get("/:idepi/getepi", ensureUserAuth, dadosCadastroEpi.get);
    router.put("/:idepi/editepi", ensureUserAuth, dadosCadastroEpi.put);
    router.delete("/:idepi/deleteepi", ensureUserAuth, dadosCadastroEpi.delete);
    //Meio de Propagação
    router.post("/cadastro/postmeiodepropagacao", ensureUserAuth, dadosCadastroMeioDePropagacao.post);
    router.get("/cadastro/getallmeiodepropagacao", ensureUserAuth, dadosCadastroMeioDePropagacao.getAll);
    router.get("/:idmeiodepropagacao/getmeiodepropagacao", ensureUserAuth, dadosCadastroMeioDePropagacao.get);
    router.put("/:idmeiodepropagacao/editmeiodepropagacao", ensureUserAuth, dadosCadastroMeioDePropagacao.put);
    router.delete("/:idmeiodepropagacao/deletemeiodepropagacao", ensureUserAuth, dadosCadastroMeioDePropagacao.delete);
    //Trajetória
    router.post("/cadastro/posttrajetoria", ensureUserAuth, dadosCadastroTrajetoria.post);
    router.get("/cadastro/getalltrajetoria", ensureUserAuth, dadosCadastroTrajetoria.getAll);
    router.get("/:idtrajetoria/gettrajetoria", ensureUserAuth, dadosCadastroTrajetoria.get);
    router.put("/:idtrajetoria/edittrajetoria", ensureUserAuth, dadosCadastroTrajetoria.put);
    router.delete("/:idtrajetoria/deletetrajetoria", ensureUserAuth, dadosCadastroTrajetoria.delete);
    //Veículo
    router.post("/cadastro/postmedidadecontrole", ensureUserAuth, dadosCadastroMedidaDeControle.post);
    router.get("/cadastro/getallmedidadecontrole", ensureUserAuth, dadosCadastroMedidaDeControle.getAll);
    router.get("/:idmedidadecontrole/getmedidadecontrole", ensureUserAuth, dadosCadastroMedidaDeControle.get);
    router.put("/:idmedidadecontrole/editmedidadecontrole", ensureUserAuth, dadosCadastroMedidaDeControle.put);
    router.delete("/:idmedidadecontrole/deletemedidadecontrole", ensureUserAuth, dadosCadastroMedidaDeControle.delete);

    
//GES
router.post("/postges", ensureUserAuth, gesController.postges);