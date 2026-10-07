import { z } from "zod"

export const brasilApiSchema = z.object ({
    cnpj: z.string(),
    razao_social: z.string(),
    municipio: z.string(),
    uf: z.string(),
    descricao_situacao_cadastral: z.string()
})