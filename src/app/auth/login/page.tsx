'use client'

import React, { useState } from "react"
import { Mail, Lock } from "lucide-react"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { email, password } = form

      const { error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/user/dashboard",
        rememberMe: true,
      })

      if (error) {
        setError(error.message || "Login failed")
      }
    } catch (err) {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError(null)

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/user/dashboard",
      })

      if (error) {
        setError(error.message || "Google login failed")
        setLoading(false)
      }
    } catch {
      setError("Something went wrong")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-blue-950">
      <div className="md:w-[380px] w-72 p-[2px] rounded-2xl bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-700">
        <div className="bg-[#0a0f1c] rounded-2xl md:p-8 p-4">

          <h2 className="text-2xl font-bold text-center text-white mb-6">
            Welcome Back
          </h2>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full mb-4 flex items-center justify-center gap-3 py-2 rounded-lg bg-[#0a0f1c] border border-blue-500 text-white hover:scale-105 transition disabled:opacity-50"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="google"
              className="w-5 h-5"
            />
            <span>
              {loading ? "Please wait..." : "Continue with Google"}
            </span>
          </button>

          <div className="flex items-center gap-2 my-4">
            <div className="flex-1 h-[1px] bg-blue-500/40" />
            <span className="text-blue-400 text-xs">OR</span>
            <div className="flex-1 h-[1px] bg-blue-500/40" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="relative">
              <Mail className="absolute left-3 top-3 text-blue-400" size={18} />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-10 py-2 rounded-lg bg-transparent border border-blue-500 text-white outline-none"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 text-blue-400" size={18} />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full pl-10 py-2 rounded-lg bg-transparent border border-blue-500 text-white outline-none"
                required
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 text-black font-semibold hover:scale-105 transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-5">
            Create an account?{" "}
            <Link href="/auth/register" className="text-blue-400 hover:underline">
              Register
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}