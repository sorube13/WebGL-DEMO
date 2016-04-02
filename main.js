/*=================Creating a canvas=========================*/var canvas = document.getElementById("myCanvas");
var canvas = document.getElementById('myCanvas');
var gl = initWebGL(canvas);

/*===========Defining and storing the geometry==============*/

var vertices = [
	-0.6, 0.1, 0.0,
	0.0, 0.7, 0.0,
	-0.6, 0.7, 0.0,
	0.0, 0.1, 0.0,
];

var colors = [ 0,0,1, 1,0,0, 0,1,0, 1,0,1]

var indices = [0, 1, 2, 1, 0, 3];
/*var vertices = [ -1,-1,-1, 1,-1,-1, 1, 1,-1 ];
var colors = [ 1,1,1, 1,1,1, 1,1,1 ];
var indices = [ 0,1,2 ];*/

// Create an empty buffer object and store vertex data
var vertex_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
//gl.bindBuffer(gl.ARRAY_BUFFER, null);


// Create an empty buffer object and store Index data
var Index_Buffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)
//gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

// Create an empty buffer object and store color data
var color_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);


/*========================Shaders============================*/
// Vertex shader source code
var vertCode =
'attribute vec3 coordinates;' + 
'uniform mat4 Pmatrix;' + 
'uniform mat4 Vmatrix;' + 
'uniform mat4 Mmatrix;' +
'attribute vec3 color;' + 
'varying vec3 vColor;' +
'void main(void) {' + 
' gl_Position = Pmatrix * Vmatrix * Mmatrix * vec4(coordinates, 1.0);' +
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

var Pmatrix = gl.getUniformLocation(shaderProgram, 'Pmatrix');
var Vmatrix = gl.getUniformLocation(shaderProgram, 'Vmatrix');
var Mmatrix = gl.getUniformLocation(shaderProgram, 'Mmatrix');

//Bind vertex buffer object
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

//gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);

//Get the attribute location
var coord = gl.getAttribLocation(shaderProgram, "coordinates");
gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(coord);

// bind the color buffer
gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);

// get the attribute location
var color = gl.getAttribLocation(shaderProgram, "color");
gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(color);


/* ==========MATRIX======================================*/

function get_projection(angle, a, zMin, zMax){
	var ang = Math.tan((angle*.5)*Math.PI/180); 
	/*return [
	   0.5/ang, 0 , 0, 0,
       0, 0.5*a/ang, 0, 0,
       0, 0, -(zMax+zMin)/(zMax-zMin), -1,
       0, 0, (-2*zMax*zMin)/(zMax-zMin), 0
	];*/
	return [
		1, 0, 0, 0,
		0, 1, 0, 0, 
		0, 0, 1, -1,
		0, 0, 0, 1]
}

var proj_matrix = get_projection(40, canvas.width/canvas.height, 1, 100);
var mov_matrix = [1,0,0,0,	0,1,0,0, 0,0,1,0, 0,0,0,1];
var view_matrix = [1,0,0,0,	0,1,0,0, 0,0,1,0, 0,0,0,1];

// translating z
view_matrix[14] = view_matrix[14] - 2; //zoom

/* ==========rotation======================================*/
function rotateZ(m, angle){
	var c = Math.cos(angle);
	var s = Math.sin(angle);
	var mv0 = m[0], mv4 = m[4], mv8 = m[8];

	/*m[0] = c*m[0] - s*m[1];
	m[4] = c*m[4] - s*m[5];
	m[8] = c*m[8] - s*m[9];
	m[1] = c*m[1] + s*mv0;
	m[5] = c*m[5] + s*mv4;
	m[9] = c*m[9] + s*mv8*/

	m[0] = c*m[0] - s*m[2];
	m[4] = c*m[4] - s*m[6];
	m[8] = c*m[8] - s*m[10];
	m[2] = c*m[2] + s*mv0;
	m[6] = c*m[6] + s*mv4;
	m[10] = c*m[10] + s*mv8

}

/* ==========Drawing======================================*/

var time_old = 0;
var animate = function(time){
	var dt = time - time_old;
	rotateZ(mov_matrix, dt*0.002);
	time_old = time;

	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
	gl.clearColor(0.9, 0.5, 0.5, 0.9);
	gl.clearDepth(1.0);
	gl.viewport(0.0, 0.0, canvas.width, canvas.height);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.uniformMatrix4fv(Pmatrix, false, proj_matrix);
	gl.uniformMatrix4fv(Vmatrix, false, view_matrix);
	gl.uniformMatrix4fv(Mmatrix, false, mov_matrix);

	gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
	window.requestAnimationFrame(animate);
}

animate(0);


/* ==========translation======================================*/
/*var Tx = -0.5, Ty = 0.5, Tz = 0.0;
var translation = gl.getUniformLocation(shaderProgram, 'translation');
gl.uniform4f(translation, Tx, Ty, Tz, 0.0);
*/

/* ==========scaling======================================*/
/*var Sx = 0.5, Sy = 1.5, Sz = 1.0;
var xformMatrix = new Float32Array([
	Sx, 	0.0,	0.0,	0.0,
	0.0,	Sy,	    0.0,	0.0,
	0.0,	0.0,	Sz,	    0.0,
	0.0,	0.0,	0.0,	1.0
]);

var u_xformMatrix = gl.getUniformLocation(shaderProgram, 'u_xformMatrix');
gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix);*/

/*=================Drawing the riangle and transforming it========================*/

/*// Clear the canvas (default background color)
gl.clearColor(1, 0.5, 1, 0.9);

// Enable the depth test
gl.enable(gl.DEPTH_TEST); 

// Clear the color buffer bit
gl.clear(gl.COLOR_BUFFER_BIT);

// Set the view port
gl.viewport(0,0,canvas.width,canvas.height);

// Draw the triangle
gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);*/

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
