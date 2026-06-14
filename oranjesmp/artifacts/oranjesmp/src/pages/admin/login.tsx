import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useLogin, useGetMe, getGetMeQueryKey } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import bgImage from "@assets/achtergrondbegin_1781461308552.png";

export default function AdminLogin() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const { data: user } = useGetMe({ query: { queryKey: getGetMeQueryKey(), retry: false } });
  const loginMutation = useLogin();

  useEffect(() => {
    if (user) {
      setLocation("/admin");
    }
  }, [user, setLocation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ data: { username, password } }, {
      onSuccess: () => {
        toast({ title: "Succesvol ingelogd", description: "Welkom terug!" });
        setLocation("/admin");
      },
      onError: () => {
        toast({ title: "Inloggen mislukt", description: "Onjuiste gebruikersnaam of wachtwoord", variant: "destructive" });
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        <img src={bgImage} alt="Background" className="w-full h-full object-cover opacity-20" />
      </div>
      
      <div className="w-full max-w-md p-8 bg-card/90 backdrop-blur-xl border border-white/10 rounded-2xl z-10 shadow-2xl">
        <div className="text-center mb-8">
          <img src="/favicon.svg" alt="OranjeSMP" className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-3xl font-black text-white tracking-tight">Admin Panel</h2>
          <p className="text-muted-foreground mt-2">Log in om de server te beheren</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Gebruikersnaam</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded-lg bg-background border border-white/10 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Wachtwoord</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-background border border-white/10 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loginMutation.isPending}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold text-lg hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(234,88,12,0.3)] disabled:opacity-50"
          >
            {loginMutation.isPending ? "Bezig met inloggen..." : "Inloggen"}
          </button>
        </form>
      </div>
    </div>
  );
}
