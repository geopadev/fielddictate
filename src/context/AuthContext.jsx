import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProfile(sessionUser) {
      if (!sessionUser) {
        setUser(null)
        setLoading(false)
        return
      }
      try {
        const { data } = await supabase
          .from('users')
          .select('subscription_active')
          .eq('id', sessionUser.id)
          .single()
        
        setUser({ ...sessionUser, isPro: data?.subscription_active || false })
      } catch (err) {
        setUser({ ...sessionUser, isPro: false })
      } finally {
        setLoading(false)
      }
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      fetchProfile(session?.user)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      fetchProfile(session?.user)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
