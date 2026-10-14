import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/client'
import { Alert, Button, Card, Loading, ProductImage } from '../components/ui'
import { queryKeys, useAddToCart } from '../hooks'
import { errorMessage, formatPrice } from '../utils'

export default function ProductDetailPage() {
  const productId = Number(useParams().id)
  const [quantity, setQuantity] = useState(1)
  const addToCart = useAddToCart()

  const { data: product, isLoading, error } = useQuery({
    queryKey: [...queryKeys.products, productId],
    queryFn: () => api.getProduct(productId),
  })

  if (isLoading) return <Loading />
  if (error || !product) return <Alert>Ürün bulunamadı: {errorMessage(error)}</Alert>

  const available = product.active && product.stockQuantity > 0

  return (
    <>
      <Link to="/" className="mb-4 inline-block text-sm text-indigo-600 hover:underline">
        ← Ürünlere dön
      </Link>
      <Card className="grid overflow-hidden md:grid-cols-2">
        <ProductImage src={product.imageUrl} alt={product.name} className="aspect-square w-full" />
        <div className="flex flex-col gap-4 p-8">
          {product.category && <span className="text-sm uppercase tracking-wide text-slate-400">{product.category}</span>}
          <h1 className="text-3xl font-semibold text-slate-900">{product.name}</h1>
          <p className="text-3xl font-bold text-indigo-600">{formatPrice(product.price)}</p>
          <p className="whitespace-pre-line text-slate-600">{product.description || 'Açıklama yok.'}</p>
          <p className={`text-sm ${available ? 'text-emerald-600' : 'text-red-600'}`}>
            {!product.active ? 'Bu ürün satıştan kaldırıldı' : available ? `Stokta ${product.stockQuantity} adet` : 'Tükendi'}
          </p>

          {available && (
            <div className="mt-auto flex items-center gap-3">
              <input
                type="number"
                aria-label="Adet"
                min={1}
                max={product.stockQuantity}
                value={quantity}
                onChange={(event) => setQuantity(Math.max(1, Number(event.target.value)))}
                className="w-20 rounded-lg border border-slate-300 px-3 py-2"
              />
              <Button
                className="flex-1"
                disabled={addToCart.isPending}
                onClick={() => addToCart.mutate({ productId: product.id, quantity })}
              >
                {addToCart.isPending ? 'Ekleniyor...' : 'Sepete ekle'}
              </Button>
            </div>
          )}
          {addToCart.isSuccess && (
            <Alert kind="success">
              Ürün sepete eklendi. <Link to="/cart" className="font-medium underline">Sepete git</Link>
            </Alert>
          )}
          {addToCart.isError && <Alert>{errorMessage(addToCart.error)}</Alert>}
        </div>
      </Card>
    </>
  )
}
