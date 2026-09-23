import { getLanguages } from '@/actions/languages'
import LanguagesClient from './LanguagesClient'

export default async function LanguagesPage() {
  const languages = await getLanguages()
  return <LanguagesClient initialLanguages={languages} />
}
