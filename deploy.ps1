# Deploy script para Prime Luthieria CMS - Windows PowerShell
# Execute este script para fazer deploy no EasyPanel

Write-Host "🚀 Iniciando deploy do Prime Luthieria CMS..." -ForegroundColor Green

# Check if git is initialized
if (!(Test-Path ".git")) {
    Write-Host "📝 Inicializando repositório Git..." -ForegroundColor Yellow
    git init
    git remote add origin https://github.com/akshimaru/luthiera-v3.git
}

# Add all files
Write-Host "📦 Adicionando arquivos ao Git..." -ForegroundColor Yellow
git add .

# Commit changes
$commitMessage = "Deploy: Configuração para produção com Docker e EasyPanel - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Write-Host "💾 Fazendo commit das alterações..." -ForegroundColor Yellow
git commit -m $commitMessage

# Push to GitHub
Write-Host "📤 Enviando para GitHub..." -ForegroundColor Yellow
git push -u origin main

Write-Host "✅ Deploy concluído!" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 Próximos passos no EasyPanel:" -ForegroundColor Cyan
Write-Host "1. Acesse seu painel do EasyPanel"
Write-Host "2. Clique em 'Add Service' > 'From Git Repository'"
Write-Host "3. Cole a URL: https://github.com/akshimaru/luthiera-v3"
Write-Host "4. EasyPanel detectará automaticamente o arquivo easypanel.yml"
Write-Host "5. Configure seu domínio personalizado se desejar"
Write-Host "6. Clique em 'Deploy'"
Write-Host ""
Write-Host "🌐 Seu site estará disponível em alguns minutos!" -ForegroundColor Green
Write-Host "📝 Login admin: admin@admin.com | password" -ForegroundColor Yellow

Write-Host ""
Write-Host "Para testar localmente antes do deploy:" -ForegroundColor Magenta
Write-Host "docker build -t prime-luthieria ." -ForegroundColor Gray
Write-Host "docker run -p 8080:80 prime-luthieria" -ForegroundColor Gray
Write-Host "Depois acesse: http://localhost:8080" -ForegroundColor Gray
