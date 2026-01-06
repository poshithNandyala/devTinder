import axios from 'axios'
import { useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router'
import { BASE_URL } from '../utils/constants'
import { login } from '../utils/slices/userSlice'

function EditProfile() {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: user?.name || '',
    gender: user?.gender || 'male',
    age: user?.age || '',
    about: user?.about || '',
    skills: Array.isArray(user?.skills) ? user.skills.join(', ') : (user?.skills || ''),
    college: user?.college || '',
    company: user?.company || '',
    githubId: user?.githubId || '',
    linkedinId: user?.linkedinId || ''
  })
  const [interestedIn, setInterestedIn] = useState(user?.interestedIn || [])
  const [photo, setPhoto] = useState(null)
  const [loading, setLoading] = useState(false)

  const toggleInterest = (value) => {
    setInterestedIn(prev => 
      prev.includes(value) 
        ? prev.filter(v => v !== value)
        : [...prev, value]
    )
  }

  const photoPreview = useMemo(() => {
    if (photo) return URL.createObjectURL(photo)
    return user?.photoUrl || null
  }, [photo, user?.photoUrl])

  function handleChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  function handlePhotoChange(e) {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Photo must be less than 5MB')
        return
      }
      setPhoto(file)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const age = Number(formData.age)
    if (age < 18 || age > 100) {
      toast.error('Age must be between 18 and 100')
      return
    }

    if (!formData.name.trim()) {
      toast.error('Name is required')
      return
    }

    setLoading(true)
    try {
      const data = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          data.append(key, value)
        }
      })
      if (photo) data.append('photo', photo)
      if (interestedIn.length > 0) data.append('interestedIn', interestedIn.join(','))

      const res = await axios.patch(BASE_URL + "/user/update", data, { withCredentials: true })
      dispatch(login(res.data))
      toast.success('Profile updated')
      setPhoto(null)
    } catch (error) {
      const msg = error?.response?.data || 'Something went wrong'
      toast.error(typeof msg === 'string' ? msg : 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full px-4 py-3 bg-stone-800/50 border border-stone-700/50 rounded-lg text-stone-100 placeholder-stone-500 focus:outline-none focus:border-rose-500/50 transition-colors"
  const selectClass = "w-full px-4 py-3 bg-stone-800/50 border border-stone-700/50 rounded-lg text-stone-300 focus:outline-none focus:border-rose-500/50 transition-colors"
  const labelClass = "block text-xs text-stone-500 uppercase tracking-wider mb-2"

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <h2 className="text-xl font-light tracking-wide mb-2 text-stone-200">Access Required</h2>
        <p className="text-stone-500 text-sm mb-6">Please sign in to edit your profile</p>
        <button 
          onClick={() => navigate('/login')} 
          className="px-4 py-2 bg-rose-600 text-white text-sm rounded-lg hover:bg-rose-700 transition-colors tracking-wider"
        >
          Sign In
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-light tracking-wide text-center mb-8 text-stone-100">Edit Profile</h1>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-5">
          <div className="bg-stone-900/30 backdrop-blur-sm border border-stone-800/30 rounded-2xl p-6">
            {/* Photo */}
            <div className="mb-6">
              <label className={labelClass}>Photo</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden ring-1 ring-rose-600/20 flex-shrink-0">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-stone-800 flex items-center justify-center text-stone-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  className="flex-1 text-sm text-stone-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-stone-800 file:text-stone-300 hover:file:bg-stone-700"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
              </div>
            </div>

            {/* Name */}
            <div className="mb-5">
              <label className={labelClass}>Name</label>
              <input
                type="text"
                name="name"
                className={inputClass}
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Gender & Age */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className={labelClass}>Gender</label>
                <select
                  name="gender"
                  className={selectClass}
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Age</label>
                <input
                  type="number"
                  name="age"
                  className={inputClass}
                  value={formData.age}
                  onChange={handleChange}
                  min={18}
                  max={100}
                  required
                />
              </div>
            </div>

            {/* About */}
            <div className="mb-5">
              <label className={labelClass}>About</label>
              <textarea
                name="about"
                className={`${inputClass} h-24 resize-none`}
                value={formData.about}
                onChange={handleChange}
                placeholder="Tell others about yourself..."
              />
            </div>

            {/* Skills */}
            <div className="mb-5">
              <label className={labelClass}>Skills</label>
              <input
                type="text"
                name="skills"
                className={inputClass}
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, Node.js, Python..."
              />
            </div>

            {/* College & Company */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className={labelClass}>College</label>
                <input
                  type="text"
                  name="college"
                  className={inputClass}
                  value={formData.college}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className={labelClass}>Company</label>
                <input
                  type="text"
                  name="company"
                  className={inputClass}
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Social */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className={labelClass}>GitHub</label>
                <input
                  type="text"
                  name="githubId"
                  className={inputClass}
                  value={formData.githubId}
                  onChange={handleChange}
                  placeholder="username"
                />
              </div>
              <div>
                <label className={labelClass}>LinkedIn</label>
                <input
                  type="text"
                  name="linkedinId"
                  className={inputClass}
                  value={formData.linkedinId}
                  onChange={handleChange}
                  placeholder="username"
                />
              </div>
            </div>

            {/* Interested In */}
            <div className="mb-6">
              <label className={labelClass}>Interested In</label>
              <div className="flex gap-2">
                {[
                  { value: 'male', label: 'Men' },
                  { value: 'female', label: 'Women' },
                  { value: 'other', label: 'Everyone' }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => toggleInterest(option.value)}
                    className={`flex-1 py-2.5 rounded-lg text-sm transition-all ${
                      interestedIn.includes(option.value)
                        ? 'bg-rose-600 text-white'
                        : 'bg-stone-800/50 text-stone-400 border border-stone-700/50 hover:border-rose-500/50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg tracking-wider transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              disabled={loading}
            >
              {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
              {loading ? '' : 'Save Changes'}
            </button>
          </div>
        </form>

        {/* Preview */}
        <div className="lg:col-span-2">
          <div className="sticky top-20">
            <p className="text-xs text-stone-500 uppercase tracking-wider mb-4 text-center">Preview</p>
            <div className="bg-stone-900/30 backdrop-blur-sm border border-stone-800/30 rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="h-16 bg-gradient-to-r from-rose-600/20 via-rose-500/10 to-rose-700/20"></div>
              
              <div className="px-5 pb-6">
                {/* Avatar */}
                <div className="flex justify-center -mt-8 mb-4">
                  <div className="w-16 h-16 rounded-full ring-4 ring-stone-950 overflow-hidden">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-stone-800 flex items-center justify-center text-stone-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="font-medium text-stone-100">{formData.name || 'Your Name'}</h3>
                  <p className="text-xs text-stone-500 mt-1 capitalize">{formData.gender} · {formData.age || '?'}</p>
                </div>

                {formData.about && (
                  <p className="text-xs text-stone-400 text-center mt-3 line-clamp-2">{formData.about}</p>
                )}

                {formData.skills && (
                  <div className="flex flex-wrap justify-center gap-1 mt-3">
                    {formData.skills.split(',').slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="px-2 py-0.5 text-xs bg-rose-600/10 text-rose-400/80 rounded-full">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {(formData.college || formData.company) && (
                  <div className="text-xs text-stone-500 text-center mt-3 space-y-1">
                    {formData.college && <p>{formData.college}</p>}
                    {formData.company && <p>{formData.company}</p>}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditProfile
