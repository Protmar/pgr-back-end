import Trabalhadores from "../../../models/Trabalhadores";

export const postDadosTrabalhadorService = (empresaId:string, gerencia_id:string, cargo_id:string, setor_id:string, codigo:string, nome:string, genero:string, data_nascimento:string, cpf:string, rg:string, nis_pis:string, ctps:string, serie:string, uf:string, jornada_trabalho:string, cargo:string) => {
    try {
        const data = Trabalhadores.create({ empresa_id: Number(empresaId), gerencia_id: Number(gerencia_id), cargo_id: Number(cargo_id), setor_id: Number(setor_id), codigo, nome, genero, data_nascimento, cpf, rg, nis_pis, ctps, serie, uf, jornada_trabalho, cargo });
        return data;
    
    } catch (error) {
        console.error("Erro ao salvar no banco:", error);
    }
}

export const getDadosAllTrabalhadoresService = (empresaId:string) => {
    try {
        const data = Trabalhadores.findAll({ where: { empresa_id: Number(empresaId) } });
        return data;
    } catch (error) {
        console.error("Erro ao buscar todos os trabalhadores:", error);
    }
}


export const getDadosTrabalhadorService = (empresaId:string, trabalhadorId:string) => {
    try {
        const data = Trabalhadores.findOne({ where: { empresa_id: Number(empresaId), id: Number(trabalhadorId) } });
        return data;
    } catch (error) {
        console.error("Erro ao buscar trabalhador:", error);
    }
}

export const putDadosTrabalhadorService = (empresaId:string, trabaladorId:string, gerencia_id:string, cargo_id:string, setor_id:string, codigo:string, nome:string, genero:string, data_nascimento:string, cpf:string, rg:string, nis_pis:string, ctps:string, serie:string, uf:string, jornada_trabalho:string, cargo:string) => {
    try {
        const data = Trabalhadores.update({gerencia_id: Number(gerencia_id), cargo_id: Number(cargo_id), setor_id: Number(setor_id), codigo, nome, genero, data_nascimento, cpf, rg, nis_pis, ctps, serie, uf, jornada_trabalho, cargo}, { where: { empresa_id: Number(empresaId), id: trabaladorId } });
        return data;
    } catch (error) {
        console.error(error)
    }

}

export const deleteDadosTrabalhadorService = (empresaId:string, trabaladorId:string) => {
    try {
        const data = Trabalhadores.destroy({ where: { empresa_id: Number(empresaId), id: trabaladorId } });
        return data;
    } catch (error) {
        console.error(error)
    }
}