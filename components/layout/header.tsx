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

export function Header() {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const { totalItems } = useCart();
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <Hammer className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tighter hidden sm:inline-block">
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
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 w-[600px] bg-white dark:bg-workshop-dark border rounded-xl shadow-2xl p-6 grid grid-cols-2 gap-8"
                  >
                    {MOCK_CATEGORIES.map((cat) => (
                      <Link 
                        key={cat.id} 
                        href={`/category/${cat.slug}`}
                        className="flex items-center space-x-4 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                        onClick={() => setIsMegaMenuOpen(false)}
                      >
                        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                          <Box className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-bold text-sm">{cat.name}</div>
                          <div className="text-xs text-muted-foreground">Browse equipment</div>
                        </div>
                      </Link>
                    ))}
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
            <Button className="hidden sm:flex" variant="industrial">
              Sell Tools
            </Button>
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
                <Button className="w-full justify-start" variant="industrial">
                  <Hammer className="mr-2 h-4 w-4" /> Sell on Tooldocker
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
