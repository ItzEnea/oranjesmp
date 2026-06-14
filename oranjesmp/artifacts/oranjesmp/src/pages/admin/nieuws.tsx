import AdminLayout from "@/components/layout/admin-layout";
import { useGetAllNews, getGetAllNewsQueryKey } from "@workspace/api-client-react";

export default function AdminNieuws() {
  const { data: newsData } = useGetAllNews({ query: { queryKey: getGetAllNewsQueryKey() } });

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight">Nieuws Beheren</h1>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors">
          + Nieuw Artikel
        </button>
      </div>

      <div className="bg-card border border-white/5 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-background/50 border-b border-white/5 text-muted-foreground text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-medium">Titel</th>
              <th className="px-6 py-4 font-medium">Categorie</th>
              <th className="px-6 py-4 font-medium">Datum</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Acties</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {newsData?.articles && newsData.articles.length > 0 ? (
              newsData.articles.map(article => (
                <tr key={article.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-bold text-white">{article.title}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{article.category || '-'}</td>
                  <td className="px-6 py-4 text-gray-300">{new Date(article.createdAt).toLocaleDateString('nl-NL')}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${article.status === 'published' ? 'bg-primary/10 text-primary' : 'bg-secondary text-gray-400'}`}>
                      {article.status === 'published' ? 'Gepubliceerd' : 'Draft'}
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
                  Geen nieuwsartikelen gevonden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
