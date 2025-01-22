import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { router } from "./routes/routes";
import { sequelize } from "./database/index";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(router);

const PORT = process.env.PORT || 3001;

// Testa a conexão com o banco e inicia o servidor
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexão com o banco de dados foi bem-sucedida!");

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error("Não foi possível conectar ao banco de dados:", error);
  }
};

startServer();
