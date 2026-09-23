'use client'

import { useState } from 'react'
import { Database, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react'

const SEED_STEPS = [
  { id: 'languages', label: 'Importing languages...' },
  { id: 'categories', label: 'Importing categories...' },
  { id: 'genres', label: 'Importing genres...' },
  { id: 'authors', label: 'Importing authors...' },
  { id: 'stories', label: 'Importing stories and episodes...' },
]

export default function SeedDatabaseButton({ isDatabaseEmpty }: { isDatabaseEmpty: boolean }) {
  const [loading, setLoading] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(-1)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  if (!isDatabaseEmpty && !success && !error && currentStepIndex === -1) return null

  const handleSeed = async () => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      for (let i = 0; i < SEED_STEPS.length; i++) {
        setCurrentStepIndex(i)
        const step = SEED_STEPS[i]

        const res = await fetch('/api/seed', { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ step: step.id })
        })
        
        const data = await res.json()
        
        if (!res.ok) {
          throw new Error(data.error || `Failed at step: ${step.label}`)
        }
      }

      setSuccess(true)
      setTimeout(() => window.location.reload(), 2000)
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during migration.')
    } finally {
      setLoading(false)
      if (error) setCurrentStepIndex(-1)
    }
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 flex flex-col items-center justify-center text-center">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${error ? 'bg-red-100 text-red-600' : success ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
        {error ? <AlertTriangle className="w-6 h-6" /> : success ? <CheckCircle className="w-6 h-6" /> : <Database className="w-6 h-6" />}
      </div>
      
      <h3 className={`text-lg font-bold mb-2 ${error ? 'text-red-900' : success ? 'text-green-900' : 'text-blue-900'}`}>
        {error ? 'Migration Failed' : success ? 'Migration Complete!' : 'Your database is empty!'}
      </h3>
      
      {!loading && !error && !success && (
        <p className="text-sm text-blue-700 mb-6 max-w-md">
          Would you like to automatically import all the stories, episodes, and authors from the old frontend mock data?
        </p>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md text-sm mb-4 max-w-lg text-left border border-red-200">
          <p className="font-semibold mb-1">Database Error:</p>
          <p className="break-words">{error}</p>
          <p className="mt-2 text-xs text-red-600">Tip: Did you run the schema.sql script in your Supabase SQL Editor?</p>
        </div>
      )}

      {loading && (
        <div className="w-full max-w-md mb-6 text-left">
          <ul className="space-y-2">
            {SEED_STEPS.map((step, idx) => (
              <li key={step.id} className={`flex items-center text-sm ${idx < currentStepIndex ? 'text-green-600' : idx === currentStepIndex ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
                {idx < currentStepIndex ? (
                  <CheckCircle className="w-4 h-4 mr-2" />
                ) : idx === currentStepIndex ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <div className="w-4 h-4 mr-2 rounded-full border-2 border-gray-300" />
                )}
                {step.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!success && (
        <button
          onClick={handleSeed}
          disabled={loading}
          className={`px-6 py-2 text-white rounded-md font-medium focus:ring-2 focus:ring-offset-2 disabled:opacity-50 transition-colors ${
            error ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
          }`}
        >
          {loading ? 'Importing Data...' : error ? 'Retry Migration' : 'Seed Past Data'}
        </button>
      )}
      
      {success && (
        <p className="mt-2 text-sm font-medium text-green-700">
          Existing StoryEpisodes data imported successfully. Refreshing dashboard...
        </p>
      )}
    </div>
  )
}
