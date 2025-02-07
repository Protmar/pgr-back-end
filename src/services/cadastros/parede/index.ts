import { CadastroParede } from "../../../models/Paredes";

export const paredePostService = async (empresaId:string, descricao:string) => {
    try {
         const data = await CadastroParede.create({
            empresa_id: Number(empresaId),
            descricao
         })

         return data;
    } catch (error) {
        console.log(error);
    }
}

export const paredeGetAllService = async (empresaId:string) => {
    try {
         const data = await CadastroParede.findAll({
            where: {
                empresa_id: Number(empresaId)
            }
         })

         return data;
    } catch (error) {
        console.log(error);
    }
}

export const paredeGetService = async (empresaId:string, idparede:string) => {
    try {
         const data = await CadastroParede.findOne({
            where: {
                empresa_id: Number(empresaId),
                id: idparede
            }
         })

         return data
    } catch (error) {
        console.log(error);
    }
}

export const paredeDeleteService = (empresaId:string, idparede:string) => {
    try {
         const data = CadastroParede.destroy({
            where: {
                empresa_id: Number(empresaId),
                id: idparede
            }   
         })

         return data
    } catch (error) {
        console.log(error);
    }
}

export const paredePutService = (empresaId:string, descricao:string, paredeId:string) => {
    try {
         const data = CadastroParede.update({
            descricao
         }, {
            where: {
                empresa_id: Number(empresaId),
                id: paredeId
            }
         })

         return data
    } catch (error) {
        console.log(error);
    }
}
