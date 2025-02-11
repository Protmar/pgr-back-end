import { CadastroExposicao } from "../../../models/Exposicoes";

export const exposicaoPostService = async (empresaId:string, descricao:string) => {
    try {
         const data = await CadastroExposicao.create({
            empresa_id: Number(empresaId),
            descricao
         })

         return data;
    } catch (error) {
        console.log(error);
    }
}

export const exposicaoGetAllService = async (empresaId:string) => {
    try {
         const data = await CadastroExposicao.findAll({
            where: {
                empresa_id: Number(empresaId)
            }
         })

         return data;
    } catch (error) {
        console.log(error);
    }
}

export const exposicaoGetService = async (empresaId:string, idexposicao:string) => {
    try {
         const data = await CadastroExposicao.findOne({
            where: {
                empresa_id: Number(empresaId),
                id: idexposicao
            }
         })

         return data
    } catch (error) {
        console.log(error);
    }
}

export const exposicaoDeleteService = (empresaId:string, idexposicao:string) => {
    try {
         const data = CadastroExposicao.destroy({
            where: {
                empresa_id: Number(empresaId),
                id: idexposicao
            }   
         })

         return data
    } catch (error) {
        console.log(error);
    }
}

export const exposicaoPutService = (empresaId:string, descricao:string, exposicaoId:string) => {
    try {
         const data = CadastroExposicao.update({
            descricao
         }, {
            where: {
                empresa_id: Number(empresaId),
                id: exposicaoId
            }
         })

         return data
    } catch (error) {
        console.log(error);
    }
}
