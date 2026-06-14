import PublicLayout from "@/components/layout/public-layout";
import { useGetSettings, getGetSettingsQueryKey } from "@workspace/api-client-react";
import bgImage from "@assets/achtergrond.pnt_1781461308551.webp";
import { Mail, MessageSquare } from "lucide-react";

export default function Contact() {
  const { data: settings } = useGetSettings({ query: { queryKey: getGetSettingsQueryKey() } });

  return (
    <PublicLayout>
      <div className="relative min-h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={bgImage} alt="Achtergrond" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white drop-shadow-lg mb-4">Contact</h1>
          <p className="text-xl text-primary font-medium">Hulp nodig? Wij staan klaar.</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-card p-8 rounded-xl border border-white/5 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-[#5865F2]/20 rounded-full flex items-center justify-center text-[#5865F2] mb-6">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Discord Support</h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              De snelste manier om in contact te komen met ons team is via onze Discord server. Maak een ticket aan in het kanaal #support.
            </p>
            <a 
              href={settings?.discordUrl || "https://discord.gg/h8SKf34aB"} 
              target="_blank" 
              rel="noreferrer"
              className="mt-auto px-8 py-4 bg-[#5865F2] text-white font-bold rounded-lg hover:bg-[#4752C4] transition-colors w-full"
            >
              Join onze Discord
            </a>
          </div>

          <div className="bg-card p-8 rounded-xl border border-white/5 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-6">
              <Mail className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Zakelijk Contact</h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Voor zakelijke vragen, samenwerkingen of andere zaken die niet via Discord afgehandeld kunnen worden, kun je ons mailen.
            </p>
            <a 
              href={`mailto:${settings?.contactEmail || "contact@oranjesmp.nl"}`}
              className="mt-auto px-8 py-4 bg-secondary border border-white/10 text-white font-bold rounded-lg hover:bg-white/5 transition-colors w-full"
            >
              Email ons
            </a>
          </div>

        </div>
      </div>
    </PublicLayout>
  );
}
