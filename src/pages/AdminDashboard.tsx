import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, gigs: 0, orders: 0, revenue: 0 });
  const [gigs, setGigs] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [tab, setTab] = useState<"gigs" | "orders" | "users">("gigs");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [profilesRes, gigsRes, ordersRes] = await Promise.all([
        supabase.from("profiles").select("*"),
        supabase.from("gigs").select("*"),
        supabase.from("orders").select("*"),
      ]);

      const allOrders = ordersRes.data ?? [];
      const revenue = allOrders
        .filter(o => o.is_completed)
        .reduce((sum, o) => sum + Number(o.price), 0);

      setUsers(profilesRes.data ?? []);
      setGigs(gigsRes.data ?? []);
      setOrders(allOrders);
      setStats({
        users: profilesRes.data?.length ?? 0,
        gigs: gigsRes.data?.length ?? 0,
        orders: allOrders.length,
        revenue,
      });
      setLoading(false);
    }
    load();
  }, []);

  async function deleteGig(id: string) {
    await supabase.from("gigs").delete().eq("id", id);
    setGigs(prev => prev.filter(g => g.id !== id));
  }

  async function markComplete(id: string) {
    await supabase.from("orders").update({ is_completed: true }).eq("id", id);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, is_completed: true } : o));
  }

  if (loading) return <div className="p-8">Loading admin data...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-6">Campus Gigverse — Platform Overview</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Users" value={stats.users} color="blue" />
        <StatCard label="Total Gigs" value={stats.gigs} color="purple" />
        <StatCard label="Total Orders" value={stats.orders} color="orange" />
        <StatCard label="Revenue" value={`₹${stats.revenue}`} color="green" />
      </div>

      <div className="flex gap-2 mb-4">
        {(["gigs", "orders", "users"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize border transition ${
              tab === t
                ? "bg-primary text-primary-foreground border-primary"
                : "border-muted-foreground text-muted-foreground hover:bg-muted"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "gigs" && (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted text-left">
              <th className="border p-2">Title</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Seller</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Sales</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {gigs.map(g => (
              <tr key={g.id} className="hover:bg-muted/40">
                <td className="border p-2">{g.title}</td>
                <td className="border p-2">{g.category}</td>
                <td className="border p-2">{g.seller_name}</td>
                <td className="border p-2">₹{g.price}</td>
                <td className="border p-2">{g.sales}</td>
                <td className="border p-2">
                  <button
                    onClick={() => deleteGig(g.id)}
                    className="text-red-500 hover:underline text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {tab === "orders" && (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted text-left">
              <th className="border p-2">Gig</th>
              <th className="border p-2">Buyer</th>
              <th className="border p-2">Seller</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="hover:bg-muted/40">
                <td className="border p-2">{o.title}</td>
                <td className="border p-2">{o.buyer_name}</td>
                <td className="border p-2">{o.seller_name}</td>
                <td className="border p-2">₹{o.price}</td>
                <td className="border p-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    o.is_completed
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {o.is_completed ? "Completed" : "In Progress"}
                  </span>
                </td>
                <td className="border p-2">
                  {!o.is_completed && (
                    <button
                      onClick={() => markComplete(o.id)}
                      className="text-green-600 hover:underline text-xs"
                    >
                      Mark Complete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {tab === "users" && (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted text-left">
              <th className="border p-2">Name</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="hover:bg-muted/40">
                <td className="border p-2">{u.full_name || "—"}</td>
                <td className="border p-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    u.role === "admin"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="border p-2">
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: any; color: string }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    green: "bg-green-50 border-green-200 text-green-700",
    purple: "bg-purple-50 border-purple-200 text-purple-700",
    orange: "bg-orange-50 border-orange-200 text-orange-700",
  };
  return (
    <div className={`border rounded-xl p-4 ${colors[color]}`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm mt-1">{label}</p>
    </div>
  );
}