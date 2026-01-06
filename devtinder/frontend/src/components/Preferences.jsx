import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import axios from 'axios'
import { toast } from 'react-toastify'
import { BASE_URL } from '../utils/constants'
import { login } from '../utils/slices/userSlice'

function Preferences() {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [selected, setSelected] = useState(user?.interestedIn || [])
  const [loading, setLoading] = useState(false)

  const options = [
    { value: 'male', label: 'Men', icon: '♂' },
    { value: 'female', label: 'Women', icon: '♀' },
    { value: 'other', label: 'Everyone', icon: '⚥' }
  ]

  const toggleOption = (value) => {
    setSelected(prev => 
      prev.includes(value) 
        ? prev.filter(v => v !== value)
        : [...prev, value]
    )
  }

  const handleContinue = async () => {
    if (selected.length === 0) {
      toast.error('Select at least one preference')
      return
    }

    setLoading(true)
    try {
      const res = await axios.patch(
        `${BASE_URL}/user/update`,
        { interestedIn: selected.join(',') },
        { withCredentials: true }
      )
      dispatch(login(res.data))
      toast.success('Preferences saved')
      navigate('/feed')
    } catch (error) {
      toast.error('Failed to save preferences')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = () => {
    navigate('/feed')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-light tracking-wide text-stone-100 mb-3">
            Who catches your eye?
          </h1>
          <p className="text-stone-500 text-sm">
            Select all that spark your interest
          </p>
        </div>

        {/* Options */}
        <div className="space-y-4 mb-12">
          {options.map((option) => {
            const isSelected = selected.includes(option.value)
            return (
              <button
                key={option.value}
                onClick={() => toggleOption(option.value)}
                className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between group ${
                  isSelected
                    ? 'bg-rose-600/10 border-rose-500 text-rose-400'
                    : 'bg-stone-900/30 border-stone-800/50 text-stone-400 hover:border-stone-700 hover:text-stone-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`text-2xl transition-transform duration-300 ${isSelected ? 'scale-110' : 'group-hover:scale-105'}`}>
                    {option.icon}
                  </span>
                  <span className="text-lg tracking-wide">{option.label}</span>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  isSelected 
                    ? 'border-rose-500 bg-rose-500' 
                    : 'border-stone-600'
                }`}>
                  {isSelected && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleContinue}
            disabled={loading || selected.length === 0}
            className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
            {loading ? '' : 'Continue'}
          </button>
          <button
            onClick={handleSkip}
            className="w-full py-3 text-stone-500 hover:text-stone-400 text-sm tracking-wider transition-colors"
          >
            Skip for now
          </button>
        </div>

        {/* Hint */}
        <p className="mt-8 text-xs text-stone-600">
          You can change this anytime in settings
        </p>
      </div>
    </div>
  )
}

export default Preferences
