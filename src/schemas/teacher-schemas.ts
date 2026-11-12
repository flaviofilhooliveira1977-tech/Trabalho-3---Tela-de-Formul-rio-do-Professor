import { z } from "zod"

export const scheduleItemSchema = z.object({
    week_day: z.string().min(1, "Selecione o dia da semana."),
    from: z.string().regex(/^\d{2}:\d{2}$/, "Informe o horário inicial."),
    to: z.string().regex(/^\d{2}:\d{2}$/, "Informe o horário final."),
}).refine(({ from, to }) => from < to, {
    message: "O horário final deve ser posterior ao inicial.",
    path: ["to"],
})

export const teacherFormSchema = z.object({
    whatsapp: z
        .string()
        .trim()
        .regex(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, "Informe um WhatsApp válido."),
    biography: z
        .string()
        .trim()
        .min(1, "Informe sua biografia.")
        .max(300, "A biografia pode ter no máximo 300 caracteres."),
    subject: z.string().min(1, "Selecione a matéria."),
    cost: z.coerce
        .number({ error: "Informe o custo da sua hora-aula." })
        .positive("O custo deve ser maior que zero."),
    schedule: z
        .array(scheduleItemSchema)
        .min(1, "Adicione ao menos um horário disponível."),
})

export const teacherProfileSchema = teacherFormSchema.extend({
    name: z.string().trim().min(2, "Informe seu nome."),
    lastName: z.string().trim().min(2, "Informe seu sobrenome."),
    email: z.email("Informe um e-mail válido."),
})

export type TeacherFormData = z.infer<typeof teacherFormSchema>
export type TeacherFormInput = z.input<typeof teacherFormSchema>
export type TeacherProfileFormData = z.infer<typeof teacherProfileSchema>
export type TeacherProfileFormInput = z.input<typeof teacherProfileSchema>
