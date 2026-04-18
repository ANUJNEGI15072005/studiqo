"use client"
import Image from "next/image"
import Link from "next/link"

export default function Hero() {
    return (
        <section className="bg-[#0f172a] text-white px-3 py-10 md:px-6 md:py-14 xl:py-20">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">

                <div className="space-y-6">
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight font-heading">
                        Study smarter.{" "}
                        <span className="text-blue-400">Stay consistent.</span>
                    </h1>

                    <p className="text-gray-400 text-lg font-body">
                        StudIQo helps you plan, track, and improve your study sessions with AI-powered notes, smart scheduling, and real-time progress insights.
                    </p>

                    <p className="text-gray-400 text-lg font-body">
                        No more messy notes, missed goals, or wasted time. Everything you need to stay focused and disciplined — in one clean dashboard.
                    </p>

                    <div className="flex gap-4">
                        <Link
                            href="/user/dashboard"
                            className="md:px-6 py-2 px-4 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 text-black font-medium transition shadow-md shadow-blue-500/30 font-body"
                        >
                            Get Started
                        </Link>

                        <button
                            onClick={() => {
                                document.getElementById("features")?.scrollIntoView({
                                    behavior: "smooth",
                                });
                            }}
                            className="md:px-6 py-2 px-4 rounded-lg border border-white/20 hover:bg-white/10 transition font-body"
                        >
                            Learn More
                        </button>
                    </div>
                </div>

                <div className=" justify-center hidden lg:flex">
                    <Image
                        src="/hero1.png"
                        alt="StudIQo UI"
                        width={500}
                        height={400}
                        className="rounded-2xl shadow-xl shadow-blue-500/10 transition duration-500"
                    />
                </div>

            </div>
        </section>
    )
}