import mongoose from "mongoose"

export default mongoose.model("Webhook", new mongoose.Schema({
    Address: String,
    Callback: String,
    Secret: String
}))