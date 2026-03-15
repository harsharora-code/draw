import { getExistingShape } from "./http";
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

export class Game {
        private canvas: HTMLCanvasElement;
        private ctx: CanvasRenderingContext2D;
        private existingShape: Shape[];
        private roomId: number;
        socket: WebSocket;
        private clicked: boolean;
        private startX = 0;
        private startY = 0;
        private selectedTool: Tool = "circle";

        constructor(canvas: HTMLCanvasElement, roomId: number, socket: WebSocket) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.existingShape = [];
        this.roomId = roomId;
        this.socket = socket;
        this.clicked = false;
        this.init();
        this.initHandler();
        this.initMouseHandlers();

        }

        setTool(tool: "circle" | "pencil" | "rect") {
            this.selectedTool = tool;

        }
    async init() {
            this.existingShape = await getExistingShape(this.roomId);
    }


    initHandler() {
         this.socket.onmessage = (event) => {          //whenever msgh recive on server  
        const message  = JSON.parse(event.data);
        if(message.type == "chat") {
            const parseShape = JSON.parse(message.message);
            this.existingShape.push(parseShape.shape);
            this.clearCanvas();
        }
      }

    }

    clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "rgba(0,0,0)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

     this.existingShape.map((shape) => {
      if(shape.type == "rect") {
     this.ctx.strokeStyle = "rgba(255, 255, 255)";
   this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
     } else if(shape.type == "circle") {
        this.ctx.beginPath();
        this.ctx.arc(shape.centerX, shape.centerY,  shape.radius, 0, 2*Math.PI);
        this.ctx.stroke();
        this.ctx.closePath();
     }
   })

    }

    initMouseHandlers() {
        this.canvas.addEventListener("mousedown", (e) => {
            this.clicked = true;
            this.startX = e.clientX;
            this.startY = e.clientY;
        })

        this.canvas.addEventListener("mouseup", (e) => {
            this.clicked = false;
            const width = e.clientX - this.startX;
            const height = e.clientY - this.startY;
            const  selectedTool = this.selectedTool;
             let shape: Shape | null = null;
             if(selectedTool === "rect") {
                shape = {
                type: "rect",
                x: this.startX,
                y: this.startY,
                height: height,
                width: width
                
            }

             } else if(selectedTool === "circle") {
                const radius = Math.max(Math.abs(width), Math.abs(height)) /2;
                shape = {
                    type: "circle",
                    radius: radius,
                    centerX: this.startX + width / 2,
                    centerY: this.startY + height / 2,
                    
                }
             }
             if(!shape) return;
            this.existingShape.push(shape);

            this.socket.send(JSON.stringify({
                type: "chat",
                message: JSON.stringify({
                    shape
                }),
                  roomId: this.roomId
            }))

        });

        this.canvas.addEventListener("mousemove", (e) => {

            if(this.clicked) {

                const rect = this.canvas.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                const width = mouseX - this.startX;
                const height = mouseY - this.startY;
            this.clearCanvas();
               this.ctx.strokeStyle = "rgba(255,255,255)";
            const selectedTool = this.selectedTool;
              if(selectedTool === "rect") {
                this.ctx.strokeRect(this.startX, this.startY, width, height);
              } else if(selectedTool === "circle") {
                const radius = Math.max(Math.abs(width),Math.abs(height)) /2;
                const centerX = this.startX + width / 2;
                const centerY = this.startY + height /2;
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, Math.abs(radius), 0, 2 * Math.PI);
                this.ctx.stroke();
                this.ctx.closePath();
              }
              console.log("drawing", selectedTool);

            }
            
        })


    }
}