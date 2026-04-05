import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-[#f6f1e8] text-stone-600">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-6 md:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex w-fit items-center">
              <Image
                src="/images/tooldocker.png"
                alt="Tooldocker logo"
                width={219}
                height={53}
                sizes="(max-width: 640px) 140px, 170px"
                className="h-auto w-[140px] object-contain sm:w-[170px]"
              />
            </Link>
            <p className="text-sm leading-7">
              Shop across verified vendors on a multivendor marketplace built for tools, machinery, and workshop supplies with seamless checkout.
            </p>
            <div className="flex space-x-4 text-slate-700">
              <Link href="#" className="transition-colors hover:text-primary"><Facebook className="h-5 w-5" /></Link>
              <Link href="#" className="transition-colors hover:text-primary"><Twitter className="h-5 w-5" /></Link>
              <Link href="#" className="transition-colors hover:text-primary"><Linkedin className="h-5 w-5" /></Link>
              <Link href="#" className="transition-colors hover:text-primary"><Instagram className="h-5 w-5" /></Link>
            </div>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-[0.22em] text-slate-900">Marketplace</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="#" className="transition-colors hover:text-primary">All Categories</Link></li>
              <li><Link href="#" className="transition-colors hover:text-primary">Featured Brands</Link></li>
              <li><Link href="/checkout" className="transition-colors hover:text-primary">Seamless Checkout</Link></li>
              <li><Link href="#" className="transition-colors hover:text-primary">Industrial Auctions</Link></li>
              <li><Link href="/buyer" className="font-semibold text-primary transition-colors hover:text-slate-900">Buyer Dashboard</Link></li>
              <li><Link href="/admin" className="font-semibold text-primary transition-colors hover:text-slate-900">Admin Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-[0.22em] text-slate-900">Support</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="#" className="transition-colors hover:text-primary">Help Center</Link></li>
              <li><Link href="#" className="transition-colors hover:text-primary">Shipping Policy</Link></li>
              <li><Link href="#" className="transition-colors hover:text-primary">Returns & Refunds</Link></li>
              <li><Link href="#" className="transition-colors hover:text-primary">Dispute Resolution</Link></li>
              <li><Link href="#" className="transition-colors hover:text-primary">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-[0.22em] text-slate-900">Contact Info</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 shrink-0 text-primary" />
                <span>123 Industrial Way, Suite 500, Tech City, TC 54321</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 shrink-0 text-primary" />
                <span>+1 (800) TOOL-DOCK</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 shrink-0 text-primary" />
                <span>support@tooldocker.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-stone-200 pt-8 text-xs md:flex-row">
          <p>© 2026 Tooldocker Inc. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="#" className="transition-colors hover:text-slate-900">Privacy Policy</Link>
            <Link href="#" className="transition-colors hover:text-slate-900">Terms of Service</Link>
            <Link href="#" className="transition-colors hover:text-slate-900">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
