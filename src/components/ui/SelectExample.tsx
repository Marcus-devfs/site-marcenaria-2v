import React from 'react';
import { Select, SelectOption } from './Select';

// Exemplo de uso do componente Select
export function SelectExample() {
  const [selectedValue, setSelectedValue] = React.useState('');
  const [hasError, setHasError] = React.useState(false);

  const options: SelectOption[] = [
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'phone', label: 'Telefone' },
    { value: 'email', label: 'Email' },
  ];

  const furnitureOptions: SelectOption[] = [
    { value: 'guarda_roupa', label: 'GUARDA ROUPA' },
    { value: 'criado_mudo', label: 'CRIADO MUDO' },
    { value: 'painel_cama', label: 'PAINEL DE CAMA' },
    { value: 'gabinete_banheiro', label: 'GABINETE BANHEIRO' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-md">
      <h2 className="text-xl font-bold text-gray-900">Exemplos do Componente Select</h2>
      
      {/* Exemplo básico */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preferência de Contato
        </label>
        <Select
          options={options}
          placeholder="Selecione uma opção"
          value={selectedValue}
          onChange={(e) => setSelectedValue(e.target.value)}
        />
      </div>

      {/* Exemplo com erro */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo de Móvel (com erro)
        </label>
        <Select
          options={furnitureOptions}
          placeholder="Selecione um móvel"
          error={hasError}
          onChange={() => setHasError(false)}
        />
        {hasError && (
          <p className="text-red-500 text-sm mt-1">Este campo é obrigatório</p>
        )}
      </div>

      {/* Exemplo desabilitado */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Campo Desabilitado
        </label>
        <Select
          options={options}
          placeholder="Desabilitado"
          disabled
        />
      </div>

      {/* Botão para testar erro */}
      <button
        onClick={() => setHasError(!hasError)}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
      >
        {hasError ? 'Remover Erro' : 'Mostrar Erro'}
      </button>
    </div>
  );
}
