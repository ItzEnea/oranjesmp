import AdminLayout from "@/components/layout/admin-layout";
import { useGetRanks, getGetRanksQueryKey } from "@workspace/api-client-react";

export default function AdminRanks() {
  const { data: ranks } = useGetRanks({ query: { queryKey: getGetRanksQueryKey() } });

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight">Ranks Beheren</h1>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors">
          + Nieuwe Rank
        </button>
      </div>

      <div className="bg-card border border-white/5 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-background/50 border-b border-white/5 text-muted-foreground text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-medium">Naam</th>
              <th className="px-6 py-4 font-medium">Prijs</th>
              <th className="px-6 py-4 font-medium">Kleur</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Acties</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {ranks && ranks.length > 0 ? (
              ranks.map(rank => (
                <tr key={rank.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: rank.color || '#fff' }}></div>
                      <span className="font-bold text-white">{rank.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">€{rank.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-gray-300 font-mono text-sm">{rank.color || 'Geen'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${rank.isActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-destructive/10 text-destructive'}`}>
                      {rank.isActive ? 'Actief' : 'Inactief'}
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
                  Geen ranks gevonden. Maak er een aan!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
