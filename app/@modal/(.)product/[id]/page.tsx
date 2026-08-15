import { getProduct } from '@/lib/data'
import { notFound } from 'next/navigation'
import QuickViewModal from '@/components/quick-view-modal'

export const dynamic = 'force-dynamic'

export default async function ModalProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getProduct(id)
  if (!product) notFound()
  return <QuickViewModal product={product} />
}