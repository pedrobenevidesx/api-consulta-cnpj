import "dotenv/config";
import express from "express";
import { empresaRoutes } from "./routes/empresaRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express()
const port = process.env.PORT ?? 3000

app.use(express.json())
app.use(empresaRoutes)
app.use(errorHandler)

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
})