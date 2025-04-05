// dollar formatter, comma separated, decimal point 2
export const dollarFormatter = (value: number | string | undefined | null) => {
  if (value === undefined || value === null) return "$0";
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return `$${Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numValue)}`;
};