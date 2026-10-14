import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { Alert, Card, EmptyState, Loading, PageTitle, StatusBadge } from '../components/ui'
import { useCurrentUser } from '../context/currentUser'
import { queryKeys } from '../hooks'
import { errorMessage, formatDate, formatPrice } from '../utils'

export default function OrdersPage() {
  const { userId } = useCurrentUser()
  const { data: orders, isLoading, error } = useQuery({
    queryKey: queryKeys.orders(userId),
    queryFn: () => api.getOrders(userId!),
    enabled: !!userId,
  })

  if (!userId) return <Alert kind="info">Siparişleri görmek için sağ üstten bir kullanıcı seçin.</Alert>
  if (isLoading) return <Loading />
  if (error) return <Alert>Siparişler yüklenemedi: {errorMessage(error)}</Alert>

  return (
    <>
      <PageTitle>Siparişlerim</PageTitle>
      {orders?.length === 0 ? (
        <EmptyState>Henüz siparişiniz yok.</EmptyState>
      ) : (
        <Card className="divide-y divide-slate-100">
          {orders?.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="flex flex-wrap items-center gap-4 p-4 transition hover:bg-slate-50"
            >
              <span className="font-medium text-slate-900">Sipariş #{order.id}</span>
              <span className="text-sm text-slate-500">{formatDate(order.createdAt)}</span>
              <span className="text-sm text-slate-500">{order.items.length} kalem</span>
              <span className="ml-auto font-semibold">{formatPrice(order.totalAmount)}</span>
              <StatusBadge status={order.status} />
            </Link>
          ))}
        </Card>
      )}
    </>
  )
}
