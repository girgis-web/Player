import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Monitor, Wifi, WifiOff, ArrowUpRight, Zap, PlayCircle, Globe } from "lucide-react";

export function DisplayCard({ d }) {
  const online = d.last_seen_at
    ? Date.now() - new Date(d.last_seen_at).getTime() < 300000
    : false;

  return (
    <Link href={`/displays/${d.id}`} className="block group">
      <Card
        className="
          glass-premium card-premium p-0 border-none overflow-hidden
          flex flex-col gap-0
          relative
        "
      >
        {/* GLOW EFFECT */}
        <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 blur-[100px] rounded-full transition-all duration-700 ${online ? "bg-emerald-500/20" : "bg-rose-500/10"}`} />

        {/* HEADER AREA */}
        <div className="p-8 pb-4 relative z-10 flex flex-col gap-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-5">
              <div className={`p-4 rounded-3xl transition-all duration-500 ${online ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"} group-hover:scale-110 shadow-lg`}>
                <Monitor className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-black tracking-tight text-white group-hover:text-primary transition-colors">
                  {d.name || "UNNAMED NODE"}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-1.5">
                    <Globe className="w-3 h-3" /> EU-WEST-1
                  </span>
                </div>
              </div>
            </div>

            <Badge
              className={`
                px-4 py-1.5 text-[10px] font-black tracking-widest uppercase rounded-full border-none
                ${online 
                  ? "bg-emerald-500/20 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]" 
                  : "bg-rose-500/20 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.1)]"}
              `}
            >
              <div className={`w-2 h-2 rounded-full mr-2 ${online ? "bg-emerald-400 animate-pulse" : "bg-rose-400"}`} />
              {online ? "ACTIVE" : "STANDBY"}
            </Badge>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="px-8 pb-8 pt-4 space-y-6 relative z-10">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                <PlayCircle className="w-3 h-3" /> Stream
              </p>
              <p className="text-sm font-black truncate">{d.playlists?.name || "IDLE"}</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                <Zap className="w-3 h-3" /> Uptime
              </p>
              <p className="text-sm font-black truncate">99.9%</p>
            </div>
          </div>

          <div className="flex items-center justify-between group-hover:px-2 transition-all duration-500">
            <div className="flex flex-col">
               <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Last Signal</span>
               <span className="text-xs font-black text-white/80 italic">
                {d.last_seen_at ? new Date(d.last_seen_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "DISCONNECTED"}
               </span>
            </div>
            <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all duration-500">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
        </div>
        
        {/* INTERACTIVE SCANLINES EFFECT */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
      </Card>
    </Link>
  );
}
