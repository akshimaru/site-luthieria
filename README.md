# Prime Luthieria - Site Oficial

Site institucional da Prime Luthieria, especializada em manutenção e reparos de instrumentos musicais.

## 🎸 Sobre o Projeto

Este é o site oficial da Prime Luthieria, desenvolvido com foco em:
- **SEO otimizado** para termos relacionados à luthieria
- **Performance** e carregamento rápido
- **Responsividade** para todos os dispositivos
- **Acessibilidade** web
- **Conversão** de visitantes em clientes
- **Sistema administrativo** integrado
- **Deploy com Docker** para facilitar hospedagem

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **EJS** - Template engine
- **Express Session** - Gerenciamento de sessões
- **Express Validator** - Validação de formulários
- **Helmet** - Segurança
- **Compression** - Compressão de responses

### Frontend
- **HTML5** semântico
- **CSS3 customizado** - Estilos otimizados
- **JavaScript ES6+** - Interatividade
- **Sistema responsivo** - Layout adaptativo

### Infraestrutura
- **Docker** - Containerização
- **EasyPanel** - Deploy simplificado
- **JSON** - Armazenamento de dados
- **Nginx** - Servidor web (via EasyPanel)

## 📦 Deploy no EasyPanel

### 1. Preparação do Projeto

O projeto já inclui todos os arquivos necessários para deploy:
- `Dockerfile` - Configuração do container
- `docker-compose.yml` - Orquestração de serviços
- `EASYPANEL.md` - Guia específico do EasyPanel

### 2. Configuração no EasyPanel

1. **Crie uma nova aplicação** no EasyPanel
2. **Conecte ao repositório GitHub**
3. **Configure as variáveis de ambiente**:
   ```
   NODE_ENV=production
   PORT=3000
   SESSION_SECRET=sua_chave_secreta_aleatoria
   ```
4. **Configure o domínio** desejado
5. **Deploy automático** será iniciado

### 3. Configurações Importantes

- **Porta**: 3000
- **Health Check**: Incluído no Dockerfile
- **Dados**: Armazenados em arquivo JSON (persistente)
- **Admin**: Acesso via `/admin/login` (admin/prime123)

## �️ Instalação Local

### Pré-requisitos
- Node.js (versão 18 ou superior)
- Docker (opcional)

### Método 1: Instalação Tradicional

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/site-luthieria-v1.git
cd site-luthieria-v1
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
# Edite o arquivo .env conforme necessário
```

4. **Inicie o servidor**
```bash
npm run dev
```

### Método 2: Docker

1. **Build da imagem**
```bash
docker build -t prime-luthieria .
```

2. **Execute o container**
```bash
docker run -p 3000:3000 prime-luthieria
```

### Método 3: Docker Compose

```bash
docker-compose up -d
```
cd prime-luthieria
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
- EMAIL_USER e EMAIL_PASS para envio de emails
- RECAPTCHA_SITE_KEY e RECAPTCHA_SECRET_KEY
- GA_MEASUREMENT_ID para Google Analytics

4. **Execute o projeto**

**Desenvolvimento:**
```bash
npm run dev
```

**Produção:**
```bash
npm start
```

5. **Acesse o site**
Abra seu navegador e vá para `http://localhost:3000`

## 📁 Estrutura do Projeto

```
prime-luthieria/
├── app.js                 # Arquivo principal do servidor
├── package.json           # Dependências e scripts
├── .env.example           # Exemplo de variáveis de ambiente
├── routes/                # Rotas da aplicação
│   ├── index.js          # Rotas das páginas principais
│   └── contact.js        # Rota do formulário de contato
├── views/                 # Templates EJS
│   ├── layout.ejs        # Layout principal
│   ├── index.ejs         # Página inicial
│   ├── sobre.ejs         # Página sobre
│   ├── servicos.ejs      # Página de serviços
│   ├── galeria.ejs       # Galeria de trabalhos
│   ├── contato.ejs       # Página de contato
│   ├── 404.ejs           # Página de erro 404
│   └── 500.ejs           # Página de erro 500
└── public/               # Arquivos estáticos
    ├── css/
    │   └── style.css     # Estilos customizados
    ├── js/
    │   └── main.js       # JavaScript principal
    ├── images/           # Imagens do site
    ├── videos/           # Vídeos dos trabalhos
    ├── robots.txt        # Arquivo para crawlers
    └── sitemap.xml       # Mapa do site
```

## 🎯 Funcionalidades

### Páginas Principais
- **Home** - Banner hero, serviços em destaque, sobre e CTA
- **Sobre** - História, equipe, missão/visão/valores
- **Serviços** - Lista completa de serviços com preços
- **Galeria** - Trabalhos realizados com filtros e lightbox
- **Contato** - Formulário, informações e mapa

### Funcionalidades Técnicas
- **Formulário de contato** com validação e envio por email
- **Galeria interativa** com filtros e lightbox
- **Menu responsivo** para mobile
- **Carrossel de depoimentos** automático
- **FAQ accordion** interativo
- **Lazy loading** de imagens
- **Google reCAPTCHA** anti-spam

### SEO
- URLs amigáveis e semânticas
- Meta tags completas em todas as páginas
- Rich snippets para negócio local
- Sitemap.xml atualizado
- Robots.txt configurado
- Estrutura HTML semântica
- Performance otimizada

## ⚙️ Configuração de Produção

### Variáveis de Ambiente Obrigatórias
```bash
PORT=3000
EMAIL_USER=contato@primeluthieria.com
EMAIL_PASS=sua_senha_do_email
RECAPTCHA_SITE_KEY=sua_chave_do_recaptcha
RECAPTCHA_SECRET_KEY=sua_chave_secreta_do_recaptcha
GA_MEASUREMENT_ID=seu_id_do_google_analytics
```

### Deploy

#### Opção 1: VPS/Servidor Próprio
```bash
# Instalar dependências de produção
npm ci --production

# Usar PM2 para gerenciar o processo
npm install -g pm2
pm2 start app.js --name "prime-luthieria"
pm2 startup
pm2 save
```

#### Opção 2: Heroku
```bash
# Adicionar buildpack do Node.js
heroku buildpacks:set heroku/nodejs

# Configure as variáveis de ambiente no dashboard do Heroku
heroku config:set NODE_ENV=production
heroku config:set EMAIL_USER=seu_email
# ... outras variáveis

# Deploy
git push heroku main
```

#### Opção 3: Vercel
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Configure as variáveis de ambiente no dashboard da Vercel
```

## 🔧 Customização

### Cores e Branding
As cores principais estão configuradas no Tailwind CSS:
- **Primary**: Tons de marrom (#d4864b, #c6713f, #a45836)
- **Gold**: Tons dourados (#f59e0b, #d97706, #b45309)

Para alterar, edite as configurações no `layout.ejs`:
```javascript
tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: { /* suas cores */ },
                gold: { /* suas cores */ }
            }
        }
    }
}
```

### Conteúdo
- **Textos**: Edite diretamente nos arquivos `.ejs` em `/views/`
- **Imagens**: Substitua os arquivos em `/public/images/`
- **Serviços**: Modifique o array de serviços em `/routes/index.js`

### Email
Configure o SMTP no arquivo `.env`:
```bash
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_de_app
```

Para outros provedores de email, edite a configuração do transporter em `/routes/contact.js`.

## 📊 Analytics e Monitoramento

### Google Analytics
1. Crie uma propriedade no Google Analytics 4
2. Adicione o ID no arquivo `.env`
3. O código de tracking já está incluído no layout

### Google Search Console
1. Adicione e verifique a propriedade
2. Envie o sitemap: `https://seudominio.com/sitemap.xml`
3. Configure as URLs preferenciais

## 🛡️ Segurança

O projeto inclui várias medidas de segurança:
- **Helmet.js** para headers de segurança
- **Rate limiting** para prevenir ataques
- **Validação** de entrada em formulários
- **Sanitização** de dados
- **HTTPS** recomendado em produção

## 📱 PWA (Opcional)

Para transformar em PWA, adicione:
1. **Manifest.json** em `/public/`
2. **Service Worker** em `/public/sw.js`
3. **Ícones** para diferentes tamanhos

## 🤝 Suporte

Para suporte técnico:
- **Email**: dev@primeluthieria.com
- **Documentação**: Este README
- **Issues**: GitHub Issues (se aplicável)

## 📄 Licença

Este projeto é proprietário da Prime Luthieria. Todos os direitos reservados.

---

**Prime Luthieria** - Tradição e Qualidade em Luthieria desde 2014
🎸 https://primeluthieria.com
