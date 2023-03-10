import { Entity } from "./3d.js"

let canvas = document.querySelector("#canvas") as HTMLCanvasElement;
let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
let width = canvas.width = 400;
let height = canvas.height = 400;
ctx.translate(width / 2, height / 2);

let angleX: number = 0;
let angleY: number = 0;

let offset = { x: 0, y: 0, z: 3 };
let offset2 = { x: -2, y: 0, z: 3.5 };


let cube = new Entity(ctx, "cube");
// let cube2 = new Entity(ctx, "cube");

function draw() {
    ctx.fillStyle = "#000000";
    ctx.fillRect(-width / 2, -height / 2, width, height);
    ctx.fillStyle = "#FF0000";

    cube.updateVertices(angleY, angleX, offset);
    cube.connectVertices();

    // cube2.updateVertices(angleY, angleX, offset2);
    // cube2.connectVertices();

}

document.addEventListener("keydown", (e) => {
    if (e.key === "w")
        offset.y -= 0.3
    if (e.key === "s")
        offset.y += 0.3
    if (e.key === "a")
        offset.x -= 0.3
    if (e.key === "d")
        offset.x += 0.3
    draw();
})

let dx = 0;
let dy = 0;
let lastX = 0;
let lastY = 0;

canvas.addEventListener("mousemove", (e) => {
    dx = e.x - lastX;
    dy = e.y - lastY;
    lastX = e.x;
    lastY = e.y;

    if (e.buttons === 1) {
        angleX = dx / 100;
        angleY = dy / 100;
        draw();
    }
})

canvas.addEventListener("wheel", (e) => {
    if (e.deltaY > 0) {
        offset.z -= 0.3;
    }
    else offset.z += 0.3;
    draw();
})

draw();
