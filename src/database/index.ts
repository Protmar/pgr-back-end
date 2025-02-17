import { Sequelize } from "sequelize";

export const sequelize = new Sequelize({
    dialect: "postgres",
    host: "localhost",
    port: 5432,
    database: "PGR-DEV",
    username: "postgres",
    password: "123456",
    define: {
        underscored: true // snake_case
    }
});