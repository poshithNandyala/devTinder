import axios from 'axios'
import { useEffect, useState } from 'react'
import { BASE_URL } from '../utils/constants'
import { toast } from 'react-toastify'

function SentRequests() {
  const [sentRequests, setSentRequests] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('pending')
  const [withdrawingId, setWithdrawingId] = useState(null)

  useEffect(() => {
    const fetchSentRequests = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/connection/sentrequests`, { withCredentials: true })
        setSentRequests(res.data)
      } catch (error) {
        toast.error('Failed to load sent requests')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchSentRequests()
  }, [])

  const handleWithdraw = async (connectionId) => {
    setWithdrawingId(connectionId)
    try {
      await axios.delete(`${BASE_URL}/connection/remove/${connectionId}`, { withCredentials: true })
      setSentRequests(prev => ({
        ...prev,
        pending: prev.pending.filter(req => req._id !== connectionId)
      }))
      toast.success('Request withdrawn')
    } catch (error) {
      toast.error('Failed to withdraw request')
      console.error(error)
    } finally {
      setWithdrawingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="w-8 h-8 border-2 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const tabs = [
    { id: 'pending', label: 'Pending', icon: '⏳', color: 'amber' },
    { id: 'accepted', label: 'Accepted', icon: '💚', color: 'emerald' },
    { id: 'rejected', label: 'Rejected', icon: '💔', color: 'red' },
  ]

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      accepted: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
    }
    const labels = {
      pending: 'Awaiting Response',
      accepted: 'Connected',
      rejected: 'Declined',
    }
    return (
      <span className={`px-2 py-1 text-xs rounded-full border ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  const currentList = sentRequests?.[activeTab] || []
  const totalCount = (sentRequests?.pending?.length || 0) + 
                     (sentRequests?.accepted?.length || 0) + 
                     (sentRequests?.rejected?.length || 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-light tracking-wide text-stone-100">Sent Requests</h1>
        <p className="text-stone-500 text-sm mt-2">
          {totalCount} total {totalCount === 1 ? 'request' : 'requests'} sent
        </p>
      </div>

      {/* Tabs */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="flex justify-center gap-2 bg-stone-900/30 backdrop-blur-sm border border-stone-800/30 rounded-xl p-2">
          {tabs.map((tab) => {
            const count = sentRequests?.[tab.id]?.length || 0
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                  isActive
                    ? 'bg-rose-600/20 text-rose-400 border border-rose-500/30'
                    : 'text-stone-500 hover:text-stone-300 hover:bg-stone-800/50'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                  isActive ? 'bg-rose-500/30' : 'bg-stone-700/50'
                }`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto">
        {currentList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-stone-800/50 flex items-center justify-center mb-6">
              <span className="text-3xl opacity-50">
                {activeTab === 'pending' ? '⏳' : activeTab === 'accepted' ? '💚' : '💔'}
              </span>
            </div>
            <h2 className="text-xl font-light tracking-wide mb-2 text-stone-200">
              No {activeTab} requests
            </h2>
            <p className="text-stone-500 text-sm max-w-xs">
              {activeTab === 'pending' 
                ? "Requests you've sent that are awaiting a response will appear here"
                : activeTab === 'accepted'
                ? "Requests that have been accepted will appear here"
                : "Requests that were declined will appear here"
              }
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {currentList.map((request) => (
              <div
                key={request._id}
                className={`bg-stone-900/30 backdrop-blur-sm border rounded-xl p-5 transition-all duration-300 ${
                  activeTab === 'pending' 
                    ? 'border-amber-500/20 hover:border-amber-500/40'
                    : activeTab === 'accepted'
                    ? 'border-emerald-500/20 hover:border-emerald-500/40'
                    : 'border-red-500/20 hover:border-red-500/40'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-full overflow-hidden ring-2 ${
                    activeTab === 'pending' 
                      ? 'ring-amber-500/30'
                      : activeTab === 'accepted'
                      ? 'ring-emerald-500/30'
                      : 'ring-red-500/30'
                  }`}>
                    <img
                      src={request.user?.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(request.user?.name || 'U')}&background=1c1917&color=e11d48`}
                      alt={request.user?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-medium text-stone-100 truncate">
                        {request.user?.name || 'Unknown'}
                      </h2>
                      {getStatusBadge(activeTab)}
                    </div>
                    <p className="text-xs text-stone-500 mt-1">
                      {request.user?.age ? `${request.user.age} years` : ''} 
                      {request.user?.gender ? ` · ${request.user.gender}` : ''}
                      {request.user?.college ? ` · ${request.user.college}` : ''}
                    </p>
                  </div>

                  {/* Withdraw button for pending */}
                  {activeTab === 'pending' && (
                    <button
                      onClick={() => handleWithdraw(request._id)}
                      disabled={withdrawingId === request._id}
                      className="px-3 py-1.5 text-xs bg-transparent border border-amber-500/30 text-amber-400 rounded-lg hover:bg-amber-500/10 hover:border-amber-500/50 transition-all disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {withdrawingId === request._id ? (
                        <div className="w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      Withdraw
                    </button>
                  )}

                  {/* Social links for accepted */}
                  {activeTab === 'accepted' && (
                    <div className="flex gap-2">
                      {request.user?.githubId && (
                        <a
                          href={`https://github.com/${request.user.githubId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-stone-800/50 flex items-center justify-center text-stone-500 hover:text-emerald-400 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                        </a>
                      )}
                      {request.user?.linkedinId && (
                        <a
                          href={`https://linkedin.com/in/${request.user.linkedinId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-stone-800/50 flex items-center justify-center text-stone-500 hover:text-emerald-400 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                          </svg>
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* About section */}
                {request.user?.about && (
                  <p className="text-sm text-stone-400 mt-3 line-clamp-2">{request.user.about}</p>
                )}

                {/* Skills */}
                {request.user?.skills && request.user.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {request.user.skills.slice(0, 4).map((skill, idx) => (
                      <span 
                        key={idx} 
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          activeTab === 'pending'
                            ? 'bg-amber-600/10 text-amber-400/80'
                            : activeTab === 'accepted'
                            ? 'bg-emerald-600/10 text-emerald-400/80'
                            : 'bg-red-600/10 text-red-400/80'
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                    {request.user.skills.length > 4 && (
                      <span className="px-2 py-0.5 text-xs bg-stone-700/50 text-stone-400 rounded-full">
                        +{request.user.skills.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SentRequests
