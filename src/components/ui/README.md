# Componente Select Customizado

Um componente Select personalizado que remove a aparência padrão do sistema operacional e adiciona um ícone de seta customizado.

## Características

- ✅ Remove `appearance: none` e `-webkit-appearance: none`
- ✅ Ícone de seta personalizado (SVG)
- ✅ Suporte a estados de erro
- ✅ Suporte a placeholder
- ✅ Suporte a opções desabilitadas
- ✅ Compatível com react-hook-form
- ✅ TypeScript support
- ✅ Responsivo e acessível

## Uso Básico

```tsx
import { Select, SelectOption } from '@/components/ui/Select';

const options: SelectOption[] = [
  { value: 'option1', label: 'Opção 1' },
  { value: 'option2', label: 'Opção 2' },
  { value: 'option3', label: 'Opção 3', disabled: true },
];

function MyComponent() {
  const [value, setValue] = useState('');

  return (
    <Select
      options={options}
      placeholder="Selecione uma opção"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
```

## Com React Hook Form

```tsx
import { useForm } from 'react-hook-form';
import { Select } from '@/components/ui/Select';

function FormComponent() {
  const { register } = useForm();

  return (
    <Select
      options={options}
      placeholder="Selecione uma opção"
      {...register('fieldName')}
    />
  );
}
```

## Com Estado de Erro

```tsx
<Select
  options={options}
  placeholder="Selecione uma opção"
  error={hasError}
  value={value}
  onChange={handleChange}
/>
```

## Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `options` | `SelectOption[]` | - | Array de opções para o select |
| `placeholder` | `string` | - | Texto do placeholder |
| `error` | `boolean` | `false` | Se o select está em estado de erro |
| `className` | `string` | - | Classes CSS adicionais |
| `disabled` | `boolean` | `false` | Se o select está desabilitado |
| `value` | `string` | - | Valor selecionado |
| `onChange` | `function` | - | Callback quando o valor muda |

## SelectOption Interface

```tsx
interface SelectOption {
  value: string;        // Valor da opção
  label: string;        // Texto exibido
  disabled?: boolean;   // Se a opção está desabilitada
}
```

## Estilos

O componente usa Tailwind CSS e inclui:

- Estados de foco com ring azul
- Estados de erro com bordas e cores vermelhas
- Estados desabilitados com cores acinzentadas
- Transições suaves
- Ícone de seta responsivo

## Exemplo Completo

Veja `SelectExample.tsx` para um exemplo completo de uso com diferentes estados.
