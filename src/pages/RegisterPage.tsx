import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "", password: "", fullName: "", isFreelancer: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password || !form.fullName) {
      toast.error("Please fill all required fields");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    const error = await register(form);
    setLoading(false);
    if (error) {
      toast.error(error);
    } else {
      toast.success("Account created! Check your email to verify, then log in. 🎉");
      navigate("/login");
    }
  };

  const set = (key: string, value: string | boolean) => setForm({ ...form, [key]: value });

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md p-8 rounded-xl border bg-card shadow-card space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold font-display">Join CGU</h1>
          <p className="text-sm text-muted-foreground mt-1">Create your campus freelance account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name *</label>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => set("fullName", e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:ring-2 focus:ring-primary outline-none"
              placeholder="Your full name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:ring-2 focus:ring-primary outline-none"
              placeholder="your.email@university.edu"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password * (min 6 chars)</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:ring-2 focus:ring-primary outline-none"
              placeholder="Create a password"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isFreelancer}
              onChange={(e) => set("isFreelancer", e.target.checked)}
              className="rounded border-primary text-primary focus:ring-primary"
            />
            <span className="text-sm">I want to offer services as a freelancer</span>
          </label>
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
