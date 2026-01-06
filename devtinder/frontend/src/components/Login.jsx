import { useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { login } from '../utils/slices/userSlice'
import { useNavigate } from 'react-router'
import { BASE_URL } from '../utils/constants'
import { toast } from 'react-toastify'

export default function AuthForm() {
    const [isLogin, setIsLogin] = useState(true)

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
            toast.success(isLogin ? `Welcome back, ${res.data.name}` : `Welcome, ${res.data.name}`)
            navigate('/feed')
        } catch (error) {
            const serverMsg = error?.response?.data?.message || error?.response?.data
            toast.error(typeof serverMsg === 'string' ? serverMsg : 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    const inputClass = "w-full px-4 py-3 bg-stone-800/50 border border-stone-700/50 rounded-lg text-stone-100 placeholder-stone-500 focus:outline-none focus:border-rose-500/50 transition-colors"
    const selectClass = "w-full px-4 py-3 bg-stone-800/50 border border-stone-700/50 rounded-lg text-stone-300 focus:outline-none focus:border-rose-500/50 transition-colors"

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-light tracking-widest">
                        dev<span className="text-rose-500 font-normal">Tinder</span>
                    </h1>
                    <p className="text-stone-500 text-sm mt-3 tracking-wide">
                        Where developers connect
                    </p>
                </div>

                {/* Card */}
                <div className="bg-stone-900/30 backdrop-blur-sm border border-stone-800/30 rounded-2xl p-8">
                    {/* Toggle */}
                    <div className="flex justify-center gap-8 mb-8">
                        <button
                            type="button"
                            onClick={() => { setIsLogin(true); resetForm() }}
                            className={`text-sm tracking-wider pb-2 border-b-2 transition-colors ${isLogin ? 'text-rose-500 border-rose-500' : 'text-stone-500 border-transparent hover:text-stone-400'}`}
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            onClick={() => { setIsLogin(false); resetForm() }}
                            className={`text-sm tracking-wider pb-2 border-b-2 transition-colors ${!isLogin ? 'text-rose-500 border-rose-500' : 'text-stone-500 border-transparent hover:text-stone-400'}`}
                        >
                            Sign Up
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {!isLogin && (
                            <>
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    className={inputClass}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
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
                                        required
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setShowMore(!showMore)}
                                    className="text-xs text-stone-500 hover:text-rose-500 transition-colors tracking-wider"
                                >
                                    {showMore ? '− Less options' : '+ More options'}
                                </button>

                                {showMore && (
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
                                        <div>
                                            <label className="text-xs text-stone-500 mb-2 block">Profile Photo</label>
                                            <input
                                                type="file"
                                                className="w-full text-sm text-stone-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-stone-800 file:text-stone-300 hover:file:bg-stone-700"
                                                accept="image/*"
                                                onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                                            />
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        <input
                            type="email"
                            placeholder="Email"
                            className={inputClass}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                        />

                        <div>
                            <input
                                type="password"
                                placeholder="Password"
                                className={inputClass}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete={isLogin ? 'current-password' : 'new-password'}
                            />
                            {!isLogin && (
                                <p className="text-xs text-stone-600 mt-2">
                                    Min 8 chars with uppercase, lowercase, number & symbol
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg tracking-wider transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                            {loading ? '' : (isLogin ? 'Sign In' : 'Create Account')}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
