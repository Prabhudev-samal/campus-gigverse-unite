import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { CATEGORIES } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AddGigPage = () => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    title: "", desc: "", category: "", price: "", deliveryTime: "3", features: "", coverUrl: "",
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!currentUser) throw new Error("Not authenticated");
      const features = form.features.split(",").map(f => f.trim()).filter(Boolean);
      const { error } = await supabase.from("gigs").insert({
        user_id: currentUser.id,
        title: form.title,
        description: form.desc,
        category: form.category,
        price: parseFloat(form.price),
        delivery_time: parseInt(form.deliveryTime) || 3,
        features,
        cover_url: form.coverUrl || "",
        seller_name: currentUser.fullName,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Gig created successfully! 🎉");
      queryClient.invalidateQueries({ queryKey: ["my-gigs"] });
      queryClient.invalidateQueries({ queryKey: ["gigs"] });
      navigate("/my-gigs");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!loading && !currentUser) return <Navigate to="/login" />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.desc || !form.category || !form.price) {
      toast.error("Please fill all required fields");
      return;
    }
    createMutation.mutate();
  };

  const set = (key: string, value: string) => setForm({ ...form, [key]: value });

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold font-display mb-6">Create a New Gig</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium">Gig Title *</label>
          <input type="text" value={form.title} onChange={(e) => set("title", e.target.value)} className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="I will..." />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Category *</label>
          <select value={form.category} onChange={(e) => set("category", e.target.value)} className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:ring-2 focus:ring-primary outline-none">
            <option value="">Select a category</option>
            {CATEGORIES.map((cat) => (<option key={cat.slug} value={cat.slug}>{cat.name}</option>))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Description *</label>
          <textarea value={form.desc} onChange={(e) => set("desc", e.target.value)} rows={5} className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:ring-2 focus:ring-primary outline-none resize-none" placeholder="Describe what you'll do, your experience, and why someone should hire you. Be honest and specific — buyers appreciate that." />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Price (₹) *</label>
            <input type="number" value={form.price} onChange={(e) => set("price", e.target.value)} className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="500" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Delivery Time (days)</label>
            <input type="number" value={form.deliveryTime} onChange={(e) => set("deliveryTime", e.target.value)} className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="3" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Cover Image URL (optional)</label>
          <input type="url" value={form.coverUrl} onChange={(e) => set("coverUrl", e.target.value)} className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="https://example.com/image.jpg" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Features (comma-separated)</label>
          <input type="text" value={form.features} onChange={(e) => set("features", e.target.value)} className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="Source Code, 2 Revisions, Fast Delivery" />
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="submit" size="lg" className="flex-1" disabled={createMutation.isPending}>
            {createMutation.isPending ? "Creating..." : "Create Gig"}
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={() => navigate(-1)}>Cancel</Button>
        </div>
      </form>
    </div>
  );
};

export default AddGigPage;