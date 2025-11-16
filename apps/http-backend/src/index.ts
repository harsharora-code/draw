import jwt, { JwtPayload } from "jsonwebtoken"
import express from 'express'
import { JWT_SECRET} from "@repo/backend-common/config";
import { middleware } from "./middleware.js";
import {createUserSchema, SigninSchema, CreateRoomSchema} from "@repo/common/types"


const app = express();


app.post('/signup', (req, res) => {
    const data = createUserSchema.safeParse(req.body);
    if(!data.succes) {
        console.log(data.error);
        res.json({
            msg: "Invalid Inpuits"
        })
        return

    }
    res.json({
        userId : 1232
    })

})

app.post('/signin', (req, res) => {
     const data = SigninSchema.safeParse(req.body);
    if(!data.succes) {
        console.log(data.error);
        res.json({
            msg: "Invalid Inpuits"
        })
        return

    }
    const userId = 1;
    const encode = jwt.sign({
        userId,
    }, JWT_SECRET as string)
    res.json({
        token : encode
    })
});

app.post('/room', middleware, (req, res) => {
     const data = CreateRoomSchema.safeParse(req.body);
    if(!data.succes) {
        console.log(data.error);
        res.json({
            msg: "Invalid Inpuits"
        })
        return

    }
    const userId = 1;
    res.json({
        roomId: 12323
    })
})