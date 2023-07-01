import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  progress: Number,
  status: {
    type: String,
    enum: ["Accepted", "In Progress", "Completed", "Rejected", "Pending"],
  },
  notes: String,
});

export const Task = mongoose.model("Task", taskSchema);
export type TaskDocument = mongoose.InferSchemaType<typeof taskSchema>;
