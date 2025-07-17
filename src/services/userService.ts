import { User, UserCreationAttributes } from "../models/User";

export const userService = {
    findByEmail: async (email: string) => {
        const user = await User.findOne({ where: { email } });
        return user
    },
    create: async (attributes: UserCreationAttributes) => {
        const user = await User.create(attributes);
        return user
    },

    updateRecoverCode: async (
        id: number,
        attributes: {
            recoverCode: string | null;
            recoverExpires: Date | null
        }
    ) => {
        const [aaffectedRows, updatedUser] = await User.update(attributes, {
            where: { id },
            returning: true,
        });

        return updatedUser[0];
    },

    getAllUsersByEmpresa: async (empresaId: string) => {
        const users = await User.findAll({
            where: { empresaId },
            order: ["createdAt"],
        });

        return users;
    }
}
