import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Settings } from "lucide-react";
import logo from "@assets/image_1781462266219.png";

export default function PublicLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/over-ons", label: "Over Ons" },
    { href: "/ranks", label: "Ranks" },
    { href: "/shop", label: "Shop" },
    { href: "/nieuws", label: "Nieuws" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="fixed top-0 w-full z-50 py-3 px-6 md:px-12 flex justify-between items-center bg-background/80 backdrop-blur-md border-b border-white/5">
        <Link href="/" className="flex items-center gap-3">
          <img src={logo} alt="OranjeSMP" className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover" />
          <span className="font-bold text-lg md:text-xl tracking-wider text-white">OranjeSMP</span>
        </Link>

        <nav className="hidden md:flex gap-8 text-sm font-medium items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors hover:text-primary ${location === link.href ? "text-primary font-bold" : "text-gray-300"}`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/admin/login"
            className="ml-2 px-4 py-2 bg-primary/10 border border-primary/30 text-primary text-sm font-semibold rounded-lg hover:bg-primary hover:text-white transition-all flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Admin
          </Link>
        </nav>

        <button
          className="md:hidden text-gray-300 hover:text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-md flex flex-col items-center justify-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-2xl font-bold uppercase tracking-wider transition-colors hover:text-primary ${location === link.href ? "text-primary" : "text-gray-300"}`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/admin/login"
            className="px-6 py-3 bg-primary text-white font-bold rounded-lg flex items-center gap-2"
            onClick={() => setMobileOpen(false)}
          >
            <Settings className="w-5 h-5" />
            Admin Panel
          </Link>
        </div>
      )}

      <main className="flex-1 w-full">
        {children}
      </main>

      <footer className="py-10 bg-card border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <img src={logo} alt="OranjeSMP" className="w-10 h-10 rounded-lg object-cover" />
              <span className="font-bold text-white tracking-wider">OranjeSMP</span>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="hover:text-primary transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="text-muted-foreground text-sm text-center md:text-right flex flex-col items-end gap-3">
              <p>&copy; {new Date().getFullYear()} OranjeSMP</p>
              <p className="text-xs">Niet geaffilieerd met Mojang AB</p>
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 text-primary text-sm font-semibold rounded-lg hover:bg-primary hover:text-white transition-all"
              >
                <Settings className="w-4 h-4" />
                Admin Panel
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
