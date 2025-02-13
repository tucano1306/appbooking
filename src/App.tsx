import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'

const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const HotelDetail = lazy(() => import('./pages/HotelDetail'))
const Reservations = lazy(() => import('./pages/Reservations'))

const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-[400px]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
  </div>
)

const ErrorBoundary = () => (
  <div className="flex justify-center items-center min-h-[400px] flex-col">
    <h2 className="text-2xl font-bold text-red-500 mb-4">Oops! Something went wrong</h2>
    <p className="text-gray-600">Please try refreshing the page</p>
  </div>
)

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Home />
          </Suspense>
        )
      },
      {
        path: "hotels/:id",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <HotelDetail />
          </Suspense>
        )
      },
      {
        path: "reservations",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ProtectedRoute>
              <Reservations />
            </ProtectedRoute>
          </Suspense>
        )
      },
      {
        path: "login",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Login />
          </Suspense>
        )
      },
      {
        path: "register",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Register />
          </Suspense>
        )
      }
    ]
  }
])

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <RouterProvider router={router} />
    </Suspense>
  )
}

export default App