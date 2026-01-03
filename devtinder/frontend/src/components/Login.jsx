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

    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        try {
            const payload = isLogin
                ? { email, password }
                : { name, email, password, gender, age: age ? Number(age) : undefined }
            const endpoint = isLogin ? '/user/login' : '/user/signup'

            const res = await axios.post(BASE_URL + endpoint, payload, { withCredentials: true })
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
                                min={0}
                                required={!isLogin}
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
