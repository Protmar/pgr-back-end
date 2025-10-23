import e, { Response } from "express";
import { AuthenticatedUserRequest } from "../../../middleware";
import {
  deleteDadosRiscoService,
  deleteImagePerigoService,
  getDadosAllRiscoService,
  getDadosRiscoService,
  getImagesPerigoService,
  getRiscoByGesService,
  medidaAdministrativaService,
  medidaColetivaService,
  medidaIndividualService,
  postDadosRiscoService,
  postImagePerigoService,
  putDadosRiscoService,
} from "../../../services/ges/gesRiscos";
import { CadastroMedidaControleColetivaExistente } from "../../../models/MedidaControleColetivaExistente";
import { CadastroMedidaControleAdministrativaExistente } from "../../../models/MedidaControleAdministrativaExistente";
import { CadastroMedidaControleIndividualExistente } from "../../../models/MedidaControleIndividualExistente";
import { Risco, RiscoAttributes } from "../../../models/Risco";
import { RiscoColetivoExistente } from "../../../models/Risco/RiscoColetivoExistente";
import { RiscoAdministrativoExistente } from "../../../models/Risco/RiscoAdministrativoExistente";
import { RiscoIndividualExistente } from "../../../models/Risco/RiscoIndividualExistente";
import { medidaAdministrativaNecessariasService, medidaColetivaNecessariasService, medidaIndividualNecessariasService } from "../../../services/ges/gesRiscos/PlanoAcao";
import { CadastroPlanoAcaoRiscoAttributes, PlanoAcaoRisco } from "../../../models/Risco/PlanoAcao/PlanoAcaoRisco";
import { CadastroMedidaControleColetivaNecessaria } from "../../../models/MedidaControleColetivaNecessaria";
import { CadastroMedidaControleAdministrativaNecessaria } from "../../../models/MedidaControleAdministrativaNecessaria";
import { CadastroMedidaControleIndividualNecessaria } from "../../../models/MedidaControleIndividualNecessaria";
import { RiscoAdministrativoNecessaria } from "../../../models/Risco/PlanoAcao/RiscoAdministrativoNecessaria";
import { RiscoColetivoNecessaria } from "../../../models/Risco/PlanoAcao/RiscoColetivoNecessaria";
import { RiscoIndividualNecessaria } from "../../../models/Risco/PlanoAcao/RiscoIndividualNecessaria";
import { Model } from "sequelize";

export const dadosRisco = {
  post: async (req: AuthenticatedUserRequest, res: Response) => {
    const { empresaId } = req.user!;
    const {
      id_fator_risco,
      id_fonte_geradora,
      id_exigencia_atividade,
      id_trajetoria,
      id_exposicao,
      id_meio_propagacao,
      transmitir_esocial,
      intens_conc,
      lt_le,
      comentario,
      nivel_acao,
      id_tecnica_utilizada,
      id_estrategia_amostragem,
      desvio_padrao,
      percentil,
      obs,
      probab_freq,
      conseq_severidade,
      grau_risco,
      classe_risco,
      medidasColetivas,
      medidasAdministrativas,
      medidasIndividuais,
      ges_id,
      conclusao_insalubridade,
      conclusao_periculosidade,
      conclusao_ltcat,
      menor_limite_quantificacao
    } = req.body;

    try {
      const risco = await Risco.create({
        empresa_id: empresaId,
        id_fator_risco,
        id_fonte_geradora,
        id_exigencia_atividade,
        id_trajetoria,
        id_exposicao,
        id_meio_propagacao,
        transmitir_esocial,
        intens_conc,
        lt_le,
        comentario,
        nivel_acao,
        id_tecnica_utilizada,
        id_estrategia_amostragem,
        desvio_padrao,
        percentil,
        obs,
        probab_freq,
        conseq_severidade,
        grau_risco,
        classe_risco,
        ges_id,
        conclusao_insalubridade,
        conclusao_periculosidade,
        conclusao_ltcat,
        menor_limite_quantificacao
      });

      // Associa medidas de controle
      if (medidasColetivas && medidasColetivas.length > 0) {
        console.log("Associando medidas coletivas:", medidasColetivas);
        await RiscoColetivoExistente.bulkCreate(
          medidasColetivas.map((id: number) => ({
            id_risco: risco.getDataValue("id"),
            id_medida_controle_coletiva_existentes: id, // Nome correto!
          }))
        );
      }
      if (medidasAdministrativas && medidasAdministrativas.length > 0) {
        console.log(
          "Associando medidas administrativas:",
          medidasAdministrativas
        );
        await RiscoAdministrativoExistente.bulkCreate(
          medidasAdministrativas.map((id: number) => ({
            id_risco: risco.getDataValue("id"),
            id_medida_controle_administrativa_existentes: id, // Nome correto!
          }))
        );
      }
      if (medidasIndividuais && medidasIndividuais.length > 0) {
        console.log("Associando medidas individuais:", medidasIndividuais);
        await RiscoIndividualExistente.bulkCreate(
          medidasIndividuais.map((id: number) => ({
            id_risco: risco.getDataValue("id"),
            id_medida_controle_individual_existentes: id, // Nome correto!
          }))
        );
      }

      res.status(201).json(risco);
    } catch (err: unknown) {
      console.error("Erro ao criar risco:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Erro desconhecido";
      res
        .status(400)
        .json({ message: "Erro ao criar risco", error: errorMessage });
    }
  },

  getAll: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { empresaId } = req.user!;
      const data = await getDadosAllRiscoService(empresaId.toString());
      res.status(200).json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: "Erro desconhecido" });
    }
  },

  get: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { empresaId } = req.user!;
      const { idrisco } = req.params;

      const data = await getDadosRiscoService(empresaId.toString(), idrisco);
      if (!data) {
        return res.status(404).json({ message: "Risco não encontrado" });
      }
      res.status(200).json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: "Erro desconhecido" });
    }
  },

  put: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { empresaId } = req.user!
      const { idrisco } = req.params
      const {
        id_fator_risco,
        id_fonte_geradora,
        id_exigencia_atividade,
        id_trajetoria,
        id_exposicao,
        id_meio_propagacao,
        transmitir_esocial,
        intens_conc,
        lt_le,
        comentario,
        nivel_acao,
        id_tecnica_utilizada,
        id_estrategia_amostragem,
        desvio_padrao,
        percentil,
        obs,
        probab_freq,
        conseq_severidade,
        grau_risco,
        classe_risco,
        medidasColetivas,
        medidasAdministrativas,
        medidasIndividuais,
        conclusao_insalubridade,
        conclusao_periculosidade,
        conclusao_ltcat,
        menor_limite_quantificacao
      } = req.body;

      const data = await putDadosRiscoService(
        empresaId.toString(),
        idrisco,
        id_fator_risco?.toString(),
        id_fonte_geradora?.toString(),
        id_exigencia_atividade?.toString(),
        id_trajetoria?.toString(),
        id_exposicao?.toString(),
        id_meio_propagacao?.toString(),
        transmitir_esocial?.toString(),
        intens_conc,
        lt_le?.toString(),
        comentario,
        nivel_acao?.toString(),
        id_tecnica_utilizada?.toString(),
        id_estrategia_amostragem?.toString(),
        desvio_padrao,
        percentil,
        obs,
        probab_freq?.toString(),
        conseq_severidade?.toString(),
        grau_risco?.toString(),
        classe_risco,
        medidasColetivas || [],
        medidasAdministrativas || [],
        medidasIndividuais || [],
        conclusao_insalubridade?.toString(),
        conclusao_periculosidade?.toString(),
        conclusao_ltcat?.toString(),
        menor_limite_quantificacao
      );

      res.status(200).json(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: "Erro desconhecido" });
    }
  },

  getRiscoByGes: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { empresaId } = req.user!;
      const { idges } = req.params;

      const data = await getRiscoByGesService(
        empresaId.toString(),
        idges
      );
      res.send(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },

  delete: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { empresaId } = req.user!;
      const { idrisco } = req.params;
      const data = await deleteDadosRiscoService(empresaId.toString(), idrisco);
      if (data === 0) {
        return res.status(404).json({ message: "Risco não encontrado" });
      }
      res.status(204).json(data)
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: "Erro desconhecido" });
    }
  },

  postImagePerigo: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const {
        risco_id,
        url,
        tipo_risco,
        file_type
      } = req.body;


      const data = await postImagePerigoService(tipo_risco, risco_id, url, file_type);
      res.send(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },

  getImagesPerigo: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { idrisco, origem, tipo } = req.params;
      const data = await getImagesPerigoService(idrisco, origem, tipo.replace(" ", "/"));
      res.send(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },

  deleteImagePerigo: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { idrisco, origem } = req.params;
      const data = await deleteImagePerigoService(idrisco, origem);
      res.send(data);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
    }
  },

  copy: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const { riscoId, gesId } = req.body;
      const { empresaId } = req.user!;

      // ===== Includes do Risco =====
      const includeColetivoExistente = {
        model: RiscoColetivoExistente,
        as: "relacoes_coletivas",
        include: [
          {
            model: CadastroMedidaControleColetivaExistente,
            as: "medidas_coletivas_existentes",
          },
        ],
      };

      const includeAdministrativoExistente = {
        model: RiscoAdministrativoExistente,
        as: "relacoes_administrativas",
        include: [
          {
            model: CadastroMedidaControleAdministrativaExistente,
            as: "medidas_administrativas_existentes",
          },
        ],
      };

      const includeIndividualExistente = {
        model: RiscoIndividualExistente,
        as: "relacoes_individuais",
        include: [
          {
            model: CadastroMedidaControleIndividualExistente,
            as: "medidas_individuais_existentes",
          },
        ],
      };

      // ===== Includes do Plano de Ação =====
      const includeColetivoNecessaria = {
        model: RiscoColetivoNecessaria,
        as: "riscosColetivosNecessaria",
        include: [
          {
            model: CadastroMedidaControleColetivaNecessaria,
            as: "medidas_coletivas_necessarias",
          },
        ],
      };

      const includeAdministrativoNecessaria = {
        model: RiscoAdministrativoNecessaria,
        as: "riscosAdministrativosNecessaria",
        include: [
          {
            model: CadastroMedidaControleAdministrativaNecessaria,
            as: "medidas_administrativas_n",
          },
        ],
      };

      const includeIndividualNecessaria = {
        model: RiscoIndividualNecessaria,
        as: "riscosIndividuaisNecessaria",
        include: [
          {
            model: CadastroMedidaControleIndividualNecessaria,
            as: "medidas_individuais_necessarias",
          },
        ],
      };

      // ===== Consultas =====
      const [riscoBase, planosBase] = await Promise.all([
        Risco.findOne({
          where: { id: riscoId, empresa_id: empresaId },
          include: [
            includeColetivoExistente,
            includeAdministrativoExistente,
            includeIndividualExistente,
          ],
        }),
        PlanoAcaoRisco.findAll({
          where: { id_risco: riscoId },
          include: [
            includeColetivoNecessaria,
            includeAdministrativoNecessaria,
            includeIndividualNecessaria,
          ],
        }),
      ]);

      if (!riscoBase) {
        return res.status(404).json({ message: "Risco não encontrado" });
      }

      // Une os dados como antes
      const riscoAntigo = {
        ...riscoBase.dataValues,
        planosAcao: planosBase.map((p) => p.dataValues),
      };

      // ===== Exemplo de acessos =====
      //@ts-ignore
      const descColetivaExistente = riscoAntigo.relacoes_coletivas;


      //@ts-ignore
      const descAdministrativaExistente = riscoAntigo.relacoes_administrativas;

      //@ts-ignore
      const descIndividualExistente = riscoAntigo.relacoes_individuais;

      //@ts-ignore
      const descColetivaNecessaria = riscoAntigo.planosAcao
        ?.flatMap((plano: any) =>
          plano.riscosColetivosNecessaria?.map(
            (r: any) => r.medidas_coletivas_necessarias?.dataValues?.descric
          ) || []
        )
        .filter(Boolean);

      //@ts-ignore
      const descAdministrativaNecessaria = riscoAntigo.planosAcao
        ?.flatMap((plano: any) =>
          plano.riscosAdministrativosNecessaria?.map(
            (r: any) => r.dataValues?.medidas_administrativas_n?.dataValues?.descr
          ) || []
        )
        .filter(Boolean);

      //@ts-ignore
      const descIndividualNecessaria = riscoAntigo.planosAcao
        ?.flatMap((plano: any) =>
          plano.riscosIndividuaisNecessaria?.map(
            (r: any) => r.medidas_individuais_necessarias?.dataValues?.des
          ) || []
        )
        .filter(Boolean);


      const risco = await Risco.create({
        empresa_id: empresaId,
        id_fator_risco: riscoAntigo.id_fator_risco,
        id_fonte_geradora: riscoAntigo.id_fonte_geradora,
        id_exigencia_atividade: riscoAntigo.id_exigencia_atividade,
        id_trajetoria: riscoAntigo.id_trajetoria,
        id_exposicao: riscoAntigo.id_exposicao,
        id_meio_propagacao: riscoAntigo.id_meio_propagacao,
        transmitir_esocial: riscoAntigo.transmitir_esocial,
        intens_conc: riscoAntigo.intens_conc,
        lt_le: riscoAntigo.lt_le,
        comentario: riscoAntigo.comentario,
        nivel_acao: riscoAntigo.nivel_acao,
        id_tecnica_utilizada: riscoAntigo.id_tecnica_utilizada,
        id_estrategia_amostragem: riscoAntigo.id_estrategia_amostragem,
        desvio_padrao: riscoAntigo.desvio_padrao,
        percentil: riscoAntigo.percentil,
        obs: riscoAntigo.obs,
        probab_freq: riscoAntigo.probab_freq,
        conseq_severidade: riscoAntigo.conseq_severidade,
        grau_risco: riscoAntigo.grau_risco,
        classe_risco: riscoAntigo.classe_risco,
        ges_id: gesId,
        conclusao_insalubridade: riscoAntigo.conclusao_insalubridade,
        conclusao_periculosidade: riscoAntigo.conclusao_periculosidade,
        conclusao_ltcat: riscoAntigo.conclusao_ltcat,
        menor_limite_quantificacao: riscoAntigo.menor_limite_quantificacao,
      });

      // Associa medidas de controle
      if (descColetivaExistente && descColetivaExistente.length > 0) {
        descColetivaExistente.map(async (e: any) => {
          await RiscoColetivoExistente.create(
            {
              id_risco: risco.getDataValue("id"),
              id_medida_controle_coletiva_existentes: e.dataValues.medidas_coletivas_existentes.dataValues.id as number,
            }
          );
        })

      }

      if (descAdministrativaExistente && descAdministrativaExistente.length > 0) {
        descAdministrativaExistente.map(async (e: any) => {
          await RiscoAdministrativoExistente.create(
            {
              id_risco: risco.getDataValue("id"),
              id_medida_controle_administrativa_existentes: e.dataValues.medidas_administrativas_existentes.dataValues.id as number,
            }
          );
        })

      }

      if (descIndividualExistente && descIndividualExistente.length > 0) {
        descIndividualExistente.map(async (e: any) => {
          await RiscoIndividualExistente.create(
            {
              id_risco: risco.getDataValue("id"),
              id_medida_controle_individual_existentes: e.dataValues.medidas_individuais_existentes.dataValues.id as number,
            }
          );
        })

      }



      // Cria todos os planos de ação em paralelo
      const novosPlanosAcao = await Promise.all(
        riscoAntigo.planosAcao.map(async (plano: any) => {
          const novoPlano = await PlanoAcaoRisco.create({
            id_risco: risco.getDataValue("id"),
            eliminar_risco_administrativo: plano.eliminar_risco_administrativo,
            eliminar_risco_coletivo: plano.eliminar_risco_coletivo,
            eliminar_risco_individual: plano.eliminar_risco_individual,
            responsavel: plano.responsavel,
            data_prevista: plano.data_prevista,
            data_realizada: plano.data_realizada,
            data_inspecao: plano.data_inspecao,
            data_monitoramento: plano.data_monitoramento,
            resultado_realizacacao: plano.resultado_realizacacao,
          });

          // Copia os riscos coletivos necessários
          if (plano.riscosColetivosNecessaria?.length) {
            await Promise.all(
              plano.riscosColetivosNecessaria.map(async (colNecessaria: any) => {
                await RiscoColetivoNecessaria.create({
                  id_plano_acao_riscos: novoPlano.dataValues.id, // usa o novo plano
                  id_medida_controle_coletiva_necessarias:
                    colNecessaria.dataValues.id_medida_controle_coletiva_necessari,
                });
              })
            );
          }

          // Copia os riscos administrativos necessários
          if (plano.riscosAdministrativosNecessaria?.length) {
            await Promise.all(
              plano.riscosAdministrativosNecessaria.map(async (admNecessaria: any) => {
                await RiscoAdministrativoNecessaria.create({
                  id_plano_acao_riscos: novoPlano.dataValues.id,
                  id_medida_controle_administrativa_necessarias:
                    admNecessaria.dataValues.id_medida_controle_administrati,
                });
              })
            );
          }

          // Copia os riscos individuais necessários
          if (plano.riscosIndividuaisNecessaria?.length) {
            await Promise.all(
              plano.riscosIndividuaisNecessaria.map(async (indNecessaria: any) => {
                await RiscoIndividualNecessaria.create({
                  id_plano_acao_riscos: novoPlano.dataValues.id,
                  id_medida_controle_individual_necessarias:
                    indNecessaria.dataValues.id_medida_controle_individual_neces,
                });
              })
            );
          }

          return novoPlano;
        })
      );


      return res.json({
        novosPlanosAcao
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao copiar risco", error });
    }
  }








};

export const medidaColetivaController = {
  getAll: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const medidas = await medidaColetivaService.getAll();
      res.status(200).json(medidas);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: "Erro desconhecido" });
    }
  },
};
export const medidaAdministrativaController = {
  getAll: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const medidas = await medidaAdministrativaService.getAll();
      res.status(200).json(medidas);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: "Erro desconhecido" });
    }
  },
};

export const medidaIndividualController = {
  getAll: async (req: AuthenticatedUserRequest, res: Response) => {
    try {
      const medidas = await medidaIndividualService.getAll();
      res.status(200).json(medidas);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: "Erro desconhecido" });
    }
  },



};
