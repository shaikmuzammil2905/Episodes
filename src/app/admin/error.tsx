'use client'

import { useEffect } from 'react'
import { AlertCircle, Database, RefreshCw } from 'lucide-react'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  const isDatabaseError = error.message.toLowerCase().includes('relation') || error.message.toLowerCase().includes('database') || error.message.toLowerCase().includes('exist');

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-red-100 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          {isDatabaseError ? <Database className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {isDatabaseError ? 'Database Not Found' : 'Something went wrong!'}
        </h2>
        
        <p className="text-gray-600 mb-6 text-sm">
          {isDatabaseError 
            ? "It looks like your Supabase database hasn't been set up yet, or the tables are missing. Please run the schema.sql script in your Supabase SQL Editor."
            : error.message || "An unexpected error occurred while loading this page."}
        </p>

        <div className="space-y-3">
          <button
            onClick={() => reset()}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#f55139] hover:bg-[#e0452d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f55139]"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try again
          </button>
          
          {isDatabaseError && (
            <button
              onClick={() => window.location.href = '/admin'}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f55139]"
            >
              Go to Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
