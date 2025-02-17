import { CadastroTrajetoria } from "../../../models/Trajetorias";

const formatarNome = (nome: string) => {
    if (!nome) return "";
    const palavras = nome.toLowerCase().split(" ");
    palavras[0] = palavras[0].charAt(0).toUpperCase() + palavras[0].slice(1);
    return palavras.join(" ");
};

export const trajetoriaPostService = async (empresaId:string, descricao:string) => {
    const descricaoFormatada = formatarNome(descricao);
    try {
         const data = await CadastroTrajetoria.create({
            empresa_id: Number(empresaId),
            descricao: descricaoFormatada
         })

         return data;
    } catch (error) {
        console.log(error);
    }
}

export const trajetoriaGetAllService = async (empresaId:string) => {
    try {
         const data = await CadastroTrajetoria.findAll({
            where: {
                empresa_id: Number(empresaId)
            }
         })

         return data;
    } catch (error) {
        console.log(error);
    }
}

export const trajetoriaGetService = async (empresaId:string, idtrajetoria:string) => {
    try {
         const data = await CadastroTrajetoria.findOne({
            where: {
                empresa_id: Number(empresaId),
                id: idtrajetoria
            }
         })

         return data
    } catch (error) {
        console.log(error);
    }
}

export const trajetoriaDeleteService = (empresaId:string, idtrajetoria:string) => {
    try {
         const data = CadastroTrajetoria.destroy({
            where: {
                empresa_id: Number(empresaId),
                id: idtrajetoria
            }   
         })

         return data
    } catch (error) {
        console.log(error);
    }
}

export const trajetoriaPutService = (empresaId:string, descricao:string, trajetoriaId:string) => {
    const descricaoFormatada = formatarNome(descricao);
    try {
         const data = CadastroTrajetoria.update({
            descricao: descricaoFormatada
         }, {
            where: {
                empresa_id: Number(empresaId),
                id: trajetoriaId
            }
         })

         return data
    } catch (error) {
        console.log(error);
    }
}
