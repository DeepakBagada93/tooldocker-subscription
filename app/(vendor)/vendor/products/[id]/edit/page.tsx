import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

import { getCategories } from '@/app/actions/products'
import { getVendorProductById } from '@/app/actions/vendor'
import { ProductForm } from '@/components/vendor/product-form'
import { Button } from '@/components/ui/button'
import { getVendorSubscriptionStatus } from '@/lib/subscriptions'

export default async function EditVendorProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [subscription, categories, product] = await Promise.all([
    getVendorSubscriptionStatus(),
    getCategories(),
    getVendorProductById(id),
  ])

  if (!product) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/vendor/products">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">Edit Product</h1>
          <p className="text-muted-foreground">Update your listing and keep it live on the storefront.</p>
        </div>
      </div>

      <ProductForm
        isLocked={!subscription.hasActiveSubscription}
        categories={categories.map((category) => ({ id: category.id, name: category.name }))}
        initialValues={product}
        mode="edit"
      />
    </div>
  )
}
