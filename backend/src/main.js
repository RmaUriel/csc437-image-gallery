import express from "express";
import { getEnvVar } from "./getEnvVar.js";
import { connectMongo } from "./connectMongo.js";
import { ImageProvider } from "./ImageProvider.js";
import { SHARED_TEST } from "../../shared/example.js";
import { VALID_ROUTES} from "../../shared/ValidRoutes.js";
import {registerImageRoutes} from "../routes/imageRoutes.js";

function waitDuration(numMs) {
    return new Promise((resolve) => setTimeout(resolve, numMs));
}

const PORT = Number.parseInt(getEnvVar("PORT", false), 10) || 3000;
const STATIC_DIR = getEnvVar("STATIC_DIR") || "public";
const app = express();
const mongoClient = connectMongo();
await mongoClient.connect();
const imageProvider = new ImageProvider(mongoClient);

app.use(express.json());
app.use(express.static(STATIC_DIR));

registerImageRoutes(app, imageProvider);

app.get("/api/hello", (req, res) => {
    res.send("Hello, World " + SHARED_TEST);
});

app.get(Object.values(VALID_ROUTES), (req, res) => {
    res.sendFile("index.html", { root: STATIC_DIR});
});

app.get("/images/:imageId", (req, res) => {
    res.sendFile("index.html", { root: STATIC_DIR });
});


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}.  CTRL+C to stop.`);
});

