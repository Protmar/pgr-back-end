import { CadastroMedidaDeControle } from "../../../models/MedidasDeControles";


export const medidaDeControlePostService = async (empresaId:string, descricao:string) => {
    try {
         const data = await CadastroMedidaDeControle.create({
            empresa_id: Number(empresaId),
            descricao
         })

         return data;
    } catch (error) {
        console.log(error);
    }
}

export const medidaDeControleGetAllService = async (empresaId:string) => {
    try {
         const data = await CadastroMedidaDeControle.findAll({
            where: {
                empresa_id: Number(empresaId)
            }
         })

         return data;
    } catch (error) {
        console.log(error);
    }
}

export const medidaDeControleGetService = async (empresaId:string, idmedidadecontrole:string) => {
    try {
         const data = await CadastroMedidaDeControle.findOne({
            where: {
                empresa_id: Number(empresaId),
                id: idmedidadecontrole
            }
         })

         return data
    } catch (error) {
        console.log(error);
    }
}

export const medidaDeControleDeleteService = (empresaId:string, idmedidadecontrole:string) => {
    try {
         const data = CadastroMedidaDeControle.destroy({
            where: {
                empresa_id: Number(empresaId),
                id: idmedidadecontrole
            }   
         })

         return data
    } catch (error) {
        console.log(error);
    }
}

export const medidaDeControlePutService = (empresaId:string, descricao:string, medidadecontroleId:string) => {
    try {
         const data = CadastroMedidaDeControle.update({
            descricao
         }, {
            where: {
                empresa_id: Number(empresaId),
                id: medidadecontroleId
            }
         })

         return data
    } catch (error) {
        console.log(error);
    }
}
