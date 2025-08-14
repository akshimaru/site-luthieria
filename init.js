#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Verifica se o diretório config existe
const configDir = path.join(__dirname, 'config');
if (!fs.existsSync(configDir)) {
  console.log('Criando diretório config...');
  fs.mkdirSync(configDir, { recursive: true });
}

// Verifica se o arquivo site-data.json existe
const siteDataPath = path.join(configDir, 'site-data.json');
if (!fs.existsSync(siteDataPath)) {
  console.log('Arquivo site-data.json não encontrado. Criando arquivo padrão...');
  
  const defaultData = {
    admin: {
      username: 'admin',
      password: 'prime123'
    },
    site: {
      name: 'Serviços Prime Luthieria',
      tagline: 'Especialistas em Manutenção e Reparos de Instrumentos Musicais',
      description: 'Serviços Prime Luthieria oferece serviços especializados em manutenção, reparos e ajustes de instrumentos musicais. Qualidade e tradição há mais de 10 anos.',
      phone: '61981126864',
      whatsapp_message: 'Oi vi seu site gostaria de fazer uma manutenção em meu instrumento.',
      email: 'servicosprime.work@gmail.com',
      address: {
        street: 'Rua 13 norte lote 01/03 Loja 24 - Vitrinni Shopping',
        neighborhood: 'Águas Claras',
        city: 'Brasília',
        state: 'DF',
        zipcode: '71909-720'
      },
      business_hours: {
        weekdays: 'Segunda a Sexta: 8h às 18h',
        saturday: 'Sábado: 8h às 18h',
        sunday: 'Domingo: Fechado'
      },
      social_media: {
        instagram: 'https://instagram.com/luthieriabrasilia',
        facebook: 'https://facebook.com',
        youtube: 'https://youtube.com/@services.prime.luthieria',
        twitter: 'https://x.com'
      }
    },
    hero: {
      title: 'Especialistas em Luthieria',
      subtitle: 'Cuidamos do seu instrumento com a dedicação e técnica que ele merece. Mais de 10 anos transformando música em arte.',
      background_image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    },
    services: [],
    gallery: [],
    faq: []
  };
  
  fs.writeFileSync(siteDataPath, JSON.stringify(defaultData, null, 2));
  console.log('Arquivo site-data.json criado com sucesso!');
} else {
  console.log('Arquivo site-data.json encontrado.');
}

console.log('Inicialização completa!');
