-- Remover role 'user' duplicado do admin, mantendo apenas role 'admin'
DELETE FROM user_roles 
WHERE user_id = '07cd5251-dd5d-4147-810f-1339ead1d1bc' 
AND role = 'user';