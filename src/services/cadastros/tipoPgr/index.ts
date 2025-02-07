import { CadastroTipoPgr } from "../../../models/TipoPgrs";

const formatarNome = (nome: string) => {
    if (!nome) return "";
    const palavras = nome.toLowerCase().split(" ");
    palavras[0] = palavras[0].charAt(0).toUpperCase() + palavras[0].slice(1);
    return palavras.join(" ");
};

export const tipoPgrPostService = async (empresaId:string, descricao:string) => {
    const descricaoFormatada = formatarNome(descricao);
    try {
         const data = await CadastroTipoPgr.create({
            empresa_id: Number(empresaId),
            descricao: descricaoFormatada
         })

         return data;
    } catch (error) {
        console.log(error);
    }
}

export const tipoPgrGetAllService = async (empresaId:string) => {
    try {
         const data = await CadastroTipoPgr.findAll({
            where: {
                empresa_id: Number(empresaId)
            }
         })

         return data;
    } catch (error) {
        console.log(error);
    }
}

export const tipoPgrGetService = async (empresaId:string, tipoPgrId:string) => {
    try {
         const data = await CadastroTipoPgr.findOne({
            where: {
                empresa_id: Number(empresaId),
                id: tipoPgrId
            }
         })

         return data
    } catch (error) {
        console.log(error);
    }
}

export const tipoPgrDeleteService = (empresaId:string, tipoPgrId:string) => {
    try {
         const data = CadastroTipoPgr.destroy({
            where: {
                empresa_id: Number(empresaId),
                id: tipoPgrId
            }   
         })

         return data
    } catch (error) {
        console.log(error);
    }
}

export const tipoPgrPutService = (empresaId:string, descricao:string, tipoPgrId:string) => {
    const descricaoFormatada = formatarNome(descricao);
    try {
         const data = CadastroTipoPgr.update({
            descricao: descricaoFormatada
         }, {
            where: {
                empresa_id: Number(empresaId),
                id: tipoPgrId
            }
         })

         return data
    } catch (error) {
        console.log(error);
    }
}
