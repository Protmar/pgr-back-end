import { CadastroMedidaControleIndividualNecessaria } from "../../../../models/MedidaControleIndividualNecessaria";


const formatarNome = (nome: string) => {
    if (!nome) return "";
    const palavras = nome.toLowerCase().split(" ");
    palavras[0] = palavras[0].charAt(0).toUpperCase() + palavras[0].slice(1);
    return palavras.join(" ");
};

export const individualNecessariaPostService = async (empresaId:string, descricao:string) => {
    const descricaoFormatada = formatarNome(descricao);
    try {
         const data = await CadastroMedidaControleIndividualNecessaria.create({
            empresa_id: Number(empresaId),
            descricao: descricaoFormatada
         })

         return data;
    } catch (error) {
        console.log(error);
    }
}

export const individualNecessariaGetAllService = async (empresaId:string) => {
    try {
         const data = await CadastroMedidaControleIndividualNecessaria.findAll({
            where: {
                empresa_id: Number(empresaId)
            }
         })

         return data;
    } catch (error) {
        console.log(error);
    }
}

export const individualNecessariaGetService = async (empresaId:string, individualnecessaria:string) => {
    try {
         const data = await CadastroMedidaControleIndividualNecessaria.findOne({
            where: {
                empresa_id: Number(empresaId),
                id: individualnecessaria
            }
         })

         return data
    } catch (error) {
        console.log(error);
    }
}

export const individualNecessariaDeleteService = (empresaId:string, individualnecessaria:string) => {
    try {
         const data = CadastroMedidaControleIndividualNecessaria.destroy({
            where: {
                empresa_id: Number(empresaId),
                id: individualnecessaria
            }   
         })

         return data
    } catch (error) {
        console.log(error);
    }
}

export const individualNecessariaPutService = (empresaId:string, descricao:string, individualnecessariaId:string) => {
    const descricaoFormatada = formatarNome(descricao);
    try {
         const data = CadastroMedidaControleIndividualNecessaria.update({
            descricao: descricaoFormatada
         }, {
            where: {
                empresa_id: Number(empresaId),
                id: individualnecessariaId
            }
         })

         return data
    } catch (error) {
        console.log(error);
    }
}
