import { useCallback, useState, type ReactNode } from 'react'
import { CurrentUserContext } from './currentUser'

// Backend'de henüz kimlik doğrulama yok; kullanıcı X-User-ID header'ı ile belirtiliyor.
// Seçilen kullanıcı tarayıcıda saklanır. Spring Security + JWT eklendiğinde burası login olacak.
const STORAGE_KEY = 'ecom.currentUserId'

export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const [userId, setUserIdState] = useState<string | null>(() => localStorage.getItem(STORAGE_KEY))

  const setUserId = useCallback((id: string | null) => {
    if (id) localStorage.setItem(STORAGE_KEY, id)
    else localStorage.removeItem(STORAGE_KEY)
    setUserIdState(id)
  }, [])

  return <CurrentUserContext.Provider value={{ userId, setUserId }}>{children}</CurrentUserContext.Provider>
}
