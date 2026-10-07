import type { Request, Response } from "express";
import { cnpjSchema } from "../schemas/cnpjSchema.js";
import { consultarEmpresa } from "../services/empresaService.js";
import { criarEmpresaSchema, atualizarEmpresaSchema } from "../schemas/empresaSchema.js";
import { atualizarEmpresa, criarEmpresa, listarTodasEmpresas, deletarEmpresa } from "../repositories/empresaRepository.js";



export async function buscarEmpresa(req: Request, res: Response) {

    // validacao para saber se o cnpj passado bate com o schema
    const cnpjValido = cnpjSchema.safeParse(req.params.cnpj)

    if (!cnpjValido.success) {
        return res.status(400).json({
            erro: "CNPJ inválido."
        })
    }

    const empresa = await consultarEmpresa(cnpjValido.data)

    if (!empresa) {
        return res.status(404).json({
            erro: "Empresa não encontrada."
        })
    }

    return res.status(200).json(empresa)
}


export async function listarEmpresas(req: Request, res: Response) {

    const todasEmpresas = await listarTodasEmpresas()

    return res.status(200).json(todasEmpresas)
}


export async function cadastrarEmpresa(req: Request, res: Response) {

    // validando se os dados do body bate com o schema da empresa
    const dadosValidados = criarEmpresaSchema.safeParse(req.body)

    if (!dadosValidados.success) {
        return res.status(400).json({
            erro: dadosValidados.error.issues
        })
    }

    try {
        const empresa = await criarEmpresa(dadosValidados.data, "manual")

        return res.status(201).json(empresa)

    } catch (err: any) {
        if (err.message === "CNPJ já cadastrado") {
            return res.status(409).json({
                erro: err.message
            })
        }
        throw err
    }

}


export async function atualizacaoEmpresa(req: Request, res: Response) {

    const cnpjValido = cnpjSchema.safeParse(req.params.cnpj) 
    
    if (!cnpjValido.success) {
        return res.status(400).json({
            erro: "CNPJ inválido"
        })
    }

    const dadosValidados = atualizarEmpresaSchema.safeParse(req.body)

    if (!dadosValidados.success) {
        return res.status(400).json({ erro: dadosValidados.error.issues });
    }

    const empresaAtualizada = await atualizarEmpresa(cnpjValido.data, dadosValidados.data)

    if (!empresaAtualizada) {
        return res.status(404).json({ 
            erro: "Empresa não encontrada" 
        });
    }

    return res.status(200).json(empresaAtualizada)

}


export async function removerEmpresa(req: Request, res: Response) {

    const cnpjValido = cnpjSchema.safeParse(req.params.cnpj)

    if (!cnpjValido.success) {
        return res.status(400).json({
            erro: "CNPJ invalido"
        })
    }

    const empresaRemovida = await deletarEmpresa(cnpjValido.data)

    if (!empresaRemovida) {
        return res.status(404).json({
            erro: "Empresa não encontrada"
        })
    }

    return res.status(200).json(empresaRemovida)
}




