"use client"

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Bell, Settings, X, User, Menu } from "lucide-react"
import Logout from "./Logout"
import NotificationPanel from "./NotificationPanel"
import { authClient } from "@/lib/auth-client"
import { usePathname } from "next/navigation"
import Image from "next/image"

export default function Navbar() {
  const [showNotif, setShowNotif] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [user, setUser] = useState<any>(null)

  const mobileNotifRef = useRef<HTMLDivElement>(null)
  const desktopNotifRef = useRef<HTMLDivElement>(null)
  const settingsRef = useRef<HTMLDivElement>(null)

  const pathname = usePathname()

  useEffect(() => {
    const getUser = async () => {
      const session = await authClient.getSession()
      setUser(session?.data?.user || null)
    }
    getUser()
  }, [])

  useEffect(() => {
    setShowNotif(false)
    setShowSettings(false)
  }, [pathname])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node

      if (
        mobileNotifRef.current &&
        !mobileNotifRef.current.contains(target) &&
        desktopNotifRef.current &&
        !desktopNotifRef.current.contains(target)
      ) {
        setShowNotif(false)
      }

      if (settingsRef.current && !settingsRef.current.contains(target)) {
        setShowSettings(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <>
      <nav className="w-full sticky top-0 bg-[#0f172a] border-b border-blue-500/20 shadow-lg shadow-blue-500/10 z-50 font-body">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

          {/* Logo */}
          <div className="text-white text-2xl md:text-3xl lg:text-4xl font-bold font-logo">
            <Link href="/user/dashboard">
              <span className="text-blue-400">Stud</span>iqo
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3 ml-auto">

            {/* 🔹 Mobile Controls */}
            <div className="flex md:hidden items-center gap-3">

              {/* Notification */}
              <div className="relative" ref={mobileNotifRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowNotif(prev => !prev)
                    setShowSettings(false)
                  }}
                  className="text-gray-300 hover:text-blue-400"
                >
                  <Bell size={20} />
                </button>

                {showNotif && user?.id && (
                  <NotificationPanel userId={user.id} />
                )}
              </div>

              {/* Hamburger */}
              <button
                onClick={() => setShowMobileMenu(true)}
                className="text-gray-300 hover:text-blue-400"
              >
                <Menu size={22} />
              </button>

            </div>

            {/* 🔹 Desktop Menu */}
            <div className="hidden md:flex items-center gap-6 text-gray-300 font-body">

              <Link href="/user/dashboard" className="hover:text-blue-400">
                Dashboard
              </Link>

              <Link href="/user/planner" className="hover:text-blue-400">
                Planner
              </Link>

              <Link href="/user/study" className="hover:text-blue-400">
                Study
              </Link>

              <Link href="/user/notes" className="hover:text-blue-400">
                Notes
              </Link>

              {/* Notification */}
              <div className="relative" ref={desktopNotifRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowNotif(prev => !prev)
                    setShowSettings(false)
                  }}
                  className="hover:text-blue-400 flex items-center justify-center w-8 h-8"
                >
                  <Bell size={18} />
                </button>

                {showNotif && user?.id && (
                  <NotificationPanel userId={user.id} />
                )}
              </div>

              {/* Settings */}
              <div className="relative" ref={settingsRef}>
                <button
                  onClick={() => {
                    setShowSettings(prev => !prev)
                    setShowNotif(false)
                  }}
                  className="hover:text-blue-400 flex items-center justify-center w-8 h-8"
                >
                  <Settings size={18} />
                </button>

                {showSettings && (
                  <div className="absolute right-0 mt-3 w-72 bg-[#0b1220] border border-white/10 rounded-2xl shadow-xl overflow-hidden">

                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                      <h2 className="text-white font-semibold">Settings</h2>
                      <button onClick={() => setShowSettings(false)}>
                        <X size={18} className="text-gray-400 hover:text-white" />
                      </button>
                    </div>

                    <div className="p-4 flex items-center gap-3 border-b border-white/10">

                      {user?.image ? (
                        <Image
                          src={user.image}
                          alt="user avatar"
                          width={40}
                          height={40}
                          className="rounded-full object-cover border border-white/10"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                          {user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                      )}

                      <div className="flex flex-col">
                        <p className="text-white text-sm font-medium">
                          {user?.name || "User"}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {user?.email}
                        </p>
                      </div>

                    </div>

                    <div className="p-2 flex flex-col">

                      <Link
                        href="/user/profile"
                        onClick={() => setShowSettings(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white"
                      >
                        <User size={16} />
                        Profile
                      </Link>

                      <div className="px-3 py-2">
                        <Logout />
                      </div>

                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </nav>

      {/* 🔹 Mobile Sidebar */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 flex">

          <div
            className="flex-1 bg-black/60"
            onClick={() => setShowMobileMenu(false)}
          />

          <div className="w-64 bg-[#0f172a] p-5 flex flex-col gap-4 shadow-xl text-white">

            <div className="flex justify-end">
              <button onClick={() => setShowMobileMenu(false)}>
                <X className="text-white" />
              </button>
            </div>

            <Link href="/user/dashboard" onClick={() => setShowMobileMenu(false)}>
              Dashboard
            </Link>

            <Link href="/user/planner" onClick={() => setShowMobileMenu(false)}>
              Planner
            </Link>

            <Link href="/user/study" onClick={() => setShowMobileMenu(false)}>
              Study
            </Link>

            <Link href="/user/notes" onClick={() => setShowMobileMenu(false)}>
              Notes
            </Link>

            <Link href="/user/profile" onClick={() => setShowMobileMenu(false)}>
              Profile
            </Link>

            <div className="mt-4">
              <Logout />
            </div>

          </div>
        </div>
      )}
    </>
  )
}