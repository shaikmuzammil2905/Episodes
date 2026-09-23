import { getCategories } from '@/actions/categories'
import CategoriesClient from './CategoriesClient'

export default async function CategoriesPage() {
  const categories = await getCategories()
  return <CategoriesClient initialCategories={categories} />
}
