import { Empresa, EmpresaCreationAttributes } from "../models/Empresa";
import { MatrizPadrao, MatrizPadraoAttributes } from "../models/MatrizPadrao";
import { Probabilidade, ProbabilidadeAttributes } from "../models/Probabilidades";
import { SeveridadeConsequencia, SeveridadeConsequenciaAttributes } from "../models/SeveridadeConsequencia";
import { ClassificacaoRisco, ClassificacaoRiscoAttributes } from "../models/ClassificacaoRisco";
import { matrizPadraoPostService } from "./cadastros/matrizpadrao/matrizpadrao";
import { Model } from "sequelize";
import { User } from "../models";

// Tipagem explícita para o retorno do findAll com associações (objetos simples)
interface MatrizPadraoComAssociacoes extends MatrizPadraoAttributes {
  probabilidades: ProbabilidadeAttributes[];
  severidades: SeveridadeConsequenciaAttributes[];
  classificacaoRisco: ClassificacaoRiscoAttributes[];
}

// Tipagem para o Model com associações (instâncias Sequelize)
interface ProbabilidadeModel extends Model<ProbabilidadeAttributes>, ProbabilidadeAttributes { }
interface SeveridadeConsequenciaModel extends Model<SeveridadeConsequenciaAttributes>, SeveridadeConsequenciaAttributes { }
interface ClassificacaoRiscoModel extends Model<ClassificacaoRiscoAttributes>, ClassificacaoRiscoAttributes { }

interface MatrizPadraoModel extends Model<MatrizPadraoAttributes>, MatrizPadraoAttributes {
  probabilidades: ProbabilidadeModel[];
  severidades: SeveridadeConsequenciaModel[];
  classificacaoRisco: ClassificacaoRiscoModel[];
}

export const empresaService = {

  findOne: async (id: number) => {
    const empresa = await Empresa.findOne({ where: { id } });
    return empresa;
  },

  update: async (empresaId: number, params: any) => {
    const empresa = await Empresa.update(params, {
      where: { id: empresaId },
    });

    return empresa;
  },

  create: async (attributes: EmpresaCreationAttributes) => {
    try {
      // Cria a nova empresa
      const empresa = await Empresa.create(attributes);
      const novaEmpresaId = empresa.id;

      // Busca as matrizes padrão da empresa com id=1
      const matrizesPadraoRaw = await MatrizPadrao.findAll({
        where: { empresa_id: 1 },
        include: [
          { model: Probabilidade, as: "probabilidades" },
          { model: SeveridadeConsequencia, as: "severidades" },
          { model: ClassificacaoRisco, as: "classificacaoRisco" },
        ],
      }) as MatrizPadraoModel[];

      // Se não houver matrizes padrão (ex.: empresa 1 não existe), apenas retorna a empresa criada
      if (!matrizesPadraoRaw.length) {
        console.warn("Nenhuma matriz padrão encontrada para a empresa com id=1. Empresa criada sem matrizes padrão.");
        return empresa;

      }

      // Converte os dados brutos para o formato esperado
      const matrizesPadrao: MatrizPadraoComAssociacoes[] = matrizesPadraoRaw.map((matriz) => ({
        ...matriz.get({ plain: true }), // Converte o Model para um objeto simples
        probabilidades: matriz.probabilidades.map((p) => p.get({ plain: true })),
        severidades: matriz.severidades.map((s) => s.get({ plain: true })),
        classificacaoRisco: matriz.classificacaoRisco.map((r) => r.get({ plain: true })),
      }));

      // Replica cada matriz padrão para a nova empresa
      for (const matriz of matrizesPadrao) {
        const {
          tipo,
          parametro,
          size,
          probabilidades,
          severidades,
          classificacaoRisco,
        } = matriz;

        // Monta os dados no formato esperado pelo matrizPadraoPostService
        const matrizData = {
          empresa_id: novaEmpresaId,
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

        // Cria a matriz para a nova empresa
        await matrizPadraoPostService(matrizData);
      }

      return empresa;
    } catch (error) {
      throw error instanceof Error ? error : new Error("Erro ao criar empresa e replicar matrizes");
    }
  },

  getUserByEmail: async (email: string) => {
    const user = await User.findOne({ where: { email } });
    return user;
  },
};