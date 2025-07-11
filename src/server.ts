import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { router } from "./routes/routes";
import { sequelize } from "./database/index";
import session from "express-session";
import bodyParser from "body-parser";

dotenv.config();

const app = express();

// ✅ CORS permissivo para todas as origens e headers
app.use(cors());


// Servir arquivos estáticos
app.use(express.static("public"));

// Parsing
app.use(bodyParser.json({ limit: "900mb" }));
app.use(bodyParser.urlencoded({ limit: "900mb", extended: true }));

// Sessão
app.use(
  session({
    secret: process.env.JWT_SECRET || "minha_chave_super_secreta",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // ✅ Ative em produção com HTTPS
      sameSite: "lax",
    },
  })
);

// Rotas
app.use(router);

// Porta e inicialização
const PORT = process.env.PORT || 3000;

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
