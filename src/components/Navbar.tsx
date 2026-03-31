import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useRole } from "@/hooks/useRole";
import { Button } from "@/components/ui/button";
import { Search, Menu, X, LogOut, User, ShoppingBag, PlusCircle, LayoutDashboard } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const role = useRole();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const dashboardPath = role === "admin" ? "/admin" : "/dashboard";
  const dashboardLabel = role === "admin" ? "Admin Panel" : "Dashboard";

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold font-display text-gradient-primary">CGU</span>
          <span className="hidden sm:inline text-sm font-medium text-muted-foreground">Campus Gigverse Unite</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/explore" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
            Explore Gigs
          </Link>
          {currentUser ? (
            <>
              {currentUser.isFreelancer && (
                <>
                  <Link to="/my-gigs" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                    My Gigs
                  </Link>
                  <Link to="/add-gig" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                    Create Gig
                  </Link>
                </>
              )}
              <Link to="/orders" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                Orders
              </Link>

              <Link
                to={dashboardPath}
                className={`text-sm font-medium transition-colors ${
                  role === "admin"
                    ? "text-red-500 hover:text-red-600"
                    : "text-foreground/80 hover:text-primary"
                }`}
              >
                {dashboardLabel}
              </Link>

              <div className="flex items-center gap-3 pl-3 border-l">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-xs font-bold text-primary-foreground">
                    {currentUser.fullName.charAt(0)}
                  </span>
                </div>
                <span className="text-sm font-medium">{currentUser.fullName}</span>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => navigate("/login")}>Login</Button>
              <Button onClick={() => navigate("/register")}>Join Now</Button>
            </div>
          )}
        </div>

        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t bg-card p-4 space-y-3 animate-fade-up">
          <Link to="/explore" className="block py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>
            <Search className="w-4 h-4 inline mr-2" /> Explore Gigs
          </Link>
          {currentUser ? (
            <>
              {currentUser.isFreelancer && (
                <>
                  <Link to="/my-gigs" className="block py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>
                    <User className="w-4 h-4 inline mr-2" /> My Gigs
                  </Link>
                  <Link to="/add-gig" className="block py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>
                    <PlusCircle className="w-4 h-4 inline mr-2" /> Create Gig
                  </Link>
                </>
              )}
              <Link to="/orders" className="block py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>
                <ShoppingBag className="w-4 h-4 inline mr-2" /> Orders
              </Link>

              <Link
                to={dashboardPath}
                className={`block py-2 text-sm font-medium ${
                  role === "admin" ? "text-red-500" : ""
                }`}
                onClick={() => setMobileOpen(false)}
              >
                <LayoutDashboard className="w-4 h-4 inline mr-2" />
                {dashboardLabel}
              </Link>

              <button
                onClick={() => { handleLogout(); setMobileOpen(false); }}
                className="block py-2 text-sm font-medium text-destructive"
              >
                <LogOut className="w-4 h-4 inline mr-2" /> Logout
              </button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Button variant="ghost" className="flex-1" onClick={() => { navigate("/login"); setMobileOpen(false); }}>
                Login
              </Button>
              <Button className="flex-1" onClick={() => { navigate("/register"); setMobileOpen(false); }}>
                Join Now
              </Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;