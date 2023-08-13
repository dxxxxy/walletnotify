import { NextFunction, Response } from "express"

export default (req: any, res: Response, next: NextFunction) => {
    if (!req.headers["authorization"]) return res.status(401).send("Unauthorized")
    if (req.headers["authorization"] !== `Basic ${btoa(`${process.env.API_USER}:${process.env.API_PASS}`)}`) return res.status(401).send("Unauthorized")

    next()
}