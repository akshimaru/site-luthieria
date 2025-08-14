const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { requireAuth, checkAdminCredentials, loadSiteData } = require('../middleware/auth');

// Página de login
router.get('/login', (req, res) => {
    res.render('admin/login', {
        title: 'Admin Login - Prime Luthieria',
        description: 'Área administrativa do site Prime Luthieria',
        error: req.query.error
    });
});

// Processar login
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    if (checkAdminCredentials(username, password)) {
        req.session.admin = true;
        return res.redirect('/admin/dashboard');
    } else {
        return res.redirect('/admin/login?error=1');
    }
});

// Dashboard principal
router.get('/dashboard', requireAuth, (req, res) => {
    const siteData = loadSiteData();
    res.render('admin/dashboard', {
        title: 'Dashboard - Admin Prime Luthieria',
        description: 'Painel administrativo',
        siteData
    });
});

// Gerenciar informações gerais
router.get('/site-info', requireAuth, (req, res) => {
    const siteData = loadSiteData();
    res.render('admin/site-info', {
        title: 'Informações do Site - Admin',
        description: 'Gerenciar informações gerais do site',
        siteData
    });
});

// Salvar informações gerais
router.post('/site-info', requireAuth, (req, res) => {
    try {
        const siteData = loadSiteData();
        
        // Atualizar informações básicas do site
        siteData.site.name = req.body.site_name;
        siteData.site.tagline = req.body.tagline;
        siteData.site.description = req.body.description;
        siteData.site.phone = req.body.phone;
        siteData.site.whatsapp_message = req.body.whatsapp_message;
        siteData.site.email = req.body.email;
        
        // Atualizar endereço
        siteData.site.address.street = req.body.street;
        siteData.site.address.neighborhood = req.body.neighborhood;
        siteData.site.address.city = req.body.city;
        siteData.site.address.state = req.body.state;
        siteData.site.address.zipcode = req.body.zipcode;
        
        // Atualizar horários
        siteData.site.business_hours.weekdays = req.body.weekdays;
        siteData.site.business_hours.saturday = req.body.saturday;
        siteData.site.business_hours.sunday = req.body.sunday;
        
        // Atualizar redes sociais
        siteData.site.social_media.instagram = req.body.instagram;
        siteData.site.social_media.facebook = req.body.facebook;
        siteData.site.social_media.youtube = req.body.youtube;
        siteData.site.social_media.twitter = req.body.twitter;
        
        // Salvar arquivo
        const dataPath = path.join(__dirname, '../config/site-data.json');
        fs.writeFileSync(dataPath, JSON.stringify(siteData, null, 2));
        
        res.redirect('/admin/site-info?success=1');
    } catch (error) {
        console.error('Erro ao salvar dados:', error);
        res.redirect('/admin/site-info?error=1');
    }
});

// Gerenciar página Hero
router.get('/hero', requireAuth, (req, res) => {
    const siteData = loadSiteData();
    res.render('admin/hero', {
        title: 'Página Hero - Admin',
        description: 'Gerenciar conteúdo da página inicial',
        siteData
    });
});

// Salvar página Hero
router.post('/hero', requireAuth, (req, res) => {
    try {
        const siteData = loadSiteData();
        
        siteData.hero.title = req.body.title;
        siteData.hero.subtitle = req.body.subtitle;
        siteData.hero.background_image = req.body.background_image;
        
        const dataPath = path.join(__dirname, '../config/site-data.json');
        fs.writeFileSync(dataPath, JSON.stringify(siteData, null, 2));
        
        res.redirect('/admin/hero?success=1');
    } catch (error) {
        console.error('Erro ao salvar dados:', error);
        res.redirect('/admin/hero?error=1');
    }
});

// Gerenciar página Sobre
router.get('/about', requireAuth, (req, res) => {
    const siteData = loadSiteData();
    res.render('admin/about', {
        title: 'Página Sobre - Admin',
        description: 'Gerenciar conteúdo da página sobre',
        siteData
    });
});

// Salvar página Sobre
router.post('/about', requireAuth, (req, res) => {
    try {
        const siteData = loadSiteData();
        
        siteData.about.title = req.body.title;
        siteData.about.description = req.body.description;
        siteData.about.history.title = req.body.history_title;
        siteData.about.history.content = req.body.history_content;
        siteData.about.history.image = req.body.history_image;
        siteData.about.history.founded_year = req.body.founded_year;
        siteData.about.mission = req.body.mission;
        siteData.about.vision = req.body.vision;
        siteData.about.values = req.body.values;
        
        const dataPath = path.join(__dirname, '../config/site-data.json');
        fs.writeFileSync(dataPath, JSON.stringify(siteData, null, 2));
        
        res.redirect('/admin/about?success=1');
    } catch (error) {
        console.error('Erro ao salvar dados:', error);
        res.redirect('/admin/about?error=1');
    }
});

// Gerenciar equipe
router.get('/team', requireAuth, (req, res) => {
    const siteData = loadSiteData();
    res.render('admin/team', {
        title: 'Equipe - Admin',
        description: 'Gerenciar membros da equipe',
        siteData
    });
});

// Gerenciar serviços
router.get('/services', requireAuth, (req, res) => {
    const siteData = loadSiteData();
    res.render('admin/services', {
        title: 'Serviços - Admin',
        description: 'Gerenciar serviços oferecidos',
        siteData
    });
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
});

module.exports = router;
