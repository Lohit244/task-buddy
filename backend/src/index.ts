import { app } from "./server"
import { authMiddleware, getUser, login,signup } from "./auth"
import { updateTask, getTasksCreatedByMe, getTasksAssignedToMe, createTask } from "./tasks"

app.get('/healthcheck', async (req, res) => {
  res.json({ status: 'good' })
})

app.get('/user', authMiddleware, (getUser as any))
app.post('/login', login)
app.post('/signup', signup)

app.get('/tasks/created', authMiddleware, (getTasksCreatedByMe as any))
app.get('/tasks/assigned', authMiddleware, (getTasksAssignedToMe as any))
app.post('/tasks', authMiddleware, (createTask as any))
app.put('/tasks', authMiddleware, (updateTask as any))
