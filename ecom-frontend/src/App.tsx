import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { Alert } from './components/ui'
import CartPage from './pages/CartPage'
import OrderDetailPage from './pages/OrderDetailPage'
import OrdersPage from './pages/OrdersPage'
import ProductDetailPage from './pages/ProductDetailPage'
import ProductsPage from './pages/ProductsPage'
import AdminProductsPage from './pages/admin/AdminProductsPage'
import AdminUsersPage from './pages/admin/AdminUsersPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<ProductsPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="orders/:id" element={<OrderDetailPage />} />
        <Route path="admin/products" element={<AdminProductsPage />} />
        <Route path="admin/users" element={<AdminUsersPage />} />
        <Route path="*" element={<Alert>Sayfa bulunamadı.</Alert>} />
      </Route>
    </Routes>
  )
}
