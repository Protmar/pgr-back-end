import { CadastroCursoObrigatorio } from "../../../models/Cursosobrigatorios"

const formatarNome = (nome: string) => {
    if (!nome) return "";
    const palavras = nome.toLowerCase().split(" ");
    palavras[0] = palavras[0].charAt(0).toUpperCase() + palavras[0].slice(1);
    return palavras.join(" ");
};

export const CursoObrigatorioPostService = async (empresaId:string, descricao:string) => {
    const descricaoFormatada = formatarNome(descricao);
    try {
        const data = await CadastroCursoObrigatorio.create({
            empresa_id: Number(empresaId),
            descricao: descricaoFormatada
        })

        return data;
    }catch(error){
        console.error(error);
    }
}


export const CursoObrigatorioGetAllService = async (empresaId:string) => {
    try {
        const data = await CadastroCursoObrigatorio.findAll({
            where: {
                empresa_id: Number(empresaId)
            }
        })

        return data;
    }catch(error){
        console.log(error);
    }
}

export const CursoObrigatorioGetService = async (empresaId:string, idCursoObrigatorio:string) => {
    try {
        const data = await CadastroCursoObrigatorio.findOne({
            where: {
                empresa_id: Number(empresaId),
                id: idCursoObrigatorio
            }
        })

        return data
    }catch(error){
        console.log(error);
    }
}

export const CursoObrigatorioDeleteService = (empresaId:string, idCursoObrigatorio:string) => {
    try {
        const data = CadastroCursoObrigatorio.destroy({
            where: {
                empresa_id: Number(empresaId),
                id: idCursoObrigatorio
            }   
        })

        return data
    }catch(error){
        console.log(error);
    }
}

export const CursoObrigatorioPutService = (empresaId:string, descricao:string, idfuncao:string) => {
    const descricaoFormatada = formatarNome(descricao);
    try {
        const data = CadastroCursoObrigatorio.update({
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