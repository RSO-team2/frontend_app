import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { Pizza } from 'lucide-react'

function Register() {
    const navigate = useNavigate();

    const authUrl = process.env.LOGIN_ENDPOINT;
    const [formData, setFormData] = useState({
        user_name: '',
        user_email: '',
        user_password: '',
        user_address: '',
        user_type: 'customer',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [userPasswordConfirm, setUserPasswordConfirm] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        if (formData.user_password !== userPasswordConfirm) {
            setError('Passwords do not match')
            setLoading(false)
            return
        }

        try {
            const response = await fetch(authUrl + '/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed')
            } else {
                localStorage.setItem('user', JSON.stringify(data.user_id))
                navigate('/home')
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred during registration')
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
                        <h1 className="text-2xl font-bold text-gray-900">Create an account</h1>
                        <p className="text-blue-600">Please fill in your details to register</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="user_name" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <input
                                id="user_name"
                                name="user_name"
                                type="text"
                                value={formData.user_name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-colors"
                                placeholder="Enter your username"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="user_email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                id="user_email"
                                name="user_email"
                                type="email"
                                value={formData.user_email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-colors"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="user_password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="user_password"
                                name="user_password"
                                type="password"
                                value={formData.user_password}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-colors"
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="user_password_confirm" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <input
                                id="user_password_confirm"
                                name="user_password_confirm"
                                type="password"
                                value={userPasswordConfirm}
                                onChange={(e) => setUserPasswordConfirm(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-colors"
                                placeholder="Confirm your entered password"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="user_address" className="block text-sm font-medium text-gray-700">
                                Address
                            </label>
                            <input
                                id="user_address"
                                name="user_address"
                                type="text"
                                value={formData.user_address}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-colors"
                                placeholder="Enter your address"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="user_type" className="block text-sm font-medium text-gray-700">
                                Account Type
                            </label>
                            <select
                                id="user_type"
                                name="user_type"
                                value={formData.user_type}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-colors"
                                required
                            >
                                <option value="customer">Customer</option>
                                <option value="restaurant">Restaurant</option>
                                <option value="courier">Delivery Partner</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white rounded-lg px-4 py-2.5 font-medium hover:bg-blue-500 focus:ring-4 focus:ring-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating account...' : 'Create account'}
                        </button>
                    </form>

                    <div className="text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login">
                            <button
                                className="text-blue-600 font-medium hover:text-blue-500"
                            >
                                Sign in
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register