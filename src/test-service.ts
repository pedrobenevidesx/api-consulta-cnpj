import "dotenv/config";
import { consultarEmpresa } from "./services/empresaService.js";
import { pool } from "./config/db.js";

const cnpj = "47960950000121"; // Magazine Luiza, sem máscara

const resultado = await consultarEmpresa(cnpj);

console.log(resultado);

await pool.end();