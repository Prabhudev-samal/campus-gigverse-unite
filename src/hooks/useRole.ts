import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Role = "user" | "admin" | null;

export function useRole(): Role {
  const [role, setRole] = useState<Role>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setRole(null); return; }

      const { data } = await (supabase as any)
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      setRole((data?.role as Role) ?? "user");
    });
  }, []);

  return role;
}