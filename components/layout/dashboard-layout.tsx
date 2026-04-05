'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  LogOut, 
  Bell, 
  Search,
  MessageSquare,
  ChevronRight,
  LayoutDashboard,
  Users,
  Settings,
  ShieldCheck,
  BarChart3,
  AlertTriangle,
  History,
  Heart,
  Package,
  Truck,
  CreditCard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { signout } from '@/app/actions/auth';

interface DashboardLayoutProps {
  children: React.ReactNode;
  items: DashboardNavItem[];
  role: 'Buyer' | 'Vendor' | 'Admin';
  initialUserName?: string;
  initialUserEmail?: string;
  initialUserInitials?: string;
}

export type DashboardIconName =
  | 'layout-dashboard'
  | 'users'
  | 'settings'
  | 'shield-check'
  | 'bar-chart-3'
  | 'alert-triangle'
  | 'history'
  | 'heart'
  | 'package'
  | 'truck'
  | 'credit-card'
  | 'message-square'

export type DashboardNavItem = {
  name: string;
  href: string;
  icon: DashboardIconName;
}

const dashboardIconMap: Record<DashboardIconName, React.ElementType> = {
  'layout-dashboard': LayoutDashboard,
  users: Users,
  settings: Settings,
  'shield-check': ShieldCheck,
  'bar-chart-3': BarChart3,
  'alert-triangle': AlertTriangle,
  history: History,
  heart: Heart,
  package: Package,
  truck: Truck,
  'credit-card': CreditCard,
  'message-square': MessageSquare,
};

export function DashboardLayout({
  children,
  items,
  role,
  initialUserName = '',
  initialUserInitials = '',
}: DashboardLayoutProps) {
  const fallbackUserName = initialUserName || `${role} Workspace`;
  const fallbackInitials = initialUserInitials || role.slice(0, 1).toUpperCase();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [userName, setUserName] = React.useState(fallbackUserName);
  const [userInitials, setUserInitials] = React.useState(fallbackInitials);
  const pathname = usePathname();
  const supabase = React.useMemo(() => createClient(), []);
  const activeItem = items.find((item) => pathname === item.href) ?? items[0];

  React.useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, company_name')
          .eq('id', user.id)
          .maybeSingle();

        const name =
          profile?.full_name ||
          profile?.company_name ||
          user.user_metadata?.full_name ||
          user.user_metadata?.company_name ||
          user.email?.split('@')[0] ||
          'User';
        setUserName(name);
        const initials = name
          .split(' ')
          .map((n: string) => n[0])
          .join('')
          .toUpperCase()
          .substring(0, 2);
        setUserInitials(initials);
      }
    };
    fetchUser();
  }, []);

  const handleSignOut = async () => {
    await signout();
  };

  return (
    <div className="flex min-h-screen bg-[radial-gradient(circle_at_top,_rgba(242,125,38,0.08),_transparent_38%),linear-gradient(180deg,_#fcfaf7_0%,_#f6f1e8_100%)]">
      {isSidebarOpen ? (
        <button
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-[1px] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      ) : null}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[280px] border-r border-stone-200/80 bg-[#fcfaf7]/95 shadow-2xl backdrop-blur transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0 lg:shadow-none",
          !isSidebarOpen && "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex h-16 items-center justify-between border-b border-stone-200 px-5 sm:px-6 lg:justify-start">
            <Link href="/" className="flex items-center space-x-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 shadow-sm">
                <span className="text-white font-black text-xl">T</span>
              </div>
              <div>
                <span className="block text-lg font-semibold tracking-[-0.03em] text-slate-900">Tooldocker</span>
                <span className="block text-[11px] font-medium uppercase tracking-[0.24em] text-stone-500">{role} workspace</span>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-700 hover:bg-white lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="border-b border-stone-200/80 px-5 py-5">
            <div className="rounded-3xl border border-stone-200/80 bg-white/85 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-sm font-black text-white uppercase">
                  {userInitials}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">{userName}</p>
                  <p className="text-xs text-stone-500">Managing {role.toLowerCase()} operations</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between rounded-2xl bg-stone-50 px-3 py-2 text-xs text-stone-600">
                <span>Current view</span>
                <span className="font-semibold text-slate-900">{activeItem?.name}</span>
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            <div className="px-1 py-2">
              <h2 className="mb-3 px-4 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                {role} Panel
              </h2>
              <div className="space-y-1">
                {items.map((item) => {
                  const Icon = dashboardIconMap[item.icon];
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsSidebarOpen(false)}
                      className={cn(
                        "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all",
                        isActive 
                          ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10" 
                          : "text-slate-600 hover:bg-white hover:text-slate-900"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="flex-1">{item.name}</span>
                      <ChevronRight className={cn("h-4 w-4 transition-opacity", isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100")} />
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>

          <div className="border-t border-stone-200 p-4">
            <Button 
              variant="ghost" 
              className="w-full justify-start rounded-2xl text-red-500 hover:bg-red-50 hover:text-red-600"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between border-b border-stone-200/80 bg-[#faf8f4]/90 px-4 py-3 backdrop-blur sm:px-6">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="shrink-0 text-slate-700 hover:bg-white lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="min-w-0 lg:hidden">
              <p className="truncate text-sm font-semibold text-slate-900">{activeItem?.name}</p>
              <p className="text-xs text-stone-500">{role} workspace</p>
            </div>

            <div className="relative hidden max-w-sm md:flex">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search dashboard..." 
                className="h-10 border-stone-200 bg-white/90 pl-10 focus-visible:ring-primary"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" size="icon" className="relative text-slate-700 hover:bg-white">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden text-slate-700 hover:bg-white sm:inline-flex">
              <MessageSquare className="h-5 w-5" />
            </Button>
            <div className="hidden h-8 w-px bg-stone-200 sm:block" />
            <div className="flex items-center gap-2 rounded-full border border-stone-200 bg-white/80 px-2 py-1 sm:gap-3 sm:px-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-stone-200">
                <span className="text-xs font-bold uppercase">{userInitials}</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold leading-none">{userName}</p>
                <p className="text-xs text-muted-foreground mt-1">{role}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
