import type { CartItem, Order, Product, ProductRequest, User, UserRequest } from './types'

// Boş bırakılırsa istekler aynı adrese gider (Vite proxy / nginx /api'yi backend'e yönlendirir).
// Backend'e doğrudan gitmek için: VITE_API_URL=http://localhost:8081 (CORS ayarı backend'de var)
const BASE_URL = import.meta.env.VITE_API_URL ?? ''

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function request<T>(path: string, options: RequestInit = {}, userId?: string): Promise<T> {
  const headers = new Headers(options.headers)
  if (options.body) headers.set('Content-Type', 'application/json')
  if (userId) headers.set('X-User-ID', userId)

  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers })
  const text = await response.text()

  if (!response.ok) {
    throw new ApiError(response.status, text || `İstek başarısız (${response.status})`)
  }
  if (!text) return undefined as T

  // Bazı endpoint'ler JSON yerine düz metin döndürüyor ("User added successfully" gibi)
  try {
    return JSON.parse(text) as T
  } catch {
    return text as T
  }
}

const json = (body: unknown) => JSON.stringify(body)

export const api = {
  // Users
  getUsers: () => request<User[]>('/api/users'),
  getUser: (id: string) => request<User>(`/api/users/${id}`),
  createUser: (body: UserRequest) => request<string>('/api/users', { method: 'POST', body: json(body) }),
  updateUser: (id: string, body: UserRequest) =>
    request<string>(`/api/users/${id}`, { method: 'PUT', body: json(body) }),
  deleteUser: (id: string) => request<string>(`/api/users/${id}`, { method: 'DELETE' }),

  // Products
  getActiveProducts: () => request<Product[]>('/api/products/allActive'),
  getAllProducts: () => request<Product[]>('/api/products/allProducts'),
  getProduct: (id: number) => request<Product>(`/api/products/${id}`),
  searchProducts: (keyword: string) =>
    request<Product[]>(`/api/products/search?keyword=${encodeURIComponent(keyword)}`),
  createProduct: (body: ProductRequest) => request<Product>('/api/products', { method: 'POST', body: json(body) }),
  updateProduct: (id: number, body: ProductRequest) =>
    request<Product>(`/api/products/${id}`, { method: 'PUT', body: json(body) }),
  deleteProduct: (id: number) => request<void>(`/api/products/${id}`, { method: 'DELETE' }),

  // Cart
  getCart: (userId: string) => request<CartItem[]>('/api/cart', {}, userId),
  addToCart: (userId: string, productId: number, quantity: number) =>
    request<string>('/api/cart', { method: 'POST', body: json({ productId, quantity }) }, userId),
  removeFromCart: (userId: string, productId: number) =>
    request<void>(`/api/cart/items/${productId}`, { method: 'DELETE' }, userId),

  // Orders
  createOrder: (userId: string) => request<Order>('/api/order', { method: 'POST' }, userId),
  getOrders: (userId: string) => request<Order[]>('/api/order', {}, userId),
  getOrder: (userId: string, id: number) => request<Order>(`/api/order/${id}`, {}, userId),
}
