import { z } from 'zod';

// Client validation schema
export const clientSchema = z.object({
  nome: z.string()
    .trim()
    .min(1, 'Nome é obrigatório')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  
  nuit: z.string()
    .trim()
    .regex(/^\d{9}$/, 'NUIT deve ter exatamente 9 dígitos')
    .optional()
    .or(z.literal('')),
  
  email: z.string()
    .trim()
    .email('Email inválido')
    .max(255, 'Email deve ter no máximo 255 caracteres')
    .optional()
    .or(z.literal('')),
  
  telefone: z.string()
    .trim()
    .regex(/^(\+?258)?\s?\d{2}\s?\d{3}\s?\d{4}$/, 'Formato inválido. Use: +258 XX XXX XXXX')
    .optional()
    .or(z.literal('')),
  
  endereco: z.string()
    .trim()
    .max(500, 'Endereço deve ter no máximo 500 caracteres')
    .optional()
    .or(z.literal('')),
  
  ativo: z.boolean().default(true)
});

// Debt validation schema
export const debtSchema = z.object({
  cliente_id: z.string()
    .uuid('Cliente inválido'),
  
  valor: z.number()
    .positive('Valor deve ser positivo')
    .max(999999999, 'Valor muito alto')
    .or(z.string().transform((val) => parseFloat(val)).pipe(
      z.number().positive('Valor deve ser positivo')
    )),
  
  descricao: z.string()
    .trim()
    .min(1, 'Descrição é obrigatória')
    .max(500, 'Descrição deve ter no máximo 500 caracteres'),
  
  data_vencimento: z.string()
    .min(1, 'Data de vencimento é obrigatória')
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, 'Data de vencimento deve ser hoje ou no futuro'),
  
  status: z.enum(['pendente', 'paga', 'vencida']).default('pendente')
});

// User validation schema
export const userSchema = z.object({
  full_name: z.string()
    .trim()
    .min(1, 'Nome completo é obrigatório')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras'),
  
  email: z.string()
    .trim()
    .email('Email inválido')
    .max(255, 'Email deve ter no máximo 255 caracteres'),
  
  password: z.string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .max(72, 'Senha deve ter no máximo 72 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'Senha deve conter pelo menos um número'),
  
  role: z.enum(['admin', 'user']).default('user')
});

export type ClientFormData = z.infer<typeof clientSchema>;
export type DebtFormData = z.infer<typeof debtSchema>;
export type UserFormData = z.infer<typeof userSchema>;
