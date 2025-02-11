import { CadastroFonteGeradora } from "../../../models/FontesGeradoras";


export const fonteGeradoraPostService = async (empresaId:string, descricao:string) => {
    try {
         const data = await CadastroFonteGeradora.create({
            empresa_id: Number(empresaId),
            descricao
         })

         return data;
    } catch (error) {
        console.log(error);
    }
}

export const fonteGeradoraGetAllService = async (empresaId:string) => {
    try {
         const data = await CadastroFonteGeradora.findAll({
            where: {
                empresa_id: Number(empresaId)
            }
         })

         return data;
    } catch (error) {
        console.log(error);
    }
}

export const fonteGeradoraGetService = async (empresaId:string, idfontegeradora:string) => {
    try {
         const data = await CadastroFonteGeradora.findOne({
            where: {
                empresa_id: Number(empresaId),
                id: idfontegeradora
            }
         })

         return data
    } catch (error) {
        console.log(error);
    }
}

export const fonteGeradoraDeleteService = (empresaId:string, idfontegeradora:string) => {
    try {
         const data = CadastroFonteGeradora.destroy({
            where: {
                empresa_id: Number(empresaId),
                id: idfontegeradora
            }   
         })

         return data
    } catch (error) {
        console.log(error);
    }
}

export const fonteGeradoraPutService = (empresaId:string, descricao:string, fontegeradoraId:string) => {
    try {
         const data = CadastroFonteGeradora.update({
            descricao
         }, {
            where: {
                empresa_id: Number(empresaId),
                id: fontegeradoraId
            }
         })

         return data
    } catch (error) {
        console.log(error);
    }
}
