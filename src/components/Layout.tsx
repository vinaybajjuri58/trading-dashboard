import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, BarChart2, Activity, TrendingUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { to: '/',               label: 'Home',          icon: LayoutDashboard, end: true },
  { to: '/strategies',     label: 'Strategies',    icon: BarChart2 },
  { to: '/forward-tests',  label: 'Forward Tests', icon: Activity },
];

export default function Layout() {
  return (
    <div className="flex h-full bg-canvas">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-canvas border-r border-sb-border flex flex-col">
        {/* Brand */}
        <div className="h-14 flex items-center gap-2.5 px-5 border-b border-sb-border">
          <div className="h-7 w-7 rounded-md bg-accent/20 flex items-center justify-center">
            <TrendingUp size={14} className="text-accent" />
          </div>
          <span className="text-sm font-bold tracking-tight font-mono">
            <span className="text-white/90">Trading</span>
            <span className="text-accent">Dash</span>
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-accent/10 text-accent'
                    : 'text-sb-text hover:text-white hover:bg-sb-hover'
                }`
              }
            >
              <Icon size={15} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sb-border">
          <p className="text-xs text-sb-text/60">Trading Dashboard</p>
          <p className="text-xs text-sb-text/40 mt-0.5">Private · VPS hosted</p>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
