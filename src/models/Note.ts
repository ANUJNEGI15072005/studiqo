// models/Note.ts

import mongoose from "mongoose"

const NoteSchema = new mongoose.Schema({
    title: {
        type: String,
        default: "Untitled"
    },
    content: {
        type: String,
        default: ""
    },
    userId: {
        type: String,
        required: true
    }
}, { timestamps: true })

export default mongoose.models.Note || mongoose.model("Note", NoteSchema)