'use client'

import { useState } from 'react'
import PasswordPrompt from './components/auth/PasswordPrompt'
import DirectoryList from './components/admin/DirectoryList'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  if (!isAuthenticated) {
    return <PasswordPrompt onSuccess={() => setIsAuthenticated(true)} />
  }

  return <DirectoryList onLogout={() => setIsAuthenticated(false)} />
}
