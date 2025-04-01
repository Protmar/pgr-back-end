import { sequelize } from "../../../../database";
import { ClassificacaoRisco } from "../../../../models/ClassificacaoRisco";
import { MatrizPadrao } from "../../../../models/MatrizPadrao";
import { Probabilidade } from "../../../../models/Probabilidades";
import { SeveridadeConsequencia } from "../../../../models/SeveridadeConsequencia";
import { probabilidadePostService } from "../probabilidades";
import { severidadeConsequenciaPostService } from "../severidadeconsequencia";

export const matrizPadraoPostService = async (params: any) => {
  const {
    empresa_id,
    tipo,
    parametro,
    size,
    texts,
    severidadeDesc,
    colTexts,
    paramDesc,
    riskClasses,
    riskDesc,
    riskColors,
    formaAtuacao, // Novo campo adicionado
  } = params;

  try {
    const matrizData = await MatrizPadrao.create({
      empresa_id,
      tipo,
      parametro,
      size,
    });

    const matrizId = Number(matrizData.dataValues.id);

    // Cria os registros de SeveridadeConsequencia
    for (let i = 0; i < size; i++) {
      await severidadeConsequenciaPostService({
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
        await probabilidadePostService({
          matriz_id: matrizId,
          position: i + 1,
          description: colTexts[i] || "",
          criterio: "", // Não usado em Quantitativo
          sinal: sinal || null,
          valor: valor || null,
          sem_protecao: semMedidaProtecao ?? null, // Usa null se undefined
        });
      } else {
        await probabilidadePostService({
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
            Array.from({ length: size }, (_, colIndex) => (rowIndex + 1) * (colIndex + 1))
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
      for (let i = 0; i < Math.min(riskDesc.length, uniqueClasses.length); i++) {
        adjustedRiskDesc[i] = riskDesc[i] || "";
      }

      const adjustedFormaAtuacao = Array(uniqueClasses.length).fill("");
      for (let i = 0; i < Math.min(formaAtuacao.length, uniqueClasses.length); i++) {
        adjustedFormaAtuacao[i] = formaAtuacao[i] || "";
      }

      for (let i = 0; i < uniqueValues.length; i++) {
        const grauRisco = uniqueValues[i];
        const classeRisco = riskClasses[grauRisco] || "";
        const classIndex = classToIndex[classeRisco] !== undefined ? classToIndex[classeRisco] : -1;

        await ClassificacaoRisco.create({
          matriz_id: matrizId,
          grau_risco: grauRisco,
          classe_risco: classeRisco,
          cor: riskColors[grauRisco] || "#000000",
          definicao: classIndex >= 0 ? adjustedRiskDesc[classIndex] : "",
          forma_atuacao: classIndex >= 0 ? adjustedFormaAtuacao[classIndex] : "", // Novo campo adicionado
        });
      }
    }

    return matrizData;
  } catch (error) {
    throw error;
  }
};

export const matrizPadraoGetAll = async (empresaId: string) => {
  const data = await MatrizPadrao.findAll({
    where: {
      empresa_id: Number(empresaId),
    },
  });
  return data;
};

export const matrizPadraoGet = async (empresaId: string, matrizId: string) => {
  const data = await MatrizPadrao.findOne({
    where: {
      empresa_id: Number(empresaId),
      id: matrizId,
    },
    include: [
      {
        model: Probabilidade,
        as: "probabilidades",
        attributes: ["position", "description", "criterio", "sinal", "valor", "sem_protecao"],
      },
      {
        model: SeveridadeConsequencia,
        as: "severidades",
        attributes: ["position", "description", "criterio"],
      },
      {
        model: ClassificacaoRisco,
        as: "classificacaoRisco",
        attributes: ["grau_risco", "classe_risco", "cor", "definicao", "forma_atuacao"], // Adicionado forma_atuacao
      },
    ],
  });
  return data;
};

export const matrizPadraoDelete = (empresaId: string, matrizId: string) => {
  const data = MatrizPadrao.destroy({
    where: {
      empresa_id: Number(empresaId),
      id: matrizId,
    },
  });
  return data;
};

export const matrizPadraoPut = async (
  empresaId: string,
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
  formaAtuacao: string[] // Novo campo adicionado
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
    throw new Error("Dados de entrada inválidos. Verifique size, tipo, parametro e arrays.");
  }

  const transaction = await MatrizPadrao.sequelize!.transaction();

  try {
    const [updatedRows] = await MatrizPadrao.update(
      {
        size: numericSize,
        tipo,
        parametro,
      },
      {
        where: {
          empresa_id: Number(empresaId),
          id: matrizId,
        },
        transaction,
      }
    );

    if (updatedRows === 0) {
      throw new Error("Matriz não encontrada ou não atualizada.");
    }

    await Promise.all([
      SeveridadeConsequencia.destroy({ where: { matriz_id: matrizId }, transaction }),
      Probabilidade.destroy({ where: { matriz_id: matrizId }, transaction }),
      ClassificacaoRisco.destroy({ where: { matriz_id: matrizId }, transaction }),
    ]);

    for (let i = 0; i < numericSize; i++) {
      await SeveridadeConsequencia.create(
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
        await Probabilidade.create(
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
        await Probabilidade.create(
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
            Array.from({ length: numericSize }, (_, colIndex) => (rowIndex + 1) * (colIndex + 1))
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
      for (let i = 0; i < Math.min(riskDesc.length, uniqueClasses.length); i++) {
        adjustedRiskDesc[i] = riskDesc[i] || "";
      }

      const adjustedFormaAtuacao = Array(uniqueClasses.length).fill("");
      for (let i = 0; i < Math.min(formaAtuacao.length, uniqueClasses.length); i++) {
        adjustedFormaAtuacao[i] = formaAtuacao[i] || "";
      }

      for (let i = 0; i < uniqueValues.length; i++) {
        const grauRisco = uniqueValues[i];
        const classeRisco = riskClasses[grauRisco] || "";
        const classIndex = classToIndex[classeRisco] !== undefined ? classToIndex[classeRisco] : -1;

        await ClassificacaoRisco.create(
          {
            matriz_id: Number(matrizId),
            grau_risco: grauRisco,
            classe_risco: classeRisco,
            cor: riskColors[grauRisco] || "#000000",
            definicao: classIndex >= 0 ? adjustedRiskDesc[classIndex] : "",
            forma_atuacao: classIndex >= 0 ? adjustedFormaAtuacao[classIndex] : "", // Novo campo adicionado
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
    throw error instanceof Error ? error : new Error("Erro desconhecido ao atualizar matriz");
  }
};