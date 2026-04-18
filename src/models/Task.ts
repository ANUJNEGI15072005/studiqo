import mongoose from "mongoose"

const TaskSchema = new mongoose.Schema({
    userId: String, 
    subject: String,
    time: String,
    duration: Number,
    status: {
        type: String,
        default: "pending"
    },
    date: String
}, { timestamps: true })

export default mongoose.models.Task || mongoose.model("Task", TaskSchema)