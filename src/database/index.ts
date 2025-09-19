require("dotenv").config();
import { Sequelize } from "sequelize";

export const sequelize = new Sequelize({
    dialect: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    define: {
        underscored: true,
    },
    logging: false,
    pool: {
        max: 20,        // máximo de conexões simultâneas
        min: 5,         // mínimo de conexões mantidas
        acquire: 30000, // tempo máximo para obter uma conexão do pool (ms)
        idle: 10000,    // tempo máximo que uma conexão pode ficar ociosa (ms)
    },
    dialectOptions: {
        statement_timeout: 30000, // timeout de cada query (ms)
    },
});
