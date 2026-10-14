import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { api } from '../api/client'
import { useCurrentUser } from '../context/currentUser'
import { queryKeys, useCart } from '../hooks'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'
  }`

function UserSelect() {
  const { userId, setUserId } = useCurrentUser()
  const { data: users = [], isSuccess } = useQuery({ queryKey: queryKeys.users, queryFn: api.getUsers })

  // Seçili kullanıcı silinmişse seçimi temizle
  useEffect(() => {
    if (isSuccess && userId && !users.some((user) => user.id === userId)) setUserId(null)
  }, [isSuccess, users, userId, setUserId])

  return (
    <select
      aria-label="Aktif kullanıcı"
      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
      value={userId ?? ''}
      onChange={(event) => setUserId(event.target.value || null)}
    >
      <option value="">Kullanıcı seçin</option>
      {users.map((user) => (
        <option key={user.id} value={user.id}>
          {user.firstName} {user.lastName}
        </option>
      ))}
    </select>
  )
}

export default function Layout() {
  const { data: cart = [] } = useCart()
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-3">
          <Link to="/" className="text-lg font-bold text-indigo-600">
            E-Ticaret
          </Link>
          <nav className="flex flex-1 flex-wrap gap-1">
            <NavLink to="/" end className={navLinkClass}>
              Ürünler
            </NavLink>
            <NavLink to="/cart" className={navLinkClass}>
              Sepet
              {cartCount > 0 && (
                <span className="ml-1.5 rounded-full bg-indigo-600 px-2 py-0.5 text-xs text-white">{cartCount}</span>
              )}
            </NavLink>
            <NavLink to="/orders" className={navLinkClass}>
              Siparişlerim
            </NavLink>
            <NavLink to="/admin/products" className={navLinkClass}>
              Ürün Yönetimi
            </NavLink>
            <NavLink to="/admin/users" className={navLinkClass}>
              Kullanıcılar
            </NavLink>
          </nav>
          <UserSelect />
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
