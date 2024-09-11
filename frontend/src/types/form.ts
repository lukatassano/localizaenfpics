import { z } from "zod";

export const formSchema = z.object({
  id: z.number().optional(),
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
  specialties: z.array(z.string()).min(1, "Selecione pelo menos uma especialidade").default([]),
  lgpd: z.boolean().default(false).refine(val => val === true, {
    message: "Você precisa concordar com os termos para enviar"
  }),

  zipCode: z
    .string()
    .min(9, "CEP é obrigatório"),
  type: z.string().min(1, "Tipo é obrigatório"),
  street: z.string().min(1, "Rua é obrigatória"),
  district: z.string().min(1, "Bairro é obrigatório"),
  complement: z.string(),
  city: z.string().min(1, "Cidade é obrigatório"),
  state: z.string().min(1, "Estado é obrigatório"),
  country: z.string().min(1, "País é obrigatório"),
  number: z.string(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  exactLocation: z.boolean().default(false),
});

export type FormType = z.infer<typeof formSchema>;

export type Nurse = FormType;
