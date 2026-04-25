import {
  BookOpen,
  Target,
  Microscope,
  Library,
  Building2,
  TrendingUp,
  CheckCircle2,
  Heart,
  ListOrdered,
  AlertCircle,
  Lightbulb,
} from "lucide-react";

/**
 * Conteúdo dos 11 slides.
 * Estilo: minimalista, académico, paleta navy/branco/cinza.
 */
export interface SlideMeta {
  id: string;
  title: string;
  icon: typeof BookOpen;
}

export const SLIDES_META: SlideMeta[] = [
  { id: "capa", title: "Capa", icon: BookOpen },
  { id: "estrutura", title: "Estrutura da Apresentação", icon: ListOrdered },
  { id: "contexto", title: "Contextualização e Problema", icon: AlertCircle },
  { id: "objetivos", title: "Objectivos da Pesquisa", icon: Target },
  { id: "metodologia", title: "Metodologia", icon: Microscope },
  { id: "fundamentacao", title: "Fundamentação Teórica", icon: Library },
  { id: "estudo-caso", title: "Estudo de Caso", icon: Building2 },
  { id: "resultados", title: "Resultados e Discussão", icon: TrendingUp },
  { id: "propostas", title: "Propostas de Melhoria", icon: Lightbulb },
  { id: "conclusoes", title: "Conclusões e Sugestões", icon: CheckCircle2 },
  { id: "agradecimentos", title: "Agradecimentos", icon: Heart },
];

const NAVY = "#1e3a8a";

/* =========================================================
   SLIDE 1 — CAPA
   ========================================================= */
export const SlideCapa = () => (
  <div className="h-full flex flex-col items-center justify-center text-center max-w-5xl mx-auto animate-fade-in">
    <p className="text-sm font-bold text-slate-700 tracking-wide">
      FACULDADE DE GESTÃO DE RECURSOS NATURAIS E MINERALOGIA
    </p>
    <p className="text-sm font-semibold text-slate-700 mt-2">
      SESSÃO PÚBLICA DE TRABALHO ACADÉMICO
    </p>
    <p className="text-base text-slate-700 mt-2">
      Curso: Licenciatura em Gestão de Recursos Humanos
    </p>
    <p className="text-sm text-slate-500 mt-1">
      Disciplina: Sistema de Informação em Gestão
    </p>

    <div className="mt-8 px-10 py-7 border-2 border-[#1e3a8a] rounded-xl shadow-sm max-w-3xl">
      <h1 className="text-[22px] font-bold text-[#1e3a8a] leading-tight">
        DESENVOLVIMENTO DE UM ESTUDO DE CASO SOBRE O USO DE SISTEMAS DE
        INFORMAÇÃO PARA APOIO À DECISÃO E GESTÃO DO CONHECIMENTO
      </h1>
      <p className="text-sm text-slate-600 mt-3 italic">
        Uma análise aplicada à realidade empresarial da província de Tete
      </p>
    </div>

    <div className="mt-8 grid grid-cols-2 gap-12 w-full max-w-3xl text-left">
      <div>
        <p className="text-xs font-bold text-[#1e3a8a] tracking-wider mb-2">
          DISCENTES
        </p>
        <ul className="text-[13px] text-slate-700 space-y-0.5">
          <li>Ailton Ned Frederico Mata</li>
          <li>Brígida Mateus Saize</li>
          <li>Bernise Maria Pemba</li>
          <li>Emília Júlio Machanguana</li>
          <li>Faith Almeida Octávio</li>
        </ul>
      </div>
      <div>
        <p className="text-xs font-bold text-[#1e3a8a] tracking-wider mb-2">
          DOCENTE
        </p>
        <p className="text-[14px] font-semibold text-slate-800">Jean Muhire</p>
        <p className="text-xs text-slate-500 mt-4 font-bold tracking-wider">
          LOCAL E DATA
        </p>
        <p className="text-[14px] font-semibold text-slate-800 mt-1">
          Tete · Abril de 2026
        </p>
      </div>
    </div>
  </div>
);

/* =========================================================
   SLIDE 2 — ESTRUTURA
   ========================================================= */
export const SlideEstrutura = () => {
  const items = [
    "Contextualização e Problema",
    "Objectivos da Pesquisa",
    "Metodologia",
    "Fundamentação Teórica",
    "Estudo de Caso",
    "Resultados e Discussão",
    "Propostas de Melhoria",
    "Conclusões e Sugestões",
    "Agradecimentos",
  ];
  return (
    <SlideHeader title="Estrutura da Apresentação" subtitle="Roteiro temático" />
  ).type === "div" ? null : null; // placeholder substituído abaixo
};

// Reescrita do Slide 2 para usar componente real
export const SlideEstruturaReal = () => {
  const items = [
    "Contextualização e Problema",
    "Objectivos da Pesquisa",
    "Metodologia",
    "Fundamentação Teórica",
    "Estudo de Caso",
    "Resultados e Discussão",
    "Propostas de Melhoria",
    "Conclusões e Sugestões",
    "Agradecimentos",
  ];
  return (
    <div className="h-full flex flex-col animate-fade-in">
      <SlideHeader
        title="Estrutura da Apresentação"
        subtitle="Roteiro temático"
      />
      <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 mt-6">
        {items.map((it, i) => (
          <div
            key={i}
            className="flex items-center border border-[#1e3a8a]/30 rounded-md overflow-hidden hover:border-[#1e3a8a] transition-colors"
          >
            <div className="bg-[#1e3a8a] text-white text-sm font-bold w-12 h-11 flex items-center justify-center tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </div>
            <p className="px-4 text-[14px] text-slate-800 font-medium">{it}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================================================
   SLIDE 3 — CONTEXTO E PROBLEMA
   ========================================================= */
export const SlideContexto = () => (
  <div className="h-full flex flex-col animate-fade-in">
    <SlideHeader
      title="Contextualização e Problema"
      subtitle="Capítulo 1 — Introdução"
    />
    <div className="grid grid-cols-2 gap-6 mt-5 flex-1">
      {/* Cenário */}
      <div className="border-2 border-[#1e3a8a] rounded-xl p-5">
        <p className="text-[11px] font-bold text-[#1e3a8a] tracking-wider mb-2">
          CENÁRIO ACTUAL
        </p>
        <h3 className="text-lg font-bold text-slate-800 mb-3">
          Transformação digital em Moçambique
        </h3>
        <ul className="space-y-2.5 text-[13px] text-slate-700">
          <BulletItem>
            As TIC transformam a forma como as organizações operam (Laudon &
            Laudon, 2016).
          </BulletItem>
          <BulletItem>
            Em Tete, há crescimento dos sectores mineiro, energético e
            comercial.
          </BulletItem>
          <BulletItem>
            Persistem limitações de infraestrutura e resistência à mudança.
          </BulletItem>
          <BulletItem>
            A integração estratégica de SI gera vantagem competitiva (Porter,
            2014).
          </BulletItem>
        </ul>
      </div>

      {/* Problema */}
      <div className="bg-[#1e3a8a] text-white rounded-xl p-5 flex flex-col">
        <p className="text-[11px] font-bold text-amber-300 tracking-wider mb-2">
          QUESTÃO DE INVESTIGAÇÃO
        </p>
        <h3 className="text-lg font-bold mb-3">Problema central</h3>
        <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20 flex-1 flex items-center">
          <p className="text-[14px] italic leading-relaxed">
            “De que forma os Sistemas de Informação contribuem para a melhoria
            da gestão organizacional, da tomada de decisão e da gestão do
            conhecimento nas empresas moçambicanas, com enfoque na província de
            Tete?”
          </p>
        </div>
      </div>
    </div>
  </div>
);

/* =========================================================
   SLIDE 4 — OBJECTIVOS
   ========================================================= */
export const SlideObjectivos = () => (
  <div className="h-full flex flex-col animate-fade-in">
    <SlideHeader title="Objectivos da Pesquisa" subtitle="Geral e específicos" />

    {/* Objectivo geral */}
    <div className="border-2 border-[#1e3a8a] rounded-xl mt-5 overflow-hidden">
      <div className="bg-[#1e3a8a] text-white px-5 py-2 text-xs font-bold tracking-wider">
        OBJECTIVO GERAL
      </div>
      <div className="px-5 py-4">
        <p className="text-[15px] text-slate-800 leading-relaxed flex gap-2">
          <span className="text-[#1e3a8a] font-bold">▸</span>
          Analisar o papel dos Sistemas de Informação na gestão organizacional,
          com enfoque no apoio à tomada de decisão e na gestão do conhecimento
          em empresas moçambicanas.
        </p>
      </div>
    </div>

    {/* Específicos */}
    <div className="border-2 border-[#1e3a8a] rounded-xl mt-4 overflow-hidden flex-1">
      <div className="bg-[#1e3a8a] text-white px-5 py-2 text-xs font-bold tracking-wider">
        OBJECTIVOS ESPECÍFICOS
      </div>
      <ol className="px-5 py-4 space-y-3 text-[14px] text-slate-800">
        <li className="flex gap-3">
          <span className="text-[#1e3a8a] font-bold tabular-nums">1.</span>
          Analisar a importância dos SI no apoio à gestão organizacional e à
          tomada de decisão.
        </li>
        <li className="flex gap-3">
          <span className="text-[#1e3a8a] font-bold tabular-nums">2.</span>
          Examinar a relação entre o planeamento estratégico e a utilização dos
          SI nas organizações.
        </li>
        <li className="flex gap-3">
          <span className="text-[#1e3a8a] font-bold tabular-nums">3.</span>
          Avaliar os desafios, riscos e práticas de segurança associados ao uso
          dos SI, propondo melhorias.
        </li>
      </ol>
    </div>
  </div>
);

/* =========================================================
   SLIDE 5 — METODOLOGIA
   ========================================================= */
export const SlideMetodologia = () => {
  const tipos = [
    {
      h: "Natureza",
      t: "Pesquisa Aplicada",
      d: "Resolução de problema concreto (Gil, 2019).",
    },
    {
      h: "Abordagem",
      t: "Qualitativa",
      d: "Compreensão do contexto organizacional.",
    },
    {
      h: "Procedimento",
      t: "Estudo de Caso",
      d: "Análise aprofundada (Yin, 2015).",
    },
  ];
  const tecn = [
    "Pesquisa bibliográfica em livros e artigos científicos",
    "Análise documental de relatórios institucionais",
    "Observação aplicada ao contexto organizacional",
  ];
  return (
    <div className="h-full flex flex-col animate-fade-in">
      <SlideHeader
        title="Metodologia"
        subtitle="Abordagem qualitativa baseada em estudo de caso"
      />

      <div className="grid grid-cols-3 gap-4 mt-5">
        {tipos.map((t) => (
          <div
            key={t.h}
            className="border-2 border-[#1e3a8a] rounded-xl overflow-hidden"
          >
            <div className="bg-[#1e3a8a] text-white px-3 py-1.5 text-[10px] font-bold tracking-wider">
              {t.h.toUpperCase()}
            </div>
            <div className="p-4">
              <p className="text-base font-bold text-[#1e3a8a]">{t.t}</p>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {t.d}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 border-2 border-[#1e3a8a] rounded-xl overflow-hidden flex-1">
        <div className="bg-[#1e3a8a] text-white px-5 py-2 text-xs font-bold tracking-wider">
          TÉCNICAS DE RECOLHA DE DADOS
        </div>
        <ul className="px-5 py-4 space-y-2.5 text-[14px] text-slate-800">
          {tecn.map((t, i) => (
            <BulletItem key={i}>{t}</BulletItem>
          ))}
        </ul>
      </div>
    </div>
  );
};

/* =========================================================
   SLIDE 6 — FUNDAMENTAÇÃO TEÓRICA
   ========================================================= */
export const SlideFundamentacao = () => {
  const conc = [
    {
      n: "01",
      t: "Sistemas de Informação",
      d: "Componentes integrados que recolhem, processam e distribuem informação para apoiar a decisão.",
      a: "Laudon & Laudon (2016) · O'Brien & Marakas (2011)",
    },
    {
      n: "02",
      t: "Apoio à Decisão",
      d: "Modelos racional, limitado e intuitivo. SI reduzem incerteza com BI e análises avançadas.",
      a: "Simon (1977) · Chiavenato (2014)",
    },
    {
      n: "03",
      t: "Planeamento Estratégico",
      d: "Alinhamento entre estratégia de negócio e estratégia de TI é essencial.",
      a: "Henderson & Venkatraman (1993)",
    },
    {
      n: "04",
      t: "Gestão do Conhecimento",
      d: "Conhecimento criado pela interacção entre tácito e explícito (modelo SECI).",
      a: "Nonaka & Takeuchi (1997) · Gil (2019)",
    },
  ];
  return (
    <div className="h-full flex flex-col animate-fade-in">
      <SlideHeader
        title="Fundamentação Teórica"
        subtitle="Conceitos centrais e autores de referência"
      />
      <div className="grid grid-cols-2 gap-4 mt-5 flex-1">
        {conc.map((c) => (
          <div
            key={c.n}
            className="border-2 border-[#1e3a8a] rounded-xl p-4 flex flex-col hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-[#1e3a8a]/30">
                {c.n}
              </span>
              <h3 className="text-[15px] font-bold text-[#1e3a8a]">{c.t}</h3>
            </div>
            <p className="text-[12.5px] text-slate-700 mt-2 leading-relaxed flex-1">
              {c.d}
            </p>
            <p className="text-[10.5px] text-slate-500 mt-2 italic border-t border-slate-200 pt-2">
              📖 {c.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================================================
   SLIDE 7 — ESTUDO DE CASO
   ========================================================= */
export const SlideEstudoCaso = () => {
  const rows = [
    ["Gestão de Clientes", "Excel / manual", "Perda de dados"],
    ["Controlo de Stock", "Manual", "Falta de precisão"],
    ["Recursos Humanos", "Arquivos físicos", "Acesso difícil"],
    ["Decisão", "Intuição", "Dados não confiáveis"],
  ];
  return (
    <div className="h-full flex flex-col animate-fade-in">
      <SlideHeader
        title="Estudo de Caso"
        subtitle="Tete Comercial & Serviços, Lda."
      />
      <div className="grid grid-cols-5 gap-4 mt-5 flex-1">
        <div className="col-span-2 border-2 border-[#1e3a8a] rounded-xl p-4">
          <p className="text-[10.5px] font-bold text-[#1e3a8a] tracking-wider">
            CARACTERIZAÇÃO
          </p>
          <h3 className="text-base font-bold text-slate-800 mt-1">
            A Organização
          </h3>
          <p className="text-[12px] text-slate-600 mt-2 leading-relaxed">
            Empresa baseada na realidade empresarial de Tete, sector de
            comércio e prestação de serviços técnicos.
          </p>
          <p className="text-[10.5px] font-bold text-[#1e3a8a] tracking-wider mt-4">
            DEPARTAMENTOS
          </p>
          <ul className="text-[12px] text-slate-700 mt-2 space-y-1">
            <BulletItem>Administração e Finanças</BulletItem>
            <BulletItem>Recursos Humanos</BulletItem>
            <BulletItem>Vendas e Atendimento</BulletItem>
            <BulletItem>Logística e Armazém</BulletItem>
          </ul>
        </div>

        <div className="col-span-3 flex flex-col">
          <p className="text-[10.5px] font-bold text-[#1e3a8a] tracking-wider">
            DIAGNÓSTICO — BAIXA MATURIDADE DIGITAL
          </p>
          <div className="border border-[#1e3a8a]/40 rounded-lg overflow-hidden mt-2">
            <table className="w-full text-[12px]">
              <thead className="bg-[#1e3a8a] text-white">
                <tr>
                  <th className="text-left px-3 py-2 font-semibold">Área</th>
                  <th className="text-left px-3 py-2 font-semibold">Método</th>
                  <th className="text-left px-3 py-2 font-semibold">
                    Limitação
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr
                    key={i}
                    className={i % 2 ? "bg-slate-50" : "bg-white"}
                  >
                    {r.map((c, j) => (
                      <td
                        key={j}
                        className="px-3 py-2 text-slate-700 border-t border-slate-200"
                      >
                        {c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-[#1e3a8a] text-white rounded-lg p-3 mt-3">
            <p className="text-[10px] font-bold text-amber-300 tracking-wider mb-1">
              PRINCIPAIS DESAFIOS
            </p>
            <p className="text-[12px]">
              Falta de integração · Decisão ineficiente · Baixa capacitação ·
              Processos manuais
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   SLIDE 8 — RESULTADOS E DISCUSSÃO
   ========================================================= */
export const SlideResultados = () => {
  const lacunas = [
    "Ausência de ERP",
    "Falta de KPIs",
    "Sem Business Intelligence",
    "Segurança deficiente",
    "Sem políticas formais",
    "Baixa cultura de GC",
  ];
  return (
    <div className="h-full flex flex-col animate-fade-in">
      <SlideHeader
        title="Resultados e Discussão"
        subtitle="Impacto, avaliação crítica e lacunas"
      />
      <div className="grid grid-cols-2 gap-4 mt-5">
        <div className="border-2 border-emerald-600 rounded-xl overflow-hidden">
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-bold tracking-wider">
            ✓ IMPACTOS POSITIVOS
          </div>
          <ul className="p-4 space-y-2 text-[13px] text-slate-700">
            <BulletItem color="text-emerald-600">
              Melhoria parcial na organização de dados (Excel, faturação)
            </BulletItem>
            <BulletItem color="text-emerald-600">
              Agilidade na comunicação interna (email)
            </BulletItem>
            <BulletItem color="text-emerald-600">
              Redução pontual de erros em processos automatizados
            </BulletItem>
          </ul>
        </div>
        <div className="border-2 border-rose-600 rounded-xl overflow-hidden">
          <div className="bg-rose-600 text-white px-4 py-2 text-xs font-bold tracking-wider">
            ✗ IMPACTOS NEGATIVOS
          </div>
          <ul className="p-4 space-y-2 text-[13px] text-slate-700">
            <BulletItem color="text-rose-600">
              Falta de integração entre sistemas
            </BulletItem>
            <BulletItem color="text-rose-600">
              Dependência de processos manuais
            </BulletItem>
            <BulletItem color="text-rose-600">
              Baixa fiabilidade dos dados
            </BulletItem>
            <BulletItem color="text-rose-600">
              Ausência de informação em tempo real
            </BulletItem>
          </ul>
        </div>
      </div>

      <div className="border-2 border-[#1e3a8a] rounded-xl overflow-hidden mt-4 flex-1">
        <div className="bg-[#1e3a8a] text-white px-4 py-2 text-xs font-bold tracking-wider">
          LACUNAS CRÍTICAS IDENTIFICADAS
        </div>
        <div className="p-4 grid grid-cols-3 gap-2.5">
          {lacunas.map((l, i) => (
            <div
              key={i}
              className="bg-slate-50 border-l-4 border-[#1e3a8a] px-3 py-2 text-[12.5px] font-medium text-slate-800 rounded-r"
            >
              {l}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   SLIDE 9 — PROPOSTAS DE MELHORIA
   ========================================================= */
export const SlidePropostas = () => {
  const props = [
    { t: "ERP Integrado", d: "Centralização de dados e automatização." },
    { t: "Business Intelligence", d: "Dashboards e análise em tempo real." },
    { t: "Segurança", d: "Backups, controlo de acessos e políticas." },
    { t: "Capacitação", d: "Formação em TI e competências digitais." },
    { t: "Processos", d: "Padronização e definição de KPIs." },
  ];
  return (
    <div className="h-full flex flex-col animate-fade-in">
      <SlideHeader
        title="Propostas de Melhoria"
        subtitle="Medidas estratégicas para elevar a maturidade digital"
      />
      <div className="grid grid-cols-5 gap-3 mt-5 flex-1">
        {props.map((p, i) => (
          <div
            key={i}
            className="border-2 border-[#1e3a8a] rounded-xl flex flex-col overflow-hidden hover:-translate-y-1 transition-transform"
          >
            <div className="bg-[#1e3a8a] text-white text-center py-3">
              <span className="text-2xl font-bold">0{i + 1}</span>
            </div>
            <div className="p-3 flex-1 flex flex-col">
              <h4 className="text-[13px] font-bold text-[#1e3a8a]">{p.t}</h4>
              <p className="text-[11.5px] text-slate-600 mt-2 leading-relaxed flex-1">
                {p.d}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================================================
   SLIDE 10 — CONCLUSÕES
   ========================================================= */
export const SlideConclusoes = () => (
  <div className="h-full flex flex-col animate-fade-in">
    <SlideHeader
      title="Conclusões e Sugestões"
      subtitle="Síntese final do estudo"
    />
    <div className="grid grid-cols-3 gap-4 mt-5 flex-1">
      <div className="col-span-2 border-2 border-emerald-600 rounded-xl overflow-hidden">
        <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-bold tracking-wider">
          SÍNTESE
        </div>
        <div className="p-4 text-[13px] text-slate-700 space-y-3 leading-relaxed">
          <p>
            Os SI são <strong>elementos estratégicos fundamentais</strong> para
            a gestão organizacional, permitindo melhorar a eficiência, integrar
            processos e apoiar decisões baseadas em dados.
          </p>
          <p>
            A organização analisada apresenta <strong>baixa maturidade
            digital</strong>, evidenciada por ferramentas básicas, falta de
            integração e dependência de processos manuais.
          </p>
          <p>
            A eficácia dos SI depende do nível de adopção, integração e
            <strong> alinhamento estratégico</strong> com os objectivos
            organizacionais.
          </p>
        </div>
      </div>

      <div className="border-2 border-[#1e3a8a] rounded-xl overflow-hidden bg-[#1e3a8a] text-white">
        <div className="px-4 py-2 text-xs font-bold tracking-wider text-amber-300 border-b border-white/20">
          RECOMENDAÇÕES
        </div>
        <ul className="p-4 space-y-3 text-[12.5px]">
          {[
            "Adoptar SI integrados (ERP)",
            "Reforçar segurança da informação",
            "Investir em capacitação digital",
            "Alinhar TI à estratégia",
            "Promover cultura de GC",
          ].map((r, i) => (
            <li key={i} className="flex gap-2.5 items-start">
              <span className="text-amber-300 font-bold tabular-nums">
                0{i + 1}
              </span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

/* =========================================================
   SLIDE 11 — AGRADECIMENTOS
   ========================================================= */
export const SlideAgradecimentos = () => (
  <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in">
    <h2 className="text-6xl font-bold text-[#1e3a8a]">Obrigada!</h2>
    <p className="text-base text-slate-600 mt-3">Pela vossa atenção</p>

    <div className="border-2 border-[#1e3a8a] rounded-xl px-8 py-5 mt-8 max-w-2xl">
      <p className="text-[16px] italic text-slate-800 leading-relaxed">
        “A informação organizada transforma-se em poder de decisão.”
      </p>
      <p className="text-sm text-slate-500 mt-2">— Herbert Simon</p>
    </div>

    <p className="text-[12px] text-slate-500 mt-8 max-w-2xl">
      Ailton Mata · Brígida Saize · Bernise Pemba · Emília Machanguana · Faith
      Octávio
    </p>
  </div>
);

/* ---------- helpers ---------- */
const SlideHeader = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => (
  <div>
    <h2 className="text-3xl font-bold text-[#1e3a8a] tracking-tight">
      {title}
    </h2>
    {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
    <div className="h-1 w-16 bg-[#1e3a8a] mt-3 rounded" />
  </div>
);

const BulletItem = ({
  children,
  color = "text-[#1e3a8a]",
}: {
  children: React.ReactNode;
  color?: string;
}) => (
  <li className="flex gap-2 items-start">
    <span className={`${color} font-bold mt-0.5`}>▸</span>
    <span className="flex-1">{children}</span>
  </li>
);

/* ---------- Mapa de slides ---------- */
export const SLIDE_COMPONENTS = [
  SlideCapa,
  SlideEstruturaReal,
  SlideContexto,
  SlideObjectivos,
  SlideMetodologia,
  SlideFundamentacao,
  SlideEstudoCaso,
  SlideResultados,
  SlidePropostas,
  SlideConclusoes,
  SlideAgradecimentos,
];
