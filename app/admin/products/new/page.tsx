import { getCategories } from '@/lib/data'
import ProductForm from '@/components/product-form'

export default async function NewProductPage() {
  const categories = await getCategories()

  return (
    <div>
      <h2 className="text-lg font-semibold">Nuevo producto</h2>
      <div className="mt-4">
        <ProductForm
          action="create"
          categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        />
      </div>
    </div>
  )
}
