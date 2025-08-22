# 🔍 Como Descobrir o Google My Business Location ID

## Método 1: Usando o LocationFinder (No Site)
1. **Acesse**: `/admin/testimonials`
2. **Conecte** com Google My Business primeiro
3. **Clique** em "Buscar Localizações" no LocationFinder
4. **Copie** o Location ID exibido
5. **Configure** no Easypanel: `VITE_GOOGLE_MY_BUSINESS_LOCATION_ID=seu_location_id`

## Método 2: Via URL do Google My Business
1. **Acesse**: https://business.google.com/
2. **Selecione** sua empresa/localização
3. **Na URL**, procure por um número longo após `/m/`
   - Exemplo: `business.google.com/m/123456789012345678/`
   - O Location ID seria: `123456789012345678`

## Método 3: Via Google My Business API (Manual)
1. **Obtenha um Access Token** (após conectar)
2. **Faça uma requisição GET** para:
   ```
   https://mybusinessbusinessinformation.googleapis.com/v1/accounts/-/locations
   ```
3. **Headers**:
   ```
   Authorization: Bearer YOUR_ACCESS_TOKEN
   Content-Type: application/json
   ```
4. **Na resposta**, procure por `"name": "accounts/123456789/locations/987654321"`
5. **O Location ID** é a parte final: `987654321`

## Método 4: Google My Business Management API
Se você tem acesso ao Google Cloud Console:
1. **Habilite** a API "My Business Business Information API"
2. **Use o API Explorer**: https://developers.google.com/my-business/reference/businessinformation/rest/v1/accounts.locations/list
3. **Execute** a query para listar suas localizações

## ⚠️ Rate Limit (Erro 429)
Se você receber erro 429:
- **Aguarde** 1-5 minutos entre tentativas
- **Google** tem limite de requisições por minuto/hora
- **Use apenas** o método necessário, não teste vários ao mesmo tempo

## 📋 Exemplo de Configuration
Após descobrir o ID, configure no Easypanel:

```env
VITE_GOOGLE_MY_BUSINESS_LOCATION_ID=123456789012345678
```

## 🔧 Troubleshooting
- **403 Forbidden**: Sua conta não tem acesso à localização
- **429 Rate Limit**: Muitas tentativas, aguarde alguns minutos  
- **Empty Response**: Conta sem localizações cadastradas no Google My Business
- **Invalid Credentials**: Token expirado, reconecte com Google
