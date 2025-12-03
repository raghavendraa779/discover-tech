import { createSupabaseServerClient } from '@/utils/auth-helpers'
import { redirect } from 'next/navigation'

export default async function PostOpportunity() {
  // 1. Protect the Route: Kick out guests
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // 2. The Server Action: Runs on the server when form is submitted
  const createPost = async (formData: FormData) => {
    'use server'
    const supabase = await createSupabaseServerClient()
    
    // Get the current user again to be safe
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const title = formData.get('title') as string
    const type = formData.get('type') as string
    const organization = formData.get('organization') as string
    const date = formData.get('date') as string
    const link = formData.get('link') as string
    const description = formData.get('description') as string

    // Insert into Supabase
    const { error } = await supabase.from('opportunities').insert({
      title,
      type,
      organization,
      date,
      link,
      description,
      // We can add 'organizer_id': user.id if we had that column, 
      // but for now we keep it simple based on your initial table.
    })

    if (error) {
      console.error(error)
      // In a real app, show an error message
    } else {
      redirect('/')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-4">
      <form action={createPost} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Post an Opportunity</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input name="title" required placeholder="e.g. Senior React Developer" className="mt-1 w-full px-4 py-2 border rounded-md" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select name="type" className="mt-1 w-full px-4 py-2 border rounded-md bg-white">
                <option value="Hackathon">Hackathon</option>
                <option value="Job">Job</option>
                <option value="Webinar">Webinar</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date/Deadline</label>
              <input name="date" required placeholder="e.g. Dec 25" className="mt-1 w-full px-4 py-2 border rounded-md" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Organization Name</label>
            <input name="organization" required placeholder="e.g. Acme Corp" className="mt-1 w-full px-4 py-2 border rounded-md" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Registration Link</label>
            <input name="link" required type="url" placeholder="https://..." className="mt-1 w-full px-4 py-2 border rounded-md" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" required rows={4} className="mt-1 w-full px-4 py-2 border rounded-md" />
          </div>
        </div>

        <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition">
          🚀 Launch Opportunity
        </button>
      </form>
    </div>
  )
}