import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

export default function UserDashboard() {
  const [myGigs, setMyGigs] = useState<any[]>([]);
  const [buyerOrders, setBuyerOrders] = useState<any[]>([]);
  const [sellerOrders, setSellerOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [gigsRes, buyerRes, sellerRes] = await Promise.all([
        supabase.from("gigs").select("*").eq("user_id", user.id),
        supabase.from("orders").select("*").eq("buyer_id", user.id),
        supabase.from("orders").select("*").eq("seller_id", user.id),
      ]);

      setMyGigs(gigsRes.data ?? []);
      setBuyerOrders(buyerRes.data ?? []);
      setSellerOrders(sellerRes.data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  const earnings = sellerOrders
    .filter(o => o.is_completed)
    .reduce((sum, o) => sum + Number(o.price), 0);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="My Gigs" value={myGigs.length} color="blue" />
        <StatCard label="Orders Placed" value={buyerOrders.length} color="purple" />
        <StatCard label="Orders Received" value={sellerOrders.length} color="orange" />
        <StatCard label="Earnings" value={`₹${earnings}`} color="green" />
      </div>

      <Section title="My Gigs">
        {myGigs.length === 0 ? (
          <p className="text-muted-foreground">
            No gigs yet.{" "}
            <Link to="/add" className="text-blue-500 underline">Create one!</Link>
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {myGigs.map(gig => (
              <div key={gig.id} className="border rounded-lg p-4 flex justify-between items-start">
                <div>
                  <p className="font-semibold">{gig.title}</p>
                  <p className="text-sm text-muted-foreground">{gig.category} · ₹{gig.price}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {gig.sales} sales · ⭐{" "}
                    {gig.star_number > 0
                      ? (gig.total_stars / gig.star_number).toFixed(1)
                      : "No ratings"}
                  </p>
                </div>
                <Link to={`/gig/${gig.id}`} className="text-sm text-blue-500 underline">View</Link>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title="Orders I Placed">
        <OrderTable orders={buyerOrders} role="buyer" />
      </Section>

      <Section title="Orders Received">
        <OrderTable orders={sellerOrders} role="seller" />
      </Section>
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-3 border-b pb-1">{title}</h2>
      {children}
    </div>
  );
}

function OrderTable({ orders, role }: { orders: any[]; role: "buyer" | "seller" }) {
  if (orders.length === 0) return <p className="text-muted-foreground">No orders yet.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-muted text-left">
            <th className="border p-2">Gig</th>
            <th className="border p-2">{role === "buyer" ? "Seller" : "Buyer"}</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id} className="hover:bg-muted/50">
              <td className="border p-2">{o.title}</td>
              <td className="border p-2">{role === "buyer" ? o.seller_name : o.buyer_name}</td>
              <td className="border p-2">₹{o.price}</td>
              <td className="border p-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  o.is_completed
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}>
                  {o.is_completed ? "Completed" : "In Progress"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}