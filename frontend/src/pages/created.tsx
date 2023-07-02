import CircleSvg from "@/components/randomCircle";
import { useAuth } from "@/context/authContext";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Button, Card, Label, Progress, RangeSlider, Spinner, Textarea } from "flowbite-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function AssignedTasks() {
  const { user, authLoading } = useAuth();
  const router = useRouter();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [animRef, _] = useAutoAnimate();

  const { data, error, isLoading, ...tasksGetter } = useQuery({
    queryKey: ["Created", "Tasks", user],
    queryFn: async () => {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BACKENDURL}/tasks/created`, {
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      });
      return data as CreatedTaskData;
    }
  })
  const taskMutation = useMutation(async (task: Task) => {
    const res = await axios.put(`${process.env.NEXT_PUBLIC_BACKENDURL}/tasks`, {
      taskId: task._id,
      status: task.status,
      progress: task.progress,
      notes: task.notes,
      desc: task.description
    }, {
      headers: {
        Authorization: `Bearer ${user?.token}`
      }
    })
    return res.data as Task;
  }, {
    onSuccess: () => {
      tasksGetter.refetch();
    }
  })

  useEffect(() => {
    setSelectedTask(null);
  }, [data])

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

  const selectTask = (task: Task) => {
    setSelectedTask(task);
  }

  if (isLoading || authLoading) {
    return <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <div className="font-bold text-2xl">Loading</div>
      <div className="text-neutral-800">Please wait</div>
      <Spinner />
    </div>
  }

  if (!user) {
    return <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <div className="font-bold text-2xl">Not Logged In</div>
      <div className="text-neutral-800">Redirecting To Login Page</div>
      <Spinner />
    </div>
  }

  if (error || (data && data.error)) {
    return <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <div className="font-bold text-2xl">Error</div>
      <div className="text-neutral-800">{
        error ? JSON.stringify(error) : JSON.stringify(data?.error)
      }</div>
      <Spinner />
    </div>
  }

  return (
    <div className="flex flex-col px-4" ref={animRef}>
      <div className="font-bold text-2xl">Created Tasks</div>
      <div className="text-neutral-800">These are the tasks you created</div>
      {selectedTask && (
        <div className="flex flex-col md:flex-row gap-4 mt-4 w-full flex-wrap justify-center">
          <Card className="w-full hover:shadow-lg transition-shadow duration-300 ease-in-out" >
            <div className="flex justify-end px-4 pt-4">
              <div
                className="cursor-pointer border border-slate-200 rounded-md p-2 hover:bg-slate-200 transition-colors"
                onClick={() => {
                  setSelectedTask(null)
                  taskMutation.reset()
                }}>
                Cancel
              </div>
            </div>
            {taskMutation.isError && (<div className="bg-red-100 text-red-800 p-4 rounded-md">
              {(taskMutation.error as any)?.response?.data?.error || "Something went wrong"}
            </div>
            )}
            <h5 className="font-bold text-xl flex flex-row items-center gap-2">
              {selectedTask.name}
            </h5>
            <h5 className="flex flex-row items-center gap-2">
              <div className="h-full flex items-center">
                <span className={`${StatusColors[selectedTask.status]} px-2 py-2 rounded-full h-2 w-2 animate-pulse`}></span>
              </div>
              {selectedTask.status}
            </h5>
            <Progress
              progress={selectedTask.status === "Rejected" || selectedTask.status === "Pending" ? 0 : selectedTask.progress}
              color={selectedTask.status == "Rejected" ? "red" : "green"} />
            {selectedTask.status === "In Progress" && (
              <div>
                <Label htmlFor="progress">Progress {selectedTask.progress}%</Label>
                <RangeSlider id="progress" value={selectedTask.progress} max={100} min={0} onChange={(e) => {
                  setSelectedTask({
                    ...selectedTask,
                    progress: Number(e.target.value)
                  })
                }} />
              </div>
            )}
            <Label htmlFor="desc">Description</Label>
            <Textarea id="desc" value={selectedTask.description} placeholder="Description" className="min-h-[8rem]" onChange={(e) => {
              setSelectedTask({
                ...selectedTask,
                description: e.target.value
              })
            }} />
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" value={selectedTask.notes} placeholder="Notes" className="min-h-[8rem]" onChange={(e) => {
              setSelectedTask({
                ...selectedTask,
                notes: e.target.value
              })
            }} />

            <Label htmlFor="assignedTo">Assigned To:</Label>
            <div className="flex flex-col sm:flex-row gap-2 flex-wrap">
              {selectedTask.assignedTo.map((user) => (
                <Card key={user._id} className="max-w-md" >
                  <div className="font-bold text-xl break-words">{user.name}</div>
                  <div className="text-neutral-800 break-words">{user.email}</div>
                </Card>
              ))}
            </div>

            <Button disabled={taskMutation.isLoading} className="bg-blue-500 hover:bg-blue-600 transition-colors" onClick={() => {
              taskMutation.mutate(selectedTask);
            }}>
              Save Changes
              {taskMutation.isLoading && <Spinner className="ml-2" />}
            </Button>
          </Card>
        </div>
      )}
      {!selectedTask && (
        <div className="flex flex-col md:flex-row gap-4 mt-4 w-full flex-wrap justify-center">
          {data?.tasks.map((task) => (
            <CreatedTaskCard key={task._id} task={task} onClick={() => { selectTask(task) }} />
          ))}
        </div>
      )}
    </div>
  )

}

const StatusColors = {
  "Accepted": "bg-yellow-300",
  "In Progress": "bg-green-300",
  "Completed": "bg-green-500",
  "Rejected": "bg-red-500",
  "Pending": "bg-slate-500",
}

const CreatedTaskCard = ({ task, onClick }: { task: Task, onClick: () => any }) => {
  return (
    <Card
      className="w-full md:w-96 hover:shadow-lg transition-shadow duration-300 ease-in-out cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-40 overflow-hidden rounded-md">
        <CircleSvg seed={task.name} className="absolute blur-md -translate-x-5 -translate-y-5" />
      </div>
      <h5 className="font-bold text-xl flex flex-row items-center gap-2">
        <div className="h-full flex items-center">
          <span className={`${StatusColors[task.status]} px-2 py-2 rounded-full h-2 w-2 animate-pulse`}></span>
        </div>
        {task.name}
      </h5>
      <Progress
        progress={task.status === "Rejected" || task.status === "Pending" ? 0 : task.progress}
        color={task.status == "Rejected" ? "red" : "green"} />
      <p className="text-neutral-800">{task.description}</p>
    </Card>
  )
}



type CreatedTaskData = {
  tasks: Task[];
  error: string;
}

type Task = {
  _id: string;
  name: string;
  description: string;
  assignedTo: TaskUser[];
  createdBy: string;
  progress: number;
  status: "Accepted" | "In Progress" | "Completed" | "Rejected" | "Pending";
  notes: string;
  __v: number;
}

export type TaskUser = {
  _id: string;
  name: string;
  email: string;
  __v: number;
}
