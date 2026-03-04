import Link from 'next/link';
import { Hammer, Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-workshop-dark text-slate-300 border-t border-slate-800">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6 md:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 text-white">
              <div className="bg-primary p-1.5 rounded-lg">
                <Hammer className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold tracking-tighter">TOOLDOCKER</span>
            </Link>
            <p className="text-sm leading-relaxed">
              The world&apos;s leading multivendor marketplace for industrial tools, heavy machinery, and workshop supplies. Built for professionals, by professionals.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-primary transition-colors"><Facebook className="h-5 w-5" /></Link>
              <Link href="#" className="hover:text-primary transition-colors"><Twitter className="h-5 w-5" /></Link>
              <Link href="#" className="hover:text-primary transition-colors"><Linkedin className="h-5 w-5" /></Link>
              <Link href="#" className="hover:text-primary transition-colors"><Instagram className="h-5 w-5" /></Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Marketplace</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="#" className="hover:text-primary transition-colors">All Categories</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Featured Brands</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Request a Quote (RFQ)</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Industrial Auctions</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Vendor Directory</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Support</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="#" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Shipping Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Returns & Refunds</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Dispute Resolution</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Contact Info</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <span>123 Industrial Way, Suite 500, Tech City, TC 54321</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span>+1 (800) TOOL-DOCK</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span>support@tooldocker.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© 2026 Tooldocker Inc. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
