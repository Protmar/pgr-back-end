import { AuthenticatedUserRequest } from "../../middleware";
import { deleteDadosTrabalhadorService, getDadosAllTrabalhadoresService, getDadosTrabalhadorService, postDadosTrabalhadorService, putDadosTrabalhadorService } from "../../services/cadastros/trabalhadores";

export const dadosTrabalhador = {
    postTrabalhador: async (req: AuthenticatedUserRequest, res: any) => {
        try {
            const { empresaId } = req.user!;
            const { 
                gerencia_id, 
                cargo_id, 
                setor_id, 
                codigo, 
                nome, 
                genero, 
                data_nascimento, 
                cpf, 
                rg, 
                nis_pis, 
                ctps, 
                serie, 
                uf, 
                jornada_trabalho,
                dataCargo
            } = req.body;
            
            const data = await postDadosTrabalhadorService(empresaId.toString(), gerencia_id, cargo_id, setor_id, codigo, nome, genero, data_nascimento, cpf, rg, nis_pis, ctps, serie, uf, jornada_trabalho, dataCargo);
            
            res.send(data);
        } catch (error) {
            console.log(error);
        }
    },

    getAllTrabalhadores: async (req: AuthenticatedUserRequest, res: any) => {
        try {
            const { empresaId } = req.user!;
            const data = await getDadosAllTrabalhadoresService(empresaId.toString());
            res.send(data);
        } catch (error) {
            console.log(error);
        }
    },

    getTrabalhador: async (req: AuthenticatedUserRequest, res: any) => {
        try {
            const { empresaId } = req.user!;
            const { idtrabalhador } = req.params;
            const data = await getDadosTrabalhadorService(empresaId.toString(), idtrabalhador);
            res.send(data);
        } catch (error) {
            console.log(error);
        }
    },

    putTrabalhador: async (req: AuthenticatedUserRequest, res: any) => {
        try {
            const { empresaId } = req.user!;
            const { idtrabalhador } = req.params;
            const { 
                gerencia_id, 
                cargo_id, 
                setor_id, 
                codigo, 
                nome, 
                genero, 
                data_nascimento, 
                cpf, 
                rg, 
                nis_pis, 
                ctps, 
                serie, 
                uf, 
                jornada_trabalho,
                cargoString
            } = req.body;   

            const data = await putDadosTrabalhadorService(empresaId.toString(), idtrabalhador, gerencia_id, cargo_id, setor_id, codigo, nome, genero, data_nascimento, cpf, rg, nis_pis, ctps, serie, uf, jornada_trabalho, cargoString);
            
            res.send(data);
        } catch (error) {
            console.log(error);
        }    
    },
    
    deleteTrabalhador: async (req: AuthenticatedUserRequest, res: any) => {
        try {
            const { empresaId } = req.user!;
            const { idtrabalhador } = req.params;
            const data = await deleteDadosTrabalhadorService(empresaId.toString(), idtrabalhador);
            res.send(data);
        } catch (error) {
            console.log(error);
        }
    }
}