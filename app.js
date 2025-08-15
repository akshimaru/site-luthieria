const express = require('express');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy para VPS/EasyPanel
app.set('trust proxy', 1);

// Servir arquivos estáticos - CONFIGURAÇÃO SIMPLES
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1h'
}));

// Importar rotas
const indexRoutes = require('./routes/index');
const contactRoutes = require('./routes/contact');
const adminRoutes = require('./routes/admin');

// Segurança básica - SEM CSP
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// Rate limiting simples
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: 'Muitas requisições deste IP, tente novamente em alguns minutos.'
});
app.use(limiter);

// Compressão
app.use(compression());

// Configuração de sessões
app.use(session({
  secret: process.env.SESSION_SECRET || 'prime-luthieria-secret-2025',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// Configurações do Express
app.use(expressLayouts);
app.set('layout', 'layout');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares de parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware para determinar o layout
app.use((req, res, next) => {
  if (req.path.startsWith('/admin')) {
    res.locals.layout = 'layouts/admin';
    res.locals.admin = req.session && req.session.admin;
  } else {
    res.locals.layout = 'layout';
  }
  next();
});

// Rotas
app.use('/', indexRoutes);
app.use('/contato', contactRoutes);
app.use('/admin', adminRoutes);

// Middleware para 404
app.use((req, res) => {
  res.status(404).render('404', {
    title: 'Página Não Encontrada - Prime Luthieria',
    description: 'A página que você procura não foi encontrada. Volte à página inicial ou entre em contato conosco.',
    currentPage: '404'
  });
});

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('500', {
    title: 'Erro Interno - Prime Luthieria',
    description: 'Ocorreu um erro interno no servidor. Nossa equipe técnica foi notificada e está trabalhando para resolver o problema.',
    currentPage: 'error'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Servidor pronto!`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

module.exports = app;
