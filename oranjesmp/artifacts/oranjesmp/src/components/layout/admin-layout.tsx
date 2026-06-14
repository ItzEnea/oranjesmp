import { ReactNode, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useGetMe, getGetMeQueryKey, useLogout } from "@workspace/api-client-react";
import { LayoutDashboard, ShoppingCart, Users, Settings, CreditCard, Newspaper, Crown, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [location, setLocation] = useLocation();
  const { data: user, isLoading } = useGetMe({ query: { queryKey: getGetMeQueryKey(), retry: false } });
  const logout = useLogout();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/admin/login");
    }
  }, [user, isLoading, setLocation]);

  if (isLoading || !user) return <div className="min-h-screen flex items-center justify-center bg-background"><div className="text-primary font-bold animate-pulse">Loading...</div></div>;

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        setLocation("/admin/login");
      },
      onError: () => {
        toast({ title: "Logout mislukt", variant: "destructive" });
      }
    });
  };

  const navLinks = [
    { href: "/admin", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { href: "/admin/ranks", label: "Ranks", icon: <Crown className="w-5 h-5" /> },
    { href: "/admin/nieuws", label: "Nieuws", icon: <Newspaper className="w-5 h-5" /> },
    { href: "/admin/shop", label: "Shop", icon: <ShoppingCart className="w-5 h-5" /> },
    { href: "/admin/betalingen", label: "Betalingen", icon: <CreditCard className="w-5 h-5" /> },
    { href: "/admin/team", label: "Team", icon: <Users className="w-5 h-5" /> },
    { href: "/admin/gebruikers", label: "Gebruikers", icon: <Users className="w-5 h-5" /> },
    { href: "/admin/instellingen", label: "Instellingen", icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <aside className="w-64 border-r border-white/5 bg-card flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-primary tracking-wider">ORANJE SMP</h2>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">Admin Panel</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link 
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                    location === link.href || (location.startsWith(link.href) && link.href !== '/admin')
                      ? "bg-primary/10 text-primary font-medium" 
                      : "text-muted-foreground hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">{user.username}</div>
            <button 
              onClick={handleLogout}
              className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
              title="Uitloggen"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
      <main className="flex-1 ml-64 p-8 min-h-screen bg-background">
        {user.mustChangePassword && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg flex items-center justify-between">
            <div>
              <strong className="font-bold block">Let op!</strong>
              <span>Je gebruikt nog het standaard wachtwoord. Wijzig dit zo snel mogelijk.</span>
            </div>
            <Link href="/admin/instellingen" className="px-4 py-2 bg-destructive text-destructive-foreground font-medium rounded-md hover:bg-destructive/90 transition-colors">
              Wijzig wachtwoord
            </Link>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
