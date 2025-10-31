-- Fix RLS policies for critical security issues

-- 1. Fix clientes table policies
DROP POLICY IF EXISTS "Allow all operations on clientes" ON clientes;

CREATE POLICY "Authenticated users can view clients" 
ON clientes FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert clients" 
ON clientes FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update clients" 
ON clientes FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete clients" 
ON clientes FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- 2. Fix dividas table policies
DROP POLICY IF EXISTS "Allow all operations on dividas" ON dividas;

CREATE POLICY "Authenticated users can view debts" 
ON dividas FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create debts" 
ON dividas FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update debts" 
ON dividas FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete debts" 
ON dividas FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- 3. Fix notificacoes table policies
DROP POLICY IF EXISTS "Allow all operations on notificacoes" ON notificacoes;

CREATE POLICY "Authenticated users can view notifications" 
ON notificacoes FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "System can create notifications" 
ON notificacoes FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "System can update notifications" 
ON notificacoes FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete notifications" 
ON notificacoes FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- 4. Fix profiles table policy
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;

CREATE POLICY "Authenticated users can view profiles" 
ON profiles FOR SELECT 
USING (auth.role() = 'authenticated');