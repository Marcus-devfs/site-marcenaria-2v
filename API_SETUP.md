# Configuração da API - MF Planejados

## Configuração do Ambiente

1. Crie um arquivo `.env.local` na raiz do projeto com:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# Para produção, substitua pela URL da sua API
# NEXT_PUBLIC_API_URL=https://sua-api.com
```

## Endpoints Utilizados

### 1. Imagens (`/filesweb`)
- **GET** `/filesweb` - Busca todas as imagens
- **GET** `/filesweb?section=Galeria` - Busca imagens por seção

### 2. Depoimentos (`/testimonials`)
- **GET** `/testimonials` - Busca todos os depoimentos

### 3. Orçamento (`/budget`)
- **POST** `/budget` - Envia dados do orçamento

## Estrutura dos Dados

### Image
```typescript
{
  _id: string;
  url: string;
  section: string;
  category?: string;
  title?: string;
  description?: string;
}
```

### Testimonial
```typescript
{
  _id: string;
  clientName: string;
  message: string;
  rating: number;
  project?: string;
  createdAt: string;
}
```

## Funcionalidades Implementadas

✅ **Skeleton Loading** - Loading states em todos os componentes
✅ **Modal de Imagens** - Visualização ampliada com navegação
✅ **Integração Completa** - Todas as seções conectadas à API
✅ **Fallback** - Dados de exemplo caso a API não esteja disponível
✅ **Error Handling** - Tratamento de erros com fallbacks

## Como Testar

1. Configure a URL da API no `.env.local`
2. Execute `npm run dev`
3. As imagens e depoimentos serão carregados automaticamente
4. Clique nas imagens para abrir o modal
5. Teste o formulário de contato
