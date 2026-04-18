"use client"

import React from "react"

export default function Loader() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#0f172a]">
      
      <div className="flex flex-col items-center gap-6">

        <h1 className="text-4xl font-bold text-white font-logo">
          <span className="text-blue-400">Stud</span>iqo
        </h1>

        <div className="relative flex items-center justify-center">
          
          <div className="w-24 h-24 rounded-full bg-blue-500/10 blur-2xl animate-pulse"></div>

          <div className="absolute w-20 h-20 rounded-full border-4 border-blue-500/30"></div>

          <div className="absolute w-20 h-20 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
        </div>

        <p className="text-gray-400 text-sm tracking-widest font-body">
          Loading your workspace...
        </p>

      </div>
    </div>
  )
}