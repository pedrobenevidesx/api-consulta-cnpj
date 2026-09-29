import "dotenv/config";
import express from "express";
import { pool } from "./config/db.js"

const app = express()

app.get("/", (req, res) => {
    res.json("Servidor funcionando!")
})

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000")
})