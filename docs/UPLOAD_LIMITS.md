# Limites de Upload de Arquivos

Este documento descreve os limites e configurações para upload de arquivos no sistema.

## Limites Atuais

### Tamanhos Máximos
- **Arquivos em geral**: 100MB
- **Imagens**: 50MB  
- **Vídeos**: 100MB
- **Documentos**: 100MB

### Tipos de Arquivo Suportados
- **Imagens**: JPG, JPEG, PNG, GIF, WebP
- **Vídeos**: MP4, WebM, AVI, MOV, WMV
- **Documentos**: PDF, TXT

## Configurações do Sistema

### Nginx (nginx.conf)
```nginx
client_max_body_size 100M;
client_body_timeout 60s;
client_header_timeout 60s;
```

### Frontend (src/lib/uploadConfig.ts)
- Validação de tipos de arquivo
- Verificação de tamanho antes do upload
- Mensagens de erro personalizadas

## Problemas Comuns

### "Arquivo muito grande"
1. Verifique se o arquivo está dentro do limite (100MB)
2. Para vídeos grandes, considere comprimir antes do upload
3. Verifique a conexão de internet - uploads grandes podem falhar em conexões lentas

### "Tipo de arquivo não suportado"
1. Verifique se a extensão está na lista de tipos suportados
2. Alguns arquivos podem ter MIME types incorretos

### Upload falha/trava
1. Verifique a conexão de internet
2. Tente com um arquivo menor para testar
3. Verifique se não há erro no console do navegador
4. Verifique se o bucket do Supabase está configurado corretamente

## Configuração do Supabase

### Storage Bucket
- Nome: `general`
- Política: Permite inserção pública, leitura autenticada para admin

### RLS Policies
```sql
-- Permite upload público
CREATE POLICY "Allow public uploads" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'general');

-- Permite leitura autenticada  
CREATE POLICY "Allow authenticated reads" ON storage.objects
  FOR SELECT USING (auth.role() = 'authenticated');
```

## Melhorias Futuras

1. **Upload com Progress**: Mostrar barra de progresso para arquivos grandes
2. **Upload Chunked**: Dividir arquivos grandes em pedaços menores
3. **Compressão Automática**: Reduzir tamanho de imagens/vídeos automaticamente
4. **Upload Resumable**: Permitir continuar uploads interrompidos
5. **Detecção de Tipo**: Melhorar detecção de MIME types
6. **Preview**: Mostrar preview antes do upload

## Monitoramento

- Logs de erro são salvos no console do navegador
- Métricas de upload podem ser adicionadas ao sistema de analytics
- Considerar implementar alertas para falhas frequentes
