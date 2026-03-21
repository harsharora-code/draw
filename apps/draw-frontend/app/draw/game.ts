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
        private scale: number = 1;
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
        this.clearCanvas(); // Initial render
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
        this.ctx.fillStyle = "rgba(255, 255, 255)"
        this.ctx.fillRect(
            -this.panX / this.scale,
            -this.panY / this.scale,
            this.canvas.width/ this.scale,
            this.canvas.height / this.scale);

     this.existingShape.map((shape) => {
      if(shape.type == "rect") {
     this.ctx.strokeStyle = "rgba(0, 0, 0)";
     this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
     } else if(shape.type == "circle") {
        this.ctx.beginPath();
        this.ctx.arc(shape.centerX, shape.centerY,  Math.abs(shape.radius), 0, 2*Math.PI);
        this.ctx.stroke();
        this.ctx.closePath();
     } else if(shape.type == "pencil") {
           this.ctx.beginPath();
           this.ctx.moveTo(shape.startX, shape.startY);
           this.ctx.lineTo(shape.endX, shape.endY);
           this.ctx.stroke();
           this.ctx.closePath();
     }
   })

    }

    // initMouseHandlers() {
    mouseDownHandler = (e: MouseEvent) => {
    this.clicked = true;
    if (this.selectedTool === "panTool") {
        // For panning, store raw clientX/Y for delta calculation
        this.startX = e.clientX;
        this.startY = e.clientY;
    } else {
        // For drawing, store position relative to canvas
        const rect = this.canvas.getBoundingClientRect();
        this.startX = e.clientX - rect.left;
        this.startY = e.clientY - rect.top;
    }
}
        mouseUpHandler = (e: MouseEvent) => {

            this.clicked = false;
            // const rect = this.canvas.getBoundingClientRect();
            // const mouseX = e.clientX - rect.left;
            // const mouseY = e.clientY - rect.top;
            const width = (e.clientX - this.startX) / this.scale;
            const height = (e.clientY - this.startY)/this.scale;
            const  selectedTool = this.selectedTool;
             let shape: Shape | null = null;
            if (selectedTool === "rect") {
            shape = {
                type: "rect",
                x: (this.startX - this.panX) / this.scale,
                y: (this.startY - this.panY) / this.scale,
                height,
                width
            }
        } else if (selectedTool === "circle") {
            const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;
            shape = {
                type: "circle",
                radius: radius,
                centerX: ((this.startX - this.panX) / this.scale) + radius,
                centerY: ((this.startY - this.panY) / this.scale) + radius,
            }
        } else if (selectedTool === "pencil") {
            shape = {
                type: "pencil",
                startX: (this.startX - this.panX) / this.scale,
                startY: (this.startY - this.panY) / this.scale,
                endX: (e.clientX - this.panX) / this.scale,
                endY: (e.clientY - this.panY) / this.scale,
            }
        } else if (selectedTool === "panTool"){
            // Panning is handled in mouseMoveHandler, nothing to do here
            return;
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
                const selectedTool = this.selectedTool;

                // Handle panning
                if (selectedTool === "panTool") {
                    const dx = e.clientX - this.startX;
                    const dy = e.clientY - this.startY;
                    this.panX += dx;
                    this.panY += dy;
                    this.startX = e.clientX;
                    this.startY = e.clientY;
                    this.clearCanvas();
                    return;
                }

                const rect = this.canvas.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;

                // Convert screen coordinates to canvas space
                const canvasStartX = (this.startX - this.panX) / this.scale;
                const canvasStartY = (this.startY - this.panY) / this.scale;
                const canvasMouseX = (mouseX - this.panX) / this.scale;
                const canvasMouseY = (mouseY - this.panY) / this.scale;
                const width = canvasMouseX - canvasStartX;
                const height = canvasMouseY - canvasStartY;

            this.clearCanvas();
               this.ctx.strokeStyle = "rgba(0, 0, 0)";
              if(selectedTool === "rect") {
                this.ctx.strokeRect(canvasStartX, canvasStartY, width, height);
              } else if(selectedTool === "circle") {
                const radius = Math.max(Math.abs(width),Math.abs(height)) /2;
                const centerX = canvasStartX + width / 2;
                const centerY = canvasStartY + height /2;
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

        // Pinch-to-zoom (trackpad) or Ctrl+scroll (mouse)
        if (e.ctrlKey) {
            const scaleAmount = -e.deltaY / 500;
            const newScale = this.scale * (1 + scaleAmount);

            const mouseX = e.clientX - this.canvas.offsetLeft;
            const mouseY = e.clientY - this.canvas.offsetTop;

            const canvasMouseX = (mouseX - this.panX) / this.scale;
            const canvasMouseY = (mouseY - this.panY) / this.scale;

            this.panX -= (canvasMouseX * newScale - canvasMouseX * this.scale);
            this.panY -= (canvasMouseY * newScale - canvasMouseY * this.scale);

            this.scale = newScale;
        } else if (e.shiftKey) {
            // Shift + scroll for horizontal pan
            this.panX -= e.deltaY;
        } else {
            // Normal scroll for panning
            this.panX -= e.deltaX;
            this.panY -= e.deltaY;
        }

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
    this.canvas.addEventListener("wheel", this.mouseWheelHandler);
}


    // }
}