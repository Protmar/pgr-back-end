import { CadastroMedidaControleAdministrativaExistente } from "../../../../models/MedidaControleAdministrativaExistente";


const formatarNome = (nome: string) => {
    if (!nome) return "";
    const palavras = nome.toLowerCase().split(" ");
    palavras[0] = palavras[0].charAt(0).toUpperCase() + palavras[0].slice(1);
    return palavras.join(" ");
};

export const administrativaExistentePostService = async (empresaId:string, descricao:string) => {
    const descricaoFormatada = formatarNome(descricao);
    try {
         const data = await CadastroMedidaControleAdministrativaExistente.create({
            empresa_id: Number(empresaId),
            descricao: descricaoFormatada
         })

         return data;
    } catch (error) {
        console.log(error);
    }
}

export const administrativaExistenteGetAllService = async (empresaId:string) => {
    try {
         const data = await CadastroMedidaControleAdministrativaExistente.findAll({
            where: {
                empresa_id: Number(empresaId)
            }
         })

         return data;
    } catch (error) {
        console.log(error);
    }
}

export const administrativaExistenteGetService = async (empresaId:string, administrativaexistente:string) => {
    try {
         const data = await CadastroMedidaControleAdministrativaExistente.findOne({
            where: {
                empresa_id: Number(empresaId),
                id: administrativaexistente
            }
         })

         return data
    } catch (error) {
        console.log(error);
    }
}

export const administrativaExistenteDeleteService = (empresaId:string, administrativaexistente:string) => {
    try {
         const data = CadastroMedidaControleAdministrativaExistente.destroy({
            where: {
                empresa_id: Number(empresaId),
                id: administrativaexistente
            }   
         })

         return data
    } catch (error) {
        console.log(error);
    }
}

export const administrativaExistentePutService = (empresaId:string, descricao:string, administrativaexistenteId:string) => {
    const descricaoFormatada = formatarNome(descricao);
    try {
         const data = CadastroMedidaControleAdministrativaExistente.update({
            descricao: descricaoFormatada
         }, {
            where: {
                empresa_id: Number(empresaId),
                id: administrativaexistenteId
            }
         })

         return data
    } catch (error) {
        console.log(error);
    }
}
