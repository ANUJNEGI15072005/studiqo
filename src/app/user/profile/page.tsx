"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FaMedal } from "react-icons/fa";
import { authClient } from "@/lib/auth-client";
import Loader from "@/components/Loader"

const Profile = () => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        todayHours: 0,
        monthHours: 0,
        streak: 0,
        totalHours: 0,
        highestStreak: 0,
    });

    useEffect(() => {
        const init = async () => {
            try {
                setLoading(true)

                const session = await authClient.getSession()
                const sessionUser = session?.data?.user
                setUser(sessionUser)

                if (!sessionUser?.id) {
                    setLoading(false)
                    return
                }

                const res = await fetch(`/api/study/stats?userId=${sessionUser.id}`)
                const data = await res.json()

                setStats(data)

            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        init()
    }, [])

    const badges = [
        { label: "Bronze", days: 10, color: "text-yellow-600" },
        { label: "Silver", days: 25, color: "text-gray-400" },
        { label: "Gold", days: 50, color: "text-yellow-400" },
        { label: "Diamond", days: 100, color: "text-blue-400" }
    ];

    if (loading) return <Loader />

    return (
        <div className="min-h-screen bg-[#0f172a] text-white p-3 md:p-6 space-y-6 font-body">

            <div className="bg-[#1e293b] p-6 rounded-2xl flex items-center gap-4">

                {user?.image ? (
                    <div className="w-16 h-16 relative">
                        <Image
                            src={user.image}
                            alt="avatar"
                            fill
                            className="rounded-full object-cover"
                        />
                    </div>
                ) : (
                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-500/20 text-blue-400 text-2xl font-bold">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                )}

                <div>
                    <h2 className="text-xl font-semibold">{user?.name}</h2>
                    <p className="text-gray-400 text-sm">{user?.email}</p>
                </div>
            </div>

            <div className="bg-[#1e293b] p-6 rounded-2xl">
                <h3 className="text-lg font-semibold mb-4 font-heading">Badges</h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {badges.map((b, i) => {
                        const unlocked = stats.streak >= b.days;

                        return (
                            <div
                                key={i}
                                className={`flex flex-col items-center p-4 rounded-xl border
                                ${unlocked
                                        ? "border-blue-500/40"
                                        : "border-white/10 opacity-30"
                                    }`}
                            >
                                <FaMedal className={`text-2xl mb-2 ${b.color}`} />
                                <p className="text-sm">{b.label}</p>
                                <span className="text-xs text-gray-400">
                                    {b.days} days
                                </span>
                            </div>
                        );
                    })}
                </div>

                <p className="text-xs text-gray-400 mt-4">
                    Current streak: {stats.streak}
                </p>
            </div>

            <div className="bg-[#1e293b] p-6 rounded-2xl text-center">
                <h3 className="text-lg font-semibold mb-2 font-heading">Total Study Time</h3>
                <p className="text-3xl font-bold text-blue-400">
                    {stats.totalHours} hrs
                </p>
            </div>

        </div>
    );
};

export default Profile;