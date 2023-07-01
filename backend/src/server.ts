import cors from "cors"
import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()
export const PORT = process.env.PORT || 8080

const app = express();
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/mercor")
  
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB 🎉")
})

app.listen(PORT, () =>
  console.log('Live on port: ' + PORT + ' 🚀')
)
export { app, mongoose }
