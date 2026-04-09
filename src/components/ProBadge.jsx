/**
 * ProBadge — shown in app headers when the user has an active Pro subscription.
 * Usage: <ProBadge />  (renders nothing if the user is not Pro)
 */
import { useAuth } from '../context/AuthContext'

export function ProBadge() {
  const { user } = useAuth()
  if (!user?.isPro) return null

  return (
    <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-900 text-xs font-extrabold px-2.5 py-1 rounded-full shadow-sm select-none">
      ★ PRO
    </span>
  )
}
