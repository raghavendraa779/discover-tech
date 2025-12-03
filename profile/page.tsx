import { createSupabaseServerClient } from '@/utils/auth-helpers'
import { redirect } from 'next/navigation'
import { User, Briefcase, Award } from 'lucide-react'

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient()
  
  // 1. Get the current User
  const { data: { user } } = await supabase.auth.getUser()
  
  // If not logged in, send to login
  if (!user) {
    redirect('/login')
  }

  // 2. Get their Profile data (if it exists)
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // 3. Server Action to Save Profile
  const updateProfile = async (formData: FormData) => {
    'use server'
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const fullName = formData.get('fullName') as string
    // Convert "React, Node" string into ["React", "Node"] array
    const skills = (formData.get('skills') as string)?.split(',').map(s => s.trim()).filter(s => s.length > 0)
    const interests = (formData.get('interests') as string)?.split(',').map(s => s.trim()).filter(s => s.length > 0)

    // "Upsert" updates if exists, inserts if new
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        full_name: fullName,
        skills: skills,
        interests: interests,
        email: user.email,
        updated_at: new Date().toISOString(),
      })

    if (error) {
      console.error('Error updating profile:', error)
    }
    
    // Refresh the page to show new data
    redirect('/profile')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-12 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl text-gray-900">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
          <div className="bg-indigo-100 p-4 rounded-full">
            <User size={32} className="text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Your Profile</h1>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>

        {/* The Form */}
        <form action={updateProfile} className="space-y-6">
          
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <input 
                name="fullName" 
                defaultValue={profile?.full_name || ''} 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                placeholder="e.g. Rahul Sharma"
              />
              <User className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skills <span className="text-gray-400 text-xs">(Comma separated)</span>
            </label>
            <div className="relative">
              <textarea 
                name="skills" 
                rows={2}
                defaultValue={profile?.skills?.join(', ') || ''} 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                placeholder="React, Node.js, Python..."
              />
              <Briefcase className="absolute left-3 top-3 text-gray-400" size={18} />
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Interests <span className="text-gray-400 text-xs">(What do you want to learn?)</span>
            </label>
            <div className="relative">
              <input 
                name="interests" 
                defaultValue={profile?.interests?.join(', ') || ''} 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                placeholder="AI Agents, Blockchain, System Design..."
              />
              <Award className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
          </div>

          <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition">
            Save Profile
          </button>
        </form>
      </div>
    </div>
  )
}