import { CadastroCursoObrigatorio } from "../../../models/Cadastro_curso_obrigatorio"

export const CursoObrigatorioPostService = async (empresaId:string, descricao:string) => {
    try {
        const data = await CadastroCursoObrigatorio.create({
            empresa_id: Number(empresaId),
            descricao
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
    try {
        const data = CadastroCursoObrigatorio.update({
            descricao
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