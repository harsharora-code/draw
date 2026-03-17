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
} | {
     type: "line",
     fromX : number,
     fromY: number,
     toX: number,
     toY: number
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
        private selectedTool: Tool = "panTool";
        private scale: number =  0;
        private panX: number = 0;
        private panY: number = 0;

        constructor(canvas: HTMLCanvasElement, roomId: number, socket: WebSocket) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.existingShape = [];
        this.roomId = roomId;
        this.socket = socket;
        this.clicked = false;
        this.canvas.width = document.body.clientWidth;
        this.canvas.height = document.body.clientHeight;
        this.init();
        this.initHandler();
        this.mouseHandlers();

        }


        destroy() {
                 this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
                 this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
                 this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
                 this.canvas.removeEventListener("mouseleave", this.mouseLeaveHandler);
                 this.canvas.removeEventListener("wheel", this.mouseWheelHandler);
        }

        setTool(tool: "circle" | "pencil" | "rect" | "panTool") {
            this.selectedTool = tool;

        }
    async init() {
            this.existingShape = await getExistingShape(this.roomId);
            this.clearCanvas();
    }


    initHandler() {
         this.socket.onmessage = (event) => {          //whenever msg recive on server  
        const message  = JSON.parse(event.data);
        if(message.type == "chat") {
            const parseShape = JSON.parse(message.message);
            this.existingShape.push(parseShape.shape);
            this.clearCanvas();
        }
      }

    }

    clearCanvas() {
    // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // this.ctx.fillStyle = "rgba(0,0,0)";
    // this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.setTransform(this.scale, 0, 0, this.scale, this.panX, this.panY);
        this.ctx.clearRect(

            -this.panX / this.scale, 
            -this.panY / this.scale, 

            this.canvas.width / this.scale, 
            this.canvas.height/ this.scale);
        this.ctx.fillStyle = "rgba(18, 18, 18)"
        this.ctx.fillRect(  
            // Adjusts the offset of the canvas
            -this.panX / this.scale, 
            -this.panY / this.scale, 
            // Adjusts the scale of the canvas
            this.canvas.width/ this.scale, 
            this.canvas.height / this.scale);

     this.existingShape.map((shape) => {
      if(shape.type == "rect") {
     this.ctx.strokeStyle = "rgba(255, 255, 255)";
     this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
     } else if(shape.type == "circle") {
        this.ctx.beginPath();
        this.ctx.arc(shape.centerX, shape.centerY,  Math.abs(shape.radius), 0, 2*Math.PI);
        this.ctx.stroke();
        this.ctx.closePath();
     }
   })

    }

    // initMouseHandlers() {
    mouseDownHandler = (e: MouseEvent) => {
    const rect = this.canvas.getBoundingClientRect();
    this.clicked = true;
    this.startX = e.clientX - rect.left;
    this.startY = e.clientY - rect.top;
}
        mouseUpHandler = (e: MouseEvent) => {
           
            this.clicked = false;
            const rect = this.canvas.getBoundingClientRect();
           const mouseX = e.clientX - rect.left; 
           const mouseY = e.clientY - rect.top;
           const width = mouseX - this.startX;
           const height = mouseY - this.startY;
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
            this.clearCanvas();

            this.socket.send(JSON.stringify({
                type: "chat",
                message: JSON.stringify({
                    shape
                }),
                  roomId: this.roomId
            }))

        }

        mouseMoveHandler = (e : MouseEvent) => {

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
              } else if(selectedTool == "pencil") {

              }
              console.log("drawing", selectedTool);

            }

        }

        mouseWheelHandler = (e : WheelEvent) => {
        e.preventDefault();

        const scaleAmount = -e.deltaY / 500;
        const newScale = this.scale * (1 + scaleAmount); 

        const mouseX = e.clientX - this.canvas.offsetLeft;
        const mouseY = e.clientY - this.canvas.offsetTop;
        
        const canvasMouseX = (mouseX - this.panX) / this.scale;
        const canvasMouseY = (mouseY - this.panY) / this.scale;

        this.panX -= (canvasMouseX * newScale - canvasMouseX * this.scale);
        this.panY -= (canvasMouseY * newScale - canvasMouseY * this.scale);
    
        this.scale = newScale;
    
        this.clearCanvas();
        
    };

        mouseLeaveHandler = () => {
            this.clicked = false;
        }

       mouseHandlers() {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
    this.canvas.addEventListener("mouseleave", this.mouseLeaveHandler);
}


    // }
}