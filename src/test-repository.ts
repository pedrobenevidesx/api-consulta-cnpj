import "dotenv/config"
import { criarCnpj } from "./respositories/empresaRepository.js";
import { buscarCnpj } from "./respositories/empresaRepository.js";
import { pool } from "./config/db.js";

const resultado = await buscarCnpj ("12345678000190")
    
console.log(resultado)

await pool.end()