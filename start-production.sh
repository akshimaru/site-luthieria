#!/bin/bash

# Script de inicialização para produção
echo "🚀 Iniciando Prime Luthieria em modo PRODUÇÃO"

# Verificar se as variáveis essenciais estão definidas
if [ -z "$NODE_ENV" ]; then
  echo "❌ NODE_ENV não definido - configurando para production"
  export NODE_ENV=production
fi

if [ -z "$PORT" ]; then
  echo "❌ PORT não definido - configurando para 3000"
  export PORT=3000
fi

if [ -z "$SESSION_SECRET" ]; then
  echo "⚠️  SESSION_SECRET não definido - usando valor padrão (INSEGURO)"
  export SESSION_SECRET="prime_luthieria_default_secret_$(date +%s)"
fi

echo "✅ Variáveis de ambiente configuradas:"
echo "   NODE_ENV: $NODE_ENV"
echo "   PORT: $PORT"
echo "   SESSION_SECRET: [CONFIGURADO]"

# Executar a aplicação
echo "🚀 Iniciando aplicação..."
exec node app.js
