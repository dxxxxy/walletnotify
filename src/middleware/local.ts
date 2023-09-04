import { NextFunction, Response } from "express"

export default (req: any, res: Response, next: NextFunction) => {
    if (req.socket.localAddress !== req.ip) return res.status(403).send("Forbidden")

    next()
}