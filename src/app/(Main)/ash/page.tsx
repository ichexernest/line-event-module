'use client'
import { useState } from 'react'
import AdminPanel from '@/components/AdminPanel'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleAuthChange = (authenticated: boolean) => {
    console.log('Authenticated:', isAuthenticated)
    setIsAuthenticated(authenticated)
  }

  return (
    <AdminPanel onAuthChange={handleAuthChange} />
  )
}