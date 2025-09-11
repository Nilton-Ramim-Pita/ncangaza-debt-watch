-- Create tables for Ncangaza Debt Management System

-- Create clients table
CREATE TABLE public.clientes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  nuit TEXT UNIQUE,
  telefone TEXT,
  email TEXT,
  endereco TEXT,
  data_registro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create debts table
CREATE TABLE public.dividas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  valor DECIMAL(15,2) NOT NULL,
  descricao TEXT NOT NULL,
  data_criacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_vencimento DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'paga', 'vencida')),
  data_pagamento TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notificacoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  divida_id UUID NOT NULL REFERENCES public.dividas(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('email', 'sms', 'whatsapp')),
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'enviada', 'falhada')),
  data_envio TIMESTAMP WITH TIME ZONE,
  data_agendamento TIMESTAMP WITH TIME ZONE NOT NULL,
  mensagem TEXT,
  erro TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dividas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notificacoes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allowing all operations for now)
CREATE POLICY "Allow all operations on clientes" ON public.clientes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on dividas" ON public.dividas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on notificacoes" ON public.notificacoes FOR ALL USING (true) WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_clientes_nuit ON public.clientes(nuit);
CREATE INDEX idx_clientes_nome ON public.clientes(nome);
CREATE INDEX idx_dividas_cliente_id ON public.dividas(cliente_id);
CREATE INDEX idx_dividas_status ON public.dividas(status);
CREATE INDEX idx_dividas_data_vencimento ON public.dividas(data_vencimento);
CREATE INDEX idx_notificacoes_divida_id ON public.notificacoes(divida_id);
CREATE INDEX idx_notificacoes_status ON public.notificacoes(status);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_clientes_updated_at
  BEFORE UPDATE ON public.clientes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_dividas_updated_at
  BEFORE UPDATE ON public.dividas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to automatically update debt status based on due date
CREATE OR REPLACE FUNCTION public.update_debt_status()
RETURNS void AS $$
BEGIN
  UPDATE public.dividas 
  SET status = 'vencida' 
  WHERE data_vencimento < CURRENT_DATE 
    AND status = 'pendente';
END;
$$ LANGUAGE plpgsql;

-- Insert sample data
INSERT INTO public.clientes (nome, nuit, telefone, email, endereco) VALUES
  ('João Manuel Silva', '123456789', '+258821234567', 'joao@email.com', 'Av. Julius Nyerere, Tete'),
  ('Maria José Santos', '987654321', '+258829876543', 'maria@email.com', 'Bairro Chingodzi, Tete'),
  ('António Carlos Mabote', '456789123', '+258824567891', 'antonio@email.com', 'Bairro Matundo, Tete'),
  ('Esperança Tembe', '789123456', '+258827891234', 'esperanca@email.com', 'Av. 25 de Setembro, Tete'),
  ('Fernando Machel', '321654987', '+258823216549', 'fernando@email.com', 'Bairro Samora Machel, Tete');

-- Insert sample debts
INSERT INTO public.dividas (cliente_id, valor, descricao, data_vencimento, status) VALUES
  ((SELECT id FROM public.clientes WHERE nome = 'João Manuel Silva'), 15000.00, 'Serviços de consultoria empresarial', '2024-02-15', 'pendente'),
  ((SELECT id FROM public.clientes WHERE nome = 'Maria José Santos'), 8500.00, 'Licenciamento de software', '2024-01-30', 'vencida'),
  ((SELECT id FROM public.clientes WHERE nome = 'António Carlos Mabote'), 25000.00, 'Desenvolvimento de website', '2024-03-01', 'pendente'),
  ((SELECT id FROM public.clientes WHERE nome = 'Esperança Tembe'), 12000.00, 'Treinamento de equipe', '2024-01-20', 'paga'),
  ((SELECT id FROM public.clientes WHERE nome = 'Fernando Machel'), 18500.00, 'Suporte técnico anual', '2024-02-28', 'pendente'),
  ((SELECT id FROM public.clientes WHERE nome = 'João Manuel Silva'), 7500.00, 'Manutenção de equipamentos', '2024-01-15', 'paga'),
  ((SELECT id FROM public.clientes WHERE nome = 'Maria José Santos'), 22000.00, 'Projeto de automação', '2024-03-15', 'pendente'),
  ((SELECT id FROM public.clientes WHERE nome = 'António Carlos Mabote'), 9800.00, 'Consultoria em processos', '2024-01-25', 'vencida'),
  ((SELECT id FROM public.clientes WHERE nome = 'Esperança Tembe'), 16500.00, 'Sistema de gestão', '2024-04-01', 'pendente'),
  ((SELECT id FROM public.clientes WHERE nome = 'Fernando Machel'), 11200.00, 'Licenças de software', '2024-02-10', 'paga');