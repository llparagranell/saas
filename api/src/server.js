import dotenv from "dotenv"
import app from "./app.js"
import { connectDb } from "./config/db.js"

dotenv.config()

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDb(process.env.MONGO_URI)
  app.listen(PORT, () => {
    console.log(`API running on port ${PORT}`)
  })
}

start()
