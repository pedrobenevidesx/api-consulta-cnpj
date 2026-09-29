import { z } from "zod"
import { cnpjSchema }  from "./cnpjSchema.js"

// schema para validacao das empresas
export const criarEmpresaSchema = z.object ({
    cnpj: cnpjSchema,
    nome: z.string().min(1).max(200),
    cidade: z.string().max(100).optional(),
    estado: z.string().length(2),
    situacao: z.string().max(30).optional()
})