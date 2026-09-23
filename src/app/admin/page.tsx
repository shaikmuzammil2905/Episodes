import { createClient } from '@/lib/supabase/server'
import { BookOpen, Languages, Layers, Tags, Users } from 'lucide-react'
import Link from 'next/link'

async function getStats() {
  const supabase = await createClient()

  const [
    { count: totalStories },
    { count: publishedStories },
    { count: totalEpisodes },
    { count: authors },
    { count: categories },
    { count: languages },
  ] = await Promise.all([
    supabase.from('stories').select('*', { count: 'exact', head: true }),
    supabase.from('stories').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('episodes').select('*', { count: 'exact', head: true }),
    supabase.from('authors').select('*', { count: 'exact', head: true }),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('languages').select('*', { count: 'exact', head: true }),
  ])

  return {
    totalStories: totalStories || 0,
    publishedStories: publishedStories || 0,
    totalEpisodes: totalEpisodes || 0,
    authors: authors || 0,
    categories: categories || 0,
    languages: languages || 0,
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Stories"
          value={stats.totalStories}
          icon={<BookOpen className="w-8 h-8 text-blue-500" />}
          subtext={`${stats.publishedStories} published`}
          link="/admin/stories"
        />
        <StatCard
          title="Total Episodes"
          value={stats.totalEpisodes}
          icon={<Layers className="w-8 h-8 text-indigo-500" />}
          link="/admin/episodes"
        />
        <StatCard
          title="Authors"
          value={stats.authors}
          icon={<Users className="w-8 h-8 text-green-500" />}
          link="/admin/authors"
        />
        <StatCard
          title="Categories"
          value={stats.categories}
          icon={<Tags className="w-8 h-8 text-yellow-500" />}
          link="/admin/categories"
        />
        <StatCard
          title="Languages"
          value={stats.languages}
          icon={<Languages className="w-8 h-8 text-purple-500" />}
          link="/admin/languages"
        />
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, subtext, link }: { title: string, value: number, icon: React.ReactNode, subtext?: string, link: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-start justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
        {subtext && <p className="text-sm text-gray-500 mt-1">{subtext}</p>}
        <div className="mt-4">
          <Link href={link} className="text-sm font-medium text-[#f55139] hover:text-[#e0452d]">
            View all →
          </Link>
        </div>
      </div>
      <div className="p-3 bg-gray-50 rounded-lg">
        {icon}
      </div>
    </div>
  )
}
