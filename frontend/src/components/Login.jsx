import { useState, useMemo } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { login } from '../utils/slices/userSlice'
import { useNavigate } from 'react-router'
import { BASE_URL } from '../utils/constants'
import { toast } from 'react-toastify'

export default function AuthForm() {
    const [isLogin, setIsLogin] = useState(true)
    const [isAnimating, setIsAnimating] = useState(false)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [gender, setGender] = useState('male')
    const [age, setAge] = useState('')
    const [about, setAbout] = useState('')
    const [skills, setSkills] = useState('')
    const [college, setCollege] = useState('')
    const [company, setCompany] = useState('')
    const [githubId, setGithubId] = useState('')
    const [linkedinId, setLinkedinId] = useState('')
    const [photo, setPhoto] = useState(null)
    const [showMore, setShowMore] = useState(false)

    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const photoPreview = useMemo(() => {
        if (photo) return URL.createObjectURL(photo)
        return null
    }, [photo])

    const resetForm = () => {
        setName('')
        setAge('')
        setAbout('')
        setSkills('')
        setCollege('')
        setCompany('')
        setGithubId('')
        setLinkedinId('')
        setPhoto(null)
        setShowMore(false)
    }

    const handleModeSwitch = (toLogin) => {
        if (isAnimating || isLogin === toLogin) return
        setIsAnimating(true)
        setTimeout(() => {
            setIsLogin(toLogin)
            resetForm()
            setTimeout(() => setIsAnimating(false), 50)
        }, 300)
    }

    const handlePhotoChange = (e) => {
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

        if (!email || !password) {
            toast.error('Email and password are required')
            return
        }

        if (!isLogin) {
            if (!name.trim()) {
                toast.error('Name is required')
                return
            }
            const ageNum = Number(age)
            if (!age || ageNum < 18 || ageNum > 100) {
                toast.error('Age must be between 18 and 100')
                return
            }
        }

        setLoading(true)
        try {
            let res
            const endpoint = isLogin ? '/user/login' : '/user/signup'

            if (isLogin) {
                res = await axios.post(BASE_URL + endpoint, { email, password }, { withCredentials: true })
            } else {
                const formData = new FormData()
                formData.append('name', name)
                formData.append('email', email)
                formData.append('password', password)
                formData.append('gender', gender)
                formData.append('age', age)
                if (about) formData.append('about', about)
                if (skills) formData.append('skills', skills)
                if (college) formData.append('college', college)
                if (company) formData.append('company', company)
                if (githubId) formData.append('githubId', githubId)
                if (linkedinId) formData.append('linkedinId', linkedinId)
                if (photo) formData.append('photo', photo)

                res = await axios.post(BASE_URL + endpoint, formData, { withCredentials: true })
            }

            dispatch(login(res.data))
            
            if (isLogin) {
                toast.success(`Welcome back, ${res.data.name}`)
                navigate('/feed')
            } else {
                toast.success(`Welcome, ${res.data.name}`)
                navigate('/preferences')
            }
        } catch (error) {
            const serverMsg = error?.response?.data?.message || error?.response?.data
            toast.error(typeof serverMsg === 'string' ? serverMsg : 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    const inputClass = "w-full px-4 py-3 bg-stone-800/50 border border-stone-700/50 rounded-lg text-stone-100 placeholder-stone-500 focus:outline-none focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/20 transition-all duration-300"
    const selectClass = "w-full px-4 py-3 bg-stone-800/50 border border-stone-700/50 rounded-lg text-stone-300 focus:outline-none focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/20 transition-all duration-300"

    return (
        <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden">
            <div className="w-full max-w-md">
                {/* Logo with subtle pulse */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-light tracking-widest animate-pulse">
                        dev<span className="text-rose-500 font-normal">Tinder</span>
                    </h1>
                    <p className="text-stone-500 text-sm mt-3 tracking-wide">
                        Where developers connect
                    </p>
                </div>

                {/* Card with romantic glow effect */}
                <div className="relative">
                    {/* Animated glow background */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-rose-600/20 via-pink-500/20 to-rose-600/20 rounded-2xl blur-xl opacity-75 animate-pulse" />
                    
                    <div className="relative bg-stone-900/80 backdrop-blur-xl border border-stone-800/50 rounded-2xl p-8 shadow-2xl shadow-rose-900/10">
                        {/* Toggle with romantic underline animation */}
                        <div className="flex justify-center gap-8 mb-8">
                            <button
                                type="button"
                                onClick={() => handleModeSwitch(true)}
                                className={`relative text-sm tracking-wider pb-2 transition-all duration-500 ${isLogin ? 'text-rose-400' : 'text-stone-500 hover:text-stone-400'}`}
                            >
                                Sign In
                                <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-500 ease-out ${isLogin ? 'w-full' : 'w-0'}`} />
                            </button>
                            <button
                                type="button"
                                onClick={() => handleModeSwitch(false)}
                                className={`relative text-sm tracking-wider pb-2 transition-all duration-500 ${!isLogin ? 'text-rose-400' : 'text-stone-500 hover:text-stone-400'}`}
                            >
                                Sign Up
                                <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-500 ease-out ${!isLogin ? 'w-full' : 'w-0'}`} />
                            </button>
                        </div>

                        {/* Form container with smooth height transition */}
                        <div 
                            className={`transition-all duration-500 ease-out ${isAnimating ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'}`}
                        >
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Sign Up fields with staggered fade-in */}
                                <div className={`overflow-hidden transition-all duration-700 ease-out ${!isLogin ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className={`space-y-5 transform transition-all duration-500 ${!isLogin && !isAnimating ? 'translate-y-0' : '-translate-y-4'}`}>
                                        {/* Modern Photo Upload with heartbeat effect */}
                                        <div className="flex justify-center mb-6">
                                            <label className="relative cursor-pointer group">
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handlePhotoChange}
                                                />
                                                <div className={`w-24 h-24 rounded-full overflow-hidden border-2 border-dashed transition-all duration-300 hover:scale-105 ${
                                                    photoPreview 
                                                        ? 'border-rose-500 shadow-lg shadow-rose-500/30' 
                                                        : 'border-stone-600 group-hover:border-rose-500/50 group-hover:shadow-lg group-hover:shadow-rose-500/20'
                                                }`}>
                                                    {photoPreview ? (
                                                        <img 
                                                            src={photoPreview} 
                                                            alt="Preview" 
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-stone-800/50 flex flex-col items-center justify-center text-stone-500 group-hover:text-rose-500/70 transition-colors duration-300">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-1 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                            <span className="text-xs">Add Photo</span>
                                                        </div>
                                                    )}
                                                </div>
                                                {photoPreview && (
                                                    <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </label>
                                        </div>

                                        <input
                                            type="text"
                                            placeholder="Full Name"
                                            className={inputClass}
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />

                                        <div className="grid grid-cols-2 gap-4">
                                            <select 
                                                className={selectClass}
                                                value={gender} 
                                                onChange={(e) => setGender(e.target.value)}
                                            >
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                            <input
                                                type="number"
                                                placeholder="Age"
                                                className={inputClass}
                                                value={age}
                                                onChange={(e) => setAge(e.target.value)}
                                                min={18}
                                                max={100}
                                            />
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setShowMore(!showMore)}
                                            className="text-xs text-stone-500 hover:text-rose-500 transition-all duration-300 tracking-wider flex items-center gap-1"
                                        >
                                            <span className={`transform transition-transform duration-300 ${showMore ? 'rotate-180' : ''}`}>❤</span>
                                            {showMore ? 'Less options' : 'More options'}
                                        </button>

                                        {/* More options with smooth expand */}
                                        <div className={`overflow-hidden transition-all duration-500 ease-out ${showMore ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                            <div className="space-y-4 pt-2">
                                                <textarea
                                                    placeholder="About yourself..."
                                                    className={`${inputClass} h-20 resize-none`}
                                                    value={about}
                                                    onChange={(e) => setAbout(e.target.value)}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Skills (comma separated)"
                                                    className={inputClass}
                                                    value={skills}
                                                    onChange={(e) => setSkills(e.target.value)}
                                                />
                                                <div className="grid grid-cols-2 gap-4">
                                                    <input
                                                        type="text"
                                                        placeholder="College"
                                                        className={inputClass}
                                                        value={college}
                                                        onChange={(e) => setCollege(e.target.value)}
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Company"
                                                        className={inputClass}
                                                        value={company}
                                                        onChange={(e) => setCompany(e.target.value)}
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <input
                                                        type="text"
                                                        placeholder="GitHub username"
                                                        className={inputClass}
                                                        value={githubId}
                                                        onChange={(e) => setGithubId(e.target.value)}
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="LinkedIn username"
                                                        className={inputClass}
                                                        value={linkedinId}
                                                        onChange={(e) => setLinkedinId(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Shared fields with subtle slide effect */}
                                <div className={`transform transition-all duration-500 ${isAnimating ? 'translate-x-4 opacity-0' : 'translate-x-0 opacity-100'}`}>
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        className={inputClass}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        autoComplete="email"
                                    />
                                </div>

                                <div className={`transform transition-all duration-500 delay-75 ${isAnimating ? 'translate-x-4 opacity-0' : 'translate-x-0 opacity-100'}`}>
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        className={inputClass}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        autoComplete={isLogin ? 'current-password' : 'new-password'}
                                    />
                                    <div className={`overflow-hidden transition-all duration-300 ${!isLogin ? 'max-h-8 opacity-100' : 'max-h-0 opacity-0'}`}>
                                        <p className="text-xs text-stone-600 mt-2">
                                            Min 8 chars with uppercase, lowercase, number & symbol
                                        </p>
                                    </div>
                                </div>

                                {/* Submit button with gradient animation */}
                                <button
                                    type="submit"
                                    className={`w-full py-3 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 bg-[length:200%_auto] hover:bg-right text-white rounded-lg tracking-wider transition-all duration-500 flex items-center justify-center gap-2 disabled:opacity-50 hover:shadow-lg hover:shadow-rose-500/30 hover:scale-[1.02] active:scale-[0.98] ${isAnimating ? 'translate-y-2 opacity-0' : 'translate-y-0 opacity-100'}`}
                                    disabled={loading}
                                >
                                    {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                                    {loading ? '' : (isLogin ? 'Sign In' : 'Create Account')}
                                </button>
                            </form>
                        </div>

                        {/* Decorative hearts */}
                        <div className="absolute -top-2 -right-2 text-rose-500/20 text-2xl animate-pulse">♥</div>
                        <div className="absolute -bottom-2 -left-2 text-pink-500/20 text-xl animate-pulse delay-300">♥</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
