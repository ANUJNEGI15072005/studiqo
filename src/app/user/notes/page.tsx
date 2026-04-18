"use client";

import { authClient } from "@/lib/auth-client";
import React, { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";
import { Pencil, Trash2, Menu, X } from "lucide-react";

type Note = {
    _id: string;
    title: string;
    content: string;
    userId: string;
};

export default function Notes() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState("");
    const [originalContent, setOriginalContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [user, setUser] = useState<any>(null);
    const [showSidebar, setShowSidebar] = useState(false);

    const userId = user?.id;

    useEffect(() => {
        const init = async () => {
            try {
                setLoading(true);
                const session = await authClient.getSession();
                const sessionUser = session?.data?.user;
                setUser(sessionUser);

                if (!sessionUser?.id) return;

                const res = await fetch(`/api/notes?userId=${sessionUser.id}`);
                const data = await res.json();
                setNotes(data);
            } catch {
                toast.error("Failed to load notes");
            } finally {
                setLoading(false);
            }
        };

        init();
    }, []);

    const createNote = () => {
        const tempNote = {
            _id: "temp-" + Date.now(),
            title: "",
            content: "",
            userId
        };
        setSelectedNote(tempNote);
        setTitle("");
        setContent("");
        setShowSidebar(false);
    };

    const selectNote = (note: Note) => {
        setSelectedNote(note);
        setTitle(note.title);
        setContent(note.content);
        setShowSidebar(false);
    };

    const getUniqueTitle = (value: string, excludeId?: string) => {
        let base = value.trim() || "Untitled";
        let finalTitle = base;
        let count = 1;

        const existing = notes
            .filter(n => n._id !== excludeId)
            .map(n => n.title.toLowerCase());

        while (existing.includes(finalTitle.toLowerCase())) {
            finalTitle = `${base} ${count++}`;
        }

        return finalTitle;
    };

    const saveNote = async () => {
        if (!selectedNote || !userId) return;

        const finalTitle = getUniqueTitle(title, selectedNote._id);

        try {
            if (selectedNote._id.startsWith("temp")) {
                const res = await fetch("/api/notes", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title: finalTitle, content, userId })
                });

                const newNote = await res.json();
                setNotes(prev => [newNote, ...prev]);
                setSelectedNote(newNote);
            } else {
                const res = await fetch("/api/notes", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id: selectedNote._id,
                        title: finalTitle,
                        content
                    })
                });

                const updated = await res.json();
                setNotes(prev =>
                    prev.map(n => (n._id === updated._id ? updated : n))
                );
            }

            setTitle(finalTitle);
            toast.success("Saved");
        } catch {
            toast.error("Save failed");
        }
    };

    const deleteNote = async (id: string) => {
        await fetch(`/api/notes?id=${id}`, { method: "DELETE" });
        setNotes(prev => prev.filter(n => n._id !== id));
        if (selectedNote?._id === id) setSelectedNote(null);
    };

    const cleanText = (text: string) => text.replace(/\*\*/g, "").replace(/^\s*-\s*/gm, "• ");

    const handleImprove = async () => {
        if (!content) return;

        setOriginalContent(content);

        try {
            const res = await fetch("/api/ai-notes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content, type: "improve" })
            });

            const data = await res.json();
            setContent(cleanText(data.result));
            toast.success("Improved ");
        } catch {
            toast.error("AI failed");
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-[#0f172a] text-white">

            {/* 🔹 Top Bar */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
                <button onClick={() => setShowSidebar(true)}>
                    <Menu />
                </button>

                <h2 className="font-semibold font-heading text-base md:text-2xl">
                    {selectedNote ? title || "New Note" : "Notes"}
                </h2>

                <button onClick={saveNote} className="text-green-400 font-body">
                    Save
                </button>
            </div>

            {/* 🔹 Sidebar (Mobile Drawer) */}
            {showSidebar && (
                <div className="fixed inset-0 z-50 flex">
                    <div
                        className="flex-1 bg-black/60"
                        onClick={() => setShowSidebar(false)}
                    />
                    <div className="w-64 bg-[#1e293b] p-4">
                        <div className="flex justify-between mb-4 font-heading">
                            <h2>Notes</h2>
                            <button onClick={() => setShowSidebar(false)}>
                                <X />
                            </button>
                        </div>

                        <button
                            onClick={createNote}
                            className="w-full mb-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 py-2 rounded font-body text-white"
                        >
                            + New
                        </button>

                        {notes.map(note => (
                            <div
                                key={note._id}
                                onClick={() => selectNote(note)}
                                className="p-2 hover:bg-white/10 rounded cursor-pointer flex justify-between font-body"
                            >
                                <span>{note.title || "Untitled"}</span>
                                <button onClick={() => deleteNote(note._id)}>
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 🔹 Editor */}
            <div className="p-4 space-y-4">
                {selectedNote ? (
                    <>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full text-xl bg-transparent outline-none font-heading"
                            placeholder="Title"
                        />

                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full h-[60vh] bg-[#1e293b] p-3 rounded font-body"
                            placeholder="Start writing..."
                        />
                    </>
                ) : (
                    <p className="text-gray-400 text-center mt-10 font-body">
                        Select or create a note
                    </p>
                )}
            </div>

            {/* 🔹 Bottom Actions */}
            {selectedNote && (
                <div className="fixed bottom-0 left-0 right-0 bg-[#1e293b] p-3 flex justify-around border-t border-white/10">
                    <button onClick={handleImprove} className="text-purple-400 font-body">
                        Improve
                    </button>

                    {originalContent && (
                        <button
                            onClick={() => {
                                setContent(originalContent);
                                setOriginalContent("");
                            }}
                            className="text-gray-400 font-body"
                        >
                            Undo
                        </button>
                    )}
                </div>
            )}

        </div>
    );
}