'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    if (isLogin) {
      // PROSES LOGIN
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        setLoading(false)
      } else {
        router.push('/')
        router.refresh()
      }
    } else {
      // PROSES DAFTAR (SIGN UP)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        setLoading(false)
      } else {
        setSuccess('Pendaftaran berhasil! Silakan login (Cek email jika butuh verifikasi).')
        setIsLogin(true) // Kembali ke mode login
        setPassword('')
        setLoading(false)
      }
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50/50 backdrop-blur-xl">
      <div className="w-full max-w-md p-8 space-y-8 bg-white/70 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        
        <div className="text-center relative z-10">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Sya-Core</h2>
          <p className="mt-2 text-sm text-gray-500">
            {isLogin ? 'Masuk ke sistem manajemen akuntansi' : 'Buat akun baru untuk akses sistem'}
          </p>
        </div>
        
        <form className="mt-8 space-y-6 relative z-10" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="text-emerald-600 text-sm text-center font-medium bg-emerald-50 p-2 rounded">
              {success}
            </div>
          )}

          <div>
            <Button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200"
            >
              {loading ? 'Memproses...' : (isLogin ? 'Masuk' : 'Daftar Akun')}
            </Button>
          </div>
          
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin)
                setError(null)
                setSuccess(null)
              }}
              className="text-sm font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
            >
              {isLogin ? 'Belum punya akun? Daftar di sini' : 'Sudah punya akun? Masuk di sini'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
