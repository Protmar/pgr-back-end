import { Op } from "sequelize";
import { sequelize } from "../../../../database";
import { ClassificacaoRiscoServico } from "../../../../models/ClassificacaoRiscoServico";
import { Matriz } from "../../../../models/Matriz";
import { ProbabilidadeServico } from "../../../../models/ProbabildadesServicos";
import { SeveridadeConsequenciaServico } from "../../../../models/SeveridadeConsequenciaServico";
import { probabilidadeServicoPostService } from "../probabilidadesservico";
import { severidadeConsequenciaServicoPostService } from "../severidadeconsequenciaservico";

export const matrizesServicoPostService = async (params: any) => {
  const {
    servico_id,
    tipo,
    parametro,
    size,
    is_padrao,
    texts,
    severidadeDesc,
    colTexts,
    paramDesc,
    riskClasses,
    riskDesc,
    riskColors,
    formaAtuacao,
  } = params;

  try {
    if (is_padrao) {
      await Matriz.update(
        { is_padrao: false },
        {
          where: {
            servico_id: Number(servico_id),
            tipo,
            parametro,
            is_padrao: true,
          },
        }
      );
    }

    const matrizData = await Matriz.create({
      servico_id,
      tipo,
      parametro,
      size,
      is_padrao: is_padrao || false,
    });

    const matrizId = Number(matrizData.dataValues.id);

    // Cria os registros de SeveridadeConsequencia
    for (let i = 0; i < size; i++) {
      await severidadeConsequenciaServicoPostService({
        matriz_id: matrizId,
        position: i + 1,
        description: texts[i] || "",
        criterio: severidadeDesc[i] || "",
      });
    }

    // Cria os registros de Probabilidade
    for (let i = 0; i < size; i++) {
      if (parametro === "Quantitativo") {
        const { sinal, valor, semMedidaProtecao } = paramDesc[i] || {};
        await probabilidadeServicoPostService({
          matriz_id: matrizId,
          position: i + 1,
          description: colTexts[i] || "",
          criterio: "", // Não usado em Quantitativo
          sinal: sinal || null,
          valor: valor || null,
          sem_protecao: semMedidaProtecao ?? null, // Usa null se undefined
        });
      } else {
        await probabilidadeServicoPostService({
          matriz_id: matrizId,
          position: i + 1,
          description: colTexts[i] || "",
          criterio: paramDesc[i] || "",
          sinal: null, // Null para Qualitativo
          valor: null, // Null para Qualitativo
          sem_protecao: null, // Null para Qualitativo
        });
      }
    }

    // Cria os registros de ClassificacaoRisco
    if (riskClasses && riskDesc && riskColors) {
      const uniqueValues = Array.from(
        new Set(
          Array.from({ length: size }, (_, rowIndex) =>
            Array.from(
              { length: size },
              (_, colIndex) => (rowIndex + 1) * (colIndex + 1)
            )
          ).flat()
        )
      ).sort((a, b) => a - b);

      // Mapeia as classes de risco únicas e suas posições
      const uniqueClasses: string[] = [];
      const classToIndex: { [key: string]: number } = {};
      uniqueValues.forEach((grauRisco) => {
        const classeRisco = riskClasses[grauRisco] || "";
        if (classeRisco && !uniqueClasses.includes(classeRisco)) {
          classToIndex[classeRisco] = uniqueClasses.length;
          uniqueClasses.push(classeRisco);
        }
      });

      const adjustedRiskDesc = Array(uniqueClasses.length).fill("");
      for (
        let i = 0;
        i < Math.min(riskDesc.length, uniqueClasses.length);
        i++
      ) {
        adjustedRiskDesc[i] = riskDesc[i] || "";
      }

      const adjustedFormaAtuacao = Array(uniqueClasses.length).fill("");
      for (
        let i = 0;
        i < Math.min(formaAtuacao.length, uniqueClasses.length);
        i++
      ) {
        adjustedFormaAtuacao[i] = formaAtuacao[i] || "";
      }

      for (let i = 0; i < uniqueValues.length; i++) {
        const grauRisco = uniqueValues[i];
        const classeRisco = riskClasses[grauRisco] || "";
        const classIndex =
          classToIndex[classeRisco] !== undefined
            ? classToIndex[classeRisco]
            : -1;

        await ClassificacaoRiscoServico.create({
          matriz_id: matrizId,
          grau_risco: grauRisco,
          classe_risco: classeRisco,
          cor: riskColors[grauRisco] || "#000000",
          definicao: classIndex >= 0 ? adjustedRiskDesc[classIndex] : "",
          forma_atuacao:
            classIndex >= 0 ? adjustedFormaAtuacao[classIndex] : "", // Novo campo adicionado
        });
      }
    }

    return matrizData;
  } catch (error) {
    throw error;
  }
};

export const matrizServicoGetAll = async (servicoId: string) => {
  if (!servicoId || isNaN(Number(servicoId))) {
    return []; // Retorna array vazio se servicoId for inválido
  }
  const data = await Matriz.findAll({
    where: { servico_id: Number(servicoId) },
  });
  return data || []; // Sempre retorna array
};

export const matrizServicoGet = async (servicoId: string, matrizId: string) => {
  const data = await Matriz.findOne({
    where: {
      servico_id: Number(servicoId),
      id: matrizId,
    },
    include: [
      {
        model: ProbabilidadeServico,
        as: "probabilidades",
        attributes: [
          "position",
          "description",
          "criterio",
          "sinal",
          "valor",
          "sem_protecao",
        ],
      },
      {
        model: SeveridadeConsequenciaServico,
        as: "severidades",
        attributes: ["position", "description", "criterio"],
      },
      {
        model: ClassificacaoRiscoServico,
        as: "classificacaoRisco",
        attributes: [
          "grau_risco",
          "classe_risco",
          "cor",
          "definicao",
          "forma_atuacao",
        ], // Adicionado forma_atuacao
      },
    ],
  });
  return data;
};

export const matrizServicoDelete = (servicoId: string, matrizId: string) => {
  const data = Matriz.destroy({
    where: {
      servico_id: Number(servicoId),
      id: matrizId,
    },
  });
  return data;
};

export const matrizServicoPut = async (
  servicoId: string,
  size: string,
  tipo: string,
  parametro: string,
  matrizId: string,
  texts: string[],
  colTexts: string[],
  paramDesc: any[],
  severidadeDesc: string[],
  riskClasses: { [key: number]: string },
  riskColors: { [key: number]: string },
  riskDesc: string[],
  formaAtuacao: string[],
  is_padrao?: boolean
) => {
  const numericSize = Number(size);

  if (
    !numericSize ||
    isNaN(numericSize) ||
    !texts ||
    !colTexts ||
    !paramDesc ||
    !severidadeDesc ||
    texts.length < numericSize ||
    colTexts.length < numericSize ||
    paramDesc.length < numericSize ||
    severidadeDesc.length < numericSize ||
    !tipo ||
    !parametro ||
    !matrizId
  ) {
    throw new Error(
      "Dados de entrada inválidos. Verifique size, tipo, parametro e arrays."
    );
  }

  const transaction = await Matriz.sequelize!.transaction();

  try {
    if (is_padrao) {
      await Matriz.update(
        { is_padrao: false },
        {
          where: {
            servico_id: Number(servicoId),
            tipo,
            parametro,
            is_padrao: true,
            id: { [Op.ne]: Number(matrizId) },
          },
          transaction,
        }
      );
    }

    const [updatedRows] = await Matriz.update(
      {
        size: numericSize,
        tipo,
        parametro,
        is_padrao: is_padrao || false,
      },
      {
        where: {
          servico_id: Number(servicoId),
          id: matrizId,
        },
        transaction,
      }
    );

    if (updatedRows === 0) {
      throw new Error("Matriz não encontrada ou não atualizada.");
    }

    await Promise.all([
      SeveridadeConsequenciaServico.destroy({
        where: { matriz_id: matrizId },
        transaction,
      }),
      ProbabilidadeServico.destroy({
        where: { matriz_id: matrizId },
        transaction,
      }),
      ClassificacaoRiscoServico.destroy({
        where: { matriz_id: matrizId },
        transaction,
      }),
    ]);

    for (let i = 0; i < numericSize; i++) {
      await SeveridadeConsequenciaServico.create(
        {
          matriz_id: Number(matrizId),
          position: i + 1,
          description: texts[i] || "",
          criterio: severidadeDesc[i] || "",
        },
        { transaction }
      );
    }

    for (let i = 0; i < numericSize; i++) {
      if (parametro === "Quantitativo") {
        const { sinal, valor, semMedidaProtecao } = paramDesc[i] || {};
        await ProbabilidadeServico.create(
          {
            matriz_id: Number(matrizId),
            position: i + 1,
            description: colTexts[i] || "",
            criterio: "",
            sinal: sinal || null,
            valor: valor || null,
            sem_protecao: semMedidaProtecao ?? null,
          },
          { transaction }
        );
      } else {
        await ProbabilidadeServico.create(
          {
            matriz_id: Number(matrizId),
            position: i + 1,
            description: colTexts[i] || "",
            criterio: paramDesc[i] || "",
            sinal: null,
            valor: null,
            sem_protecao: null,
          },
          { transaction }
        );
      }
    }

    if (riskClasses && riskDesc && riskColors) {
      const uniqueValues = Array.from(
        new Set(
          Array.from({ length: numericSize }, (_, rowIndex) =>
            Array.from(
              { length: numericSize },
              (_, colIndex) => (rowIndex + 1) * (colIndex + 1)
            )
          ).flat()
        )
      ).sort((a, b) => a - b);

      // Mapeia as classes de risco únicas e suas posições
      const uniqueClasses: string[] = [];
      const classToIndex: { [key: string]: number } = {};
      uniqueValues.forEach((grauRisco) => {
        const classeRisco = riskClasses[grauRisco] || "";
        if (classeRisco && !uniqueClasses.includes(classeRisco)) {
          classToIndex[classeRisco] = uniqueClasses.length;
          uniqueClasses.push(classeRisco);
        }
      });

      const adjustedRiskDesc = Array(uniqueClasses.length).fill("");
      for (
        let i = 0;
        i < Math.min(riskDesc.length, uniqueClasses.length);
        i++
      ) {
        adjustedRiskDesc[i] = riskDesc[i] || "";
      }

      const adjustedFormaAtuacao = Array(uniqueClasses.length).fill("");
      for (
        let i = 0;
        i < Math.min(formaAtuacao.length, uniqueClasses.length);
        i++
      ) {
        adjustedFormaAtuacao[i] = formaAtuacao[i] || "";
      }

      for (let i = 0; i < uniqueValues.length; i++) {
        const grauRisco = uniqueValues[i];
        const classeRisco = riskClasses[grauRisco] || "";
        const classIndex =
          classToIndex[classeRisco] !== undefined
            ? classToIndex[classeRisco]
            : -1;

        await ClassificacaoRiscoServico.create(
          {
            matriz_id: Number(matrizId),
            grau_risco: grauRisco,
            classe_risco: classeRisco,
            cor: riskColors[grauRisco] || "#000000",
            definicao: classIndex >= 0 ? adjustedRiskDesc[classIndex] : "",
            forma_atuacao:
              classIndex >= 0 ? adjustedFormaAtuacao[classIndex] : "", // Novo campo adicionado
          },
          { transaction }
        );
      }
    }

    await transaction.commit();

    return { success: true, matrizId };
  } catch (error) {
    await transaction.rollback();
    console.error("Erro ao atualizar matriz, transação revertida:", error);
    throw error instanceof Error
      ? error
      : new Error("Erro desconhecido ao atualizar matriz");
  }
};

export const setMatrizService = async (
  servicoId: string,
  matrizId: string,
  tipo: string,
  parametro: string
) => {
  try {
    await Matriz.update(
      { is_padrao: false },
      {
        where: {
          servico_id: Number(servicoId),
          tipo,
          parametro,
          is_padrao: true,
        },
      }
    );

    const [updatedRows] = await Matriz.update(
      { is_padrao: true },
      {
        where: {
          id: Number(matrizId),
          servico_id: Number(servicoId),
          tipo,
          parametro,
        },
      }
    );

    if (updatedRows === 0) {
      throw new Error(
        "Matriz não encontrada ou não pertence ao tipo/parâmetro/empresa"
      );
    }

    const matrizData = await Matriz.findOne({
      where: {
        id: Number(matrizId),
      },
    });
    return matrizData;
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("Erro ao definir matriz padrão");
  }
};

export const matrizServicoGetPadrao = async (servicoId: string, tipo: string, parametro: string) => {
  console.log("Buscando matriz com:", { servicoId, tipo, parametro });
  const data = await Matriz.findOne({
    where: {
      servico_id: Number(servicoId),
      tipo,
      parametro,
      is_padrao: true,
    },
    include: [
      { model: ProbabilidadeServico, as: "probabilidades" },
      { model: SeveridadeConsequenciaServico, as: "severidades" },
      { model: ClassificacaoRiscoServico, as: "classificacaoRisco" },
    ],
  });
  return data;
};