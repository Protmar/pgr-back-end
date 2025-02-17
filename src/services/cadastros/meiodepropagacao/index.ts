import { CadastroMeioDePropagacao } from "../../../models/MeiosDePropagacoes";

const formatarNome = (nome: string) => {
    if (!nome) return "";
    const palavras = nome.toLowerCase().split(" ");
    palavras[0] = palavras[0].charAt(0).toUpperCase() + palavras[0].slice(1);
    return palavras.join(" ");
};

export const meioDePropagacaoPostService = async (empresaId:string, descricao:string) => {
    const descricaoFormatada = formatarNome(descricao);
    try {
         const data = await CadastroMeioDePropagacao.create({
            empresa_id: Number(empresaId),
            descricao: descricaoFormatada
         })

         return data;
    } catch (error) {
        console.log(error);
    }
}

export const meioDePropagacaoGetAllService = async (empresaId:string) => {
    try {
         const data = await CadastroMeioDePropagacao.findAll({
            where: {
                empresa_id: Number(empresaId)
            }
         })

         return data;
    } catch (error) {
        console.log(error);
    }
}

export const meioDePropagacaoGetService = async (empresaId:string, idmeiodepropagacao:string) => {
    try {
         const data = await CadastroMeioDePropagacao.findOne({
            where: {
                empresa_id: Number(empresaId),
                id: idmeiodepropagacao
            }
         })

         return data
    } catch (error) {
        console.log(error);
    }
}

export const meioDePropagacaoDeleteService = (empresaId:string, idmeiodepropagacao:string) => {
    try {
         const data = CadastroMeioDePropagacao.destroy({
            where: {
                empresa_id: Number(empresaId),
                id: idmeiodepropagacao
            }   
         })

         return data
    } catch (error) {
        console.log(error);
    }
}

export const meioDePropagacaoPutService = (empresaId:string, descricao:string, meiodepropagacaoId:string) => {
    const descricaoFormatada = formatarNome(descricao);
    try {
         const data = CadastroMeioDePropagacao.update({
            descricao: descricaoFormatada
         }, {
            where: {
                empresa_id: Number(empresaId),
                id: meiodepropagacaoId
            }
         })

         return data
    } catch (error) {
        console.log(error);
    }
}
