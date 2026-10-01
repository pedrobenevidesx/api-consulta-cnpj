const BASE_URL = "https://brasilapi.com.br/api/cnpj/v1"

export async function buscarCnpjNaBrasilApi(cnpj: string) {
    
    const resposta = await fetch(`${BASE_URL}/${cnpj}`)

    if (resposta.status === 404) {
        return null
    }

    if (!resposta.ok) {
        throw new Error(`Erro ao consutlar a BrasilAPI: ${resposta.status}`)
    }

    const dados = await resposta.json()

    return dados
} 