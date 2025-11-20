import { Request, Response, NextFunction } from "express";
import { JWT_SECRET } from "@repo/backend-common/config";
import jwt from 'jsonwebtoken'
interface JwtPayload {
    userId: number
}

export function middleware(req: Request, res: Response, next: NextFunction) {
const token = req.headers.authorization ?? "";
const decode  = jwt.verify(token, JWT_SECRET as string) as unknown as JwtPayload; 


if(decode) {
    //@ts-ignore
    req.userId = decode.userId;
    next()
} else {
    res.status(403).json({
        msg: "unauthorized"

    })
}
}
