import { CadastroIluminacao } from "../../../models/Cadastro_iluminacao";
import { CadastroRac } from "../../../models/Cadastro_rac";


export const iluminacaoPostService = async (empresaId:string, descricao:string) => {
    try {
         const data = await CadastroIluminacao.create({
            empresa_id: Number(empresaId),
            descricao
         })

         return data;
    } catch (error) {
        console.log(error);
    }
}

export const iluminacaoGetAllService = async (empresaId:string) => {
    try {
         const data = await CadastroIluminacao.findAll({
            where: {
                empresa_id: Number(empresaId)
            }
         })

         return data;
    } catch (error) {
        console.log(error);
    }
}

export const iluminacaoGetService = async (empresaId:string, iluminacaoId:string) => {
    try {
         const data = await CadastroIluminacao.findOne({
            where: {
                empresa_id: Number(empresaId),
                id: iluminacaoId
            }
         })

         return data
    } catch (error) {
        console.log(error);
    }
}

export const iluminacaoDeleteService = (empresaId:string, iluminacaoId:string) => {
    try {
         const data = CadastroIluminacao.destroy({
            where: {
                empresa_id: Number(empresaId),
                id: iluminacaoId
            }   
         })

         return data
    } catch (error) {
        console.log(error);
    }
}

export const iluminacaoPutService = (empresaId:string, descricao:string, iluminacaoId:string) => {
    try {
         const data = CadastroIluminacao.update({
            descricao
         }, {
            where: {
                empresa_id: Number(empresaId),
                id: iluminacaoId
            }
         })

         return data
    } catch (error) {
        console.log(error);
    }
}
