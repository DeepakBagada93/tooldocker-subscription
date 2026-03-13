import { ShieldCheck, ArrowRight, Store, BriefcaseBusiness, UserRound } from 'lucide-react';
import Link from 'next/link';

const previewRoles = [
  {
    title: 'Continue as Customer',
    description: 'Open the buyer dashboard and browse the marketplace flow.',
    href: '/buyer',
    icon: UserRound,
  },
  {
    title: 'Continue as Vendor',
    description: 'Jump directly into catalog, orders, and payout views.',
    href: '/vendor',
    icon: Store,
  },
  {
    title: 'Continue as Admin',
    description: 'Open the command center, approvals, and platform tools.',
    href: '/admin',
    icon: BriefcaseBusiness,
  },
];

export default async function LoginPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await props.searchParams;

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-stone-200 bg-white p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.32)] sm:p-10">
        <div className="absolute left-0 top-0 h-2 w-full bg-primary" />

        <div className="space-y-3 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f3ede4]">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-900">Preview Access</h1>
          <p className="mx-auto max-w-xl text-stone-600">
            Authentication is temporarily bypassed for development. Choose a role below and go straight into the matching dashboard.
          </p>
        </div>

        {params?.message && typeof params.message === 'string' && (
          <p className="mt-6 rounded-2xl bg-amber-50 p-4 text-center text-sm font-medium text-amber-700">
            {params.message}
          </p>
        )}

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {previewRoles.map((role) => {
            const Icon = role.icon;
            return (
              <Link
                key={role.href}
                href={role.href}
                className="group rounded-[1.5rem] border border-stone-200 bg-[linear-gradient(180deg,_#fff,_#faf7f2)] p-5 transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100">
                  <Icon className="h-5 w-5 text-slate-900" />
                </div>
                <h2 className="mt-5 text-lg font-bold tracking-tight text-slate-900">{role.title}</h2>
                <p className="mt-2 text-sm leading-6 text-stone-600">{role.description}</p>
                <div className="mt-5 flex items-center text-sm font-semibold text-primary">
                  Enter dashboard
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>

        <p className="mt-8 text-center text-sm text-stone-500">
          Real sign-in can be re-enabled later from the auth flow without changing these dashboard routes.
        </p>
      </div>
    </div>
  );
}
