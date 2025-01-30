import { CadastroGerencia } from "../../../models/Cadastro_gerencia";
import { CadastroSetor } from "../../../models/CadastroSetor";

export const setorPostService = async (empresaId:string, descricao:string) => {
    try {
         const data = await CadastroSetor.create({
            empresa_id: Number(empresaId),
            descricao
         })

         return data;
    } catch (error) {
        console.log(error);
    }
}

export const setorGetAllService = async (empresaId:string) => {
    try {
         const data = await CadastroSetor.findAll({
            where: {
                empresa_id: Number(empresaId)
            }
         })

         return data;
    } catch (error) {
        console.log(error);
    }
}

export const setorGetService = async (empresaId:string, idsetor:string) => {
    try {
         const data = await CadastroSetor.findOne({
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

export const setorDeleteService = (empresaId:string, idsetor:string) => {
    try {
         const data = CadastroSetor.destroy({
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

export const setorPutService = (empresaId:string, descricao:string, setorId:string) => {
    try {
         const data = CadastroSetor.update({
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
