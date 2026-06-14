import { useGetSettings, getGetSettingsQueryKey, useGetNews, getGetNewsQueryKey, useGetRanks, getGetRanksQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Copy, Users, Swords, Trophy, Sparkles, MoveRight, Check } from "lucide-react";
import heroBg from "@assets/achtergrondbegin_1781461308552.png";
import logo from "@assets/image_1781462266219.png";
import PublicLayout from "@/components/layout/public-layout";

export default function Home() {
  const { data: settings } = useGetSettings({ query: { queryKey: getGetSettingsQueryKey() } });
  const { data: newsData } = useGetNews({}, { query: { queryKey: getGetNewsQueryKey({}) } });
  const { data: ranksData } = useGetRanks({ query: { queryKey: getGetRanksQueryKey() } });

  const copyIp = () => {
    const ip = settings?.serverIp || "oranjesmp.nl";
    navigator.clipboard.writeText(ip);
  };

  const topRanks = ranksData?.slice(0, 3) ?? [];

  return (
    <PublicLayout>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img src={heroBg} alt="OranjeSMP Hero" className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background"></div>
          </div>

          <div className="container relative z-10 mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium tracking-wide mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              {settings?.currentSeason || "Seizoen 3"}
            </div>

            <div className="flex justify-center mb-8 animate-in fade-in zoom-in-95 duration-1000 delay-150">
              <img
                src={logo}
                alt="OranjeSMP"
                className="w-48 h-48 md:w-64 md:h-64 rounded-2xl object-cover drop-shadow-[0_0_30px_rgba(234,88,12,0.5)]"
              />
            </div>

            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-10 font-light animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
              {settings?.heroSubtitle || "De beste Nederlandse Minecraft SMP server met seizoenen, lore en exclusieve events"}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
              <button
                onClick={copyIp}
                className="group relative px-8 py-4 bg-primary text-primary-foreground text-lg font-bold uppercase tracking-wider rounded-lg overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(234,88,12,0.4)] flex items-center gap-3"
              >
                <span className="absolute inset-0 w-full h-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
                <span className="relative flex items-center gap-3">
                  Kopieer IP <Copy className="w-5 h-5" />
                </span>
              </button>

              <Link
                href="/ranks"
                className="px-8 py-4 bg-transparent text-white text-lg font-bold uppercase tracking-wider rounded-lg border border-primary/50 transition-all hover:bg-primary/10 hover:border-primary flex items-center gap-3"
              >
                Ranks Bekijken <MoveRight className="w-5 h-5" />
              </Link>

              <a
                href={settings?.discordUrl || "https://discord.gg/h8SKf34aB"}
                target="_blank"
                rel="noreferrer"
                className="px-8 py-4 bg-secondary text-secondary-foreground text-lg font-bold uppercase tracking-wider rounded-lg border border-white/5 transition-all hover:bg-white/10 flex items-center gap-3"
              >
                Join Discord
              </a>
            </div>

            <div className="mt-8 text-muted-foreground font-mono text-sm">
              IP: <span className="text-white font-bold">{settings?.serverIp || "oranjesmp.nl"}</span>
            </div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="py-24 bg-background relative z-10">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card p-8 rounded-xl border border-white/5 hover:border-primary/50 transition-colors group">
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Hechte Community</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Een actieve en gezellige Nederlandse community. Ontmoet nieuwe vrienden en bouw samen aan gigantische projecten.
                </p>
              </div>

              <div className="bg-card p-8 rounded-xl border border-white/5 hover:border-primary/50 transition-colors group">
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <Swords className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Diepe Lore</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Ontdek verborgen geheimen, sluit je aan bij facties en schrijf geschiedenis in onze seizoensgebonden verhaallijnen.
                </p>
              </div>

              <div className="bg-card p-8 rounded-xl border border-white/5 hover:border-primary/50 transition-colors group">
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <Trophy className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Unieke Events</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Doe mee aan wekelijkse events, toernooien en boss fights voor exclusieve beloningen en bragging rights.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Ranks Preview */}
        {topRanks.length > 0 && (
          <section className="py-24 bg-card/30 relative z-10">
            <div className="container mx-auto px-6">
              <div className="text-center mb-14">
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-4">
                  Support de Server
                </h2>
                <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                  Koop een rank en krijg toegang tot exclusieve voordelen, cosmetics en events.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {topRanks.map((rank) => (
                  <div
                    key={rank.id}
                    className="bg-card rounded-xl border border-white/10 hover:border-primary/40 transition-all p-6 flex flex-col"
                    style={{ borderTopColor: rank.color || undefined, borderTopWidth: "3px" }}
                  >
                    <h3
                      className="text-2xl font-black uppercase tracking-wider mb-2"
                      style={{ color: rank.color || "#fff" }}
                    >
                      {rank.name}
                    </h3>
                    <p className="text-3xl font-bold text-white mb-4">
                      €{parseFloat(String(rank.price)).toFixed(2)}
                    </p>
                    <p className="text-muted-foreground text-sm mb-4 flex-1">{rank.description}</p>
                    <ul className="space-y-2 mb-6">
                      {(rank.features as string[])?.slice(0, 3).map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                          <Check className="w-4 h-4 text-primary flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <Link
                  href="/ranks"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold uppercase tracking-wider rounded-lg hover:scale-105 hover:shadow-[0_0_30px_rgba(234,88,12,0.4)] transition-all"
                >
                  Bekijk Alle Ranks <MoveRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Latest News */}
        {newsData?.articles && newsData.articles.length > 0 && (
          <section className="py-24 bg-background relative z-10">
            <div className="container mx-auto px-6">
              <div className="flex justify-between items-end mb-12">
                <div>
                  <h2 className="text-4xl font-black uppercase tracking-tight text-white mb-2">Laatste Nieuws</h2>
                  <p className="text-muted-foreground">Blijf op de hoogte van updates en events</p>
                </div>
                <Link href="/nieuws" className="hidden sm:flex items-center gap-2 text-primary hover:text-white transition-colors font-medium">
                  Bekijk alles <MoveRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {newsData.articles.slice(0, 3).map(article => (
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

              <div className="mt-8 text-center sm:hidden">
                <Link href="/nieuws" className="inline-flex items-center gap-2 text-primary hover:text-white transition-colors font-medium">
                  Bekijk alles <MoveRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>
    </PublicLayout>
  );
}
