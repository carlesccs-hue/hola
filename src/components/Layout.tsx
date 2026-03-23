import { Outlet, Link, useLocation } from "react-router-dom";
import { Home, MapPin, Info, Heart } from "lucide-react";
import { cn } from "@/src/lib/utils";

export default function Layout() {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Inicio" },
    { path: "/parks", icon: MapPin, label: "Parques" },
  ];

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-[#F8FAFC] relative shadow-2xl">
      {/* Header */}
      <header className="p-6 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-brand-olive/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-brand-olive to-brand-accent rounded-full flex items-center justify-center shadow-lg shadow-brand-olive/20">
            <Heart className="text-white w-4 h-4" />
          </div>
          <h1 className="serif text-2xl font-bold tracking-tight text-brand-ink">VitalTrain</h1>
        </div>
        <button className="p-2 rounded-full hover:bg-brand-olive/5 transition-colors">
          <Info className="w-5 h-5 text-brand-olive/40" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 pb-24 overflow-y-auto">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-brand-olive/10 px-8 py-4 flex justify-around items-center z-50">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 transition-all",
                isActive ? "text-brand-olive scale-110" : "text-brand-olive/40 hover:text-brand-olive/60"
              )}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-[10px] font-medium uppercase tracking-widest">{item.label}</span>
              {isActive && (
                <div className="w-1 h-1 bg-brand-olive rounded-full mt-0.5" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
