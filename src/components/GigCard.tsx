import { Tables } from "@/integrations/supabase/types";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";

type Gig = Tables<"gigs">;

const GigCard = ({ gig }: { gig: Gig }) => {
  const rating = gig.star_number > 0 ? (gig.total_stars / gig.star_number).toFixed(1) : "New";

  return (
    <Link
      to={`/gig/${gig.id}`}
      className="group block rounded-lg border bg-card shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden"
    >
      <div className="aspect-[16/10] bg-muted overflow-hidden">
        {gig.cover_url ? (
          <img src={gig.cover_url} alt={gig.title} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full bg-gradient-hero opacity-20 group-hover:opacity-30 transition-opacity" />
        )}
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-primary">{gig.seller_name.charAt(0)}</span>
          </div>
          <span className="text-xs text-muted-foreground truncate">{gig.seller_name}</span>
        </div>
        <h3 className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {gig.title}
        </h3>
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-accent text-accent" />
          <span className="text-xs font-semibold">{rating}</span>
          <span className="text-xs text-muted-foreground">({gig.sales} orders)</span>
        </div>
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">Starting at</p>
          <p className="text-lg font-bold font-display text-primary">₹{gig.price}</p>
        </div>
      </div>
    </Link>
  );
};

export default GigCard;
