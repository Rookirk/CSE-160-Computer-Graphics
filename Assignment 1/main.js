// ClickedPints.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'void main() {\n' +
    '  gl_Position = a_Position;\n' +
    '  gl_PointSize = 10.0;\n' +
    '}\n';

// Fragment shader program
var FSHADER_SOURCE =
    'void main() {\n' +
    '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
    '}\n';

var mouseDragging = false;

function main() {
    // Retrieve HTML elements
    var canvas = document.getElementById('webgl');
    var clearButton = document.getElementById('clearCanvas');
    var squaresButton = document.getElementById('squaresButton');
    var trianglesButton = document.getElementById('trianglesButton');
    var circlesButton = document.getElementById('circlesButton');

    var currBrush = "Triangles";
    var currSize = .1;
    var currSegs = 8;

    // Get the rendering context for WebGL
    var gl = getWebGLContext(canvas, false);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    // // Get the storage location of a_Position
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    // Initialize vertex buffers
    var g_Points = [];
    var vertices = new Float32Array(g_Points);

    initVertexBuffers(gl, g_Points, vertices);

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position'); // multiple times

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0); // multiple times // mess with params for mutliple points

    gl.enableVertexAttribArray(a_Position); // multiple times

    // Register function (event handler) to be called on a mouse press
    // page 359 of textbook
    canvas.onmousedown = function(ev) { mouseDown(ev, gl, canvas, a_Position, g_Points, vertices); }
    canvas.onmouseup = function(ev) { mouseUp(ev); };
    canvas.onmousemove = function(ev){ paint(ev, gl, canvas, a_Position, g_Points, vertices); };

    clearButton.addEventListener('click', function(){
        clearCanvas(gl, g_Points, vertices);
    });

    squaresButton.addEventListener('click', function(){
        switchToSquares();
    });
    trianglesButton.addEventListener('click', function(){
        switchToTriangles();
    });
    circlesButton.addEventListener('click', function(){
        switchToCircles();
    });

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
}

function clearCanvas(gl, g_Points, vertices) {
    gl.clear(gl.COLOR_BUFFER_BIT);

    g_Points.length = 0;
    vertices = new Float32Array([]);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
}

function createShape(coords, centerX, centerY){
    coords.x[0] = centerX - .1;
    coords.y[0] = centerY - .1;

    coords.x[1] = centerX;
    coords.y[1] = centerY + .1;

    coords.x[2] = centerX + .1;
    coords.y[2] = centerY - .1;
}

function initVertexBuffers(gl, g_Points, vertices) {
    var vertexBuffer = gl.createBuffer();
    if(!vertexBuffer){
        console.log('Failed to create the buffer object ');
        return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); // multiple times
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW); // multiple times
}

function mouseDown(ev, gl, canvas, a_Position, g_Points, vertices) {
    var x = ev.clientX, y = ev.clientY;
    var rect = ev.target.getBoundingClientRect();
    // check if the mouse is in the bounds of the canvas
    if(rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
        mouseDragging = true;
        paint(ev, gl, canvas, a_Position, g_Points, vertices);
    }
}

function mouseUp(ev) {
    mouseDragging = false;
}

function paint(ev, gl, canvas, a_Position, g_Points, vertices) {
    if(!mouseDragging) return;
    var cX = ev.clientX; // x coordinate of a mouse pointer
    var cY = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect() ;

    var centerX = ((cX - rect.left) - canvas.width/2)/(canvas.width/2);
    var centerY = (canvas.height/2 - (cY - rect.top))/(canvas.height/2);

    var coords = {x = [], y = []};

    createShape(coords, centerX, centerY);

    // Store the coordinates to g_points array
    for(let i = 0; i < 3; i++){
        g_Points.push(coords.x[i]);
        g_Points.push(coords.y[i]);
    }

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    vertices = new Float32Array(g_Points);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.drawArrays(gl.TRIANGLES, 0, g_Points.length/2);
}

function switchToCircles(){
    currBrush = "Circles";
}

function switchToSquares(){
    currBrush = "Squares";
}

function switchToTriangles(){
    currBrush = "Triangles";
}

// Carry out matrix math, don't hardcode in Javascript for scaling and translating

// x 0 0 0   y
// 0 x 0 0   4
// 0 0 x 0   2
// 0 0 0 x   1

// Only initialize buffer once

// gl.createBuffer

// draw

// together:
// gl.bind
// gl.bufferData

// page 80
// args matter if you want to specify x,y,z, r,g,b
// stride = 12, 4 x 3?
// chapter 5 beginning