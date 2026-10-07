import { pool } from "../config/db.js"
import { z } from "zod"
import { criarEmpresaSchema, atualizarEmpresaSchema } from "../schemas/empresaSchema.js"

// tranforma schema Zod criarEmpresaSchema e atualizacaoEmpresa em tipo Typescript
type CriarEmpresa = z.infer<typeof criarEmpresaSchema>
type AtualizarEmpresa = z.infer<typeof atualizarEmpresaSchema>


export async function buscarPorCnpj(cnpj: string) {

    const resultadoCnpj = await pool.query("SELECT * FROM empresas WHERE cnpj = $1",
        [cnpj]
    )

    // retorna a primeiro empresa que encontrar
    return resultadoCnpj.rows[0]
}



export async function listarTodasEmpresas() {
    const todasEmpresas = await pool.query("SELECT * FROM empresas")

    return todasEmpresas.rows
}


// type para dizer se a empresa criada veio da BrasilApi ou se foi adicionada de forma manual pelo usuario
type Origem = "brasilapi" | "manual"

export async function criarEmpresa(dados: CriarEmpresa, origem: Origem) {

    try{
        // RETURNING * faz o postgresql devolver o registro que acabou de ser criado
        const novaEmpresa = await pool.query("INSERT INTO empresas (cnpj, nome, cidade, estado, situacao, origem) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [
                dados.cnpj,
                dados.nome,
                dados.cidade ?? null, // caso nao seja preenchido, envia null para o banco
                dados.estado,
                dados.situacao ?? null, // caso nao seja preenchido, envia null para o banco
                origem,
            ]
        )
        
        return novaEmpresa.rows[0]
    } catch (err: any) {
        if (err.code === "23505") {
            throw new Error("CNPJ já cadastrado")
        }
        throw err
    }
}



export async function atualizarEmpresa(cnpj: string, dados: AtualizarEmpresa) {

    // // mantém o valor atual quando o campo não foi informado
    const empresaAtualizada = await pool.query(
        `UPDATE empresas
         SET nome = COALESCE($1, nome),
            cidade = COALESCE($2, cidade),
            estado = COALESCE($3, estado),
            situacao = COALESCE($4, situacao)
            WHERE cnpj = $5
            RETURNING *`,
        [dados.nome ?? null, dados.cidade ?? null, dados.estado ?? null, dados.situacao ?? null, cnpj])

        return empresaAtualizada.rows[0]
}



export async function deletarEmpresa (cnpj: string) {
    
    const empresaDeletada = await pool.query(`
        DELETE FROM empresas
        WHERE cnpj = $1
        RETURNING *`,
        [cnpj]
    )

    return empresaDeletada.rows[0]
}