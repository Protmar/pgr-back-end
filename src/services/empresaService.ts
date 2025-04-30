import { Empresa, EmpresaCreationAttributes } from "../models/Empresa";

export const empresaService = {
    create: async (attributes: EmpresaCreationAttributes) => {
        const empresa = await Empresa.create(attributes);
        return empresa;
    },

    findOne: async (id: number) => {
        const empresa = await Empresa.findOne({ where: { id } });
        return empresa;
    },

    update: async (empresaId: number, params: any) => {
        const empresa = await Empresa.update(params, {
            where: { id: empresaId },
        });

        return empresa;
    }
}