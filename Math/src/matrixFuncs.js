class Vertex {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

function printMatrix(matrix) {
    let string = "";
    for(let i = 0; i < 4; i++){
        string += matrix.elements[i].toFixed(2) + " , " +
                  matrix.elements[i+4].toFixed(2) + " , " +
                  matrix.elements[i+8].toFixed(2) + " , " +
                  matrix.elements[i+12].toFixed(2) + " ,\n"
    }
    console.log(string);
}

function printVector(vector) {
    console.log("[ " + vector.elements[0].toFixed(2) + " , " +
                       vector.elements[1].toFixed(2) + " , " +
                       vector.elements[2].toFixed(2) + " ]");
}

function createVector(origin, arrow) {
    return new Vector([
        arrow.elements[0] - origin.elements[0],
        arrow.elements[1] - origin.elements[1],
        arrow.elements[2] - origin.elements[2]
    ]);
}

function transformVertex(vertex, transformMatrix){
    const oldVertex = new Vector3(vertex);
    const newMatrix = new Matrix4();
    newMatrix.set(transformMatrix);
    const returnMatrix = newMatrix.multiplyVector3(oldVertex);

    return [returnMatrix.elements[0],
            returnMatrix.elements[1],
            returnMatrix.elements[2]
    ];
}

function getCrossProduct(vector1, vector2) {
    const vec1 = [
        vector1.elements[0],
        vector1.elements[1],
        vector1.elements[2]
    ];
    const vec2 = [
        vector2.elements[0],
        vector2.elements[1],
        vector2.elements[2]
    ];

    const crossVec = new Vector3([
        vec1[1]*vec2[2] - vec1[2]*vec2[1],
        vec1[2]*vec2[0] - vec1[0]*vec2[2],
        vec1[0]*vec2[1] - vec1[1]*vec2[0]
    ]);

    //crossVec.normalize();

    return crossVec;
}

function getDotProduct(vec1, vec2){
    const vector1 = new Vertex(
        vec1.elements[0],
        vec1.elements[1],
        vec1.elements[2]);
    const vector2 = new Vertex(
        vec2.elements[0],
        vec2.elements[1],
        vec2.elements[2]);

    return (vector1.x * vector2.x) + (vector1.y * vector2.y) + (vector1.z * vector2.z);
}

function getMagnitude(vector){
    const x = vector.elements[0],
          y = vector.elements[1],
          z = vector.elements[2]

    return Math.sqrt( Math.pow(x,2) + Math.pow(y,2) + Math.pow(z,2) );
}

function getTriangleArea(vert1, vert2, vert3){
    const vec1 = createVector(vert1, vert2);
    const vec2 = createVector(vert1, vert3);

    const crossVec = getCrossProduct(vec1, vec2);

    return getMagnitude(crossVec);
}

function linearMap(value, inputLow, inputHigh, outputLow, outputHigh) {
    return outputLow + (outputHigh - outputLow) * (value - inputLow) / (inputHigh - inputLow);
}

function linearInterpolate(){

}

function barycentricInterpolate(){

}