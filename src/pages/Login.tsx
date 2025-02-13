import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '../store/auth.store'
import axios from 'axios'

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
})

type LoginData = z.infer<typeof loginSchema>

const Login = () => {
  const navigate = useNavigate()
  const setAuth = useAuthStore(state => state.setAuth)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginData) => {
    try {
      setIsLoading(true)
      setError('')
      
      console.log('Attempting login with:', { email: data.email })

      const response = await axios.post('https://hotels-api.academlo.tech/users/login', {
        email: data.email.toLowerCase().trim(),
        password: data.password
      })

      console.log('Login response:', response.data)
      
      if (response.data.token && response.data.user) {
        setAuth(response.data.token, response.data.user)
        navigate('/')
      } else {
        setError('Invalid response from server')
      }
    } catch (err: any) {
      console.error('Login error:', err)
      
      if (err.response) {
        setError(err.response.data?.message || 'Login failed - please check your credentials')
      } else if (err.request) {
        setError('Network error - please check your connection')
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-md mx-auto mt-20 px-4">
        <div className="text-center mb-8">
          {/* User Icon Circle */}
          <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg 
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-500">USER</h2>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-500 text-red-600 p-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              {...register('password')}
              type="password"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors disabled:bg-red-300"
          >
            {isLoading ? 'Signing in...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login