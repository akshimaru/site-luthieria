# 🎸 Prime Luthieria - Deployment Guide

## 📋 **Configuração no EasyPanel**

### 🔧 **Variáveis de Ambiente Necessárias:**

Configure as seguintes variáveis na interface do EasyPanel:

```
VITE_SUPABASE_URL=https://jqyoxoviyyrmfszrcmbv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxeW94b3ZpeXlybWZzenJjbWJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0ODA5NzIsImV4cCI6MjA3MTA1Njk3Mn0.ZUYsOHHInaIrnDooZ5u9xAJcnObW1Ry-3yttQ3BQ7k0
VITE_APP_ENV=production
NODE_ENV=production
```

### 🚀 **Deploy Automático:**

1. **O arquivo `easypanel.yml` já está configurado** com todas as variáveis necessárias
2. **O Dockerfile aceita as variáveis** como build arguments
3. **Só fazer deploy direto** - as variáveis serão configuradas automaticamente

### 🔍 **Verificar se funcionou:**

Após o deploy, acesse:
- `/` - Página principal
- `/admin/login` - Painel administrativo
- Se aparecer erro, verificar se as variáveis foram carregadas no console do navegador

### 🛠️ **Troubleshooting:**

Se der erro de "site em branco":
1. Verifique se as variáveis estão configuradas na interface do EasyPanel
2. Reconstrua o container
3. Verifique os logs do container

---

## ✅ **Arquivos já configurados:**

- ✅ `Dockerfile` - Com build args para variáveis de ambiente
- ✅ `easypanel.yml` - Com build args e environment vars
- ✅ `src/lib/supabase.ts` - Com fallback para as credenciais
- ✅ Build de produção incluído no repositório

**Deploy pronto! 🎯**
