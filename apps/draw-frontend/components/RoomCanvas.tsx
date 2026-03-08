"use client"
import { WS_URL } from "@/config";
import { useEffect, useState } from "react";
import {Canvas} from "./Canvas"
import { da } from "zod/v4/locales";

export function RoomCanvas({roomId}:  {roomId: string}) {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws =  new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1YTUxZDUzMS04MGM4LTQ3NDItYjg5Ni03YjdjZjUyN2JiNjEiLCJpYXQiOjE3NzI4MjIwMDV9.veZ9VbkCS50nIkZ4PIJGVjPqaHIfrfI8Q4BJU13HbTo`)

        ws.onopen = () => {
            console.log("connected ws")
            setSocket(ws);
            const data = JSON.stringify({
                type: "join_room",
                roomId
            });
            console.log(data);
            ws.send(data);
            
        }

        ws.close = () => {
            console.log("ws closed")
        }
    }, [roomId])

        if(!socket) {
            return <div>
                Connecting to server.....
            </div>
        }
        return <Canvas roomId={roomId} socket={socket}/>
    
        
    }

