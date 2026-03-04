import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldCheck, ArrowRight, Github } from 'lucide-react';
import Link from 'next/link';
import { signup } from '@/app/actions/auth';

export default function RegisterPage({ searchParams }: { searchParams: { message: string } }) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-xl w-full space-y-8 bg-white dark:bg-workshop-dark p-10 rounded-3xl border shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-primary" />

        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">Create Account</h1>
          <p className="text-muted-foreground">Join the world&apos;s fastest-growing industrial marketplace</p>
        </div>

        <form action={signup} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Full Name</label>
              <Input name="full_name" placeholder="John Doe" className="h-12" required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Company</label>
              <Input name="company_name" placeholder="Industrial Corp" className="h-12" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email Address</label>
            <Input name="email" type="email" placeholder="name@company.com" className="h-12" required />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Password</label>
            <Input name="password" type="password" placeholder="••••••••" className="h-12" required />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary" required />
              <span className="text-xs text-muted-foreground">I agree to the <Link href="#" className="font-bold text-primary hover:underline">Terms of Service</Link> and <Link href="#" className="font-bold text-primary hover:underline">Privacy Policy</Link></span>
            </div>
            <div className="flex items-center gap-3">
              {/* If checked, value 'vendor' is sent. If unchecked, the signup action defaults to 'buyer' */}
              <input name="role" type="checkbox" value="vendor" className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary" />
              <span className="text-xs text-muted-foreground">I want to register as a <span className="font-bold text-primary">Vendor</span></span>
            </div>
          </div>

          <Button type="submit" className="w-full h-12 text-lg font-bold uppercase tracking-tighter" variant="industrial">
            Create Account
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          {searchParams?.message && (
            <p className="mt-4 p-4 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-center text-sm rounded-md font-bold">
              {searchParams.message}
            </p>
          )}
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
