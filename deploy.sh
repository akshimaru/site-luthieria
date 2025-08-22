#!/bin/bash

# Deploy script para Prime Luthieria CMS
# Execute este script para fazer deploy no EasyPanel

echo "🚀 Iniciando deploy do Prime Luthieria CMS..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📝 Inicializando repositório Git..."
    git init
    git remote add origin https://github.com/akshimaru/luthiera-v3.git
fi

# Add all files
echo "📦 Adicionando arquivos ao Git..."
git add .

# Commit changes
echo "💾 Fazendo commit das alterações..."
git commit -m "Deploy: Configuração para produção com Docker e EasyPanel - $(date '+%Y-%m-%d %H:%M:%S')"

# Push to GitHub
echo "📤 Enviando para GitHub..."
git push -u origin main

echo "✅ Deploy concluído!"
echo ""
echo "🎯 Próximos passos no EasyPanel:"
echo "1. Acesse seu painel do EasyPanel"
echo "2. Clique em 'Add Service' > 'From Git Repository'"
echo "3. Cole a URL: https://github.com/akshimaru/luthiera-v3"
echo "4. EasyPanel detectará automaticamente o arquivo easypanel.yml"
echo "5. Configure seu domínio personalizado se desejar"
echo "6. Clique em 'Deploy'"
echo ""
echo "🌐 Seu site estará disponível em alguns minutos!"
echo "📝 Login admin: admin@admin.com | password"
