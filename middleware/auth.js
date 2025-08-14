const fs = require('fs');
const path = require('path');

// Carregar dados do site
function loadSiteData() {
    try {
        const dataPath = path.join(__dirname, '../config/site-data.json');
        const data = fs.readFileSync(dataPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Erro ao carregar dados do site:', error);
        return null;
    }
}

// Middleware para verificar se o usuário está autenticado
function requireAuth(req, res, next) {
    if (req.session && req.session.admin) {
        return next();
    } else {
        return res.redirect('/admin/login');
    }
}

// Verificar credenciais de admin
function checkAdminCredentials(username, password) {
    const siteData = loadSiteData();
    if (!siteData) return false;
    
    return siteData.admin.username === username && siteData.admin.password === password;
}

module.exports = {
    loadSiteData,
    requireAuth,
    checkAdminCredentials
};
