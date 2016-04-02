/*=================Creating a canvas=========================*/
var canvas = document.getElementById('myCanvas');
var gl = initWebGL(canvas);

/*========================Shaders============================*/
// Vertex shader source code
var vertCode =
'attribute vec2 coordinates;' + 
'uniform vec2 u_resolution;' + 
'uniform vec3 color;' + 
'varying vec3 vColor;' +
'void main(void) {' + 
' vec2 zeroToOne = coordinates / u_resolution;' + 
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

// Resize canvas (0,0) -> (300,300) 
var resolutionLocation = gl.getUniformLocation(shaderProgram, "u_resolution");
gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

// Set a random color.
var color = gl.getUniformLocation(shaderProgram, "color");
gl.uniform3f(color, Math.random(), Math.random(), Math.random());

// set vertex to coordinates
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
var coord = gl.getAttribLocation(shaderProgram, "coordinates");
gl.enableVertexAttribArray(coord)
gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);

// Create rectangle
setRectangle(gl, randomInt(300), randomInt(300), randomInt(300), randomInt(300));

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
gl.drawArrays(gl.TRIANGLES, 0, 6);


/*=================GEOMETRY========================*/
// Returns a random integer from 0 to range - 1.
function randomInt(range) {
  return Math.floor(Math.random() * range);
}
 

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