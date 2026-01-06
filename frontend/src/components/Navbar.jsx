import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../utils/slices/userSlice'
import axios from 'axios'
import { BASE_URL } from '../utils/constants'
import { Link, useNavigate, useLocation } from 'react-router'
import { toast } from 'react-toastify'
import { useState, useRef, useEffect } from 'react'

function Navbar() {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [loggingOut, setLoggingOut] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await axios.post(BASE_URL + '/user/logout', {}, { withCredentials: true })
      dispatch(logout())
      toast.success('Signed out')
      navigate('/login')
    } catch (error) {
      toast.error('Failed to sign out')
      console.error(error)
    } finally {
      setLoggingOut(false)
      setDropdownOpen(false)
    }
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-stone-950/80 backdrop-blur-md border-b border-stone-800/30 sticky top-0 z-50 px-6 py-3">
      <div className="flex items-center justify-between">
        <Link to="/feed" className="text-xl font-light tracking-widest text-stone-100 hover:text-rose-500 transition-colors">
          dev<span className="text-rose-500 font-normal">Tinder</span>
        </Link>

        {user && (
          <div className="flex items-center gap-6">
            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex items-center gap-1">
              <Link 
                to="/feed" 
                className={`px-4 py-2 text-sm tracking-wide transition-colors ${isActive('/feed') ? 'text-rose-500' : 'text-stone-400 hover:text-stone-200'}`}
              >
                Discover
              </Link>
              <Link 
                to="/connections" 
                className={`px-4 py-2 text-sm tracking-wide transition-colors ${isActive('/connections') ? 'text-rose-500' : 'text-stone-400 hover:text-stone-200'}`}
              >
                Connections
              </Link>
              <Link 
                to="/requests" 
                className={`px-4 py-2 text-sm tracking-wide transition-colors ${isActive('/requests') ? 'text-rose-500' : 'text-stone-400 hover:text-stone-200'}`}
              >
                Requests
              </Link>
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-9 h-9 rounded-full ring-1 ring-rose-500/30 ring-offset-1 ring-offset-stone-950 overflow-hidden"
              >
                <img
                  alt={user.name}
                  src={user.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&background=1c1917&color=e11d48`}
                  className="w-full h-full object-cover"
                />
              </button>
              
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 p-3 bg-stone-900/95 backdrop-blur-md rounded-xl border border-stone-700/50 shadow-xl">
                  <div className="px-3 py-2 mb-2">
                    <p className="font-medium text-stone-100 text-sm">{user.name}</p>
                    <p className="text-xs text-stone-500">{user.email}</p>
                  </div>
                  <div className="h-px bg-stone-700/30 my-2"></div>
                  <Link 
                    to="/profile" 
                    onClick={() => setDropdownOpen(false)}
                    className="block px-3 py-2 text-sm text-stone-400 hover:text-stone-100 rounded-lg hover:bg-stone-800/50 transition-colors"
                  >
                    Profile
                  </Link>
                  <Link 
                    to="/feed" 
                    onClick={() => setDropdownOpen(false)}
                    className="block md:hidden px-3 py-2 text-sm text-stone-400 hover:text-stone-100 rounded-lg hover:bg-stone-800/50 transition-colors"
                  >
                    Discover
                  </Link>
                  <Link 
                    to="/connections" 
                    onClick={() => setDropdownOpen(false)}
                    className="block md:hidden px-3 py-2 text-sm text-stone-400 hover:text-stone-100 rounded-lg hover:bg-stone-800/50 transition-colors"
                  >
                    Connections
                  </Link>
                  <Link 
                    to="/requests" 
                    onClick={() => setDropdownOpen(false)}
                    className="block md:hidden px-3 py-2 text-sm text-stone-400 hover:text-stone-100 rounded-lg hover:bg-stone-800/50 transition-colors"
                  >
                    Requests
                  </Link>
                  <Link 
                    to="/settings" 
                    onClick={() => setDropdownOpen(false)}
                    className="block px-3 py-2 text-sm text-stone-400 hover:text-stone-100 rounded-lg hover:bg-stone-800/50 transition-colors"
                  >
                    Settings
                  </Link>
                  <div className="h-px bg-stone-700/30 my-2"></div>
                  <button 
                    onClick={handleLogout} 
                    disabled={loggingOut}
                    className="w-full text-left px-3 py-2 text-sm text-stone-500 hover:text-red-400 rounded-lg hover:bg-stone-800/50 transition-colors flex items-center gap-2"
                  >
                    {loggingOut && <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin"></div>}
                    {loggingOut ? 'Signing out...' : 'Sign out'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {!user && (
          <Link to="/login" className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm rounded-lg tracking-wider transition-colors">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar
