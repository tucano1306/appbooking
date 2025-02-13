import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import Layout from '../components/Layout'
import ProtectedRoute from '../components/ProtectedRoute'

// Lazy loading de componentes
const Home = lazy(() => import('../pages/Home').then(module => ({ default: module.default })))
const Login = lazy(() => import('../pages/Login').then(module => ({ default: module.default })))
const Register = lazy(() => import('../pages/Register').then(module => ({ default: module.default })))
const HotelDetail = lazy(() => import('../pages/HotelDetail').then(module => ({ default: module.default })))
const Reservations = lazy(() => import('../pages/Reservations').then(module => ({ default: module.default })))

const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-[400px]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
  </div>
)

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "hotels/:id",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <HotelDetail />
          </Suspense>
        ),
      },
      {
        path: "login",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: "register",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Register />
          </Suspense>
        ),
      },
      {
        path: "reservations",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ProtectedRoute>
              <Reservations />
            </ProtectedRoute>
          </Suspense>
        ),
      },
    ],
  },
])

export default router