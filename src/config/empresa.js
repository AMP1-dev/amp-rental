import { useState, useEffect } from 'react'

export const EMPRESA_PADRAO = {
  nomeFantasia: 'Blois Imóveis',
  slogan: 'Aqui se faz negócio',
  razaoSocial: 'Blois Intermediação e Negócios Imobiliários Ltda',
  creci: 'CRECI-SP nº 123.456-J',
  creciResponsavel: 'Responsável Técnico: Renata Silva - CRECI-SP 123.456-F',
  cnpj: '00.000.000/0001-00',
  
  // Endereço físico da sede (obrigatório pelo CRECI)
  endereco: 'Rua Coronel Batista, n° 100 - Centro',
  cidade: 'Santa Cruz das Palmeiras',
  estado: 'SP',
  cep: '13650-000',
  
  // Contatos Oficiais
  telefone: '(19) 3672-0000',
  whatsapp: '5519999999999',
  whatsappFormatado: '(19) 99999-9999',
  email: 'contato@imoveisimobiliaria.com.br',
  
  // Horário de Atendimento
  horarioAtendimento: 'Segunda a Sexta: 08h às 18h | Sábado: 08h às 12h',
  
  // Logo
  logoUrl: '',
}

const STORAGE_KEY = 'amp_empresa_config'

export function getEmpresaConfig() {
  try {
    const salvo = localStorage.getItem(STORAGE_KEY)
    if (salvo) {
      return { ...EMPRESA_PADRAO, ...JSON.parse(salvo) }
    }
  } catch (e) {
    console.error('Erro ao ler config da empresa do localStorage:', e)
  }
  return EMPRESA_PADRAO
}

export function salvarEmpresaConfig(novosDados) {
  const dadosCompletos = { ...getEmpresaConfig(), ...novosDados }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dadosCompletos))
  window.dispatchEvent(new Event('empresa_config_updated'))
  return dadosCompletos
}

export function useEmpresaConfig() {
  const [config, setConfig] = useState(getEmpresaConfig)

  useEffect(() => {
    function atualizar() {
      setConfig(getEmpresaConfig())
    }
    window.addEventListener('empresa_config_updated', atualizar)
    window.addEventListener('storage', atualizar)
    return () => {
      window.removeEventListener('empresa_config_updated', atualizar)
      window.removeEventListener('storage', atualizar)
    }
  }, [])

  return config
}

// Para compatibilidade com chamadas estáticas
export const EMPRESA_CONFIG = getEmpresaConfig()
