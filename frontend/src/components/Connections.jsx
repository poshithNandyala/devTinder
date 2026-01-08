import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { BASE_URL } from '../utils/constants'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { setConnection, removeOneConnection } from '../utils/slices/connectionSlice'

function Connections() {
  const dispatch = useDispatch()
  const connections = useSelector((state) => state.connection)
  const [loading, setLoading] = useState(true)
  const [removingId, setRemovingId] = useState(null)

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/connection/allconnections`, { withCredentials: true })
        dispatch(setConnection(res.data))
      } catch (error) {
        toast.error('Failed to load connections')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchConnections()
  }, [dispatch])

  const handleRemoveConnection = async (connectionId) => {
    setRemovingId(connectionId)
    try {
      await axios.delete(`${BASE_URL}/connection/remove/${connectionId}`, { withCredentials: true })
      dispatch(removeOneConnection(connectionId))
      toast.success('Connection removed')
    } catch (error) {
      toast.error('Failed to remove connection')
      console.error(error)
    } finally {
      setRemovingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="w-8 h-8 border-2 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!connections || connections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <div className="w-16 h-16 rounded-full bg-stone-800/50 flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-rose-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-light tracking-wide mb-2 text-stone-200">No Connections Yet</h2>
        <p className="text-stone-500 text-sm max-w-xs">
          Start exploring profiles to make your first connection
        </p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-light tracking-wide text-stone-100">Connections</h1>
        <p className="text-stone-500 text-sm mt-2">{connections.length} {connections.length === 1 ? 'connection' : 'connections'}</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-3">
        {connections.map((user) => (
          <div
            key={user.connectionId}
            className="bg-stone-900/30 backdrop-blur-sm border border-stone-800/30 rounded-xl p-4 hover:border-rose-600/30 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden ring-1 ring-rose-600/20">
                <img
                  src={user.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&background=1c1917&color=e11d48`}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-medium text-stone-100 truncate">{user.name}</h2>
                <p className="text-xs text-stone-500 capitalize mt-0.5">
                  {user.gender} · {user.age}
                </p>
                {user.skills && user.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {user.skills.slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="px-2 py-0.5 text-xs bg-rose-600/10 text-rose-400/80 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {/* message button - the whole point of matching right? */}
                <Link
                  to={`/chat/${user._id}`}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500/20 to-pink-500/20 flex items-center justify-center text-rose-400 hover:from-rose-500/30 hover:to-pink-500/30 hover:text-rose-300 hover:scale-110 transition-all"
                  title="Send message"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </Link>
                {user.githubId && (
                  <a
                    href={`https://github.com/${user.githubId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-stone-800/50 flex items-center justify-center text-stone-500 hover:text-rose-500 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                )}
                {user.linkedinId && (
                  <a
                    href={`https://linkedin.com/in/${user.linkedinId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-stone-800/50 flex items-center justify-center text-stone-500 hover:text-rose-500 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                )}
                <button
                  onClick={() => handleRemoveConnection(user.connectionId)}
                  disabled={removingId === user.connectionId}
                  className="w-8 h-8 rounded-full bg-stone-800/50 flex items-center justify-center text-stone-500 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
                  title="Remove connection"
                >
                  {removingId === user.connectionId ? (
                    <div className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Connections
