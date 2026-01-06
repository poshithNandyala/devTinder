import React, { useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { login } from '../utils/slices/userSlice'
import { useNavigate } from 'react-router'
import { BASE_URL } from '../utils/constants'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function AuthForm() {
    const [isLogin, setIsLogin] = useState(true)

    const [email, setEmail] = useState('virat@gmail.com')
    const [password, setPassword] = useState('Virat@123')
    // signup-only fields
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

    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        try {
            let res;
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
            // assume API returns user object / token in res.data
            dispatch(login(res.data))
            toast.success(isLogin ? 'Login successful' : 'Signup successful — welcome!')
            navigate('/feed')
        } catch (error) {
            const serverMsg = error?.response?.data?.message || error?.response?.data
            toast.error(serverMsg || 'Something went wrong')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen p-4">
            <form onSubmit={handleSubmit} className="w-full max-w-md">
                <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-6">
                    <legend className="fieldset-legend text-lg font-semibold">{isLogin ? 'Login' : 'Signup'}</legend>
                    {!isLogin && (
                        <>
                            <label className="label mt-2">Full name</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="Your full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required={!isLogin}
                                autoComplete="name"
                            />
                            <label className="label mt-2">Gender</label>
                            <select className="select w-full" value={gender} onChange={(e) => setGender(e.target.value)}>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                            <label className="label mt-2">Age</label>
                            <input
                                type="number"
                                className="input"
                                placeholder="Age"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                min={18}
                                max={100}
                                required={!isLogin}
                            />

                            <label className="label mt-2">About</label>
                            <textarea
                                className="textarea"
                                placeholder="Tell us about yourself"
                                value={about}
                                onChange={(e) => setAbout(e.target.value)}
                            />

                            <label className="label mt-2">Skills (comma separated)</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="e.g. React, Node.js, Python"
                                value={skills}
                                onChange={(e) => setSkills(e.target.value)}
                            />

                            <label className="label mt-2">College</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="Your college"
                                value={college}
                                onChange={(e) => setCollege(e.target.value)}
                            />

                            <label className="label mt-2">Company</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="Your company"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                            />

                            <label className="label mt-2">GitHub ID</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="Your GitHub username"
                                value={githubId}
                                onChange={(e) => setGithubId(e.target.value)}
                            />

                            <label className="label mt-2">LinkedIn ID</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="Your LinkedIn username"
                                value={linkedinId}
                                onChange={(e) => setLinkedinId(e.target.value)}
                            />

                            <label className="label mt-2">Profile Photo</label>
                            <input
                                type="file"
                                className="file-input"
                                accept="image/*"
                                onChange={(e) => setPhoto(e.target.files[0])}
                            />
                        </>
                    )}
                    <label className="label mt-2">Email</label>
                    <input
                        type="email"
                        className="input"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                    />
                    <label className="label mt-2">Password</label>
                    <input
                        type="password"
                        className="input"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete={isLogin ? 'current-password' : 'new-password'}
                    />
                    <button type="submit" className="btn btn-neutral mt-4 w-full" disabled={loading}>
                        {loading ? (isLogin ? 'Logging in...' : 'Signing up...') : (isLogin ? 'Login' : 'Signup')}
                    </button>
                    <p className="mt-4 text-sm text-center">
                        {isLogin ? (
                            <>
                                New user?{' '}
                                <button type="button" className="link" onClick={() => setIsLogin(false)}>
                                    Signup
                                </button>
                            </>
                        ) : (
                            <>
                                Existing user?{' '}
                                <button type="button" className="link" onClick={() => setIsLogin(true)}>
                                    Login
                                </button>
                            </>
                        )}
                    </p>
                </fieldset>
            </form>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        </div>
    )
}
