import { CadastroTeto } from "../../../models/Cadastro_teto";

export const tetoPostService = async (empresaId:string, descricao:string) => {
    try {
         const data = await CadastroTeto.create({
            empresa_id: Number(empresaId),
            descricao
         })

         return data;
    } catch (error) {
        console.log(error);
    }
}

export const tetoGetAllService = async (empresaId:string) => {
    try {
         const data = await CadastroTeto.findAll({
            where: {
                empresa_id: Number(empresaId)
            }
         })

         return data;
    } catch (error) {
        console.log(error);
    }
}

export const tetoGetService = async (empresaId:string, idsetor:string) => {
    try {
         const data = await CadastroTeto.findOne({
            where: {
                empresa_id: Number(empresaId),
                id: idsetor
            }
         })

         return data
    } catch (error) {
        console.log(error);
    }
}

export const tetoDeleteService = (empresaId:string, idsetor:string) => {
    try {
         const data = CadastroTeto.destroy({
            where: {
                empresa_id: Number(empresaId),
                id: idsetor
            }   
         })

         return data
    } catch (error) {
        console.log(error);
    }
}

export const tetoPutService = (empresaId:string, descricao:string, setorId:string) => {
    try {
         const data = CadastroTeto.update({
            descricao
         }, {
            where: {
                empresa_id: Number(empresaId),
                id: setorId
            }
         })

         return data
    } catch (error) {
        console.log(error);
    }
}
