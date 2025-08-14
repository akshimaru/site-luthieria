const express = require('express');
const router = express.Router();
const { loadSiteData } = require('../middleware/auth');

// Página inicial
router.get('/', (req, res) => {
  const siteData = loadSiteData();
  res.render('index', {
    title: `${siteData.site.name} - ${siteData.site.tagline}`,
    description: siteData.site.description,
    currentPage: 'home',
    siteData
  });
});

// Sobre nós
router.get('/sobre', (req, res) => {
  const siteData = loadSiteData();
  res.render('sobre', {
    title: `${siteData.about.title} - ${siteData.site.name}`,
    description: siteData.about.description,
    currentPage: 'sobre',
    siteData
  });
});

// Serviços
router.get('/servicos', (req, res) => {
  const siteData = loadSiteData();
  res.render('servicos', {
    title: 'Serviços de Luthieria - Manutenção e Reparos de Instrumentos Musicais',
    description: 'Conheça todos os nossos serviços especializados em luthieria: manutenção, reparos, setup, troca de trastes e muito mais.',
    currentPage: 'servicos',
    servicos: siteData.services,
    siteData
  });
});

// Galeria
router.get('/galeria', (req, res) => {
  const siteData = loadSiteData();
  res.render('galeria', {
    title: 'Galeria de Trabalhos - Prime Luthieria | Antes e Depois',
    description: 'Veja nossos trabalhos realizados: restaurações, reparos e manutenções em diversos instrumentos musicais.',
    currentPage: 'galeria',
    trabalhos: siteData.gallery,
    siteData
  });
});

module.exports = router;
