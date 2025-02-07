import { CadastroGerencia } from "../../../models/Gerencias";

const formatarNome = (nome: string) => {
    if (!nome) return "";
    const palavras = nome.toLowerCase().split(" ");
    palavras[0] = palavras[0].charAt(0).toUpperCase() + palavras[0].slice(1);
    return palavras.join(" ");
};

export const gerenciaPostService = async (empresaId:string, descricao:string) => {
    const descricaoFormatada = formatarNome(descricao);
    try {
         const data = await CadastroGerencia.create({
            empresa_id: Number(empresaId),
            descricao: descricaoFormatada
         })

         return data;
    } catch (error) {
        console.log(error);
    }
}

export const gerenciaGetAllService = async (empresaId:string) => {
    try {
         const data = await CadastroGerencia.findAll({
            where: {
                empresa_id: Number(empresaId)
            }
         })

         return data;
    } catch (error) {
        console.log(error);
    }
}

export const gerenciaGetService = async (empresaId:string, idgerencia:string) => {
    try {
         const data = await CadastroGerencia.findOne({
            where: {
                empresa_id: Number(empresaId),
                id: idgerencia
            }
         })

         return data
    } catch (error) {
        console.log(error);
    }
}

export const gerenciaDeleteService = (empresaId:string, idgerencia:string) => {
    try {
         const data = CadastroGerencia.destroy({
            where: {
                empresa_id: Number(empresaId),
                id: idgerencia
            }   
         })

         return data
    } catch (error) {
        console.log(error);
    }
}

export const gerenciaPutService = (empresaId:string, descricao:string, gerenciaId:string) => {
    const descricaoFormatada = formatarNome(descricao);
    try {
         const data = CadastroGerencia.update({
            descricao: descricaoFormatada
         }, {
            where: {
                empresa_id: Number(empresaId),
                id: gerenciaId
            }
         })

         return data
    } catch (error) {
        console.log(error);
    }
}