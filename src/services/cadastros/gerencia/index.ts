import { CadastroGerencia } from "../../../models/Cadastro_gerencia";

export const gerenciaPostService = async (empresaId:string, descricao:string) => {
    try {
         const data = await CadastroGerencia.create({
            empresa_id: Number(empresaId),
            descricao
         })

         return data;
    } catch (error) {
        console.log(error);
    }
}

export const gerenciaGetAllService = async (empresaId:string) => {
    try {
         const data = await CadastroGerencia.findAll({
            where: {
                empresa_id: Number(empresaId)
            }
         })

         return data;
    } catch (error) {
        console.log(error);
    }
}

export const gerenciaGetService = async (empresaId:string, idgerencia:string) => {
    try {
         const data = await CadastroGerencia.findOne({
            where: {
                empresa_id: Number(empresaId),
                id: idgerencia
            }
         })

         return data
    } catch (error) {
        console.log(error);
    }
}

export const gerenciaDeleteService = (empresaId:string, idgerencia:string) => {
    try {
         const data = CadastroGerencia.destroy({
            where: {
                empresa_id: Number(empresaId),
                id: idgerencia
            }   
         })

         return data
    } catch (error) {
        console.log(error);
    }
}

export const gerenciaPutService = (empresaId:string, descricao:string, gerenciaId:string) => {
    try {
         const data = CadastroGerencia.update({
            descricao
         }, {
            where: {
                empresa_id: Number(empresaId),
                id: gerenciaId
            }
         })

         return data
    } catch (error) {
        console.log(error);
    }
}