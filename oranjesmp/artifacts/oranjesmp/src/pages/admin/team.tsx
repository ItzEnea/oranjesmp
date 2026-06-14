import AdminLayout from "@/components/layout/admin-layout";
import { useGetTeamMembers, getGetTeamMembersQueryKey } from "@workspace/api-client-react";

export default function AdminTeam() {
  const { data: members } = useGetTeamMembers({ query: { queryKey: getGetTeamMembersQueryKey() } });

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight">Team Beheren</h1>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors">
          + Teamlid Toevoegen
        </button>
      </div>

      <div className="bg-card border border-white/5 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-background/50 border-b border-white/5 text-muted-foreground text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-medium">Naam</th>
              <th className="px-6 py-4 font-medium">Rol</th>
              <th className="px-6 py-4 font-medium">Minecraft Naam</th>
              <th className="px-6 py-4 font-medium text-right">Acties</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {members && members.length > 0 ? (
              members.map(member => (
                <tr key={member.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-bold text-white">{member.name}</td>
                  <td className="px-6 py-4 text-primary font-medium">{member.role}</td>
                  <td className="px-6 py-4 text-gray-300">{member.minecraftUsername || '-'}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:text-white transition-colors text-sm font-medium">Bewerken</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                  Geen teamleden gevonden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
