-- Adicionar campo image_url à tabela content_sections para permitir 
-- que o admin configure imagens para cada seção de conteúdo

ALTER TABLE content_sections 
ADD COLUMN image_url TEXT;

-- Opcional: Adicionar comentário para documentar o campo
COMMENT ON COLUMN content_sections.image_url IS 'URL da imagem associada à seção de conteúdo';
