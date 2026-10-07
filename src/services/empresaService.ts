import { buscarPorCnpj, criarEmpresa } from "../repositories/empresaRepository.js";
import { buscarCnpjNaBrasilApi } from "../clients/brasilApiClient.js";

export async function consultarEmpresa(cnpj: string) {
    
    const empresaNoBanco = await buscarPorCnpj(cnpj)

    if (empresaNoBanco) {
        return empresaNoBanco
    }

    const empresaNaBrasilApi = await buscarCnpjNaBrasilApi(cnpj)

    if (!empresaNaBrasilApi) {
        return null
    }

    const empresaSalva = await criarEmpresa(empresaNaBrasilApi, "brasilapi")

    return empresaSalva
}