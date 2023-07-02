import { Response, Request } from "express"
import { AuthenticatedRequest } from "./auth"
import { User } from "./db/user"

export const getUsers = async (req: Request, res: Response) => {
  // let { page } = req.query
  // if (typeof page !== 'string') {
  //   page = "1"
  // }
  // if (page && isNaN(parseInt(page))) {
  //   page = "1"
  // }
  // if (!page) {
  //   page = '1'
  // }
  // const skip = (parseInt(page) - 1) * 10;
  //   users = await User.find({
  //     name: {
  //       $regex: name || "",
  //       $options: "i"
  //     }
  //   }).skip(skip).limit(10).select('-password -tasksAssigned -tasksCreated');
  const users = await User.find().select('-password -tasksAssigned -tasksCreated');

  // count = await User.countDocuments({
  //   name: {
  //     $regex: name || "",
  //     $options: "i"
  //   }
  // });
  res.json({ users })
}

const getUserByName = async (req: AuthenticatedRequest, res: Response) => {
  const { ids } = req.body;
  const users = await User.find({
    _id: {
      $in: ids
    }
  }).select('-password -tasksAssigned -tasksCreated');
  res.json(users)
}


