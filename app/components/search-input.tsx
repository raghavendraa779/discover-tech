'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function SearchInput() {
  const searchParams = useSearchParams()
  const { replace } = useRouter()

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams)
    
    if (term) {
      params.set('query', term)
    } else {
      params.delete('query')
    }
    
    // Updates the URL without reloading the page
    replace(`/?${params.toString()}`)
  }

  return (
    <input 
      type="text" 
      placeholder="Search opportunities..." 
      className="w-full max-w-md px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      onChange={(e) => handleSearch(e.target.value)}
      defaultValue={searchParams.get('query')?.toString()}
    />
  )
}