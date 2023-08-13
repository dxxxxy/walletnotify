import mongoose from "mongoose"
import express from "express"

//setup
(await import("dotenv")).config()
mongoose.connect(process.env.MONGO_URL)
mongoose.connection.on("connected", () => console.log("Mongoose connection successfully opened!"))
mongoose.connection.on("err", err => console.error(`Mongoose connection error:\n${err.stack}`))
mongoose.connection.on("disconnected", () => console.log("Mongoose connection disconnected"))

const app = express()

app.use(express.json())

//create server
const port = process.env.PORT || 8334
app.listen(port, () => console.log(`Server listening on port ${port}`))