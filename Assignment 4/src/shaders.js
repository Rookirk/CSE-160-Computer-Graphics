// Vertex shader program
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec2 a_TexCoord;
    attribute vec4 a_NormalCoord;
    attribute vec4 a_Color;

    uniform mat4 u_ProjMatrix;
    uniform mat4 u_ViewMatrix;
    uniform mat4 u_ModelMatrix;

    uniform float u_NormalSwitch;

    uniform vec4 u_SunPosition;

    varying vec2 v_TexCoord;
    varying vec4 v_NormalCoord;
    varying vec4 v_Color;
    varying float v_NormalSwitch;
    varying vec4 v_SunPosition;
    varying float v_Lighting;

    void main() {
        gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;

        v_Lighting = dot( normalize(u_SunPosition), normalize(a_NormalCoord) );

        v_TexCoord = a_TexCoord;
        v_NormalCoord = a_NormalCoord;
        v_Color = a_Color;
        v_NormalSwitch = u_NormalSwitch;
        v_SunPosition = u_SunPosition;
    }`;

// Fragment shader program
var FSHADER_SOURCE = `
    precision mediump float;

    uniform sampler2D u_Sampler;

    varying vec2 v_TexCoord;
    varying vec4 v_NormalCoord;
    varying vec4 v_Color;
    varying float v_NormalSwitch;
    varying vec4 v_SunPosition;
    varying float v_Lighting;

    void main() {
        gl_FragColor = v_Lighting * texture2D(u_Sampler, v_TexCoord) * v_Color * (1.0 - v_NormalSwitch) + v_NormalCoord * v_NormalSwitch;
    }`;

var shaderVars = {
    a_Position: -1,
    a_TexCoord: -1,
    a_NormalCoord: -1,
    a_Color: -1,

    u_ProjMatrix: -1,
    u_ViewMatrix: -1,
    u_ModelMatrix: -1,

    u_NormalSwitch: -1,
    u_SunPosition: -1,

    u_Sampler: -1
};