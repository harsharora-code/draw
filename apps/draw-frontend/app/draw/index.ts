"use client";
import axios from "axios"
import { HTTP_BACKEND } from "@/config";
import { Tool } from "@/components/Canvas";
import { useState } from "react";
import { RefObject } from "react";

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
export  async function draw(
    canvas: HTMLCanvasElement,
     roomId: number,
    socket: WebSocket,
    toolRef: React.RefObject<"circle" | "rect" | "pencil">, 
) {

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
        canvas.addEventListener("mousedown", (e) => {
            clicked = true;
            const rect = canvas.getBoundingClientRect();

            console.log(e.clientX);
            console.log(e.clientY);
            startX = e.clientX - rect.left;
            startY = e.clientY - rect.top;

        });

        canvas.addEventListener("mouseleave", () => {
           clicked = false;
        })
        canvas.addEventListener("mouseup", (e) => {
            clicked = false;
            const width = e.clientX - startX;
            const height = e.clientY - startY;
            const  selectedTool = toolRef.current;
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
                const radius = Math.max(Math.abs(width), Math.abs(height)) /2;
                shape = {
                    type: "circle",
                    radius: radius,
                    centerX: startX + width / 2,
                    centerY: startY + height / 2,
                    
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

        canvas.addEventListener("mousemove", (e) => {

            if(clicked) {

                const rect = canvas.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                const width = mouseX - startX;
                const height = mouseY - startY;
            clearCanvas(existingShape, canvas, ctx);
               ctx.strokeStyle = "rgba(255,255,255)";
            const selectedTool = toolRef.current;
              if(selectedTool === "rect") {
                ctx.strokeRect(startX, startY, width, height);
              } else if(selectedTool === "circle") {
                const radius = Math.max(Math.abs(width),Math.abs(height)) /2;
                const centerX = startX + width / 2;
                const centerY = startY + height /2;
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