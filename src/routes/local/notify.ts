import crypto from "crypto"
import { Request, Response } from "express"
import { client } from "../../app.js"
import Webhook, { IWebhook } from "../../model/Webhook.js"

export default (req: Request, res: Response) => {
    //get txid from walletnotify (guaranteed to be there)
    const txid = req.params.txid

    //get transaction from txid
    client.gettransaction({ txid, include_watchonly: true, verbose: true }).then(async tx => {
        //get all output addresses
        const addresses = tx.decoded.vout.map((vout: { scriptPubKey: { address: String } }) => vout.scriptPubKey.address)

        //get webhooks from database that match at least one address
        const webhooks: IWebhook[] = await Webhook.find({ Address: { $in: addresses }})

        //send webhooks
        webhooks.forEach(webhook => {
            //create body
            const body = JSON.stringify({ tx, address: webhook.Address })

            //create signature
            const signature = crypto.createHmac("sha256", webhook.Secret).update(body).digest("hex")

            //send
            fetch(webhook.Callback, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Webhook-Signature": signature
                },
                body
            })
        })

        //end curl task in walletnotify
        res.status(200)
    }).catch(err => {
        console.error(err)
        res.status(500)
    })
}