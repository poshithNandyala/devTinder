import axios from 'axios'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { login } from '../utils/slices/userSlice'
import { useNavigate } from 'react-router'
import { BASE_URL } from '../utils/constants'
import { ToastContainer, toast } from 'react-toastify'
const Login = () => {
    const [email, setEmail] = useState('virat@gmail.com')
    const [password, setPassword] = useState('Virat@123')

    const dispatch = useDispatch()
    const navigate = useNavigate()

    async function handleLogin(e) {
        e.preventDefault()

        try {
            const res = await axios.post(
                BASE_URL + '/user/login',
                { email, password },
                { withCredentials: true }
            )

            dispatch(login(res.data))
            navigate('/feed')
        } catch (error) {
            toast.error(error?.response?.data || "Something went wrong")
            console.log(error)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen">
            <form onSubmit={handleLogin}>
                <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                    <legend className="fieldset-legend">Login</legend>

                    <label className="label">Email</label>
                    <input
                        type="email"
                        className="input"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label className="label">Password</label>
                    <input
                        type="password"
                        className="input"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit" className="btn btn-neutral mt-4">
                        Login
                    </button>
                </fieldset>
            </form>
    
        </div>
    )
}

export default Login
