import AdminLayout from "@/components/layout/admin-layout";
import { useGetDashboardStats, getGetDashboardStatsQueryKey, useGetRecentActivity, getGetRecentActivityQueryKey } from "@workspace/api-client-react";
import { Users, Crown, ShoppingCart, Newspaper, Activity } from "lucide-react";

export default function AdminDashboard() {
  const { data: stats } = useGetDashboardStats({ query: { queryKey: getGetDashboardStatsQueryKey() } });
  const { data: activities } = useGetRecentActivity({ query: { queryKey: getGetRecentActivityQueryKey() } });

  return (
    <AdminLayout>
      <h1 className="text-3xl font-black text-white mb-8 tracking-tight">Dashboard</h1>
      
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-card p-6 rounded-xl border border-white/5 flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-lg">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Totaal Ranks</p>
              <p className="text-2xl font-bold text-white">{stats.totalRanks}</p>
            </div>
          </div>
          <div className="bg-card p-6 rounded-xl border border-white/5 flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Producten</p>
              <p className="text-2xl font-bold text-white">{stats.totalProducts}</p>
            </div>
          </div>
          <div className="bg-card p-6 rounded-xl border border-white/5 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-lg">
              <Newspaper className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nieuws Artikelen</p>
              <p className="text-2xl font-bold text-white">{stats.publishedNewsArticles} / {stats.totalNewsArticles}</p>
            </div>
          </div>
          <div className="bg-card p-6 rounded-xl border border-white/5 flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 text-purple-500 rounded-lg">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Recente Orders</p>
              <p className="text-2xl font-bold text-white">{stats.recentOrdersCount}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-card border border-white/5 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" /> Recente Activiteit
          </h2>
        </div>
        <div className="p-0">
          {activities && activities.length > 0 ? (
            <div className="divide-y divide-white/5">
              {activities.map(activity => (
                <div key={activity.id} className="p-4 px-6 flex justify-between items-center hover:bg-white/5 transition-colors">
                  <div>
                    <p className="text-sm text-white font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground mt-1">door <span className="text-primary">{activity.adminUsername}</span></p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(activity.createdAt).toLocaleString('nl-NL')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              Geen recente activiteit gevonden.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
