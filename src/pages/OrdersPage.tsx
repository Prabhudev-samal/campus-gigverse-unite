import { useAuth } from "@/context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock } from "lucide-react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

const OrdersPage = () => {
  const { currentUser, loading } = useAuth();
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!currentUser,
  });

  const completeMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const { error } = await supabase.from("orders").update({ is_completed: true }).eq("id", orderId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Order marked as complete!");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!loading && !currentUser) return <Navigate to="/login" />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold font-display mb-6">My Orders</h1>
      {isLoading ? (
        <p className="text-muted-foreground">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-center py-12 text-muted-foreground">No orders yet</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="p-5 rounded-lg border bg-card shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-medium">{order.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {order.buyer_id === currentUser?.id ? `Seller: ${order.seller_name}` : `Buyer: ${order.buyer_name}`} · ₹{order.price}
                </p>
                <p className="text-xs text-muted-foreground">Ordered: {new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-3">
                {order.is_completed ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    <CheckCircle className="w-3.5 h-3.5" /> Completed
                  </span>
                ) : (
                  <>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
                      <Clock className="w-3.5 h-3.5" /> In Progress
                    </span>
                    {order.seller_id === currentUser?.id && (
                      <Button size="sm" variant="outline" onClick={() => completeMutation.mutate(order.id)} disabled={completeMutation.isPending}>
                        Mark Complete
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
