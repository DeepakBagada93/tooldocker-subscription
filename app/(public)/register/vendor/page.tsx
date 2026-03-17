import Link from 'next/link'
import { ArrowRight, BadgeCheck, Building2, FileUp, ShieldCheck } from 'lucide-react'

import { signup } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SUBSCRIPTION_PLANS } from '@/lib/subscription-plans'

const complianceDocuments = [
  'Business registration certificate',
  'Tax registration or GST/VAT document',
  'Primary contact ID proof',
  'Bank account proof or cancelled cheque',
  'Product catalog sheet or sample SKU list',
]

export default async function VendorRegisterPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await props.searchParams

  return (
    <div className="bg-[linear-gradient(180deg,#faf8f4_0%,#ffffff_40%,#f5efe6_100%)] px-4 py-12">
      <div className="mx-auto grid max-w-7xl gap-8 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <section className="overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-[0_30px_80px_-40px_rgba(15,23,42,0.28)]">
          <div className="h-2 w-full bg-primary" />
          <div className="space-y-8 p-6 sm:p-8">
            <div className="space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f3ede4]">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-3">
                <h1 className="text-4xl font-semibold tracking-[-0.05em] text-slate-900">Vendor onboarding built around plans, business review, and document checks.</h1>
                <p className="max-w-2xl text-base leading-7 text-stone-600">
                  Choose the plan that fits your catalog, create your vendor account, and submit the business details our team needs to verify your store before listings go live.
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              {SUBSCRIPTION_PLANS.map((plan) => (
                <div key={plan.id} className="rounded-[1.75rem] border border-stone-200 bg-[linear-gradient(180deg,_#fff,_#faf7f2)] p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-[0.24em] text-stone-500">{plan.interval}</div>
                      <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">{plan.name}</h2>
                      <p className="mt-2 max-w-xl text-sm leading-6 text-stone-600">{plan.description}</p>
                    </div>
                    <div className="rounded-2xl bg-stone-100 px-4 py-3 text-right">
                      <div className="text-3xl font-black tracking-tight text-slate-900">${plan.price}</div>
                      <div className="text-xs uppercase tracking-[0.2em] text-stone-500">{plan.productLimit} product slots</div>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {plan.features.map((feature) => (
                      <div key={feature.label} className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-sm text-stone-700">
                        <BadgeCheck className={`h-4 w-4 shrink-0 ${feature.included ? 'text-emerald-500' : 'text-stone-300'}`} />
                        <span>{feature.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-[1.75rem] border border-primary/20 bg-primary/5 p-5">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.22em] text-primary">
                <FileUp className="h-4 w-4" />
                Verification checklist
              </div>
              <div className="mt-4 space-y-3">
                {complianceDocuments.map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-stone-700">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-[0_30px_80px_-40px_rgba(15,23,42,0.28)]">
          <div className="h-2 w-full bg-primary" />
          <div className="space-y-8 p-6 sm:p-8">
            <div className="space-y-3">
              <div className="inline-flex items-center rounded-full bg-stone-100 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-600">
                Vendor account setup
              </div>
              <h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-900">Create your vendor account and submit business details.</h2>
              <p className="text-sm leading-6 text-stone-600">
                This form captures the details needed for account creation and vendor review. Once approved, your team can move into the vendor dashboard and start publishing products.
              </p>
            </div>

            <form action={signup} className="space-y-8">
              <input type="hidden" name="role" value="vendor" />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-[0.22em] text-stone-500">Full name</label>
                  <Input name="full_name" placeholder="Aarav Sharma" className="h-12 rounded-xl" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-[0.22em] text-stone-500">Work email</label>
                  <Input name="email" type="email" placeholder="vendor@company.com" className="h-12 rounded-xl" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-[0.22em] text-stone-500">Password</label>
                  <Input name="password" type="password" placeholder="........" className="h-12 rounded-xl" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-[0.22em] text-stone-500">Preferred plan</label>
                  <select name="selected_plan" className="h-12 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" defaultValue="plan-growth-monthly">
                    {SUBSCRIPTION_PLANS.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name} - {plan.interval} - ${plan.price}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-[0.22em] text-stone-500">Business name</label>
                  <Input name="company_name" placeholder="Tooldocker Industrial Supplies" className="h-12 rounded-xl" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-[0.22em] text-stone-500">Legal entity name</label>
                  <Input name="legal_name" placeholder="Tooldocker Industrial Supplies Pvt Ltd" className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-[0.22em] text-stone-500">Phone number</label>
                  <Input name="phone" placeholder="+91 98765 43210" className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-[0.22em] text-stone-500">GST / Tax ID</label>
                  <Input name="tax_id" placeholder="29ABCDE1234F1Z5" className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-[0.22em] text-stone-500">Country</label>
                  <Input name="country" placeholder="India" className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-[0.22em] text-stone-500">City / State</label>
                  <Input name="location" placeholder="Ahmedabad, Gujarat" className="h-12 rounded-xl" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-[0.22em] text-stone-500">Website</label>
                  <Input name="website" placeholder="https://yourcompany.com" className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-[0.22em] text-stone-500">Primary category</label>
                  <select name="category_focus" className="h-12 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" defaultValue="Power Tools">
                    {['Power Tools', 'Heavy Machinery', 'Industrial Parts', 'Safety Gear', 'Welding Equipment'].map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-[0.22em] text-stone-500">Business address</label>
                  <textarea
                    name="business_address"
                    className="min-h-28 w-full rounded-xl border border-input bg-background px-3 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Warehouse address, office address, and billing location"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-[0.22em] text-stone-500">Business summary</label>
                  <textarea
                    name="business_summary"
                    className="min-h-32 w-full rounded-xl border border-input bg-background px-3 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Share what you sell, expected catalog size, certifications, manufacturing capability, and shipping regions."
                  />
                </div>
              </div>

              <div className="rounded-[1.6rem] border border-stone-200 bg-[linear-gradient(180deg,_#fff,_#faf7f2)] p-5">
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.22em] text-slate-900">
                  <Building2 className="h-4 w-4 text-primary" />
                  Upload relevant documents
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-[0.22em] text-stone-500">Business registration</label>
                    <Input type="file" name="business_registration_file" className="h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-[0.22em] text-stone-500">Tax document</label>
                    <Input type="file" name="tax_document_file" className="h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-[0.22em] text-stone-500">Owner ID proof</label>
                    <Input type="file" name="owner_id_file" className="h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-[0.22em] text-stone-500">Bank proof</label>
                    <Input type="file" name="bank_proof_file" className="h-12 rounded-xl" />
                  </div>
                </div>
                <p className="mt-4 text-xs leading-6 text-stone-500">
                  Files are shown here for the onboarding flow. You can wire them to storage or a review table next if you want full document submission handling.
                </p>
              </div>

              <div className="space-y-4">
                <label className="flex items-start gap-3 text-sm text-stone-600">
                  <input type="checkbox" required className="mt-1 h-4 w-4 rounded border-stone-300 text-primary focus:ring-primary" />
                  <span>I confirm the submitted business details are correct and I have permission to register this company on Tooldocker.</span>
                </label>
                <label className="flex items-start gap-3 text-sm text-stone-600">
                  <input type="checkbox" required className="mt-1 h-4 w-4 rounded border-stone-300 text-primary focus:ring-primary" />
                  <span>I agree to the marketplace terms, vendor policy, and verification review process before my account is approved.</span>
                </label>
              </div>

              {params?.message && typeof params.message === 'string' && (
                <p className="rounded-2xl bg-amber-50 p-4 text-sm font-medium text-amber-700">
                  {params.message}
                </p>
              )}

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button type="submit" variant="industrial" className="h-12 rounded-xl px-6 text-base font-bold">
                  Create Vendor Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button asChild variant="outline" className="h-12 rounded-xl border-stone-300 bg-white px-6 text-base">
                  <Link href="/login">Back to access options</Link>
                </Button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  )
}
