import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth.store'

const Layout = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="text-2xl">
              <span className="text-red-500">Booking</span>
              <span className="text-gray-700">App</span>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center space-x-6">
              {user ? (
                <>
                  <Link
                    to="/reservations"
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Reservations
                  </Link>
                  <span className="text-gray-500">
                    Welcome, {user.firstName}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout