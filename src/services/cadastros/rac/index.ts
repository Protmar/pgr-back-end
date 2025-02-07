import { CadastroRac } from "../../../models/Racs";

const formatarNome = (nome: string) => {
    if (!nome) return "";
    const palavras = nome.toLowerCase().split(" ");
    palavras[0] = palavras[0].charAt(0).toUpperCase() + palavras[0].slice(1);
    return palavras.join(" ");
};

export const racPostService = async (empresaId:string, descricao:string) => {
    const descricaoFormatada = formatarNome(descricao);
    try {
         const data = await CadastroRac.create({
            empresa_id: Number(empresaId),
            descricao: descricaoFormatada
         })

         return data;
    } catch (error) {
        console.log(error);
    }
}

export const racGetAllService = async (empresaId:string) => {
    try {
         const data = await CadastroRac.findAll({
            where: {
                empresa_id: Number(empresaId)
            }
         })

         return data;
    } catch (error) {
        console.log(error);
    }
}

export const racGetService = async (empresaId:string, racId:string) => {
    try {
         const data = await CadastroRac.findOne({
            where: {
                empresa_id: Number(empresaId),
                id: racId
            }
         })

         return data
    } catch (error) {
        console.log(error);
    }
}

export const racDeleteService = (empresaId:string, racId:string) => {
    try {
         const data = CadastroRac.destroy({
            where: {
                empresa_id: Number(empresaId),
                id: racId
            }   
         })

         return data
    } catch (error) {
        console.log(error);
    }
}

export const racPutService = (empresaId:string, descricao:string, racId:string) => {
    const descricaoFormatada = formatarNome(descricao);
    try {
         const data = CadastroRac.update({
            descricao: descricaoFormatada
         }, {
            where: {
                empresa_id: Number(empresaId),
                id: racId
            }
         })

         return data
    } catch (error) {
        console.log(error);
    }
}
