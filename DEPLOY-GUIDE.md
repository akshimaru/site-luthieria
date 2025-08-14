# 🚀 Guia de Deploy no EasyPanel - Prime Luthieria

## 📋 Pré-requisitos

1. **Conta no EasyPanel** configurada
2. **Repositório GitHub** com o código
3. **Domínio** (opcional, mas recomendado)

## 🔧 Configuração no EasyPanel

### 1. Criar Nova Aplicação

1. Acesse o painel do EasyPanel
2. Clique em **"New Application"**
3. Escolha **"Git Repository"**
4. Cole a URL do repositório: `https://github.com/seu-usuario/site-luthieria-v1`

### 2. Configurações da Aplicação

**Configurações Básicas:**
- **Name**: `prime-luthieria`
- **Framework**: `Node.js`
- **Branch**: `main` ou `master`

**Build Settings:**
- **Build Command**: `npm install --production`
- **Start Command**: `npm start`
- **Port**: `3000`

### 3. Variáveis de Ambiente

Adicione as seguintes variáveis de ambiente:

```bash
NODE_ENV=production
PORT=3000
SESSION_SECRET=sua_chave_secreta_super_segura_aqui
```

*Opcional (para funcionalidades futuras):*
```bash
EMAIL_USER=contato@seudominio.com
EMAIL_PASS=sua_senha_email
GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 4. Configurações de Domínio

1. Na seção **"Domains"**, adicione seu domínio
2. Configure o SSL automático (Let's Encrypt)
3. Aguarde a propagação DNS

### 5. Deploy

1. Clique em **"Deploy"**
2. Aguarde o build e deploy automático
3. Verifique os logs em caso de erro

## 🔍 Verificação Pós-Deploy

### 1. Teste Básico
- Acesse `https://seudominio.com`
- Verifique se a página inicial carrega

### 2. Teste Admin
- Acesse `https://seudominio.com/admin/login`
- Faça login com: `admin` / `prime123`
- Teste o painel administrativo

### 3. Teste das Páginas
- `/` - Página inicial
- `/sobre` - Sobre a empresa
- `/servicos` - Serviços oferecidos
- `/galeria` - Galeria de trabalhos
- `/contato` - Página de contato

## 🛡️ Segurança e Manutenção

### Backup dos Dados
O arquivo `config/site-data.json` contém todos os dados do site. Faça backup regularmente.

### Atualizações
Para atualizar o site:
1. Faça push das alterações para o GitHub
2. No EasyPanel, clique em **"Redeploy"**

### Monitoramento
- Configure alertas no EasyPanel
- Monitore logs em caso de erro
- Verifique o health check automático

## 📞 Suporte

### Problemas Comuns

**Build falha:**
- Verifique se todas as dependências estão no `package.json`
- Confirme que o Node.js version é compatível

**Aplicação não inicia:**
- Verifique a variável `PORT=3000`
- Confirme que `NODE_ENV=production`

**Erro 500:**
- Verifique logs no EasyPanel
- Confirme que o arquivo `config/site-data.json` existe

### Logs Úteis
```bash
# Verificar status do container
docker ps

# Ver logs da aplicação
docker logs [container-id]

# Verificar saúde da aplicação
curl https://seudominio.com/
```

## 🎯 Próximos Passos

1. **Configure SSL** (automático no EasyPanel)
2. **Configure domínio personalizado**
3. **Configure Google Analytics** (opcional)
4. **Configure backup automático** dos dados
5. **Configure monitoramento** de uptime

---

**✅ Site pronto para produção!**

O site da Prime Luthieria agora está configurado para funcionar perfeitamente no EasyPanel com Docker, incluindo painel administrativo funcional e armazenamento persistente de dados.
