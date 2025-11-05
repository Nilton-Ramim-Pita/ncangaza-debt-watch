import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Dados dos 25 clientes
    const clientes = [
      // 18 Clientes ativos
      { nome: 'João Silva', nuit: '123456789', telefone: '+258 84 123 4567', email: 'joao.silva@email.com', endereco: 'Av. Julius Nyerere, Maputo', ativo: true },
      { nome: 'Maria Santos', nuit: '234567890', telefone: '+258 85 234 5678', email: 'maria.santos@email.com', endereco: 'Av. 24 de Julho, Maputo', ativo: true },
      { nome: 'António Costa', nuit: '345678901', telefone: '+258 86 345 6789', email: 'antonio.costa@email.com', endereco: 'Bairro Central, Matola', ativo: true },
      { nome: 'Ana Rodrigues', nuit: '456789012', telefone: '+258 87 456 7890', email: 'ana.rodrigues@email.com', endereco: 'Av. Samora Machel, Beira', ativo: true },
      { nome: 'Carlos Pereira', nuit: '567890123', telefone: '+258 84 567 8901', email: 'carlos.pereira@email.com', endereco: 'Rua da Resistência, Nampula', ativo: true },
      { nome: 'Beatriz Fernandes', nuit: '678901234', telefone: '+258 85 678 9012', email: 'beatriz.f@email.com', endereco: 'Av. Marginal, Maputo', ativo: true },
      { nome: 'Paulo Gomes', nuit: '789012345', telefone: '+258 86 789 0123', email: 'paulo.gomes@email.com', endereco: 'Bairro do Jardim, Matola', ativo: true },
      { nome: 'Sofia Alves', nuit: '890123456', telefone: '+258 87 890 1234', email: 'sofia.alves@email.com', endereco: 'Av. Eduardo Mondlane, Maputo', ativo: true },
      { nome: 'Ricardo Martins', nuit: '901234567', telefone: '+258 84 901 2345', email: 'ricardo.m@email.com', endereco: 'Rua da Liberdade, Beira', ativo: true },
      { nome: 'Inês Carvalho', nuit: '012345678', telefone: '+258 85 012 3456', email: 'ines.carvalho@email.com', endereco: 'Av. Acordos de Lusaka, Maputo', ativo: true },
      { nome: 'Manuel Sousa', nuit: '112345679', telefone: '+258 86 112 3457', email: 'manuel.sousa@email.com', endereco: 'Bairro Hulene, Maputo', ativo: true },
      { nome: 'Teresa Dias', nuit: '223456780', telefone: '+258 87 223 4568', email: 'teresa.dias@email.com', endereco: 'Av. Mao Tse Tung, Maputo', ativo: true },
      { nome: 'Fernando Lopes', nuit: '334567891', telefone: '+258 84 334 5679', email: 'fernando.lopes@email.com', endereco: 'Rua do Bagamoyo, Maputo', ativo: true },
      { nome: 'Cristina Ribeiro', nuit: '445678902', telefone: '+258 85 445 6790', email: 'cristina.r@email.com', endereco: 'Av. Vlademir Lenine, Maputo', ativo: true },
      { nome: 'Jorge Ferreira', nuit: '556789013', telefone: '+258 86 556 7901', email: 'jorge.ferreira@email.com', endereco: 'Bairro da Polana, Maputo', ativo: true },
      { nome: 'Luísa Monteiro', nuit: '667890124', telefone: '+258 87 667 8902', email: 'luisa.monteiro@email.com', endereco: 'Av. Karl Marx, Maputo', ativo: true },
      { nome: 'Pedro Oliveira', nuit: '778901235', telefone: '+258 84 778 9013', email: 'pedro.oliveira@email.com', endereco: 'Rua da Mesquita, Maputo', ativo: true },
      { nome: 'Mariana Nunes', nuit: '889012346', telefone: '+258 85 889 0124', email: 'mariana.nunes@email.com', endereco: 'Av. Ahmed Sekou Toure, Maputo', ativo: true },
      
      // 7 Clientes inativos
      { nome: 'André Barbosa', nuit: '990123457', telefone: '+258 86 990 1235', email: 'andre.barbosa@email.com', endereco: 'Bairro Maxaquene, Maputo', ativo: false },
      { nome: 'Patrícia Moreira', nuit: '101234568', telefone: '+258 87 101 2346', email: 'patricia.moreira@email.com', endereco: 'Av. de Moçambique, Maputo', ativo: false },
      { nome: 'Rui Correia', nuit: '211234569', telefone: '+258 84 211 2347', email: 'rui.correia@email.com', endereco: 'Rua da Imprensa, Maputo', ativo: false },
      { nome: 'Vera Teixeira', nuit: '321234570', telefone: '+258 85 321 2348', email: 'vera.teixeira@email.com', endereco: 'Av. Julius Nyerere, Maputo', ativo: false },
      { nome: 'Miguel Castro', nuit: '431234571', telefone: '+258 86 431 2349', email: 'miguel.castro@email.com', endereco: 'Bairro do Chamanculo, Maputo', ativo: false },
      { nome: 'Helena Pinto', nuit: '541234572', telefone: '+258 87 541 2350', email: 'helena.pinto@email.com', endereco: 'Av. Frente de Libertação, Maputo', ativo: false },
      { nome: 'Vítor Azevedo', nuit: '651234573', telefone: '+258 84 651 2351', email: 'vitor.azevedo@email.com', endereco: 'Rua do Zimpeto, Maputo', ativo: false },
    ];

    // Inserir clientes
    const { data: clientesInseridos, error: erroClientes } = await supabaseClient
      .from('clientes')
      .insert(clientes)
      .select();

    if (erroClientes) throw erroClientes;

    // Função para obter datas
    const obterData = (diasAtras: number) => {
      const data = new Date();
      data.setDate(data.getDate() - diasAtras);
      return data.toISOString().split('T')[0];
    };

    const obterDataFutura = (diasFrente: number) => {
      const data = new Date();
      data.setDate(data.getDate() + diasFrente);
      return data.toISOString().split('T')[0];
    };

    // Criar 27 dívidas
    const dividas = [];
    
    // 5 vencidas
    for (let i = 0; i < 5; i++) {
      dividas.push({
        cliente_id: clientesInseridos[i].id,
        valor: Math.floor(Math.random() * 50000) + 5000,
        descricao: `Fornecimento de materiais - ${Math.floor(Math.random() * 3) + 1} meses atrás`,
        data_vencimento: obterData(Math.floor(Math.random() * 60) + 30),
        status: 'vencida'
      });
    }

    // 6 pendentes
    for (let i = 5; i < 11; i++) {
      dividas.push({
        cliente_id: clientesInseridos[i].id,
        valor: Math.floor(Math.random() * 30000) + 3000,
        descricao: `Serviços prestados - Fatura ${1000 + i}`,
        data_vencimento: obterDataFutura(Math.floor(Math.random() * 30) + 5),
        status: 'pendente'
      });
    }

    // 8 pagas
    for (let i = 11; i < 19; i++) {
      const dataVenc = obterData(Math.floor(Math.random() * 90) + 10);
      const dataPag = new Date(dataVenc);
      dataPag.setDate(dataPag.getDate() - Math.floor(Math.random() * 5));
      
      dividas.push({
        cliente_id: clientesInseridos[i].id,
        valor: Math.floor(Math.random() * 40000) + 2000,
        descricao: `Pagamento de fatura - Ref: ${Math.floor(Math.random() * 9000) + 1000}`,
        data_vencimento: dataVenc,
        data_pagamento: dataPag.toISOString(),
        status: 'paga'
      });
    }

    // Mais 8 dívidas extras distribuídas
    for (let i = 0; i < 8; i++) {
      const idx = i * 2;
      if (idx < clientesInseridos.length) {
        dividas.push({
          cliente_id: clientesInseridos[idx].id,
          valor: Math.floor(Math.random() * 20000) + 1000,
          descricao: `Adiantamento de serviços`,
          data_vencimento: obterDataFutura(Math.floor(Math.random() * 45) + 15),
          status: 'pendente'
        });
      }
    }

    // Inserir dívidas
    const { data: dividasInseridas, error: erroDividas } = await supabaseClient
      .from('dividas')
      .insert(dividas)
      .select();

    if (erroDividas) throw erroDividas;

    return new Response(
      JSON.stringify({
        sucesso: true,
        clientes: clientesInseridos.length,
        dividas: dividasInseridas.length,
        mensagem: `✅ ${clientesInseridos.length} clientes e ${dividasInseridas.length} dívidas criados com sucesso!`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (erro) {
    console.error('Erro:', erro);
    return new Response(
      JSON.stringify({ erro: erro.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
