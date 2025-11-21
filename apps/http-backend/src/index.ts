import jwt, { JwtPayload } from "jsonwebtoken"
import express, { json } from 'express'
import { JWT_SECRET} from "@repo/backend-common/config";
import { middleware } from "./middleware.js";
import {CreateUserSchema, SigninSchema, CreateRoomSchema} from "@repo/common/type"
import { prismaClient } from "@repo/db/client";
import cors from "cors"


const app = express();

app.use(cors());
app.use(express.json());


app.post('/signup', async (req, res) => {
    const parseData = CreateUserSchema.safeParse(req.body);
    if(!parseData.success) {
        console.log(parseData.error);
        res.json({
            msg: "Invalid Inpuits"
        })
        return

    }
    try {
        const user = await prismaClient.user.create({
            data : {
                email : parseData.data?.email,
                username: parseData.data.username,
                password : parseData.data.password
            }
        })
        res.json({
            userId : user.id
        })
    } catch(e) {
            res.status(411).json({
            msg: "user already exists"
        })
    }
   

})

app.post('/signin', async (req, res) => {
     const parseData = SigninSchema.safeParse(req.body);
    if(!parseData.success) {
        console.log(parseData.error);
       return res.json({
            msg: "Invalid Inpuits"
        })
       

    }
    const {email, password} = parseData.data;
    const user = await prismaClient.user.findFirst({
        where : {
          email, password
        }
    })
    if(!user) {
        return res.status(411).json({
            msg: "unauthorized"
        })
    }
 
    const encode = jwt.sign({
        userId: user?.id,
    }, JWT_SECRET as string)
    res.json({
        token : encode
    })
});

app.post('/room', middleware, (req, res) => {
     const data = CreateRoomSchema.safeParse(req.body);
    if(!data.success) {
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