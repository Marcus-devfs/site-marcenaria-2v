# Sistema de Orçamentos Avançado - MF Planejados

## 🎯 Visão Geral

Sistema completo de orçamentos personalizados que permite aos clientes solicitar orçamentos detalhados com cálculo automático de preços baseado em configurações personalizáveis.

## 🚀 Funcionalidades Implementadas

### ✅ **Backend (API)**
- **Novos Modelos de Dados:**
  - `QuoteComplete` - Orçamentos completos com todos os detalhes
  - `PriceConfig` - Configurações de preços por ambiente/tipo/espessura

- **Endpoints Criados:**
  - `POST /quote-complete` - Criar orçamento completo
  - `POST /quote-complete/upload-images` - Upload de imagens de referência
  - `GET /quote-complete` - Listar orçamentos (admin)
  - `PATCH /quote-complete/:id/status` - Atualizar status do orçamento
  - `GET /price-config` - Listar configurações de preço
  - `POST /price-config` - Criar configuração de preço
  - `PATCH /price-config/:id` - Atualizar configuração
  - `POST /price-config/calculate` - Calcular preço estimado

### ✅ **Frontend (Site)**
- **Página de Orçamento Avançada (`/orcamento`):**
  - Formulário completo com dados do cliente
  - Seleção múltipla de ambientes
  - Cálculo automático de área e preços
  - Upload de imagens de referência (Pinterest, Instagram, etc.)
  - Estimativa de preços em tempo real
  - Validação de formulário

- **Página de Admin (`/admin`):**
  - Configuração de preços por ambiente/tipo/espessura
  - Multiplicadores por complexidade
  - Interface para gerenciar configurações
  - Visualização de orçamentos (em desenvolvimento)

## 📊 Estrutura de Dados

### Ambiente
```typescript
{
  type: 'cozinha' | 'quarto' | 'sala' | 'banheiro' | 'escritorio' | 'area_externa' | 'outro';
  measurements: {
    width: number;    // Largura em metros
    height: number;   // Altura em metros
    depth: number;    // Profundidade em metros
    area: number;     // Calculado automaticamente
  };
  description: string;
  woodType: 'branca' | 'madeirada' | 'laminada' | 'mdf' | 'outro';
  thickness: '15mm' | '18mm' | '25mm';
  estimatedValue?: number;
}
```

### Configuração de Preço
```typescript
{
  environment: string;
  woodType: string;
  thickness: string;
  pricePerM2: number;
  complexityMultipliers: {
    basic: number;    // Ex: 1.0
    medium: number;   // Ex: 1.2
    complex: number;  // Ex: 1.5
  };
  isActive: boolean;
}
```

## 🎨 Como Usar

### 1. **Configurar Preços (Admin)**
1. Acesse `/admin`
2. Vá para "Configurações de Preço"
3. Clique em "Nova Configuração"
4. Configure:
   - Ambiente (cozinha, quarto, etc.)
   - Tipo de madeira (branca, madeirada, etc.)
   - Espessura (15mm, 18mm, 25mm)
   - Preço por m²
   - Multiplicadores por complexidade

### 2. **Solicitar Orçamento (Cliente)**
1. Acesse `/orcamento`
2. Preencha dados pessoais
3. Adicione ambientes:
   - Selecione tipo de ambiente
   - Informe medidas (largura x altura)
   - Escolha tipo de madeira e espessura
   - Descreva o ambiente
4. Faça upload de imagens de referência
5. Veja o cálculo automático de preços
6. Envie o orçamento

### 3. **Cálculo Automático**
- **Área:** Largura × Altura (calculado automaticamente)
- **Preço Base:** Configurado no admin por ambiente/tipo/espessura
- **Multiplicador:** Aplicado baseado na complexidade (padrão: médio = 1.2)
- **Valor Final:** Área × Preço Base × Multiplicador

## 🔧 Configuração Inicial

### 1. **Banco de Dados**
Os novos modelos serão criados automaticamente quando a API for executada.

### 2. **Configurações de Preço Iniciais**
Configure pelo menos uma configuração de preço para cada combinação que deseja oferecer:

**Exemplo de configurações básicas:**
```
Cozinha + Madeira Branca + 18mm = R$ 800/m²
Quarto + Madeira Branca + 18mm = R$ 600/m²
Sala + Madeira Branca + 18mm = R$ 700/m²
```

### 3. **Upload de Imagens**
- Pasta: `api/uploads/reference-images/`
- Limite: 5MB por imagem
- Máximo: 5 imagens por orçamento
- Formatos: JPG, PNG, GIF, WebP

## 📈 Benefícios para o Negócio

### **Para o Cliente:**
- ✅ Orçamento mais preciso e detalhado
- ✅ Cálculo automático em tempo real
- ✅ Possibilidade de enviar referências visuais
- ✅ Múltiplos ambientes em um só orçamento
- ✅ Transparência nos cálculos

### **Para a Empresa:**
- ✅ Orçamentos mais profissionais
- ✅ Controle total sobre preços
- ✅ Dados estruturados dos clientes
- ✅ Histórico completo de orçamentos
- ✅ Melhor conversão de leads

## 🚀 Próximos Passos

1. **Testar o sistema** com dados reais
2. **Configurar preços** baseados no mercado
3. **Treinar equipe** para usar o admin
4. **Monitorar conversões** e ajustar preços
5. **Expandir funcionalidades** conforme necessário

## 📞 Suporte

Para dúvidas ou problemas:
- Verifique os logs da API
- Teste os endpoints individualmente
- Valide os dados de entrada
- Consulte a documentação da API

---

**Sistema desenvolvido para maximizar conversões e profissionalizar o processo de orçamentos da MF Planejados! 🎉**
