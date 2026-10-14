import { useQuery } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import type { Product } from '../api/types'
import { Alert, Button, Card, EmptyState, Loading, PageTitle, ProductImage } from '../components/ui'
import { queryKeys, useAddToCart } from '../hooks'
import { errorMessage, formatPrice } from '../utils'

function ProductCard({ product }: { product: Product }) {
  const addToCart = useAddToCart()
  const outOfStock = product.stockQuantity <= 0

  return (
    <Card className="flex flex-col overflow-hidden">
      <Link to={`/products/${product.id}`}>
        <ProductImage src={product.imageUrl} alt={product.name} className="aspect-[4/3] w-full" />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        {product.category && <span className="text-xs uppercase tracking-wide text-slate-400">{product.category}</span>}
        <Link to={`/products/${product.id}`} className="font-semibold text-slate-900 hover:text-indigo-600">
          {product.name}
        </Link>
        <p className="line-clamp-2 text-sm text-slate-500">{product.description}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-slate-900">{formatPrice(product.price)}</span>
          <span className={`text-xs ${outOfStock ? 'text-red-500' : 'text-slate-400'}`}>
            {outOfStock ? 'Tükendi' : `Stok: ${product.stockQuantity}`}
          </span>
        </div>
        <Button
          disabled={outOfStock || addToCart.isPending}
          onClick={() => addToCart.mutate({ productId: product.id, quantity: 1 })}
        >
          {addToCart.isPending ? 'Ekleniyor...' : addToCart.isSuccess ? 'Sepete eklendi ✓' : 'Sepete ekle'}
        </Button>
        {addToCart.isError && <p className="text-xs text-red-600">{errorMessage(addToCart.error)}</p>}
      </div>
    </Card>
  )
}

export default function ProductsPage() {
  const [searchInput, setSearchInput] = useState('')
  const [keyword, setKeyword] = useState('')

  const { data: products, isLoading, error } = useQuery({
    queryKey: [...queryKeys.products, 'active', keyword],
    queryFn: () => (keyword ? api.searchProducts(keyword) : api.getActiveProducts()),
  })

  const handleSearch = (event: FormEvent) => {
    event.preventDefault()
    setKeyword(searchInput.trim())
  }

  return (
    <>
      <PageTitle
        action={
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="search"
              placeholder="Ürün ara..."
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              className="w-64 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />
            <Button type="submit">Ara</Button>
          </form>
        }
      >
        {keyword ? `"${keyword}" için sonuçlar` : 'Ürünler'}
      </PageTitle>

      {isLoading && <Loading />}
      {error && <Alert>Ürünler yüklenemedi: {errorMessage(error)}</Alert>}
      {products && products.length === 0 && (
        <EmptyState>
          {keyword ? 'Aramanızla eşleşen ürün bulunamadı.' : 'Henüz ürün yok.'}
          <Link to="/admin/products" className="text-indigo-600 hover:underline">
            Ürün yönetiminden ürün ekleyin →
          </Link>
        </EmptyState>
      )}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products?.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </>
  )
}
