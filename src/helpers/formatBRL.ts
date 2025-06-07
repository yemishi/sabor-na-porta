export default function formatBRL(value: number | string) {
  const number = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(number)) return "R$ 0,00";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(number);
}
