import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import userRouter from "./routes/user.router";
import tweetRouter from "./routes/tweet.router";

const app = express();

app.use(cors());
app.use(express.json());

app.use(userRouter); 
app.use(tweetRouter);


const rootPath = path.resolve(__dirname, ".."); 

app.use("/css", express.static(path.join(rootPath, "css")));
app.use("/js", express.static(path.join(rootPath, "js")));
app.use("/assets", express.static(path.join(rootPath, "assets")));

app.get("/", (req, res) => {
    res.sendFile(path.join(rootPath, "main.html")); 
});

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3333;
    app.listen(PORT, () => console.log(`🚀 Rodando em http://localhost:${PORT}`));
}

export default app;