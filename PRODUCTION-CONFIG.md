# 🚀 Configuração Completa para Produção VPS/EasyPanel

## ⚙️ **VARIÁVEIS DE AMBIENTE OBRIGATÓRIAS**

### No EasyPanel, configure EXATAMENTE estas variáveis:

```bash
# OBRIGATÓRIAS
NODE_ENV=production
PORT=3000
SESSION_SECRET=prime_luthieria_production_2025_sua_chave_super_secreta

# RECOMENDADAS PARA VPS
TRUST_PROXY=true
SECURE_COOKIES=true
```

## 🔧 **Configuração no EasyPanel**

### 1. **Configurações da Aplicação**
```
Nome: prime-luthieria
Framework: Node.js
Repository: https://github.com/akshimaru/site-luthieria.git
Branch: master
Build Command: npm install --production
Start Command: npm run start:prod
Port: 3000
```

### 2. **Variáveis de Ambiente**
Copie e cole EXATAMENTE no EasyPanel:

```
NODE_ENV=production
PORT=3000
SESSION_SECRET=prime_luthieria_$(date +%s)_secure_key
TRUST_PROXY=true
SECURE_COOKIES=true
```

### 3. **Configurações Opcionais** (se precisar no futuro)
```
EMAIL_USER=contato@seudominio.com
EMAIL_PASS=sua_senha_de_app
GA_MEASUREMENT_ID=G-XXXXXXXXXX
DOMAIN=https://seudominio.com
```

## 📊 **Verificação Pós-Deploy**

### Logs Corretos que Você Deve Ver:
```
🔍 Validando variáveis de ambiente...
✅ NODE_ENV: production
✅ PORT: 3000
✅ SESSION_SECRET: [CONFIGURADO]
🚀 Modo PRODUÇÃO detectado
✅ Validação de ambiente concluída

🚀 Servidor Prime Luthieria iniciado
📡 Porta: 3000
🌍 Ambiente: production
🐳 Host: 0.0.0.0 (Docker/VPS Ready)
✅ Aplicação rodando em modo PRODUÇÃO
```

### ❌ Se Você Ver Isso (PROBLEMAS):
```
❌ ERRO: Variável obrigatória NODE_ENV não encontrada
⚠️ AVISO: SESSION_SECRET muito simples para produção
⚠️ Modo DESENVOLVIMENTO detectado
🔧 Modo desenvolvimento - Acesse: http://localhost:3000
```

## 🔧 **Comandos para Testar Localmente**

### Teste 1: Validar Configuração
```bash
npm run validate
```

### Teste 2: Rodar em Modo Produção
```bash
npm run start:prod
```

### Teste 3: Docker Local
```bash
npm run docker:build
npm run docker:run
```

## 🌐 **Acesso à Aplicação**

Após deploy correto:
- **Site**: https://seudominio.com
- **Admin**: https://seudominio.com/admin/login
- **Credenciais**: admin / prime123

## 🛡️ **Segurança em Produção**

### Configurações Automáticas:
- ✅ Cookies seguros (HTTPS)
- ✅ Rate limiting rigoroso
- ✅ Headers de segurança
- ✅ Trust proxy configurado
- ✅ Session timeout (24h)

### Altere Depois do Deploy:
1. **Senha do Admin**: Via painel `/admin/login`
2. **SESSION_SECRET**: Gere uma chave única
3. **Configure domínio**: No EasyPanel

## 🔄 **Processo de Deploy Completo**

### 1. No EasyPanel:
```
New Application → Git Repository
URL: https://github.com/akshimaru/site-luthieria.git
```

### 2. Configurar Variáveis:
```
NODE_ENV=production
PORT=3000
SESSION_SECRET=sua_chave_super_secreta_unica
```

### 3. Deploy:
```
Build Command: npm install --production
Start Command: npm run start:prod
Port: 3000
```

### 4. Verificar:
- Logs mostram "modo PRODUÇÃO"
- Site carrega em https://seudominio.com
- Admin funciona em /admin/login

---

## ⚡ **CHECKLIST FINAL**

- [ ] Variáveis de ambiente configuradas
- [ ] NODE_ENV=production
- [ ] PORT=3000
- [ ] SESSION_SECRET único
- [ ] Build command correto
- [ ] Start command correto
- [ ] Logs mostram "PRODUÇÃO"
- [ ] Site carrega
- [ ] Admin funciona

**✅ Com essa configuração, o site funcionará perfeitamente em produção!**
