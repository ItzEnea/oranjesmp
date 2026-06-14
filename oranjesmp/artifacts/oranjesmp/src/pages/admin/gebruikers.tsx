import AdminLayout from "@/components/layout/admin-layout";
import { useGetAdminUsers, getGetAdminUsersQueryKey } from "@workspace/api-client-react";

export default function AdminGebruikers() {
  const { data: users } = useGetAdminUsers({ query: { queryKey: getGetAdminUsersQueryKey() } });

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight">Beheerders</h1>
      </div>

      <div className="bg-card border border-white/5 rounded-xl overflow-hidden max-w-4xl">
        <table className="w-full text-left">
          <thead className="bg-background/50 border-b border-white/5 text-muted-foreground text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-medium">Gebruikersnaam</th>
              <th className="px-6 py-4 font-medium">Rol</th>
              <th className="px-6 py-4 font-medium text-right">Acties</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users && users.length > 0 ? (
              users.map(user => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-bold text-white">
                    {user.username}
                    {user.mustChangePassword && <span className="ml-3 px-2 py-0.5 bg-destructive/10 text-destructive text-xs rounded-full">Nieuw</span>}
                  </td>
                  <td className="px-6 py-4 text-gray-300 capitalize">{user.role}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:text-white transition-colors text-sm font-medium">Wachtwoord Reset</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">
                  Geen gebruikers gevonden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
