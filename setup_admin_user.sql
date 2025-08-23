-- ============================================================
-- SCRIPT PARA CRIAR USUÁRIO ADMIN PADRÃO
-- ============================================================
-- 
-- Execute estes comandos no SQL Editor do Supabase:
-- https://supabase.com/dashboard → Seu projeto → SQL Editor
--
-- Usuário: admin@admin.com
-- Senha: password
-- ============================================================

-- 1. Primeiro, insere o registro na tabela admin_users
INSERT INTO admin_users (
  user_id,
  email,
  full_name,
  is_active,
  role,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(), -- Gera um UUID temporário
  'admin@admin.com',
  'Administrador Prime Luthieria',
  true,
  'super_admin',
  now(),
  now()
) ON CONFLICT (email) DO UPDATE SET
  is_active = true,
  updated_at = now();

-- 2. Consulta para verificar se foi criado
SELECT * FROM admin_users WHERE email = 'admin@admin.com';

-- ============================================================
-- IMPORTANTE: Depois de executar o SQL acima, você deve:
-- ============================================================
-- 
-- 1. Ir em Authentication → Users no painel do Supabase
-- 2. Clicar em "Add user" (ou "Invite user")
-- 3. Preencher:
--    - Email: admin@admin.com
--    - Password: password
--    - Marcar "Email confirmed" como true
-- 4. Após criar o usuário, copiar o UUID dele
-- 5. Executar o comando abaixo substituindo 'UUID_DO_USUARIO' pelo UUID real:

-- UPDATE admin_users 
-- SET user_id = 'UUID_DO_USUARIO'  -- Cole o UUID aqui
-- WHERE email = 'admin@admin.com';

-- ============================================================
-- TESTE DE LOGIN
-- ============================================================
-- Depois desses passos, acesse:
-- http://localhost:5173/admin/login
-- 
-- Use:
-- Email: admin@admin.com
-- Senha: password
-- ============================================================
