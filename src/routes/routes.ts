import express from "express";
import multer from "multer";
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
import { dadosCadastroFatoresRisco } from "../controllers/cadastros/fatoresrisco";
import { s3Controller } from "../controllers/aws/s3";
import { dadosCadastroAdministrativaExistente } from "../controllers/cadastros/medidacontroleadministrativaexistente";
import { dadosCadastroColetivaExistente } from "../controllers/cadastros/medidacontrolecoletivaexistente";
import { dadosCadastroIndividualExistente } from "../controllers/cadastros/medidacontroleindividualexistente";
import { dadosRisco, medidaAdministrativaController, medidaColetivaController, medidaIndividualController } from "../controllers/ges/risco";
import { dadosCadastroColetivaNecessaria } from "../controllers/cadastros/medidacontrolecoletivanecessaria";
import { dadosCadastroAdministrativaNecessaria } from "../controllers/cadastros/medidacontroleadministrativanecessaria";
import { dadosCadastroIndividualNecessaria } from "../controllers/cadastros/medidacontroleindividualnecessaria";
import { dadosCopias } from "../controllers/copias";
import { dadosMatrizPadrao } from "../controllers/configuracoes/empresa/matriz/matrizPadrao";
import { pgrtrReportController } from "../controllers/pdfs/pgrtrController";
import { pgrReportController } from "../controllers/pdfs/pgrController";
import { responsavelTecnicoController } from "../controllers/responsavelTecnico";
import { ltcatReportController } from "../controllers/pdfs/ltcatController";

import { dadosMatrizServico } from "../controllers/cadastros/matriz";
import { dadosCadastroEstrategiaAmostragem } from "../controllers/cadastros/estrategiaamostragem";
import { dadosPlanoAcao, medidaAdministrativaPlanoAcaoController, medidaColetivaPlanoAcaoController, medidaIndividualPlanoAcaoController } from "../controllers/ges/risco/planoacao";
import { dadosCadastroExigenciaAtividade } from "../controllers/cadastros/exigenciaatividade";
import { docBasePgrReportController } from "../controllers/pdfs/docBasePGR";
import { dadosEstatisticos } from "../controllers/servicos/dadosEstatisticos";
import { middlewareCanEditAndCreate } from "../middleware/middlewareCanEditAndCreate";




export const router = express.Router();
//Auth
router.post("/auth/login", authController.login)
router.post("/auth/forgotPassword", authController.forgotPassword)
router.post("/auth/resetPassword/:token", authController.resetPassword)

//cliente
router.get("/getclientes", ensureUserAuth, dadosCliente.getAll);
router.get("/:idcliente/getcliente", ensureUserAuth, dadosCliente.get);
router.post("/postcliente", ensureUserAuth, middlewareCanEditAndCreate, dadosCliente.post);
router.delete("/:idcliente/deletecliente", ensureUserAuth, dadosCliente.delete);
router.put("/:idcliente/editcliente", ensureUserAuth, dadosCliente.put);
router.post("/selecionarcliente", ensureUserAuth, dadosCliente.selecionarCliente);
router.get("/getonecliente", ensureUserAuth, dadosCliente.getOneCliente);
router.post("/postclientelogo", ensureUserAuth, middlewareCanEditAndCreate, dadosCliente.uploadLogo);

//Usuários
router.get("/configuracoes/usuarios/getcompanyuser", ensureUserAuth, authController.getCompanyUser);
router.get("/configuracoes/usuarios/getallusersbyempresa", ensureUserAuth,  authController.getAllUsersByEmpresa);
router.post("/configuracoes/usuarios/postuser", ensureUserAuth, middlewareCanEditAndCreate, authController.registerUserByEmpresa);
router.delete("/configuracoes/usuarios/deleteuser/:id", ensureUserAuth, authController.deleteUser);
router.get("/configuracoes/usuarios/getuserlogado", ensureUserAuth, authController.getUserLogado);

//Servicos
router.post("/postservico", ensureUserAuth, middlewareCanEditAndCreate, dadosServicos.post);
router.get("/getservicosbycliente", ensureUserAuth, dadosServicos.getServicosByCliente);
router.get("/:idservico/getservico", ensureUserAuth, dadosServicos.get);
router.put("/:idservico/editservico", ensureUserAuth, dadosServicos.put);
router.delete("/:idservico/deleteservico", ensureUserAuth, dadosServicos.delete);
router.post("/selecionarservico", ensureUserAuth, dadosServicos.selecionarServico);
router.get("/getservicosbycliente/:idcliente", ensureUserAuth, dadosServicos.getServicosByClienteId);
router.get("/getoneservico", ensureUserAuth, dadosServicos.getOneServico);

//Dados Estatisticos
router.post("/postdadoestatistico", ensureUserAuth, middlewareCanEditAndCreate, dadosEstatisticos.post);
router.get("/:servicoid/getdadoestatisticos", ensureUserAuth, dadosEstatisticos.getAll);
router.delete("/:dadoestatisticoid/deletedadoestatistico", ensureUserAuth, dadosEstatisticos.delete);

//empresa
router.post("/postcadastroempresa", empresaController.createNoAuth);
router.get("/getoneempresa", ensureUserAuth, empresaController.getOne);
router.put("/updateempresa", ensureUserAuth, empresaController.put);

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
router.get("/pesquisafatoresrisco/:pesquisa", ensureUserAuth, pesquisaController.getDadosPesquisaFatoresRisco);
router.get("/pesquisaadministrativaexistente/:pesquisa", ensureUserAuth, pesquisaController.getDadosPesquisaDescMedidaControleAdministrativaExistenteService);
router.get("/pesquisacoletivaexistente/:pesquisa", ensureUserAuth, pesquisaController.getDadosPesquisaDescMedidaControleColetivaExistenteService);
router.get("/pesquisaindividualexistente/:pesquisa", ensureUserAuth, pesquisaController.getDadosPesquisaDescMedidaControleIndividualExistenteService);
router.get("/pesquisaadministrativanecessaria/:pesquisa", ensureUserAuth, pesquisaController.getDadosPesquisaDescMedidaControleAdministrativaNecessariaService);
router.get("/pesquisacoletivanecessaria/:pesquisa", ensureUserAuth, pesquisaController.getDadosPesquisaDescMedidaControleColetivaNecessariaService);
router.get("/pesquisaindividualnecessaria/:pesquisa", ensureUserAuth, pesquisaController.getDadosPesquisaDescMedidaControleIndividualNecessariaService);
router.get("/pesquisaresponsaveistecnicos/:pesquisa", ensureUserAuth, pesquisaController.getDadosPesquisaResponsaveisTecnicos);
router.get("/pesquisarges/:pesquisa", ensureUserAuth, pesquisaController.getDadosPesquisaGES);

//Trabalhador
router.post("/posttrabalhador", ensureUserAuth, middlewareCanEditAndCreate, dadosTrabalhador.postTrabalhador);
router.get("/gettrabalhadores", ensureUserAuth, dadosTrabalhador.getAllTrabalhadores);
router.get("/:idtrabalhador/gettrabalhador", ensureUserAuth, dadosTrabalhador.getTrabalhador);
router.put("/:idtrabalhador/edittrabalhador", ensureUserAuth, dadosTrabalhador.putTrabalhador);
router.delete("/:idtrabalhador/deletetrabalhador", ensureUserAuth, dadosTrabalhador.deleteTrabalhador);

router.post("/posttrabalhadorexcel", ensureUserAuth, middlewareCanEditAndCreate, dadosTrabalhador.uploadExcel);



//Cadastros
    //Gerencia
    router.post("/cadastro/postgerencia", ensureUserAuth, middlewareCanEditAndCreate, dadosCadastroGerencia.post);
    router.get("/cadastro/getallgerencia", ensureUserAuth, dadosCadastroGerencia.getAll);
    router.get("/:idgerencia/getgerencia", ensureUserAuth, dadosCadastroGerencia.get);
    router.put("/:idgerencia/editgerencia", ensureUserAuth, dadosCadastroGerencia.put);
    router.delete("/:idgerencia/deletegerencia", ensureUserAuth, dadosCadastroGerencia.delete);
    //Cargo
    router.post("/cadastro/postcargo", ensureUserAuth, middlewareCanEditAndCreate, dadosCadastroCargo.post);
    router.get("/cadastro/getallcargo", ensureUserAuth, dadosCadastroCargo.getAll);
    router.get("/:idcargo/getcargo", ensureUserAuth, dadosCadastroCargo.get);
    router.put("/:idcargo/editcargo", ensureUserAuth, dadosCadastroCargo.put);
    router.delete("/:idcargo/deletecargo", ensureUserAuth, dadosCadastroCargo.delete);
    //Setor
    router.post("/cadastro/postsetor", ensureUserAuth, middlewareCanEditAndCreate, dadosCadastrosetor.post);
    router.get("/cadastro/getallsetor", ensureUserAuth, dadosCadastrosetor.getAll);
    router.get("/:idsetor/getsetor", ensureUserAuth, dadosCadastrosetor.get);
    router.put("/:idsetor/editsetor", ensureUserAuth, dadosCadastrosetor.put);
    router.delete("/:idsetor/deletesetor", ensureUserAuth, dadosCadastrosetor.delete);
    //Funcao
    router.post("/cadastro/postfuncao", ensureUserAuth, middlewareCanEditAndCreate, dadosCadastroFuncao.post);
    router.get("/cadastro/getallfuncao", ensureUserAuth, dadosCadastroFuncao.getAll);
    router.get("/:idfuncao/getfuncao", ensureUserAuth, dadosCadastroFuncao.get);
    router.put("/:idfuncao/editfuncao", ensureUserAuth, dadosCadastroFuncao.put);
    router.delete("/:idfuncao/deletefuncao", ensureUserAuth, dadosCadastroFuncao.delete);
    //Curso Obrigatório
    router.post("/cadastro/postcursoobrigatorio", ensureUserAuth, middlewareCanEditAndCreate, dadosCadastroCursoObrigatorio.post);
    router.get("/cadastro/getallcursoobrigatorio", ensureUserAuth, dadosCadastroCursoObrigatorio.getAll);
    router.get("/:idcursoobrigatorio/getcursoobrigatorio", ensureUserAuth, dadosCadastroCursoObrigatorio.get);
    router.put("/:idcursoobrigatorio/editcursoobrigatorio", ensureUserAuth, dadosCadastroCursoObrigatorio.put);
    router.delete("/:idcursoobrigatorio/deletecursoobrigatorio", ensureUserAuth, dadosCadastroCursoObrigatorio.delete);

    //mobiliarios
    router.post("/cadastro/postmobiliariosbrigatorio", ensureUserAuth, middlewareCanEditAndCreate, dadosCadastroMobiliarios.post);
    router.get("/cadastro/getallmobiliariosbrigatorio", ensureUserAuth, dadosCadastroMobiliarios.getAll);
    router.get("/:idmobiliariosbrigatorio/getmobiliariosbrigatorio", ensureUserAuth, dadosCadastroMobiliarios.get);
    router.put("/:idmobiliariosbrigatorio/editmobiliariosbrigatorio", ensureUserAuth, dadosCadastroMobiliarios.put);
    router.delete("/:idmobiliariosbrigatorio/deletemobiliariosbrigatorio", ensureUserAuth, dadosCadastroMobiliarios.delete);
     //parede
    router.post("/cadastro/postparede", ensureUserAuth, middlewareCanEditAndCreate, dadosCadastroParede.post);
    router.get("/cadastro/getallparede", ensureUserAuth, dadosCadastroParede.getAll);
    router.get("/:idparede/getparede", ensureUserAuth, dadosCadastroParede.get);
    router.put("/:idparede/editparede", ensureUserAuth, dadosCadastroParede.put);
    router.delete("/:idparede/deleteparede", ensureUserAuth, dadosCadastroParede.delete);
    //piso
    router.post("/cadastro/postpiso", ensureUserAuth, middlewareCanEditAndCreate, dadosCadastroPiso.post);
    router.get("/cadastro/getallpiso", ensureUserAuth, dadosCadastroPiso.getAll);
    router.get("/:idpiso/getpiso", ensureUserAuth, dadosCadastroPiso.get);
    router.put("/:idpiso/editpiso", ensureUserAuth, dadosCadastroPiso.put);
    router.delete("/:idpiso/deletepiso", ensureUserAuth, dadosCadastroPiso.delete);
    //Teto
    router.post("/cadastro/postteto", ensureUserAuth, middlewareCanEditAndCreate, dadosCadastroTeto.post);
    router.get("/cadastro/getallteto", ensureUserAuth, dadosCadastroTeto.getAll);
    router.get("/:idteto/getteto", ensureUserAuth, dadosCadastroTeto.get);
    router.put("/:idteto/editteto", ensureUserAuth, dadosCadastroTeto.put);
    router.delete("/:idteto/deleteteto", ensureUserAuth, dadosCadastroTeto.delete);
    //Rac
    router.post("/cadastro/postrac", ensureUserAuth, middlewareCanEditAndCreate, dadosCadastroRac.post);
    router.get("/cadastro/getallrac", ensureUserAuth, dadosCadastroRac.getAll);
    router.get("/:idrac/getrac", ensureUserAuth, dadosCadastroRac.get);
    router.put("/:idrac/editrac", ensureUserAuth, dadosCadastroRac.put);
    router.delete("/:idrac/deleterac", ensureUserAuth, dadosCadastroRac.delete);
    //Iluminação
    router.post("/cadastro/postiluminacao", ensureUserAuth, middlewareCanEditAndCreate, dadosCadastroIluminacao.post);
    router.get("/cadastro/getalliluminacao", ensureUserAuth, dadosCadastroIluminacao.getAll);
    router.get("/:idiluminacao/getiluminacao", ensureUserAuth, dadosCadastroIluminacao.get);
    router.put("/:idiluminacao/editiluminacao", ensureUserAuth, dadosCadastroIluminacao.put);
    router.delete("/:idiluminacao/deleteiluminacao", ensureUserAuth, dadosCadastroIluminacao.delete);
    //Equipamento
    router.post("/cadastro/postequipamento", ensureUserAuth, middlewareCanEditAndCreate, dadosCadastroEquipamento.post);
    router.get("/cadastro/getallequipamento", ensureUserAuth, dadosCadastroEquipamento.getAll);
    router.get("/:idequipamento/getequipamento", ensureUserAuth, dadosCadastroEquipamento.get);
    router.put("/:idequipamento/editequipamento", ensureUserAuth, dadosCadastroEquipamento.put);
    router.delete("/:idequipamento/deleteequipamento", ensureUserAuth, dadosCadastroEquipamento.delete);
    //Exigencia da atividade
    router.post("/cadastro/postexigenciaatividade", ensureUserAuth, middlewareCanEditAndCreate, dadosCadastroExigenciaAtividade.post);
    router.get("/cadastro/getallexigenciaatividade", ensureUserAuth, dadosCadastroExigenciaAtividade.getAll);
    router.get("/:idexigenciaatividade/getexigenciaatividade", ensureUserAuth, dadosCadastroExigenciaAtividade.get);
    router.put("/:idexigenciaatividade/editexigenciaatividade", ensureUserAuth, dadosCadastroExigenciaAtividade.put);
    router.delete("/:idexigenciaatividade/deleteexigenciaatividade", ensureUserAuth, dadosCadastroExigenciaAtividade.delete);
    //Edificação
    router.post("/cadastro/postedificacao", ensureUserAuth, middlewareCanEditAndCreate, dadosCadastroEdificacao.post);
    router.get("/cadastro/getalledificacao", ensureUserAuth, dadosCadastroEdificacao.getAll);
    router.get("/:idedificacao/getedificacao", ensureUserAuth, dadosCadastroEdificacao.get);
    router.put("/:idedificacao/editedificacao", ensureUserAuth, dadosCadastroEdificacao.put);
    router.delete("/:idedificacao/deleteedificacao", ensureUserAuth, dadosCadastroEdificacao.delete);
    //Tipo de Pgr
    router.post("/cadastro/posttipopgr", ensureUserAuth, middlewareCanEditAndCreate, dadosCadastroTipoPgr.post);
    router.get("/cadastro/getalltipopgr", ensureUserAuth, dadosCadastroTipoPgr.getAll);
    router.get("/:idtipopgr/gettipopgr", ensureUserAuth, dadosCadastroTipoPgr.get);
    router.put("/:idtipopgr/edittipopgr", ensureUserAuth, dadosCadastroTipoPgr.put);
    router.delete("/:idtipopgr/deletetipopgr", ensureUserAuth, dadosCadastroTipoPgr.delete);
    router.get("/cadastro/getonetipopgrbyges/:idges", ensureUserAuth, dadosCadastroTipoPgr.getOneByGes);
    //Ventilação
    router.post("/cadastro/postventilacao", ensureUserAuth, middlewareCanEditAndCreate, dadosCadastroVentilacao.post);
    router.get("/cadastro/getallventilacao", ensureUserAuth, dadosCadastroVentilacao.getAll);
    router.get("/:idventilacao/getventilacao", ensureUserAuth, dadosCadastroVentilacao.get);
    router.put("/:idventilacao/editventilacao", ensureUserAuth, dadosCadastroVentilacao.put);
    router.delete("/:idventilacao/deleteventilacao", ensureUserAuth, dadosCadastroVentilacao.delete);
    //Veículo
    router.post("/cadastro/postveiculo", ensureUserAuth, middlewareCanEditAndCreate, dadosCadastroVeiculo.post);
    router.get("/cadastro/getallveiculo", ensureUserAuth, dadosCadastroVeiculo.getAll);
    router.get("/:idveiculo/getveiculo", ensureUserAuth, dadosCadastroVeiculo.get);
    router.put("/:idveiculo/editveiculo", ensureUserAuth, dadosCadastroVeiculo.put);
    router.delete("/:idveiculo/deleteveiculo", ensureUserAuth, dadosCadastroVeiculo.delete);
    //Técnica Utilizada
    router.post("/cadastro/posttecnicautilizada", ensureUserAuth, middlewareCanEditAndCreate, dadosCadastroTecnicaUtilizada.post);
    router.get("/cadastro/getalltecnicautilizada", ensureUserAuth, dadosCadastroTecnicaUtilizada.getAll);
    router.get("/:idtecnicautilizada/gettecnicautilizada", ensureUserAuth, dadosCadastroTecnicaUtilizada.get);
    router.put("/:idtecnicautilizada/edittecnicautilizada", ensureUserAuth, dadosCadastroTecnicaUtilizada.put);
    router.delete("/:idtecnicautilizada/deletetecnicautilizada", ensureUserAuth, dadosCadastroTecnicaUtilizada.delete);
    //Fonte Geradora
    router.post("/cadastro/postfontegeradora", ensureUserAuth, middlewareCanEditAndCreate, dadosCadastroFonteGeradora.post);
    router.get("/cadastro/getallfontegeradora", ensureUserAuth, dadosCadastroFonteGeradora.getAll);
    router.get("/:idfontegeradora/getfontegeradora", ensureUserAuth, dadosCadastroFonteGeradora.get);
    router.put("/:idfontegeradora/editfontegeradora", ensureUserAuth, dadosCadastroFonteGeradora.put);
    router.delete("/:idfontegeradora/deletefontegeradora", ensureUserAuth, dadosCadastroFonteGeradora.delete);
    //Exposição
    router.post("/cadastro/postexposicao", ensureUserAuth, middlewareCanEditAndCreate, dadosCadastroExposicao.post);
    router.get("/cadastro/getallexposicao", ensureUserAuth, dadosCadastroExposicao.getAll);
    router.get("/:idexposicao/getexposicao", ensureUserAuth, dadosCadastroExposicao.get);
    router.put("/:idexposicao/editexposicao", ensureUserAuth, dadosCadastroExposicao.put);
    router.delete("/:idexposicao/deleteexposicao", ensureUserAuth, dadosCadastroExposicao.delete);
    //EPI
    router.post("/cadastro/postepi", ensureUserAuth, middlewareCanEditAndCreate, dadosCadastroEpi.post);
    router.get("/cadastro/getallepi", ensureUserAuth, dadosCadastroEpi.getAll);
    router.get("/:idepi/getepi", ensureUserAuth, dadosCadastroEpi.get);
    router.put("/:idepi/editepi", ensureUserAuth, dadosCadastroEpi.put);
    router.delete("/:idepi/deleteepi", ensureUserAuth, dadosCadastroEpi.delete);
    //Meio de Propagação
    router.post("/cadastro/postmeiodepropagacao", ensureUserAuth, middlewareCanEditAndCreate, dadosCadastroMeioDePropagacao.post);
    router.get("/cadastro/getallmeiodepropagacao", ensureUserAuth, dadosCadastroMeioDePropagacao.getAll);
    router.get("/:idmeiodepropagacao/getmeiodepropagacao", ensureUserAuth, dadosCadastroMeioDePropagacao.get);
    router.put("/:idmeiodepropagacao/editmeiodepropagacao", ensureUserAuth, dadosCadastroMeioDePropagacao.put);
    router.delete("/:idmeiodepropagacao/deletemeiodepropagacao", ensureUserAuth, dadosCadastroMeioDePropagacao.delete);
    //Trajetória
    router.post("/cadastro/posttrajetoria", ensureUserAuth, middlewareCanEditAndCreate, dadosCadastroTrajetoria.post);
    router.get("/cadastro/getalltrajetoria", ensureUserAuth, dadosCadastroTrajetoria.getAll);
    router.get("/:idtrajetoria/gettrajetoria", ensureUserAuth, dadosCadastroTrajetoria.get);
    router.put("/:idtrajetoria/edittrajetoria", ensureUserAuth, dadosCadastroTrajetoria.put);
    router.delete("/:idtrajetoria/deletetrajetoria", ensureUserAuth, dadosCadastroTrajetoria.delete);
    //Medida de controle
    router.post("/cadastro/postmedidadecontrole", ensureUserAuth, middlewareCanEditAndCreate, dadosCadastroMedidaDeControle.post);
    router.get("/cadastro/getallmedidadecontrole", ensureUserAuth, dadosCadastroMedidaDeControle.getAll);
    router.get("/:idmedidadecontrole/getmedidadecontrole", ensureUserAuth, dadosCadastroMedidaDeControle.get);
    router.put("/:idmedidadecontrole/editmedidadecontrole", ensureUserAuth, dadosCadastroMedidaDeControle.put);
    router.delete("/:idmedidadecontrole/deletemedidadecontrole", ensureUserAuth, dadosCadastroMedidaDeControle.delete);
    //Fatores de Risco
    router.post("/cadastro/postfatoresrisco", ensureUserAuth, middlewareCanEditAndCreate, dadosCadastroFatoresRisco.post);
    router.get("/cadastro/getallfatoresrisco", ensureUserAuth, dadosCadastroFatoresRisco.getAll);
    router.get("/:idfatoresrisco/getfatoresrisco", ensureUserAuth, dadosCadastroFatoresRisco.get);
    router.put("/:idfatoresrisco/editfatoresrisco", ensureUserAuth, dadosCadastroFatoresRisco.put);
    router.delete("/:idfatoresrisco/deletefatoresrisco", ensureUserAuth, dadosCadastroFatoresRisco.delete);
    //Medida de controle Coletiva existente
    router.post("/cadastro/postcoletivaexistente", ensureUserAuth, middlewareCanEditAndCreate, dadosCadastroColetivaExistente.post);
    router.get("/cadastro/getallcoletivaexistente", ensureUserAuth, dadosCadastroColetivaExistente.getAll);
    router.get("/:idcoletivaexistente/getcoletivaexistente", ensureUserAuth, dadosCadastroColetivaExistente.get);
    router.put("/:idcoletivaexistente/editcoletivaexistente", ensureUserAuth, dadosCadastroColetivaExistente.put);
    router.delete("/:idcoletivaexistente/deletecoletivaexistente", ensureUserAuth, dadosCadastroColetivaExistente.delete);
    //Medida de controle Administrativa existente
    router.post("/cadastro/postadministrativaexistente", ensureUserAuth, middlewareCanEditAndCreate, dadosCadastroAdministrativaExistente.post);
    router.get("/cadastro/getalladministrativaexistente", ensureUserAuth, dadosCadastroAdministrativaExistente.getAll);
    router.get("/:idadministrativaexistente/getadministrativaexistente", ensureUserAuth, dadosCadastroAdministrativaExistente.get);
    router.put("/:idadministrativaexistente/editadministrativaexistente", ensureUserAuth, dadosCadastroAdministrativaExistente.put);
    router.delete("/:idadministrativaexistente/deleteadministrativaexistente", ensureUserAuth, dadosCadastroAdministrativaExistente.delete);
    //Medida de controle individual existente
    router.post("/cadastro/postindividualexistente", ensureUserAuth, middlewareCanEditAndCreate, dadosCadastroIndividualExistente.post);
    router.get("/cadastro/getallindividualexistente", ensureUserAuth, dadosCadastroIndividualExistente.getAll);
    router.get("/:idindividualexistente/getindividualexistente", ensureUserAuth, dadosCadastroIndividualExistente.get);
    router.put("/:idindividualexistente/editindividualexistente", ensureUserAuth, dadosCadastroIndividualExistente.put);
    router.delete("/:idindividualexistente/deleteindividualexistente", ensureUserAuth, dadosCadastroIndividualExistente.delete);
    //Medida de controle Coletiva necessaria
    router.post("/cadastro/postcoletivanecessaria", ensureUserAuth, middlewareCanEditAndCreate, dadosCadastroColetivaNecessaria.post);
    router.get("/cadastro/getallcoletivanecessaria", ensureUserAuth, dadosCadastroColetivaNecessaria.getAll);
    router.get("/:idcoletivanecessaria/getcoletivanecessaria", ensureUserAuth, dadosCadastroColetivaNecessaria.get);
    router.put("/:idcoletivanecessaria/editcoletivanecessaria", ensureUserAuth, dadosCadastroColetivaNecessaria.put);
    router.delete("/:idcoletivanecessaria/deletecoletivanecessaria", ensureUserAuth, dadosCadastroColetivaNecessaria.delete);
    //Medida de controle Administrativa necessaria
    router.post("/cadastro/postadministrativanecessaria", ensureUserAuth, middlewareCanEditAndCreate, dadosCadastroAdministrativaNecessaria.post);
    router.get("/cadastro/getalladministrativanecessaria", ensureUserAuth, dadosCadastroAdministrativaNecessaria.getAll);
    router.get("/:idadministrativanecessaria/getadministrativanecessaria", ensureUserAuth, dadosCadastroAdministrativaNecessaria.get);
    router.put("/:idadministrativanecessaria/editadministrativanecessaria", ensureUserAuth, dadosCadastroAdministrativaNecessaria.put);
    router.delete("/:idadministrativanecessaria/deleteadministrativanecessaria", ensureUserAuth, dadosCadastroAdministrativaNecessaria.delete);
    //Medida de controle individual necessaria
    router.post("/cadastro/postindividualnecessaria", ensureUserAuth, middlewareCanEditAndCreate, dadosCadastroIndividualNecessaria.post);
    router.get("/cadastro/getallindividualnecessaria", ensureUserAuth, dadosCadastroIndividualNecessaria.getAll);
    router.get("/:idindividualnecessaria/getindividualnecessaria", ensureUserAuth, dadosCadastroIndividualNecessaria.get);
    router.put("/:idindividualnecessaria/editindividualnecessaria", ensureUserAuth, dadosCadastroIndividualNecessaria.put);
    router.delete("/:idindividualnecessaria/deleteindividualnecessaria", ensureUserAuth, dadosCadastroIndividualNecessaria.delete);
    //Estrategia de amostragem
    router.post("/cadastro/postestrategiaamostragem", ensureUserAuth, middlewareCanEditAndCreate, dadosCadastroEstrategiaAmostragem.post);
    router.get("/cadastro/getallestrategiaamostragem", ensureUserAuth, dadosCadastroEstrategiaAmostragem.getAll);
    router.get("/:idestrategiaamostragem/getestrategiaamostragem", ensureUserAuth, dadosCadastroEstrategiaAmostragem.get);
    router.put("/:idestrategiaamostragem/editestrategiaamostragem", ensureUserAuth, dadosCadastroEstrategiaAmostragem.put);
    router.delete("/:idestrategiaamostragem/deleteestrategiaamostragem", ensureUserAuth, dadosCadastroEstrategiaAmostragem.delete);

//GES
const upload = multer({ dest: 'uploads/' });
router.post("/postges", ensureUserAuth, middlewareCanEditAndCreate, upload.fields([{ name: 'file' }, { name: 'params' }]), gesController.postges);
router.put("/updateges/:id", ensureUserAuth, gesController.putges);
router.get("/gesgetall", ensureUserAuth, gesController.getAll);
router.get("/gesgetone/:idges", ensureUserAuth, gesController.getOne);
router.get("/gesgetone/:tipo/:param/:classe/:grau", ensureUserAuth, gesController.getOneColor);
router.delete("/:idges/deleteges", ensureUserAuth, gesController.deleteGes);
router.delete("/deletefluxograma/:idges", ensureUserAuth, gesController.deleteFluxograma);
router.put("/updatenamefluxograma/:idges", ensureUserAuth, gesController.updateNameFluxograma);
router.post("/postimagesat", ensureUserAuth, middlewareCanEditAndCreate, gesController.postImagesAt);
router.get("/getimagesat/:idges", ensureUserAuth, gesController.getImagesAt);
router.get("/gesgetallbyservico/:idservico", ensureUserAuth, gesController.getAllByServico);
router.get("/gesgetallbycliente/:idcliente", ensureUserAuth, gesController.getAllGesByCliente);
router.delete("/deleteimageat/:idimageat", ensureUserAuth, gesController.deleteImageAt);

//S3
router.post("/postfile", ensureUserAuth, middlewareCanEditAndCreate, upload.fields([{ name: 'file' }]), s3Controller.post);
router.get("/getfile/:key", ensureUserAuth, s3Controller.getOne);
router.delete("/deletefile/:key", ensureUserAuth, s3Controller.deleteOne);
router.post("/duplicarfile/:key", ensureUserAuth, s3Controller.duplicateFile);
router.get("/getimage/:key", ensureUserAuth, s3Controller.getOneAWS);

//RISCOS
router.post("/cadastros/riscos/novorisco/postrisco", ensureUserAuth, middlewareCanEditAndCreate, dadosRisco.post);
router.get("/cadastro/getallrisco", ensureUserAuth, dadosRisco.getAll);
router.get("/:idrisco/getrisco", ensureUserAuth, dadosRisco.get);
router.put("/:idrisco/editrisco", ensureUserAuth, dadosRisco.put);
router.delete("/:idrisco/deleterisco", ensureUserAuth, dadosRisco.delete);
router.get("/getriscobyges/:idges", ensureUserAuth, dadosRisco.getRiscoByGes);

router.get("/cadastros/medidascoletivas", ensureUserAuth, medidaColetivaController.getAll);
router.get("/cadastros/medidasadministrativas", ensureUserAuth, medidaAdministrativaController.getAll);
router.get("/cadastros/medidasindividuais", ensureUserAuth, medidaIndividualController.getAll);

//PLANO DE AÇÃO
router.post("/riscos/:riscoId/planoacao", ensureUserAuth, middlewareCanEditAndCreate, dadosPlanoAcao.post);
router.get("/riscos/:riscoId/planoacao", ensureUserAuth, dadosPlanoAcao.getAll);
router.get("/riscos/:riscoId/planoacao/:planoAcaoId", ensureUserAuth, dadosPlanoAcao.get);
router.put("/riscos/:riscoId/planoacao/:planoAcaoId", ensureUserAuth, dadosPlanoAcao.put);
router.delete("/riscos/:riscoId/planoacao/:planoAcaoId", ensureUserAuth, dadosPlanoAcao.delete);

router.get("/medidascoletivas", ensureUserAuth, medidaColetivaPlanoAcaoController.getAll);
router.get("/medidasadministrativas", ensureUserAuth, medidaAdministrativaPlanoAcaoController.getAll);
router.get("/medidasindividuais", ensureUserAuth, medidaIndividualPlanoAcaoController.getAll);
//Copias
router.post("/copias/ges", ensureUserAuth, middlewareCanEditAndCreate, dadosCopias.post);


//MATRIZ PADRÃO
router.post("/configuracoes/empresa/matrizpadrao/postmatrizpadrao",  ensureUserAuth, middlewareCanEditAndCreate, dadosMatrizPadrao.post);
router.get("/configuracoes/empresa/matrizpadrao/getallmatrizpadrao", ensureUserAuth, dadosMatrizPadrao.getAll);
router.get("/:matrizId/getmatrizpadrao", ensureUserAuth, dadosMatrizPadrao.get);
router.put("/:matrizId/editmatrizpadrao", ensureUserAuth, dadosMatrizPadrao.put);
router.delete("/:matrizId/deletematrizpadrao", ensureUserAuth, dadosMatrizPadrao.delete);
router.post("/matrizes/set-padrao", ensureUserAuth, dadosMatrizPadrao.setPadrao);
router.get("/configuracoes/empresa/matrizpadrao/getmatrizpadrao/:tipo/:parametro", ensureUserAuth, dadosMatrizPadrao.getMatrizPadraoByTipoParametro);

//MATRIZ SERVIÇO
router.post("/servico/matriz/postmatriz", ensureUserAuth, middlewareCanEditAndCreate, dadosMatrizServico.post);
router.get("/servico/matriz/getallmatriz", ensureUserAuth, dadosMatrizServico.getAll);
router.get("/servico/matriz/:servicoid/getallmatriz", ensureUserAuth, dadosMatrizServico.getMatrizByServico);
router.get("/servico/matriz/:matrizId/:servicoid/getmatriz", ensureUserAuth, dadosMatrizServico.get);
router.put("/servico/matriz/:matrizId/editmatriz", ensureUserAuth, dadosMatrizServico.put);
router.delete("/servico/matriz/:matrizId/:servicoid/deletematriz", ensureUserAuth, dadosMatrizServico.delete);
router.post("/servico/matriz/set-padrao",  ensureUserAuth, middlewareCanEditAndCreate, dadosMatrizServico.setPadrao);
router.get("/servico/matriz/padrao", dadosMatrizServico.getPadrao);

//Ambiente Trabalho
// router.post("/postambientetrabalho", ensureUserAuth, ATController.postAT);

router.get("/getcache/:key", ensureUserAuth, dadosServicos.getCache);

//Responsavel Tecnico
router.get("/getallresponsaveltecnico", ensureUserAuth, responsavelTecnicoController.getAllResponsavelTecnico);
router.get("/getoneresponsaveltecnico/:id", ensureUserAuth, responsavelTecnicoController.getOneReponsavelTecnico);
router.post("/postresponsaveltecnico", ensureUserAuth, middlewareCanEditAndCreate, responsavelTecnicoController.postResponsavelTecnico);
router.put("/editresponsaveltecnico/:id", ensureUserAuth, responsavelTecnicoController.putResponsavelTecnico);
router.delete("/:id/deleteresponsaveltecnico", ensureUserAuth, responsavelTecnicoController.deleteResponsavelTecnico);

//PDF
router.post("/generatebasepdfpgrtr", ensureUserAuth, pgrtrReportController.getPGRTRReport);
router.post("/generatebasepdfpgr", ensureUserAuth, pgrReportController.getPGRReport);
router.post("/generatebasepdfltcat", ensureUserAuth, ltcatReportController.getLTCATReport);
router.post("/generatedocbasepgr", ensureUserAuth, docBasePgrReportController.getDocBasePGRReport);

//SALVAR IMAGENS RISCOS
router.post("/postimagerisco", ensureUserAuth, middlewareCanEditAndCreate, dadosRisco.postImagePerigo);
router.delete("/deleteimagerisco/:idrisco/:origem", ensureUserAuth, dadosRisco.deleteImagePerigo);
router.get("/getimages/:idrisco/:origem/:tipo", ensureUserAuth, dadosRisco.getImagesPerigo);