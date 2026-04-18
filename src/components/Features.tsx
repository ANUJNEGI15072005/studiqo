import {
    FaCalendarAlt,
    FaClock,
    FaBrain,
    FaChartLine,
    FaStickyNote,
    FaRobot
} from "react-icons/fa";

export default function Features() {

    const features = [
        {
            title: "Smart Planner",
            desc: "Organize your day with intelligent time-based scheduling that avoids conflicts and keeps your routine smooth and productive.",
            icon: <FaCalendarAlt />
        },
        {
            title: "Study Timer",
            desc: "Stay focused with session tracking, time management, and streak building to boost consistency in your study habits.",
            icon: <FaClock />
        },
        {
            title: "AI Notes",
            desc: "Enhance your notes instantly with AI—rewrite, summarize, and structure your content for better clarity and retention.",
            icon: <FaBrain />
        },
        {
            title: "Dashboard",
            desc: "Get a clear overview of your productivity with visual stats, progress tracking, and insights to improve your performance.",
            icon: <FaChartLine />
        },
        {
            title: "Organized Notes",
            desc: "Keep all your notes structured, searchable, and easy to access so you never lose important information again.",
            icon: <FaStickyNote />
        },
        {
            title: "AI Planning",
            desc: "Automatically generate smart study plans tailored to your goals, helping you stay on track without manual effort.",
            icon: <FaRobot />
        }
    ]

    return (
        <section id="features" className="bg-[#0f172a] text-white px-3 py-10 md:px-6 md:py-14 xl:py-20">
            <div className="max-w-7xl mx-auto mt-5">

                <h2 className="text-4xl font-bold text-center mb-12 font-heading">
                    Why <span className="text-blue-400">Studiqo?</span>
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((f, i) => (
                        <div
                            key={i}
                            className="bg-[#1e293b] p-6 rounded-2xl border border-white/5 hover:border-blue-500/40 transition"
                        >
                            <div className="flex items-center gap-3 mb-3">

                                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500/10 text-blue-400 text-xl">
                                    {f.icon}
                                </div>

                                <h3 className="text-lg font-semibold font-heading">
                                    {f.title}
                                </h3>

                            </div>

                            <p className="text-gray-400 text-sm font-body">
                                {f.desc}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    )
}