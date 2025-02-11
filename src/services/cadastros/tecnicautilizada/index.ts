import { CadastroTecnicaUtilizada } from "../../../models/TecnicasUtilizadas";

export const tecnicaUtilizadaPostService = async (empresaId:string, descricao:string) => {
    try {
         const data = await CadastroTecnicaUtilizada.create({
            empresa_id: Number(empresaId),
            descricao
         })

         return data;
    } catch (error) {
        console.log(error);
    }
}

export const tecnicaUtilizadaGetAllService = async (empresaId:string) => {
    try {
         const data = await CadastroTecnicaUtilizada.findAll({
            where: {
                empresa_id: Number(empresaId)
            }
         })

         return data;
    } catch (error) {
        console.log(error);
    }
}

export const tecnicaUtilizadaGetService = async (empresaId:string, tecnicautilizada:string) => {
    try {
         const data = await CadastroTecnicaUtilizada.findOne({
            where: {
                empresa_id: Number(empresaId),
                id: tecnicautilizada
            }
         })

         return data
    } catch (error) {
        console.log(error);
    }
}

export const tecnicaUtilizadaDeleteService = (empresaId:string, tecnicautilizada:string) => {
    try {
         const data = CadastroTecnicaUtilizada.destroy({
            where: {
                empresa_id: Number(empresaId),
                id: tecnicautilizada
            }   
         })

         return data
    } catch (error) {
        console.log(error);
    }
}

export const tecnicaUtilizadaPutService = (empresaId:string, descricao:string, tecnicautilizadaId:string) => {
    try {
         const data = CadastroTecnicaUtilizada.update({
            descricao
         }, {
            where: {
                empresa_id: Number(empresaId),
                id: tecnicautilizadaId
            }
         })

         return data
    } catch (error) {
        console.log(error);
    }
}
