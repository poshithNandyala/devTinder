import axios from 'axios'
import { useEffect, useState } from 'react'
import { BASE_URL } from '../utils/constants'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { setRequest, removeRequest } from '../utils/slices/requestSlice'

function Requests() {
  const dispatch = useDispatch()
  const requests = useSelector((state) => state.request)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState({})

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/connection/getallrequests`, { withCredentials: true })
        dispatch(setRequest(res.data))
      } catch (error) {
        toast.error('Failed to load requests')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [dispatch])

  const handleAction = async (requestId, status) => {
    setActionLoading(prev => ({ ...prev, [requestId]: status }))
    try {
      await axios.patch(
        `${BASE_URL}/connection/review/${status}/${requestId}`,
        {},
        { withCredentials: true }
      )

      dispatch(removeRequest(requestId))
      toast.success(status === 'accepted' ? 'Connection accepted' : 'Request declined')
    } catch (error) {
      toast.error('Action failed')
      console.error(error)
    } finally {
      setActionLoading(prev => ({ ...prev, [requestId]: null }))
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="w-8 h-8 border-2 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <div className="w-16 h-16 rounded-full bg-stone-800/50 flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-rose-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-xl font-light tracking-wide mb-2 text-stone-200">No Pending Requests</h2>
        <p className="text-stone-500 text-sm max-w-xs">
          When someone shows interest, you will see it here
        </p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-light tracking-wide text-stone-100">Requests</h1>
        <p className="text-stone-500 text-sm mt-2">{requests.length} pending</p>
      </div>

      <div className="max-w-lg mx-auto space-y-3">
        {requests.map((req) => (
          <div
            key={req._id}
            className="bg-stone-900/30 backdrop-blur-sm border border-stone-800/30 rounded-xl p-5 hover:border-rose-600/30 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden ring-1 ring-rose-600/20">
                <img
                  src={req.fromId?.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(req.fromId?.name || 'U')}&background=1c1917&color=e11d48`}
                  alt={req.fromId?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h2 className="font-medium text-stone-100">{req.fromId?.name || 'Unknown'}</h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  {req.fromId?.age ? `${req.fromId.age} years` : ''} 
                  {req.fromId?.gender ? ` · ${req.fromId.gender}` : ''}
                </p>
              </div>
            </div>

            {req.fromId?.about && (
              <p className="text-sm text-stone-400 mt-3 line-clamp-2">{req.fromId.about}</p>
            )}

            {req.fromId?.skills && req.fromId.skills.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {req.fromId.skills.slice(0, 4).map((skill, idx) => (
                  <span key={idx} className="px-2 py-0.5 text-xs bg-rose-600/10 text-rose-400/80 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-3 mt-5">
              <button
                className="flex-1 py-2.5 bg-transparent border border-stone-700 text-stone-400 rounded-lg hover:border-red-500/50 hover:text-red-400 transition-colors text-sm flex items-center justify-center"
                onClick={() => handleAction(req._id, 'rejected')}
                disabled={!!actionLoading[req._id]}
              >
                {actionLoading[req._id] === 'rejected' ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Decline'
                )}
              </button>

              <button
                className="flex-1 py-2.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors text-sm flex items-center justify-center"
                onClick={() => handleAction(req._id, 'accepted')}
                disabled={!!actionLoading[req._id]}
              >
                {actionLoading[req._id] === 'accepted' ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Accept'
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Requests
