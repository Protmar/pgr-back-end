import { CadastroMobiliario } from "../../../models/Mobiliarios";


export const mobiliariosPostService = async (empresaId:string, descricao:string) => {
    try {
         const data = await CadastroMobiliario.create({
            empresa_id: Number(empresaId),
            descricao
         })

         return data;
    } catch (error) {
        console.log(error);
    }
}

export const mobiliariosGetAllService = async (empresaId:string) => {
    try {
         const data = await CadastroMobiliario.findAll({
            where: {
                empresa_id: Number(empresaId)
            }
         })

         return data;
    } catch (error) {
        console.log(error);
    }
}

export const mobiliariosGetService = async (empresaId:string, idmobiliarios:string) => {
    try {
         const data = await CadastroMobiliario.findOne({
            where: {
                empresa_id: Number(empresaId),
                id: idmobiliarios
            }
         })

         return data
    } catch (error) {
        console.log(error);
    }
}

export const mobiliariosDeleteService = (empresaId:string, idmobiliarios:string) => {
    try {
         const data = CadastroMobiliario.destroy({
            where: {
                empresa_id: Number(empresaId),
                id: idmobiliarios
            }   
         })

         return data
    } catch (error) {
        console.log(error);
    }
}

export const mobiliariosPutService = (empresaId:string, descricao:string, mobiliariosId:string) => {
    try {
         const data = CadastroMobiliario.update({
            descricao
         }, {
            where: {
                empresa_id: Number(empresaId),
                id: mobiliariosId
            }
         })

         return data
    } catch (error) {
        console.log(error);
    }
}
