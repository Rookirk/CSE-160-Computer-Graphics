// ClickedPints.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '  gl_Position = a_Position;\n' +
    '  gl_PointSize = 10.0;\n' +
    '  v_Color = a_Color;\n' +
    '}\n';

// Fragment shader program
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '  gl_FragColor = v_Color;\n' +
    '}\n';

var mouseDragging = false;

function main() {
    // Retrieve HTML elements
    var canvas = document.getElementById('webgl');

    var clearButton = document.getElementById('clearCanvas');

    var brushDisplay = document.getElementById('brushDisplay');

    var squaresButton = document.getElementById('squaresButton');
    var trianglesButton = document.getElementById('trianglesButton');
    var circlesButton = document.getElementById('circlesButton');
    var starsButton = document.getElementById('starsButton');

    var redSlider = document.getElementById('redSlider');
    var greenSlider = document.getElementById('greenSlider');
    var blueSlider = document.getElementById('blueSlider');

    var redDisplay = document.getElementById('redDisplay');
    var greenDisplay = document.getElementById('greenDisplay');
    var blueDisplay = document.getElementById('blueDisplay');

    var rainbowButton = document.getElementById('rainbowButton');
    var rainbowSpeedSlider = document.getElementById('rainbowSpeedSlider');

    var rainbowSpeedDisplay = document.getElementById('rainbowSpeedDisplay');

    var sizeSlider = document.getElementById('sizeSlider');
    var segmentSlider = document.getElementById('segmentSlider');
    var innerRadiusSlider = document.getElementById('innerRadiusSlider');

    var sizeDisplay = document.getElementById('sizeDisplay');
    var segmentDisplay = document.getElementById('segmentDisplay');
    var innerRadiusDisplay = document.getElementById('innerRadiusDisplay');

    var brushSettings = {
        r : 0,
        g : 0,
        b : 0,
        rainbow : false,
        rainbowSpeed : 1,
        rainbowCounter : 0,
        brush : "Triangles",
        size : .1,
        segments : 3,
        innerRadius : .1
    }

    brushSettings.r = Number(redSlider.value);
    brushSettings.g = Number(greenSlider.value);
    brushSettings.b = Number(blueSlider.value);

    brushSettings.rainbowSpeed = Number(rainbowSpeedSlider.value);

    brushSettings.size = Number(sizeSlider.value);
    brushSettings.segments = Number(segmentSlider.value);
    brushSettings.innerRadius = Number(innerRadiusSlider.value);

    brushDisplay.innerHTML = brushSettings.brush;

    redDisplay.innerHTML = (brushSettings.r*255).toFixed(0);
    greenDisplay.innerHTML = (brushSettings.g*255).toFixed(0);
    blueDisplay.innerHTML = (brushSettings.b*255).toFixed(0);

    rainbowSpeedDisplay.innerHTML = brushSettings.rainbowSpeed;

    sizeDisplay.innerHTML = brushSettings.size;
    segmentDisplay.innerHTML = brushSettings.segments;
    innerRadiusDisplay.innerHTML = brushSettings.innerRadius.toFixed(2);

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

    // // Get the storage location of attributes
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }
    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    if (!a_Color) {
        console.log('Failed to get the storage location of a_Color');
        return;
    }

    // Initialize vertex buffers
    var g_Points = [];
    var vertices = new Float32Array(g_Points);

    initVertexBuffers(gl, vertices, a_Position, a_Color);

    // Register function (event handler) to be called on a mouse press
    // page 359 of textbook
    canvas.onmousedown = function(ev) { mouseDown(ev, gl, canvas, a_Position, a_Color, g_Points, vertices, brushSettings); }
    canvas.onmouseup = function(ev) { mouseUp(ev); };
    canvas.onmousemove = function(ev){ paint(ev, gl, canvas, a_Position, a_Color, g_Points, vertices, brushSettings); };

    clearButton.addEventListener('click', function(){
        clearCanvas(gl, g_Points, vertices);
    });

    squaresButton.addEventListener('click', function(){
        brushSettings.brush = "Squares";
        brushDisplay.innerHTML = "Squares";
    });
    trianglesButton.addEventListener('click', function(){
        brushSettings.brush = "Triangles";
        brushDisplay.innerHTML = "Triangles";
    });
    circlesButton.addEventListener('click', function(){
        brushSettings.brush = "Circles";
        brushDisplay.innerHTML = "Circles";
    });
    starsButton.addEventListener('click', function(){
        brushSettings.brush = "Stars";
        brushDisplay.innerHTML = "Stars";
    });

    rainbowButton.addEventListener('click', function(){
        brushSettings.rainbow = !brushSettings.rainbow;
        if(brushSettings.rainbow) rainbowButton.value = "Rainbow: On";
        else rainbowButton.value = "Rainbow: Off";
    });
    rainbowSpeedSlider.oninput = function(ev) {
        brushSettings.rainbowSpeed = Number(rainbowSpeedSlider.value);
        rainbowSpeedDisplay.innerHTML = brushSettings.rainbowSpeed;
    };

    redSlider.oninput = function(ev) {
        brushSettings.r = Number(redSlider.value);
        redDisplay.innerHTML = (brushSettings.r*255).toFixed(0);
    };
    greenSlider.oninput = function(ev) {
        brushSettings.g = Number(greenSlider.value);
        greenDisplay.innerHTML = (brushSettings.g*255).toFixed(0);
    };
    blueSlider.oninput = function(ev) {
        brushSettings.b = Number(blueSlider.value);
        blueDisplay.innerHTML = (brushSettings.b*255).toFixed(0);
    };
    sizeSlider.oninput = function(ev) {
        brushSettings.size = Number(sizeSlider.value);
        sizeDisplay.innerHTML = brushSettings.size.toFixed(2);
    };
    segmentSlider.oninput = function(ev) {
        brushSettings.segments = Number(segmentSlider.value);
        segmentDisplay.innerHTML = brushSettings.segments;
    };
    innerRadiusSlider.oninput = function(ev) {
        brushSettings.innerRadius = Number(innerRadiusSlider.value);
        innerRadiusDisplay.innerHTML = brushSettings.innerRadius.toFixed(2);
    };

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

function createShape(coords, centerX, centerY, brushSettings){
    var brush = brushSettings.brush;
    var size = brushSettings.size;
    var segments = brushSettings.segments;
    var innerRadius = brushSettings.innerRadius;

    var colors = {r:-1,g:-1,b:-1};
    if(brushSettings.rainbow){
        brushSettings.rainbowCounter += brushSettings.rainbowSpeed;
        brushSettings.rainbowCounter = brushSettings.rainbowCounter % 360;
        colors = hsvToRGB(brushSettings.rainbowCounter);
    }
    else{
        colors.r = brushSettings.r;
        colors.g = brushSettings.g;
        colors.b = brushSettings.b;
    }

    switch(brush){
        case "Triangles":
            coords.x[0] = centerX - size;
            coords.y[0] = centerY - size;

            coords.x[1] = centerX;
            coords.y[1] = centerY + size;

            coords.x[2] = centerX + size;
            coords.y[2] = centerY - size;

            for(let j = 0; j < 3; j++){
                coords.r[j] = colors.r;
                coords.g[j] = colors.g;
                coords.b[j] = colors.b;
            }
            break;
        case "Squares":
            coords.x[0] = centerX - size;
            coords.y[0] = centerY - size;

            coords.x[1] = centerX - size;
            coords.y[1] = centerY + size;

            coords.x[2] = centerX + size;
            coords.y[2] = centerY - size;

            coords.x[3] = centerX - size;
            coords.y[3] = centerY + size;

            coords.x[4] = centerX + size;
            coords.y[4] = centerY + size;

            coords.x[5] = centerX + size;
            coords.y[5] = centerY - size;

            for(let j = 0; j < 6; j++){
                coords.r[j] = colors.r;
                coords.g[j] = colors.g;
                coords.b[j] = colors.b;
            }
            break;
        case "Circles":
            var circleRotationTheta = 2*Math.PI/segments;
            for(let i = 0; i < segments*3; i+=3){
                let j = i/3;
                coords.x[i] = centerX + size*Math.cos((j+1)*circleRotationTheta);
                coords.y[i] = centerY + size*Math.sin((j+1)*circleRotationTheta);

                coords.x[i+1] = centerX + size*Math.cos(j*circleRotationTheta);
                coords.y[i+1] = centerY + size*Math.sin(j*circleRotationTheta);

                coords.x[i+2] = centerX;
                coords.y[i+2] = centerY;

                for(let j = i; j < i+3; j++){
                    coords.r[j] = colors.r;
                    coords.g[j] = colors.g;
                    coords.b[j] = colors.b;
                }
            }
            break;
        case "Stars":
            var circleRotationTheta = 2*Math.PI/segments;
            for(let i = 0; i < segments*6; i+=6){
                let j = i/6;
                coords.x[i] = centerX + innerRadius*size*Math.cos((j+.5)*circleRotationTheta + Math.PI/2);
                coords.y[i] = centerY + innerRadius*size*Math.sin((j+.5)*circleRotationTheta + Math.PI/2);

                coords.x[i+1] = centerX + size*Math.cos(j*circleRotationTheta + Math.PI/2);
                coords.y[i+1] = centerY + size*Math.sin(j*circleRotationTheta + Math.PI/2);

                coords.x[i+2] = centerX;
                coords.y[i+2] = centerY;

                coords.x[i+3] = centerX + size*Math.cos((j+1)*circleRotationTheta + Math.PI/2);
                coords.y[i+3] = centerY + size*Math.sin((j+1)*circleRotationTheta + Math.PI/2);

                coords.x[i+4] = centerX + innerRadius*size*Math.cos((j+.5)*circleRotationTheta + Math.PI/2);
                coords.y[i+4] = centerY + innerRadius*size*Math.sin((j+.5)*circleRotationTheta + Math.PI/2);

                coords.x[i+5] = centerX;
                coords.y[i+5] = centerY;

                for(let j = i; j < i+6; j++){
                    coords.r[j] = colors.r;
                    coords.g[j] = colors.g;
                    coords.b[j] = colors.b;
                }
            }
            break;
    }
}

// Algorithm from https://www.rapidtables.com/convert/color/hsv-to-rgb.html
function hsvToRGB(hue) {
    let X = 1 * ( 1 - Math.abs( (hue/60) % 2 - 1) );

    let rgb = {r : -1, g : -1, b : -1};
    if(0 <= hue && hue < 60){
        rgb = {r : 1, g : X, b : 0};
    }
    else if(60 <= hue && hue < 120){
        rgb = {r : X, g : 1, b : 0};
    }
    else if(120 <= hue && hue < 180){
        rgb = {r : 0, g : 1, b : X};
    }
    else if(180 <= hue && hue < 240){
        rgb = {r : 0, g : X, b : 1};
    }
    else if(240 <= hue && hue < 300){
        rgb = {r : X, g : 0, b : 1};
    }
    else if(300 <= hue && hue < 360){
        rgb = {r : 1, g : 0, b : X};
    }

    return rgb;
}

// Code ised from MultiAttributeSize_Interleaved Ch. 5
function initVertexBuffers(gl, vertices, a_Position, a_Color) {
    var vertexBuffer = gl.createBuffer();
    if(!vertexBuffer){
        console.log('Failed to create the buffer object ');
        return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); // multiple times

    var FSIZE = vertices.BYTES_PER_ELEMENT;

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0); // multiple times // mess with params for mutliple points
    gl.enableVertexAttribArray(a_Position); // multiple times

    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
    gl.enableVertexAttribArray(a_Color);
}

function mouseDown(ev, gl, canvas, a_Position, a_Color, g_Points, vertices, brushSettings) {
    var x = ev.clientX, y = ev.clientY;
    var rect = ev.target.getBoundingClientRect();
    // check if the mouse is in the bounds of the canvas
    if(rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
        mouseDragging = true;
        paint(ev, gl, canvas, a_Position, a_Color, g_Points, vertices, brushSettings);
    }
}

function mouseUp(ev) {
    mouseDragging = false;
}

function paint(ev, gl, canvas, a_Position, a_Color, g_Points, vertices, brushSettings) {
    if(!mouseDragging) return;
    var cX = ev.clientX; // x coordinate of a mouse pointer
    var cY = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect() ;

    var centerX = ((cX - rect.left) - canvas.width/2)/(canvas.width/2);
    var centerY = (canvas.height/2 - (cY - rect.top))/(canvas.height/2);

    var coords = {x: [], y: [], r: [], g: [], b: []};

    createShape(coords, centerX, centerY, brushSettings);

    // Store the coordinates to g_points array
    for(let i = 0; i < coords.x.length; i++){
        g_Points.push(coords.x[i]);
        g_Points.push(coords.y[i]);
        g_Points.push(coords.r[i]);
        g_Points.push(coords.g[i]);
        g_Points.push(coords.b[i]);
    }

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    vertices = new Float32Array(g_Points);

    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.drawArrays(gl.TRIANGLES, 0, g_Points.length/5);
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