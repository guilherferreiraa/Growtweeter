import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import userRouter from "./routes/user.router"; 
import tweetRouter from "./routes/tweet.router";
import likeRouter from "./routes/like.router";

const app = express();
app.use(cors());
app.use(express.json());

// Coloque logo abaixo do app.use(express.json())
app.get("/teste", (req, res) => {
    res.send("O SERVIDOR ESTÁ VIVO!");
});

app.use(userRouter); 
app.use(tweetRouter);
app.use(likeRouter);

const publicPath = path.resolve(__dirname, ".."); 

app.use("/css", express.static(path.join(publicPath, "css")));
app.use("/js", express.static(path.join(publicPath, "js")));
app.use("/assets", express.static(path.join(publicPath, "assets")));

app.get("/", (req, res) => {
    res.sendFile(path.join(publicPath, "index.html")); 
});

const PORT = Number(process.env.PORT) || 3333;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
    });
}

export default app;