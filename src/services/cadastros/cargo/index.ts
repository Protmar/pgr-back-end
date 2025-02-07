import { CadastroGerencia } from "../../../models/Gerencias";
import { CadastroCargo } from "../../../models/Cargos";

const formatarNome = (nome: string) => {
    if (!nome) return "";
    const palavras = nome.toLowerCase().split(" ");
    palavras[0] = palavras[0].charAt(0).toUpperCase() + palavras[0].slice(1);
    return palavras.join(" ");
};

export const cargoPostService = async (empresaId:string, descricao:string) => {
    const descricaoFormatada = formatarNome(descricao);
    try {
         const data = await CadastroCargo.create({
            empresa_id: Number(empresaId),
            descricao: descricaoFormatada
         })

         return data;
    } catch (error) {
        console.log(error);
    }
}

export const cargoGetAllService = async (empresaId:string) => {
    try {
         const data = await CadastroCargo.findAll({
            where: {
                empresa_id: Number(empresaId)
            }
         })

         return data;
    } catch (error) {
        console.log(error);
    }
}

export const cargoGetService = async (empresaId:string, idcargo:string) => {
    try {
         const data = await CadastroCargo.findOne({
            where: {
                empresa_id: Number(empresaId),
                id: idcargo
            }
         })

         return data
    } catch (error) {
        console.log(error);
    }
}

export const cargoDeleteService = (empresaId:string, idcargo:string) => {
    try {
         const data = CadastroCargo.destroy({
            where: {
                empresa_id: Number(empresaId),
                id: idcargo
            }   
         })

         return data
    } catch (error) {
        console.log(error);
    }
}

export const cargoPutService = (empresaId:string, descricao:string, cargoId:string) => {
    const descricaoFormatada = formatarNome(descricao);
    try {
         const data = CadastroCargo.update({
            descricao: descricaoFormatada
         }, {
            where: {
                empresa_id: Number(empresaId),
                id: cargoId
            }
         })

         return data
    } catch (error) {
        console.log(error);
    }
}
