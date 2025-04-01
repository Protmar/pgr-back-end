import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { router } from "./routes/routes";
import { sequelize } from "./database/index";
import session from "express-session";

dotenv.config();

const app = express();

// 🔥 Configuração CORS com suporte a cookies
app.use(cors({
  origin: "http://localhost:3000", // Substitua pelo domínio do frontend
  credentials: true
}));

app.use(express.static("public"));
app.use(express.json());

app.use(
  session({
    secret: process.env.JWT_SECRET || "minha_chave_super_secreta", // Substitua por uma chave segura
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Use `true` se estiver em HTTPS
  })
);

app.use(router);

const PORT = process.env.PORT || 3001;

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
