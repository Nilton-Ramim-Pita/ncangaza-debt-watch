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

    // Dados dos 25 clientes moçambicanos
    const clientes = [
      // 18 Clientes ativos
      { nome: 'Armando Zavale', nuit: '100234567', telefone: '+258 84 123 4567', email: 'armando.zavale@gmail.com', endereco: 'Bairro da Polana Cimento, Maputo', ativo: true },
      { nome: 'Célia Macuácua', nuit: '100345678', telefone: '+258 85 234 5678', email: 'celia.macuacua@gmail.com', endereco: 'Av. Julius Nyerere, Maputo', ativo: true },
      { nome: 'Domingos Nhantumbo', nuit: '100456789', telefone: '+258 86 345 6789', email: 'domingos.nhantumbo@gmail.com', endereco: 'Bairro Central, Matola', ativo: true },
      { nome: 'Fátima Massinga', nuit: '100567890', telefone: '+258 87 456 7890', email: 'fatima.massinga@gmail.com', endereco: 'Av. Samora Machel, Beira', ativo: true },
      { nome: 'Hélder Sitoe', nuit: '100678901', telefone: '+258 84 567 8901', email: 'helder.sitoe@gmail.com', endereco: 'Rua da Resistência, Nampula', ativo: true },
      { nome: 'Ivone Chissano', nuit: '100789012', telefone: '+258 85 678 9012', email: 'ivone.chissano@gmail.com', endereco: 'Av. Marginal, Maputo', ativo: true },
      { nome: 'João Cumbane', nuit: '100890123', telefone: '+258 86 789 0123', email: 'joao.cumbane@gmail.com', endereco: 'Bairro do Jardim, Matola', ativo: true },
      { nome: 'Lurdes Tembe', nuit: '100901234', telefone: '+258 87 890 1234', email: 'lurdes.tembe@gmail.com', endereco: 'Av. Eduardo Mondlane, Maputo', ativo: true },
      { nome: 'Mário Nguenha', nuit: '101012345', telefone: '+258 84 901 2345', email: 'mario.nguenha@gmail.com', endereco: 'Rua da Liberdade, Beira', ativo: true },
      { nome: 'Nazaré Mabote', nuit: '101123456', telefone: '+258 85 012 3456', email: 'nazare.mabote@gmail.com', endereco: 'Av. Acordos de Lusaka, Maputo', ativo: true },
      { nome: 'Olívio Manjate', nuit: '101234567', telefone: '+258 86 112 3457', email: 'olivio.manjate@gmail.com', endereco: 'Bairro Hulene, Maputo', ativo: true },
      { nome: 'Palmira Uamusse', nuit: '101345678', telefone: '+258 87 223 4568', email: 'palmira.uamusse@gmail.com', endereco: 'Av. Mao Tse Tung, Maputo', ativo: true },
      { nome: 'Quirino Mathe', nuit: '101456789', telefone: '+258 84 334 5679', email: 'quirino.mathe@gmail.com', endereco: 'Rua do Bagamoyo, Maputo', ativo: true },
      { nome: 'Rosa Bila', nuit: '101567890', telefone: '+258 85 445 6790', email: 'rosa.bila@gmail.com', endereco: 'Av. Vlademir Lenine, Maputo', ativo: true },
      { nome: 'Salomão Nkavandame', nuit: '101678901', telefone: '+258 86 556 7901', email: 'salomao.nkavandame@gmail.com', endereco: 'Bairro da Polana, Maputo', ativo: true },
      { nome: 'Teresa Mondlane', nuit: '101789012', telefone: '+258 87 667 8902', email: 'teresa.mondlane@gmail.com', endereco: 'Av. Karl Marx, Maputo', ativo: true },
      { nome: 'Ulisses Macaringue', nuit: '101890123', telefone: '+258 84 778 9013', email: 'ulisses.macaringue@gmail.com', endereco: 'Rua da Mesquita, Maputo', ativo: true },
      { nome: 'Vitória Guambe', nuit: '101901234', telefone: '+258 85 889 0124', email: 'vitoria.guambe@gmail.com', endereco: 'Av. Ahmed Sekou Toure, Maputo', ativo: true },
      
      // 7 Clientes inativos
      { nome: 'Wilson Chitará', nuit: '102012345', telefone: '+258 86 990 1235', email: 'wilson.chitara@gmail.com', endereco: 'Bairro Maxaquene, Maputo', ativo: false },
      { nome: 'Xana Muchanga', nuit: '102123456', telefone: '+258 87 101 2346', email: 'xana.muchanga@gmail.com', endereco: 'Av. de Moçambique, Maputo', ativo: false },
      { nome: 'Yolanda Mahumane', nuit: '102234567', telefone: '+258 84 211 2347', email: 'yolanda.mahumane@gmail.com', endereco: 'Rua da Imprensa, Maputo', ativo: false },
      { nome: 'Zacarias Malate', nuit: '102345678', telefone: '+258 85 321 2348', email: 'zacarias.malate@gmail.com', endereco: 'Av. Vladimir Lenine, Maputo', ativo: false },
      { nome: 'Alberto Nhamirre', nuit: '102456789', telefone: '+258 86 431 2349', email: 'alberto.nhamirre@gmail.com', endereco: 'Bairro do Chamanculo, Maputo', ativo: false },
      { nome: 'Berta Chitsondzo', nuit: '102567890', telefone: '+258 87 541 2350', email: 'berta.chitsondzo@gmail.com', endereco: 'Av. Frente de Libertação, Maputo', ativo: false },
      { nome: 'Carlos Nhanale', nuit: '102678901', telefone: '+258 84 651 2351', email: 'carlos.nhanale@gmail.com', endereco: 'Rua do Zimpeto, Maputo', ativo: false },
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

    // Produtos e serviços moçambicanos realistas
    const produtos = [
      'Perfume importado Versace',
      'Goma eletrónica JBL',
      'Fone Bluetooth Samsung',
      'Relógio Casio original',
      'Sapatos de couro italiano',
      'Mochila escolar Nike',
      'Telemóvel Samsung Galaxy',
      'Carregador portátil Xiaomi',
      'Óculos de sol Ray-Ban',
      'Carteira de couro Gucci',
      'Camisola Adidas original',
      'Ténis Nike Air Max',
      'Bolsa feminina Louis Vuitton',
      'Capulana estampada de luxo',
      'Conjunto de panelas Tramontina',
      'Ventilador de tecto Arno',
      'Ferro de engomar Philips',
      'Liquidificador Oster',
      'Sofá de 3 lugares importado',
      'Mesa de jantar com 6 cadeiras',
    ];

    // Criar 27 dívidas
    const dividas = [];
    
    // 5 vencidas (clientes 0-4)
    dividas.push(
      {
        cliente_id: clientesInseridos[0].id,
        valor: 8500,
        descricao: produtos[0],
        data_vencimento: obterData(45),
        status: 'vencida'
      },
      {
        cliente_id: clientesInseridos[1].id,
        valor: 12000,
        descricao: produtos[1],
        data_vencimento: obterData(60),
        status: 'vencida'
      },
      {
        cliente_id: clientesInseridos[2].id,
        valor: 5500,
        descricao: produtos[2],
        data_vencimento: obterData(30),
        status: 'vencida'
      },
      {
        cliente_id: clientesInseridos[3].id,
        valor: 15000,
        descricao: produtos[3],
        data_vencimento: obterData(90),
        status: 'vencida'
      },
      {
        cliente_id: clientesInseridos[4].id,
        valor: 7800,
        descricao: produtos[4],
        data_vencimento: obterData(50),
        status: 'vencida'
      }
    );

    // 6 pendentes (clientes 5-10)
    dividas.push(
      {
        cliente_id: clientesInseridos[5].id,
        valor: 3200,
        descricao: produtos[5],
        data_vencimento: obterDataFutura(10),
        status: 'pendente'
      },
      {
        cliente_id: clientesInseridos[6].id,
        valor: 9500,
        descricao: produtos[6],
        data_vencimento: obterDataFutura(15),
        status: 'pendente'
      },
      {
        cliente_id: clientesInseridos[7].id,
        valor: 4700,
        descricao: produtos[7],
        data_vencimento: obterDataFutura(20),
        status: 'pendente'
      },
      {
        cliente_id: clientesInseridos[8].id,
        valor: 6300,
        descricao: produtos[8],
        data_vencimento: obterDataFutura(25),
        status: 'pendente'
      },
      {
        cliente_id: clientesInseridos[9].id,
        valor: 11000,
        descricao: produtos[9],
        data_vencimento: obterDataFutura(30),
        status: 'pendente'
      },
      {
        cliente_id: clientesInseridos[10].id,
        valor: 2800,
        descricao: produtos[10],
        data_vencimento: obterDataFutura(12),
        status: 'pendente'
      }
    );

    // 8 pagas (clientes 11-18)
    const datasPagas = [
      { venc: obterData(20), pag: obterData(18) },
      { venc: obterData(35), pag: obterData(32) },
      { venc: obterData(50), pag: obterData(45) },
      { venc: obterData(65), pag: obterData(60) },
      { venc: obterData(40), pag: obterData(38) },
      { venc: obterData(55), pag: obterData(50) },
      { venc: obterData(70), pag: obterData(65) },
      { venc: obterData(25), pag: obterData(20) },
    ];

    for (let i = 0; i < 8; i++) {
      dividas.push({
        cliente_id: clientesInseridos[11 + i].id,
        valor: [5000, 8200, 10500, 3500, 12000, 4800, 9700, 6400][i],
        descricao: produtos[11 + i],
        data_vencimento: datasPagas[i].venc,
        data_pagamento: new Date(datasPagas[i].pag).toISOString(),
        status: 'paga'
      });
    }

    // 8 extras - dívidas adicionais para alguns clientes (produtos/serviços variados)
    dividas.push(
      {
        cliente_id: clientesInseridos[0].id,
        valor: 1500,
        descricao: 'Manutenção de telemóvel',
        data_vencimento: obterDataFutura(8),
        status: 'pendente'
      },
      {
        cliente_id: clientesInseridos[2].id,
        valor: 2200,
        descricao: 'Acessórios para carro',
        data_vencimento: obterDataFutura(18),
        status: 'pendente'
      },
      {
        cliente_id: clientesInseridos[5].id,
        valor: 3800,
        descricao: 'Creme de cabelo profissional',
        data_vencimento: obterDataFutura(22),
        status: 'pendente'
      },
      {
        cliente_id: clientesInseridos[7].id,
        valor: 5500,
        descricao: 'Jogo de lençóis importado',
        data_vencimento: obterData(10),
        status: 'vencida'
      },
      {
        cliente_id: clientesInseridos[9].id,
        valor: 4200,
        descricao: 'Kit de ferramentas completo',
        data_vencimento: obterDataFutura(35),
        status: 'pendente'
      },
      {
        cliente_id: clientesInseridos[12].id,
        valor: 6800,
        descricao: 'Aparelhagem de som JBL',
        data_vencimento: obterData(5),
        status: 'paga',
        data_pagamento: new Date(obterData(3)).toISOString()
      },
      {
        cliente_id: clientesInseridos[14].id,
        valor: 3100,
        descricao: 'Decoração para casa',
        data_vencimento: obterDataFutura(40),
        status: 'pendente'
      },
      {
        cliente_id: clientesInseridos[16].id,
        valor: 7200,
        descricao: 'Bicicleta mountain bike',
        data_vencimento: obterData(15),
        status: 'paga',
        data_pagamento: new Date(obterData(12)).toISOString()
      }
    );

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
