import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { Alert, Button, Card, EmptyState, Loading, PageTitle } from '../components/ui'
import { useCurrentUser } from '../context/currentUser'
import { queryKeys, useCart } from '../hooks'
import { errorMessage, formatPrice } from '../utils'

export default function CartPage() {
  const { userId } = useCurrentUser()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { data: cart, isLoading, error } = useCart()

  const removeItem = useMutation({
    mutationFn: (productId: number) => api.removeFromCart(userId!, productId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.cart(userId) }),
  })

  const createOrder = useMutation({
    mutationFn: () => api.createOrder(userId!),
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart(userId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.orders(userId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.products })
      navigate(`/orders/${order.id}`, { state: { justCreated: true } })
    },
  })

  if (!userId) return <Alert kind="info">Sepeti görmek için sağ üstten bir kullanıcı seçin.</Alert>
  if (isLoading) return <Loading />
  if (error) return <Alert>Sepet yüklenemedi: {errorMessage(error)}</Alert>

  if (!cart || cart.length === 0) {
    return (
      <>
        <PageTitle>Sepetim</PageTitle>
        <EmptyState>
          Sepetiniz boş.
          <Link to="/" className="text-indigo-600 hover:underline">
            Alışverişe başla →
          </Link>
        </EmptyState>
      </>
    )
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0)

  return (
    <>
      <PageTitle>Sepetim</PageTitle>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="divide-y divide-slate-100 lg:col-span-2">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4">
              <div className="flex-1">
                <Link to={`/products/${item.productId}`} className="font-medium text-slate-900 hover:text-indigo-600">
                  {item.productName}
                </Link>
                <p className="text-sm text-slate-500">
                  {item.quantity} × {formatPrice(item.unitPrice)}
                </p>
              </div>
              <span className="font-semibold">{formatPrice(item.price)}</span>
              <Button
                variant="danger"
                disabled={removeItem.isPending}
                onClick={() => removeItem.mutate(item.productId)}
              >
                Kaldır
              </Button>
            </div>
          ))}
        </Card>

        <Card className="flex h-fit flex-col gap-4 p-6">
          <h2 className="text-lg font-semibold">Sipariş özeti</h2>
          <div className="flex justify-between text-slate-600">
            <span>Ürün adedi</span>
            <span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
          </div>
          <div className="flex justify-between border-t border-slate-100 pt-4 text-lg font-bold">
            <span>Toplam</span>
            <span>{formatPrice(total)}</span>
          </div>
          <Button disabled={createOrder.isPending} onClick={() => createOrder.mutate()}>
            {createOrder.isPending ? 'Sipariş veriliyor...' : 'Siparişi ver'}
          </Button>
          {createOrder.isError && (
            <Alert>Sipariş oluşturulamadı. Sepetteki bazı ürünlerin stoğu yetersiz veya satıştan kaldırılmış olabilir.</Alert>
          )}
          {removeItem.isError && <Alert>{errorMessage(removeItem.error)}</Alert>}
        </Card>
      </div>
    </>
  )
}
