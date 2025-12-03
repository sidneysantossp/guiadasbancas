import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllPosts, getAllCategories, BlogPost } from "./posts";

// Metadata SEO otimizado para a página do Blog
export const metadata: Metadata = {
  title: "Blog Guia das Bancas | Dicas de HQs, Figurinhas e Bancas de Jornal",
  description: "Descubra dicas para colecionadores, novidades sobre HQs, figurinhas da Copa 2026 e cultura das bancas de jornal. Artigos exclusivos sobre quadrinhos Marvel, DC e muito mais.",
  keywords: [
    "blog bancas de jornal",
    "dicas colecionadores",
    "HQs marvel dc",
    "figurinhas copa 2026",
    "revistas quadrinhos",
    "banca de jornal perto de mim",
    "guia das bancas"
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Blog Guia das Bancas | HQs, Figurinhas e Cultura",
    description: "Artigos sobre bancas de jornal, HQs, figurinhas e coleções. Dicas exclusivas para colecionadores.",
    url: "https://www.guiadasbancas.com.br/blog",
    siteName: "Guia das Bancas",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "https://www.guiadasbancas.com.br/og-blog.jpg",
        width: 1200,
        height: 630,
        alt: "Blog Guia das Bancas - Dicas sobre HQs, figurinhas e bancas de jornal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog Guia das Bancas | HQs, Figurinhas e Cultura",
    description: "Artigos sobre bancas de jornal, HQs, figurinhas e coleções.",
    creator: "@guiadasbancas",
    site: "@guiadasbancas",
  },
  alternates: {
    canonical: "https://www.guiadasbancas.com.br/blog",
  },
};

// Componente de Card do Post
function PostCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  return (
    <article 
      className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 ${
        featured ? "md:col-span-2 md:grid md:grid-cols-2" : ""
      }`}
    >
      <Link href={`/blog/${post.slug}`} className="block relative aspect-video overflow-hidden">
        <Image
          src={post.coverImage}
          alt={post.coverImageAlt}
          fill
          sizes={featured ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-[#ff5c00] text-white text-xs font-semibold rounded-full">
            {post.category}
          </span>
        </div>
      </Link>
      
      <div className={`p-6 ${featured ? "flex flex-col justify-center" : ""}`}>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <time dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString("pt-BR", {
              day: "numeric",
              month: "long",
              year: "numeric"
            })}
          </time>
          <span>•</span>
          <span>{post.readTime} min de leitura</span>
        </div>
        
        <Link href={`/blog/${post.slug}`}>
          <h2 className={`font-bold text-gray-900 group-hover:text-[#ff5c00] transition-colors mb-3 ${
            featured ? "text-2xl md:text-3xl" : "text-xl"
          }`}>
            {post.title}
          </h2>
        </Link>
        
        <p className={`text-gray-600 mb-4 ${featured ? "text-base" : "text-sm"} line-clamp-3`}>
          {post.excerpt}
        </p>
        
        <div className="flex items-center gap-3">
          <div className="relative h-8 w-8 rounded-full overflow-hidden bg-gray-100">
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              fill
              sizes="32px"
              className="object-cover"
            />
          </div>
          <span className="text-sm font-medium text-gray-700">{post.author.name}</span>
        </div>
      </div>
    </article>
  );
}

// Componente de Categoria
function CategoryFilter({ categories, selected }: { categories: string[]; selected?: string }) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <Link
        href="/blog"
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          !selected 
            ? "bg-[#ff5c00] text-white" 
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        Todos
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat}
          href={`/blog?categoria=${encodeURIComponent(cat)}`}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selected === cat 
              ? "bg-[#ff5c00] text-white" 
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {cat}
        </Link>
      ))}
    </div>
  );
}

export default function BlogPage({
  searchParams,
}: {
  searchParams: { categoria?: string };
}) {
  const allPosts = getAllPosts();
  const categories = getAllCategories();
  const selectedCategory = searchParams.categoria;
  
  const posts = selectedCategory
    ? allPosts.filter(p => p.category === selectedCategory)
    : allPosts;
  
  const [featuredPost, ...otherPosts] = posts;

  // Schema.org Blog completo para SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": "https://www.guiadasbancas.com.br/blog#blog",
    "name": "Blog Guia das Bancas",
    "description": "Dicas, novidades e cultura das bancas de jornal. Artigos sobre HQs, figurinhas, quadrinhos e coleções.",
    "url": "https://www.guiadasbancas.com.br/blog",
    "inLanguage": "pt-BR",
    "publisher": {
      "@type": "Organization",
      "name": "Guia das Bancas",
      "url": "https://www.guiadasbancas.com.br",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.guiadasbancas.com.br/logo.png",
        "width": 512,
        "height": 512
      }
    },
    "blogPost": posts.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "name": post.metaTitle,
      "description": post.metaDescription,
      "datePublished": post.publishedAt,
      "dateModified": post.updatedAt,
      "url": `https://www.guiadasbancas.com.br/blog/${post.slug}`,
      "image": {
        "@type": "ImageObject",
        "url": post.coverImage,
        "caption": post.coverImageAlt
      },
      "author": {
        "@type": "Person",
        "name": post.author.name
      },
      "keywords": post.focusKeyword,
      "articleSection": post.category,
      "wordCount": post.wordCount
    }))
  };

  // Schema.org WebPage
  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": "https://www.guiadasbancas.com.br/blog#webpage",
    "url": "https://www.guiadasbancas.com.br/blog",
    "name": "Blog Guia das Bancas",
    "description": "Artigos sobre bancas de jornal, HQs, figurinhas e coleções",
    "isPartOf": {
      "@type": "WebSite",
      "@id": "https://www.guiadasbancas.com.br#website"
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.guiadasbancas.com.br"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Blog",
          "item": "https://www.guiadasbancas.com.br/blog"
        }
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-block px-4 py-1.5 bg-[#ff5c00]/20 text-[#ff5c00] text-sm font-semibold rounded-full mb-4">
                📰 Blog
              </span>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                Dicas, Novidades e Cultura
              </h1>
              <p className="text-lg text-gray-300">
                Tudo sobre o universo das bancas de jornal: HQs, figurinhas, revistas e muito mais. 
                Conteúdo exclusivo para colecionadores e apaixonados.
              </p>
            </div>
          </div>
        </section>

        {/* Conteúdo */}
        <section className="container mx-auto px-4 max-w-6xl py-12">
          {/* Filtro de Categorias */}
          <CategoryFilter categories={categories} selected={selectedCategory} />

          {posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">Nenhum post encontrado nesta categoria.</p>
              <Link href="/blog" className="text-[#ff5c00] font-medium hover:underline mt-2 inline-block">
                Ver todos os posts
              </Link>
            </div>
          ) : (
            <>
              {/* Post em Destaque */}
              {featuredPost && (
                <div className="mb-12">
                  <PostCard post={featuredPost} featured />
                </div>
              )}

              {/* Grid de Posts */}
              {otherPosts.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {otherPosts.map((post) => (
                    <PostCard key={post.slug} post={post} />
                  ))}
                </div>
              )}
            </>
          )}
        </section>

        {/* CTA Newsletter */}
        <section className="bg-[#ff5c00] py-16">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Receba novidades no seu e-mail
            </h2>
            <p className="text-white/90 mb-6">
              Cadastre-se para receber dicas exclusivas, lançamentos e promoções das bancas.
            </p>
            <Link
              href="/#newsletter"
              className="inline-flex items-center gap-2 bg-white text-[#ff5c00] px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Cadastrar agora
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
