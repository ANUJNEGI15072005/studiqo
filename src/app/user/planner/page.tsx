"use client"

import { authClient } from "@/lib/auth-client"
import React, { useEffect, useState } from "react"
import Loader from "@/components/Loader"
import toast from "react-hot-toast";
import { Check, Trash2, ArrowRight, Plus } from "lucide-react"

type Task = {
    _id: string
    subject: string
    time: string
    duration: number
    status: "pending" | "completed"
    date: string,
    userId: string
}

const getCurrentTime = () => {
    const now = new Date()
    return now.toTimeString().slice(0, 5)
}


export default function Planner() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [showModal, setShowModal] = useState(false)

    const [subject, setSubject] = useState("")
    const [time, setTime] = useState(getCurrentTime())
    const [duration, setDuration] = useState(1)

    const [aiInput, setAiInput] = useState("")
    const [aiTasks, setAiTasks] = useState<any[]>([])
    const [loadingAI, setLoadingAI] = useState(false)

    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)

    const userId = user?.id

    // ✅ INIT (user + tasks)
    useEffect(() => {
        const init = async () => {
            try {
                setLoading(true);

                const session = await authClient.getSession();
                const sessionUser = session?.data?.user;
                setUser(sessionUser);

                if (!sessionUser?.id) {
                    setLoading(false);
                    return;
                }

                const today = new Date().toLocaleDateString("en-CA");

                const res = await fetch(`/api/tasks?date=${today}&userId=${sessionUser.id}`);
                const data = await res.json();

                setTasks(data);
            } catch (err) {
                toast.error("Failed to load tasks");
            } finally {
                setLoading(false);
            }
        };

        init();
    }, []);

    const moveToTomorrow = async (id: string) => {
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)

        const nextDate = tomorrow.toISOString().split("T")[0]

        setTasks(tasks.filter(task => task._id !== id))

        await fetch("/api/tasks", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id,
                date: nextDate
            })
        })
    }

    const timeToMinutes = (time: string) => {
        const [hours, minutes] = time.split(":").map(Number)
        return hours * 60 + minutes
    }

    const hasConflict = (newTime: string, newDuration: number) => {
        const newStart = timeToMinutes(newTime)
        const newEnd = newStart + newDuration * 60

        return tasks.some(task => {
            const existingStart = timeToMinutes(task.time)
            const existingEnd = existingStart + task.duration * 60

            return newStart < existingEnd && newEnd > existingStart
        })
    }

    const addTask = async () => {
        if (!subject || !time) {
            toast.error("Fill all fields");
            return;
        }

        if (!userId) {
            toast.error("User not loaded");
            return;
        }

        if (hasConflict(time, duration)) {
            toast.error("Time conflict detected");
            return;
        }

        const today = new Date().toLocaleDateString("en-CA");

        const newTask = {
            subject,
            time,
            duration,
            status: "pending",
            date: today,
            userId,
        };

        const res = await fetch("/api/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTask),
        });

        const data = await res.json();

        setTasks(prev => [...prev, data]);

        toast.success("Task added successfully 🎉");

        setShowModal(false);
        setSubject("");
        setTime(getCurrentTime());
        setDuration(1);
    };

    const deleteTask = async (id: string) => {
        setTasks(prev => prev.filter(t => t._id !== id));

        await fetch("/api/tasks", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });

        toast.success("Task deleted");
    };

    const toggleStatus = async (id: string) => {
        const task = tasks.find(t => t._id === id);
        if (!task) return;

        const newStatus =
            task.status === "pending" ? "completed" : "pending";

        setTasks(tasks.map(t =>
            t._id === id ? { ...t, status: newStatus } : t
        ));

        await fetch("/api/tasks", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, status: newStatus }),
        });

        toast.success(
            newStatus === "completed"
                ? "Marked as completed"
                : "Marked as pending"
        );
    };

    const generatePlan = async () => {
        if (!aiInput) return;

        setLoadingAI(true);

        const res = await fetch("/api/ai-plan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                prompt: aiInput,
                existingTasks: tasks,
            }),
        });

        const data = await res.json();
        setAiTasks(data);

        toast.success("AI plan generated ✨");

        setLoadingAI(false);
    };

    const addAIPlan = async () => {
        if (!userId) return;

        const today = new Date().toLocaleDateString("en-CA");

        for (const task of aiTasks) {
            await fetch("/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...task,
                    status: "pending",
                    date: today,
                    userId,
                }),
            });
        }

        const res = await fetch(`/api/tasks?date=${today}&userId=${userId}`);
        const data = await res.json();

        setTasks(data);
        setAiTasks([]);

        toast.success("AI plan added");
    };


    const dateObj = new Date()
    const formattedDate = dateObj.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
        weekday: "long"
    })

    if (loading) return <Loader />

    return (
        <>
            <div className="min-h-screen bg-[#0f172a] text-white p-3 md:p-6 font-body">

                {/* header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-6">

                    <div>
                        <h1 className="text-xl md:text-2xl font-heading font-bold">
                            Today’s Planner
                        </h1>
                        <p className="text-xs md:text-sm text-gray-400">
                            {formattedDate}
                        </p>
                    </div>

                    {/* Desktop Button */}
                    <button
                        onClick={() => setShowModal(true)}
                        className="hidden md:block px-4 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 text-black font-medium hover:scale-105 transition-transform shadow-md shadow-blue-500/30"
                    >
                        + Add Task
                    </button>

                    {/* Mobile Icon */}
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-4 py-1.5 md:hidden rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 text-black font-medium hover:scale-105 transition-transform shadow-md shadow-blue-500/30"
                    >
                        + Add Task
                    </button>

                </div>

                {/* Ai UI */}
                <div className="bg-[#1e293b] p-2 md:p-4 rounded-2xl mb-6 border border-white/5">

                    <h2 className="text-sm text-gray-300 mb-2">AI Planner</h2>

                    <textarea
                        placeholder="e.g. Tomorrow is my math exam..."
                        value={aiInput}
                        onChange={(e) => setAiInput(e.target.value)}
                        className="w-full p-2 rounded-lg bg-[#0f172a] outline-none"
                    />

                    <button
                        onClick={generatePlan}
                        className="mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 rounded-lg text-white"
                    >
                        {loadingAI ? "Generating..." : "Generate Plan"}
                    </button>

                </div>

                {/* generated task */}
                {aiTasks.length > 0 && (
                    <div className="my-4 space-y-2">

                        <h3 className="text-sm text-gray-400">AI Suggested Plan</h3>

                        {aiTasks.map((task, i) => (
                            <div key={i} className="bg-[#0f172a] p-3 rounded-lg">
                                <p>{task.subject}</p>
                                <p className="text-xs text-gray-400">
                                    {task.time} • {task.duration} hr
                                </p>
                            </div>
                        ))}

                        <button
                            onClick={addAIPlan}
                            className="mt-3 bg-green-500 px-4 py-2 rounded-lg"
                        >
                            + Add This Planner
                        </button>

                    </div>
                )}

                {/* progress bar */}
                <div className="bg-[#1e293b] p-4 rounded-2xl shadow-md mb-6 border border-white/5">

                    <div className="flex justify-between text-sm text-gray-300">
                        <span>Progress</span>
                        <span>
                            {tasks.filter(t => t.status === "completed").length} / {tasks.length}
                        </span>
                    </div>

                    <div className="w-full bg-gray-700 h-2 rounded-full mt-3">
                        <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{
                                width: `${tasks.length === 0
                                    ? 0
                                    : (tasks.filter(t => t.status === "completed").length /
                                        tasks.length) * 100
                                    }%`,
                            }}
                        />
                    </div>

                </div>

                {/* tasks list */}
                <div className="space-y-3">

                    {tasks.length === 0 && (
                        <p className="text-gray-400 text-center mt-10">
                            No tasks yet. Start planning
                        </p>
                    )}

                    {tasks.map(task => (
                        <div
                            key={task._id}
                            className={`p-3 md:p-4 rounded-2xl border transition
    ${task.status === "completed"
                                    ? "bg-green-500/10 border-green-400/20"
                                    : "bg-[#1e293b]/80 border-white/5 hover:border-blue-500/40"
                                }`}
                        >

                            {/* 🔹 MOBILE LAYOUT */}
                            <div className="md:hidden space-y-2">

                                {/* Subject */}
                                <h2 className={`font-semibold text-base break-words ${task.status === "completed" ? "line-through text-gray-400" : ""
                                    }`}>
                                    {task.subject}
                                </h2>

                                {/* Time + Duration */}
                                <div className="flex gap-2 text-xs text-gray-400">
                                    <span className="bg-white/5 px-2 py-1 rounded-md border border-white/10">
                                        {task.time}
                                    </span>
                                    <span className="bg-white/5 px-2 py-1 rounded-md border border-white/10">
                                        {task.duration} hr
                                    </span>
                                </div>

                                {/* Icons */}
                                <div className="flex gap-3 pt-1">

                                    <button
                                        onClick={() => toggleStatus(task._id)}
                                        className={`p-2 rounded-lg flex items-center justify-center ${task.status === "completed"
                                            ? "bg-green-500/20 text-green-400"
                                            : "bg-blue-500/20 text-blue-400"
                                            }`}
                                    >
                                        <Check size={16} />
                                    </button>

                                    <button
                                        onClick={() => moveToTomorrow(task._id)}
                                        className="p-2 rounded-lg bg-yellow-500/20 text-yellow-400 flex items-center justify-center"
                                    >
                                        <ArrowRight size={16} />
                                    </button>

                                    <button
                                        onClick={() => deleteTask(task._id)}
                                        className="p-2 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center"
                                    >
                                        <Trash2 size={16} />
                                    </button>

                                </div>
                            </div>

                            {/* 🔹 DESKTOP LAYOUT */}
                            <div className="hidden md:flex justify-between items-center">

                                <div className="space-y-1">

                                    <h2 className={`font-semibold text-lg ${task.status === "completed" ? "line-through text-gray-400" : ""
                                        }`}>
                                        {task.subject}
                                    </h2>

                                    <div className="flex gap-2 text-xs text-gray-400">
                                        <span className="bg-white/5 px-2 py-1 rounded-md border border-white/10">
                                            {task.time}
                                        </span>

                                        <span className="bg-white/5 px-2 py-1 rounded-md border border-white/10">
                                            {task.duration} hr
                                        </span>
                                    </div>
                                </div>

                                {/* Icons instead of buttons */}
                                <div className="flex gap-3">

                                    <button
                                        onClick={() => toggleStatus(task._id)}
                                        className={`p-2 rounded-lg flex items-center justify-center ${task.status === "completed"
                                                ? "bg-green-500/20 text-green-400"
                                                : "bg-blue-500/20 text-blue-400"
                                            }`}
                                    >
                                        <Check size={18} />
                                    </button>

                                    <button
                                        onClick={() => moveToTomorrow(task._id)}
                                        className="p-2 rounded-lg bg-yellow-500/20 text-yellow-400 flex items-center justify-center"
                                    >
                                        <ArrowRight size={18} />
                                    </button>

                                    <button
                                        onClick={() => deleteTask(task._id)}
                                        className="p-2 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center"
                                    >
                                        <Trash2 size={18} />
                                    </button>

                                </div>
                            </div>

                        </div>
                    ))}
                </div>

                {/* add task modal */}
                {showModal && (

                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">

                        <div className="bg-[#1e293b] p-6 rounded-2xl w-96 space-y-5 shadow-xl border border-white/10">

                            <h2 className="text-xl font-semibold text-center">
                                Add New Task
                            </h2>

                            <div className="space-y-1">
                                <label className="text-sm text-gray-300">Task / Subject</label>
                                <input
                                    type="text"
                                    placeholder="e.g. DSA Practice, DBMS Revision"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="w-full p-2.5 rounded-lg bg-[#0f172a] outline-none border border-transparent focus:border-blue-500"
                                />
                                <p className="text-xs text-gray-500">
                                    What do you want to study or complete?
                                </p>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm text-gray-300">Start Time</label>
                                <input
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="w-full p-2.5 rounded-lg bg-[#0f172a] outline-none border border-transparent focus:border-blue-500"
                                />
                                <p className="text-xs text-gray-500">
                                    When will you start this task?
                                </p>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm text-gray-300">Duration (hours)</label>
                                <input
                                    type="number"
                                    value={duration}
                                    onChange={(e) => setDuration(Number(e.target.value))}
                                    className="w-full p-2.5 rounded-lg bg-[#0f172a] outline-none border border-transparent focus:border-blue-500"
                                    min={1}
                                    placeholder="e.g. 2"
                                />
                                <p className="text-xs text-gray-500">
                                    How long will this task take?
                                </p>
                            </div>

                            <div className="flex justify-between pt-2">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 hover:text-white transition"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={addTask}
                                    className="bg-blue-500 px-5 py-2 rounded-lg hover:bg-blue-600 transition"
                                >
                                    Add Task
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </>
    )
}