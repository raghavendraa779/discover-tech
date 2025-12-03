import { createSupabaseServerClient } from '@/utils/auth-helpers'
import { Calendar, MapPin, Building2, ExternalLink, LogOut, Search } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

// 1. UPDATED: Function now accepts a search term
async function getOpportunities(query: string = '') {
  const supabase = await createSupabaseServerClient()
  
  // We start the query
  let queryBuilder = supabase
    .from('opportunities')
    .select('*')
    .order('created_at', { ascending: false })

  // If there is a search term, we filter by Title OR Description
  if (query) {
    queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%`)
  }

  const { data, error } = await queryBuilder

  if (error) {
    console.error('Error fetching:', error)
    return []
  }
  return data || []
}

async function getUser() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// 2. UPDATED: Component receives searchParams
export default async function Home(props: { searchParams?: Promise<{ q?: string }> }) {
  const searchParams = await props.searchParams
  const query = searchParams?.q || ''
  
  // Pass the query to the fetcher
  const opportunities = await getOpportunities(query)
  const user = await getUser()

  const signOut = async () => {
    'use server'
    const supabase = await createSupabaseServerClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Navbar */}
      <nav className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-indigo-600">DiscoverTech</Link>
          
          <div className="flex gap-4 items-center">
            {user ? (
              <>
                <div className="text-sm text-gray-600 hidden md:block">{user.email}</div>
                <form action={signOut}>
                  <button className="flex items-center gap-2 text-sm font-medium hover:text-red-600">
                    <LogOut size={16} /> Logout
                  </button>
                </form>
              </>
            ) : (
              <Link href="/login" className="text-sm font-medium hover:text-indigo-600 px-3 py-2">
                Login
              </Link>
            )}

            <Link href="/post">
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700">
                Post Opportunity
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-indigo-900 text-white py-12 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Find Your Next Tech Adventure</h2>
          <p className="text-indigo-200 mb-8">Hackathons, Jobs, and Webinars curated for you.</p>
          
          {/* 3. UPDATED: Search Form */}
          <form className="w-full max-w-md mx-auto relative text-gray-900">
            <input 
              name="q" // This name 'q' puts ?q=... in the URL
              type="text" 
              defaultValue={query} // Keeps the text in the box after search
              placeholder="Search opportunities (e.g. 'Java', 'Hackathon')..." 
              className="w-full px-4 py-3 pl-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          </form>

        </div>
      </div>

      {/* Feed Section */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex items-center gap-2 mb-6">
          <h3 className="text-xl font-bold">Latest Opportunities</h3>
          {query && (
            <span className="text-sm text-gray-500 font-normal">
              — Showing results for "{query}"
            </span>
          )}
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {opportunities.map((item: any) => (
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

          {opportunities.length === 0 && (
            <div className="col-span-2 text-center py-16">
              <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Search className="text-gray-400" size={32} />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No opportunities found</h3>
              <p className="text-gray-500 mt-1">Try adjusting your search terms.</p>
              {query && (
                <Link href="/" className="inline-block mt-4 text-indigo-600 font-medium hover:underline">
                  Clear Search
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}