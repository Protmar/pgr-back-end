import { CadastroMedidaControleIndividualExistente } from "../../../../models/MedidaControleIndividualExistente";


const formatarNome = (nome: string) => {
    if (!nome) return "";
    const palavras = nome.toLowerCase().split(" ");
    palavras[0] = palavras[0].charAt(0).toUpperCase() + palavras[0].slice(1);
    return palavras.join(" ");
};

export const individualExistentePostService = async (empresaId:string, descricao:string) => {
    const descricaoFormatada = formatarNome(descricao);
    try {
         const data = await CadastroMedidaControleIndividualExistente.create({
            empresa_id: Number(empresaId),
            descricao: descricaoFormatada
         })

         return data;
    } catch (error) {
        console.log(error);
    }
}

export const individualExistenteGetAllService = async (empresaId:string) => {
    try {
         const data = await CadastroMedidaControleIndividualExistente.findAll({
            where: {
                empresa_id: Number(empresaId)
            }
         })

         return data;
    } catch (error) {
        console.log(error);
    }
}

export const individualExistenteGetService = async (empresaId:string, individualexistente:string) => {
    try {
         const data = await CadastroMedidaControleIndividualExistente.findOne({
            where: {
                empresa_id: Number(empresaId),
                id: individualexistente
            }
         })

         return data
    } catch (error) {
        console.log(error);
    }
}

export const individualExistenteDeleteService = (empresaId:string, individualexistente:string) => {
    try {
         const data = CadastroMedidaControleIndividualExistente.destroy({
            where: {
                empresa_id: Number(empresaId),
                id: individualexistente
            }   
         })

         return data
    } catch (error) {
        console.log(error);
    }
}

export const individualExistentePutService = (empresaId:string, descricao:string, individualexistenteId:string) => {
    const descricaoFormatada = formatarNome(descricao);
    try {
         const data = CadastroMedidaControleIndividualExistente.update({
            descricao: descricaoFormatada
         }, {
            where: {
                empresa_id: Number(empresaId),
                id: individualexistenteId
            }
         })

         return data
    } catch (error) {
        console.log(error);
    }
}
