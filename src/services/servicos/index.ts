import { getCache } from "../../controllers/cliente/cliente";
import Servicos, { ServicoInstance } from "../../models/Servicos";
import { MatrizPadrao, MatrizPadraoAttributes } from "../../models/MatrizPadrao";
import { Probabilidade, ProbabilidadeAttributes } from "../../models/Probabilidades";
import { SeveridadeConsequencia, SeveridadeConsequenciaAttributes } from "../../models/SeveridadeConsequencia";
import { ClassificacaoRisco, ClassificacaoRiscoAttributes } from "../../models/ClassificacaoRisco";
import { Model } from "sequelize";
import { matrizesServicoPostService } from "../cadastros/matrizes/matrizservico";

// Vou assumir que existe um serviço pra criar a Matriz por serviço


// Tipagem para MatrizPadrao com associações (objetos simples)
interface MatrizPadraoComAssociacoes extends MatrizPadraoAttributes {
  probabilidades: ProbabilidadeAttributes[];
  severidades: SeveridadeConsequenciaAttributes[];
  classificacaoRisco: ClassificacaoRiscoAttributes[];
}

// Tipagem para os modelos Sequelize de MatrizPadrao
interface ProbabilidadeModel extends Model<ProbabilidadeAttributes>, ProbabilidadeAttributes {}
interface SeveridadeConsequenciaModel extends Model<SeveridadeConsequenciaAttributes>, SeveridadeConsequenciaAttributes {}
interface ClassificacaoRiscoModel extends Model<ClassificacaoRiscoAttributes>, ClassificacaoRiscoAttributes {}

interface MatrizPadraoModel extends Model<MatrizPadraoAttributes>, MatrizPadraoAttributes {
  probabilidades: ProbabilidadeModel[];
  severidades: SeveridadeConsequenciaModel[];
  classificacaoRisco: ClassificacaoRiscoModel[];
}

export const getDadosServicosService = async (
  idempresa: number,
  idcliente: number,
  descricao: string,
  responsavel_aprovacao: string,
  id_responsavel_aprovacao: number,
  cargo_responsavel_aprovacao: string,
  data_inicio: any,
  data_fim: any

): Promise<ServicoInstance> => {
  try {
    // Cria o serviço
    const servico = await Servicos.create({
      empresa_id: idempresa,
      cliente_id: idcliente,
      descricao: descricao,
      responsavel_aprovacao: responsavel_aprovacao,
      id_responsavel_aprovacao: id_responsavel_aprovacao,
      cargo_responsavel_aprovacao: cargo_responsavel_aprovacao,
      data_inicio: data_inicio,
      data_fim: data_fim,
      art_url: "",
      in_use: false,
    });
    const novoServicoId = servico.id;

    // Busca as matrizes padrão da empresa correspondente
    const matrizesPadraoRaw = await MatrizPadrao.findAll({
      where: {
        empresa_id: idempresa,
      },
      include: [
        { model: Probabilidade, as: "probabilidades" },
        { model: SeveridadeConsequencia, as: "severidades" },
        { model: ClassificacaoRisco, as: "classificacaoRisco" },
      ],
    }) as MatrizPadraoModel[];

    if (!matrizesPadraoRaw.length) {
      console.warn(`Nenhuma matriz padrão encontrada para a empresa com id=${idempresa}.`);
    } else {
      // Converte os dados brutos para o formato esperado
      const matrizesPadrao: MatrizPadraoComAssociacoes[] = matrizesPadraoRaw.map((matriz) => ({
        ...matriz.get({ plain: true }),
        probabilidades: matriz.probabilidades.map((p) => p.get({ plain: true })),
        severidades: matriz.severidades.map((s) => s.get({ plain: true })),
        classificacaoRisco: matriz.classificacaoRisco.map((r) => r.get({ plain: true })),
      }));

      // Replica as matrizes padrão como matrizes por serviço
      for (const matriz of matrizesPadrao) {
        const {
          tipo,
          parametro,
          size,
          probabilidades,
          severidades,
          classificacaoRisco,
        } = matriz;

        const matrizData = {
          servico_id: novoServicoId, // Vincula ao novo serviço
          tipo,
          parametro,
          size,
          texts: severidades.map((s: SeveridadeConsequenciaAttributes) => s.description || ""),
          severidadeDesc: severidades.map((s: SeveridadeConsequenciaAttributes) => s.criterio || ""),
          colTexts: probabilidades.map((p: ProbabilidadeAttributes) => p.description || ""),
          paramDesc: parametro === "Quantitativo"
            ? probabilidades.map((p: ProbabilidadeAttributes) => ({
                sinal: p.sinal || null,
                valor: p.valor || null,
                semMedidaProtecao: p.sem_protecao ?? null,
              }))
            : probabilidades.map((p: ProbabilidadeAttributes) => p.criterio || ""),
          riskClasses: classificacaoRisco.reduce(
            (acc: { [key: number]: string }, r: ClassificacaoRiscoAttributes) => {
              acc[r.grau_risco] = r.classe_risco || "";
              return acc;
            },
            {} as { [key: number]: string }
          ),
          riskColors: classificacaoRisco.reduce(
            (acc: { [key: number]: string }, r: ClassificacaoRiscoAttributes) => {
              acc[r.grau_risco] = r.cor || "#000000";
              return acc;
            },
            {} as { [key: number]: string }
          ),
          riskDesc: Array.from(new Set(classificacaoRisco.map((r: ClassificacaoRiscoAttributes) => r.definicao || ""))),
          formaAtuacao: Array.from(
            new Set(classificacaoRisco.map((r: ClassificacaoRiscoAttributes) => r.forma_atuacao || ""))
          ),
        };

        // Cria a matriz por serviço (assumindo que existe um matrizPostService)
        await matrizesServicoPostService(matrizData);
      }
    }

    return servico;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Erro ao criar serviço e replicar matrizes");
  }
};

// Mantém as outras funções do serviço intactas
export const getDadosServicosByEmpresaCliente = async (idempresa: number, cliente_id?: number) => {
  const idcliente = globalThis.cliente_id;

  if (cliente_id) {
    const data = await Servicos.findAll({
      where: {
        empresa_id: idempresa,
        cliente_id: cliente_id,
      },
    });
    return data;
  } else if (idcliente) {
    const data = await Servicos.findAll({
      where: {
        empresa_id: idempresa,
        cliente_id: idcliente,
      },
    });
    return data;
  }
};

export const getDadosServicoByEmpresaServico = async (idempresa: number, idservico: number) => {
  const data = await Servicos.findOne({
    where: {
      empresa_id: idempresa,
      id: idservico,
    },
  });
  return data;
};

export const putDadosServicosService = async (
  idempresa: number,
  idservico: number,
  params: any
) => {
  const data = await Servicos.update(
    params,
    {
      where: {
        empresa_id: idempresa,
        id: idservico,
      },
    }
  );
  return data;
};

export const deleteDadosServicoByEmpresaServico = async (idempresa: number, idservico: number) => {
  const data = await Servicos.destroy({
    where: {
      empresa_id: idempresa,
      id: idservico,
    },
  });
  return data;
};


export const getDadosServicosByEmpresaClienteId = async (
  idempresa: number,
  idcliente: number
) => {


  const data = await Servicos.findAll({
    where: {
      cliente_id: idcliente,
    },
  });
  return data;
};

export const getNameDocBaseByServicoPGR = async (idempresa: number, idservico: number) => {
  const data = await Servicos.findOne({
    attributes: ["base_document_url_pgr"],
    where: {
      empresa_id: idempresa,
      id: idservico,
    },
  });
  return data;
};

export const getNameDocBaseByServicoLTCAT = async (idempresa: number, idservico: number) => {
  const data = await Servicos.findOne({
    attributes: ["base_document_url_ltcat"],
    where: {
      empresa_id: idempresa,
      id: idservico,
    },
  });
  return data;
};

export const getResponsavelByServico = async (idempresa: number, idservico: number) => {
  const data = await Servicos.findOne({
    attributes: ["responsavel_aprovacao"],
    where: {
      empresa_id: idempresa,
      id: idservico,
    },
  });
  return data;
}