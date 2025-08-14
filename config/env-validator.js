// Validação das variáveis de ambiente
function validateEnv() {
  const required = ['NODE_ENV', 'PORT'];
  const recommended = ['SESSION_SECRET'];
  
  console.log('🔍 Validando variáveis de ambiente...');
  
  // Verificar obrigatórias
  for (const env of required) {
    if (!process.env[env]) {
      console.error(`❌ ERRO: Variável obrigatória ${env} não encontrada`);
      process.exit(1);
    }
    console.log(`✅ ${env}: ${process.env[env]}`);
  }
  
  // Verificar recomendadas
  for (const env of recommended) {
    if (!process.env[env]) {
      console.warn(`⚠️  AVISO: Variável recomendada ${env} não encontrada`);
    } else {
      console.log(`✅ ${env}: [CONFIGURADO]`);
    }
  }
  
  // Verificações específicas para produção
  if (process.env.NODE_ENV === 'production') {
    console.log('🚀 Modo PRODUÇÃO detectado');
    
    if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
      console.warn('⚠️  AVISO: SESSION_SECRET muito simples para produção');
    }
    
    if (process.env.PORT !== '3000') {
      console.warn(`⚠️  AVISO: Porta ${process.env.PORT} detectada (recomendado: 3000)`);
    }
  } else {
    console.log('🔧 Modo DESENVOLVIMENTO detectado');
  }
  
  console.log('✅ Validação de ambiente concluída\n');
}

module.exports = { validateEnv };
