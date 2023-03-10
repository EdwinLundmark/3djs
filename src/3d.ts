const cubeVertices = [
    [-1, 1, 1, 1],
    [-1, -1, 1, 1],
    [1, 1, 1, 1],
    [1, -1, 1, 1],
    [-1, 1, -1, 1],
    [-1, -1, -1, 1],
    [1, 1, -1, 1],
    [1, -1, -1, 1]
];

const cubeIndices = [
    [0, 2, 3, randCol(), randCol(), randCol()],
    [0, 1, 3, randCol(), randCol(), randCol()],
    [1, 0, 4, randCol(), randCol(), randCol()],
    [1, 5, 4, randCol(), randCol(), randCol()],
    [3, 7, 5, randCol(), randCol(), randCol()],
    [3, 1, 5, randCol(), randCol(), randCol()],
    [7, 3, 2, randCol(), randCol(), randCol()],
    [7, 6, 2, randCol(), randCol(), randCol()],
    [0, 2, 6, randCol(), randCol(), randCol()],
    [0, 4, 6, randCol(), randCol(), randCol()],
    [5, 4, 6, randCol(), randCol(), randCol()],
    [5, 7, 6, randCol(), randCol(), randCol()]
    
];

function randCol(): number {
    let r = Math.floor(Math.random()*255);

    return r
}


const pyramidVertices = [
    [-1,  1, -1, 1],
    [-1,  1,  1, 1],
    [ 1,  1, -1, 1],
    [ 1,  1,  1, 1],
    [ 0, -1,  0, 1]
];

const pyramidIndices = [
    [0, 1, 4, randCol(), randCol(), randCol()],
    [1, 3, 4, randCol(), randCol(), randCol()],
    [2, 3, 4, randCol(), randCol(), randCol()],
    [0, 2, 4, randCol(), randCol(), randCol()],
    [1, 3, 2, randCol(), randCol(), randCol()],
    [1, 0, 2, randCol(), randCol(), randCol()]
];


const scale = 100;

type Offset = {
    x: number,
    y: number,
    z: number,
}

export class Entity {
    vertices: number[][] = [];
    indices: number[][] = [];
    edges: number[][] = [];
    ctx: CanvasRenderingContext2D;
    perspective: number[][];
    
    constructor(ctx: CanvasRenderingContext2D, shape: string) {
	if(shape === "cube") {
	    this.vertices = cubeVertices;
	    this.indices = cubeIndices;
	}
	else if (shape === "pyramid") {
	    this.vertices = pyramidVertices;
	    this.indices = pyramidIndices;
	}

	for (let i = 0; i < this.indices.length; i++) {
	    for (let j = 0; j < this.indices[i].length; j++) {
		let v1 = this.indices[i][j];
		let v2 = this.indices[i][(j + 1) % this.indices[i].length];

		const edge = [v1, v2].sort();
		if (!this.edges.some(existingEdge => existingEdge[0] === edge[0] && existingEdge[1] === edge[1])) {
		    this.edges.push(edge);
		}
	    }
	}
	console.log(this.edges)
	this.ctx = ctx;
	this.perspective = [];
    }

    private applyMatrix(point: Array<number>, type: string, angle?: number, offset?: Offset): Array<number> {
	let applied = new Array(3);
	
	if (typeof angle === 'undefined') angle = 0
	if (typeof offset === 'undefined') offset = { x: 0, y: 0, z: 0 }
	
	const rMatrixY = [
	    [Math.cos(angle), 0, Math.sin(angle), 0],
	    [0, 1, 0, 0],
	    [-Math.sin(angle), 0, Math.cos(angle), 0],
	    [0, 0, 0, 1]
	]
	
	const rMatrixX = [
	    [1, 0, 0, 0],
	    [0, Math.cos(angle), -Math.sin(angle), 0],
	    [0, Math.sin(angle), Math.cos(angle), 0],
	    [0, 0, 0, 1]
	]
	
	const rMatrixZ = [
	    [Math.cos(angle), -Math.sin(angle), 0, 0],
	    [Math.sin(angle), Math.cos(angle), 0, 0],
	    [0, 0, 1, 0],
	    [0, 0, 0, 1]
	]
	
	const tMatrix = [
	    [1, 0, 0, offset.x],
	    [0, 1, 0, offset.y],
	    [0, 0, 1, offset.z],
	    [0, 0, 0, 1],
	    
	]
	
	const FOVdeg = 55;
	const FOV = (FOVdeg * Math.PI) / 180.0;
	const tanHalfFOV = Math.tan(FOV / 2);
	const f = 1 / tanHalfFOV;
	
	const pMatrix = [
	    [f, 0, 0, 0],
	    [0, f, 0, 0],
	    [0, 0, 1, 0],
	    [0, 0, 1, 0]
	]
	
	let matrix: number[][] = [];
	
	switch (type) {
	    case "y":
		matrix = rMatrixY;
		break;
	    case "x":
		matrix = rMatrixX;
		break;
	    case "z":
		matrix = rMatrixZ;
		break;
	    case "t":
		matrix = tMatrix;
		break;
	    case "p":
		matrix = pMatrix;
		break;
	}
	
	for (let i = 0; i < 4; i++) {
	    applied[i] =
		matrix[i][0] * point[0] +
		matrix[i][1] * point[1] +
		matrix[i][2] * point[2] +
		matrix[i][3] * point[3];
	}
	
	for (let i = 0; i < 3; i++) {
	    applied[i] /= applied[3];
	}
	
	return applied;
    }

    public updateVertices(angleY: number, angleX: number, offset: Offset): void {
	this.perspective = [];


	//TODO:
	//Implementera backface culling: https://www.youtube.com/watch?v=h_Aqol0oTs4 runt 22 min
	//Gör så att alla trianglar går medurs.

	// Backface culling:
	// Behöver:
	// Cross product
	// Dot product
	

	
	this.vertices.forEach((vertex, index) => {
	    this.vertices[index] = this.applyMatrix(vertex, "x", angleY);
            this.vertices[index] = this.applyMatrix(this.vertices[index], "y", -angleX);

	    this.perspective.push(vertex);
            this.perspective[this.perspective.length - 1] = this.applyMatrix(this.perspective[this.perspective.length - 1], "t", undefined, offset);
            this.perspective[this.perspective.length - 1] = this.applyMatrix(this.perspective[this.perspective.length - 1], "p");
	})
    }
    
    public connectVertices(): void {
	// this.ctx.strokeStyle = "#FF0000";
	this.ctx.strokeStyle = "rgba(0,0,0,0)";

	// Step 1: Loop through each triangle in pyramidIndices
	const faces = this.indices.map((indices, i) => {
	    // Step 2: Calculate the average z-coordinate
	    const zs = [this.vertices[indices[0]][2] +
		this.vertices[indices[1]][2] +
		this.vertices[indices[2]][2]];

	    const z = zs.sort((a,b) => b - a)[0]
	    
	    // Step 3: Store the average z-coordinate and index of the triangle
	    return { index: i, z };
	});
	
	// Step 4: Sort the array of objects by the average z-coordinate
	faces.sort((a, b) => b.z - a.z);
	
	// Step 5: Extract the sorted indices from the sorted array of objects
	this.indices = faces.map((triangle) => this.indices[triangle.index]);

	// for (let i = 0; i < this.edges.length; i++) {
	//     this.ctx.moveTo(this.perspective[this.edges[i][0]][0]*scale, this.perspective[this.edges[i][0]][1]*scale);
	//     this.ctx.lineTo(this.perspective[this.edges[i][1]][0]*scale, this.perspective[this.edges[i][1]][1]*scale);
	// }

	for (let i = 0; i < this.indices.length; i++) {
	    this.ctx.fillStyle = `rgba(${this.indices[i][3]},${this.indices[i][4]},${this.indices[i][5]},1)`
	    // console.log((this.perspective[this.indices[i][0]][2]))
	    this.ctx.beginPath();

	    this.ctx.moveTo(this.perspective[this.indices[i][0]][0] * scale, this.perspective[this.indices[i][0]][1] * scale)
	    // for (let j = 1;  j < this.indices[i].length; j++) {
	    for (let j = 1;  j < 3; j++) {
		this.ctx.lineTo(this.perspective[this.indices[i][j]][0] * scale, this.perspective[this.indices[i][j]][1] * scale);
	    }
	    this.ctx.lineTo(this.perspective[this.indices[i][0]][0] * scale, this.perspective[this.indices[i][0]][1] * scale)
	    this.ctx.fill();
	}

	
	// this.ctx.stroke();
    }
}
