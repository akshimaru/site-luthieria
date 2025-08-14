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

// Importar rotas
const indexRoutes = require('./routes/index');
const contactRoutes = require('./routes/contact');
const adminRoutes = require('./routes/admin');

// Middlewares de segurança
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://www.google.com", "https://www.gstatic.com", "https://www.googletagmanager.com"],
      imgSrc: ["'self'", "data:", "https:"],
      frameSrc: ["https://www.google.com"]
    }
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 1000, // máximo 1000 requests por IP (mais permissivo para desenvolvimento)
  message: 'Muitas requisições deste IP, tente novamente em alguns minutos.'
});
app.use(limiter);

// Compressão
app.use(compression());

// Configuração de sessões
app.use(session({
  secret: process.env.SESSION_SECRET || 'prime-luthieria-admin-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // true para HTTPS em produção
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// Configurações do Express
app.use(expressLayouts);
app.set('layout', 'layout');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));
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
  console.log(`🚀 Servidor Prime Luthieria iniciado`);
  console.log(`📡 Porta: ${PORT}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🐳 Host: 0.0.0.0 (Docker/VPS Ready)`);
  
  if (process.env.NODE_ENV === 'production') {
    console.log(`✅ Aplicação rodando em modo PRODUÇÃO`);
  } else {
    console.log(`🔧 Modo desenvolvimento - Acesse: http://localhost:${PORT}`);
  }
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
