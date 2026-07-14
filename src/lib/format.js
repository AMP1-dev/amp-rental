export function formatarPreco(centavos) {
  if (centavos === null || centavos === undefined) return 'Sob consulta'
  return (centavos / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  })
}

export function linkWhatsapp(numero, texto) {
  const numeroLimpo = (numero || '').replace(/\D/g, '')
  const params = new URLSearchParams({ text: texto })
  return `https://wa.me/${numeroLimpo}?${params.toString()}`
}
