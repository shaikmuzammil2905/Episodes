'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, Users, Tags, Languages, Layers, LogOut, Home, LayoutDashboard, LayoutList, Menu, X } from 'lucide-react'

export default function AdminSidebar({ userEmail }: { userEmail: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/stories', icon: BookOpen, label: 'Stories' },
    { href: '/admin/episodes', icon: LayoutList, label: 'Episodes' },
    { href: '/admin/categories', icon: Layers, label: 'Categories' },
    { href: '/admin/genres', icon: Tags, label: 'Genres' },
    { href: '/admin/authors', icon: Users, label: 'Authors' },
    { href: '/admin/languages', icon: Languages, label: 'Languages' },
  ]

  const SidebarContent = () => (
    <>
      <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
        <Link href="/admin" className="text-xl font-bold text-[#f55139]">
          StoryEpisodes Admin
        </Link>
        <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-500 hover:text-gray-700">
          <X className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
            return (
              <li key={item.href}>
                <Link 
                  href={item.href} 
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-3 py-2 rounded-md ${isActive ? 'bg-[#f55139] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 truncate mr-2">{userEmail}</span>
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
    </>
  )

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-gray-200 h-16 px-4">
        <Link href="/admin" className="text-xl font-bold text-[#f55139]">
          StoryEpisodes
        </Link>
        <button onClick={() => setIsOpen(true)} className="text-gray-500 hover:text-gray-700">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <SidebarContent />
      </aside>
    </>
  )
}
