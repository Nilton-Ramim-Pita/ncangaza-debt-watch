-- Create notification templates table
CREATE TABLE IF NOT EXISTS public.notification_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('email', 'in_app')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notification_templates ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can view all templates" 
ON public.notification_templates 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create templates" 
ON public.notification_templates 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update templates" 
ON public.notification_templates 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete templates" 
ON public.notification_templates 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_notification_templates_updated_at
BEFORE UPDATE ON public.notification_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default templates
INSERT INTO public.notification_templates (type, title, body, is_default) VALUES
('email', 'Aviso de Dívida Vencida', 'Olá {{cliente_nome}},\n\nInformamos que a dívida no valor de {{valor}} MZN com vencimento em {{data_vencimento}} encontra-se vencida.\n\nDescrição: {{descricao}}\n\nPor favor, regularize sua situação o quanto antes.\n\nAtenciosamente,\nEquipe Financeira', true),
('in_app', 'Dívida Vencida', 'Cliente {{cliente_nome}} tem dívida de {{valor}} MZN vencida desde {{data_vencimento}}', true);

-- Add index for better performance
CREATE INDEX idx_notification_templates_type ON public.notification_templates(type);
CREATE INDEX idx_notification_templates_default ON public.notification_templates(is_default) WHERE is_default = true;