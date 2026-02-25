import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import userRouter from "./routes/user.router";
import tweetRouter from "./routes/tweet.router";
import likeRouter from "./routes/like.router";
import followRouter from "./routes/follow.router";

const app = express();
app.use(cors());
app.use(express.json());

const publicPath = path.resolve();
app.use("/css", express.static(path.join(publicPath, "css")));
app.use("/js", express.static(path.join(publicPath, "js")));
app.use("/assets", express.static(path.join(publicPath, "assets")));

app.use(userRouter);
app.use(tweetRouter);
app.use(followRouter);

app.get("/", (req, res) => res.sendFile(path.join(publicPath, "index.html")));
app.get("/login", (req, res) =>
  res.sendFile(path.join(publicPath, "login.html")),
);
app.get("/cadastro", (req, res) =>
  res.sendFile(path.join(publicPath, "cadastro.html")),
);

const PORT = Number(process.env.PORT) || 3333;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

export default app;
