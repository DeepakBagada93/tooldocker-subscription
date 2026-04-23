import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin, ArrowRight, Zap, Shield, Truck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>
      
      {/* Gradient orbs */}
      <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-[#c7112c]/20 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-[#ff4d6a]/10 blur-3xl" />

      <div className="relative z-10">
        {/* Main footer content */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand column */}
            <div className="space-y-6 lg:col-span-1">
              <Link href="/" className="inline-flex w-fit items-center">
                <Image
                  src="/images/tooldocker.png"
                  alt="Tooldocker logo"
                  width={219}
                  height={53}
                  sizes="(max-width: 640px) 140px, 170px"
                  className="h-auto w-[140px] object-contain sm:w-[170px] invert brightness-200"
                />
              </Link>
              <p className="text-sm leading-7 text-slate-300">
                Shop across verified vendors on a multivendor marketplace built for tools, machinery, and workshop supplies with seamless checkout.
              </p>
              
              {/* Social links */}
              <div className="flex space-x-3">
                {[
                  { icon: Facebook, href: '#' },
                  { icon: Twitter, href: '#' },
                  { icon: Linkedin, href: '#' },
                  { icon: Instagram, href: '#' }
                ].map((social, idx) => (
                  <Link
                    key={idx}
                    href={social.href}
                    className="group flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 transition-all duration-300 hover:bg-[#c7112c] hover:border-[#c7112c] hover:scale-110 hover:shadow-lg hover:shadow-[#c7112c]/30"
                  >
                    <social.icon className="h-4 w-4 text-slate-300 group-hover:text-white transition-colors" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Marketplace column */}
            <div className="space-y-6">
              <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white">
                Marketplace
              </h3>
              <ul className="space-y-3">
                {[
                  { label: 'All Categories', href: '#' },
                  { label: 'Featured Brands', href: '#' },
                  { label: 'Seamless Checkout', href: '/checkout' },
                  { label: 'Industrial Auctions', href: '#' },
                  { label: 'Buyer Dashboard', href: '/buyer', highlight: true },
                  { label: 'Admin Dashboard', href: '/admin', highlight: true }
                ].map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.href}
                      className={`group flex items-center text-sm transition-all duration-300 ${
                        link.highlight
                          ? 'font-semibold text-[#ff4d6a] hover:text-[#ff4d6a]/80'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      <ArrowRight className="mr-2 h-3 w-3 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support column */}
            <div className="space-y-6">
              <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white">
                Support
              </h3>
              <ul className="space-y-3">
                {[
                  { label: 'Help Center', href: '#' },
                  { label: 'Shipping Policy', href: '#' },
                  { label: 'Returns & Refunds', href: '#' },
                  { label: 'Dispute Resolution', href: '#' },
                  { label: 'Contact Us', href: '#' }
                ].map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.href}
                      className="group flex items-center text-sm text-slate-300 transition-all duration-300 hover:text-white"
                    >
                      <ArrowRight className="mr-2 h-3 w-3 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact column */}
            <div className="space-y-6">
              <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white">
                Contact Info
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#c7112c]/20">
                    <MapPin className="h-4 w-4 text-[#ff4d6a]" />
                  </div>
                  <span className="text-sm text-slate-300">123 Industrial Way, Suite 500, Tech City, TC 54321</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#c7112c]/20">
                    <Phone className="h-4 w-4 text-[#ff4d6a]" />
                  </div>
                  <span className="text-sm text-slate-300">+1 (800) TOOL-DOCK</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#c7112c]/20">
                    <Mail className="h-4 w-4 text-[#ff4d6a]" />
                  </div>
                  <span className="text-sm text-slate-300">support@tooldocker.com</span>
                </div>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                {[
                  { icon: Shield, label: 'Verified' },
                  { icon: Zap, label: 'Fast Delivery' },
                  { icon: Truck, label: 'Free Shipping' }
                ].map((badge, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
                      <badge.icon className="h-4 w-4 text-[#ff4d6a]" />
                    </div>
                    <span className="mt-1 text-[9px] uppercase tracking-wider text-slate-400">{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="relative z-10 border-t border-white/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-sm text-slate-400">
                © 2026 Tooldocker Inc. All rights reserved.
              </p>
              <div className="flex space-x-6">
                {[
                  { label: 'Privacy Policy', href: '#' },
                  { label: 'Terms of Service', href: '#' },
                  { label: 'Cookie Policy', href: '#' }
                ].map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
