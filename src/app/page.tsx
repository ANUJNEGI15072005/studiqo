import Developer from "@/components/Developer"
import Features from "@/components/Features"
import Hero from "@/components/Hero"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import Link from "next/link"

export default async function Home() {

  const session = await auth.api.getSession({
    headers: await headers()
  })

  return (
    <>
      <nav className="w-full sticky top-0 bg-[#0f172a] border-b border-blue-500/20 shadow-lg shadow-blue-500/10">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

          <div className="text-white text-2xl md:text-3xl lg:text-4xl font-bold font-logo">
            <Link href='/'>
              <span className="text-blue-400">Stud</span>iqo
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/user/dashboard"
              className="md:py-1.5 md:px-4 py-1 px-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 text-black font-medium hover:scale-105 transition-transform shadow-md shadow-blue-500/30 font-body"
            >
              {session ? "Dashboard" : "Get Started"}
            </Link>
          </div>

        </div>
      </nav>

      <div className="min-h-screen bg-[#0f172a] text-white p-3 md:p-6 ">

        <Hero />
        <Features />

        <section className="px-3 py-10 md:px-6 md:py-14 xl:py-20">
          <div className="max-w-7xl mx-auto text-center bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-5 md:p-10 shadow-lg">

            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading">
              It’s Free to Start
            </h2>

            <p className="text-gray-300 mb-6 font-body">
              No credit card required. No hidden charges. Start planning, studying and tracking your progress instantly.
            </p>

            <Link
              href="/user/dashboard"
              className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 text-black font-semibold hover:scale-105 transition-transform shadow-md shadow-blue-500/30 font-body"
            >
              Start Now
            </Link>

          </div>
        </section>

        <Developer />

      </div>
    </>
  )
}