"use client"
import { useEffect, useRef} from "react";
import draw from "@/app/draw"
import { Socket } from "dgram";

export function Canvas({roomId}:  
    {roomId: string}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
  
        useEffect(() => {
            if(canvasRef.current) {
              draw(canvasRef.current, roomId)
            }
        }, [canvasRef])
    
        return <div>
               <canvas ref={canvasRef} height={1000} width={2000}></canvas>
        </div>
    }

