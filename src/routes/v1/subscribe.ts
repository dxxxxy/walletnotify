import crypto from "crypto"
import { Response } from "express"
import { client } from "../../app.js"
import Webhook from "../../model/Webhook.js"

export default async(req: any, res: Response) => {
    //get address
    const address: string = req.body.address
    if (!address) return res.status(400).send("No address provided")

    //get callback
    const callback: string = req.body.callback
    if (!callback) return res.status(400).send("No callback provided")

    //import address into wallet for walletnotify
    await client.importaddress({ address, rescan: false })

    //create secret for hmac
    const secret = crypto.randomBytes(64).toString("hex")

    //save webhook to database
    new Webhook({
        Address: address,
        Callback: callback,
        Secret: secret
    }).save().then(webhook => {
        //send back secret so client can verify webhooks and id to track
        res.status(200).json({ id: webhook.id, secret })
    }).catch(err => {
        console.error(err)
        res.status(500)
    })
}