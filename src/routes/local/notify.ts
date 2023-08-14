import crypto from "crypto"
import { Response } from "express"
import { client } from "../../app.js"
import Webhook, { IWebhook } from "../../model/Webhook.js"

/* this request comes from bitcoin-core's walletnotify, therefore there is no validation needed */
export default (req: any, res: Response) => {
    //only accept local connections
    if (req.connection.localAddress !== req.connection.remoteAddress) res.status(403)

    //get txid from walletnotify (guaranteed to be there)
    const txid = req.params.txid

    //get transaction from txid
    client.getrawtransaction({ txid, verbose: true }).then(tx => {
        //get all output addresses
        const addresses = tx.vout.map((vout: { scriptPubKey: { addresses: String[] } }) => vout.scriptPubKey.addresses).flat()

        //get webhooks from database
        Webhook.find({ Address: { $in: addresses }}, (err: any, webhooks: IWebhook[]) => {
            if (err) {
                console.error(err)
                return res.status(500)
            }

            //send webhooks
            webhooks.forEach(webhook => {
                const body = JSON.stringify(tx)

                const signature = crypto.createHmac("sha256", webhook.Secret).update(body).digest("hex")

                //noinspection JSIgnoredPromiseFromCall
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
        })
    })
}