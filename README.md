# Prime Luthieria CMS 🎸

Sistema completo de gerenciamento de conteúdo para a Prime Luthieria - especializada em manutenção e conserto de instrumentos musicais.

## 🚀 Deploy em Produção (EasyPanel)

### Pré-requisitos
- Conta no [EasyPanel](https://easypanel.io/)
- Servidor VPS configurado
- Repositório no GitHub: `https://github.com/akshimaru/luthiera-v3`

### Deploy Automático

#### Windows (PowerShell):
```powershell
.\deploy.ps1
```

#### Linux/Mac (Bash):
```bash
chmod +x deploy.sh
./deploy.sh
```

### Deploy Manual no EasyPanel

1. Acesse seu painel do EasyPanel
2. Clique em **"Add Service"** > **"From Git Repository"**
3. Cole a URL: `https://github.com/akshimaru/luthiera-v3`
4. EasyPanel detectará automaticamente o `easypanel.yml`
5. Configure seu domínio personalizado (opcional)
6. Clique em **"Deploy"**

## 🏠 Desenvolvimento Local

### Instalar dependências:
```bash
npm install
```

### Rodar em desenvolvimento:
```bash
npm run dev
```

### Build para produção:
```bash
npm run build
```

### Testar build local com Docker:
```bash
docker build -t prime-luthieria .
docker run -p 8080:80 prime-luthieria
```
Acesse: http://localhost:8080

## 🔧 Configuração

### Variáveis de Ambiente
```env
VITE_SUPABASE_URL=https://jqyoxoviyyrmfszrcmbv.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_publica_supabase
```

### Usuário Administrador Padrão
- **Email:** admin@admin.com
- **Senha:** password

⚠️ **Importante:** Altere as credenciais padrão após o primeiro login!

## 🗄️ Banco de Dados (Supabase)

### Configurar usuário admin:
1. Execute o script: `setup_admin_user.sql` no SQL Editor do Supabase
2. Crie o usuário na aba Authentication
3. Vincule o UUID conforme instruções no script

### Migrações:
- `20250818012602_delicate_paper.sql` - Estrutura principal
- `20250818012635_smooth_pebble.sql` - Dados iniciais
- `20250818013000_add_default_admin.sql` - Usuário admin

## 🏗️ Arquitetura

### Frontend
- **Vite + React 18** - Build tool e biblioteca UI
- **TypeScript** - Tipagem estática
- **TailwindCSS** - Estilização
- **React Router v7** - Roteamento
- **React Hook Form + Zod** - Formulários e validação

### Backend
- **Supabase** - Database PostgreSQL + Authentication
- **Row Level Security (RLS)** - Segurança de dados

### Deploy
- **Docker** - Containerização
- **Nginx** - Servidor web otimizado
- **EasyPanel** - Orquestração e deploy

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
├── hooks/              # Custom hooks (useAuth)
├── lib/                # Configurações (Supabase)
├── pages/              # Páginas da aplicação
│   ├── admin/          # Área administrativa
│   └── [public]/       # Páginas públicas
└── assets/             # Recursos estáticos

supabase/
└── migrations/         # Migrações do banco

docker/                 # Configurações Docker
├── Dockerfile          # Imagem de produção
├── nginx.conf          # Configuração Nginx
└── easypanel.yml       # Deploy EasyPanel
```

## 🌟 Funcionalidades

### Área Pública
- ✅ Home page responsiva
- ✅ Catálogo de serviços
- ✅ Galeria de trabalhos
- ✅ Depoimentos de clientes
- ✅ Página sobre a empresa
- ✅ Formulário de contato
- ✅ SEO otimizado

### Área Administrativa
- ✅ Dashboard completo
- ✅ Gerenciamento de serviços
- ✅ Galeria de mídias
- ✅ Gestão de depoimentos
- ✅ Editor de conteúdo
- ✅ Configurações do site
- ✅ Upload de arquivos

### Técnico
- ✅ Autenticação segura
- ✅ Responsive design
- ✅ PWA ready
- ✅ Performance otimizada
- ✅ Docker containerizado

## 📞 Suporte

Para dúvidas ou suporte, entre em contato através do repositório GitHub.

---

**Desenvolvido para Prime Luthieria** - Especialistas em instrumentos musicais 🎵
