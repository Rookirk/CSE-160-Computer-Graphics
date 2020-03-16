function main() {
    const matrix = new Matrix4();
    matrix.setRotate(30,0,1,0);
    console.log(matrix);
    printMatrix(matrix);
}