import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { router } from "./routes/routes";
import { sequelize } from "./database/index";
import session from "express-session";
import bodyParser from "body-parser";

dotenv.config();

const app = express();

app.use(cors());


app.use(express.static("public"));

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.use(
  session({
    secret: process.env.JWT_SECRET || "minha_chave_super_secreta",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Ative em produção com HTTPS
      sameSite: "lax",
    },
  })
);

app.use(router);

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
