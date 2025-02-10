import { CadastroPiso } from "../../../models/Pisos";

export const pisoPostService = async (empresaId:string, descricao:string) => {
    try {
         const data = await CadastroPiso.create({
            empresa_id: Number(empresaId),
            descricao
         })

         return data;
    } catch (error) {
        console.log(error);
    }
}

export const pisoGetAllService = async (empresaId:string) => {
    try {
         const data = await CadastroPiso.findAll({
            where: {
                empresa_id: Number(empresaId)
            }
         })

         return data;
    } catch (error) {
        console.log(error);
    }
}

export const pisoGetService = async (empresaId:string, idpiso:string) => {
    try {
         const data = await CadastroPiso.findOne({
            where: {
                empresa_id: Number(empresaId),
                id: idpiso
            }
         })

         return data
    } catch (error) {
        console.log(error);
    }
}

export const pisoDeleteService = (empresaId:string, idpiso:string) => {
    try {
         const data = CadastroPiso.destroy({
            where: {
                empresa_id: Number(empresaId),
                id: idpiso
            }   
         })

         return data
    } catch (error) {
        console.log(error);
    }
}

export const pisoPutService = (empresaId:string, descricao:string, pisoId:string) => {
    try {
         const data = CadastroPiso.update({
            descricao
         }, {
            where: {
                empresa_id: Number(empresaId),
                id: pisoId
            }
         })

         return data
    } catch (error) {
        console.log(error);
    }
}
