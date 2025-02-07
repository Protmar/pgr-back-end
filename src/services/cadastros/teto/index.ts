import { CadastroTeto } from "../../../models/Tetos";

const formatarNome = (nome: string) => {
    if (!nome) return "";
    const palavras = nome.toLowerCase().split(" ");
    palavras[0] = palavras[0].charAt(0).toUpperCase() + palavras[0].slice(1);
    return palavras.join(" ");
};

export const tetoPostService = async (empresaId:string, descricao:string) => {
    const descricaoFormatada = formatarNome(descricao);
    try {
         const data = await CadastroTeto.create({
            empresa_id: Number(empresaId),
            descricao: descricaoFormatada
         })

         return data;
    } catch (error) {
        console.log(error);
    }
}

export const tetoGetAllService = async (empresaId:string) => {
    try {
         const data = await CadastroTeto.findAll({
            where: {
                empresa_id: Number(empresaId)
            }
         })

         return data;
    } catch (error) {
        console.log(error);
    }
}

export const tetoGetService = async (empresaId:string, idsetor:string) => {
    try {
         const data = await CadastroTeto.findOne({
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

export const tetoDeleteService = (empresaId:string, idsetor:string) => {
    try {
         const data = CadastroTeto.destroy({
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

export const tetoPutService = (empresaId:string, descricao:string, setorId:string) => {
    const descricaoFormatada = formatarNome(descricao);
    try {
         const data = CadastroTeto.update({
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
