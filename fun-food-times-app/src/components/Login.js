import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { Pizza } from 'lucide-react'

function Login() {
    const navigate = useNavigate();

    const authUrl = process.env.REACT_APP_LOGIN_ENDPOINT;
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const response = await fetch(authUrl + '/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "user_email": email, "user_password": password }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Login failed')
            } else {
                localStorage.setItem('user', JSON.stringify(data.user_id))
                navigate('/home')
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred during login')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center">
            <div className="w-full max-w-md">
                <Link to="/">
                    <div className="absolute top-8 left-8">
                        <div className="flex items-center gap-2 text-blue-600">
                            <Pizza size={32} />
                            <span className="text-xl font-semibold">Fun Food Times</span>
                        </div>
                    </div>
                </Link>

                <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
                    <div className="text-center space-y-2">
                        <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
                        <p className="text-blue-600">Please enter your details to sign in</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-colors"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-colors"
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input type="checkbox" className="rounded border-gray-300 text-blue-500 focus:ring-blue-200" />
                                <span className="ml-2 text-sm text-gray-600">Remember me</span>
                            </label>
                            <button type="button" className="text-sm text-blue-600 hover:text-blue-500">
                                Forgot password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white rounded-lg px-4 py-2.5 font-medium hover:bg-blue-500 focus:ring-4 focus:ring-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>

                    <div className="text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register">
                            <button
                                className="text-blue-600 font-medium hover:text-blue-500"
                            >
                                Sign up
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Login