import { useQuery } from '@tanstack/react-query'
import { Link, useLocation, useParams } from 'react-router-dom'
import { api } from '../api/client'
import { Alert, Card, Loading, PageTitle, StatusBadge } from '../components/ui'
import { useCurrentUser } from '../context/currentUser'
import { queryKeys } from '../hooks'
import { errorMessage, formatDate, formatPrice } from '../utils'

export default function OrderDetailPage() {
  const orderId = Number(useParams().id)
  const justCreated = (useLocation().state as { justCreated?: boolean } | null)?.justCreated
  const { userId } = useCurrentUser()

  // Ürün adlarını göstermek için (sipariş DTO'sunda sadece productId var)
  const { data: products = [] } = useQuery({
    queryKey: [...queryKeys.products, 'all'],
    queryFn: api.getAllProducts,
  })
  const { data: order, isLoading, error } = useQuery({
    queryKey: [...queryKeys.orders(userId), orderId],
    queryFn: () => api.getOrder(userId!, orderId),
    enabled: !!userId,
  })

  if (!userId) return <Alert kind="info">Siparişi görmek için sağ üstten bir kullanıcı seçin.</Alert>
  if (isLoading) return <Loading />
  if (error || !order) return <Alert>Sipariş bulunamadı: {errorMessage(error)}</Alert>

  const productName = (id: number) => products.find((product) => product.id === id)?.name ?? `Ürün #${id}`

  return (
    <>
      <Link to="/orders" className="mb-4 inline-block text-sm text-indigo-600 hover:underline">
        ← Siparişlerime dön
      </Link>
      {justCreated && (
        <div className="mb-6">
          <Alert kind="success">Siparişiniz başarıyla oluşturuldu!</Alert>
        </div>
      )}
      <PageTitle action={<StatusBadge status={order.status} />}>Sipariş #{order.id}</PageTitle>
      <p className="-mt-4 mb-6 text-sm text-slate-500">{formatDate(order.createdAt)}</p>

      <Card className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-500">
            <tr>
              <th className="p-4 font-medium">Ürün</th>
              <th className="p-4 text-right font-medium">Birim fiyat</th>
              <th className="p-4 text-right font-medium">Adet</th>
              <th className="p-4 text-right font-medium">Ara toplam</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {order.items.map((item) => (
              <tr key={item.id}>
                <td className="p-4">
                  <Link to={`/products/${item.productId}`} className="hover:text-indigo-600">
                    {productName(item.productId)}
                  </Link>
                </td>
                <td className="p-4 text-right">{formatPrice(item.price)}</td>
                <td className="p-4 text-right">{item.quantity}</td>
                <td className="p-4 text-right font-medium">{formatPrice(item.subTotal)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t border-slate-200">
            <tr>
              <td colSpan={3} className="p-4 text-right font-semibold">
                Toplam
              </td>
              <td className="p-4 text-right text-lg font-bold">{formatPrice(order.totalAmount)}</td>
            </tr>
          </tfoot>
        </table>
      </Card>
    </>
  )
}
