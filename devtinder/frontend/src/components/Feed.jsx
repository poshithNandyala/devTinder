import axios from 'axios'
import { useEffect, useState, useCallback } from 'react'
import { BASE_URL } from '../utils/constants'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { setFeed } from '../utils/slices/feedSlice'
import FeedCard from './FeedCard'

function Feed() {
  const dispatch = useDispatch()
  const feed = useSelector((state) => state.feed)
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({ skills: '', college: '' })
  const [activeFilters, setActiveFilters] = useState({ skills: '', college: '' })

  const fetchFeed = useCallback(async (filterParams = {}) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filterParams.skills) params.append('skills', filterParams.skills)
      if (filterParams.college) params.append('college', filterParams.college)
      
      const url = `${BASE_URL}/connection/feed${params.toString() ? '?' + params.toString() : ''}`
      const res = await axios.get(url, { withCredentials: true })
      dispatch(setFeed(res.data.data))
    } catch (err) {
      console.error(err)
      toast.error('Failed to fetch profiles')
    } finally {
      setLoading(false)
    }
  }, [dispatch])

  useEffect(() => {
    fetchFeed()
  }, [fetchFeed])

  const applyFilters = () => {
    setActiveFilters({ ...filters })
    fetchFeed(filters)
    setShowFilters(false)
  }

  const clearFilters = () => {
    setFilters({ skills: '', college: '' })
    setActiveFilters({ skills: '', college: '' })
    fetchFeed({})
    setShowFilters(false)
  }

  const hasActiveFilters = activeFilters.skills || activeFilters.college

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-stone-500 text-sm tracking-wide">Finding your match...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-light tracking-wide text-stone-100">Discover</h1>
        <p className="text-stone-500 text-sm mt-2 tracking-wider">
          {feed?.length || 0} {feed?.length === 1 ? 'developer awaits' : 'developers await'}
        </p>
      </div>

      {/* Filter Toggle */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-2 text-sm rounded-lg flex items-center gap-2 tracking-wide transition-colors ${
            hasActiveFilters 
              ? 'bg-rose-600 text-white' 
              : 'bg-stone-800/50 text-stone-400 hover:text-stone-200'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          {hasActiveFilters ? 'Filters Active' : 'Filter'}
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="max-w-md mx-auto mb-8 p-6 bg-stone-900/50 backdrop-blur-sm rounded-2xl border border-stone-800/50">
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-stone-500 uppercase tracking-wider mb-2">Skills</label>
              <input
                type="text"
                placeholder="React, Node.js, Python..."
                className="w-full px-4 py-3 bg-stone-800/50 border border-stone-700/50 rounded-lg text-stone-100 placeholder-stone-500 focus:outline-none focus:border-rose-500/50"
                value={filters.skills}
                onChange={(e) => setFilters(prev => ({ ...prev, skills: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-xs text-stone-500 uppercase tracking-wider mb-2">College</label>
              <input
                type="text"
                placeholder="Search by college..."
                className="w-full px-4 py-3 bg-stone-800/50 border border-stone-700/50 rounded-lg text-stone-100 placeholder-stone-500 focus:outline-none focus:border-rose-500/50"
                value={filters.college}
                onChange={(e) => setFilters(prev => ({ ...prev, college: e.target.value }))}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={clearFilters} 
                className="flex-1 py-2 bg-stone-800/50 text-stone-400 rounded-lg text-sm tracking-wider hover:bg-stone-800 transition-colors"
              >
                Clear
              </button>
              <button 
                onClick={applyFilters} 
                className="flex-1 py-2 bg-rose-600 text-white rounded-lg text-sm tracking-wider hover:bg-rose-700 transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Tags */}
      {hasActiveFilters && (
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          {activeFilters.skills && (
            <span className="px-3 py-1 bg-rose-600/20 text-rose-400 border border-rose-600/30 rounded-full text-sm flex items-center gap-2">
              Skills: {activeFilters.skills}
              <button onClick={() => { 
                const newFilters = { ...activeFilters, skills: '' }
                setActiveFilters(newFilters)
                setFilters(newFilters)
                fetchFeed(newFilters)
              }} className="hover:text-rose-200">×</button>
            </span>
          )}
          {activeFilters.college && (
            <span className="px-3 py-1 bg-rose-600/20 text-rose-400 border border-rose-600/30 rounded-full text-sm flex items-center gap-2">
              College: {activeFilters.college}
              <button onClick={() => { 
                const newFilters = { ...activeFilters, college: '' }
                setActiveFilters(newFilters)
                setFilters(newFilters)
                fetchFeed(newFilters)
              }} className="hover:text-rose-200">×</button>
            </span>
          )}
        </div>
      )}

      {/* Feed Content */}
      {!feed || feed.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
          <div className="w-20 h-20 rounded-full bg-stone-800/50 flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-rose-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-light tracking-wide mb-2 text-stone-200">No Profiles Found</h2>
          <p className="text-stone-500 text-sm max-w-xs">
            {hasActiveFilters 
              ? 'Try adjusting your filters to discover more developers'
              : 'Check back later for new connections'
            }
          </p>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="mt-4 px-4 py-2 bg-rose-600 text-white text-sm rounded-lg hover:bg-rose-700 transition-colors">
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="flex justify-center">
          <FeedCard user={feed[0]} />
        </div>
      )}
    </div>
  )
}

export default Feed
