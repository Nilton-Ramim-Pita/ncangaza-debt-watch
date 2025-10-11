-- Add name column to notification_templates
ALTER TABLE public.notification_templates 
ADD COLUMN IF NOT EXISTS name TEXT;

-- Rename title to subject for clarity
ALTER TABLE public.notification_templates 
RENAME COLUMN title TO subject;

-- Set name for existing templates (using current subject as name)
UPDATE public.notification_templates 
SET name = subject 
WHERE name IS NULL;

-- Make name NOT NULL after setting values
ALTER TABLE public.notification_templates 
ALTER COLUMN name SET NOT NULL;

-- Insert new template for debt registration
INSERT INTO public.notification_templates (name, subject, body, type, is_default) 
VALUES (
  'Aviso de Dívida Cadastrada',
  'Nova dívida registrada com sucesso',
  'Olá {{cliente_nome}}, sua nova dívida no valor de {{valor}} MZN foi registrada com sucesso e vence em {{data_vencimento}}.',
  'email',
  false
)
ON CONFLICT DO NOTHING;