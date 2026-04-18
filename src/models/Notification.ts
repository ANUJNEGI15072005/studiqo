import mongoose from "mongoose"

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ["task", "study", "system"],
      default: "system"
    },
    read: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

export default mongoose.models.Notification ||
  mongoose.model("Notification", NotificationSchema)