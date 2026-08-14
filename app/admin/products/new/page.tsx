import ProductForm from '@/components/product-form'

export default function NewProductPage() {
  return (
    <div>
      <h2 className="text-lg font-semibold">Nuevo producto</h2>
      <div className="mt-4">
        <ProductForm action="create" />
      </div>
    </div>
  )
}
