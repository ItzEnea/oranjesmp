import PublicLayout from "@/components/layout/public-layout";
import { useGetTeamMembers, getGetTeamMembersQueryKey } from "@workspace/api-client-react";
import bgImage from "@assets/achtergrond.pnt_1781461308551.webp";

export default function OverOns() {
  const { data: teamMembers } = useGetTeamMembers({ query: { queryKey: getGetTeamMembersQueryKey() } });

  return (
    <PublicLayout>
      <div className="relative min-h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={bgImage} alt="Achtergrond" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white drop-shadow-lg mb-4">Over Ons</h1>
          <p className="text-xl text-primary font-medium">De geschiedenis van OranjeSMP</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto space-y-16">
          
          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-white border-b border-white/10 pb-2">Onze Visie</h2>
            <p className="text-gray-300 leading-relaxed text-lg">
              OranjeSMP is ontstaan uit een passie voor puur Minecraft survival, verweven met een vleugje roleplay en een ijzersterke community. We streven ernaar om niet zomaar een server te zijn, maar een thuis voor creatieve bouwers, avonturiers en verhalenvertellers.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-white border-b border-white/10 pb-2">Seizoenen & Lore</h2>
            <div className="grid gap-6">
              <div className="bg-card p-6 rounded-lg border border-white/5">
                <h3 className="text-xl font-bold text-primary mb-2">Seizoen 1: Het Begin</h3>
                <p className="text-gray-400">De grondlegging van de server. Een wilde frontier waar de eerste steden en facties werden gevormd.</p>
              </div>
              <div className="bg-card p-6 rounded-lg border border-white/5">
                <h3 className="text-xl font-bold text-primary mb-2">Seizoen 2: De Oude Oorlog</h3>
                <p className="text-gray-400">Een tijdperk van grote conflicten en allianties, afgesloten met een episch server-breed evenement dat het landschap voorgoed veranderde.</p>
              </div>
              <div className="bg-card p-6 rounded-lg border border-primary/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-bold uppercase rounded-bl-lg">Actueel</div>
                <h3 className="text-xl font-bold text-white mb-2">Seizoen 3: Wederopbouw</h3>
                <p className="text-gray-300">Een nieuwe start. Oude legendes ontwaken. Wat is jouw rol in dit nieuwe tijdperk?</p>
              </div>
            </div>
          </section>

          {teamMembers && teamMembers.length > 0 && (
            <section className="space-y-8 pt-8 border-t border-white/10">
              <h2 className="text-3xl font-bold text-white text-center">Het Team</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {teamMembers.map(member => (
                  <div key={member.id} className="bg-card p-6 rounded-xl border border-white/5 text-center group hover:border-primary/50 transition-colors">
                    <div className="w-24 h-24 mx-auto bg-background rounded-full mb-4 overflow-hidden border-2 border-primary/20 group-hover:border-primary transition-colors">
                      {member.avatarUrl ? (
                        <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                      ) : member.minecraftUsername ? (
                        <img src={`https://mc-heads.net/avatar/${member.minecraftUsername}/100`} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary text-2xl font-bold">{member.name.charAt(0)}</div>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                    <span className="inline-block px-3 py-1 bg-white/5 text-primary text-xs font-medium rounded-full mb-3">{member.role}</span>
                    {member.description && (
                      <p className="text-sm text-gray-400">{member.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </PublicLayout>
  );
}
