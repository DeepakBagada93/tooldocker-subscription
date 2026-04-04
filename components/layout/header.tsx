'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search,
  ShoppingCart,
  Menu,
  User,
  ChevronDown,
  Hammer,
  Wrench,
  ShieldCheck,
  Zap,
  Box,
  Sparkles,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '@/context/cart-context';
import { type Category } from '@/app/actions/products';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { createClient } from '@/lib/supabase/client';
import { normalizeAppRole } from '@/lib/supabase/profiles';

async function getResponseMessage(response: Response, fallbackMessage: string) {
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    const payload = await response.json().catch(() => null);
    if (payload && typeof payload === 'object' && 'error' in payload && typeof payload.error === 'string') {
      return payload.error;
    }
    if (payload && typeof payload === 'object' && 'message' in payload && typeof payload.message === 'string') {
      return payload.message;
    }
  }

  return fallbackMessage;
}

export function Header({ initialCategories }: { initialCategories: Category[] }) {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isAISearchLoading, setIsAISearchLoading] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [userRole, setUserRole] = React.useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [categories] = React.useState<Category[]>(initialCategories);
  
  const { totalItems } = useCart();
  const router = useRouter();
  const supabase = React.useMemo(() => createClient(), []);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setIsLoggedIn(true);
        setUserRole(normalizeAppRole(user.user_metadata?.role));
      } else {
        setIsLoggedIn(false);
        setUserRole(null);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsLoggedIn(true);
        setUserRole(normalizeAppRole(session.user.user_metadata?.role));
      } else {
        setIsLoggedIn(false);
        setUserRole(null);
      }
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      subscription.unsubscribe();
    };
  }, [supabase]);

  const getDashboardLink = () => {
    if (!isLoggedIn) return '/login';
    if (userRole === 'admin') return '/admin';
    return '/buyer';
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleAISearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsAISearchLoading(true);
    try {
      const res = await fetch('/api/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!res.ok) {
        throw new Error(await getResponseMessage(res, 'AI search is unavailable right now.'));
      }

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('AI search returned an unexpected response.');
      }

      const result = await res.json();
      
      if (result.data) {
        // Navigate to search with ai=true flag
        router.push(`/search?q=${encodeURIComponent(searchQuery)}&ai=true`);
        return;
      }

      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    } catch (error) {
      console.error('AI search failed', error);
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    } finally {
      setIsAISearchLoading(false);
    }
  };

  const aiSearchDisabled = isAISearchLoading || !searchQuery.trim();

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled
        ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-slate-200 py-1'
        : 'bg-white border-b border-slate-200 py-2 lg:py-3'
        }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src="/images/tooldocker.png"
              alt="Tooldocker logo"
              width={219}
              height={53}
              sizes="(max-width: 640px) 140px, (max-width: 1024px) 170px, 190px"
              priority
              className="h-auto w-[140px] sm:w-[170px] lg:w-[190px] object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium">
            <div
              className="relative group"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <button className="flex items-center space-x-1 text-slate-700 hover:text-primary transition-colors py-4">
                <span>Categories</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              <AnimatePresence>
                {isMegaMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, rotateX: -5 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    exit={{ opacity: 0, y: 15, rotateX: -5 }}
                    transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                    className="absolute top-full -left-10 mt-6 w-[850px] bg-white border border-slate-200 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-8 grid grid-cols-12 gap-8 origin-top [perspective:1000px] z-50"
                  >
                    {/* Decorative Triangle Pointer */}
                    <div className="absolute -top-3 left-20 w-6 h-6 bg-white border-t border-l border-slate-200 rotate-45"></div>

                    {/* Categories Column */}
                    <div className="col-span-8">
                      <h3 className="text-sm font-black uppercase text-primary mb-6 tracking-wider flex items-center gap-2">
                        <Box className="w-4 h-4" /> All Categories
                      </h3>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                        {categories.map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/category/${cat.slug}`}
                            className="group flex items-center p-3 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                            onClick={() => setIsMegaMenuOpen(false)}
                          >
                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mr-4 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                              <Box className="h-5 w-5 text-slate-600 group-hover:text-primary" />
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 group-hover:text-primary transition-colors">{cat.name}</div>
                              <div className="text-xs text-slate-500">Explore items &rarr;</div>
                            </div>
                          </Link>
                        ))}
                        {categories.length === 0 && (
                          <div className="col-span-2 py-4 text-center text-xs text-stone-400">
                            No categories found
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Featured Column */}
                    <div className="col-span-4 bg-slate-50 rounded-xl p-6 relative overflow-hidden group border border-slate-100 flex flex-col justify-center">
                      <div className="relative z-10">
                        <h3 className="text-sm font-black uppercase mb-2 text-slate-900">Featured Sale</h3>
                        <p className="text-3xl font-black text-primary mb-6 leading-tight uppercase tracking-tighter">Up to 40% Off <br /><span className="text-slate-900">Machinery</span></p>
                        <Button size="lg" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-12">Shop Now</Button>
                      </div>
                      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors duration-500"></div>
                      <Hammer className="absolute bottom-4 right-4 w-24 h-24 text-slate-200 -rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-500" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link href="/search" className="text-slate-700 hover:text-primary transition-colors">Shop</Link>
          </nav>

          {/* Search Bar */}
          <div className="flex-1 max-w-md hidden md:flex relative group">
            <form onSubmit={handleSearch} className="w-full relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by tool, spec or brand..."
                className="pl-10 pr-24 border-slate-200 bg-slate-50 focus-visible:ring-primary h-10 rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <motion.button
                type="button"
                onClick={handleAISearch}
                disabled={aiSearchDisabled}
                title="Search with AI"
                whileHover={aiSearchDisabled ? undefined : { scale: 1.04, rotate: -2 }}
                whileTap={aiSearchDisabled ? undefined : { scale: 0.97 }}
                className="absolute right-2 top-1/2 inline-flex h-8 -translate-y-1/2 items-center gap-1 rounded-full border border-primary/20 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(255,236,223,0.95))] px-2.5 text-[11px] font-black uppercase tracking-[0.2em] text-primary shadow-[0_8px_24px_-12px_rgba(249,115,22,0.75)] transition-all hover:border-primary/40 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isAISearchLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <motion.span
                    animate={{ rotate: [0, 8, -6, 0], scale: [1, 1.06, 1] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                    className="inline-flex"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                  </motion.span>
                )}
                <span>AI</span>
              </motion.button>
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative text-slate-700 hover:bg-slate-100 hover:text-primary">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-primary text-[10px]">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>
            <Link href={getDashboardLink()} className="hidden sm:flex">
              <Button variant="ghost" size="icon" className="text-slate-700 hover:bg-slate-100 hover:text-primary">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-700 hover:bg-slate-100 hover:text-primary lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden border-t border-slate-200 bg-white"
          >
            <div className="container mx-auto p-4 space-y-4">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tools..."
                  className="h-12 pl-10 pr-24 border-slate-200 bg-slate-50 rounded-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <motion.button
                  type="button"
                  onClick={handleAISearch}
                  disabled={aiSearchDisabled}
                  title="Search with AI"
                  whileHover={aiSearchDisabled ? undefined : { scale: 1.04, rotate: -2 }}
                  whileTap={aiSearchDisabled ? undefined : { scale: 0.97 }}
                  className="absolute right-2 top-1/2 inline-flex h-9 -translate-y-1/2 items-center gap-1 rounded-full border border-primary/20 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(255,236,223,0.95))] px-3 text-[11px] font-black uppercase tracking-[0.2em] text-primary shadow-[0_8px_24px_-12px_rgba(249,115,22,0.75)] transition-all hover:border-primary/40 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isAISearchLoading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <motion.span
                      animate={{ rotate: [0, 8, -6, 0], scale: [1, 1.06, 1] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                      className="inline-flex"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                    </motion.span>
                  )}
                  <span>AI</span>
                </motion.button>
              </form>
              <nav className="grid gap-4">
                <div className="font-bold text-sm uppercase tracking-wider text-slate-500">Categories</div>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      className="py-2 text-sm text-slate-700 hover:text-primary"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
                <div className="grid gap-2 border-t border-slate-200 pt-2">
                  <Link href="/search" className="py-2 text-sm text-slate-700 hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                    Shop
                  </Link>
                </div>
              </nav>
              <div className="flex flex-col gap-2 border-t border-slate-200 pt-4">
                <Link href={getDashboardLink()} onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-start">
                    <User className="mr-2 h-4 w-4" /> {isLoggedIn ? 'Dashboard' : 'Account'}
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
