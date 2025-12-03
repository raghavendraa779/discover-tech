import { supabase } from '@/lib/supabase'
import { Calendar, MapPin, Building2, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import SearchInput from '@/app/components/search-input' // Ensure this path is correct

// Updated function to accept a search query
async function getOpportunities(query: string) {
  let queryBuilder = supabase
    .from('opportunities')
    .select('*')
    .order('created_at', { ascending: false })

  // If there is a search term, filter by title OR description
  if (query) {
    queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%`)
  }

  const { data, error } = await queryBuilder

  if (error) {
    console.error('Error fetching:', error)
    return []
  }
  return data
}

// 2. Fetch User (To check login status)
// We fetch user here to show their email in the navbar
async function getUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export default async function Home(props: { searchParams: Promise<{ query?: string }> }) {
  const searchParams = await props.searchParams
  const query = searchParams?.query || ''
  
  const opportunities = await getOpportunities(query)
  const user = await getUser()

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* 1. The Navbar */}
      <nav className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-indigo-600">DiscoverTech</h1>
          <div className="flex gap-4 items-center">
            
            {user ? (
              // LOGGED IN VIEW
              <>
                <Link 
                  href="/profile" 
                  className="text-sm text-gray-600 hidden md:block hover:text-indigo-600 underline decoration-dotted"
                >
                  {user.email}
                </Link>
                <Link href="/post">
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700">
                    Post Opportunity
                  </button>
                </Link>
              </>
            ) : (
              // GUEST VIEW
              <Link 
                href="/login" 
                className="text-sm font-medium hover:text-indigo-600 px-3 py-2"
              >
                Login
              </Link>
            )}

          </div>
        </div>
      </nav>

      {/* 2. The Hero Section */}
      <div className="bg-indigo-900 text-white py-12 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Find Your Next Tech Adventure</h2>
          <p className="text-indigo-200 mb-8">Hackathons, Jobs, and Webinars curated for you.</p>
          
          <SearchInput />
          
        </div>
      </div>

      {/* 3. The Feed */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h3 className="text-xl font-bold mb-6">
          {query ? `Results for "${query}"` : 'Latest Opportunities'}
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {opportunities?.map((item: any) => (
            <div key={item.id} className="bg-white p-6 rounded-xl border hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 
                    ${item.type === 'Hackathon' ? 'bg-purple-100 text-purple-700' : 
                      item.type === 'Job' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {item.type}
                  </span>
                  <h3 className="text-lg font-bold">{item.title}</h3>
                </div>
                <a href={item.link} target="_blank" className="text-gray-400 hover:text-indigo-600">
                  <ExternalLink size={20} />
                </a>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <Building2 size={16} />
                  <span>{item.organization}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{item.date}</span>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>

              <button className="w-full border border-gray-200 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
                View Details
              </button>
            </div>
          ))}

          {opportunities?.length === 0 && (
            <div className="col-span-2 text-center py-10 text-gray-500">
              No opportunities found matching your search.
            </div>
          )}
        </div>
      </div>
    </main>
  )
}