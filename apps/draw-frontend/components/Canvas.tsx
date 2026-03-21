"use client"
import { useEffect, useRef, useState, useMemo} from "react";
import {draw} from "@/app/draw"
import { Circle, Pencil, RectangleHorizontalIcon, Hand, Slash } from "lucide-react";
import { IconButton } from "./IconButton";
import { Game } from "@/app/draw/game";


export type Tool = "circle" | "rect" | "pencil" | "panTool";
export function Canvas({roomId, socket}:  
    {
    roomId: number; 
    socket: WebSocket;
    } 
) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedTool,  setSelectedTool] = useState<Tool>("panTool")
    const [game, setGame] = useState<Game>();
    const [grabbing, setGrabbing] = useState(false);

    useEffect(() => {
        
        game?.setTool(selectedTool)
 
    }, [selectedTool, game])
  
        useEffect(() => {
            if(canvasRef.current) {
              const g = new Game(canvasRef.current, roomId, socket)
              setGame(g);

              const handleKeyDown = (e: KeyboardEvent) => {
                switch (e.key) {
                    case "1":
                        setSelectedTool("panTool");
                        break;
                    case "2":
                        setSelectedTool("pencil");
                        break;
                    case "3":
                        setSelectedTool("rect");
                        break;
                    case "4":
                        setSelectedTool("circle");
                        break;
                }
              };

              document.addEventListener("keydown", handleKeyDown);
              return () => {
                document.removeEventListener("keydown", handleKeyDown);
                g.destroy();
              }
            }

        }, [canvasRef])

        // Separate effect for grab cursor when using panTool
        useEffect(() => {
            if (selectedTool !== "panTool") {
                setGrabbing(false);
                return;
            }

            const handleMouseDown = () => setGrabbing(true);
            const handleMouseUp = () => setGrabbing(false);

            document.addEventListener("mousedown", handleMouseDown);
            document.addEventListener("mouseup", handleMouseUp);

            return () => {
                document.removeEventListener("mousedown", handleMouseDown);
                document.removeEventListener("mouseup", handleMouseUp);
            };
        }, [selectedTool])

        return <div className={`h-screen overflow-hidden bg-white ${(selectedTool == "panTool") ? (grabbing ? "cursor-grabbing" : "cursor-grab") : "cursor-crosshair"}`}>
               <canvas ref={canvasRef} height={window.innerHeight} width={window.innerWidth}></canvas>
               <Topbar setSelectedTool={setSelectedTool} selectedTool={selectedTool}/>
               </div>

        
    }

    function Topbar({selectedTool, setSelectedTool}: {
    selectedTool: Tool,
    setSelectedTool: (s: Tool) => void
}) {
    return <div className="fixed top-18  left-[50%] -translate-x-[50%] w-fit">
            <div className="flex bg-[#232329] px-4 py-1 rounded-md gap-3">
                <IconButton
                shortKey={1}
                onClick={() => {
                    setSelectedTool("panTool")
                }}
                activated={selectedTool == "panTool"}
                icon={<Hand/>}
                />
                <IconButton
                shortKey={2} 
                    onClick={() => {
                        setSelectedTool("pencil")
                    }}
                    activated={selectedTool === "pencil"}
                    icon={<Pencil />}
                />
                <IconButton 
                shortKey={3}
                onClick={() => {
                    setSelectedTool("rect")
                }} activated={selectedTool === "rect"} icon={<RectangleHorizontalIcon />} ></IconButton>
                <IconButton 
                shortKey={4}
                onClick={() => {
                    setSelectedTool("circle")
                }} activated={selectedTool === "circle"} icon={<Circle />}></IconButton>
            </div>
              <p className="text-white/30 mt-1 absolute w-full mx-auto scale-[0.8] text-sm text-center">To zoom, use scroll or pinch!</p>
        </div>
}

