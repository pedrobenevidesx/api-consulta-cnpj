import { pool } from "../config/db.js"
import { z } from "zod"
import { criarEmpresaSchema } from "../schema/empresaSchema.js"

// tranforma schema Zod criarEmpresaSchema em tipo Typescript
type CriarEmpresa = z.infer<typeof criarEmpresaSchema>

export async function buscarCnpj(cnpj: string) {

    const resultadoCnpj = await pool.query("SELECT * FROM empresas WHERE cnpj = $1",
        [cnpj]
    )

    // retorna a primeiro empresa que encontrar
    return resultadoCnpj.rows[0]
}


export async function todosCnpj() {
    const todasEmpresas = await pool.query("SELECT * FROM empresas")

    return todasEmpresas.rows
}


export async function criarCnpj(dados: CriarEmpresa) {

    // RETURNING * faz o postgresql devolver o registro que acabou de ser criado
    const novaEmpresa = await pool.query("INSERT INTO empresas (cnpj, nome, cidade, estado, situacao) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [
            dados.cnpj,
            dados.nome,
            dados.cidade ?? null, // caso nao seja preenchido, envia null para o banco
            dados.estado,
            dados.situacao ?? null // caso nao seja preenchido, envia null para o banco
        ]
    )
    
    return novaEmpresa.rows[0]
}