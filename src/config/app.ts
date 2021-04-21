import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.static("images"));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

export default app;
