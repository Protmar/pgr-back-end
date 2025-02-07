import { CadastroEquipamento } from "../../../models/Cadastro_equipamento";

export const equipamentoPostService = async (empresaId:string, descricao:string) => {
    try {
         const data = await CadastroEquipamento.create({
            empresa_id: Number(empresaId),
            descricao
         })

         return data;
    } catch (error) {
        console.log(error);
    }
}

export const equipamentoGetAllService = async (empresaId:string) => {
    try {
         const data = await CadastroEquipamento.findAll({
            where: {
                empresa_id: Number(empresaId)
            }
         })

         return data;
    } catch (error) {
        console.log(error);
    }
}

export const equipamentoGetService = async (empresaId:string, equipamentoId:string) => {
    try {
         const data = await CadastroEquipamento.findOne({
            where: {
                empresa_id: Number(empresaId),
                id: equipamentoId
            }
         })

         return data
    } catch (error) {
        console.log(error);
    }
}

export const equipamentoDeleteService = (empresaId:string, equipamentoId:string) => {
    try {
         const data = CadastroEquipamento.destroy({
            where: {
                empresa_id: Number(empresaId),
                id: equipamentoId
            }   
         })

         return data
    } catch (error) {
        console.log(error);
    }
}

export const equipamentoPutService = (empresaId:string, descricao:string, equipamentoId:string) => {
    try {
         const data = CadastroEquipamento.update({
            descricao
         }, {
            where: {
                empresa_id: Number(empresaId),
                id: equipamentoId
            }
         })

         return data
    } catch (error) {
        console.log(error);
    }
}
