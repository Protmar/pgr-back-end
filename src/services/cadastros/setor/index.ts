import { CadastroSetor } from "../../../models/Setores";

const formatarNome = (nome: string) => {
    if (!nome) return "";
    const palavras = nome.toLowerCase().split(" ");
    palavras[0] = palavras[0].charAt(0).toUpperCase() + palavras[0].slice(1);
    return palavras.join(" ");
};

export const setorPostService = async (empresaId:string, descricao:string) => {
    const descricaoFormatada = formatarNome(descricao);
    try {
         const data = await CadastroSetor.create({
            empresa_id: Number(empresaId),
            descricao: descricaoFormatada
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
    const descricaoFormatada = formatarNome(descricao);
    try {
         const data = CadastroSetor.update({
            descricao: descricaoFormatada
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
