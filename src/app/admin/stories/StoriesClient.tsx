'use client'

import { useState } from 'react'
import { createStory, updateStory, deleteStory } from '@/actions/stories'
import { Plus, Edit2, Trash2, Check, X, BookOpen, Eye, Star, TrendingUp, Flame, Search } from 'lucide-react'
import { ImageUpload } from '@/components/ImageUpload'
import Image from 'next/image'
import Link from 'next/link'

interface StoryRow {
  id: string; title: string; slug: string; short_synopsis: string | null; full_synopsis: string | null
  author_id: string | null; language_id: string | null; category_id: string | null
  status: string; access_type: string; cover_url: string | null; cover_public_id: string | null
  featured: boolean; popular: boolean; trending: boolean; display_order: number
  seo_title: string | null; seo_description: string | null
  created_at: string; published_at: string | null
  author: { id: string; name: string } | null
  language: { id: string; name: string } | null
  category: { id: string; name: string } | null
  story_genres: { genre_id: string; genres: { id: string; name: string } }[]
}

interface RefData { authors: { id: string; name: string }[]; languages: { id: string; name: string }[]; categories: { id: string; name: string }[]; genres: { id: string; name: string }[] }

const defaultForm = {
  title: '', slug: '', short_synopsis: '', full_synopsis: '', author_id: '', language_id: '', category_id: '',
  status: 'draft', access_type: 'free', cover_url: '', cover_public_id: '', featured: 'false', popular: 'false', trending: 'false',
  seo_title: '', seo_description: '', genre_ids: ''
}

export default function StoriesClient({ initialStories, refData }: { initialStories: StoryRow[]; refData: RefData }) {
  const [stories, setStories] = useState<StoryRow[]>(initialStories)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState(defaultForm)
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const resetForm = () => { setFormData(defaultForm); setSelectedGenres([]); setShowForm(false); setEditingId(null) }
  const showMsg = (type: 'success' | 'error', text: string) => { setMessage({ type, text }); setTimeout(() => setMessage(null), 3000) }
  const generateSlug = (t: string) => t.toLowerCase().replace(/[^a-z0-9\u0C00-\u0C7F]+/g, '-').replace(/(^-|-$)/g, '')

  const filteredStories = stories.filter(s => {
    if (searchQuery && !s.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (statusFilter && s.status !== statusFilter) return false
    return true
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.slug) { showMsg('error', 'Title and slug are required.'); return }
    setLoading(true)
    const fd = new FormData()
    Object.entries(formData).forEach(([k, v]) => fd.append(k, v))
    fd.set('genre_ids', selectedGenres.join(','))
    const result = editingId ? await updateStory(editingId, fd) : await createStory(fd)
    if (result.error) showMsg('error', result.error)
    else {
      showMsg('success', editingId ? 'Story updated successfully.' : 'Story created successfully.')
      const res = await fetch('/api/stories')
      if (res.ok) setStories(await res.json()); else window.location.reload()
      resetForm()
    }
    setLoading(false)
  }

  const handleEdit = (s: StoryRow) => {
    setFormData({
      title: s.title, slug: s.slug, short_synopsis: s.short_synopsis || '', full_synopsis: s.full_synopsis || '',
      author_id: s.author_id || '', language_id: s.language_id || '', category_id: s.category_id || '',
      status: s.status, access_type: s.access_type, cover_url: s.cover_url || '', cover_public_id: s.cover_public_id || '',
      featured: String(s.featured), popular: String(s.popular), trending: String(s.trending),
      seo_title: s.seo_title || '', seo_description: s.seo_description || '', genre_ids: ''
    })
    setSelectedGenres(s.story_genres?.map(sg => sg.genre_id) || [])
    setEditingId(s.id); setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this story? All associated episodes will also be deleted.')) return
    setLoading(true)
    const result = await deleteStory(id)
    if (result.error) showMsg('error', result.error); else { showMsg('success', 'Story deleted.'); setStories(prev => prev.filter(s => s.id !== id)) }
    setLoading(false)
  }

  const toggleGenre = (gid: string) => setSelectedGenres(prev => prev.includes(gid) ? prev.filter(x => x !== gid) : [...prev, gid])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Stories</h1>
        <button onClick={() => { resetForm(); setShowForm(true) }} className="inline-flex items-center px-4 py-2 bg-[#f55139] text-white text-sm font-medium rounded-lg hover:bg-[#e0452d]"><Plus className="w-4 h-4 mr-2" /> Add Story</button>
      </div>
      {message && <div className={`mb-4 p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{message.text}</div>}

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">{editingId ? 'Edit Story' : 'Add Story'}</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Title *</label><input type="text" value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value, slug: generateSlug(e.target.value) }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f55139]" required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label><input type="text" value={formData.slug} onChange={e => setFormData(p => ({ ...p, slug: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f55139]" required /></div>
            </div>

            <div><label className="block text-sm font-medium text-gray-700 mb-1">Short Synopsis</label><textarea value={formData.short_synopsis} onChange={e => setFormData(p => ({ ...p, short_synopsis: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f55139]" rows={2} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Synopsis</label><textarea value={formData.full_synopsis} onChange={e => setFormData(p => ({ ...p, full_synopsis: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f55139]" rows={4} /></div>

            {/* Assignments */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Author</label><select value={formData.author_id} onChange={e => setFormData(p => ({ ...p, author_id: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f55139]"><option value="">Select Author</option>{refData.authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Language</label><select value={formData.language_id} onChange={e => setFormData(p => ({ ...p, language_id: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f55139]"><option value="">Select Language</option>{refData.languages.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}</select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label><select value={formData.category_id} onChange={e => setFormData(p => ({ ...p, category_id: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f55139]"><option value="">Select Category</option>{refData.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
            </div>

            {/* Genres */}
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Genres</label>
              <div className="flex flex-wrap gap-2">{refData.genres.map(g => (
                <button key={g.id} type="button" onClick={() => toggleGenre(g.id)} className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${selectedGenres.includes(g.id) ? 'bg-[#f55139] text-white border-[#f55139]' : 'bg-white text-gray-600 border-gray-300 hover:border-[#f55139]'}`}>{g.name}</button>
              ))}</div>
            </div>

            {/* Status & Access */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Status</label><select value={formData.status} onChange={e => setFormData(p => ({ ...p, status: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f55139]"><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Access Type</label><select value={formData.access_type} onChange={e => setFormData(p => ({ ...p, access_type: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f55139]"><option value="free">Free</option><option value="premium">Premium</option></select></div>
            </div>

            {/* Flags */}
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={formData.featured === 'true'} onChange={e => setFormData(p => ({ ...p, featured: String(e.target.checked) }))} className="rounded border-gray-300 text-[#f55139] focus:ring-[#f55139]" /><Star className="w-4 h-4 text-yellow-500" /> Featured</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={formData.popular === 'true'} onChange={e => setFormData(p => ({ ...p, popular: String(e.target.checked) }))} className="rounded border-gray-300 text-[#f55139] focus:ring-[#f55139]" /><TrendingUp className="w-4 h-4 text-blue-500" /> Popular</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={formData.trending === 'true'} onChange={e => setFormData(p => ({ ...p, trending: String(e.target.checked) }))} className="rounded border-gray-300 text-[#f55139] focus:ring-[#f55139]" /><Flame className="w-4 h-4 text-orange-500" /> Trending</label>
            </div>

            {/* Cover Image */}
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
              <ImageUpload currentImage={formData.cover_url || null} onUpload={(url, publicId) => setFormData(p => ({ ...p, cover_url: url, cover_public_id: publicId }))} onRemove={() => setFormData(p => ({ ...p, cover_url: '', cover_public_id: '' }))} />
            </div>

            {/* SEO */}
            <details className="border border-gray-200 rounded-lg p-4">
              <summary className="text-sm font-medium text-gray-700 cursor-pointer">SEO Settings</summary>
              <div className="mt-4 space-y-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label><input type="text" value={formData.seo_title} onChange={e => setFormData(p => ({ ...p, seo_title: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f55139]" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">SEO Description</label><textarea value={formData.seo_description} onChange={e => setFormData(p => ({ ...p, seo_description: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f55139]" rows={2} /></div>
              </div>
            </details>

            <div className="flex gap-2 pt-2">
              <button type="submit" disabled={loading} className="inline-flex items-center px-4 py-2 bg-[#f55139] text-white text-sm font-medium rounded-lg hover:bg-[#e0452d] disabled:opacity-50"><Check className="w-4 h-4 mr-2" /> {loading ? 'Saving...' : 'Save Story'}</button>
              <button type="button" onClick={resetForm} className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200"><X className="w-4 h-4 mr-2" /> Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search stories..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f55139]" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f55139]">
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Story</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Author</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Language</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Category</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Flags</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredStories.length === 0 ? (
              <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400"><BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" /><p className="font-medium">No stories found</p></td></tr>
            ) : filteredStories.map(s => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {s.cover_url ? <div className="relative w-10 h-14 rounded overflow-hidden flex-shrink-0"><Image src={s.cover_url} alt={s.title} fill className="object-cover" /></div> : <div className="w-10 h-14 rounded bg-gray-100 flex items-center justify-center flex-shrink-0"><BookOpen className="w-4 h-4 text-gray-400" /></div>}
                    <div><p className="font-medium text-gray-900 line-clamp-1">{s.title}</p><p className="text-xs text-gray-500">{s.slug}</p></div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">{s.author?.name || '—'}</td>
                <td className="px-4 py-3 text-gray-600">{s.language?.name || '—'}</td>
                <td className="px-4 py-3 text-gray-600">{s.category?.name || '—'}</td>
                <td className="px-4 py-3"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${s.status === 'published' ? 'bg-green-100 text-green-800' : s.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'}`}>{s.status}</span></td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    {s.featured && <Star className="w-4 h-4 text-yellow-500" />}
                    {s.popular && <TrendingUp className="w-4 h-4 text-blue-500" />}
                    {s.trending && <Flame className="w-4 h-4 text-orange-500" />}
                  </div>
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <Link href={`/admin/episodes?story_id=${s.id}`} className="text-indigo-600 hover:text-indigo-800 mr-2" title="Manage Episodes"><Eye className="w-4 h-4 inline" /></Link>
                  <button onClick={() => handleEdit(s)} className="text-blue-600 hover:text-blue-800 mr-2"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(s.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
