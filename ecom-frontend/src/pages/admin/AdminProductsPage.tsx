import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { api } from '../../api/client'
import type { Product, ProductRequest } from '../../api/types'
import { Alert, Button, Card, Input, Loading, PageTitle, TextArea } from '../../components/ui'
import { queryKeys } from '../../hooks'
import { errorMessage, formatPrice } from '../../utils'

const emptyForm: ProductRequest = { name: '', description: '', price: 0, stockQuantity: 0, category: '', imageUrl: '' }

function ProductForm({ product, onDone }: { product: Product | null; onDone: () => void }) {
  const queryClient = useQueryClient()
  const [form, setForm] = useState<ProductRequest>(product ?? emptyForm)

  const save = useMutation({
    mutationFn: (body: ProductRequest) => (product ? api.updateProduct(product.id, body) : api.createProduct(body)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products })
      onDone()
    },
  })

  const set = <K extends keyof ProductRequest>(key: K, value: ProductRequest[K]) => setForm({ ...form, [key]: value })

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    save.mutate(form)
  }

  return (
    <Card className="mb-6 p-6">
      <h2 className="mb-4 text-lg font-semibold">{product ? `Ürünü düzenle: ${product.name}` : 'Yeni ürün'}</h2>
      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
        <Input label="Ürün adı" required value={form.name} onChange={(e) => set('name', e.target.value)} />
        <Input label="Kategori" value={form.category ?? ''} onChange={(e) => set('category', e.target.value)} />
        <Input
          label="Fiyat (₺)"
          type="number"
          required
          min={0}
          step="0.01"
          value={form.price}
          onChange={(e) => set('price', Number(e.target.value))}
        />
        <Input
          label="Stok"
          type="number"
          required
          min={0}
          value={form.stockQuantity}
          onChange={(e) => set('stockQuantity', Number(e.target.value))}
        />
        <div className="md:col-span-2">
          <Input
            label="Görsel URL"
            type="url"
            placeholder="https://..."
            value={form.imageUrl ?? ''}
            onChange={(e) => set('imageUrl', e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <TextArea label="Açıklama" value={form.description ?? ''} onChange={(e) => set('description', e.target.value)} />
        </div>
        {save.isError && (
          <div className="md:col-span-2">
            <Alert>{errorMessage(save.error)}</Alert>
          </div>
        )}
        <div className="flex gap-2 md:col-span-2">
          <Button type="submit" disabled={save.isPending}>
            {save.isPending ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
          <Button type="button" variant="secondary" onClick={onDone}>
            Vazgeç
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default function AdminProductsPage() {
  const queryClient = useQueryClient()
  // null: form kapalı, 'new': yeni ürün, Product: düzenleme
  const [editing, setEditing] = useState<Product | 'new' | null>(null)

  const { data: products, isLoading, error } = useQuery({
    queryKey: [...queryKeys.products, 'all'],
    queryFn: api.getAllProducts,
  })

  const deactivate = useMutation({
    mutationFn: api.deleteProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.products }),
  })

  return (
    <>
      <PageTitle action={editing === null && <Button onClick={() => setEditing('new')}>+ Yeni ürün</Button>}>
        Ürün Yönetimi
      </PageTitle>

      {editing !== null && (
        <ProductForm
          key={editing === 'new' ? 'new' : editing.id}
          product={editing === 'new' ? null : editing}
          onDone={() => setEditing(null)}
        />
      )}

      {isLoading && <Loading />}
      {error && <Alert>Ürünler yüklenemedi: {errorMessage(error)}</Alert>}
      {deactivate.isError && <Alert>{errorMessage(deactivate.error)}</Alert>}

      {products && (
        <Card className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="p-4 font-medium">#</th>
                <th className="p-4 font-medium">Ad</th>
                <th className="p-4 font-medium">Kategori</th>
                <th className="p-4 text-right font-medium">Fiyat</th>
                <th className="p-4 text-right font-medium">Stok</th>
                <th className="p-4 font-medium">Durum</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    Henüz ürün yok.
                  </td>
                </tr>
              )}
              {products.map((product) => (
                <tr key={product.id} className={product.active ? '' : 'text-slate-400'}>
                  <td className="p-4">{product.id}</td>
                  <td className="p-4 font-medium">{product.name}</td>
                  <td className="p-4">{product.category}</td>
                  <td className="p-4 text-right">{formatPrice(product.price)}</td>
                  <td className="p-4 text-right">{product.stockQuantity}</td>
                  <td className="p-4">{product.active ? 'Aktif' : 'Pasif'}</td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <Button variant="secondary" onClick={() => setEditing(product)}>
                        Düzenle
                      </Button>
                      {product.active && (
                        <Button
                          variant="danger"
                          disabled={deactivate.isPending}
                          onClick={() => confirm(`"${product.name}" satıştan kaldırılsın mı?`) && deactivate.mutate(product.id)}
                        >
                          Pasife al
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </>
  )
}
