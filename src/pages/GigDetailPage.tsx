import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Star, Clock, CheckCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const GigDetailPage = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [reviewForm, setReviewForm] = useState({ star: 5, desc: "" });

  const { data: gig, isLoading } = useQuery({
    queryKey: ["gig", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("gigs").select("*").eq("id", id!).single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("reviews").select("*").eq("gig_id", id!).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const orderMutation = useMutation({
    mutationFn: async () => {
      if (!currentUser || !gig) throw new Error("Missing data");
      const { error } = await supabase.from("orders").insert({
        gig_id: gig.id,
        title: gig.title,
        price: gig.price,
        seller_id: gig.user_id,
        buyer_id: currentUser.id,
        seller_name: gig.seller_name,
        buyer_name: currentUser.fullName,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Order placed successfully! 🎉");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const reviewMutation = useMutation({
    mutationFn: async () => {
      if (!currentUser || !gig) throw new Error("Missing data");
      const { error } = await supabase.from("reviews").insert({
        gig_id: gig.id,
        user_id: currentUser.id,
        user_name: currentUser.fullName,
        star: reviewForm.star,
        description: reviewForm.desc,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Review posted!");
      setReviewForm({ star: 5, desc: "" });
      queryClient.invalidateQueries({ queryKey: ["reviews", id] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const handleOrder = () => {
    if (!currentUser) { toast.error("Please login to place an order"); navigate("/login"); return; }
    orderMutation.mutate();
  };

  if (isLoading) return <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">Loading...</div>;
  if (!gig) return (
    <div className="container mx-auto px-4 py-20 text-center">
      <p className="text-lg font-display font-semibold text-muted-foreground">Gig not found</p>
      <Button variant="ghost" onClick={() => navigate("/explore")} className="mt-4"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Explore</Button>
    </div>
  );

  const rating = gig.star_number > 0 ? (gig.total_stars / gig.star_number).toFixed(1) : "New";

  return (
    <div className="container mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video rounded-lg bg-muted overflow-hidden">
            {gig.cover_url ? <img src={gig.cover_url} alt={gig.title} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-hero opacity-20" />}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-display">{gig.title}</h1>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-bold text-primary">{gig.seller_name.charAt(0)}</span>
            </div>
            <div>
              <p className="text-sm font-medium">{gig.seller_name}</p>
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                <span className="text-xs font-semibold">{rating}</span>
                <span className="text-xs text-muted-foreground">({gig.star_number} reviews)</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <h2 className="text-lg font-semibold font-display">About this gig</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{gig.description}</p>
          </div>
          {gig.features && gig.features.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold font-display">What's included</h2>
              <ul className="space-y-2">
                {gig.features.map((f, i) => (<li key={i} className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-primary shrink-0" />{f}</li>))}
              </ul>
            </div>
          )}

          {/* Reviews */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold font-display">Reviews ({reviews.length})</h2>
            {currentUser && (
              <div className="p-4 rounded-lg border bg-card space-y-3">
                <p className="text-sm font-medium">Leave a review</p>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(s => (
                    <button key={s} onClick={() => setReviewForm(p => ({...p, star: s}))}>
                      <Star className={`w-5 h-5 ${s <= reviewForm.star ? "fill-accent text-accent" : "text-muted"}`} />
                    </button>
                  ))}
                </div>
                <textarea value={reviewForm.desc} onChange={e => setReviewForm(p => ({...p, desc: e.target.value}))} placeholder="Write your review..." className="w-full px-3 py-2 rounded-lg border bg-background text-sm resize-none" rows={3} />
                <Button size="sm" disabled={!reviewForm.desc.trim() || reviewMutation.isPending} onClick={() => reviewMutation.mutate()}>
                  {reviewMutation.isPending ? "Posting..." : "Post Review"}
                </Button>
              </div>
            )}
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="p-4 rounded-lg border bg-card">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-xs font-bold">{review.user_name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{review.user_name}</p>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (<Star key={i} className={`w-3 h-3 ${i < review.star ? "fill-accent text-accent" : "text-muted"}`} />))}
                        </div>
                      </div>
                      <span className="ml-auto text-xs text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No reviews yet</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 p-6 rounded-lg border bg-card shadow-card space-y-4">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">Starting at</span>
              <span className="text-3xl font-bold font-display text-primary">₹{gig.price}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" /><span>{gig.delivery_time} day{gig.delivery_time > 1 ? "s" : ""} delivery</span>
            </div>
            {gig.features && gig.features.length > 0 && (
              <ul className="space-y-2">
                {gig.features.map((f, i) => (<li key={i} className="flex items-center gap-2 text-sm"><CheckCircle className="w-3.5 h-3.5 text-primary" /> {f}</li>))}
              </ul>
            )}
            <Button onClick={handleOrder} className="w-full bg-gradient-accent text-accent-foreground font-semibold" size="lg" disabled={orderMutation.isPending}>
              {orderMutation.isPending ? "Placing order..." : "Order Now"}
            </Button>
            <p className="text-xs text-center text-muted-foreground">{gig.sales} orders completed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GigDetailPage;
