import { createContext, useContext } from 'react'

export interface CurrentUserContextValue {
  userId: string | null
  setUserId: (id: string | null) => void
}

export const CurrentUserContext = createContext<CurrentUserContextValue | null>(null)

export function useCurrentUser() {
  const context = useContext(CurrentUserContext)
  if (!context) throw new Error('useCurrentUser must be used inside CurrentUserProvider')
  return context
}
