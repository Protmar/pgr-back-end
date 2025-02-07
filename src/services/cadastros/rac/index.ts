import { CadastroRac } from "../../../models/Cadastro_rac";


export const racPostService = async (empresaId:string, descricao:string) => {
    try {
         const data = await CadastroRac.create({
            empresa_id: Number(empresaId),
            descricao
         })

         return data;
    } catch (error) {
        console.log(error);
    }
}

export const racGetAllService = async (empresaId:string) => {
    try {
         const data = await CadastroRac.findAll({
            where: {
                empresa_id: Number(empresaId)
            }
         })

         return data;
    } catch (error) {
        console.log(error);
    }
}

export const racGetService = async (empresaId:string, racId:string) => {
    try {
         const data = await CadastroRac.findOne({
            where: {
                empresa_id: Number(empresaId),
                id: racId
            }
         })

         return data
    } catch (error) {
        console.log(error);
    }
}

export const racDeleteService = (empresaId:string, racId:string) => {
    try {
         const data = CadastroRac.destroy({
            where: {
                empresa_id: Number(empresaId),
                id: racId
            }   
         })

         return data
    } catch (error) {
        console.log(error);
    }
}

export const racPutService = (empresaId:string, descricao:string, racId:string) => {
    try {
         const data = CadastroRac.update({
            descricao
         }, {
            where: {
                empresa_id: Number(empresaId),
                id: racId
            }
         })

         return data
    } catch (error) {
        console.log(error);
    }
}
