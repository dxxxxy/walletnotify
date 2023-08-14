import { Document, model, Schema } from "mongoose"

export interface IWebhook extends Document {
    Address: string,
    Callback: string,
    Secret: string
}

export default model<IWebhook>("Webhook", new Schema({
    Address: { type: String, required: true },
    Callback: { type: String, required: true },
    Secret: { type: String, required: true }
}))