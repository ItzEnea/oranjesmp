import PublicLayout from "@/components/layout/public-layout";
import { useGetRanks, getGetRanksQueryKey } from "@workspace/api-client-react";
import bgImage from "@assets/achtergrond.pnt_1781461308551.webp";
import { Check, Info } from "lucide-react";

export default function Ranks() {
  const { data: ranks } = useGetRanks({ query: { queryKey: getGetRanksQueryKey() } });

  return (
    <PublicLayout>
      <div className="relative min-h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={bgImage} alt="Achtergrond" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white drop-shadow-lg mb-4">Ranks</h1>
          <p className="text-xl text-primary font-medium">Support de server & krijg unieke voordelen</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {ranks && ranks.length > 0 ? (
            ranks.map((rank) => (
              <div 
                key={rank.id} 
                className="bg-card rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-2"
                style={{ 
                  borderColor: rank.color ? `${rank.color}40` : 'rgba(255,255,255,0.1)',
                  boxShadow: `0 10px 30px -10px ${rank.color ? `${rank.color}20` : 'transparent'}`
                }}
              >
                <div 
                  className="p-8 text-center border-b"
                  style={{ 
                    backgroundColor: rank.color ? `${rank.color}10` : 'transparent',
                    borderColor: rank.color ? `${rank.color}20` : 'rgba(255,255,255,0.05)'
                  }}
                >
                  <h3 
                    className="text-3xl font-black uppercase tracking-widest mb-2"
                    style={{ color: rank.color || 'white' }}
                  >
                    {rank.name}
                  </h3>
                  <div className="text-3xl font-bold text-white mb-2">€{rank.price.toFixed(2)}</div>
                  {rank.description && <p className="text-muted-foreground text-sm">{rank.description}</p>}
                </div>
                
                <div className="p-8">
                  <ul className="space-y-4 mb-8">
                    {rank.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                        <Check className="w-5 h-5 shrink-0 mt-0.5" style={{ color: rank.color || 'white' }} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <a 
                    href="/shop" 
                    className="block w-full py-4 text-center font-bold uppercase tracking-wider rounded-lg transition-colors"
                    style={{ 
                      backgroundColor: rank.color || 'white', 
                      color: '#111' 
                    }}
                  >
                    Koop {rank.name}
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-muted-foreground py-12">
              <p>Geen ranks gevonden. Probeer het later opnieuw.</p>
            </div>
          )}
        </div>
        
        <div className="mt-16 bg-card/50 border border-white/5 rounded-xl p-8 max-w-4xl mx-auto flex gap-6 items-start">
          <Info className="w-8 h-8 text-primary shrink-0" />
          <div>
            <h4 className="text-xl font-bold text-white mb-2">Belangrijke Informatie</h4>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Alle aankopen zijn definitief. Ranks zijn permanent tenzij anders aangegeven in de productbeschrijving.
              Het kopen van een rank geeft je geen vrijstelling van de server regels. Overtreding van de regels kan leiden tot een ban zonder restitutie.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Zorg dat je online bent op de server wanneer je een aankoop doet, zodat je de perks direct ontvangt.
              Vragen of problemen? Open een ticket in onze Discord.
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
