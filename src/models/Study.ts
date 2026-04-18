import mongoose from "mongoose"

const StudySchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true
    },

    duration: {
        type: Number, 
        required: true
    },

    date: {
        type: String, 
        required: true
    },

    userId: {
        type: String,
        required: true
    },

    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
        default: null
    }

}, { timestamps: true })

export default mongoose.models.Study || mongoose.model("Study", StudySchema)