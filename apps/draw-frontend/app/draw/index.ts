"use client"

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
export default function draw(canvas: HTMLCanvasElement) {

    let existingShape: Shape[] = [];

      const ctx = canvas.getContext("2d");
      if(!ctx) return;

        ctx.fillStyle = "rgba(0,0,0)";
        ctx.fillRect(0,0, canvas.width, canvas.height);

        let clicked = false;
        let startX = 0;
        let startY = 0;

        canvas.addEventListener("mouseup", (e) => {
            clicked = false;

            existingShape.push({
                type: "rect",
                x: startX,
                y: startY,
                width: e.clientX - startX,
                height: e.clientY - startY

            })

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