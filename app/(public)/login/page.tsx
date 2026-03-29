import { ShieldCheck, ArrowRight, Store, UserRound, ArrowLeftRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const portals = [
  {
    title: 'Customer Portal',
    description: 'Track orders, manage your cart, and review purchase history.',
    href: '/buyer/login',
    cta: 'Buyer Login',
    icon: UserRound,
    color: 'bg-[#f3ede4]',
  },
  {
    title: 'Vendor Portal',
    description: 'Manage your store, products, orders, and subscription.',
    href: '/vendor/login',
    cta: 'Vendor Login',
    icon: Store,
    color: 'bg-orange-50',
  },
]

export default async function LoginPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await props.searchParams

  return (
    <div className="flex min-h-[90vh] items-center justify-center px-4 py-12 bg-[linear-gradient(180deg,#faf8f4_0%,#ffffff_40%,#f5efe6_100%)]">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-[2.5rem] border border-stone-200 bg-white p-8 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.32)] sm:p-12">
        <div className="absolute left-0 top-0 h-2 w-full bg-primary" />

        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-100">
            <ArrowLeftRight className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-black tracking-[-0.05em] text-slate-900 uppercase">Select Your Portal</h1>
          <p className="mx-auto max-w-sm text-stone-600">
            Tooldocker provides separate experiences for buyers and industrial suppliers.
          </p>
        </div>

        {params?.message && typeof params.message === 'string' && (
          <p className="mt-8 rounded-2xl bg-amber-50 p-4 text-center text-sm font-medium text-amber-700 border border-amber-200/50">
            {params.message}
          </p>
        )}

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {portals.map((portal) => {
            const Icon = portal.icon
            return (
              <div
                key={portal.href}
                className="group flex flex-col rounded-[2rem] border border-stone-100 bg-stone-50/50 p-8 transition-all hover:bg-white hover:border-primary/20 hover:shadow-xl"
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${portal.color} mb-6 transition-transform group-hover:scale-110`}>
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">{portal.title}</h2>
                <p className="mt-3 text-sm leading-6 text-stone-600 flex-grow">{portal.description}</p>
                <Button asChild variant="industrial" className="mt-8 h-12 w-full rounded-xl text-sm font-bold uppercase tracking-tight">
                  <Link href={portal.href}>
                    {portal.cta}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-stone-500">
            New to Tooldocker? <Link href="/register/vendor" className="font-bold text-primary hover:underline">Register your business as a vendor</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
