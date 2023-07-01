import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique:true
  },
  password: {
    type: String,
    required: true,
  },
  tasksAssigned: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
  }],
  tasksCreated: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
  }],
})

export const User = mongoose.model("User", userSchema)
export type UserDocument = mongoose.InferSchemaType<typeof userSchema>
