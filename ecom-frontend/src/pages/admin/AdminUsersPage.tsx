import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { api } from '../../api/client'
import type { Address, User, UserRequest } from '../../api/types'
import { Alert, Button, Card, Input, Loading, PageTitle } from '../../components/ui'
import { useCurrentUser } from '../../context/currentUser'
import { queryKeys } from '../../hooks'
import { errorMessage } from '../../utils'

const emptyAddress: Address = { street: '', city: '', state: '', country: '', zipCode: '' }

const toForm = (user: User | null): UserRequest => ({
  firstName: user?.firstName ?? '',
  lastName: user?.lastName ?? '',
  email: user?.email ?? '',
  phone: user?.phone ?? '',
  address: { ...emptyAddress, ...user?.address },
})

function UserForm({ user, onDone }: { user: User | null; onDone: () => void }) {
  const queryClient = useQueryClient()
  const [form, setForm] = useState<UserRequest>(toForm(user))

  const save = useMutation({
    mutationFn: (body: UserRequest) => (user ? api.updateUser(user.id, body) : api.createUser(body)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users })
      onDone()
    },
  })

  const set = (key: keyof Omit<UserRequest, 'address'>, value: string) => setForm({ ...form, [key]: value })
  const setAddress = (key: keyof Address, value: string) =>
    setForm({ ...form, address: { ...form.address, [key]: value } })

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    // Adres alanlarının hepsi boşsa adres gönderilmez
    const hasAddress = Object.values(form.address ?? {}).some((value) => value?.trim())
    save.mutate({ ...form, address: hasAddress ? form.address : undefined })
  }

  return (
    <Card className="mb-6 p-6">
      <h2 className="mb-4 text-lg font-semibold">
        {user ? `Kullanıcıyı düzenle: ${user.firstName} ${user.lastName}` : 'Yeni kullanıcı'}
      </h2>
      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
        <Input label="Ad" required value={form.firstName} onChange={(e) => set('firstName', e.target.value)} />
        <Input label="Soyad" required value={form.lastName} onChange={(e) => set('lastName', e.target.value)} />
        <Input label="E-posta" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
        <Input label="Telefon" type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} />

        <h3 className="mt-2 font-medium text-slate-700 md:col-span-2">Adres</h3>
        <div className="md:col-span-2">
          <Input label="Sokak" value={form.address?.street} onChange={(e) => setAddress('street', e.target.value)} />
        </div>
        <Input label="Şehir" value={form.address?.city} onChange={(e) => setAddress('city', e.target.value)} />
        <Input label="İlçe / Eyalet" value={form.address?.state} onChange={(e) => setAddress('state', e.target.value)} />
        <Input label="Ülke" value={form.address?.country} onChange={(e) => setAddress('country', e.target.value)} />
        <Input label="Posta kodu" value={form.address?.zipCode} onChange={(e) => setAddress('zipCode', e.target.value)} />

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

export default function AdminUsersPage() {
  const queryClient = useQueryClient()
  const { userId, setUserId } = useCurrentUser()
  const [editing, setEditing] = useState<User | 'new' | null>(null)

  const { data: users, isLoading, error } = useQuery({ queryKey: queryKeys.users, queryFn: api.getUsers })

  const remove = useMutation({
    mutationFn: api.deleteUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.users }),
  })

  return (
    <>
      <PageTitle action={editing === null && <Button onClick={() => setEditing('new')}>+ Yeni kullanıcı</Button>}>
        Kullanıcılar
      </PageTitle>

      {editing !== null && (
        <UserForm
          key={editing === 'new' ? 'new' : editing.id}
          user={editing === 'new' ? null : editing}
          onDone={() => setEditing(null)}
        />
      )}

      {isLoading && <Loading />}
      {error && <Alert>Kullanıcılar yüklenemedi: {errorMessage(error)}</Alert>}
      {remove.isError && (
        <div className="mb-4">
          <Alert>Kullanıcı silinemedi. Sepetinde ürün veya siparişi olan kullanıcılar silinemez.</Alert>
        </div>
      )}

      {users && (
        <Card className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="p-4 font-medium">#</th>
                <th className="p-4 font-medium">Ad Soyad</th>
                <th className="p-4 font-medium">E-posta</th>
                <th className="p-4 font-medium">Telefon</th>
                <th className="p-4 font-medium">Şehir</th>
                <th className="p-4 font-medium">Rol</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    Henüz kullanıcı yok. Alışveriş yapabilmek için bir kullanıcı oluşturun.
                  </td>
                </tr>
              )}
              {users.map((user) => (
                <tr key={user.id} className={user.id === userId ? 'bg-indigo-50/50' : ''}>
                  <td className="p-4">{user.id}</td>
                  <td className="p-4 font-medium">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">{user.phone}</td>
                  <td className="p-4">{user.address?.city}</td>
                  <td className="p-4">{user.role}</td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      {user.id !== userId && (
                        <Button variant="secondary" onClick={() => setUserId(user.id)}>
                          Bu kullanıcı ol
                        </Button>
                      )}
                      <Button variant="secondary" onClick={() => setEditing(user)}>
                        Düzenle
                      </Button>
                      <Button
                        variant="danger"
                        disabled={remove.isPending}
                        onClick={() =>
                          confirm(`${user.firstName} ${user.lastName} silinsin mi?`) && remove.mutate(user.id)
                        }
                      >
                        Sil
                      </Button>
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
