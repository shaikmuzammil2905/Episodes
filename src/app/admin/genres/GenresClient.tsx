'use client'

import { useState } from 'react'
import { createGenre, updateGenre, deleteGenre } from '@/actions/genres'
import { Plus, Edit2, Trash2, Check, X, Tags } from 'lucide-react'

interface Genre { id: string; name: string; slug: string; description: string | null; status: string }

export default function GenresClient({ initialGenres }: { initialGenres: Genre[] }) {
  const [genres, setGenres] = useState<Genre[]>(initialGenres)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: '', slug: '', description: '', status: 'active' })
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const resetForm = () => { setFormData({ name: '', slug: '', description: '', status: 'active' }); setShowForm(false); setEditingId(null) }
  const showMsg = (type: 'success' | 'error', text: string) => { setMessage({ type, text }); setTimeout(() => setMessage(null), 3000) }
  const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.slug) { showMsg('error', 'Name and slug are required.'); return }
    setLoading(true)
    const fd = new FormData()
    Object.entries(formData).forEach(([k, v]) => fd.append(k, v))
    const result = editingId ? await updateGenre(editingId, fd) : await createGenre(fd)
    if (result.error) showMsg('error', result.error)
    else { showMsg('success', editingId ? 'Genre updated.' : 'Genre created.'); const res = await fetch('/api/genres'); if (res.ok) setGenres(await res.json()); else window.location.reload(); resetForm() }
    setLoading(false)
  }

  const handleEdit = (g: Genre) => { setFormData({ name: g.name, slug: g.slug, description: g.description || '', status: g.status }); setEditingId(g.id); setShowForm(true) }
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this genre?')) return
    setLoading(true)
    const result = await deleteGenre(id)
    if (result.error) showMsg('error', result.error); else { showMsg('success', 'Genre deleted.'); setGenres(prev => prev.filter(g => g.id !== id)) }
    setLoading(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Genres</h1>
        <button onClick={() => { resetForm(); setShowForm(true) }} className="inline-flex items-center px-4 py-2 bg-[#f55139] text-white text-sm font-medium rounded-lg hover:bg-[#e0452d]"><Plus className="w-4 h-4 mr-2" /> Add Genre</button>
      </div>
      {message && <div className={`mb-4 p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{message.text}</div>}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">{editingId ? 'Edit Genre' : 'Add Genre'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Name *</label><input type="text" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value, slug: generateSlug(e.target.value) }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f55139]" required /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label><input type="text" value={formData.slug} onChange={e => setFormData(p => ({ ...p, slug: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f55139]" required /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f55139]" rows={2} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Status</label><select value={formData.status} onChange={e => setFormData(p => ({ ...p, status: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f55139]"><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
            <div className="md:col-span-2 flex gap-2">
              <button type="submit" disabled={loading} className="inline-flex items-center px-4 py-2 bg-[#f55139] text-white text-sm font-medium rounded-lg hover:bg-[#e0452d] disabled:opacity-50"><Check className="w-4 h-4 mr-2" /> {loading ? 'Saving...' : 'Save'}</button>
              <button type="button" onClick={resetForm} className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200"><X className="w-4 h-4 mr-2" /> Cancel</button>
            </div>
          </form>
        </div>
      )}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200"><tr><th className="px-6 py-3 text-left font-semibold text-gray-600">Genre</th><th className="px-6 py-3 text-left font-semibold text-gray-600">Slug</th><th className="px-6 py-3 text-left font-semibold text-gray-600">Status</th><th className="px-6 py-3 text-right font-semibold text-gray-600">Actions</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {genres.length === 0 ? <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400"><Tags className="w-12 h-12 mx-auto mb-3 text-gray-300" /><p className="font-medium">No genres yet</p></td></tr> :
            genres.map(g => (
              <tr key={g.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{g.name}</td>
                <td className="px-6 py-4 text-gray-500">{g.slug}</td>
                <td className="px-6 py-4"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${g.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>{g.status}</span></td>
                <td className="px-6 py-4 text-right"><button onClick={() => handleEdit(g)} className="text-blue-600 hover:text-blue-800 mr-3"><Edit2 className="w-4 h-4" /></button><button onClick={() => handleDelete(g.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
