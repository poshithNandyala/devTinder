import { useEffect, useState } from "react"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { Outlet, useNavigate, useLocation } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { BASE_URL } from "../utils/constants"
import { login } from "../utils/slices/userSlice"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const PUBLIC_ROUTES = ['/login', '/signup']

function Body() {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const [loading, setLoading] = useState(true)

  const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname)

  useEffect(() => {
    const fetchUser = async () => {
      if (user) {
        setLoading(false)
        return
      }

      try {
        const res = await axios.get(BASE_URL + "/user/profile", { withCredentials: true })
        dispatch(login(res.data))
      } catch (error) {
        if (error?.response?.status === 401 && !isPublicRoute) {
          navigate("/login", { replace: true })
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [user, dispatch, navigate, isPublicRoute])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="w-8 h-8 border-2 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-stone-500 text-sm tracking-widest">devTinder</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer
        position="top-center"
        autoClose={2500}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme="dark"
        limit={2}
        toastStyle={{
          background: '#1c1917',
          border: '1px solid rgba(225, 29, 72, 0.2)',
          borderRadius: '12px',
          color: '#fafaf9'
        }}
      />
    </div>
  )
}

export default Body
