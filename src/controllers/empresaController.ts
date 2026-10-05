import type { Request, Response } from "express";
import { cnpjSchema } from "../schema/cnpjSchema.js";
import { consultarEmpresa } from "../services/empresaService.js";
import { criarEmpresaSchema, atualizarEmpresaSchema } from "../schema/empresaSchema.js";
import { atualizarEmpresa, criarEmpresa, listarTodasEmpresas } from "../respositories/empresaRepository.js";



export async function buscarEmpresa(req: Request, res: Response) {

    // validacao para saber se o cnpj passado bate com o schema
    const resultado = cnpjSchema.safeParse(req.params.cnpj)

    if (!resultado.success) {
        return res.status(400).json({
            erro: "CNPJ inválido."
        })
    }

    const empresa = await consultarEmpresa(resultado.data)

    if (!empresa) {
        return res.status(404).json({
            erro: "Empresa não encontrada."
        })
    }

    return res.status(200).json(empresa)
}


export async function listarEmpresas(req: Request, res: Response) {

    const todasEmpresas = await listarTodasEmpresas()

    return todasEmpresas
}


export async function cadastrarEmpresa(req: Request, res: Response) {

    const resultado = criarEmpresaSchema.safeParse(req.body)

    if (!resultado.success) {
        return res.status(400).json({
            error: resultado.error.issues
        })
    }

    try {
        const empresa = await criarEmpresa(resultado.data, "manual")

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

    const cnpjValidado = cnpjSchema.safeParse(req.params.cnpj) 
    
    if (!cnpjValidado.success) {
        return res.status(400).json({
            error: "CNPJ inválido"
        })
    }

    const dadosValidados = atualizarEmpresaSchema.safeParse(req.body)

    if (!dadosValidados.success) {
        return res.status(400).json({ erro: dadosValidados.error.issues });
    }

    const empresaAtualizada = await atualizarEmpresa(cnpjValidado.data, dadosValidados.data)

    if (!empresaAtualizada) {
        return res.status(404).json({ erro: "Empresa não encontrada" });
    }

    return res.status(200).json(empresaAtualizada)

}




