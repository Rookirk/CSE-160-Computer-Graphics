const defaultDecimalPrecision = 2;

class Vertex {
    constructor(coords) {
        this.x = coords[0];
        this.y = coords[1];
        this.z = coords[2];
    }
}

class VertexColor {
    constructor(coords, color) {
        this.x = coords[0];
        this.y = coords[1];
        this.z = coords[2];

        this.r = color[0];
        this.g = color[1];
        this.b = color[2];
    }
}

function printMatrix(matrix, precision = defaultDecimalPrecision) {
    let string = "";
    for(let i = 0; i < 4; i++){
        string += matrix.elements[i].toFixed(precision) + " , " +
                  matrix.elements[i+4].toFixed(precision) + " , " +
                  matrix.elements[i+8].toFixed(precision) + " , " +
                  matrix.elements[i+12].toFixed(precision) + " ,\n"
    }
    console.log(string);
}

function printVector(vector, precision = defaultDecimalPrecision) {
    console.log("[ " + vector.elements[0].toFixed(precision) + " , " +
                       vector.elements[1].toFixed(precision) + " , " +
                       vector.elements[2].toFixed(precision) + " ]");
}

function printVertex(vertex, precision = defaultDecimalPrecision) {
    console.log("[ " + vertex.x.toFixed(precision) + " , " +
                       vertex.y.toFixed(precision) + " , " +
                       vertex.z.toFixed(precision) + " ]");
}

function printVertexColor(vertex, precision = defaultDecimalPrecision) {
    console.log("coords: [ " + vertex.x.toFixed(precision) + " , " +
                       vertex.y.toFixed(precision) + " , " +
                       vertex.z.toFixed(precision) + " ]\n" +
                "colors: [ " + vertex.r.toFixed(precision) + " , " +
                       vertex.g.toFixed(precision) + " , " +
                       vertex.b.toFixed(precision) + " ]\n");
}

function createVector(origin, arrow) {
    return new Vector3([
        arrow.x - origin.x,
        arrow.y - origin.y,
        arrow.z - origin.z
    ]);
}

function transformVertex(vertex, transformMatrix){
    const oldVertex = new createVector(new Vertex([0,0,0]), vertex);
    const newMatrix = new Matrix4();
    newMatrix.set(transformMatrix);
    const returnMatrix = newMatrix.multiplyVector3(oldVertex);

    return new Vertex([returnMatrix.elements[0],
                       returnMatrix.elements[1],
                       returnMatrix.elements[2]
    ]);
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
    const vector1 = new Vertex([
        vec1.elements[0],
        vec1.elements[1],
        vec1.elements[2]]);
    const vector2 = new Vertex([
        vec2.elements[0],
        vec2.elements[1],
        vec2.elements[2]]);

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

    return getMagnitude(crossVec)/2;
}

function linearMap(value, inputLow, inputHigh, outputLow, outputHigh) {
    return outputLow + (outputHigh - outputLow) * (value - inputLow) / (inputHigh - inputLow);
}

function linearInterpolateVertexColor(vertColor1, vertColor2, targetVert){
    const totalDistance = getMagnitude(createVector(vertColor1, vertColor2));

    const fractionalDistance = getMagnitude(createVector(vertColor1, targetVert));

    const influence = fractionalDistance / totalDistance;

    const r = linearInterpolate( influence, vertColor1.r, vertColor2.r );
    const g = linearInterpolate( influence, vertColor1.g, vertColor2.g );
    const b = linearInterpolate( influence, vertColor1.b, vertColor2.b );

    return new VertexColor([targetVert.x, targetVert.y, targetVert.z], [r,g,b]);
}

function linearInterpolate( influence, value1, value2 ){
    return (1 - influence) * value1 + influence * value2;
}

function barycentricInterpolate(){

}