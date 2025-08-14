# 🚀 Deploy EasyPanel - Configuração Simples

## ⚙️ **Configuração no EasyPanel**

### 1. **Criar Aplicação**
- Repository: `https://github.com/akshimaru/site-luthieria.git`
- Branch: `master`
- Type: Docker

### 2. **Variáveis de Ambiente** (copie exatamente)
```
NODE_ENV=production
PORT=3000
SESSION_SECRET=prime_luthieria_secret_easypanel_2025
```

### 3. **Configurações**
- Port: `3000`
- Build: Automático (Docker)
- Deploy: Automático

## 📊 **Logs Esperados**
```
Servidor rodando na porta 3000
Ambiente: production
Servidor pronto!
```

## 🔧 **Acesso**
- Site: `https://seudominio.com`
- Admin: `https://seudominio.com/admin/login`
- Login: `admin` / `prime123`

## ⚠️ **Se não funcionar**
1. Verificar se PORT=3000
2. Verificar se NODE_ENV=production
3. Redeploy da aplicação

---
**Configuração baseada no projeto sistemaos-v10.1 que funciona no EasyPanel**
