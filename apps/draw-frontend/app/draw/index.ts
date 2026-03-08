"use client";
import axios from "axios"
import { HTTP_BACKEND } from "@/config";

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
}
export default async function draw(canvas: HTMLCanvasElement, roomId: Number, socket: WebSocket) {

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

        ctx.fillStyle = "rgba(0,0,0)";
        ctx.fillRect(0,0, canvas.width, canvas.height);

        let clicked = false;
        let startX = 0;
        let startY = 0;

        canvas.addEventListener("mouseup", (e) => {
            clicked = false;
            const width = e.clientX - startX;
            const height = e.clientY - startY;
            const shape: Shape = {
                type: "rect",
                x: startX,
                y: startY,
                height: height,
                width: width
                
            }
            existingShape.push(shape)

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
            //    ctx.clearRect(0, 0, canvas.width, canvas.height);
            //    ctx.fillStyle = "rgba(0,0,0)";
            //  ctx.fillRect(0,0, canvas.width, canvas.height);
            clearCanvas(existingShape, canvas, ctx);
               ctx.strokeStyle = "rgba(255, 255, 255)";
               ctx.strokeRect(startX, startY, width, height);
            }
            
        })
    
}
function clearCanvas(existingShape: Shape[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
     ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0,0,0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
     existingShape.map((Shape) => {
      if(Shape.type == "rect") {
     ctx.strokeStyle = "rgba(255, 255, 255)";
   ctx.strokeRect(Shape.x, Shape.y, Shape.height, Shape.width);
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