import { useState, useEffect } from 'react'

export function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check local storage first
    const saved = localStorage.getItem('fielddictate-theme')
    if (saved !== null) {
      return saved === 'dark'
    }
    // Default to true (Dark Mode Default) as per requirements
    return true
  })

  useEffect(() => {
    const root = window.document.documentElement
    if (isDarkMode) {
      root.classList.add('dark')
      localStorage.setItem('fielddictate-theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('fielddictate-theme', 'light')
    }
  }, [isDarkMode])

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode)

  return [isDarkMode, toggleDarkMode]
}
