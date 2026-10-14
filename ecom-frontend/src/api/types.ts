// Spring Boot DTO'larının TypeScript karşılıkları

export type UserRole = 'CUSTOMER' | 'ADMIN' | 'SELLER'
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'

export interface Address {
  street?: string
  city?: string
  state?: string
  country?: string
  zipCode?: string
}

export interface User {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  role: UserRole
  address?: Address | null
}

export interface UserRequest {
  firstName: string
  lastName: string
  email?: string
  phone?: string
  address?: Address
}

export interface Product {
  id: number
  name: string
  description?: string
  price: number
  stockQuantity: number
  category?: string
  imageUrl?: string
  active: boolean
}

export interface ProductRequest {
  name: string
  description?: string
  price: number
  stockQuantity: number
  category?: string
  imageUrl?: string
}

export interface CartItem {
  id: number
  productId: number
  productName: string
  quantity: number
  unitPrice: number
  price: number
}

export interface OrderItem {
  id: number
  productId: number
  quantity: number
  price: number
  subTotal: number
}

export interface Order {
  id: number
  totalAmount: number
  status: OrderStatus
  items: OrderItem[]
  createdAt: string
}
