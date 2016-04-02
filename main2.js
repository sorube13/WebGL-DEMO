/*=================Creating a canvas=========================*/
var canvas = document.getElementById('myCanvas');
var gl = initWebGL(canvas);

/*===========Defining and storing the geometry==============*/


//var colors = [ 0,0,0, 0,0,0, 0,0,0,  0,0,0, 0,0,0, 0,0,0, ]

// Create an empty buffer object and store vertex data
var vertex_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
setRectangle(gl, randomInt(300),randomInt(300),randomInt(300),randomInt(300));
//gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);



// Create an empty buffer object and store color data
/*var color_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
*/

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


/* ===========Associating shaders to buffer objects============*/

//Bind vertex buffer object
//gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

//gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);

//Get the attribute location
var coord = gl.getAttribLocation(shaderProgram, "coordinates");
//gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);
//gl.enableVertexAttribArray(coord);

// bind the color buffer
//gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);

// get the attribute location
/*var color = gl.getAttribLocation(shaderProgram, "color");
gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(color);
*/
/*=================1 Drawing the triangle and transforming it========================*/
// Clear the canvas (default background color)
gl.clearColor(0, 1, 1, 0.9);

// Enable the depth test
gl.enable(gl.DEPTH_TEST); 

// Clear the color buffer bit
gl.clear(gl.COLOR_BUFFER_BIT);

// Set the view port
gl.viewport(0,0,canvas.width,canvas.height);

var resolutionLocation = gl.getUniformLocation(shaderProgram, "u_resolution");
gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

var color = gl.getUniformLocation(shaderProgram, "color");

var buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.enableVertexAttribArray(coord)
gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);

// draw 50 random rectangles in random colors
for (var ii = 0; ii < 50; ++ii) {
// Setup a random rectangle
	setRectangle(
	    gl, randomInt(300), randomInt(300), randomInt(300), randomInt(300));

	// Set a random color.
	gl.uniform3f(color, Math.random(), Math.random(), Math.random());

	// Draw the rectangle.
	gl.drawArrays(gl.TRIANGLES, 0, 6);

}

/*=================Drawing the triangle and transforming it========================*/
/*
// Clear the canvas (default background color)
gl.clearColor(1, 0.5, 1, 0.9);

// Enable the depth test
gl.enable(gl.DEPTH_TEST); 

// Clear the color buffer bit
gl.clear(gl.COLOR_BUFFER_BIT);

// Set the view port
gl.viewport(0,0,canvas.width,canvas.height);

// Draw the triangle
//gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
gl.drawArrays(gl.TRIANGLES, 0, 6);
*/
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


