import { Empresa, EmpresaCreationAttributes } from "../models/Empresa";

export const empresaService = {
    create: async (attributes: EmpresaCreationAttributes) => {
        const empresa = await Empresa.create(attributes);
        return empresa;
    }
}