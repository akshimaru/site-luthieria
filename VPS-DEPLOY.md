# 🚀 Deploy VPS com EasyPanel - Prime Luthieria

## 📋 Configuração Atual Detectada
- ✅ VPS com Docker instalado
- ✅ EasyPanel rodando
- ❌ Porta 80 (deve ser 3000 para esta aplicação)
- ❌ Ambiente development (deve ser production)

## 🔧 Correções Necessárias no EasyPanel

### 1. **Variáveis de Ambiente**
Configure no painel do EasyPanel:

```bash
NODE_ENV=production
PORT=3000
SESSION_SECRET=prime_luthieria_vps_secret_key_2025
```

### 2. **Configuração da Aplicação**
```
Framework: Node.js
Build Command: npm install --production
Start Command: npm start
Port: 3000 (NÃO 80)
Health Check Path: /
```

### 3. **Proxy/Nginx Configuration**
O EasyPanel deve fazer proxy da porta 3000 para 80/443:
```
VPS:80 → Container:3000
VPS:443 → Container:3000 (SSL)
```

## 🐳 **Deploy via Docker**

### Opção 1: Docker Compose (Recomendado)
```bash
# Na VPS, clone o repositório
git clone https://github.com/akshimaru/site-luthieria.git
cd site-luthieria

# Execute com docker-compose
docker-compose up -d
```

### Opção 2: Docker Build Manual
```bash
# Build da imagem
docker build -t prime-luthieria .

# Execute o container
docker run -d \
  --name prime-luthieria \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -e SESSION_SECRET=sua_chave_secreta \
  -v $(pwd)/config:/app/config \
  --restart unless-stopped \
  prime-luthieria
```

## 📊 **Verificação de Status**

### Verificar se está rodando
```bash
# Ver containers rodando
docker ps

# Ver logs da aplicação
docker logs prime-luthieria

# Testar saúde da aplicação
curl http://localhost:3000/
```

### Logs Esperados em Produção
```
🚀 Servidor Prime Luthieria iniciado
📡 Porta: 3000
🌍 Ambiente: production
🐳 Host: 0.0.0.0 (Docker/VPS Ready)
✅ Aplicação rodando em modo PRODUÇÃO
```

## 🔧 **Configuração do EasyPanel**

### Template de Configuração
```json
{
  "name": "prime-luthieria",
  "framework": "nodejs",
  "repository": "https://github.com/akshimaru/site-luthieria.git",
  "branch": "master",
  "buildCommand": "npm install --production",
  "startCommand": "npm start",
  "port": 3000,
  "environment": {
    "NODE_ENV": "production",
    "PORT": "3000",
    "SESSION_SECRET": "prime_luthieria_vps_secret_key_2025"
  }
}
```

## 🌐 **Configuração de Domínio**

1. **Configure o domínio** no EasyPanel
2. **SSL automático** será configurado
3. **Proxy reverso** redirecionará:
   - `https://seudominio.com` → `container:3000`

## 🔒 **Acesso Admin**

Após deploy, acesse:
- **Site**: `https://seudominio.com`
- **Admin**: `https://seudominio.com/admin/login`
- **Credenciais**: `admin` / `prime123`

## ⚠️ **Solução de Problemas**

### Se o container não iniciar:
```bash
# Verificar logs
docker logs prime-luthieria -f

# Reiniciar container
docker restart prime-luthieria
```

### Se aparecer porta 80:
- Verifique se `PORT=3000` está nas variáveis de ambiente
- Confirme que o EasyPanel está configurado para porta 3000

### Se aparecer "development":
- Configure `NODE_ENV=production` no EasyPanel
- Reconstrua a aplicação

---

**✅ Com essas configurações, o site funcionará perfeitamente na VPS com EasyPanel!**
