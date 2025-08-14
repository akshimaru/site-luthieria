const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Página de contato
router.get('/', (req, res) => {
  try {
    const siteData = JSON.parse(fs.readFileSync(path.join(__dirname, '../config/site-data.json'), 'utf8'));
    
    res.render('contato', {
      title: `Contato - ${siteData.site.name} | WhatsApp Direto`,
      description: 'Entre em contato conosco pelo WhatsApp para orçamentos, dúvidas ou agendamento de serviços. Resposta rápida garantida.',
      currentPage: 'contato',
      siteData: siteData
    });
  } catch (error) {
    console.error('Erro na página de contato:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

module.exports = router;
