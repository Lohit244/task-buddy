import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { Task } from './db/tasks'
import type { TaskDocument } from './db/tasks'
import type { AuthenticatedRequest } from './auth'
import { User } from './db/user'
import mongoose from 'mongoose'

export const getTasksCreatedByMe = async (req: AuthenticatedRequest, res: Response) => {
  const { user } = req
  const tasks = await Task.find({ createdBy: user._id }).populate('assignedTo')
  tasks.forEach((task: any) => {
    task.assignedTo.forEach((assigned: any) => assigned.password = undefined)
    task.assignedTo.forEach((assigned: any) => assigned.tasksAssigned = undefined)
    task.assignedTo.forEach((assigned: any) => assigned.tasksCreated = undefined)
    task.createdBy = undefined
  })

  res.json({ tasks })
}

export const getTasksAssignedToMe = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { user } = req
    const tasks = await Task.find({ assignedTo: user._id }).populate('createdBy').populate('assignedTo')
    tasks.forEach((task: any) => {
      task.createdBy.password = undefined
      task.createdBy.tasksAssigned = undefined
      task.createdBy.tasksCreated = undefined
      task.assignedTo.forEach((assigned: any) => assigned.password = undefined)
      task.assignedTo.forEach((assigned: any) => assigned.tasksAssigned = undefined)
      task.assignedTo.forEach((assigned: any) => assigned.tasksCreated = undefined)
    })
    res.json({ tasks })
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' })
    console.log(err)
  }
}

export const createTask = async (req: AuthenticatedRequest, res: Response) => {
  const { user } = req
  const { to, name, description } = req.body
  if (!to) {
    return res.status(422).json({ error: 'Must provide a user to assign the task to' })
  }
  if (!name) {
    return res.status(422).json({ error: 'Must provide a name for the task' })
  }
  if(to.length===0){
    return res.status(422).json({ error: 'Must provide a user to assign the task to' })
  }
  const toUser:mongoose.Types.ObjectId[] = []
  for(let i=0;i<to.length;i++){
    let email = to[i];
    const t = await User.findOne({email:email.toLowerCase()});
    if(!t){
      return res.status(404).json({ error: `User with email "${email}" not found` })
    }
    toUser.push(t._id);
  }
  if (!toUser) {
    return res.status(404).json({ error: 'User not found' })
  }
  const task = await Task.create({
    name: name,
    description: description || "",
    createdBy: user._id,
    assignedTo: toUser,
    status: 'Pending',
    progress: 0,
  })
  await User.findByIdAndUpdate(user._id, { $push: { tasksCreated: task._id } }, { new: true }).exec()
  for(let i=0;i<toUser.length;i++){
    let id = toUser[i];
    await User.findByIdAndUpdate(id, { $push: { tasksAssigned: task._id } }, { new: true }).exec()
  }
  res.json({ task })
}

export const updateTask = async (req: AuthenticatedRequest, res: Response) => {
  const { user } = req
  const { taskId, status, progress, notes, desc,assignedTo } = req.body
  if (!taskId) {
    return res.status(422).json({ error: 'Must provide a taskId' })
  }
  const task = await Task.findById(taskId)
  if (!task) {
    return res.status(404).json({ error: 'Task not found' })
  }
  if (task.createdBy !== (user._id as any) && !task.assignedTo.includes(user._id as any)) {
    console.log(task.createdBy, user._id, task.toJSON().assignedTo)
    return res.status(403).json({ error: 'You are not authorized to update this task' })
  }
  if (status != task.status) {
    if(!task.assignedTo.includes(user._id as any)){
      return res.status(403).json({ error: 'You are not authorized to update this task' })
    }
    if (!['Accepted', 'In Progress', 'Completed', 'Rejected', 'Pending'].includes(status)) {
      return res.status(422).json({ error: 'Invalid status' })
    }
    task.status = status
  }
  if (progress) {
    if (progress < 0 || progress > 100) {
      return res.status(422).json({ error: 'Invalid progress' })
    }
    task.progress = progress
  }
  if (notes) {
    task.notes = notes
  }
  if(desc) {
    task.description = desc
  }
  if(task.status === 'Completed') {
    task.progress = 100
  }
  if(task.status === 'Pending') {
    task.progress = 0
  }
  if(assignedTo){
    const user = await User.findOne({email:assignedTo})
    if(!user){
      return res.status(404).json({error:'User not found'})
    }
    task.assignedTo.push(user._id)
    user.tasksAssigned.push(task._id)
    await user.save()
  }
  await task.save()
  res.json({ task })
}
