/**
 * Initialices webgl.
 *
 * @param {HTMLElement} canvas The HTML object containing the canvas
 * @return {!WebGLRenderingContext} gl The WebGL Context..
 */
function initWebGL(canvas) {
	var gl = null;
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

/**
 * Creates and compiles a shader.
 *
 * @param {!WebGLRenderingContext} gl The WebGL Context.
 * @param {string} shaderSource The GLSL source code for the shader.
 * @param {number} shaderType The type of shader, VERTEX_SHADER or
 *     FRAGMENT_SHADER.
 * @return {!WebGLShader} The shader.
 */
function compileShader(gl, shaderSource, shaderType){
	// Create shader object
	var shader = gl.createShader(shaderType);

	// Set the shader source code
	gl.shaderSource(shader, shaderSource);

	// Compile the shader
	gl.compileShader(shader);

	// Check if it compiled
	var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	if(!success){
		// Something went wrong during compilation; get the error
		throw "could not compile shader: " + gl.getShaderInfoLog(shader);
	}
	return shader
}

/**
 * Creates a program from 2 shaders.
 *
 * @param {!WebGLRenderingContext) gl The WebGL context.
 * @param {!WebGLShader} vertexShader A vertex shader.
 * @param {!WebGLShader} fragmentShader A fragment shader.
 * @return {!WebGLProgram} A program.
 */
 function createProgram(gl, vertexShader, fragmentShader){
 	var program = gl.createProgram();

 	gl.attachShader(program, vertexShader);
 	gl.attachShader(program, fragmentShader);

 	gl.linkProgram(program);

 	var success = gl.getProgramParameter(program, gl.LINK_STATUS);
 	if (!success){
 		throw ("program failed to link: " + gl.getProgramInfoLog(program));
 	}

 	return program;
 }

 /**
 * Creates a shader from the content of a script tag.
 *
 * @param {!WebGLRenderingContext} gl The WebGL Context.
 * @param {string} scriptId The id of the script tag.
 * @param {string} opt_shaderType. The type of shader to create.
 *     If not passed in will use the type attribute from the
 *     script tag.
 * @return {!WebGLShader} A shader.
 */
 function createShaderFromScript(gl, scriptId, opt_shaderType){
	var shaderScript = document.getElementById(scriptId);
 	if(!shaderScript){
 		throw("*** Error: unknown script element " + scriptId);
 	}

 	var shaderSource = shaderScript.text;

 	if(!opt_shaderType){
 		if(shaderScript.type == "x-shader/x-vertex"){
 			opt_shaderType = gl.VERTEX_SHADER;
 		} else if(shaderScript.type == "x-shader/x-fragment"){
 			opt_shaderType = gl.FRAGMENT_SHADER;
 		} else if(!opt_shaderType){
 			throw("*** Error: shader type not set");
 		}
 	}

 	return compileShader(gl, shaderSource, opt_shaderType);
 }

 /**
 * Creates a program from 2 script tags.
 *
 * @param {!WebGLRenderingContext} gl The WebGL Context.
 * @param {string} vertexShaderId The id of the vertex shader script tag.
 * @param {string} fragmentShaderId The id of the fragment shader script tag.
 * @return {!WebGLProgram} A program
 */
 function createProgramFromScripts(gl, vertexShaderId, fragmentShaderId){
 	var vertexShader = createShaderFromScript(gl, vertexShaderId);
 	var fragmentShader = createShaderFromScript(gl, fragmentShaderId);
 	return createProgram(gl, vertexShader, fragmentShader);
 }
