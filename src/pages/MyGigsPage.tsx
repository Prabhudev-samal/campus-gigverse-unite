import { useAuth } from "@/context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { PlusCircle, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";

const MyGigsPage = () => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: myGigs = [], isLoading } = useQuery({
    queryKey: ["my-gigs", currentUser?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("gigs").select("*").eq("user_id", currentUser!.id).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!currentUser,
  });

  const deleteMutation = useMutation({
    mutationFn: async (gigId: string) => {
      const { error } = await supabase.from("gigs").delete().eq("id", gigId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Gig deleted");
      queryClient.invalidateQueries({ queryKey: ["my-gigs"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!loading && !currentUser) return <Navigate to="/login" />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold font-display">My Gigs</h1>
        <Button onClick={() => navigate("/add-gig")}><PlusCircle className="w-4 h-4 mr-2" /> Create New Gig</Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : myGigs.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="font-display font-semibold">You haven't created any gigs yet</p>
          <Button className="mt-4" onClick={() => navigate("/add-gig")}>Create your first gig</Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Gig</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Price</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Sales</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Rating</th>
                <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {myGigs.map((gig) => (
                <tr key={gig.id} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="py-4 px-2">
                    <Link to={`/gig/${gig.id}`} className="text-sm font-medium hover:text-primary transition-colors line-clamp-1">{gig.title}</Link>
                  </td>
                  <td className="py-4 px-2 text-sm font-semibold">₹{gig.price}</td>
                  <td className="py-4 px-2 text-sm">{gig.sales}</td>
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                      <span className="text-sm">{gig.star_number > 0 ? (gig.total_stars / gig.star_number).toFixed(1) : "N/A"}</span>
                    </div>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(gig.id)} disabled={deleteMutation.isPending}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyGigsPage;
