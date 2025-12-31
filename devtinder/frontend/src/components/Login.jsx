import axios from 'axios'
import React, { useState } from 'react'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    async function handleLogin() {
        try {
            const res = await axios.post('http://localhost:3000/user/login', {
                email: email,
                password: password
            })
            console.log(res)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className="flex justify-center items-center min-h-screen">
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                <legend className="fieldset-legend">Login</legend>

                <label className="label">Email</label>
                <input type="email" className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />

                <label className="label">Password</label>
                <input type="password" className="input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

                <button className="btn btn-neutral mt-4" onClick={handleLogin}>Login</button>
            </fieldset>
        </div>
    )
}

export default Login