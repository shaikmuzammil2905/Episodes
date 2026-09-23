'use client'

import { useState } from 'react'
import { createAuthor, updateAuthor, deleteAuthor } from '@/actions/authors'
import { Plus, Edit2, Trash2, Check, X, Users } from 'lucide-react'
import { ImageUpload } from '@/components/ImageUpload'
import Image from 'next/image'

interface Author { id: string; name: string; slug: string; bio: string | null; image_url: string | null; image_public_id: string | null }

export default function AuthorsClient({ initialAuthors }: { initialAuthors: Author[] }) {
  const [authors, setAuthors] = useState<Author[]>(initialAuthors)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: '', slug: '', bio: '', image_url: '', image_public_id: '' })
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const resetForm = () => { setFormData({ name: '', slug: '', bio: '', image_url: '', image_public_id: '' }); setShowForm(false); setEditingId(null) }
  const showMsg = (type: 'success' | 'error', text: string) => { setMessage({ type, text }); setTimeout(() => setMessage(null), 3000) }
  const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.slug) { showMsg('error', 'Name and slug are required.'); return }
    setLoading(true)
    const fd = new FormData()
    Object.entries(formData).forEach(([k, v]) => fd.append(k, v))
    const result = editingId ? await updateAuthor(editingId, fd) : await createAuthor(fd)
    if (result.error) showMsg('error', result.error)
    else { showMsg('success', editingId ? 'Author updated.' : 'Author created.'); const res = await fetch('/api/authors'); if (res.ok) setAuthors(await res.json()); else window.location.reload(); resetForm() }
    setLoading(false)
  }

  const handleEdit = (a: Author) => { setFormData({ name: a.name, slug: a.slug, bio: a.bio || '', image_url: a.image_url || '', image_public_id: a.image_public_id || '' }); setEditingId(a.id); setShowForm(true) }
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this author? Stories by this author will remain but lose their author association.')) return
    setLoading(true)
    const result = await deleteAuthor(id)
    if (result.error) showMsg('error', result.error); else { showMsg('success', 'Author deleted.'); setAuthors(prev => prev.filter(a => a.id !== id)) }
    setLoading(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Authors</h1>
        <button onClick={() => { resetForm(); setShowForm(true) }} className="inline-flex items-center px-4 py-2 bg-[#f55139] text-white text-sm font-medium rounded-lg hover:bg-[#e0452d]"><Plus className="w-4 h-4 mr-2" /> Add Author</button>
      </div>
      {message && <div className={`mb-4 p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{message.text}</div>}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">{editingId ? 'Edit Author' : 'Add Author'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Name *</label><input type="text" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value, slug: generateSlug(e.target.value) }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f55139]" required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label><input type="text" value={formData.slug} onChange={e => setFormData(p => ({ ...p, slug: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f55139]" required /></div>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Biography</label><textarea value={formData.bio} onChange={e => setFormData(p => ({ ...p, bio: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f55139]" rows={3} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Author Image</label>
              <ImageUpload currentImage={formData.image_url || null} onUpload={(url, publicId) => setFormData(p => ({ ...p, image_url: url, image_public_id: publicId }))} onRemove={() => setFormData(p => ({ ...p, image_url: '', image_public_id: '' }))} />
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={loading} className="inline-flex items-center px-4 py-2 bg-[#f55139] text-white text-sm font-medium rounded-lg hover:bg-[#e0452d] disabled:opacity-50"><Check className="w-4 h-4 mr-2" /> {loading ? 'Saving...' : 'Save'}</button>
              <button type="button" onClick={resetForm} className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200"><X className="w-4 h-4 mr-2" /> Cancel</button>
            </div>
          </form>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {authors.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-400"><Users className="w-12 h-12 mx-auto mb-3 text-gray-300" /><p className="font-medium">No authors yet</p></div>
        ) : authors.map(a => (
          <div key={a.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              {a.image_url ? <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0"><Image src={a.image_url} alt={a.name} fill className="object-cover" /></div> : <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0"><Users className="w-6 h-6 text-gray-400" /></div>}
              <div><h3 className="font-semibold text-gray-900">{a.name}</h3><p className="text-sm text-gray-500">{a.slug}</p></div>
            </div>
            {a.bio && <p className="text-sm text-gray-600 line-clamp-2 mb-4">{a.bio}</p>}
            <div className="flex gap-2">
              <button onClick={() => handleEdit(a)} className="text-sm text-blue-600 hover:text-blue-800 font-medium">Edit</button>
              <button onClick={() => handleDelete(a.id)} className="text-sm text-red-500 hover:text-red-700 font-medium">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
