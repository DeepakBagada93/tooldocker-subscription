import { ShieldCheck, LogIn, UserRound } from 'lucide-react'
import Link from 'next/link'
import { login } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default async function BuyerLoginPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await props.searchParams

  return (
    <div className="flex min-h-[90vh] items-center justify-center px-4 py-12 bg-[linear-gradient(180deg,#faf8f4_0%,#ffffff_40%,#f5efe6_100%)]">
      <div className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-stone-200 bg-white p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.32)] sm:p-10">
        <div className="absolute left-0 top-0 h-2 w-full bg-primary" />

        <div className="space-y-3 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f3ede4]">
            <UserRound className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-900">Customer Login</h1>
          <p className="mx-auto max-w-sm text-stone-600">
            Sign in to track your orders, manage your cart, and review your purchase history.
          </p>
        </div>

        {params?.message && typeof params.message === 'string' && (
          <p className="mt-6 rounded-2xl border border-amber-200/50 bg-amber-50 p-4 text-center text-sm font-medium text-amber-700">
            {params.message}
          </p>
        )}

        <form action={login} className="mt-8 space-y-4">
          <input type="hidden" name="redirectTo" value="/buyer" />
          <div className="space-y-2">
            <label className="ml-1 text-xs font-bold uppercase tracking-[0.22em] text-stone-500">Email Address</label>
            <Input name="email" type="email" placeholder="you@example.com" className="h-12 rounded-xl" required />
          </div>
          <div className="space-y-2">
            <label className="ml-1 text-xs font-bold uppercase tracking-[0.22em] text-stone-500">Password</label>
            <Input name="password" type="password" placeholder="........" className="h-12 rounded-xl" required />
          </div>
          <Button type="submit" variant="industrial" className="h-12 w-full rounded-xl text-base font-bold uppercase tracking-tight">
            Sign In as Customer
            <LogIn className="ml-2 h-5 w-5" />
          </Button>
        </form>

        <div className="mt-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-stone-200" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">New here?</span>
          <div className="h-px flex-1 bg-stone-200" />
        </div>

        <div className="mt-6">
          <Button asChild variant="outline" className="h-12 w-full rounded-xl border-stone-200 bg-stone-50/50 hover:bg-stone-50">
            <Link href="/login" className="font-bold text-slate-900">
              Create a New Account
            </Link>
          </Button>
        </div>

        <p className="mt-8 text-center text-sm text-stone-500">
          <Link href="/vendor/login" className="inline-flex items-center font-bold text-stone-400 transition-colors hover:text-primary">
            <ShieldCheck className="mr-2 h-4 w-4" /> Are you a vendor? Vendor Portal
          </Link>
        </p>
      </div>
    </div>
  )
}
