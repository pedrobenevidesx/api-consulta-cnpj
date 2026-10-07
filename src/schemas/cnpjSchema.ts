import { z } from "zod"

// schema de validacao de cnpj separado
export const cnpjSchema = z
    .string()
    .transform((cnpj) => cnpj.replace(/\D/g, "")) // remove tudo que nao for numero
    .pipe(z.string().length(14, "CNPJ deve ter 14 digitos")) // permite pegar o resultado/transformacao anterior e passar outro schema
