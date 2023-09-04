import { Request, Response } from "express"
import Webhook from "../../model/Webhook.js"

export default (req: Request, res: Response) => {
    //get webhook id
    const id = req.params.id
    if (!id) return res.status(400).send("No id provided")

    //delete webhook from database
    Webhook.findByIdAndDelete(id).then(() => {
        res.status(200).send("Webhook deleted")
    }).catch(err => {
        console.error(err)
        res.status(500)
    })
}