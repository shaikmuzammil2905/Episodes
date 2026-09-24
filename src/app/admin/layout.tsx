import './admin.css'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminSidebar from './AdminSidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    // If not logged in, just render children (which should be the login page due to middleware)
    return <>{children}</>
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <AdminSidebar userEmail={user.email || ''} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col w-full">
        <div className="flex-1 bg-gray-50 p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
