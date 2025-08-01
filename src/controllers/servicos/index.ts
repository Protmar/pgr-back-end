import { Response } from "express";
import { AuthenticatedUserRequest } from "../../middleware";
import { deleteDadosServicoByEmpresaServico, getDadosServicoByEmpresaServico, getDadosServicosByEmpresaCliente, getDadosServicosByEmpresaClienteId, getDadosServicosService, getOneServico, putDadosServicosService } from "../../services/servicos";
import NodeCache from "node-cache";
import { User } from "../../models";

const cache = new NodeCache({ stdTTL: 0 });
function setCache(key: string, value: number) {
  cache.set(key, value);
}

// Função para recuperar do cache
function getCache(key: string) {
    return cache.get(key);
}

export const dadosServicos = {
    post: async (req: AuthenticatedUserRequest,res: Response) => {
        try {
            const { cliente_id, descricao, responsavel_aprovacao, id_responsavel_aprovacao, cargo_responsavel_aprovacao, data_inicio, data_fim } = req.body;

            const { empresaId } = req.user!;
            
            const newServico = await getDadosServicosService(empresaId, cliente_id, descricao, responsavel_aprovacao,id_responsavel_aprovacao, cargo_responsavel_aprovacao, data_inicio, data_fim);
        
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
            const userId = req.user!.id;            
            const servicos = await getDadosServicosByEmpresaCliente(empresaId, userId);
        
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
            const { descricao, responsavel_aprovacao, id_responsavel_aprovacao, cargo_responsavel_aprovacao, data_inicio, data_fim, base_document_url_pgr, base_document_url_pgrtr, base_document_url_ltcat, memorial_descritivo_processo_pgr, memorial_descritivo_processo_pgrtr, memorial_descritivo_processo_ltcat } = req.body;
            
            const servicos = await putDadosServicosService(empresaId, Number(idservico), {descricao, responsavel_aprovacao, id_responsavel_aprovacao, cargo_responsavel_aprovacao, data_inicio, data_fim, base_document_url_pgr, base_document_url_pgrtr, base_document_url_ltcat, memorial_descritivo_processo_pgr, memorial_descritivo_processo_pgrtr, memorial_descritivo_processo_ltcat});  
        
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
    },

    selecionarServico: async (req: AuthenticatedUserRequest,res: Response) => {
        try {
            const { servico_id } = req.body;
            
            User.update({
              servicoselecionado: servico_id
            }, {
              where: { id: req.user!.id }
            })

            globalThis.servico_id = servico_id;
            
            return res.status(200).json({
              message: "Servico selecionado com sucesso!",
              servico_id,
          });
        } catch (err) {
            if (err instanceof Error) {
              return res.status(400).json({ message: err.message });
            }
          }
    },

    getCache: async (req: AuthenticatedUserRequest, res: Response) => {
      try {
        const { key } = req.params;
        
        console.log("Chave recebida:", key);
        const value = getCache(key);
        
        console.log("Valor recuperado do cache:", value);
        
        if (value === undefined) {
          return res.status(404).json({ message: "Chave não encontrada no cache" });
        }
    
        res.json(value);
      } catch (err) {
        if (err instanceof Error) {
          return res.status(400).json({ message: err.message });
        }
      }
    },
    
    getServicosByClienteId: async (req: AuthenticatedUserRequest, res: Response) => {
        try {
            const { idcliente } = req.params;
            const { empresaId } = req.user!;
            const userId = req.user!.id;
            
            const servicos = await getDadosServicosByEmpresaClienteId(empresaId, Number(idcliente), userId);
        
            res.json(servicos);
        } catch (err) {
            if (err instanceof Error) {
              return res.status(400).json({ message: err.message });
            }
          }
    },
    
    getOneServico: async (req: AuthenticatedUserRequest, res: Response) => {
        try {
            const { empresaId, email } = req.user!;
            
            const servicos = await getOneServico(empresaId, email);
        
            res.json(servicos);
        } catch (err) {
            if (err instanceof Error) {
              return res.status(400).json({ message: err.message });
            }
          }
    }
}