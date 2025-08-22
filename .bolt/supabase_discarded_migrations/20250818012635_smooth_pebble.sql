/*
  # Dados Iniciais - Prime Luthieria CMS

  ## Dados inseridos:
  1. Configurações iniciais do site
  2. Meta tags para páginas principais
  3. Serviços da luthieria
  4. Seções de conteúdo editáveis
  5. Depoimentos de exemplo
*/

-- Insert site configuration
INSERT INTO site_config (
  site_name,
  phone,
  email,
  address,
  business_hours,
  social_media
) VALUES (
  'Serviços Prime Luthieria',
  '(11) 99999-9999',
  'contato@primeluthieria.com.br',
  'Rua dos Músicos, 123 - Vila Madalena, São Paulo - SP, CEP: 05434-000',
  '{"seg_sex": "09:00 às 18:00", "sab": "09:00 às 13:00", "dom": "Fechado"}',
  '{"facebook": "https://facebook.com/primeluthieria", "instagram": "https://instagram.com/primeluthieria", "whatsapp": "5511999999999"}'
) ON CONFLICT DO NOTHING;

-- Insert meta tags for main pages
INSERT INTO meta_tags (page_slug, page_title, meta_description, meta_keywords, og_title, og_description, schema_json) VALUES
(
  'home',
  'Prime Luthieria - Manutenção e Conserto de Instrumentos Musicais em São Paulo',
  'Especialistas em manutenção, conserto e restauração de instrumentos musicais. Atendimento profissional para violão, guitarra, baixo, violino e mais. São Paulo - SP.',
  'luthier, conserto instrumentos, manutenção violão, regulagem guitarra, restauração violino, luthieria são paulo',
  'Prime Luthieria - Especialistas em Instrumentos Musicais',
  'Manutenção profissional e conserto especializado de instrumentos musicais em São Paulo. Qualidade e tradição há mais de 20 anos.',
  '{"@context": "https://schema.org", "@type": "LocalBusiness", "name": "Serviços Prime Luthieria", "description": "Especialistas em manutenção e conserto de instrumentos musicais", "address": {"@type": "PostalAddress", "streetAddress": "Rua dos Músicos, 123", "addressLocality": "São Paulo", "addressRegion": "SP", "postalCode": "05434-000"}, "telephone": "(11) 99999-9999", "email": "contato@primeluthieria.com.br", "openingHours": ["Mo-Fr 09:00-18:00", "Sa 09:00-13:00"], "priceRange": "$$", "image": "/images/luthieria-banner.jpg"}'
),
(
  'servicos',
  'Nossos Serviços - Conserto e Manutenção de Instrumentos | Prime Luthieria',
  'Conheça todos os nossos serviços especializados: manutenção de violão, regulagem de guitarra, conserto de baixo, restauração de violino e muito mais.',
  'serviços luthieria, conserto violão, manutenção guitarra, regulagem baixo, restauração violino',
  'Serviços Especializados em Instrumentos Musicais',
  'Oferecemos serviços completos de manutenção, conserto e restauração para todos os tipos de instrumentos musicais.',
  '{"@context": "https://schema.org", "@type": "Service", "serviceType": "Manutenção de Instrumentos Musicais", "provider": {"@type": "LocalBusiness", "name": "Serviços Prime Luthieria"}}'
),
(
  'galeria',
  'Galeria de Trabalhos - Prime Luthieria | Antes e Depois',
  'Veja nossa galeria com trabalhos realizados. Fotos e vídeos dos serviços de conserto, manutenção e restauração de instrumentos musicais.',
  'galeria luthieria, trabalhos realizados, antes depois instrumentos, fotos consertos',
  'Galeria de Trabalhos - Prime Luthieria',
  'Confira os trabalhos que já realizamos em instrumentos musicais. Qualidade e dedicação em cada detalhe.',
  '{"@context": "https://schema.org", "@type": "ImageGallery", "name": "Galeria de Trabalhos Prime Luthieria"}'
),
(
  'depoimentos',
  'Depoimentos de Clientes - Prime Luthieria | Avaliações',
  'Leia os depoimentos e avaliações dos nossos clientes satisfeitos. Qualidade reconhecida em serviços de luthieria em São Paulo.',
  'depoimentos luthieria, avaliações clientes, testemunhos serviços, opinião clientes',
  'Depoimentos de Clientes Satisfeitos',
  'Veja o que nossos clientes falam sobre nossos serviços especializados em instrumentos musicais.',
  '{"@context": "https://schema.org", "@type": "Review", "reviewBody": "Avaliações dos clientes Prime Luthieria"}'
),
(
  'sobre',
  'Sobre Nós - Prime Luthieria | História e Experiência',
  'Conheça a história da Prime Luthieria. Mais de 20 anos de experiência em manutenção e conserto de instrumentos musicais em São Paulo.',
  'sobre prime luthieria, história empresa, experiência luthier, tradição instrumentos',
  'Nossa História - Prime Luthieria',
  'Tradição e experiência em luthieria. Conheça nossa história e compromisso com a qualidade.',
  '{"@context": "https://schema.org", "@type": "AboutPage", "mainEntity": {"@type": "LocalBusiness", "name": "Serviços Prime Luthieria"}}'
),
(
  'contato',
  'Contato - Prime Luthieria | Orçamentos e Informações',
  'Entre em contato conosco para orçamentos e informações. Estamos localizados em São Paulo - SP. Atendimento especializado em luthieria.',
  'contato luthieria, orçamento instrumentos, endereço luthier são paulo, telefone',
  'Entre em Contato - Prime Luthieria',
  'Solicite seu orçamento ou tire suas dúvidas. Estamos prontos para atender você com qualidade e profissionalismo.',
  '{"@context": "https://schema.org", "@type": "ContactPage", "mainEntity": {"@type": "LocalBusiness", "name": "Serviços Prime Luthieria"}}'
) ON CONFLICT (page_slug) DO NOTHING;

-- Insert services
INSERT INTO services (title, slug, short_description, full_description, price_text, is_featured, display_order) VALUES
(
  'Manutenção Completa de Violão',
  'manutencao-violao',
  'Regulagem completa, troca de cordas, limpeza e ajustes para o melhor desempenho do seu violão.',
  'Serviço completo que inclui: regulagem da altura das cordas, ajuste do tensor, nivelamento e polimento dos trastes, limpeza do braço e corpo, troca de cordas, lubrificação das tarraxas e ajuste da pestana. Seu violão ficará com sonoridade perfeita e tocabilidade profissional.',
  'A partir de R$ 120,00',
  true,
  1
),
(
  'Regulagem de Guitarra Elétrica',
  'regulagem-guitarra',
  'Setup profissional para guitarra elétrica com ajuste de captadores, ponte e eletrônica.',
  'Setup completo incluindo: regulagem da altura das cordas e captadores, ajuste do tensor, nivelamento dos trastes, ajuste da ponte (tremolo ou fixo), limpeza dos potenciômetros, teste da eletrônica, troca de cordas e afinação precisa. Perfeito para guitarristas profissionais.',
  'A partir de R$ 150,00',
  true,
  2
),
(
  'Conserto de Baixo Elétrico',
  'conserto-baixo',
  'Reparos em baixos elétricos incluindo eletrônica, estrutura e componentes.',
  'Diagnóstico e reparo de problemas eletrônicos, troca de captadores, reparo de soldas, ajuste estrutural, regulagem completa, reparo de tarraxas e ponte. Especializado em todas as marcas e modelos.',
  'Consulte valores',
  true,
  3
),
(
  'Restauração de Violino',
  'restauracao-violino',
  'Restauração completa de violinos antigos e contemporâneos com técnicas tradicionais.',
  'Serviço especializado em restauração usando técnicas centenárias de luthieria. Inclui reparo de rachaduras, substituição de peças danificadas, verniz tradicional, ajuste do cavalete e alma, restauração do espelho e cravelhas.',
  'A partir de R$ 300,00',
  false,
  4
),
(
  'Manutenção de Instrumentos de Sopro',
  'manutencao-sopro',
  'Limpeza, regulagem e pequenos reparos em instrumentos de sopro.',
  'Serviços para flauta, clarinete, saxofone, trompete e outros. Inclui limpeza interna completa, lubrificação de chaves e pistões, pequenos reparos em vedações, ajuste de molas e regulagem geral.',
  'A partir de R$ 80,00',
  false,
  5
),
(
  'Construção de Instrumentos Personalizados',
  'construcao-personalizada',
  'Construção artesanal de instrumentos sob medida conforme suas especificações.',
  'Construção completa de violões, guitarras e outros instrumentos cordofônicos. Escolha das madeiras, design personalizado, acabamento premium. Processo artesanal com acompanhamento em todas as etapas.',
  'Orçamento sob consulta',
  true,
  6
) ON CONFLICT (slug) DO NOTHING;

-- Insert content sections
INSERT INTO content_sections (section_key, title, content, content_type) VALUES
(
  'hero_banner',
  'Banner Principal',
  '<div class="text-center"><h1 class="text-4xl md:text-6xl font-bold text-amber-900 mb-4">Serviços Prime Luthieria</h1><p class="text-xl text-gray-700 mb-8">Especialistas em manutenção e conserto de instrumentos musicais há mais de 20 anos</p><div class="space-y-2 text-lg"><p>✓ Atendimento profissional e personalizado</p><p>✓ Técnicas tradicionais de luthieria</p><p>✓ Orçamento sem compromisso</p></div></div>',
  'html'
),
(
  'about_section',
  'Sobre Nós',
  '<div><h2 class="text-3xl font-bold text-amber-900 mb-6">Nossa História</h2><p class="text-gray-700 mb-4">A Prime Luthieria nasceu da paixão pela música e pelo artesanato tradicional. Com mais de 20 anos de experiência, somos especializados em manutenção, conserto e restauração de instrumentos musicais.</p><p class="text-gray-700 mb-4">Nossa oficina conta com ferramentas específicas e madeiras selecionadas para garantir que cada instrumento receba o tratamento adequado. Atendemos desde músicos iniciantes até profissionais renomados.</p><p class="text-gray-700 mb-4">Nosso compromisso é devolver seu instrumento com a melhor sonoridade e tocabilidade possível, preservando suas características originais e valorizando sua história.</p><h3 class="text-xl font-bold text-amber-800 mt-8 mb-4">Nossos Diferenciais:</h3><ul class="list-disc list-inside text-gray-700 space-y-2"><li>Diagnóstico preciso e orçamento transparente</li><li>Uso de materiais de alta qualidade</li><li>Técnicas tradicionais de luthieria</li><li>Atendimento personalizado</li><li>Garantia em todos os serviços</li></ul></div>',
  'html'
),
(
  'contact_info',
  'Informações de Contato',
  '<div><h2 class="text-3xl font-bold text-amber-900 mb-6">Entre em Contato</h2><p class="text-gray-700 mb-6">Estamos prontos para cuidar do seu instrumento com o carinho e profissionalismo que ele merece. Entre em contato para agendar uma avaliação ou esclarecer suas dúvidas.</p><div class="grid md:grid-cols-2 gap-8"><div><h3 class="text-xl font-bold text-amber-800 mb-4">Localização</h3><p class="text-gray-700">Rua dos Músicos, 123<br>Vila Madalena - São Paulo/SP<br>CEP: 05434-000</p></div><div><h3 class="text-xl font-bold text-amber-800 mb-4">Horário de Funcionamento</h3><p class="text-gray-700">Segunda a Sexta: 09:00 às 18:00<br>Sábado: 09:00 às 13:00<br>Domingo: Fechado</p></div></div></div>',
  'html'
) ON CONFLICT (section_key) DO NOTHING;

-- Insert testimonials
INSERT INTO testimonials (client_name, testimonial_text, rating, is_featured, display_order) VALUES
(
  'Carlos Silva',
  'Excelente trabalho! Meu violão estava com problemas na regulagem e eles fizeram um trabalho perfeito. Ficou com um som incrível e muito mais fácil de tocar. Recomendo muito!',
  5,
  true,
  1
),
(
  'Ana Beatriz',
  'Levei minha guitarra para uma manutenção completa e fiquei impressionada com o resultado. Atendimento profissional e preço justo. Já virou minha luthieria de confiança.',
  5,
  true,
  2
),
(
  'Pedro Santos',
  'Restauraram um violino antigo da família que estava em péssimo estado. O trabalho foi excepcional, devolveram vida ao instrumento respeitando suas características originais.',
  5,
  true,
  3
),
(
  'Maria Fernanda',
  'Profissionais muito competentes e atenciosos. Explicaram todo o processo e o orçamento foi muito transparente. Meu baixo ficou perfeito!',
  5,
  false,
  4
),
(
  'Roberto Lima',
  'Serviço de qualidade excepcional. Já levei vários instrumentos lá e sempre saio satisfeito. Eles realmente entendem do assunto.',
  5,
  false,
  5
) ON CONFLICT DO NOTHING;