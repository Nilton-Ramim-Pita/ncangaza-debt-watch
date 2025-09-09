// Utilitários para formatação de moeda em Meticais
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-MZ', {
    style: 'currency',
    currency: 'MZN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatCurrencySimple = (value: number): string => {
  return `MZN ${value.toLocaleString('pt-MZ', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`;
};

export const parseCurrency = (value: string): number => {
  // Remove tudo exceto números, vírgulas e pontos
  const cleaned = value.replace(/[^0-9.,]/g, '');
  // Substitui vírgula por ponto para parsing
  const normalized = cleaned.replace(',', '.');
  return parseFloat(normalized) || 0;
};