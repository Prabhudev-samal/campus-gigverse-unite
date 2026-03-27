import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORIES } from "@/lib/types";
import GigCard from "@/components/GigCard";
import { Search, SlidersHorizontal } from "lucide-react";

const ExplorePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const selectedCat = searchParams.get("cat") || "";
  const [sortBy, setSortBy] = useState("popular");

  const { data: allGigs = [], isLoading } = useQuery({
    queryKey: ["gigs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("gigs").select("*");
      if (error) throw error;
      return data;
    },
  });

  const filteredGigs = useMemo(() => {
    let gigs = [...allGigs];
    if (selectedCat) gigs = gigs.filter(g => g.category === selectedCat);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      gigs = gigs.filter(g => g.title.toLowerCase().includes(q) || g.description.toLowerCase().includes(q) || g.category.toLowerCase().includes(q));
    }
    if (sortBy === "popular") gigs.sort((a, b) => b.sales - a.sales);
    else if (sortBy === "price-low") gigs.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-high") gigs.sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") gigs.sort((a, b) => (b.star_number > 0 ? b.total_stars / b.star_number : 0) - (a.star_number > 0 ? a.total_stars / a.star_number : 0));
    return gigs;
  }, [allGigs, selectedCat, searchQuery, sortBy]);

  const handleCategoryClick = (slug: string) => {
    const params = new URLSearchParams(searchParams);
    if (slug === selectedCat) params.delete("cat");
    else params.set("cat", slug);
    setSearchParams(params);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold font-display mb-6">Explore Gigs</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search gigs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-card text-sm focus:ring-2 focus:ring-primary outline-none" />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="py-2.5 px-3 rounded-lg border bg-card text-sm focus:ring-2 focus:ring-primary outline-none">
            <option value="popular">Most Popular</option>
            <option value="rating">Top Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => (
          <button key={cat.slug} onClick={() => handleCategoryClick(cat.slug)} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${selectedCat === cat.slug ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground hover:border-primary/50"}`}>
            <span>{cat.icon}</span> {cat.name}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-muted-foreground">Loading gigs...</div>
      ) : filteredGigs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGigs.map((gig) => (<GigCard key={gig.id} gig={gig} />))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-lg font-display font-semibold text-muted-foreground">No gigs found</p>
          <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default ExplorePage;
