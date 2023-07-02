import CircleSvg from "@/components/randomCircle";
import { useAuth } from "@/context/authContext";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Button, Card, Dropdown, Label, Progress, RangeSlider, Select, Spinner, Textarea } from "flowbite-react";
import ButtonGroup from "flowbite-react/lib/esm/components/Button/ButtonGroup";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function AssignedTasks() {
  const { user, authLoading } = useAuth();
  const router = useRouter();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [animRef, _] = useAutoAnimate();

  const { data, error, isLoading, ...tasksGetter } = useQuery({
    queryKey: ["Assigned", "Tasks", user],
    queryFn: async () => {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BACKENDURL}/tasks/assigned`, {
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      });
      return data as AssignedTaskData;
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

  if (!user) {
    return <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <div className="font-bold text-2xl">Not Logged In</div>
      <div className="text-neutral-800">Redirecting To Login Page</div>
      <Spinner />
    </div>
  }

  if (isLoading || authLoading) {
    return <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <div className="font-bold text-2xl">Loading</div>
      <div className="text-neutral-800">Please wait</div>
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
      <div className="font-bold text-2xl">Assigned Tasks</div>
      <div className="text-neutral-800">These are the tasks assigned to you</div>
      {selectedTask && (
        <div className="flex flex-col md:flex-row gap-4 mt-4 w-full flex-wrap justify-center">
          <Card className="w-full hover:shadow-lg transition-shadow duration-300 ease-in-out" >
            <div className="flex justify-end px-4 pt-4">
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
            </div>
            {taskMutation.isError && (<div className="bg-red-100 text-red-800 p-4 rounded-md">
              {(taskMutation.error as any)?.response?.data?.error || "Something went wrong"}
            </div>
            )}
            <h5 className="font-bold text-xl flex flex-row items-center gap-2">
              <div className="h-full flex items-center">
                <span className={`${StatusColors[selectedTask.status]} px-2 py-2 rounded-full h-2 w-2 animate-pulse`}></span>
              </div>
              {selectedTask.name}
            </h5>
            <div className="font-semibold">
              Assigned by - {selectedTask.createdBy.email} ({selectedTask.createdBy.name})
            </div>
            <Progress
              progress={selectedTask.status === "Rejected" || selectedTask.status === "Pending" ? 0 : selectedTask.progress}
              color={selectedTask.status == "Rejected" ? "red" : "green"} />
            <Label htmlFor="status">Status</Label>
            <Select id="status" value={selectedTask.status} onChange={(e) => {
              setSelectedTask({
                ...selectedTask,
                status: e.target.value as any
              })
            }}>
              <option value="Accepted">Accepted</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Rejected">Rejected</option>
              <option value="Pending">Pending</option>
            </Select>
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
            <AssignedTaskCard key={task._id} task={task} onClick={() => { selectTask(task) }} />
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

const AssignedTaskCard = ({ task, onClick }: { task: Task, onClick: () => any }) => {
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
      <div className="font-semibold self-end">
        {task.createdBy.name}
      </div>
    </Card>
  )
}



export type AssignedTaskData = {
  tasks: Task[];
  error: string;
}

export type Task = {
  _id: string;
  name: string;
  description: string;
  assignedTo: TaskUser[];
  createdBy: TaskUser;
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
