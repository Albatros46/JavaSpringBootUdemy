import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './api/client'
import { useCurrentUser } from './context/currentUser'

export const queryKeys = {
  users: ['users'] as const,
  products: ['products'] as const,
  cart: (userId: string | null) => ['cart', userId] as const,
  orders: (userId: string | null) => ['orders', userId] as const,
}

export function useCart() {
  const { userId } = useCurrentUser()
  return useQuery({
    queryKey: queryKeys.cart(userId),
    queryFn: () => api.getCart(userId!),
    enabled: !!userId,
  })
}

export function useAddToCart() {
  const { userId } = useCurrentUser()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) => {
      if (!userId) throw new Error('Sepete eklemek için önce sağ üstten bir kullanıcı seçin')
      return api.addToCart(userId, productId, quantity)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.cart(userId) }),
  })
}
