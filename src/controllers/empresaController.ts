import { Request, Response } from "express";
import { userService } from "../services/userService";
import { empresaService } from "../services/empresaService";
import { Role } from "../models/enums/role.enum";
import { AuthenticatedUserRequest } from "../middleware";

export const empresaController = {

    // Função para capitalizar a primeira letra de cada palavra
    capitalizeName: (name: string) => {
        return name
            .toLowerCase()
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    },

    //POST /create/empresa/noAuth
    createNoAuth: async (req: Request, res: Response) => {
        const {
            cnpj,
            nome,
            nomeUsuario,
            senha,
            cidade,
            estado,
            email,
            emailFinanceiro,
            endereco,
            telefone,
            role
        } = req.body;

        try {
            const alreadyExists = await userService.findByEmail(email);

            if (alreadyExists) {
                throw new Error("Este e-mail já está cadastrado.");
            }

            // Formata os nomes antes de salvar
            const formattedNome = empresaController.capitalizeName(nome);
            const formattedNomeUsuario = empresaController.capitalizeName(nomeUsuario);

            const empresa = await empresaService.create({
                cnpj,
                nome: formattedNome,
                cidade,
                estado,
                email,
                emailFinanceiro,
                nmrCrea: null,
                endereco,
                telefone,
                logoUrl: null,
            });

            const user = await userService.create({
                nome: formattedNomeUsuario,
                email,
                senha,
                empresaId: empresa.id,
                visualizarLaudos: true,
                editarLaudos: true,
                visualizarConfigClientes: true,
                editarConfigClientes: true,
                realizarPagamentos: true,
                recoverCode: null,
                recoverExpires: null,
                role: role
            });

            return res.status(201).json({ empresa, user });
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ message: err.message });
            }
        }
    },

    getOne: async (req: AuthenticatedUserRequest, res: Response) => {
        try {
            const { empresaId } = req.user!;
            const empresa = await empresaService.findOne(empresaId);
            return res.status(200).json(empresa);
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ message: err.message });
            }
        }
        return res.status(404).json({ message: "Empresa não encontrada" });
    },

    put: async (req: AuthenticatedUserRequest, res: Response) => {
        try {
            const { empresaId } = req.user!;
            const { cnpj,
                nome,
                email,
                nmrCrea,
                endereco,
                telefone,
                logoUrl } = req.body;

            const empresa = await empresaService.update(empresaId, {
                cnpj,
                nome,
                email,
                nmrCrea,
                endereco,
                telefone,
                logoUrl
            });

            return res.status(200).json(empresa);
        } catch (err) {
            if (err instanceof Error) {
                return res.status(400).json({ message: err.message });
            }
            return res.status(404).json({ message: "Empresa não encontrada" });
        }
    }

};
