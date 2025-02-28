import { Response } from "express";
import { AuthenticatedUserRequest } from "../../middleware";
import { deleteDadosServicoByEmpresaServico, getDadosServicoByEmpresaServico, getDadosServicosByEmpresaCliente, getDadosServicosService, putDadosServicosService } from "../../services/servicos";

export const dadosServicos = {
    post: async (req: AuthenticatedUserRequest,res: Response) => {
        try {
            const { cliente_id, descricao, responsavel_aprovacao, cargo_responsavel_aprovacao, data_inicio, data_fim } = req.body;

            const { empresaId } = req.user!;
            
            const newServico = await getDadosServicosService(empresaId, cliente_id, descricao, responsavel_aprovacao, cargo_responsavel_aprovacao, data_inicio, data_fim);
        
            res.json(newServico);
        } catch (err) {
            if (err instanceof Error) {
              return res.status(400).json({ message: err.message });
            }
          }
    },

    get: async (req: AuthenticatedUserRequest,res: Response) => {
        try {
            const { empresaId } = req.user!;
            const { idservico } = req.params;
            
            const servicos = await getDadosServicoByEmpresaServico(empresaId, Number(idservico));
        
            res.json(servicos);
        } catch (err) {
            if (err instanceof Error) {
              return res.status(400).json({ message: err.message });
            }
          }
    },

    getServicosByCliente: async (req: AuthenticatedUserRequest,res: Response) => {
        try {
            const { empresaId } = req.user!;
            const { idcliente } = req.params;
            
            const servicos = await getDadosServicosByEmpresaCliente(empresaId, Number(idcliente));
        
            res.json(servicos);
        } catch (err) {
            if (err instanceof Error) {
              return res.status(400).json({ message: err.message });
            }
          }
    },

    put: async (req: AuthenticatedUserRequest,res: Response) => {
        try {
            const { idservico } = req.params;
            const { empresaId } = req.user!;
            const { descricao, responsavel_aprovacao, cargo_responsavel_aprovacao, data_inicio, data_fim } = req.body;
            
            const servicos = await putDadosServicosService(empresaId, Number(idservico), descricao, responsavel_aprovacao, cargo_responsavel_aprovacao, data_inicio, data_fim);
        
            res.json(servicos);
        } catch (err) {
            if (err instanceof Error) {
              return res.status(400).json({ message: err.message });
            }
          }
    }, 
    
    delete: async (req: AuthenticatedUserRequest,res: Response) => {
        try {
            const { idservico } = req.params;
            const { empresaId } = req.user!;
            
            const servicos = await deleteDadosServicoByEmpresaServico(empresaId, Number(idservico));
        
            res.json(servicos);
        } catch (err) {
            if (err instanceof Error) {
              return res.status(400).json({ message: err.message });
            }
          }
    }
}