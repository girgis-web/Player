import { useState, useEffect } from "react";
import { useSupabase } from "@/app/providers";

export function useDisplays() {
  const supabase = useSupabase();
  const [displays, setDisplays] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);

    const { data, error } = await supabase
      .from("displays")
      .select(`
        id,
        status,
        last_seen_at
      `)
      .not("user_id", "is", null)

    setDisplays(error ? [] : data || []);
    setLoading(false);
  }

  useEffect(() => {
    load();

    const channel = supabase
      .channel("displays-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "displays" },
        load
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return { displays, loading, loadDisplays: load };
}
