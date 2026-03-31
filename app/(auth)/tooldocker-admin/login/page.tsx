import { LogIn, Lock } from 'lucide-react'
import Link from 'next/link'
import { login } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default async function AdminLoginPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await props.searchParams

  return (
    <div className="flex min-h-[100vh] items-center justify-center px-4 py-12 bg-slate-950">
      <div className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-10">
        <div className="absolute left-0 top-0 h-2 w-full bg-primary" />

        <div className="space-y-3 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-[-0.04em] text-white">Admin Terminal</h1>
          <p className="mx-auto max-w-sm text-slate-400">
            Secure administrative access for Tooldocker marketplace management.
          </p>
        </div>

        {params?.message && typeof params.message === 'string' && (
          <p className="mt-6 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-center text-sm font-medium text-amber-500">
            {params.message}
          </p>
        )}

        <form action={login} className="mt-8 space-y-4">
          <input type="hidden" name="redirectTo" value="/admin" />
          <div className="space-y-2">
            <label className="ml-1 text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Admin Email</label>
            <Input
              name="email"
              type="email"
              placeholder="admin@tooldocker.com"
              className="h-12 rounded-xl border-slate-700 bg-slate-800 text-white focus:border-primary"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="ml-1 text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Secure Password</label>
            <Input
              name="password"
              type="password"
              placeholder="........"
              className="h-12 rounded-xl border-slate-700 bg-slate-800 text-white focus:border-primary"
              required
            />
          </div>
          <Button type="submit" variant="industrial" className="mt-4 h-12 w-full rounded-xl text-base font-bold uppercase tracking-tight">
            Authorize Entry
            <LogIn className="ml-2 h-5 w-5" />
          </Button>
        </form>

        <div className="mt-10 border-t border-slate-800 pt-6 text-center">
          <Link href="/" className="text-xs font-bold uppercase tracking-widest text-slate-600 transition-colors hover:text-primary">
            Return to Public Site
          </Link>
        </div>
      </div>
    </div>
  )
}
