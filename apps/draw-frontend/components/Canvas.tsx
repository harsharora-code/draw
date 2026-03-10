"use client"
import { useEffect, useRef, useState} from "react";
import draw from "@/app/draw"
import { Circle, Pencil, RectangleHorizontalIcon } from "lucide-react";
import { IconButton } from "./IconButton";

 export type Tool = 'circle' | "rect" | "pencil";
export function Canvas({roomId, socket}:  
    {
    roomId: Number; 
    socket: WebSocket;
    } 
) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedTool,  setSelectedTool] = useState<Tool>("circle")
  
        useEffect(() => {
            if(canvasRef.current) {
              draw(canvasRef.current, roomId, socket)
            }
        }, [canvasRef])

        return <div style={{
            height: "100vh",
            overflow: "hidden"
        }}>
               <canvas ref={canvasRef} height={window.innerHeight} width={window.innerWidth}></canvas>
               <Topbar setSelectedTool={setSelectedTool} selectedTool={selectedTool}/>
               </div>

        
    }

    function Topbar({selectedTool, setSelectedTool}: {
    selectedTool: Tool,
    setSelectedTool: (s: Tool) => void
}) {
    return <div style={{
            position: "fixed",
            top: 60,
            left: 10
        }}>
            <div className="flex gap-t">
                <IconButton 
                    onClick={() => {
                        setSelectedTool("pencil")
                    }}
                    activated={selectedTool === "pencil"}
                    icon={<Pencil />}
                />
                <IconButton onClick={() => {
                    setSelectedTool("rect")
                }} activated={selectedTool === "rect"} icon={<RectangleHorizontalIcon />} ></IconButton>
                <IconButton onClick={() => {
                    setSelectedTool("circle")
                }} activated={selectedTool === "circle"} icon={<Circle />}></IconButton>
            </div>
        </div>
}

