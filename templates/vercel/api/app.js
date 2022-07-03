const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
const Task = require("./models/Task");
const cors = require("cors");
const app = express();
const tasksRoutes = require("./routes/tasks");
const dotenv = require("dotenv");
const { v4 } = require("uuid");

dotenv.config();

mongoose.connect(process.env.MONGO_URI)

        .then(() => console.log("Connexion à MongoDB réussie !"))
        .catch(() => console.log("Connexion à MongoDB échouée !"));

app.get("/api", (req, res) => {
        const path = `/api/item/${v4()}`;
        res.setHeader("Content-Type", "text/html");
        res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
        res.end(`Hello! Go to item: <a href="${path}">${path}</a>`);
});

app.get("/api/item/:slug", (req, res) => {
        const { slug } = req.params;
        res.end(`Item: ${slug}`);
});

module.exports = app;

const corsOptions = {
        origin: process.env.CLIENT_URL,
        credentials: true,
        allowedHeaders: ["sessionId", "Content-Type"],
        exposedHeaders: ["sessionId"],
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
};

app.use(cors({ corsOptions }));

app.get("/api", (req, res) => {
        const path = `/api/item/${v4()}`;
        res.setHeader("Content-Type", "text/html");
        res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
        res.end(`Hello! Go to item: <a href="${path}">${path}</a>`);
});

app.get("/api/item/:slug", (req, res) => {
        const { slug } = req.params;
        res.end(`Item: ${slug}`);
});

app.use(helmet());
app.use(express.json());

app.use("/api/tasks", tasksRoutes);

module.exports = app;
