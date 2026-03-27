import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import GigCard from "@/components/GigCard";
import { CATEGORIES } from "@/lib/types";
import { Search, ArrowRight, Zap, Shield, Users } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import heroBanner from "@/assets/hero-banner.jpg";

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const { data: featuredGigs = [] } = useQuery({
    queryKey: ["featured-gigs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gigs")
        .select("*")
        .order("sales", { ascending: false })
        .limit(6);
      if (error) throw error;
      return data;
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/explore?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBanner} alt="Students collaborating" className="w-full h-full object-cover" width={1920} height={800} />
          <div className="absolute inset-0 bg-foreground/60" />
        </div>
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-1.5 text-sm font-medium text-accent-foreground backdrop-blur-sm border border-accent/30">
              <Zap className="w-4 h-4" /> Made by students, for students — C V Raman Global University
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-display leading-tight text-primary-foreground">
              Real Skills,{" "}
              <span className="text-accent">Real Talent,</span>{" "}
              Real Results
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-lg">
              Need a website, logo, tutor, or video editor? Find talented students who've actually done it before — not AI, hassale free. Just your peers, ready to help.
            </p>
            <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search for any service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-card text-foreground text-sm border-0 focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <Button type="submit" size="lg" className="bg-gradient-accent text-accent-foreground font-semibold">Search</Button>
            </form>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold font-display mb-8">Browse Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {CATEGORIES.map((cat) => (
            <Link key={cat.slug} to={`/explore?cat=${cat.slug}`} className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card border shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
              <span className="text-3xl">{cat.icon}</span>
              <span className="text-xs font-medium text-center leading-tight">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Gigs */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold font-display">Featured Gigs</h2>
          <Link to="/explore" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">See all <ArrowRight className="w-4 h-4" /></Link>
        </div>
        {featuredGigs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredGigs.map((gig) => (<GigCard key={gig.id} gig={gig} />))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p className="font-display font-semibold">No gigs posted yet — be the first one on campus!</p>
            <p className="text-sm mt-1">Register as a freelancer and create your first gig in minutes.</p>
          </div>
        )}
      </section>

      {/* Value Props */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Shield, title: "Student-Only, Verified", desc: "Only verified CVR students can join. You know who you're hiring — they sit in the same classrooms as you." },
            { icon: Zap, title: "Affordable & Fast", desc: "Student-friendly prices, quick turnarounds. No agency markup, no middlemen — just fair pay for real work." },
            { icon: Users, title: "Build Your Network", desc: "Work with talented peers across all departments. Today's gig could be tomorrow's startup co-founder." },
          ].map((item) => (
            <div key={item.title} className="p-6 rounded-lg bg-card border shadow-card text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold font-display">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;