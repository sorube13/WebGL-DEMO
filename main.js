/*=================Creating a canvas=========================*/
var canvas = document.getElementById('myCanvas');
var gl = initWebGL(canvas);

/*========================Shaders============================*/
// Vertex shader source code
var vertCode =
'attribute vec4 coordinates;' + 
'attribute vec4 a_color;' + 
 
'uniform mat4 u_matrix;' +

'varying vec4 vColor;' +

'void main(void) {' + 
' gl_Position = u_matrix * coordinates;'+
' vColor = a_color;' + 
'}';

//Create a vertex shader object
var vertShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertShader, vertCode);
gl.compileShader(vertShader);

//Fragment shader source code
var fragCode =
 'precision mediump float;' + 
 'varying vec4 vColor;' + 
 'void main(void) {' + 
 'gl_FragColor = vColor;' + 
 '}';

// Create fragment shader object
var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragShader, fragCode);
gl.compileShader(fragShader);

// Create a shader program object to store combined shader program
var shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertShader); 
gl.attachShader(shaderProgram, fragShader);
gl.linkProgram(shaderProgram);

// Use the combined shader program object
gl.useProgram(shaderProgram);

/*===========Defining and storing the geometry==============*/


// Create an empty buffer object and store vertex data
/*var vertex_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
setRectangle(gl, randomInt(300),randomInt(300),randomInt(300),randomInt(300));
gl.bindBuffer(gl.ARRAY_BUFFER, null);*/

/* =========== Variables ============*/

var translation = [0, 0, -360];
var rotation = [190, 40, 320];
var scale = [1, 1, 1];
var fieldOfViewRadians = degToRad(60);
var rotationSpeed = 2.0;

var then = 0;

/* ===========Associating shaders to buffer objects============*/

// Set Locations
var matrixLocation = gl.getUniformLocation(shaderProgram, "u_matrix");
var colorLocation = gl.getAttribLocation(shaderProgram, "a_color");
var coordLocation = gl.getAttribLocation(shaderProgram, "coordinates");

// set vertex to coordinates
var vertex_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
gl.enableVertexAttribArray(coordLocation)
gl.vertexAttribPointer(coordLocation, 3, gl.FLOAT, false, 0, 0);

setGeometry(gl);


var color_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
gl.enableVertexAttribArray(colorLocation);
gl.vertexAttribPointer(colorLocation, 3, gl.UNSIGNED_BYTE, true, 0, 0);

setColors(gl);

prepareScene();
requestAnimationFrame(drawScene);

/*=================Drawing scene methods ========================*/
function prepareScene(){
  // Clear the canvas (default background color)
  gl.clearColor(1, 1, 1, 0.9);

  // Enable the depth test
  gl.enable(gl.DEPTH_TEST); 

  // Set the view port
  gl.viewport(0,0,canvas.width,canvas.height);

}
function drawScene(now){
  // Convert to seconds
  now *= 0.001;
  // Subtract the previous time fro the current time
  var deltaTime = now - then;
  // Remember the current time for the next frame
  then = now;

  // Every frame increase the rotation a little
  rotation[1] += rotationSpeed * deltaTime;

  // Clear the color buffer bit
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  var aspect = canvas.clientWidth / canvas.clientHeight;
  var projectionMatrix = makePerspective(fieldOfViewRadians, aspect, 1, 2000);
  var translationMatrix = makeTranslation(translation[0], translation[1], translation[2]);
  var rotationXMatrix = makeXRotation(rotation[0]);
  var rotationYMatrix = makeYRotation(rotation[1]);
  var rotationZMatrix = makeZRotation(rotation[2]);
  var scaleMatrix = makeScale(scale[0], scale[1], scale[2]);



  // var moveOriginMatrix = makeTranslation(-50, -75);
  //var matrix = matrixMultiply(moveOriginMatrix, scaleMatrix);
  var matrix = matrixMultiply(scaleMatrix, rotationZMatrix);
  matrix = matrixMultiply(matrix, rotationYMatrix);
  matrix = matrixMultiply(matrix, rotationXMatrix);
  matrix = matrixMultiply(matrix, translationMatrix);
  matrix = matrixMultiply(matrix, projectionMatrix);

  gl.uniformMatrix4fv(matrixLocation, false, matrix);
  //gl.uniform3f(a_color, Math.random(), Math.random(), Math.random());


  gl.drawArrays(gl.TRIANGLES, 0, 16*6);

  requestAnimationFrame(drawScene);

}

/*=================GEOMETRY========================*/

function setRectangle(gl, x, y, width, height){
  var x1 = x;
  var x2 = x + width;
  var y1 = y;
  var y2 = y + height;
  var z = 0;

  var vertices = [
    x1, y1,
    x2, y1,
    x1, y2,
    x2, y1,
    x2, y2,
    x1, y2,];

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(vertices),
    gl.STATIC_DRAW);
}

// Fill the buffer with the values that define a letter 'F'.
function setGeometry(gl) {
  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
          // left column front
          0,   0,  0,
          0, 150,  0,
          30,   0,  0,
          0, 150,  0,
          30, 150,  0,
          30,   0,  0,

          // top rung front
          30,   0,  0,
          30,  30,  0,
          100,   0,  0,
          30,  30,  0,
          100,  30,  0,
          100,   0,  0,

          // middle rung front
          30,  60,  0,
          30,  90,  0,
          67,  60,  0,
          30,  90,  0,
          67,  90,  0,
          67,  60,  0,

          // left column back
            0,   0,  30,
           30,   0,  30,
            0, 150,  30,
            0, 150,  30,
           30,   0,  30,
           30, 150,  30,

          // top rung back
           30,   0,  30,
          100,   0,  30,
           30,  30,  30,
           30,  30,  30,
          100,   0,  30,
          100,  30,  30,

          // middle rung back
           30,  60,  30,
           67,  60,  30,
           30,  90,  30,
           30,  90,  30,
           67,  60,  30,
           67,  90,  30,

          // top
            0,   0,   0,
          100,   0,   0,
          100,   0,  30,
            0,   0,   0,
          100,   0,  30,
            0,   0,  30,

          // top rung right
          100,   0,   0,
          100,  30,   0,
          100,  30,  30,
          100,   0,   0,
          100,  30,  30,
          100,   0,  30,

          // under top rung
          30,   30,   0,
          30,   30,  30,
          100,  30,  30,
          30,   30,   0,
          100,  30,  30,
          100,  30,   0,

          // between top rung and middle
          30,   30,   0,
          30,   60,  30,
          30,   30,  30,
          30,   30,   0,
          30,   60,   0,
          30,   60,  30,

          // top of middle rung
          30,   60,   0,
          67,   60,  30,
          30,   60,  30,
          30,   60,   0,
          67,   60,   0,
          67,   60,  30,

          // right of middle rung
          67,   60,   0,
          67,   90,  30,
          67,   60,  30,
          67,   60,   0,
          67,   90,   0,
          67,   90,  30,

          // bottom of middle rung.
          30,   90,   0,
          30,   90,  30,
          67,   90,  30,
          30,   90,   0,
          67,   90,  30,
          67,   90,   0,

          // right of bottom
          30,   90,   0,
          30,  150,  30,
          30,   90,  30,
          30,   90,   0,
          30,  150,   0,
          30,  150,  30,

          // bottom
          0,   150,   0,
          0,   150,  30,
          30,  150,  30,
          0,   150,   0,
          30,  150,  30,
          30,  150,   0,

          // left side
          0,   0,   0,
          0,   0,  30,
          0, 150,  30,
          0,   0,   0,
          0, 150,  30,
          0, 150,   0]),
      gl.STATIC_DRAW);
}

// Fill the buffer with colors for the 'F'.
function setColors(gl) {
  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Uint8Array([
          // left column front
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,

          // top rung front
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,

          // middle rung front
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,
        200,  70, 120,

          // left column back
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,

          // top rung back
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,

          // middle rung back
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,

          // top
        70, 200, 210,
        70, 200, 210,
        70, 200, 210,
        70, 200, 210,
        70, 200, 210,
        70, 200, 210,

          // top rung right
        200, 200, 70,
        200, 200, 70,
        200, 200, 70,
        200, 200, 70,
        200, 200, 70,
        200, 200, 70,

          // under top rung
        210, 100, 70,
        210, 100, 70,
        210, 100, 70,
        210, 100, 70,
        210, 100, 70,
        210, 100, 70,

          // between top rung and middle
        210, 160, 70,
        210, 160, 70,
        210, 160, 70,
        210, 160, 70,
        210, 160, 70,
        210, 160, 70,

          // top of middle rung
        70, 180, 210,
        70, 180, 210,
        70, 180, 210,
        70, 180, 210,
        70, 180, 210,
        70, 180, 210,

          // right of middle rung
        100, 70, 210,
        100, 70, 210,
        100, 70, 210,
        100, 70, 210,
        100, 70, 210,
        100, 70, 210,

          // bottom of middle rung.
        76, 210, 100,
        76, 210, 100,
        76, 210, 100,
        76, 210, 100,
        76, 210, 100,
        76, 210, 100,

          // right of bottom
        140, 210, 80,
        140, 210, 80,
        140, 210, 80,
        140, 210, 80,
        140, 210, 80,
        140, 210, 80,

          // bottom
        90, 130, 110,
        90, 130, 110,
        90, 130, 110,
        90, 130, 110,
        90, 130, 110,
        90, 130, 110,

          // left side
        160, 160, 220,
        160, 160, 220,
        160, 160, 220,
        160, 160, 220,
        160, 160, 220,
        160, 160, 220]),
      gl.STATIC_DRAW);
}


function makeTranslation(tx, ty, tz){
  return [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    tx, ty, tz, 1];
}

function makeXRotation(angleInDegrees){
  var angleInRadians = degToRad(angleInDegrees);  var c = Math.cos(angleInRadians);
  var s = Math.sin(angleInRadians);
  return [
    1, 0, 0, 0,
    0, c, -s, 0,
    0, -s, c, 0,
    0, 0, 0, 1];
}

function makeYRotation(angleInDegrees){
  var angleInRadians = degToRad(angleInDegrees);  var c = Math.cos(angleInRadians);
  var s = Math.sin(angleInRadians);
  return [
    c, 0, -s, 0,
      0, 1, 0, 0,
      s, 0, c, 0,
      0, 0, 0, 1];
}

function makeZRotation(angleInDegrees){
  var angleInRadians = degToRad(angleInDegrees);
  var c = Math.cos(angleInRadians);
  var s = Math.sin(angleInRadians);
  return [
      c, s, 0, 0,
      -s, c, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1];
}

function makeScale(sx, sy, sz){
  return [
    sx, 0, 0, 0,
    0, sy, 0, 0,
    0, 0, sz, 0,
    0, 0, 0, 1];
}

/*=================Initialize WebGL ========================*/

function initWebGL(canvas) {
  gl = null;
  try {
    // Try to grab the standard context. If it fails, fallback to experimental.
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  }catch(e) {}
  // If we don't have a GL context, give up now
  if (!gl) {
    alert("Unable to initialize WebGL. Your browser may not support it.");
    gl = null;
  }
  return gl;
}

/*====================== Other tools ================================*/

function matrixMultiply(a, b) {
  var a00 = a[0*4+0];
  var a01 = a[0*4+1];
  var a02 = a[0*4+2];
  var a03 = a[0*4+3];
  var a10 = a[1*4+0];
  var a11 = a[1*4+1];
  var a12 = a[1*4+2];
  var a13 = a[1*4+3];
  var a20 = a[2*4+0];
  var a21 = a[2*4+1];
  var a22 = a[2*4+2];
  var a23 = a[2*4+3];
  var a30 = a[3*4+0];
  var a31 = a[3*4+1];
  var a32 = a[3*4+2];
  var a33 = a[3*4+3];
  var b00 = b[0*4+0];
  var b01 = b[0*4+1];
  var b02 = b[0*4+2];
  var b03 = b[0*4+3];
  var b10 = b[1*4+0];
  var b11 = b[1*4+1];
  var b12 = b[1*4+2];
  var b13 = b[1*4+3];
  var b20 = b[2*4+0];
  var b21 = b[2*4+1];
  var b22 = b[2*4+2];
  var b23 = b[2*4+3];
  var b30 = b[3*4+0];
  var b31 = b[3*4+1];
  var b32 = b[3*4+2];
  var b33 = b[3*4+3];
  return [a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30,
          a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31,
          a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32,
          a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33,
          a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30,
          a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31,
          a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32,
          a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33,
          a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30,
          a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31,
          a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32,
          a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33,
          a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30,
          a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31,
          a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32,
          a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33];
}

// Returns a random integer from 0 to range - 1.
function randomInt(range) {
  return Math.floor(Math.random() * range);
}

function makeIdentity(){
  return [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1];
}

function make2DProjection(width, height, depth){
  // Note: This matrix flips the Y axis so that 0 is at the top
  return [
    2 / width, 0, 0, 0,
    0, -2 / height, 0, 0,
    0, 0, 2 / depth, 0,
    -1, 1, 0, 1];
}

function degToRad(anglesDeg){
  return anglesDeg * Math.PI / 180;
}

function makePerspective(fieldOfViewInRadians, aspect, near, far){
  var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
  var rangeInv = 1.0 / (near - far);

  return [
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (near + far) * rangeInv, -1,
    0, 0, near * far * rangeInv * 2, 0];
}