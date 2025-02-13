import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../hooks/useAxios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Esquema de validación con Zod
const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  gender: z.enum(['male', 'female', 'other'])
})

// Tipo inferido del esquema
type RegisterData = z.infer<typeof registerSchema>

const Register = () => {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Hook form con validación de Zod
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema)
  })

  // Función que maneja el envío del formulario
  const onSubmit = async (formData: RegisterData) => {
    try {
      setIsLoading(true)
      setError('')
      
      // Estructura exacta que espera la API
      const userData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        gender: 'other' // Campo requerido por la API
      }
  
      console.log('Sending data:', userData)
      
      // Asegúrate de que la URL sea exactamente esta
      const response = await axios.post('https://hotels-api.academlo.tech/users', userData)
      console.log('Response:', response.data)
      
      alert('Registration successful! Please login.')
      navigate('/login')
    } catch (err: any) {
      console.error('Full error:', err)
      console.error('Error response:', err.response?.data)
      
      // Manejo específico de errores
      if (err.response?.data?.error === 'User already exists') {
        setError('Email already registered. Please try with a different email.')
      } else {
        setError(err.response?.data?.message || 'Registration failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-500 text-red-600 p-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                {...register('firstName')}
                type="text"
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
              )}
            </div>

            <div className="mb-4">
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              {...register('gender')}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && (
              <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
            )}
          </div>

            <div className="mb-4">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                {...register('lastName')}
                type="text"
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                {...register('email')}
                type="email"
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                {...register('password')}
                type="password"
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-300"
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register