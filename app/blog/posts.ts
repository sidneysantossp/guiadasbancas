// Dados dos posts do blog - pode ser migrado para Supabase futuramente
export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: {
    name: string;
    avatar: string;
  };
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: number; // minutos
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "como-encontrar-banca-de-jornal-perto-de-voce",
    title: "Como Encontrar uma Banca de Jornal Perto de Você",
    excerpt: "Descubra como usar o Guia das Bancas para encontrar a banca de jornal mais próxima da sua casa ou trabalho e aproveitar as melhores ofertas.",
    content: `
## Encontre Bancas de Jornal com Facilidade

As bancas de jornal são verdadeiros tesouros urbanos, oferecendo muito mais do que jornais e revistas. Hoje você pode encontrar HQs, figurinhas, doces, bebidas e muito mais!

### Por que usar o Guia das Bancas?

O **Guia das Bancas** é a primeira plataforma digital que conecta você às bancas de jornal da sua região. Com nossa tecnologia de geolocalização, você pode:

- **Encontrar bancas próximas** em segundos
- **Ver produtos disponíveis** antes de sair de casa
- **Encomendar diretamente** com o jornaleiro via WhatsApp
- **Comparar preços** entre diferentes bancas

### Como funciona?

1. Acesse o site ou app do Guia das Bancas
2. Permita o acesso à sua localização
3. Veja as bancas mais próximas no mapa
4. Clique na banca para ver produtos e contato

### Dica Extra

Muitas bancas oferecem produtos exclusivos e edições raras. Converse com o jornaleiro - eles podem encomendar aquele item especial que você procura!
    `,
    coverImage: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=630&fit=crop",
    author: {
      name: "Equipe Guia das Bancas",
      avatar: "https://www.guiadasbancas.com.br/logo-icon.png"
    },
    category: "Dicas",
    tags: ["bancas", "localização", "como usar", "dicas"],
    publishedAt: "2024-11-15",
    readTime: 3
  },
  {
    slug: "colecionar-figurinhas-copa-2026-guia-completo",
    title: "Figurinhas da Copa 2026: Guia Completo para Colecionadores",
    excerpt: "Tudo o que você precisa saber sobre o álbum de figurinhas da Copa do Mundo 2026. Dicas para completar sua coleção sem gastar muito.",
    content: `
## O Álbum da Copa 2026 Está Chegando!

A Copa do Mundo 2026 nos Estados Unidos, México e Canadá promete ser histórica, e o álbum de figurinhas da Panini não ficará atrás!

### O que esperar do novo álbum

- **Mais países**: 48 seleções participantes
- **Tecnologia AR**: Figurinhas com realidade aumentada
- **Figurinhas especiais**: Holográficas e edições limitadas

### Onde comprar figurinhas?

As **bancas de jornal** são os melhores lugares para comprar figurinhas! Veja por quê:

1. **Preços justos** - Sem markup de revendedores
2. **Estoque fresco** - Recebem lotes diretamente da distribuidora
3. **Troca facilitada** - Muitas bancas organizam encontros de troca
4. **Apoio local** - Você ajuda o comércio do seu bairro

### Dicas para economizar

- Compre pacotes em quantidade para desconto
- Participe de grupos de troca online
- Use o Guia das Bancas para encontrar bancas com promoções
- Nunca compre figurinhas avulsas de sites duvidosos

### Monte sua estratégia

O segredo é não ter pressa! Compre um pouco por semana e participe de trocas. Assim você completa o álbum gastando menos.
    `,
    coverImage: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=1200&h=630&fit=crop",
    author: {
      name: "Equipe Guia das Bancas",
      avatar: "https://www.guiadasbancas.com.br/logo-icon.png"
    },
    category: "Coleções",
    tags: ["figurinhas", "copa 2026", "panini", "coleção"],
    publishedAt: "2024-11-10",
    readTime: 5
  },
  {
    slug: "melhores-hqs-para-comecar-a-ler",
    title: "10 Melhores HQs para Quem Quer Começar a Ler Quadrinhos",
    excerpt: "Lista com as melhores histórias em quadrinhos para iniciantes. Da Marvel e DC aos quadrinhos independentes brasileiros.",
    content: `
## Seu Guia para Entrar no Mundo das HQs

Quer começar a ler quadrinhos mas não sabe por onde começar? Preparamos uma lista com 10 HQs perfeitas para iniciantes!

### Super-heróis clássicos

1. **Homem-Aranha: Azul** - Uma história emocionante e acessível
2. **Batman: Ano Um** - A origem definitiva do Cavaleiro das Trevas
3. **X-Men: Dias de um Futuro Esquecido** - Clássico atemporal

### Quadrinhos independentes

4. **Saga** - Ficção científica épica e emocionante
5. **The Walking Dead** - Muito melhor que a série de TV
6. **Sandman** - Neil Gaiman em sua melhor forma

### Quadrinhos brasileiros

7. **Turma da Mônica Jovem** - Versão mangá dos personagens clássicos
8. **Astronauta: Singularidade** - MSP para adultos
9. **Tungstênio** - Noir brasileiro premiado
10. **Daytripper** - Dos irmãos Fábio Moon e Gabriel Bá

### Onde encontrar?

As bancas de jornal são excelentes para encontrar HQs! Use o **Guia das Bancas** para:

- Ver quais bancas têm HQs disponíveis
- Encomendar edições específicas
- Encontrar promoções e ofertas

### Dica do jornaleiro

Converse com o jornaleiro da sua banca! Eles conhecem os lançamentos e podem guardar as edições que você coleciona.
    `,
    coverImage: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=1200&h=630&fit=crop",
    author: {
      name: "Equipe Guia das Bancas",
      avatar: "https://www.guiadasbancas.com.br/logo-icon.png"
    },
    category: "HQs",
    tags: ["hqs", "quadrinhos", "marvel", "dc", "iniciantes"],
    publishedAt: "2024-11-05",
    readTime: 6
  },
  {
    slug: "historia-das-bancas-de-jornal-no-brasil",
    title: "A História das Bancas de Jornal no Brasil",
    excerpt: "Conheça a trajetória das bancas de jornal no Brasil, desde o século XIX até os dias atuais, e sua importância cultural.",
    content: `
## Uma Tradição Brasileira

As bancas de jornal fazem parte da paisagem urbana brasileira há mais de 150 anos. Vamos conhecer essa história fascinante!

### Os primórdios (1850-1900)

As primeiras bancas surgiram no Rio de Janeiro, então capital do Império. Eram simples quiosques de madeira que vendiam jornais importados da Europa.

### A era de ouro (1900-1980)

O século XX foi a era de ouro das bancas:

- **Anos 20-30**: Explosão de revistas ilustradas
- **Anos 40-50**: Chegada das HQs americanas
- **Anos 60-70**: Revistas de comportamento e cultura
- **Anos 80**: Auge das publicações especializadas

### O desafio digital (2000-2020)

A internet trouxe desafios, mas as bancas se reinventaram:

- Diversificação de produtos (doces, bebidas, utilidades)
- Foco em nichos (colecionadores, HQs, revistas especializadas)
- Serviços de conveniência

### A era da transformação digital (2020+)

O **Guia das Bancas** representa a nova fase:

- Presença digital para as bancas
- Conexão direta com consumidores
- Encomendas online com retirada na banca
- Visibilidade para o pequeno comerciante

### O futuro é híbrido

As bancas de jornal continuam relevantes porque oferecem algo que o digital não pode: o atendimento humano, a curadoria do jornaleiro e a descoberta de produtos inesperados.

Apoie sua banca local!
    `,
    coverImage: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&h=630&fit=crop",
    author: {
      name: "Equipe Guia das Bancas",
      avatar: "https://www.guiadasbancas.com.br/logo-icon.png"
    },
    category: "Cultura",
    tags: ["história", "bancas", "brasil", "cultura"],
    publishedAt: "2024-10-28",
    readTime: 7
  },
  {
    slug: "vantagens-comprar-na-banca-do-bairro",
    title: "5 Vantagens de Comprar na Banca do Seu Bairro",
    excerpt: "Descubra por que comprar na banca de jornal do seu bairro é melhor do que comprar online. Apoie o comércio local!",
    content: `
## Por Que Escolher a Banca do Bairro?

Em tempos de compras online, a banca de jornal do bairro oferece vantagens únicas que você talvez não tenha percebido.

### 1. Atendimento Personalizado

O jornaleiro conhece seus clientes. Ele pode:

- Guardar sua revista favorita
- Avisar quando chegar um lançamento
- Encomendar itens especiais
- Dar dicas e recomendações

### 2. Produtos Frescos e Originais

Nas bancas você encontra:

- Revistas e jornais do dia
- Figurinhas de lotes novos
- HQs em primeira mão
- Garantia de originalidade

### 3. Conveniência Real

- Está no seu caminho diário
- Não precisa esperar entrega
- Pode ver o produto antes de comprar
- Horários flexíveis

### 4. Apoio à Economia Local

Ao comprar na banca você:

- Mantém empregos no bairro
- Fortalece o comércio local
- Contribui para a segurança urbana
- Preserva a cultura das bancas

### 5. Descobertas Inesperadas

Diferente do algoritmo online, na banca você pode:

- Descobrir revistas que não conhecia
- Encontrar edições raras
- Ser surpreendido por lançamentos
- Conversar e trocar ideias

### Use a tecnologia a seu favor

O **Guia das Bancas** une o melhor dos dois mundos: você pesquisa online e compra na banca do bairro!
    `,
    coverImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=630&fit=crop",
    author: {
      name: "Equipe Guia das Bancas",
      avatar: "https://www.guiadasbancas.com.br/logo-icon.png"
    },
    category: "Dicas",
    tags: ["banca", "bairro", "comércio local", "vantagens"],
    publishedAt: "2024-10-20",
    readTime: 4
  },
  {
    slug: "guia-revistas-em-quadrinhos-marvel-dc",
    title: "Guia Definitivo: Marvel vs DC - Qual Universo Escolher?",
    excerpt: "Compare os universos Marvel e DC Comics. Descubra as diferenças, os melhores personagens e por onde começar a ler.",
    content: `
## Marvel ou DC? Eis a Questão!

Se você está entrando no mundo dos quadrinhos, provavelmente já se perguntou: Marvel ou DC? Vamos ajudar você a decidir!

### Universo Marvel

**Estilo**: Heróis mais humanos, com problemas do dia a dia
**Destaques**: Homem-Aranha, X-Men, Vingadores, Guardiões da Galáxia

**Pontos fortes**:
- Personagens relacionáveis
- Histórias conectadas ao mundo real
- Grande variedade de tons (comédia a drama)

**Para começar**:
- Ultimate Spider-Man
- Novos Vingadores
- X-Men: Primeira Turma

### Universo DC

**Estilo**: Heróis mais míticos e icônicos
**Destaques**: Batman, Superman, Mulher-Maravilha, Liga da Justiça

**Pontos fortes**:
- Histórias épicas e grandiosas
- Personagens icônicos e atemporais
- Graphic novels revolucionárias

**Para começar**:
- Batman: O Longo Dia das Bruxas
- Superman: Entre a Foice e o Martelo
- Mulher-Maravilha: Terra Um

### Nossa recomendação

Por que escolher? Leia os dois! Cada universo tem suas qualidades únicas.

### Onde encontrar?

As bancas de jornal recebem lançamentos mensais de Marvel e DC. Use o **Guia das Bancas** para encontrar uma banca com boa seleção de HQs perto de você!
    `,
    coverImage: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=1200&h=630&fit=crop",
    author: {
      name: "Equipe Guia das Bancas",
      avatar: "https://www.guiadasbancas.com.br/logo-icon.png"
    },
    category: "HQs",
    tags: ["marvel", "dc", "quadrinhos", "super-heróis", "guia"],
    publishedAt: "2024-10-15",
    readTime: 5
  }
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find(post => post.slug === slug);
}

export function getAllPosts(): BlogPost[] {
  return BLOG_POSTS.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getPostsByCategory(category: string): BlogPost[] {
  return BLOG_POSTS.filter(post => post.category === category);
}

export function getRelatedPosts(currentSlug: string, limit = 3): BlogPost[] {
  const currentPost = getPostBySlug(currentSlug);
  if (!currentPost) return [];
  
  return BLOG_POSTS
    .filter(post => post.slug !== currentSlug)
    .filter(post => 
      post.category === currentPost.category ||
      post.tags.some(tag => currentPost.tags.includes(tag))
    )
    .slice(0, limit);
}

export function getAllCategories(): string[] {
  return [...new Set(BLOG_POSTS.map(post => post.category))];
}

export function getAllTags(): string[] {
  const tags = BLOG_POSTS.flatMap(post => post.tags);
  return [...new Set(tags)];
}
