'use client'

import { useState } from 'react'
import { Database } from 'lucide-react'

export default function SeedDatabaseButton({ isDatabaseEmpty }: { isDatabaseEmpty: boolean }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  if (!isDatabaseEmpty) return null

  const handleSeed = async () => {
    try {
      setLoading(true)
      setMessage('Seeding database... Please wait.')
      const res = await fetch('/api/seed', { method: 'POST' })
      const data = await res.json()
      
      if (res.ok) {
        setMessage('Success! Refreshing page...')
        setTimeout(() => window.location.reload(), 1500)
      } else {
        setMessage(data.error || 'Failed to seed database.')
      }
    } catch (err: any) {
      setMessage(err.message || 'An error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 flex flex-col items-center justify-center text-center">
      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
        <Database className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-blue-900 mb-2">Your database is empty!</h3>
      <p className="text-sm text-blue-700 mb-6 max-w-md">
        Would you like to automatically import all the stories, episodes, and authors from the old frontend mock data?
      </p>
      <button
        onClick={handleSeed}
        disabled={loading}
        className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
      >
        {loading ? 'Seeding...' : 'Seed Past Data'}
      </button>
      {message && (
        <p className={`mt-4 text-sm font-medium ${message.includes('Success') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </div>
  )
}
