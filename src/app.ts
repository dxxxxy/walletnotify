import express from "express"
import helmet from "helmet"
import mongoose from "mongoose"
import { RPCClient } from "rpc-bitcoin"
import auth from "./middleware/auth.js"
import local from "./middleware/local.js"
import notify from "./routes/local/notify.js"
import subscribe from "./routes/v1/subscribe.js"

//load environment variables
(await import("dotenv")).config()

//connect to database
await mongoose.connect(process.env.MONGO_URL)
mongoose.connection.on("connected", () => console.log("Mongoose connection successfully opened!"))
mongoose.connection.on("err", err => console.error(`Mongoose connection error:\n${err.stack}`))
mongoose.connection.on("disconnected", () => console.log("Mongoose connection disconnected"))

//start rpc client
export const client = new RPCClient({
    url: process.env.RPC_URL,
    port: +process.env.RPC_PORT,
    timeout: +process.env.RPC_TIMEOUT || 30000,
    user: process.env.RPC_USER,
    pass: process.env.RPC_PASS
});

const app = express()

app.use(helmet())
app.use(express.json())

//nginx ip forwarding
app.set("trust proxy", true)

//routes
app.get("/notify/:txid", local, notify)
app.post("/api/v1/subscribe", auth, subscribe)

//create server
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server listening on port ${port}`))

//no exit
process.on("uncaughtException", (error) => console.log(error))
process.on("unhandledRejection", (error) => console.log(error))