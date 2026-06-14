import AdminLayout from "@/components/layout/admin-layout";
import { useGetSettings, getGetSettingsQueryKey } from "@workspace/api-client-react";

export default function AdminInstellingen() {
  const { data: settings } = useGetSettings({ query: { queryKey: getGetSettingsQueryKey() } });

  return (
    <AdminLayout>
      <h1 className="text-3xl font-black text-white tracking-tight mb-8">Instellingen</h1>

      {settings && (
        <div className="bg-card border border-white/5 rounded-xl overflow-hidden p-8 max-w-3xl">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Server Naam</label>
                <input type="text" defaultValue={settings.serverName} className="w-full p-3 rounded-lg bg-background border border-white/10 text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Server IP</label>
                <input type="text" defaultValue={settings.serverIp} className="w-full p-3 rounded-lg bg-background border border-white/10 text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Huidig Seizoen</label>
                <input type="text" defaultValue={settings.currentSeason} className="w-full p-3 rounded-lg bg-background border border-white/10 text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Discord URL</label>
                <input type="text" defaultValue={settings.discordUrl} className="w-full p-3 rounded-lg bg-background border border-white/10 text-white" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-300">Hero Titel</label>
                <input type="text" defaultValue={settings.heroTitle || ""} className="w-full p-3 rounded-lg bg-background border border-white/10 text-white" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-300">Hero Subtitel</label>
                <textarea defaultValue={settings.heroSubtitle || ""} className="w-full p-3 rounded-lg bg-background border border-white/10 text-white" rows={3} />
              </div>
            </div>
            <button type="button" className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-bold hover:bg-primary/90 transition-colors">
              Opslaan
            </button>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}
