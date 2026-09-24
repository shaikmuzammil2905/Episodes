'use client'

import { useState } from 'react'
import { createLanguage, updateLanguage, deleteLanguage } from '@/actions/languages'
import { Plus, Edit2, Trash2, Check, X, Globe } from 'lucide-react'

interface Language {
  id: string
  name: string
  code: string
  status: string
  display_order: number
}

export default function LanguagesClient({ initialLanguages }: { initialLanguages: Language[] }) {
  const [languages, setLanguages] = useState<Language[]>(initialLanguages)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: '', code: '', status: 'active', display_order: '0' })
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const resetForm = () => {
    setFormData({ name: '', code: '', status: 'active', display_order: '0' })
    setShowForm(false)
    setEditingId(null)
  }

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.code) {
      showMessage('error', 'Name and code are required.')
      return
    }
    setLoading(true)
    const fd = new FormData()
    Object.entries(formData).forEach(([k, v]) => fd.append(k, v))

    let result
    if (editingId) {
      result = await updateLanguage(editingId, fd)
    } else {
      result = await createLanguage(fd)
    }

    if (result.error) {
      showMessage('error', result.error)
    } else {
      showMessage('success', editingId ? 'Language updated successfully.' : 'Language created successfully.')
      // Refresh data
      const res = await fetch('/api/languages')
      if (res.ok) setLanguages(await res.json())
      else window.location.reload()
      resetForm()
    }
    setLoading(false)
  }

  const handleEdit = (lang: Language) => {
    setFormData({
      name: lang.name,
      code: lang.code,
      status: lang.status,
      display_order: String(lang.display_order || 0)
    })
    setEditingId(lang.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this language?')) return
    setLoading(true)
    const result = await deleteLanguage(id)
    if (result.error) {
      showMessage('error', result.error)
    } else {
      showMessage('success', 'Language deleted successfully.')
      setLanguages(prev => prev.filter(l => l.id !== id))
    }
    setLoading(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Languages</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true) }}
          className="inline-flex items-center px-4 py-2 bg-[#f55139] text-white text-sm font-medium rounded-lg hover:bg-[#e0452d] transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Language
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">{editingId ? 'Edit Language' : 'Add Language'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input type="text" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f55139] focus:border-transparent" placeholder="e.g. English" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
              <input type="text" value={formData.code} onChange={e => setFormData(p => ({ ...p, code: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f55139] focus:border-transparent" placeholder="e.g. en" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={formData.status} onChange={e => setFormData(p => ({ ...p, status: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f55139] focus:border-transparent">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
              <input type="number" value={formData.display_order} onChange={e => setFormData(p => ({ ...p, display_order: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f55139] focus:border-transparent" />
            </div>
            <div className="md:col-span-2 flex gap-2">
              <button type="submit" disabled={loading} className="inline-flex items-center px-4 py-2 bg-[#f55139] text-white text-sm font-medium rounded-lg hover:bg-[#e0452d] disabled:opacity-50">
                <Check className="w-4 h-4 mr-2" /> {loading ? 'Saving...' : 'Save'}
              </button>
              <button type="button" onClick={resetForm} className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200">
                <X className="w-4 h-4 mr-2" /> Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-600">Language</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-600">Code</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-600">Status</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-600">Order</th>
              <th className="px-6 py-3 text-right font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {languages.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                  <Globe className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium">No languages yet</p>
                  <p className="text-sm mt-1">Add your first language to get started.</p>
                </td>
              </tr>
            ) : languages.map(lang => (
              <tr key={lang.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{lang.name}</td>
                <td className="px-6 py-4 text-gray-500">{lang.code}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${lang.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    {lang.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">{lang.display_order}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleEdit(lang)} className="text-blue-600 hover:text-blue-800 mr-3"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(lang.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
