'use client';

import * as React from 'react';
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
  Box
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '@/context/cart-context';
import { CATEGORIES as MOCK_CATEGORIES } from '@/lib/mock-data';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/layout/theme-toggle';

export function Header() {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { totalItems } = useCart();
  const router = useRouter();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled
        ? 'bg-white/95 dark:bg-slate-950/95 backdrop-blur-md shadow-md border-b-primary/20 py-1'
        : 'bg-white dark:bg-slate-950 border-b py-2 lg:py-3'
        }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <Hammer className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tighter">
              TOOLDOCKER
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium">
            <div
              className="relative group"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <button className="flex items-center space-x-1 hover:text-primary transition-colors py-4">
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
                    className="absolute top-full -left-10 mt-6 w-[850px] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-8 grid grid-cols-12 gap-8 origin-top [perspective:1000px] z-50"
                  >
                    {/* Decorative Triangle Pointer */}
                    <div className="absolute -top-3 left-20 w-6 h-6 bg-white dark:bg-slate-950 border-t border-l border-slate-200 dark:border-slate-800 rotate-45"></div>

                    {/* Categories Column */}
                    <div className="col-span-8">
                      <h3 className="text-sm font-black uppercase text-primary mb-6 tracking-wider flex items-center gap-2">
                        <Box className="w-4 h-4" /> All Categories
                      </h3>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                        {MOCK_CATEGORIES.map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/category/${cat.slug}`}
                            className="group flex items-center p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-800"
                            onClick={() => setIsMegaMenuOpen(false)}
                          >
                            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center mr-4 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                              <Box className="h-5 w-5 text-slate-600 dark:text-slate-400 group-hover:text-primary" />
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors">{cat.name}</div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">Explore items &rarr;</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Featured Column */}
                    <div className="col-span-4 bg-slate-50 dark:bg-slate-900 rounded-xl p-6 relative overflow-hidden group border border-slate-100 dark:border-slate-800 flex flex-col justify-center">
                      <div className="relative z-10">
                        <h3 className="text-sm font-black uppercase mb-2 text-slate-900 dark:text-white">Featured Sale</h3>
                        <p className="text-3xl font-black text-primary mb-6 leading-tight uppercase tracking-tighter">Up to 40% Off <br /><span className="text-slate-900 dark:text-white">Machinery</span></p>
                        <Button size="lg" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-12">Shop Now</Button>
                      </div>
                      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors duration-500"></div>
                      <Hammer className="absolute bottom-4 right-4 w-24 h-24 text-slate-200 dark:text-slate-800 -rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-500" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link href="/rfq" className="hover:text-primary transition-colors">Request Quote</Link>
            <Link href="/vendors" className="hover:text-primary transition-colors">Vendors</Link>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by tool, spec or brand..."
              className="pl-10 bg-muted/50 border-none focus-visible:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          {/* Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-primary text-[10px]">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>
            <Link href="/login" className="hidden sm:flex">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
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
            className="lg:hidden border-t bg-background overflow-hidden"
          >
            <div className="container mx-auto p-4 space-y-4">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tools..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
              <nav className="grid gap-4">
                <div className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Categories</div>
                <div className="grid grid-cols-2 gap-2">
                  {MOCK_CATEGORIES.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      className="text-sm hover:text-primary py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </nav>
              <div className="pt-4 border-t flex flex-col gap-2">
                <Link href="/login">
                  <Button variant="outline" className="w-full justify-start">
                    <User className="mr-2 h-4 w-4" /> Account
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
