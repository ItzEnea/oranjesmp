import PublicLayout from "@/components/layout/public-layout";
import { useGetProducts, getGetProductsQueryKey, useGetPaymentMethods, getGetPaymentMethodsQueryKey } from "@workspace/api-client-react";
import bgImage from "@assets/achtergrond.pnt_1781461308551.webp";
import { ShoppingCart, CreditCard } from "lucide-react";

export default function Shop() {
  const { data: products } = useGetProducts({ query: { queryKey: getGetProductsQueryKey() } });
  const { data: paymentMethods } = useGetPaymentMethods({ query: { queryKey: getGetPaymentMethodsQueryKey() } });

  return (
    <PublicLayout>
      <div className="relative min-h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={bgImage} alt="Achtergrond" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white drop-shadow-lg mb-4">Shop</h1>
          <p className="text-xl text-primary font-medium">Cosmetics, sleutels en meer</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="max-w-6xl mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {products && products.length > 0 ? (
              products.map((product) => (
                <div key={product.id} className="bg-card rounded-xl border border-white/5 overflow-hidden group hover:border-primary/50 transition-colors">
                  <div className="h-48 bg-background relative flex items-center justify-center border-b border-white/5">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <ShoppingCart className="w-16 h-16 text-muted-foreground opacity-20" />
                    )}
                    <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase">
                      {product.type}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{product.name}</h3>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-2xl font-black text-primary">€{product.price.toFixed(2)}</span>
                      {product.originalPrice && (
                        <span className="text-muted-foreground line-through text-sm">€{product.originalPrice.toFixed(2)}</span>
                      )}
                    </div>
                    {product.description && (
                      <p className="text-gray-400 text-sm mb-6 line-clamp-2">{product.description}</p>
                    )}
                    <button className="w-full py-3 bg-white/5 text-white font-medium rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center gap-2">
                      <ShoppingCart className="w-4 h-4" /> Toevoegen aan winkelwagen
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-muted-foreground py-12">
                <p>Er zijn momenteel geen producten beschikbaar in de shop.</p>
              </div>
            )}
          </div>

          <div className="bg-card p-8 rounded-xl border border-white/5">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
              <CreditCard className="text-primary" /> Betaalmethodes
            </h2>
            <div className="flex flex-wrap gap-4">
              {paymentMethods && paymentMethods.filter(pm => pm.isActive).length > 0 ? (
                paymentMethods.filter(pm => pm.isActive).map(method => (
                  <div key={method.id} className="px-6 py-3 bg-background border border-white/10 rounded-lg text-white font-medium">
                    {method.name}
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground">Geen betaalmethodes geconfigureerd.</div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </PublicLayout>
  );
}
