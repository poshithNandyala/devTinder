import { useNavigate } from 'react-router'
import { useDispatch } from 'react-redux'
import { logout } from '../utils/slices/userSlice'
import axios from 'axios'
import { BASE_URL } from '../utils/constants'
import { toast } from 'react-toastify'
import { useState } from 'react'

function Settings() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await axios.post(BASE_URL + '/user/logout', {}, { withCredentials: true })
      dispatch(logout())
      toast.success('Signed out successfully')
      navigate('/login')
    } catch (error) {
      toast.error('Failed to sign out')
      console.error(error)
    } finally {
      setLoggingOut(false)
    }
  }

  const menuItems = [
    { label: 'Edit Profile', path: '/edit-profile' },
    { label: 'View Profile', path: '/profile' },
    { label: 'Connections', path: '/connections' },
    { label: 'Requests', path: '/requests' },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-light tracking-wide text-center mb-8 text-stone-100">Settings</h1>

        <div className="bg-stone-900/30 backdrop-blur-sm border border-stone-800/30 rounded-2xl overflow-hidden">
          {/* Menu Items */}
          <div className="divide-y divide-stone-800/30">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="w-full px-6 py-4 text-left text-stone-400 hover:text-stone-100 hover:bg-stone-800/30 transition-colors flex items-center justify-between group"
              >
                <span className="text-sm tracking-wide">{item.label}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-stone-600 group-hover:text-rose-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>

          <div className="border-t border-stone-800/30 p-4">
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full py-3 text-stone-500 hover:text-red-400 transition-colors tracking-wider text-sm flex items-center justify-center gap-2"
            >
              {loggingOut && <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>}
              {loggingOut ? 'Signing out...' : 'Sign Out'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
