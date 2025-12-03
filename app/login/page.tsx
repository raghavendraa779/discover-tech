import { createSupabaseServerClient } from '@/utils/auth-helpers'
import { redirect } from 'next/navigation'

export default function LoginPage() {
  
  const signIn = async (formData: FormData) => {
    'use server'
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    
    const supabase = await createSupabaseServerClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error(error.message)
      return redirect('/login?message=Could not authenticate user')
    }

    return redirect('/')
  }

  const signUp = async (formData: FormData) => {
    'use server'
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    
    const supabase = await createSupabaseServerClient()

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_URL}/auth/callback`,
      },
    })

    if (error) {
      console.error(error.message)
      return redirect('/login?message=Could not create user')
    }

    return redirect('/login?message=Check email to confirm signup')
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 text-gray-900">
      <form className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm space-y-6">
        <h2 className="text-2xl font-bold text-center text-indigo-600">Enter the Realm</h2>
        
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email</label>
            <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                placeholder="your@email.com"
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Password</label>
            <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                placeholder="••••••••"
            />
        </div>

        <div className="flex flex-col gap-3">
            <button formAction={signIn} className="w-full bg-indigo-600 text-white py-2 rounded-md font-semibold hover:bg-indigo-700 transition">
                Sign In
            </button>
            <button formAction={signUp} className="w-full border border-indigo-600 text-indigo-600 py-2 rounded-md font-semibold hover:bg-indigo-50 transition">
                Sign Up
            </button>
        </div>
      </form>
    </div>
  )
}