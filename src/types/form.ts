import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  cpf: z
    .string()
    .min(13, "CPF é obrigatório")
    .max(14, "Máximo de 11 caracteres"),
  address: z.object({
    zipCode: z
      .string()
      .min(7, "CEP é obrigatório")
      .max(8, "Máximo de 8 caracteres"),
    street: z.string().min(1, "Rua é obrigatória"),
    district: z.string().min(1, "Bairro é obrigatório"),
    complement: z.string(),
    city: z.string().min(1, "Cidade é obrigatório"),
    state: z.string().min(1, "Estado é obrigatório"),
    country: z.string().min(1, "País é obrigatório"),
    number: z.string().min(1, "Numero é obrigatório"),
  }),
  phone: z
    .string()
    .min(13, "Celular é obrigatório")
    .max(14, "Máximo de 11 caracteres")
    .regex(
      /^\d{3}\.\d{3}\.\d{3}\.-\d{2}$/,
      "CPF deve estar no formato XXX.XXX.XXX-XX"
    ),
  email: z.string().email().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
  birthday: z.string().optional(),
  gender: z.string().optional(),
  coren: z.string().optional(),
  coordinates: z.array(z.number()).optional(),
  exactLocation: z.boolean().default(false)
});

export type FormType = z.infer<typeof formSchema>;