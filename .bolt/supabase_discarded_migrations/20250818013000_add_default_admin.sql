/*
  # Usuário Administrador Padrão - Prime Luthieria CMS

  ## Usuário criado:
  - Email: admin@admin.com
  - Senha: password
  - Status: ativo
  - Permissões: admin completo

  ## Instruções:
  1. Execute esta migração no Supabase
  2. Vá em Authentication > Users no painel do Supabase
  3. Clique em "Add user" e crie um usuário com:
     - Email: admin@admin.com  
     - Password: password
     - Email confirmed: true
  4. Copie o UUID do usuário criado
  5. Execute o comando UPDATE abaixo substituindo 'USER_UUID_AQUI' pelo UUID real

  ## Comando para executar após criar o usuário:
  -- UPDATE admin_users SET user_id = 'USER_UUID_AQUI' WHERE email = 'admin@admin.com';
*/

-- Insert default admin user (será vinculado após criar o usuário na auth)
INSERT INTO admin_users (
  user_id,
  email,
  full_name,
  is_active,
  role,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000', -- Placeholder UUID - deve ser atualizado
  'admin@admin.com',
  'Administrador Prime Luthieria',
  true,
  'super_admin',
  now(),
  now()
) ON CONFLICT (email) DO NOTHING;

-- Comentário com instruções para ativação manual:
/*
INSTRUÇÕES PARA ATIVAR O USUÁRIO ADMIN:

1. Acesse o painel do Supabase: https://supabase.com/dashboard
2. Vá até seu projeto
3. Clique em "Authentication" → "Users"
4. Clique em "Add user"
5. Preencha:
   - Email: admin@admin.com
   - Password: password
   - Marque "Email confirmed" como true
6. Após criar, copie o UUID do usuário
7. Vá em "Table Editor" → "admin_users"
8. Encontre a linha com email 'admin@admin.com'
9. Edite o campo 'user_id' e cole o UUID do usuário criado
10. Salve as alterações

Após isso, você poderá fazer login em http://localhost:5173/admin/login
*/
