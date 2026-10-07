import { Router } from "express";
import { buscarEmpresa, listarEmpresas, cadastrarEmpresa, atualizacaoEmpresa, removerEmpresa } from "../controllers/empresaController.js";

export const empresaRoutes = Router()

empresaRoutes.get("/empresas", listarEmpresas)
empresaRoutes.get("/empresas/:cnpj", buscarEmpresa)
empresaRoutes.post("/empresas", cadastrarEmpresa)
empresaRoutes.patch("/empresas/:cnpj", atualizacaoEmpresa)
empresaRoutes.delete("/empresas/:cnpj", removerEmpresa)