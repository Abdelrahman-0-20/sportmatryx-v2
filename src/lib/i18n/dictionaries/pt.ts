import type { Dict } from "./index";

/** Portuguese (Brazil). */
export const pt: Dict = {
  nav: {
    platform: "Plataforma",
    solutions: "Soluções",
    tactics: "Táticas",
    proof: "Evidências",
    marketplace: "Marketplace",
  },
  header: {
    athletes: "Atletas",
    signIn: "Entrar",
    bookDemo: "Agendar demo",
  },
  lang: {
    label: "Idioma",
  },
  footer: {
    tagline:
      "Inteligência de prontidão com validação para o futebol — uma pontuação diária por atleta, sempre explicável e governada por consentimento. Construído pela Healthmetryx.",
    product: "Produto",
    getStarted: "Começar",
    trust: "Confiança e legal",
    pilot: "Programa piloto",
    guest: "Continuar como convidado",
    demo: "Agendar demo",
    changelog: "Registro de mudanças",
    privacy: "Privacidade",
    terms: "Termos",
    pilotCta: "Entrar na lista do piloto",
    chip: "Demo sintética",
    disclaimer: "Apoio à decisão apenas · não é um dispositivo médico",
    copyright: "© 2026 Healthmetryx · Sportmetryx Football",
  },
  home: {
    hero: {
      eyebrow: "Apoio à decisão para comissões técnicas de futebol",
      h1a: "Transforme os dados diários dos atletas em",
      h1b: "decisões que você pode defender.",
      ledeStrong: "Sportmetryx Football",
      ledeRest:
        "converte os dados que sua comissão já coleta — GPS, carga de sessões, bem-estar, ambiente — em uma pontuação diária de prontidão por atleta: primeiro validada, construída sobre linhas de base pessoais e sempre explicável.",
      btnDemo: "Agendar demo",
      btnGuest: "Continuar como convidado",
      btnPlatform: "Ver a plataforma",
      guestNote: "O modo convidado mostra todas as telas com dados sintéticos rotulados — sem conta.",
    },
    proofLabels: [
      "esportes no pipeline",
      "observações de dispositivos processadas",
      "sessões modeladas de ponta a ponta",
      "implantações ativas",
    ],
    solutions: {
      eyebrow: "Soluções",
      h2: "Quatro assentos na mesa. Um modelo de dados.",
      explore: "Explorar solução →",
      cards: [
        {
          title: "Prontidão e performance",
          body: "Saiba quem pode treinar — e com que intensidade — antes da sessão, em um painel em que toda a equipe confia.",
        },
        {
          title: "Medicina e reabilitação",
          body: "Detecte sinais COMPROMISED cedo, mantenha dados WITHHELD fora do quadro e documente o retorno com trilha de auditoria.",
        },
        {
          title: "Coaching e desenvolvimento",
          body: "Selecione, gire e descanse com contexto — comparações de elenco e tendências de 14 dias em vez de só intuição.",
        },
        {
          title: "Produtos de dados e pesquisa",
          body: "Empacote e licencie conjuntos de dados com consentimento no marketplace integrado — um canal de receita sobre dados que você já produz.",
        },
      ],
    },
    what: {
      eyebrow: "O que é",
      h2: "Uma camada de inteligência de prontidão — não mais um painel.",
      p1: "Sportmetryx unifica as exportações dispersas que um clube de futebol já produz — arquivos de sensores, formulários de bem-estar, relatórios de carga — em um único **registro combinado atleta-dia**: uma linha por atleta por dia, e uma pontuação de prontidão derivada dele.",
      p2: "Toda pontuação é **validada** (entradas ruins ou ausentes são sinalizadas, nunca pontuadas em silêncio), **explicável** (você sempre vê quais drivers moveram o número) e **governada por consentimento** (dados do atleta são visíveis apenas sob os controles de acesso que cada atleta autoriza).",
      p3: "O resultado é uma imagem compartilhada e auditável em que toda a equipe pode agir antes de cada sessão.",
      glanceTitle: "Em resumo",
      glance: [
        { label: "Domínio", value: "Performance no futebol" },
        { label: "Construído por", value: "Healthmetryx" },
        { label: "Pontuações", value: "Validadas e explicáveis" },
        { label: "Linhas de base", value: "Pessoais, por atleta" },
        { label: "Dados", value: "Demo sintética — não são atletas reais" },
        { label: "Estado", value: "Protótipo · pesquisa e demonstração" },
      ],
    },
    who: {
      eyebrow: "Para quem",
      h2: "Uma plataforma, cada papel no ciclo.",
      cards: [
        { title: "Comissão técnica", line: "Monte o quadro diário de treino em uma tela." },
        { title: "Medicina e reabilitação", line: "Detecte sinais COMPROMISED cedo e valide o retorno." },
        { title: "Treinadores", line: "Escolha o elenco com contexto de prontidão, não só intuição." },
        { title: "Analistas e pesquisadores", line: "Trabalhe com conjuntos validados e com consentimento." },
      ],
    },
    usecases: {
      eyebrow: "Casos de uso",
      h2: "Para que é usado",
      cards: [
        {
          title: "Decisões diárias de prontidão",
          body: "Quem está READY, MONITOR ou COMPROMISED antes da sessão — com os drivers de cada banda, não uma caixa-preta.",
        },
        {
          title: "Carga e ambiente",
          body: "Acompanhe carga diária, viagens e calor frente à linha de base de cada atleta, sem perder contexto.",
        },
        {
          title: "Elenco e rotações",
          body: "Compare a prontidão de todo o elenco para planejar minutos, rotações e descansos com confiança.",
        },
        {
          title: "Produtos de dados e pesquisa",
          body: "Empacote e licencie conjuntos derivados no marketplace — só demo, sem pagamentos reais.",
        },
      ],
    },
    watch: {
      eyebrow: "Assista",
      h2: "Assista ao tour do produto",
      lede: "Uma capa e cinco capítulos — visão geral, painel de atletas, Player 360, marketplace, governança. Dê play ou pule para qualquer capítulo. Coloque uma gravação real em **public/demo.mp4** e este player passa a usá-la.",
    },
    tour: {
      eyebrow: "Como funciona",
      h2: "Importe. Valide. Decida.",
      sub: "Percorra o fluxo — ou deixe rodar.",
    },
    sports: [
      "Futebol",
      "Futebol americano",
      "Basquete",
      "Beisebol",
      "Ciclismo",
      "Rugby",
      "Atletismo",
      "Vôlei",
    ],
    data: {
      eyebrow: "Os dados",
      h2: "Explore o conjunto de dados da demo",
      lede: "Os dados exatos desta demo — 50 atletas sintéticos, médias diárias de sensores, carga, ambiente, consentimento, linhas de base e pontuações.",
      download: "Baixar CSV completo",
      stats: ["Linhas atleta-dia", "Atletas", "Times", "Dias cobertos"],
      distTitle: "Distribuição de prontidão (dias pontuados)",
      range: "Intervalo",
      teams: "Times",
      headers: ["Atleta", "Data", "Time", "Posição", "Pontuação", "Banda"],
      note: "Prévia das primeiras 6 linhas. O arquivo completo contém todas as médias de sensores, contribuições de drivers e verificações de validade — dados sintéticos claramente rotulados, não atletas reais.",
    },
    tactics: {
      eyebrow: "Novo · inteligência tática",
      h2: "Formações, fases e sistemas de jogo em um tabuleiro 3D.",
      lede: "Prontidão responde quem pode jogar — tática responde como jogamos. Troque formações, veja os passes se desenharem e execute o drill de coaching.",
      btn: "Explorar táticas →",
    },
    cta: {
      h2: "Veja rodando com suas perguntas.",
      lede: "Trinta minutos, produto ao vivo, sem slides — as cinco telas, suas perguntas de dados e como é uma temporada piloto.",
      btnProof: "Ver as evidências",
    },
  },
  nf: {
    eyebrow: "404 · Fora de campo",
    h1: "Página não encontrada.",
    lede: "O link está quebrado ou a página mudou. Todos os atletas estão onde devem — este não.",
    btnHome: "Voltar ao início",
    btnMarket: "Abrir o marketplace",
    btnGuest: "Continuar como convidado",
    note: "Apoio à decisão apenas. Não é um dispositivo médico. © Sportmetryx",
  },
};
