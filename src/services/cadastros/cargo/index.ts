import { CadastroGerencia } from "../../../models/Cadastro_gerencia";
import { CadastroCargo } from "../../../models/CadastroCargo";

export const cargoPostService = async (empresaId:string, descricao:string) => {
    try {
         const data = await CadastroCargo.create({
            empresa_id: Number(empresaId),
            descricao
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
    try {
         const data = CadastroCargo.update({
            descricao
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
