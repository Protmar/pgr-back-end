import { CadastroFuncao } from "../../../models/Cadastro_funcao"

export const funcaoPostService = async (empresaId:string, descricao:string) => {
    try {
        const data = await CadastroFuncao.create({
            empresa_id: Number(empresaId),
            descricao
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
    try {
        const data = CadastroFuncao.update({
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