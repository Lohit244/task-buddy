import { useAuth } from "@/context/authContext";
import { Button, Card, Label, Spinner, TextInput, Textarea } from "flowbite-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import type { Task as noErrorTask } from "./assigned"
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faNoteSticky, faUser } from "@fortawesome/free-solid-svg-icons";
type Task = noErrorTask & {
  error?: string
}

export default function NewTask() {
  const { user, authLoading } = useAuth();
  const router = useRouter();
  const [readableError, setReadableError] = useState("");
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    assignedTo: [] as string[],
  });
  const newTaskMutation = useMutation(async (task: { name: string, description: string, assignedTo: string[] }) => {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKENDURL}/tasks`, {
      name: task.name,
      description: task.description,
      to: task.assignedTo,
    }, {
      headers: {
        Authorization: `Bearer ${user?.token}`
      }
    })
    return res.data as Task;
  }, {
    onSuccess: () => {
      setReadableError("")
      router.push("/created");
    },
    onError(err: any) {
      if (err.message) {
        setReadableError(err.message);
      }
    }
  })


  useEffect(() => {
    let t: NodeJS.Timeout;
    if (!user && !authLoading) {
      t = setTimeout(() => {
        router.push("/login");
      }, 500);
    }
    return () => {
      if (t) {
        clearTimeout(t);
      }
    };
  })

  if (!user) {
    return <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <div className="font-bold text-2xl">Not Logged In</div>
      <div className="text-neutral-800">Redirecting To Login Page</div>
      <Spinner />
    </div>
  }

  if (newTaskMutation.isLoading || authLoading) {
    return <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <div className="font-bold text-2xl">Loading</div>
      <div className="text-neutral-800">Please wait</div>
      <Spinner />
    </div>
  }
  return (
    <div className="flex flex-col px-4">
      <div className="font-bold text-2xl">New Task</div>
      <div className="text-neutral-800">Create a new Task</div>
      {newTaskMutation.isError && (<div className="bg-red-100 text-red-800 p-4 rounded-md">
        {(newTaskMutation.error as any)?.response?.data?.error || "Something went wrong"}
      </div>)}
      <div className="flex flex-col md:flex-row gap-4 mt-4 w-full flex-wrap justify-center" >
        <Card className="w-full hover:shadow-lg transition-shadow duration-300 ease-in-out" >
          <form className="flex flex-col gap-2" onSubmit={(e) => {
            e.preventDefault();
            newTaskMutation.mutate(newTask);
          }}>
            <Label htmlFor="name">Name</Label>
            <TextInput
              id="name"
              required
              addon={<FontAwesomeIcon icon={faNoteSticky} />}
              value={newTask.name}
              onChange={(e) => {
                setNewTask({
                  ...newTask,
                  name: e.target.value
                })
              }}
            />
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newTask.description}
              onChange={(e) => {
                setNewTask({
                  ...newTask,
                  description: e.target.value
                })
              }}
            />
            <Label htmlFor="assignedTo">Assign To</Label>
            <TextInput
              required
              id="assignedTo"
              addon={<FontAwesomeIcon icon={faUser} />}
              value={newTask.assignedTo.join(",")}
              helperText="Please Use a comma separated list of emails"
              onChange={(e) => {
                setNewTask({
                  ...newTask,
                  assignedTo: e.target.value.split(",").map((e) => e.trim())
                })
              }}
            />
            <Button className="mt-4" onClick={(e) => {
              e.preventDefault();
              newTaskMutation.mutate(newTask);
            }}>Create Task</Button>
          </form>
        </Card>
      </div>
    </div >
  )
}
