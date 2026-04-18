"use client"

import React, { useState } from "react"
import { Mail, Lock, User } from "lucide-react"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { toast } from "react-hot-toast"

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  })

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const isValidPassword = (password: string) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,12}$/
    return regex.test(password)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const { name, email, password } = form

    // 🔒 Password validation
    if (!isValidPassword(password)) {
      toast.error(
        "Password must be 8-12 chars with uppercase, lowercase, number & special char"
      )
      return
    }

    setLoading(true)
    setErrorMsg("")

    try {
      const res = await authClient.signUp.email({
        email,
        password,
        name,
        callbackURL: "/user/dashboard",
      })

      if (res?.error) {
        toast.error(res.error.message || "Signup failed")
        return
      }

      toast.success("Account created successfully 🚀")

      // slight delay so user sees toast
      setTimeout(() => {
        window.location.href = "/user/dashboard"
      }, 1000)

    } catch (err: any) {
      console.error(err)
      toast.error(err?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleRegister() {
    try {
      setLoading(true)

      const res = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/user/dashboard",
      })

      if (res?.error) {
        toast.error(res.error.message || "Google login failed")
        return
      }

      toast.success("Logged in with Google 🚀")

    } catch (err: any) {
      console.error(err)
      toast.error(err?.message || "Google login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-blue-950">

      <div className="relative md:w-[380px] w-[300px] p-[2px] rounded-2xl bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-700 animate-pulse">

        <div className="bg-[#0a0f1c] rounded-2xl md:p-8 p-4 backdrop-blur-xl">

          <h2 className="text-2xl font-bold text-center text-white mb-6 tracking-wide">
            Create Account
          </h2>

          {/* Google Login */}
          <button
            onClick={handleGoogleRegister}
            disabled={loading}
            className="w-full mb-4 flex items-center justify-center gap-3 py-2 rounded-lg bg-[#0a0f1c] border border-blue-500 text-white font-medium hover:scale-105 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 disabled:opacity-50"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="google"
              className="w-5 h-5"
            />
            <span className="tracking-wide">
              Continue with Google
            </span>
          </button>

          {/* divider */}
          <div className="flex items-center gap-2 my-4">
            <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
            <span className="text-blue-400 text-xs tracking-widest">OR</span>
            <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
          </div>

          {/* form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* name */}
            <div className="relative">
              <User className="absolute left-3 top-3 text-blue-400" size={18} />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 rounded-lg bg-transparent border border-blue-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />
            </div>

            {/* email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-blue-400" size={18} />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 rounded-lg bg-transparent border border-blue-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />
            </div>

            {/* password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-blue-400" size={18} />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 rounded-lg bg-transparent border border-blue-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />
            </div>

            {/* error */}
            {errorMsg && (
              <p className="text-red-400 text-sm text-center">
                {errorMsg}
              </p>
            )}

            {/* submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 text-black font-semibold hover:scale-105 transition-transform shadow-lg shadow-blue-500/30 disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Register"}
            </button>

          </form>

          {/* login link */}
          <p className="text-center text-gray-400 text-sm mt-5">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-blue-400 hover:underline">
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}