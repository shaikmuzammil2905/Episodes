'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createEpisode, updateEpisode, deleteEpisode } from '@/actions/episodes'
import { Plus, Edit2, Trash2, Check, X, LayoutList } from 'lucide-react'
import { ImageUpload } from '@/components/ImageUpload'

interface EpisodeRow {
  id: string; story_id: string; episode_number: number; title: string; slug: string
  summary: string | null; content: string | null; image_url: string | null; image_public_id: string | null
  status: string; access_type: string; seo_title: string | null; seo_description: string | null
  published_at: string | null; created_at: string
  story: { id: string; title: string; slug: string } | null
}

interface StoryRef { id: string; title: string }

const defaultForm = {
  story_id: '', episode_number: '1', title: '', slug: '', summary: '', content: '',
  image_url: '', image_public_id: '', status: 'draft', access_type: 'free', seo_title: '', seo_description: ''
}

export default function EpisodesClient({ initialEpisodes, stories }: { initialEpisodes: EpisodeRow[]; stories: StoryRef[] }) {
  const searchParams = useSearchParams()
  const storyIdFilter = searchParams.get('story_id') || ''
  
  const [episodes, setEpisodes] = useState<EpisodeRow[]>(initialEpisodes)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ ...defaultForm, story_id: storyIdFilter })
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [filterStoryId, setFilterStoryId] = useState(storyIdFilter)

  const filteredEpisodes = filterStoryId ? episodes.filter(ep => ep.story_id === filterStoryId) : episodes

  const resetForm = () => { setFormData({ ...defaultForm, story_id: filterStoryId }); setShowForm(false); setEditingId(null) }
  const showMsg = (type: 'success' | 'error', text: string) => { setMessage({ type, text }); setTimeout(() => setMessage(null), 3000) }
  const generateSlug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.story_id || !formData.title || !formData.slug) { showMsg('error', 'Story, title, and slug are required.'); return }
    setLoading(true)
    const fd = new FormData()
    Object.entries(formData).forEach(([k, v]) => fd.append(k, v))
    const result = editingId ? await updateEpisode(editingId, fd) : await createEpisode(fd)
    if (result.error) showMsg('error', result.error)
    else {
      showMsg('success', editingId ? 'Episode updated.' : 'Episode created.')
      window.location.reload()
    }
    setLoading(false)
  }

  const handleEdit = (ep: EpisodeRow) => {
    setFormData({
      story_id: ep.story_id, episode_number: String(ep.episode_number), title: ep.title, slug: ep.slug,
      summary: ep.summary || '', content: ep.content || '', image_url: ep.image_url || '', image_public_id: ep.image_public_id || '',
      status: ep.status, access_type: ep.access_type, seo_title: ep.seo_title || '', seo_description: ep.seo_description || ''
    })
    setEditingId(ep.id); setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this episode?')) return
    setLoading(true)
    const result = await deleteEpisode(id)
    if (result.error) showMsg('error', result.error)
    else { showMsg('success', 'Episode deleted.'); setEpisodes(prev => prev.filter(ep => ep.id !== id)) }
    setLoading(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Episodes</h1>
        <button onClick={() => { resetForm(); setShowForm(true) }} className="inline-flex items-center px-4 py-2 bg-[#f55139] text-white text-sm font-medium rounded-lg hover:bg-[#e0452d]"><Plus className="w-4 h-4 mr-2" /> Add Episode</button>
      </div>
      {message && <div className={`mb-4 p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{message.text}</div>}

      {/* Filter by story */}
      <div className="mb-4">
        <select value={filterStoryId} onChange={e => setFilterStoryId(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f55139]">
          <option value="">All Stories</option>
          {stories.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
        </select>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">{editingId ? 'Edit Episode' : 'Add Episode'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Story *</label><select value={formData.story_id} onChange={e => setFormData(p => ({ ...p, story_id: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f55139]" required><option value="">Select Story</option>{stories.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}</select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Episode Number *</label><input type="number" min="1" value={formData.episode_number} onChange={e => setFormData(p => ({ ...p, episode_number: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f55139]" required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Status</label><select value={formData.status} onChange={e => setFormData(p => ({ ...p, status: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f55139]"><option value="draft">Draft</option><option value="published">Published</option></select></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Title *</label><input type="text" value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value, slug: generateSlug(e.target.value) }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f55139]" required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label><input type="text" value={formData.slug} onChange={e => setFormData(p => ({ ...p, slug: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f55139]" required /></div>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Summary</label><textarea value={formData.summary} onChange={e => setFormData(p => ({ ...p, summary: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f55139]" rows={2} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Content</label><textarea value={formData.content} onChange={e => setFormData(p => ({ ...p, content: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f55139] font-mono" rows={12} placeholder="Write your episode content here..." /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Episode Image</label>
              <ImageUpload currentImage={formData.image_url || null} onUpload={(url, publicId) => setFormData(p => ({ ...p, image_url: url, image_public_id: publicId }))} onRemove={() => setFormData(p => ({ ...p, image_url: '', image_public_id: '' }))} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Access Type</label><select value={formData.access_type} onChange={e => setFormData(p => ({ ...p, access_type: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f55139]"><option value="free">Free</option><option value="premium">Premium</option></select></div>
            </div>
            <details className="border border-gray-200 rounded-lg p-4">
              <summary className="text-sm font-medium text-gray-700 cursor-pointer">SEO Settings</summary>
              <div className="mt-4 space-y-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label><input type="text" value={formData.seo_title} onChange={e => setFormData(p => ({ ...p, seo_title: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f55139]" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">SEO Description</label><textarea value={formData.seo_description} onChange={e => setFormData(p => ({ ...p, seo_description: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f55139]" rows={2} /></div>
              </div>
            </details>
            <div className="flex gap-2 pt-2">
              <button type="submit" disabled={loading} className="inline-flex items-center px-4 py-2 bg-[#f55139] text-white text-sm font-medium rounded-lg hover:bg-[#e0452d] disabled:opacity-50"><Check className="w-4 h-4 mr-2" /> {loading ? 'Saving...' : 'Save Episode'}</button>
              <button type="button" onClick={resetForm} className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200"><X className="w-4 h-4 mr-2" /> Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">#</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Episode Title</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Story</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Access</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredEpisodes.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400"><LayoutList className="w-12 h-12 mx-auto mb-3 text-gray-300" /><p className="font-medium">No episodes found</p></td></tr>
            ) : filteredEpisodes.map(ep => (
              <tr key={ep.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-gray-500">{ep.episode_number}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{ep.title}</td>
                <td className="px-4 py-3 text-gray-600">{ep.story?.title || '—'}</td>
                <td className="px-4 py-3"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ep.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{ep.status}</span></td>
                <td className="px-4 py-3"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ep.access_type === 'free' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>{ep.access_type}</span></td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => handleEdit(ep)} className="text-blue-600 hover:text-blue-800 mr-2"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(ep.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
