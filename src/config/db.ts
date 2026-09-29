// Pool para gerenciar e reutilizar conexões com o banco de dados
import { Pool } from 'pg'

// Criando uma instancia de pool
export const pool = new Pool({
    // Ponte de conexao com o banco de dados
    connectionString: process.env.DATABASE_URL,
})

