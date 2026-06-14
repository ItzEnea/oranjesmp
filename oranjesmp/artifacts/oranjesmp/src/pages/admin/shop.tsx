import AdminLayout from "@/components/layout/admin-layout";
import { useGetAllProducts, getGetAllProductsQueryKey } from "@workspace/api-client-react";

export default function AdminShop() {
  const { data: products } = useGetAllProducts({ query: { queryKey: getGetAllProductsQueryKey() } });

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight">Shop Beheren</h1>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors">
          + Nieuw Product
        </button>
      </div>

      <div className="bg-card border border-white/5 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-background/50 border-b border-white/5 text-muted-foreground text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-medium">Naam</th>
              <th className="px-6 py-4 font-medium">Prijs</th>
              <th className="px-6 py-4 font-medium">Type</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Acties</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products && products.length > 0 ? (
              products.map(product => (
                <tr key={product.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-bold text-white">{product.name}</td>
                  <td className="px-6 py-4 text-gray-300">€{product.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-gray-300">
                    <span className="px-2 py-1 bg-white/5 text-xs rounded-full">{product.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${product.isActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-destructive/10 text-destructive'}`}>
                      {product.isActive ? 'Actief' : 'Inactief'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:text-white transition-colors text-sm font-medium">Bewerken</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                  Geen producten gevonden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
