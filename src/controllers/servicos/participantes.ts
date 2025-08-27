import { AuthenticatedUserRequest } from "../../middleware";
import Participantes from "../../models/Participantes";

export const dadosParticipantes = {
    post: async (req: AuthenticatedUserRequest, res: any) => {
        const { nome, cargo, setor, servico_id, cliente_id } = req.body;
        const { empresaId } = req.user!;

        const response = await Participantes.create({
            empresa_id: empresaId,
            cliente_id,
            servico_id,
            nome,
            cargo,
            setor,
        });

        if (response) {
            res.status(200).json({ message: "Participante cadastrado com sucesso!" });
        }
    },

    put: async (req: AuthenticatedUserRequest, res: any) => {
        const { id, nome, cliente_id, servico_id, cargo, setor } = req.body;
        const { empresaId } = req.user!;

        const response = await Participantes.update({
            empresa_id: empresaId,
            cliente_id,
            servico_id,
            nome,
            cargo,
            setor,
        }, {
            where: {
                id: Number(id)
            }
        });

        if (response) {
            res.status(200).json({ message: "Participante atualizado com sucesso!" });
        }
    },

    getAll: async (req: AuthenticatedUserRequest, res: any) => {
        const { empresaId } = req.user!;
        const { servicoid } = req.params;

        const response = await Participantes.findAll({
            where: {
                empresa_id: empresaId,
                servico_id: Number(servicoid)
            },
            attributes: ["id", "nome", "cargo", "setor", "cliente_id", "servico_id"]
        });

        if (response) {
            res.status(200).json(response);
        }
    },

    getOne: async (req: AuthenticatedUserRequest, res: any) => {
        const { empresaId } = req.user!;
        const { idparticipante } = req.params;

        const response = await Participantes.findOne({
            where: {
                empresa_id: empresaId,
                id: Number(idparticipante)
            },
            attributes: ["id", "nome", "cargo", "setor", "cliente_id", "servico_id"]
        });

        if (response) {
            res.status(200).json(response);
        }
    },

    delete: async (req: AuthenticatedUserRequest, res: any) => {
        const { empresaId } = req.user!;
        const { idparticipante } = req.params;

        const response = await Participantes.destroy({
            where: {
                empresa_id: empresaId,
                id: Number(idparticipante)
            }
        });

        if (response) {
            res.status(200).json({ message: "Participante deletado com sucesso!" });
        }
    }
}
