'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getLanguages() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('languages')
    .select('*')
    .order('display_order', { ascending: true })
    
  if (error) throw error
  return data
}

export async function createLanguage(formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get('name') as string
  const code = formData.get('code') as string
  const status = formData.get('status') as string || 'active'
  const display_order = parseInt(formData.get('display_order') as string || '0')

  const { data, error } = await supabase
    .from('languages')
    .insert([{ name, code, status, display_order }])
    .select()

  if (error) return { error: error.message }

  revalidatePath('/admin/languages')
  revalidatePath('/', 'layout')
  revalidatePath('/stories')
  
  return { data }
}

export async function updateLanguage(id: string, formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get('name') as string
  const code = formData.get('code') as string
  const status = formData.get('status') as string
  const display_order = parseInt(formData.get('display_order') as string || '0')

  const { data, error } = await supabase
    .from('languages')
    .update({ name, code, status, display_order })
    .eq('id', id)
    .select()

  if (error) return { error: error.message }

  revalidatePath('/admin/languages')
  revalidatePath('/', 'layout')
  revalidatePath('/stories')
  
  return { data }
}

export async function deleteLanguage(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('languages')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/languages')
  revalidatePath('/', 'layout')
  revalidatePath('/stories')
  
  return { success: true }
}
