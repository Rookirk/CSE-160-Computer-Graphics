// Vertex shader program
const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec2 a_TexCoord;
    attribute vec4 a_NormalCoord;
    attribute vec4 a_Color;

    varying vec4 v_Position;
    varying vec2 v_TexCoord;
    varying vec4 v_NormalCoord;
    varying vec4 v_Color;

    uniform mat4 u_ProjMatrix;
    uniform mat4 u_ViewMatrix;
    uniform mat4 u_ModelMatrix;

    void main() {
        gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;

        v_Position = a_Position;
        v_TexCoord = a_TexCoord;
        v_NormalCoord = a_NormalCoord;
        v_Color = a_Color;
    }`;

/*
    vec4 worldPos = u_ModelMatrix * a_Position;
    vec4 lightVector = vec4(u_SunPosition,1) - worldPos;
*/

// Fragment shader program
const FSHADER_SOURCE = `
    precision mediump float;

    uniform sampler2D u_Sampler;

    varying vec4 v_Position;
    varying vec2 v_TexCoord;
    varying vec4 v_NormalCoord;
    varying vec4 v_Color;

    uniform float u_NormalSwitch;
    uniform float u_LightSwitch;

    uniform vec3 u_SunPosition;
    uniform vec3 u_SunColor;

    uniform vec3 u_CameraPosition;

    float ambientConst = 0.4;
    float diffuseConst = 0.6;
    float specularConst = 0.8;

    void main() {
        float nDotL = max( dot( normalize(-u_SunPosition), normalize( vec3(v_NormalCoord) ) ), 0.0 );

        vec3 ambient = u_SunColor * v_Color.rgb;
        vec3 diffuse = u_SunColor * v_Color.rgb * nDotL;

        vec3 incident = normalize( u_CameraPosition - v_Position.xyz );
        vec3 bisector = normalize( -normalize(u_SunPosition) + incident );
        float nDotB = max( dot( normalize(v_NormalCoord.xyz), bisector ), 0.0 );
        vec3 specular = u_SunColor * vec3(v_Color) * pow( nDotB, 50.0 );

        vec4 normal = u_NormalSwitch * (v_NormalCoord + vec4(1.0,1.0,1.0,1.0)) / 2.0;
        vec4 texture = (1.0 - u_NormalSwitch) * texture2D(u_Sampler, v_TexCoord) * v_Color;
        vec4 lighting = vec4(ambient * ambientConst + diffuse * diffuseConst + specular * specularConst, 1.0);
        
        gl_FragColor = u_LightSwitch * lighting * texture + (1.0 - u_LightSwitch) * texture + normal;
    }`;

const shaderVars = {
    a_Position: -1,
    a_TexCoord: -1,
    a_NormalCoord: -1,
    a_Color: -1,

    u_ProjMatrix: -1,
    u_ViewMatrix: -1,
    u_ModelMatrix: -1,

    u_NormalSwitch: -1,
    u_LightSwitch: -1,

    u_SunPosition: -1,
    u_SunColor: -1,

    u_CameraPosition: -1,

    u_Sampler: -1
};

function assignStorageLocations() {
    // Get the storage location of attributes
    assignAttribLocation('a_Position');
    assignAttribLocation('a_TexCoord');
    assignAttribLocation('a_NormalCoord');
    assignAttribLocation('a_Color');

    // Get the storage location of uniforms
    assignUniformLocation('u_ProjMatrix');
    assignUniformLocation('u_ViewMatrix');
    assignUniformLocation('u_ModelMatrix');

    assignUniformLocation('u_NormalSwitch');
    assignUniformLocation('u_LightSwitch');

    assignUniformLocation('u_SunPosition');
    assignUniformLocation('u_SunColor');

    assignUniformLocation('u_CameraPosition');

    assignUniformLocation('u_Sampler');
}

function assignAttribLocation(attrib){
    shaderVars[attrib] = gl.getAttribLocation(gl.program, attrib);
    if(shaderVars[attrib] < 0){
        console.log('Failed to get the storage location of ' + attrib);
        return;
    }
}

function assignUniformLocation(uniform){
    shaderVars[uniform] = gl.getUniformLocation(gl.program, uniform);
    if(!shaderVars[uniform]){
        console.log('Failed to get the storage location of ' + uniform);
        return;
    }
}

function initVertexBuffers() {
    const vertexBuffer = gl.createBuffer();
    if(!vertexBuffer){
        console.log('Failed to create the buffer object ');
        return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    const FSIZE = Float32Array.BYTES_PER_ELEMENT;
    const totalUnits = FSIZE * 11;

    gl.vertexAttribPointer(shaderVars.a_Position, 3, gl.FLOAT, false, totalUnits, 0);
    gl.enableVertexAttribArray(shaderVars.a_Position);

    gl.vertexAttribPointer(shaderVars.a_TexCoord, 2, gl.FLOAT, false, totalUnits, FSIZE * 3);
    gl.enableVertexAttribArray(shaderVars.a_TexCoord);

    gl.vertexAttribPointer(shaderVars.a_NormalCoord, 3, gl.FLOAT, false, totalUnits, FSIZE * 5);
    gl.enableVertexAttribArray(shaderVars.a_NormalCoord);

    gl.vertexAttribPointer(shaderVars.a_Color, 3, gl.FLOAT, false, totalUnits, FSIZE * 8);
    gl.enableVertexAttribArray(shaderVars.a_Color);
}