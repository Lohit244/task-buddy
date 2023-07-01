import { Response } from "express"
import { AuthenticatedRequest } from "./auth"
import { User } from "./db/user"

export const getUsers = async (req: AuthenticatedRequest, res: Response) => {
  let { page, name } = req.query
  if (typeof page !== 'string') {
    page = "1"
  }
  if (page && isNaN(parseInt(page))) {
    page = "1"
  }
  if (!page) {
    page = '1'
  }
  const skip = (parseInt(page) - 1) * 10;
  const users = await User.find({
    name: {
      $regex: name || "",
      $options: "i"
    }
  }).skip(skip).limit(10).select('-password -tasksAssigned -tasksCreated');
  res.json({ users })
}

