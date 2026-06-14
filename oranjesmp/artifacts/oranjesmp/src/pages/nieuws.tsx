import PublicLayout from "@/components/layout/public-layout";
import { useGetNews, getGetNewsQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import bgImage from "@assets/achtergrond.pnt_1781461308551.webp";
import { Sparkles, MoveRight } from "lucide-react";

export default function Nieuws() {
  const { data: newsData } = useGetNews({}, { query: { queryKey: getGetNewsQueryKey({}) } });

  return (
    <PublicLayout>
      <div className="relative min-h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={bgImage} alt="Achtergrond" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white drop-shadow-lg mb-4">Nieuws</h1>
          <p className="text-xl text-primary font-medium">Updates, events en aankondigingen</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="max-w-5xl mx-auto">
          {newsData?.articles && newsData.articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {newsData.articles.map(article => (
                <Link key={article.id} href={`/nieuws/${article.id}`} className="block group">
                  <div className="bg-card rounded-xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all h-full flex flex-col">
                    {article.imageUrl ? (
                      <div className="h-48 overflow-hidden">
                        <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    ) : (
                      <div className="h-48 bg-secondary flex items-center justify-center text-muted-foreground">
                        <Sparkles className="w-12 h-12 opacity-20" />
                      </div>
                    )}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                        {article.category && <span className="px-2 py-1 bg-primary/10 text-primary rounded-md">{article.category}</span>}
                        <span>{new Date(article.publishedAt || article.createdAt).toLocaleDateString('nl-NL')}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">{article.title}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">{article.excerpt || article.content}</p>
                      <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                        Lees meer <MoveRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-12">
              <p>Geen nieuwsartikelen gevonden.</p>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
