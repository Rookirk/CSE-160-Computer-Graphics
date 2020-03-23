function main() {

	bilinearInterpolateColor();
}

// Quiz 2 a
// GIven 3 vertices
// find area of triangle
function areaOfTriangle(){
	const tri1 = new Vertex([1,0,2]);
	const tri2 = new Vertex([1,0,1]);
	const tri3 = new Vertex([-1,0,1]);
	console.log(getTriangleArea(tri1,tri2,tri3));
}

// midterm 4
// Given four points with colors and target, find color of target
function bilinearInterpolateColor(){
	const vertA = new VertexColor([14,21,0],[200,0,0]);
    const vertB = new VertexColor([15,21,0],[40,0,80]);
    const vertC = new VertexColor([14,20,0],[0,200,120]);
    const vertD = new VertexColor([15,20,0],[0,200,240]);

    const vertE = linearInterpolateVertexColor(vertA, vertC, new Vertex([14,20.5,0]));
    const vertF = linearInterpolateVertexColor(vertB, vertD, new Vertex([15,20.5,0]));

    const vertP = linearInterpolateVertexColor(vertE, vertF, new Vertex([14.75,20.5,0]));

    printVertexColor(vertP);
}

// Quiz 2 b
// Given 3 vertices
// Find orthogonal vector
function crossProduct(){
	const tri1 = new Vertex([1,0,2]);
	const tri2 = new Vertex([1,0,1]);
	const tri3 = new Vertex([-1,0,1]);

	const vec1 = createVector(tri1, tri2);
	const vec2 = createVector(tri1, tri3);

	const crossVec = getCrossProduct(vec1, vec2);
	printVector(crossVec);
}

// Quiz 5 b
// Given 2 vectors
// find angle
function normalizedDotProduct(){
	const vec1 = new Vector3([1,3,0]);
	const vec2 = new Vector3([1,2.3,0]);

	vec1.normalize();
	vec2.normalize();

	console.log(getDotProduct(vec1,vec2));
}

// Quiz 6
// Given vector find normal
function normalizeVector(){
	const vec1 = new Vector3([-3,-4,0]);
	printVector(vec1);
	vec1.normalize();
	printVector(vec1);
}

// Quiz 1
// GIven vector
// Find magnitude
function length(){
	const vec1 = new Vector3([12,5,0]);
	console.log(getMagnitude(vec1));
}

// midterm 3
// Given two points with colors and target point Find the color of target
function linearInterpolateColor(){
	const vert1 = new VertexColor([1,5,0],[100,50,100]);
    const vert2 = new VertexColor([5,13,0],[200,100,0]);

    const partA = new Vertex([1.5,6,0]);
    const partB = new Vertex([3,9,0]);
    const partC = new Vertex([4.5,12,0]);

    const resultA = linearInterpolateVertexColor(vert1, vert2, partA);
    printVertexColor(resultA);
    const resultB = linearInterpolateVertexColor(vert1, vert2, partB);
    printVertexColor(resultB);
    const resultC = linearInterpolateVertexColor(vert1, vert2, partC);
    printVertexColor(resultC);
}

// Quiz 4
// Given 2 matrices
// find multiplication result
function matrixMatrixMult(){
	// matrix 1 is on the left
	const elemMatrix1 = new Object();
	elemMatrix1.elements = [
		-1, -1, -3,  0,
		 2,  2,  2,  0,
		-1,  0,  1,  0,
		 0,  0,  0,  1
	];

	const elemMatrix2 = new Object();
	elemMatrix2.elements = [
		-1,  2, -1,  0,
		-1,  2,  0,  0,
		 3,  2,  1,  0,
		 0,  0,  0,  1
	];

	const matrix1 = new Matrix4(elemMatrix1);
	const matrix2 = new Matrix4(elemMatrix2);

	matrix1.multiply(matrix2);
	printMatrix(matrix1);
}

// Quiz 3
// Given matrix and vector
// FInd solution
// On paper, matrix row is equal to on code matrix column
function matrixVectorMult(){
	const elemMatrix = new Object();
	elemMatrix.elements = [
		-1, -1, -3,  0,
		 2,  2,  2,  0,
		-1,  0,  1,  0,
		 0,  0,  0,  1
	];
	const matrix = new Matrix4(elemMatrix);
	const vector = new Vertex([-1, 4, 0]);

	const returnVec = transformVertex(vector, matrix);
	printVertex(returnVec);
}

// midterm 6
// GIven 3 matrices and apoint, transform
function matrixTransform(){
	// matrix transformations

    // T*R*S*V
    // In that order
    const translateMatrix = new Matrix4();
    translateMatrix.setTranslate(0,3,0);

    const rotateMatrix = new Matrix4();
    rotateMatrix.setRotate(90,0,0,1);

    const scaleMatrix = new Matrix4();
    scaleMatrix.setScale(1,2,1);

    const vertex = new Vertex([5,2,0]);

    const transformMatrix = new Matrix4();
    transformMatrix.multiply(translateMatrix);
    transformMatrix.multiply(rotateMatrix);
    transformMatrix.multiply(scaleMatrix);

    const returnVertex = transformVertex(vertex, transformMatrix);
    printVertex(returnVertex);
}

// midterm 7
// Given 3 matrices and 3 points, transform
function matrixTransform2(){
	const matrixA = new Matrix4();
    matrixA.setTranslate(-4,-1,0);

    const matrixB = new Matrix4();
    matrixB.setScale(-1,1.5,0);

    const matrixC = new Matrix4();
    matrixC.setTranslate(3,2,0);

    const vertex1 = new Vertex([6,1,0]);
    const vertex2 = new Vertex([4,1,0]);
    const vertex3 = new Vertex([4,3,0]);

    // transltate -4,-1 first
    // scale -1, 1.5 second
    // translate 3,2 last
    // so reverse order
    const transformMatrix = new Matrix4();
    transformMatrix.set(matrixC);
    transformMatrix.multiply(matrixB);
    transformMatrix.multiply(matrixA);

    const returnVertex1 = transformVertex(vertex1, transformMatrix);
    printVertex(returnVertex1);
    const returnVertex2 = transformVertex(vertex2, transformMatrix);
    printVertex(returnVertex2);
    const returnVertex3 = transformVertex(vertex3, transformMatrix);
    printVertex(returnVertex3);
}