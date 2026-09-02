-- Seed SQL: Imóveis Extraídos do Banco Blois / WordPress
-- Execute este arquivo no SQL Editor do Supabase para popular o banco de produção!

-- Inserção de Planos padrão caso não existam:
INSERT INTO planos (id, nome, prazo_dias, valor_centavos, aparece_carrossel) VALUES
  ('d79e2a6c-54a8-4c12-9c12-000000000001', 'Destaque Premium', 60, 19900, true),
  ('d79e2a6c-54a8-4c12-9c12-000000000002', 'Padrão', 30, 9900, false)
ON CONFLICT (id) DO NOTHING;

-- Imóvel: AMP-0080 - Terreno Rua Sergipe, n91, Lote 31 da quadra 27- Parque Varotti
INSERT INTO anuncios (
  id, titulo, descricao, tipo, finalidade, cidade, bairro, logradouro,
  area_m2, quartos, banheiros, vagas, valor_centavos, status,
  nome_responsavel, whatsapp_responsavel, plano_id, created_at
) VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'Terreno Rua Sergipe, n91, Lote 31 da quadra 27- Parque Varotti',
  'Terreno disponível para venda em Rua Sergipe, n91, Lote 31 da quadra 27- Parque Varotti. Excelente oportunidade.',
  'Terreno',
  'Venda',
  'Santa Cruz das Palmeiras',
  'Parque Varotti',
  'Rua Sergipe, n91, Lote 31 da quadra 27- Parque Varotti',
  250,
  0,
  0,
  0,
  7000000,
  'aprovado',
  'Blois Imóveis / AMP Rental',
  '5519999999999',
  'd79e2a6c-54a8-4c12-9c12-000000000001',
  NOW() - INTERVAL '1 days'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO anuncio_fotos (id, anuncio_id, path, ordem) VALUES (
  'f0000000-0000-0000-0000-000001000001',
  'a0000000-0000-0000-0000-000000000001',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
  1
) ON CONFLICT (id) DO NOTHING;
INSERT INTO anuncio_fotos (id, anuncio_id, path, ordem) VALUES (
  'f0000000-0000-0000-0000-000001000002',
  'a0000000-0000-0000-0000-000000000001',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
  2
) ON CONFLICT (id) DO NOTHING;

-- Imóvel: AMP-0220 - Casa Rua João Reitano, n106-Vila Prudente
INSERT INTO anuncios (
  id, titulo, descricao, tipo, finalidade, cidade, bairro, logradouro,
  area_m2, quartos, banheiros, vagas, valor_centavos, status,
  nome_responsavel, whatsapp_responsavel, plano_id, created_at
) VALUES (
  'a0000000-0000-0000-0000-000000000002',
  'Casa Rua João Reitano, n106-Vila Prudente',
  '• Área total do terreno :163,00mts² • área de construção:140,09mts²',
  'Casa',
  'Venda',
  'Santa Cruz das Palmeiras',
  'Vila Prudente',
  'Rua João Reitano, n106-Vila Prudente',
  120,
  3,
  2,
  0,
  22000000,
  'aprovado',
  'Blois Imóveis / AMP Rental',
  '5519999999999',
  'd79e2a6c-54a8-4c12-9c12-000000000001',
  NOW() - INTERVAL '2 days'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO anuncio_fotos (id, anuncio_id, path, ordem) VALUES (
  'f0000000-0000-0000-0000-000002000001',
  'a0000000-0000-0000-0000-000000000002',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
  1
) ON CONFLICT (id) DO NOTHING;
INSERT INTO anuncio_fotos (id, anuncio_id, path, ordem) VALUES (
  'f0000000-0000-0000-0000-000002000002',
  'a0000000-0000-0000-0000-000000000002',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  2
) ON CONFLICT (id) DO NOTHING;
INSERT INTO anuncio_fotos (id, anuncio_id, path, ordem) VALUES (
  'f0000000-0000-0000-0000-000002000003',
  'a0000000-0000-0000-0000-000000000002',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  3
) ON CONFLICT (id) DO NOTHING;

-- Imóvel: AMP-0221 - Casa Residencial / Comercio Rua Dr José Mendes da Silva , n 20- Conjunto Habitacional Ada Dedini Ometto
INSERT INTO anuncios (
  id, titulo, descricao, tipo, finalidade, cidade, bairro, logradouro,
  area_m2, quartos, banheiros, vagas, valor_centavos, status,
  nome_responsavel, whatsapp_responsavel, plano_id, created_at
) VALUES (
  'a0000000-0000-0000-0000-000000000003',
  'Casa Residencial / Comercio Rua Dr José Mendes da Silva , n 20- Conjunto Habitacional Ada Dedini Ometto',
  'Esquina com Comércio , banheiro e escritório • Área total do terreno :232,00mts² • área de construção:198,00mts²',
  'Comercial',
  'Venda',
  'Santa Cruz das Palmeiras',
  'Conjunto Habitacional Ada Dedini Ometto',
  'Rua Dr José Mendes da Silva , n 20- Conjunto Habitacional Ada Dedini Ometto',
  65,
  3,
  2,
  0,
  39500000,
  'aprovado',
  'Blois Imóveis / AMP Rental',
  '5519999999999',
  'd79e2a6c-54a8-4c12-9c12-000000000001',
  NOW() - INTERVAL '3 days'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO anuncio_fotos (id, anuncio_id, path, ordem) VALUES (
  'f0000000-0000-0000-0000-000003000001',
  'a0000000-0000-0000-0000-000000000003',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
  1
) ON CONFLICT (id) DO NOTHING;
INSERT INTO anuncio_fotos (id, anuncio_id, path, ordem) VALUES (
  'f0000000-0000-0000-0000-000003000002',
  'a0000000-0000-0000-0000-000000000003',
  'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
  2
) ON CONFLICT (id) DO NOTHING;

-- Imóvel: AMP-0222 - Terreno Rua Jasmins , n 131, Lote 12 da quadra G - Jardim Bela Vista
INSERT INTO anuncios (
  id, titulo, descricao, tipo, finalidade, cidade, bairro, logradouro,
  area_m2, quartos, banheiros, vagas, valor_centavos, status,
  nome_responsavel, whatsapp_responsavel, plano_id, created_at
) VALUES (
  'a0000000-0000-0000-0000-000000000004',
  'Terreno Rua Jasmins , n 131, Lote 12 da quadra G - Jardim Bela Vista',
  'área do terreno: 200,00 mts²',
  'Terreno',
  'Venda',
  'Santa Cruz das Palmeiras',
  'Jardim Bela Vista',
  'Rua Jasmins , n 131, Lote 12 da quadra G - Jardim Bela Vista',
  250,
  0,
  0,
  0,
  10000000,
  'aprovado',
  'Blois Imóveis / AMP Rental',
  '5519999999999',
  'd79e2a6c-54a8-4c12-9c12-000000000001',
  NOW() - INTERVAL '4 days'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO anuncio_fotos (id, anuncio_id, path, ordem) VALUES (
  'f0000000-0000-0000-0000-000004000001',
  'a0000000-0000-0000-0000-000000000004',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
  1
) ON CONFLICT (id) DO NOTHING;
INSERT INTO anuncio_fotos (id, anuncio_id, path, ordem) VALUES (
  'f0000000-0000-0000-0000-000004000002',
  'a0000000-0000-0000-0000-000000000004',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
  2
) ON CONFLICT (id) DO NOTHING;

-- Imóvel: AMP-0223 - Casa Rua João Gaspar Letordi, n 222- Jardim Limoeiro, Cachoeira de Emas
INSERT INTO anuncios (
  id, titulo, descricao, tipo, finalidade, cidade, bairro, logradouro,
  area_m2, quartos, banheiros, vagas, valor_centavos, status,
  nome_responsavel, whatsapp_responsavel, plano_id, created_at
) VALUES (
  'a0000000-0000-0000-0000-000000000005',
  'Casa Rua João Gaspar Letordi, n 222- Jardim Limoeiro, Cachoeira de Emas',
  'Casa disponível para venda em Rua João Gaspar Letordi, n 222- Jardim Limoeiro, Cachoeira de Emas. Excelente oportunidade.',
  'Casa',
  'Venda',
  'Cachoeira de Emas',
  'Jardim Limoeiro, Cachoeira de Emas',
  'Rua João Gaspar Letordi, n 222- Jardim Limoeiro, Cachoeira de Emas',
  120,
  1,
  1,
  0,
  16000000,
  'aprovado',
  'Blois Imóveis / AMP Rental',
  '5519999999999',
  'd79e2a6c-54a8-4c12-9c12-000000000002',
  NOW() - INTERVAL '5 days'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO anuncio_fotos (id, anuncio_id, path, ordem) VALUES (
  'f0000000-0000-0000-0000-000005000001',
  'a0000000-0000-0000-0000-000000000005',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
  1
) ON CONFLICT (id) DO NOTHING;
INSERT INTO anuncio_fotos (id, anuncio_id, path, ordem) VALUES (
  'f0000000-0000-0000-0000-000005000002',
  'a0000000-0000-0000-0000-000000000005',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  2
) ON CONFLICT (id) DO NOTHING;
INSERT INTO anuncio_fotos (id, anuncio_id, path, ordem) VALUES (
  'f0000000-0000-0000-0000-000005000003',
  'a0000000-0000-0000-0000-000000000005',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  3
) ON CONFLICT (id) DO NOTHING;

-- Imóvel: AMP-0224 - Casa na Avenida do Café, n 1020- Centro
INSERT INTO anuncios (
  id, titulo, descricao, tipo, finalidade, cidade, bairro, logradouro,
  area_m2, quartos, banheiros, vagas, valor_centavos, status,
  nome_responsavel, whatsapp_responsavel, plano_id, created_at
) VALUES (
  'a0000000-0000-0000-0000-000000000006',
  'Casa na Avenida do Café, n 1020- Centro',
  'Casa disponível para venda em Avenida do Café, n 1020- Centro. Excelente oportunidade.',
  'Casa',
  'Venda',
  'Santa Cruz das Palmeiras',
  'Centro',
  'Avenida do Café, n 1020- Centro',
  120,
  0,
  0,
  0,
  40000000,
  'aprovado',
  'Blois Imóveis / AMP Rental',
  '5519999999999',
  'd79e2a6c-54a8-4c12-9c12-000000000001',
  NOW() - INTERVAL '6 days'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO anuncio_fotos (id, anuncio_id, path, ordem) VALUES (
  'f0000000-0000-0000-0000-000006000001',
  'a0000000-0000-0000-0000-000000000006',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
  1
) ON CONFLICT (id) DO NOTHING;
INSERT INTO anuncio_fotos (id, anuncio_id, path, ordem) VALUES (
  'f0000000-0000-0000-0000-000006000002',
  'a0000000-0000-0000-0000-000000000006',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  2
) ON CONFLICT (id) DO NOTHING;
INSERT INTO anuncio_fotos (id, anuncio_id, path, ordem) VALUES (
  'f0000000-0000-0000-0000-000006000003',
  'a0000000-0000-0000-0000-000000000006',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  3
) ON CONFLICT (id) DO NOTHING;

-- Imóvel: AMP-0225 - Casa Rua Espírito Santo, n 48- Parque Varotti
INSERT INTO anuncios (
  id, titulo, descricao, tipo, finalidade, cidade, bairro, logradouro,
  area_m2, quartos, banheiros, vagas, valor_centavos, status,
  nome_responsavel, whatsapp_responsavel, plano_id, created_at
) VALUES (
  'a0000000-0000-0000-0000-000000000007',
  'Casa Rua Espírito Santo, n 48- Parque Varotti',
  'Casa disponível para venda em Rua Espírito Santo, n 48- Parque Varotti. Excelente oportunidade.',
  'Casa',
  'Venda',
  'Santa Cruz das Palmeiras',
  'Parque Varotti',
  'Rua Espírito Santo, n 48- Parque Varotti',
  120,
  0,
  0,
  0,
  28000000,
  'aprovado',
  'Blois Imóveis / AMP Rental',
  '5519999999999',
  'd79e2a6c-54a8-4c12-9c12-000000000001',
  NOW() - INTERVAL '7 days'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO anuncio_fotos (id, anuncio_id, path, ordem) VALUES (
  'f0000000-0000-0000-0000-000007000001',
  'a0000000-0000-0000-0000-000000000007',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
  1
) ON CONFLICT (id) DO NOTHING;
INSERT INTO anuncio_fotos (id, anuncio_id, path, ordem) VALUES (
  'f0000000-0000-0000-0000-000007000002',
  'a0000000-0000-0000-0000-000000000007',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  2
) ON CONFLICT (id) DO NOTHING;
INSERT INTO anuncio_fotos (id, anuncio_id, path, ordem) VALUES (
  'f0000000-0000-0000-0000-000007000003',
  'a0000000-0000-0000-0000-000000000007',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  3
) ON CONFLICT (id) DO NOTHING;

-- Imóvel: AMP-0226 - Terreno Rua E esto Scatolin, n 120, Lote 12 da quadra F, Jardim Santa Cecília
INSERT INTO anuncios (
  id, titulo, descricao, tipo, finalidade, cidade, bairro, logradouro,
  area_m2, quartos, banheiros, vagas, valor_centavos, status,
  nome_responsavel, whatsapp_responsavel, plano_id, created_at
) VALUES (
  'a0000000-0000-0000-0000-000000000008',
  'Terreno Rua E esto Scatolin, n 120, Lote 12 da quadra F, Jardim Santa Cecília',
  'Terreno disponível para venda em Rua E esto Scatolin, n 120, Lote 12 da quadra F, Jardim Santa Cecília. Excelente oportunidade.',
  'Terreno',
  'Venda',
  'Santa Cruz das Palmeiras',
  'Jardim Santa Cecília',
  'Rua E esto Scatolin, n 120, Lote 12 da quadra F, Jardim Santa Cecília',
  250,
  0,
  0,
  0,
  16500000,
  'aprovado',
  'Blois Imóveis / AMP Rental',
  '5519999999999',
  'd79e2a6c-54a8-4c12-9c12-000000000001',
  NOW() - INTERVAL '8 days'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO anuncio_fotos (id, anuncio_id, path, ordem) VALUES (
  'f0000000-0000-0000-0000-000008000001',
  'a0000000-0000-0000-0000-000000000008',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
  1
) ON CONFLICT (id) DO NOTHING;
INSERT INTO anuncio_fotos (id, anuncio_id, path, ordem) VALUES (
  'f0000000-0000-0000-0000-000008000002',
  'a0000000-0000-0000-0000-000000000008',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
  2
) ON CONFLICT (id) DO NOTHING;

-- Imóvel: AMP-0227 - Casa Avenida Quinze de Novembro , n1200- CENTRO ( ÓTIMA LOCALIZAÇÃO)
INSERT INTO anuncios (
  id, titulo, descricao, tipo, finalidade, cidade, bairro, logradouro,
  area_m2, quartos, banheiros, vagas, valor_centavos, status,
  nome_responsavel, whatsapp_responsavel, plano_id, created_at
) VALUES (
  'a0000000-0000-0000-0000-000000000009',
  'Casa Avenida Quinze de Novembro , n1200- CENTRO ( ÓTIMA LOCALIZAÇÃO)',
  'Casa disponível para venda em Avenida Quinze de Novembro , n1200- CENTRO ( ÓTIMA LOCALIZAÇÃO). Excelente oportunidade.',
  'Casa',
  'Venda',
  'Santa Cruz das Palmeiras',
  'CENTRO ( ÓTIMA LOCALIZAÇÃO)',
  'Avenida Quinze de Novembro , n1200- CENTRO ( ÓTIMA LOCALIZAÇÃO)',
  120,
  3,
  1,
  0,
  45000000,
  'aprovado',
  'Blois Imóveis / AMP Rental',
  '5519999999999',
  'd79e2a6c-54a8-4c12-9c12-000000000001',
  NOW() - INTERVAL '9 days'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO anuncio_fotos (id, anuncio_id, path, ordem) VALUES (
  'f0000000-0000-0000-0000-000009000001',
  'a0000000-0000-0000-0000-000000000009',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
  1
) ON CONFLICT (id) DO NOTHING;
INSERT INTO anuncio_fotos (id, anuncio_id, path, ordem) VALUES (
  'f0000000-0000-0000-0000-000009000002',
  'a0000000-0000-0000-0000-000000000009',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  2
) ON CONFLICT (id) DO NOTHING;
INSERT INTO anuncio_fotos (id, anuncio_id, path, ordem) VALUES (
  'f0000000-0000-0000-0000-000009000003',
  'a0000000-0000-0000-0000-000000000009',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  3
) ON CONFLICT (id) DO NOTHING;

-- Imóvel: AMP-0228 - Casa Rua José Vieira Martins, n 19- Santa Luzia
INSERT INTO anuncios (
  id, titulo, descricao, tipo, finalidade, cidade, bairro, logradouro,
  area_m2, quartos, banheiros, vagas, valor_centavos, status,
  nome_responsavel, whatsapp_responsavel, plano_id, created_at
) VALUES (
  'a0000000-0000-0000-0000-000000000010',
  'Casa Rua José Vieira Martins, n 19- Santa Luzia',
  'parte superior contendo : suíte e sacad',
  'Casa',
  'Venda',
  'Santa Cruz das Palmeiras',
  'Santa Luzia',
  'Rua José Vieira Martins, n 19- Santa Luzia',
  120,
  2,
  1,
  0,
  32000000,
  'aprovado',
  'Blois Imóveis / AMP Rental',
  '5519999999999',
  'd79e2a6c-54a8-4c12-9c12-000000000001',
  NOW() - INTERVAL '10 days'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO anuncio_fotos (id, anuncio_id, path, ordem) VALUES (
  'f0000000-0000-0000-0000-000010000001',
  'a0000000-0000-0000-0000-000000000010',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
  1
) ON CONFLICT (id) DO NOTHING;
INSERT INTO anuncio_fotos (id, anuncio_id, path, ordem) VALUES (
  'f0000000-0000-0000-0000-000010000002',
  'a0000000-0000-0000-0000-000000000010',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  2
) ON CONFLICT (id) DO NOTHING;
INSERT INTO anuncio_fotos (id, anuncio_id, path, ordem) VALUES (
  'f0000000-0000-0000-0000-000010000003',
  'a0000000-0000-0000-0000-000000000010',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  3
) ON CONFLICT (id) DO NOTHING;
