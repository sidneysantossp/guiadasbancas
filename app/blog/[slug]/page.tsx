import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPostBySlug, getRelatedPosts, getAllPosts, BlogPost } from "../posts";
import ShareButtons from "@/components/blog/ShareButtons";
import { marked } from "marked";

type Props = {
  params: { slug: string };
};

// Gera os slugs estáticos para build
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Metadados dinâmicos otimizados para SEO On-Page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: "Post não encontrado | Guia das Bancas",
    };
  }

  // Combina palavra-chave principal com secundárias para keywords
  const allKeywords = [post.focusKeyword, ...post.secondaryKeywords, ...post.tags];

  return {
    title: post.metaTitle, // Title tag otimizado (50-60 caracteres)
    description: post.metaDescription, // Meta description otimizada (150-160 caracteres)
    keywords: [...new Set(allKeywords)], // Remove duplicatas
    authors: [{ name: post.author.name }],
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
      title: post.metaTitle,
      description: post.metaDescription,
      url: `https://www.guiadasbancas.com.br/blog/${post.slug}`,
      siteName: "Guia das Bancas",
      locale: "pt_BR",
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      tags: post.tags,
      section: post.category,
      images: [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.coverImageAlt, // Alt text otimizado para SEO
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle,
      description: post.metaDescription,
      images: [post.coverImage],
      creator: "@guiadasbancas",
      site: "@guiadasbancas",
    },
    alternates: {
      canonical: `https://www.guiadasbancas.com.br/blog/${post.slug}`,
    },
  };
}

// Componente de Post Relacionado
function RelatedPostCard({ post }: { post: BlogPost }) {
  return (
    <article className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
      <Link href={`/blog/${post.slug}`} className="block relative aspect-video overflow-hidden">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </Link>
      <div className="p-4">
        <span className="text-xs font-medium text-[#ff5c00]">{post.category}</span>
        <Link href={`/blog/${post.slug}`}>
          <h3 className="font-semibold text-gray-900 group-hover:text-[#ff5c00] transition-colors mt-1 line-clamp-2">
            {post.title}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 mt-2">{post.readTime} min de leitura</p>
      </div>
    </article>
  );
}

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);
  
  if (!post) {
    notFound();
  }
  
  const relatedPosts = getRelatedPosts(params.slug, 3);

  // Schema.org Article completo para SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `https://www.guiadasbancas.com.br/blog/${post.slug}#article`,
    "headline": post.title,
    "name": post.metaTitle,
    "description": post.metaDescription,
    "image": {
      "@type": "ImageObject",
      "url": post.coverImage,
      "width": 1200,
      "height": 630,
      "caption": post.coverImageAlt
    },
    "datePublished": post.publishedAt,
    "dateModified": post.updatedAt,
    "author": {
      "@type": "Person",
      "name": post.author.name,
      "description": post.author.bio,
      "url": "https://www.guiadasbancas.com.br"
    },
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
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.guiadasbancas.com.br/blog/${post.slug}`
    },
    "keywords": [post.focusKeyword, ...post.secondaryKeywords].join(", "),
    "articleSection": post.category,
    "articleBody": post.content.replace(/<[^>]*>/g, '').trim(),
    "wordCount": post.wordCount,
    "timeRequired": `PT${post.readTime}M`,
    "inLanguage": "pt-BR",
    "isAccessibleForFree": true,
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": ["h1", ".prose h2", ".prose h3"]
    }
  };

  // Breadcrumb Schema
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
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
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": `https://www.guiadasbancas.com.br/blog/${post.slug}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      
      <main className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <nav className="bg-gray-50 border-b border-gray-100">
          <div className="container mx-auto px-4 max-w-4xl py-3">
            <ol className="flex items-center gap-2 text-sm">
              <li>
                <Link href="/" className="text-gray-500 hover:text-[#ff5c00]">Home</Link>
              </li>
              <li className="text-gray-400">/</li>
              <li>
                <Link href="/blog" className="text-gray-500 hover:text-[#ff5c00]">Blog</Link>
              </li>
              <li className="text-gray-400">/</li>
              <li>
                <Link href={`/blog?categoria=${post.category}`} className="text-gray-500 hover:text-[#ff5c00]">
                  {post.category}
                </Link>
              </li>
            </ol>
          </div>
        </nav>

        {/* Header do Post */}
        <header className="container mx-auto px-4 max-w-4xl pt-8 pb-6">
          <div className="flex items-center gap-3 mb-4">
            <Link 
              href={`/blog?categoria=${post.category}`}
              className="px-3 py-1 bg-[#ff5c00]/10 text-[#ff5c00] text-sm font-semibold rounded-full hover:bg-[#ff5c00]/20 transition-colors"
            >
              {post.category}
            </Link>
            <span className="text-gray-400">•</span>
            <time dateTime={post.publishedAt} className="text-gray-500 text-sm">
              {new Date(post.publishedAt).toLocaleDateString("pt-BR", {
                day: "numeric",
                month: "long",
                year: "numeric"
              })}
            </time>
            <span className="text-gray-400">•</span>
            <span className="text-gray-500 text-sm">{post.readTime} min de leitura</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
            {post.title}
          </h1>
          
          <p className="text-xl text-gray-600 mb-6">
            {post.excerpt}
          </p>
          
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{post.author.name}</p>
                <p className="text-sm text-gray-500" title={post.author.bio}>Autor</p>
              </div>
            </div>
            
            <ShareButtons 
              url={`https://www.guiadasbancas.com.br/blog/${post.slug}`}
              title={post.title}
            />
          </div>
        </header>

        {/* Imagem de Capa */}
        <div className="relative w-full aspect-[21/9] max-h-[500px] mb-10">
          <Image
            src={post.coverImage}
            alt={post.coverImageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>

        {/* Conteúdo do Post */}
        <article className="container mx-auto px-4 max-w-3xl">
          <div 
            className="prose prose-lg prose-gray max-w-none
              prose-headings:font-bold prose-headings:text-gray-900
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-gray-600 prose-p:leading-relaxed
              prose-a:text-[#ff5c00] prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900
              prose-ul:my-4 prose-li:text-gray-600
              prose-ol:my-4
              prose-blockquote:border-l-[#ff5c00] prose-blockquote:bg-gray-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
            "
            dangerouslySetInnerHTML={{ __html: marked(post.content) }}
          />
          
          {/* Palavras-chave e Tags para SEO */}
          <div className="mt-10 pt-6 border-t border-gray-200">
            <div className="mb-4">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Palavras-chave</span>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-3 py-1 bg-[#ff5c00]/10 text-[#ff5c00] text-sm font-medium rounded-full">
                  {post.focusKeyword}
                </span>
                {post.secondaryKeywords.slice(0, 3).map((keyword) => (
                  <span
                    key={keyword}
                    className="px-3 py-1 bg-orange-50 text-orange-600 text-sm rounded-full"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tags</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-gray-200 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          
          {/* CTA */}
          <div className="mt-10 p-6 bg-gradient-to-r from-[#ff5c00] to-orange-500 rounded-2xl text-white text-center">
            <h3 className="text-xl font-bold mb-2">Encontre uma banca perto de você!</h3>
            <p className="text-white/90 mb-4">
              Use o Guia das Bancas para descobrir bancas de jornal na sua região.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-white text-[#ff5c00] px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Buscar bancas
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </article>

        {/* Posts Relacionados */}
        {relatedPosts.length > 0 && (
          <section className="container mx-auto px-4 max-w-6xl py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Leia também</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <RelatedPostCard key={relatedPost.slug} post={relatedPost} />
              ))}
            </div>
          </section>
        )}

        {/* Voltar ao Blog */}
        <div className="container mx-auto px-4 max-w-4xl pb-16">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[#ff5c00] font-medium hover:underline"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Voltar ao Blog
          </Link>
        </div>
      </main>
    </>
  );
}
