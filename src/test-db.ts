import "dotenv/config"
import { pool } from "./config/db.js"

const resultado = await pool.query("SELECT NOW()")
console.log(resultado.rows)

await pool.end()