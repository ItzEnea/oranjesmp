import PublicLayout from "@/components/layout/public-layout";
import { useGetNewsArticle, getGetNewsArticleQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import bgImage from "@assets/achtergrond.pnt_1781461308551.webp";
import { MoveLeft, Sparkles } from "lucide-react";

export default function NieuwsDetail({ params }: { params: { id: string } }) {
  const articleId = parseInt(params.id);
  const { data: article, isLoading } = useGetNewsArticle(articleId, { query: { queryKey: getGetNewsArticleQueryKey(articleId), enabled: !isNaN(articleId) } });

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-primary font-bold animate-pulse">Laden...</div>
        </div>
      </PublicLayout>
    );
  }

  if (!article) {
    return (
      <PublicLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Artikel niet gevonden</h2>
          <Link href="/nieuws" className="text-primary hover:underline">Terug naar nieuws</Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="relative min-h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={article.imageUrl || bgImage} alt={article.title} className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 relative z-10 -mt-32">
        <div className="max-w-3xl mx-auto">
          <Link href="/nieuws" className="inline-flex items-center gap-2 text-primary hover:text-white transition-colors mb-8 font-medium">
            <MoveLeft className="w-4 h-4" /> Terug naar overzicht
          </Link>

          <div className="bg-card rounded-2xl border border-white/5 overflow-hidden">
            {article.imageUrl && (
              <img src={article.imageUrl} alt={article.title} className="w-full h-64 md:h-96 object-cover" />
            )}
            <div className="p-8 md:p-12">
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                {article.category && <span className="px-3 py-1 bg-primary/10 text-primary rounded-md font-medium">{article.category}</span>}
                <span>{new Date(article.publishedAt || article.createdAt).toLocaleDateString('nl-NL')}</span>
                {article.authorName && <span>Door: <strong className="text-white">{article.authorName}</strong></span>}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-8">
                {article.title}
              </h1>

              <div className="prose prose-invert prose-orange max-w-none">
                {article.content.split('\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
