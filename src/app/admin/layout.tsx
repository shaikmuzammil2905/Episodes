import './admin.css'
import Link from 'next/link'
import { BookOpen, Users, Tags, Languages, Layers, LogOut, Home, LayoutDashboard, LayoutList } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

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
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <Link href="/admin" className="text-xl font-bold text-[#f55139]">
            StoryEpisodes Admin
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            <li>
              <Link href="/admin" className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100">
                <LayoutDashboard className="w-5 h-5 mr-3" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/admin/stories" className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100">
                <BookOpen className="w-5 h-5 mr-3" />
                Stories
              </Link>
            </li>
            <li>
              <Link href="/admin/episodes" className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100">
                <LayoutList className="w-5 h-5 mr-3" />
                Episodes
              </Link>
            </li>
            <li>
              <Link href="/admin/categories" className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100">
                <Layers className="w-5 h-5 mr-3" />
                Categories
              </Link>
            </li>
            <li>
              <Link href="/admin/genres" className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100">
                <Tags className="w-5 h-5 mr-3" />
                Genres
              </Link>
            </li>
            <li>
              <Link href="/admin/authors" className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100">
                <Users className="w-5 h-5 mr-3" />
                Authors
              </Link>
            </li>
            <li>
              <Link href="/admin/languages" className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100">
                <Languages className="w-5 h-5 mr-3" />
                Languages
              </Link>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 truncate mr-2">{user.email}</span>
            <form action="/auth/signout" method="post">
              <button type="submit" className="text-gray-400 hover:text-gray-600">
                <LogOut className="w-5 h-5" />
              </button>
            </form>
          </div>
          <div className="mt-4">
             <Link href="/" className="flex items-center text-sm text-[#f55139] hover:underline">
                <Home className="w-4 h-4 mr-2" />
                View Public Site
              </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
