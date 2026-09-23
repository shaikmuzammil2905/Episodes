'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, Users, Tags, Languages, Layers, LogOut, Home, LayoutDashboard, LayoutList, Menu, X } from 'lucide-react'

export default function AdminSidebar({ userEmail }: { userEmail: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Prevent body scrolling when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

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
      <div className="h-16 shrink-0 flex items-center justify-between px-6 border-b border-gray-200">
        <Link href="/admin" className="text-xl font-bold text-[#f55139]">
          StoryEpisodes
        </Link>
        {/* Mobile close button inside drawer */}
        <button 
          onClick={() => setIsOpen(false)} 
          className="md:hidden p-2 -mr-2 text-gray-500 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f55139]"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3 m-0 list-none">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
            return (
              <li key={item.href} className="m-0 p-0 list-none">
                <Link 
                  href={item.href} 
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-[#f55139] text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}
                >
                  <Icon className="w-5 h-5 mr-3 shrink-0" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200 shrink-0">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 truncate mr-2 font-medium">{userEmail}</span>
          <form action="/auth/signout" method="post">
            <button type="submit" className="p-2 text-gray-400 hover:text-gray-700 rounded-md transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </form>
        </div>
        <div className="mt-4">
          <Link href="/" className="flex items-center text-sm font-medium text-[#f55139] hover:text-[#e0452d] transition-colors">
            <Home className="w-4 h-4 mr-2" />
            View Public Site
          </Link>
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Top Header (Always visible on mobile, pushes content down) */}
      <div className="md:hidden shrink-0 flex items-center justify-between bg-white border-b border-gray-200 h-16 px-4 sticky top-0 z-30">
        <Link href="/admin" className="text-lg font-bold text-[#f55139] truncate pr-4">
          StoryEpisodes Admin
        </Link>
        <button 
          onClick={() => setIsOpen(true)} 
          className="p-2 -mr-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f55139]"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Sidebar Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Sidebar Drawer (Off-canvas) */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-[280px] max-w-[85vw] bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}
      >
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar (Static) */}
      <aside className="w-64 shrink-0 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <SidebarContent />
      </aside>
    </>
  )
}
