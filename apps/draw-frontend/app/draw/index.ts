"use client";
import axios from "axios"
import { HTTP_BACKEND } from "@/config";
import { Tool } from "@/components/Canvas";

type Shape = {
    type: "rect";
    x: number;
    y: number;
    height: number;
    width: number;
} | {
    type: "circle",
    centerX: number;
    centerY: number;
    radius: number;
} | {
    type: "pencil",
    startX: number,
    startY: number,
    endX: number,
    endY: number
}
export  async function draw(canvas: HTMLCanvasElement, roomId: Number, socket: WebSocket, selectedTool: Tool) {

    let existingShape: Shape[] = await getExistingShape(roomId);

      const ctx = canvas.getContext("2d");
      if(!ctx) return;

      socket.onmessage = (event) => {          //whenever msgh recive on server  
        const message  = JSON.parse(event.data);
        if(message.type == "chat") {
            const parseShape = JSON.parse(message.message);
            existingShape.push(parseShape.shape);
            clearCanvas(existingShape, canvas, ctx);
        }
      }

        // ctx.fillStyle = "rgba(0,0,0)";
        // ctx.fillRect(0,0, canvas.width, canvas.height);
     clearCanvas(existingShape, canvas, ctx);
        let clicked = false;
        let startX = 0;
        let startY = 0;

        canvas.addEventListener("mouseup", (e) => {
            clicked = false;
            const width = e.clientX - startX;
            const height = e.clientY - startY;
             const selectedTool =  (window as any).selectedTool;
             let shape: Shape | null = null;
             if(selectedTool === "rect") {
                shape = {
                type: "rect",
                x: startX,
                y: startY,
                height: height,
                width: width
                
            }

             } else if(selectedTool === "circle") {
                const radius = Math.max(width, height) /2;
                shape = {
                    type: "circle",
                    radius: radius,
                    centerX: startX + radius,
                    centerY: startY + radius,
                    
                }
             }
             if(!shape) return;
            existingShape.push(shape);

            socket.send(JSON.stringify({
                type: "chat",
                message: JSON.stringify({
                    shape
                }),
                roomId
            }))

        });
        canvas.addEventListener("mousedown", (e) => {
            clicked = true;
            console.log(e.clientX);
            console.log(e.clientY);
            startX = e.clientX;
            startY = e.clientY;

        });
        canvas.addEventListener("mousemove", (e) => {
            if(clicked) {
                const width = e.clientX - startX;
                const height = e.clientY - startY;
            clearCanvas(existingShape, canvas, ctx);
               ctx.strokeStyle = "rgba(255,255,255)";
            //    ctx.strokeRect(startX, startY, width, height);
              const selectedTool = (window as any).selectedTool;
              if(selectedTool === "rect") {
                ctx.strokeRect(startX, startY, width, height);
              } else if(selectedTool === "circle") {
                const radius = Math.max(width, height) /2;
                const centerX = startX + radius;
                const centerY = startY + radius;
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
                ctx.stroke();
                ctx.closePath();
              }
              console.log("drawing", selectedTool);

            }
            
        })
    
}
function clearCanvas(existingShape: Shape[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
     ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0,0,0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

     existingShape.map((shape) => {
      if(shape.type == "rect") {
     ctx.strokeStyle = "rgba(255, 255, 255)";
   ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
     } else if(shape.type == "circle") {
        ctx.beginPath();
        ctx.arc(shape.centerX, shape.centerY,  shape.radius, 0, 2*Math.PI);
        ctx.stroke();
        ctx.closePath();
     }
   })
}


async function getExistingShape(roomId: Number) {
      console.log(`${HTTP_BACKEND}/chat/${roomId}`);
    const res = await axios.get(`${HTTP_BACKEND}/chat/${roomId}`);
    const messages = res.data.msg;
    console.log(messages);

    const shapes = messages.map((x: {message: string}) => {
           const messageData = JSON.parse(x.message);
           return messageData.shape;    // shape as message
    })

    return shapes;



}