import { brasilApiSchema } from "../schema/brasilApiSchema.js"

const BASE_URL = "https://brasilapi.com.br/api/cnpj/v1"

export async function buscarCnpjNaBrasilApi(cnpj: string) {
    
    const resposta = await fetch(`${BASE_URL}/${cnpj}`, {
        headers: {
            "User-Agent": "api-empresas/1.0",
        },
    })

    if (resposta.status === 404) {
        return null
    }

    if (!resposta.ok) {
        throw new Error(`Erro ao consutlar a BrasilAPI: ${resposta.status}`)
    }

    const dadosBrutos = await resposta.json()

    // valida os dados recebidos da API antes de usar
    const resultado = brasilApiSchema.safeParse(dadosBrutos)

    if (!resultado.success) {
        throw new Error("Resposta da BrasilAPI em formato inesperado")
    }
    
    // mapeia os dados da BrasilAPI para o formato utilizado no projeto
    return {
        cnpj: resultado.data.cnpj,
        nome: resultado.data.razao_social,
        cidade: resultado.data.municipio,
        estado: resultado.data.uf,
        situacao: resultado.data.descricao_situacao_cadastral, 
    }
} 