import { createSupabaseServerClient } from '@/utils/auth-helpers' // Make sure you have this util from earlier
import { Calendar, MapPin, Building2, ExternalLink, LogOut, User } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

// 1. Fetch Opportunities
async function getOpportunities() {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase
    .from('opportunities')
    .select('*')
    .order('created_at', { ascending: false })
  return data || []
}

// 2. Fetch User (To check login status)
async function getUser() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export default async function Home() {
  const opportunities = await getOpportunities()
  const user = await getUser()

  // Server Action to handle Logout
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
          <h1 className="text-xl font-bold text-indigo-600">DiscoverTech</h1>
          
          <div className="flex gap-4 items-center">
            {user ? (
              // If Logged In: Show Email & Logout
              <>
                <div className="text-sm text-gray-600 hidden md:block">
                  {user.email}
                </div>
                <form action={signOut}>
                  <button className="flex items-center gap-2 text-sm font-medium hover:text-red-600">
                    <LogOut size={16} /> Logout
                  </button>
                </form>
              </>
            ) : (
              // If Guest: Show Login
              <Link href="/login">
                <button className="text-sm font-medium hover:text-indigo-600">Login</button>
              </Link>
            )}

            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700">
              Post Opportunity
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
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

      {/* Feed Section */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h3 className="text-xl font-bold mb-6">Latest Opportunities</h3>
        
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
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}