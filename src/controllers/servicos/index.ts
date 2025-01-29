import { AuthenticatedUserRequest } from "../../middleware";
import { deleteDadosServicoByEmpresaServico, getDadosServicoByEmpresaServico, getDadosServicosByEmpresaCliente, getDadosServicosService, putDadosServicosService } from "../../services/servicos";

export const dadosServicos = {
    post: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { cliente_id, descricao, responsavel_aprovacao, cargo_responsavel_aprovacao, data_inicio, data_fim } = req.body;

            const { empresaId } = req.user!;
            
            const newServico = await getDadosServicosService(empresaId, cliente_id, descricao, responsavel_aprovacao, cargo_responsavel_aprovacao, data_inicio, data_fim);
        
            res.json(newServico);
        } catch (error) {
            console.error("Erro ao criar servico:", error);
        }
    },

    get: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idservico } = req.params;
            
            const servicos = await getDadosServicoByEmpresaServico(empresaId, Number(idservico));
        
            res.json(servicos);
        } catch (error) {
            console.error("Erro ao buscar servicos:", error);
        }
    },

    getServicosByCliente: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { empresaId } = req.user!;
            const { idcliente } = req.params;
            
            const servicos = await getDadosServicosByEmpresaCliente(empresaId, Number(idcliente));
        
            res.json(servicos);
        } catch (error) {
            console.error("Erro ao buscar servicos:", error);
        }
    },

    put: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { idservico } = req.params;
            const { empresaId } = req.user!;
            const { descricao, responsavel_aprovacao, cargo_responsavel_aprovacao, data_inicio, data_fim } = req.body;
            
            const servicos = await putDadosServicosService(empresaId, Number(idservico), descricao, responsavel_aprovacao, cargo_responsavel_aprovacao, data_inicio, data_fim);
        
            res.json(servicos);
        } catch (error) {
            console.error("Erro ao buscar servicos:", error);
        }
    }, 
    
    delete: async (req: AuthenticatedUserRequest, res: any): Promise<void> => {
        try {
            const { idservico } = req.params;
            const { empresaId } = req.user!;
            
            const servicos = await deleteDadosServicoByEmpresaServico(empresaId, Number(idservico));
        
            res.json(servicos);
        } catch (error) {
            console.error("Erro ao buscar servicos:", error);
        }
    }
}