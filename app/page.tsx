import { supabase } from '@/lib/supabase'
import { Calendar, MapPin, Building2, ExternalLink } from 'lucide-react'
import Link from 'next/link'

// This function fetches data from your Supabase database
async function getOpportunities() {
  const { data, error } = await supabase
    .from('opportunities')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching:', error)
    return []
  }
  return data
}

export default async function Home() {
  const opportunities = await getOpportunities()

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* 1. The Navbar */}
      <nav className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-indigo-600">DiscoverTech</h1>
          <div className="flex gap-4 items-center">
            {/* FIXED: Link is now a direct container, no nested button */}
            <Link 
              href="/login" 
              className="text-sm font-medium hover:text-indigo-600 px-3 py-2"
            >
              Login
            </Link>
            
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700">
              Post Opportunity
            </button>
          </div>
        </div>
      </nav>

      {/* 2. The Hero Section */}
      <div className="bg-indigo-900 text-white py-12 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Find Your Next Tech Adventure</h2>
          <p className="text-indigo-200 mb-8">Hackathons, Jobs, and Webinars curated for you.</p>
          <input 
            type="text" 
            placeholder="Search opportunities..." 
            className="w-full max-w-md px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* 3. The Feed */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h3 className="text-xl font-bold mb-6">Latest Opportunities</h3>
        
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
              No opportunities found. Check your database connection.
            </div>
          )}
        </div>
      </div>
    </main>
  )
}