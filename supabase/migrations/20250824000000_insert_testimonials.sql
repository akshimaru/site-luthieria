-- Insert initial testimonials provided by user
-- Date: 2025-08-24

INSERT INTO testimonials (
  client_name,
  testimonial_text,
  rating,
  is_featured,
  display_order,
  created_at,
  updated_at
) VALUES
('Leonardo Poggio', 'Samuel é um dos melhores luthier que eu já tive o prazer de conhecer! mt atencioso e sabe o que faz! recomendo!', 5, false, 1, now(), now()),
('Rafael Haddad', 'Ótima experiência, mas valores elevados', 5, false, 2, now(), now()),
('Gabriel Taira', '', 5, false, 3, now(), now()),
('Jonathan Oliveira', 'o melhor de Brasília.', 5, false, 4, now(), now()),
('Luana Lis', 'atendimento excelente. cuidaram direitinho do meu violão, agora esta novinho em folha!', 5, false, 5, now(), now()),
('ricardo cruz', 'Sempre que precisei dos serviços saí satisfeito. Samuel é muito bom no que faz!', 5, false, 6, now(), now()),
('Itapuan Silva', '', 5, false, 7, now(), now()),
('Edinei Pimenta Pinheiro', '', 5, false, 8, now(), now()),
('Érick Moreira', '', 5, false, 9, now(), now()),
('Jéssica de Cássia', 'Samuel salvou meu violão!! De um violão que comprei de segunda mão que tava horrível, ele ficou zerado.', 5, false, 10, now(), now()),
('Dirceu Magno', '', 5, false, 11, now(), now()),
('Lucas Roberto', 'Trabalho de extrema excelência!!! Recomendo muito!!!', 5, false, 12, now(), now()),
('saulo mendonca', '', 5, false, 13, now(), now()),
('Edmário Marinho', 'Ficou muito bom meu violão. Regulagem perfeita.', 5, false, 14, now(), now()),
('Gabriel Oliveira', 'Excelente trabalho do Samuel! Deixou meus instrumentos funcionais do jeito que eu preciso para apresentar uma alta performance nos shows.', 5, false, 15, now(), now()),
('alberto Filho', 'Profissional de excelência! Serviço de primeira! Fui por indicação e agora só faço serviço lá. Recomendo demais!', 5, false, 16, now(), now()),
('Lamartine Alencar', 'Resumindo… bom trabalho, boa conversa, bom atendimento… super recomendo', 5, false, 17, now(), now()),
('Yuri Augusto', 'A loja é bem organizada e os serviços prestados são de boa qualidade. Existe também organização quanto aos serviços...', 5, false, 18, now(), now()),
('Isaque Guimarães', 'Melhor luthieria', 5, false, 19, now(), now()),
('Marcos Almeida Filho', 'Levei meu violão e minha guitarra para manutenção e limpeza. Eles voltaram como se fossem novos! Super recomendo o serviço.', 5, false, 20, now(), now()),
('Bruno Brum', 'Ficou bem alinhada, afinada eme foi entregue bem limpinha.', 5, false, 21, now(), now()),
('Rudney Teixeira', 'Serviço sensacional. O Samuel é um profissional top. Muito competente e correto. Minha avaliação é 10!', 5, false, 22, now(), now()),
('Gabriel Veras', '', 5, false, 23, now(), now()),
('Valber Carvalho', 'Excelente!! Serviço excepcional. Muitíssimos satisfeito.', 5, false, 24, now(), now()),
('André Muller', 'Completamente satisfeito…instrumento ficou perfeito', 5, false, 25, now(), now()),
('Enoque Barros', 'Sempre um excelente atendimento', 5, false, 26, now(), now()),
('Fabio DeSilva', 'Atendimento primoroso com um profissional extremamente qualificado.', 5, false, 27, now(), now()),
('Pedro Henrique', '', 5, false, 28, now(), now()),
('Giane MaCRev Revoredo', 'A Vibratho é uma excelente loja de instrumentos musicais, onde encontramos o que procuramos. O Samuel é um grande...', 5, false, 29, now(), now())
ON CONFLICT DO NOTHING;
