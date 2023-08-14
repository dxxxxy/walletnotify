import { Response } from "express"
import Webhook from "../../model/Webhook.js"

export default (req: any, res: Response) => {
    //get webhook id
    const id = req.params.id
    if (!id) return res.status(400).send("No id provided")

    //delete webhook from database
    Webhook.findByIdAndDelete(id, (err: any) => {
        if (err) {
            console.error(err)
            return res.status(500)
        }

        //send back 200
        res.status(200)
    })
}