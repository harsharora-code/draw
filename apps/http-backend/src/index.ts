import jwt from "jsonwebtoken"
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
          email: email,
        password: password
        }
    })
    if(!user) {
        return res.status(411).json({
            msg: "user not found"
        })
    }
 
    const encode = jwt.sign({
        userId: user?.id,  
    }, JWT_SECRET as string)
    res.json({
        token : encode
    })
});

app.post('/room', middleware,  async (req, res) => {
     const parseData = CreateRoomSchema.safeParse(req.body);
    if(!parseData.success) {
        console.log(parseData.error);
        res.json({
            msg: "Invalid Inpuits"
        })
        return

    }
    //@ts-ignore
    const userId = req.userId;
   try {
    const room = await prismaClient.room.create({
        data : {
            slug: parseData.data.name,
            adminId: userId
        }
        
    })
    res.json({
        roomId: room.id
    })
   } catch(e) {
    res.status(411).json({
        msg :'Room already exists'
    })
   }
})

app.get("/chat/:roomId", async (req, res) => {
    const roomId = Number(req.params.roomId);
    const msg = await prismaClient.chat.findMany({
        where: {
            roomId: roomId,
        },
        orderBy: {
            id: "desc",
        },
        take: 50
    });
    res.json({
        msg
    })

})

app.listen(3000);