'use client'

import { useState, useRef, useEffect } from 'react'
import { Upload, X, Loader2, Image as ImageIcon, ImageOff } from 'lucide-react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

interface ImageUploadProps {
  onUpload: (url: string, publicId: string) => void
  onRemove: () => void
  currentImage?: string | null
  className?: string
}

export function ImageUpload({ onUpload, onRemove, currentImage, className = '' }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [localPreview, setLocalPreview] = useState<string | null>(null)
  const [imageFailed, setImageFailed] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (localPreview && !localPreview.startsWith('http')) {
        URL.revokeObjectURL(localPreview)
      }
    }
  }, [localPreview])

  // Reset image fail state if the image source changes
  useEffect(() => {
    setImageFailed(false)
  }, [currentImage, localPreview])

  const validateFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      return 'Please upload an image file (JPG, PNG, WEBP).'
    }
    if (file.size > 5 * 1024 * 1024) {
      return 'Image must be less than 5MB.'
    }
    return null
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    // Immediately show local preview
    const previewUrl = URL.createObjectURL(file)
    setLocalPreview(previewUrl)
    setIsUploading(true)
    setError(null)
    setImageFailed(false)

    try {
      // Create a highly unique filename to prevent caching issues
      const timestamp = new Date().getTime()
      const randomStr = Math.random().toString(36).substring(2, 8)
      const extension = file.name.split('.').pop()?.toLowerCase() || 'webp'
      const fileName = `media-${timestamp}-${randomStr}.${extension}`
      
      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase
        .storage
        .from('storyepisodes-media')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        throw new Error(uploadError.message)
      }

      // Get public URL
      const { data: { publicUrl } } = supabase
        .storage
        .from('storyepisodes-media')
        .getPublicUrl(data.path)

      // Call parent handler
      onUpload(publicUrl, data.path)
      
      // Clear local preview once successful, as the parent will update currentImage
      setLocalPreview(null)
      
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'Image upload failed. Please try again.')
      setLocalPreview(null) // Revert preview on failure
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = '' // Reset input
      }
    }
  }

  const handleRemoveClick = () => {
    setLocalPreview(null)
    setError(null)
    onRemove()
  }
  
  const triggerFilePicker = () => {
    fileInputRef.current?.click()
  }

  // Display image is either the optimistic local preview or the saved image
  const displayImage = localPreview || currentImage

  return (
    <div className={`space-y-4 ${className}`}>
      
      {/* ALWAYS render the hidden file input so the Replace button can trigger it */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleUpload}
        disabled={isUploading}
      />

      {displayImage ? (
        <div className="flex flex-col gap-3">
          <div className="relative w-40 h-56 overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-gray-50 flex items-center justify-center">
            {imageFailed ? (
              <div className="flex flex-col items-center text-gray-400">
                <ImageOff className="w-8 h-8 mb-2 opacity-50" />
                <span className="text-xs font-medium px-2 text-center">Image unavailable</span>
              </div>
            ) : (
              <Image
                src={displayImage}
                alt="Story cover"
                fill
                className={`object-cover transition-opacity duration-300 ${isUploading ? 'opacity-50 blur-sm' : 'opacity-100'}`}
                sizes="160px"
                unoptimized={displayImage.startsWith('blob:') || displayImage.startsWith('data:')}
                onError={() => setImageFailed(true)}
              />
            )}
            
            {isUploading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-[2px]">
                <Loader2 className="w-8 h-8 text-white animate-spin drop-shadow-md mb-2" />
                <span className="text-white text-xs font-bold tracking-wide drop-shadow-md">UPLOADING...</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={triggerFilePicker}
              disabled={isUploading}
              className="inline-flex items-center px-3 py-1.5 bg-gray-100 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
            >
              <Upload className="w-4 h-4 mr-1.5" />
              Replace Image
            </button>
            <button
              type="button"
              onClick={handleRemoveClick}
              disabled={isUploading}
              className="inline-flex items-center px-3 py-1.5 bg-red-50 border border-red-200 text-red-600 text-sm font-medium rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              <X className="w-4 h-4 mr-1.5" />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full">
          <label className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition-all ${error ? 'border-red-300 bg-red-50 hover:bg-red-100' : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-[#f55139]'}`}>
            <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
              {isUploading ? (
                <>
                  <Loader2 className="w-8 h-8 text-[#f55139] animate-spin mb-3" />
                  <span className="text-[#f55139] text-sm font-bold">Uploading...</span>
                </>
              ) : (
                <>
                  <div className="p-3 bg-white rounded-full shadow-sm mb-3">
                    <ImageIcon className="w-6 h-6 text-[#f55139]" />
                  </div>
                  <p className="mb-1 text-sm text-gray-700">
                    <span className="font-semibold text-[#f55139]">Tap to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 font-medium">JPG, PNG, WEBP (Max 5MB)</p>
                </>
              )}
            </div>
            {/* The input here is not strictly needed since we use the hidden one, but we map it via onClick anyway */}
            <div 
              className="absolute inset-0 z-10" 
              onClick={(e) => {
                e.preventDefault();
                triggerFilePicker();
              }} 
            />
          </label>
        </div>
      )}
      
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700 flex items-start shadow-sm">
          <X className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}
    </div>
  )
}
