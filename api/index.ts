import express from "express";
import { createAstrologyRouter } from "../lib/astrologyRouter";

const app = express();
app.use(express.json({ limit: "2mb" }));
app.use(createAstrologyRouter());

export default app;
