"use client"
import draw from "@/app/draw";
import { useRef, useEffect } from "react"
export default function Canvas() {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    


    useEffect(() => {
        if(canvasRef.current) {
        const canvas  = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if(!ctx) return;
        
        draw(canvas);
        }
    

    }, [canvasRef])

    
    return <div>
           <canvas ref={canvasRef} height={500} width={1000}></canvas>
    </div>
}