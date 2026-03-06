"use client"
import { WS_URL } from "@/config";
import { useEffect, useState } from "react";
import {Canvas} from "./Canvas"

export function RoomCanvas({roomId}:  {roomId: string}) {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws =  new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1YTUxZDUzMS04MGM4LTQ3NDItYjg5Ni03YjdjZjUyN2JiNjEiLCJpYXQiOjE3NzI4MjIwMDV9.veZ9VbkCS50nIkZ4PIJGVjPqaHIfrfI8Q4BJU13HbTo`)

        ws.onopen = () => {
            setSocket(ws);
            ws.send(JSON.stringify({
                type: "join_room",
                roomId
            }))
        }
    }, [])

        if(!socket) {
            return <div>
                Connecting to server.....
            </div>
        }
        return <Canvas roomId={roomId} socket={socket}/>
    
        
    }

