import { CadastroFuncao } from "../../../models/Funcoes"

const formatarNome = (nome: string) => {
    if (!nome) return "";
    const palavras = nome.toLowerCase().split(" ");
    palavras[0] = palavras[0].charAt(0).toUpperCase() + palavras[0].slice(1);
    return palavras.join(" ");
};

export const funcaoPostService = async (empresaId:string, descricao:string) => {
    const descricaoFormatada = formatarNome(descricao);
    try {
        const data = await CadastroFuncao.create({
            empresa_id: Number(empresaId),
            descricao: descricaoFormatada
        })

        return data;
    }catch(error){
        console.log(error);
    }
}


export const funcaoGetAllService = async (empresaId:string) => {
    try {
        const data = await CadastroFuncao.findAll({
            where: {
                empresa_id: Number(empresaId)
            }
        })

        return data;
    }catch(error){
        console.log(error);
    }
}

export const funcaoGetService = async (empresaId:string, idfuncao:string) => {
    try {
        const data = await CadastroFuncao.findOne({
            where: {
                empresa_id: Number(empresaId),
                id: idfuncao
            }
        })

        return data
    }catch(error){
        console.log(error);
    }
}

export const funcaoDeleteService = (empresaId:string, idfuncao:string) => {
    try {
        const data = CadastroFuncao.destroy({
            where: {
                empresa_id: Number(empresaId),
                id: idfuncao
            }   
        })

        return data
    }catch(error){
        console.log(error);
    }
}

export const funcaoPutService = (empresaId:string, descricao:string, idfuncao:string) => {
    const descricaoFormatada = formatarNome(descricao);
    try {
        const data = CadastroFuncao.update({
            descricao: descricaoFormatada
        }, {
            where: {
                empresa_id: Number(empresaId),
                id: idfuncao
            }
        })

        return data
    }catch(error){
        console.log(error);
    }
}