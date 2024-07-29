import { z } from "zod";

export const personalDataSchema = z.object({
  uuid: z.string().optional(),
  name: z.string().min(1, "Nome é obrigatório"),
  cpf: z.string()
    .min(14, "CPF é obrigatório"),
  phone: z.string().min(14, "Telefone é obrigatório"),
  email: z.string().email().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
  birthday: z.string().optional(),
  gender: z.string().optional(),
  coren: z.string().optional(),
});

export const addressSchema = z.object({
  zipCode: z
    .string()
    .min(9, "CEP é obrigatório"),
  street: z.string().min(1, "Rua é obrigatória"),
  district: z.string().min(1, "Bairro é obrigatório"),
  complement: z.string(),
  city: z.string().min(1, "Cidade é obrigatório"),
  state: z.string().min(1, "Estado é obrigatório"),
  country: z.string().min(1, "País é obrigatório"),
  number: z.string().min(1, "Numero é obrigatório"),
  coordinates: z.array(z.number()).optional(),
  exactLocation: z.boolean().default(false),
})

export const completeSchema = personalDataSchema.extend({
  address: addressSchema
})

export type PersonalDataFormType = z.infer<typeof personalDataSchema>;
export type AddressFormType = z.infer<typeof addressSchema>;
export type CompleteFormType = z.infer<typeof completeSchema>;