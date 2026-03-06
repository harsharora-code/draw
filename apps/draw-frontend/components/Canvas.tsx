"use client"
import { useEffect, useRef} from "react";
import draw from "@/app/draw"


export function Canvas({roomId, socket}:  
    {
    roomId: string; 
    socket: WebSocket;
    } 
) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
  
        useEffect(() => {
            if(canvasRef.current) {
              draw(canvasRef.current, roomId, socket)
            }
        }, [canvasRef])
    
        return <div>
               <canvas ref={canvasRef} height={1000} width={2000}></canvas>
        </div>
    }

