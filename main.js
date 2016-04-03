/*=================Creating a canvas=========================*/
var canvas = document.getElementById('myCanvas');
var gl = initWebGL(canvas);

/*========================Shaders============================*/
// Vertex shader source code
var vertCode =
'attribute vec2 coordinates;' + 

'uniform vec2 u_resolution;' + 
'uniform mat3 u_matrix;' +

'uniform vec3 color;' + 
'varying vec3 vColor;' +

'void main(void) {' + 
' vec2 position = (u_matrix * vec3(coordinates, 1)).xy;' +
' vec2 zeroToOne = position / u_resolution;' + 
' vec2 zeroToTwo = zeroToOne * 2.0;' +
' vec2 clipSpace = zeroToTwo - 1.0;' +
' gl_Position = vec4(clipSpace * vec2(1, -1),0.0, 1.0);' +
' vColor = color;' + 
'}';

//Create a vertex shader object
var vertShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertShader, vertCode);
gl.compileShader(vertShader);

//Fragment shader source code
var fragCode =
 'precision mediump float;' + 
 'varying vec3 vColor;' + 
 'void main(void) {' + 
 'gl_FragColor = vec4(vColor, 1.0);' + 
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
var vertex_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
setRectangle(gl, randomInt(300),randomInt(300),randomInt(300),randomInt(300));
gl.bindBuffer(gl.ARRAY_BUFFER, null);


/* ===========Associating shaders to buffer objects============*/

var translation = [100.0, 100.0];
var angleInDegrees = 30;
var scale = [1,1];

var translationMatrix = makeTranslation(translation[0], translation[1]);
var rotationMatrix = makeRotation(angleInDegrees);
var scaleMatrix = makeScale(scale[0], scale[1]);

// Resize canvas (0,0) -> (300,300) 
var resolutionLocation = gl.getUniformLocation(shaderProgram, "u_resolution");
gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

// Multiply the matrices
var matrix  = matrixMultiply(scaleMatrix, rotationMatrix);
matrix = matrixMultiply(matrix, translationMatrix);

// Set the matrix
var matrixLocation = gl.getUniformLocation(shaderProgram, "u_matrix");
gl.uniformMatrix3fv(matrixLocation, false, matrix);

// Set a random color.
var color = gl.getUniformLocation(shaderProgram, "color");
gl.uniform3f(color, Math.random(), Math.random(), Math.random());

// set vertex to coordinates
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
var coord = gl.getAttribLocation(shaderProgram, "coordinates");
gl.enableVertexAttribArray(coord)
gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);

// Create rectangle
//setRectangle(gl, randomInt(300), randomInt(300), randomInt(300), randomInt(300));
setGeometry(gl);

/*=================Drawing the triangle and transforming it========================*/

// Clear the canvas (default background color)
gl.clearColor(0, 1, 1, 0.9);

// Enable the depth test
gl.enable(gl.DEPTH_TEST); 

// Clear the color buffer bit
gl.clear(gl.COLOR_BUFFER_BIT);

// Set the view port
gl.viewport(0,0,canvas.width,canvas.height);

// Draw the triangle
//gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
gl.drawArrays(gl.TRIANGLES, 0, 18);


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

function setGeometry(gl){
	gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
          // left column
          0, 0,
          30, 0,
          0, 150,
          0, 150,
          30, 0,
          30, 150,
 
          // top rung
          30, 0,
          100, 0,
          30, 30,
          30, 30,
          100, 0,
          100, 30,
 
          // middle rung
          30, 60,
          67, 60,
          30, 90,
          30, 90,
          67, 60,
          67, 90]),
      gl.STATIC_DRAW);
}

function makeTranslation(tx, ty){
	return [
		1, 0, 0,
		0, 1, 0,
		tx, ty, 1];
}

function makeRotation(angleInDegrees){
	var angleInRadians = angleInDegrees * Math.PI / 180;
	var c = Math.cos(angleInRadians);
	var s = Math.sin(angleInRadians);
	return [
		c, -s, 0,
		s, c, 0,
		0, 0, 1];
}

function makeScale(sx, sy){
	return [
		sx, 0, 0,
		0, sy, 0,
		0, 0, 1];
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
  var a00 = a[0*3+0];
  var a01 = a[0*3+1];
  var a02 = a[0*3+2];
  var a10 = a[1*3+0];
  var a11 = a[1*3+1];
  var a12 = a[1*3+2];
  var a20 = a[2*3+0];
  var a21 = a[2*3+1];
  var a22 = a[2*3+2];
  var b00 = b[0*3+0];
  var b01 = b[0*3+1];
  var b02 = b[0*3+2];
  var b10 = b[1*3+0];
  var b11 = b[1*3+1];
  var b12 = b[1*3+2];
  var b20 = b[2*3+0];
  var b21 = b[2*3+1];
  var b22 = b[2*3+2];
  return [a00 * b00 + a01 * b10 + a02 * b20,
          a00 * b01 + a01 * b11 + a02 * b21,
          a00 * b02 + a01 * b12 + a02 * b22,
          a10 * b00 + a11 * b10 + a12 * b20,
          a10 * b01 + a11 * b11 + a12 * b21,
          a10 * b02 + a11 * b12 + a12 * b22,
          a20 * b00 + a21 * b10 + a22 * b20,
          a20 * b01 + a21 * b11 + a22 * b21,
          a20 * b02 + a21 * b12 + a22 * b22];
}

// Returns a random integer from 0 to range - 1.
function randomInt(range) {
  return Math.floor(Math.random() * range);
}