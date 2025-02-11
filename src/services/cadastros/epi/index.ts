import { CadastroEpi } from "../../../models/Epis";


export const epiPostService = async (empresaId:string, descricao:string) => {
    try {
         const data = await CadastroEpi.create({
            empresa_id: Number(empresaId),
            descricao
         })

         return data;
    } catch (error) {
        console.log(error);
    }
}

export const epiGetAllService = async (empresaId:string) => {
    try {
         const data = await CadastroEpi.findAll({
            where: {
                empresa_id: Number(empresaId)
            }
         })

         return data;
    } catch (error) {
        console.log(error);
    }
}

export const epiGetService = async (empresaId:string, idepi:string) => {
    try {
         const data = await CadastroEpi.findOne({
            where: {
                empresa_id: Number(empresaId),
                id: idepi
            }
         })

         return data
    } catch (error) {
        console.log(error);
    }
}

export const epiDeleteService = (empresaId:string, idepi:string) => {
    try {
         const data = CadastroEpi.destroy({
            where: {
                empresa_id: Number(empresaId),
                id: idepi
            }   
         })

         return data
    } catch (error) {
        console.log(error);
    }
}

export const epiPutService = (empresaId:string, descricao:string, epiId:string) => {
    try {
         const data = CadastroEpi.update({
            descricao
         }, {
            where: {
                empresa_id: Number(empresaId),
                id: epiId
            }
         })

         return data
    } catch (error) {
        console.log(error);
    }
}
