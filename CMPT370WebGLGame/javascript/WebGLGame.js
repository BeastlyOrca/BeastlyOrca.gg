let isFirstPerson = false; // Track if in first-person perspective
let corner = false;
let score = 0;
let hScore = 0;
main();

/************************************
 * MAIN
 ************************************/

function main() {

    console.log("Setting up the canvas");

    // Find the canavas tag in the HTML document
    const canvas = document.querySelector("#exampleCanvas");

    // Initialize the WebGL2 context
    var gl = canvas.getContext("webgl2");
 
    // Only continue if WebGL2 is available and working
    if (gl === null) {
        printError('WebGL 2 not supported by your browser',
            'Check to see you are using a <a href="https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API#WebGL_2_2" class="alert-link">modern browser</a>.');
        return;
    }

    // Create a state for our scene
    var state = {
        camera: {
            position: vec3.fromValues(0.0, 30.0, 15.0),
            center: vec3.fromValues(0.0, 0.0, 0.0),
            up: vec3.fromValues(0.0, 1.0, 0.0),
        },
        lights: [
            {
                position: vec3.fromValues(0.0, 5.0, 5.0),
                colour: vec3.fromValues(1.0, 1.0, 1.0),
                strength: 10.0,
            }
        ],
        // IF ADDING OBJECTS REMEMBER TO GIVE ID'S, ALSO LAST OBJECT NEEDS TO BE THE PLAYER
        objects: [
            {
                model: { // red
                    position: vec3.fromValues(0.0, 0.0, 0.0),
                    rotation: mat4.create(), // Identity matrix
                    scale: vec3.fromValues(1.0, 1.0, 1.0),
                    id: 0,
                },
                programInfo: simpleShader(gl),
                buffers: null,
                texture: null,
                colour: vec4.fromValues(1.0, 0.0, 0.0, 0.2),
            },
            {
                model: { //blue 
                    position: vec3.fromValues(5.5, 0.0, 5.5),
                    rotation: mat4.create(), // Identity matrix
                    scale: vec3.fromValues(1.0, 1.0, 1.0),
                    id: 1,
                },
                programInfo: simpleShader(gl),
                buffers: null,
                texture: null,
                colour: vec4.fromValues(0.0, 0.0, 1.0, 1.0),
            },
            
            {
                model: { // left wall
                    position: vec3.fromValues(-32.0, 5.0, 0.0),
                    rotation: mat4.create(),
                    scale: vec3.fromValues(8.0, 10.0, 30.0),
                    id: 3,
                },
                programInfo: simpleShader(gl),
                buffers: null,
                texture: null,
                colour: vec4.fromValues(0.8, 0.8, 0.2, 1.0),
            },
            {
                model: { // floor
                    position: vec3.fromValues(0.0, -0.0, 0.0),
                    rotation: mat4.create(),
                    scale: vec3.fromValues(50.0, 1.0, 50.0),
                    id: 7,
                },
                programInfo: simpleShader(gl),
                buffers: null,
                texture: null,
                colour: vec4.fromValues(0.68, 0.85, 1.0, 1.0), // Light blue
            },
            {
                model: { // right wall
                    position: vec3.fromValues(30.0, 0.0, 0.0),
                    rotation: mat4.create(),
                    scale: vec3.fromValues(8.0, 2.0, 30.0),
                    id: 4,
                },
                programInfo: simpleShader(gl),
                buffers: null,
                texture: null,
                colour: vec4.fromValues(0.8, 0.2, 0.8, 1.0),
            },
            {
                model: { // bottom wall
                    position: vec3.fromValues(0.0, 4.0, 16.0),
                    rotation: mat4.create(),
                    scale: vec3.fromValues(30.0, 5.0, 1.0),
                    id: 5,
                },
                programInfo: simpleShader(gl),
                buffers: null,
                texture: null,
                colour: vec4.fromValues(0.2, 0.8, 0.8, 1.0),
            },
            {
                model: { // top wall
                    position: vec3.fromValues(0.0, 5.0, -27.0),
                    rotation: mat4.create(),
                    scale: vec3.fromValues(24.2, 10.0, 1.0),
                    id: 2,
                },
                programInfo: simpleShader(gl),
                buffers: null,
                texture: null,
                colour: vec4.fromValues(0.3, 0.1, 0.5, 1.0),
            },
            {
                model: { // this one is the player 
                    position: vec3.fromValues(-5.5, 0.0, -5.5),
                    rotation: mat4.create(), // Identity matrix
                    scale: vec3.fromValues(1.0, 1.0, 1.0),
                    id: 6,
                },
                programInfo: simpleShader(gl),
                buffers: null,
                texture: null,
                colour: vec4.fromValues(0.0, 1.0, 0.0, 1.0),
            },
        ],
        canvas: canvas,
        selectedIndex: 0,
    };

    state.objects.forEach((object) => {
        initQuadBuffers(gl, object);
    });

    console.log(state)
    setupKeypresses(state);

    console.log("Starting rendering loop");
    startRendering(gl, state);
}


/************************************
 * RENDERING CALLS
 ************************************/

function startRendering(gl, state) {
    // A variable for keeping track of time between frames
    var then = 0.0;

    // This function is called when we want to render a frame to the canvas
    function render(now) {
        now *= 0.001; // convert to seconds
        const deltaTime = now - then;
        then = now;

        updateState(deltaTime, state);

        // Draw our scene
        drawScene(gl, state);

        // Request another frame when this one is done
        requestAnimationFrame(render);
    }

    // Draw the scene
    requestAnimationFrame(render);
}

function updateState(deltaTime, state) {
    state.objects.forEach((object) => {
        if (!object.velocity) {
            // Initialize velocity for the object if not already set
            object.velocity = [
                (Math.random() - 0.5) * 20, // Random velocity along X
                0,                          // No movement along Y
                (Math.random() - 0.5) * 20  // Random velocity along Z
            ];
        }

        // handles movement for red and blue cubes
        if (object.model.id < 2) { 

            // Update the position based on velocity
            object.model.position[0] += object.velocity[0] * deltaTime; // Update X position
            object.model.position[2] += object.velocity[2] * deltaTime; // Update Z position

            // Check for collisions with camera view bounds
            const cameraBounds = {
                left: -21,  //  left bound
                right: 20,  //  right bound
                top: 14,    //  bottom bound THESE ARE REVERSED SO COMMENT NAMES ARE CORRECT, VARIABLES ARE NOT
                bottom: -22 //  top bound   RENAMING THEM BREAKS VELOCITY FOR SOME REASON
            };

            // Bounce off the left or right edges
            if (
                object.model.position[0] <= cameraBounds.left ||
                object.model.position[0] >= cameraBounds.right
            ) {
                object.velocity[0] *= -1.3; // Invert X velocity
                if (object.velocity[0]>=5)
                    object.velocity[0] = 30
                else if (object.velocity[0] <= -5)
                    object.velocity[0] = -30
            }

            // Bounce off the top or bottom edges
            if (
                object.model.position[2] <= cameraBounds.bottom ||
                object.model.position[2] >= cameraBounds.top
            ) {
                object.velocity[2] *= -1.3; // Invert Z velocity
                if (object.velocity[2]>=5)
                    object.velocity[2] = 30
                else if (object.velocity[2] <= -5)
                    object.velocity[2] = -30
            }
            
            //console.log(state.objects[6].model.position)
            // 1 is player 6 is blue 7 is red
            // check collision
            if (((state.objects[6].model.position[0] - 2) <= state.objects[1].model.position[0] &&
                (state.objects[1].model.position[0] - 2) <= state.objects[6].model.position[0]) &&
                ((state.objects[6].model.position[2] - 2) <= state.objects[1].model.position[2] &&
                (state.objects[1].model.position[2] - 2) <= state.objects[6].model.position[2])) {
                    Reset(state)
            }
            if (((state.objects[7].model.position[0] - 2) <= state.objects[1].model.position[0] &&
                (state.objects[1].model.position[0] - 2) <= state.objects[7].model.position[0]) &&
                ((state.objects[7].model.position[2] - 2) <= state.objects[1].model.position[2] &&
                (state.objects[1].model.position[2] - 2) <= state.objects[7].model.position[2])) {
                    Reset(state)
            }
        }
        
    });

    //scoring
    score += 1;
    const scoreDisplay = document.getElementById("integerDisplay");
    const hScoreDisplay = document.getElementById("integerDisplay2");
    if (scoreDisplay) {
        scoreDisplay.textContent = `Score: ${score}`;
    }
    if (score >= hScore) {
        hScore = score;
        hScoreDisplay.textContent = `High Score: ${hScore}`;
    }

}


function Reset(state) {
    // Reset positions of specific objects
    state.objects[6].model.position = vec3.fromValues(0.0, 0.0, 0.0);
    state.objects[7].model.position = vec3.fromValues(5.5, 0.0, 5.5);
    state.objects[1].model.position = vec3.fromValues(-5.5, 0.0, -5.5);

    // Reset to default third-person camera
    isFirstPerson = false;
    state.camera.position = vec3.fromValues(0.0, 30.0, 15.0);
    state.camera.center = vec3.fromValues(0.0, 0.0, 0.0);
    state.camera.up =  vec3.fromValues(0.0, 1.0, 0.0);

    // Assign random velocities to all objects
    state.objects.forEach((object) => {
        object.velocity = [
            (Math.random() - 0.5) * 20, // Random velocity along X
            0,                          // No movement along Y
            (Math.random() - 0.5) * 20  // Random velocity along Z
        ];
    });

    score = 0;
}


function drawScene(gl, state) {

    var xLimit = 10.0;
    // Set clear colour
    // This is a Red-Green-Blue-Alpha colour
    // See https://en.wikipedia.org/wiki/RGB_color_model
    // Here we use floating point values. In other places you may see byte representation (0-255).
    gl.clearColor(0.55686, 0.54902, 0.52157, 1.0);
    

    // Depth testing allows WebGL to figure out what order to draw our objects such that the look natural.
    // We want to draw far objects first, and then draw nearer objects on top of those to obscure them.
    // To determine the order to draw, WebGL can test the Z value of the objects.
    // The z-axis goes out of the screen

    // TODO add correct settings for drawing transparent objects
    // turn off depth mask and enable blending
    gl.depthMask(false);
    gl.enable(gl.BLEND);
    //gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.blendFunc(gl.ONE_MINUS_CONSTANT_ALPHA,gl.ONE_MINUS_SRC_ALPHA);



    // TODO Clear the color and depth buffer with specified clear colour.
    // This will replace everything that was in the previous frame with the clear colour.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    

    var sortedObjects = state.objects.sort((a, b) => {
        // TODO: Add an object comparison function
        
        // Compute the distance of a and b from the cam
        var distA = a.model.id;
        var distB = b.model.id;

        // return (A first wasnt working)
        return distB - distA;
    });

    sortedObjects.forEach((object) => {
        // Choose to use our shader
        gl.useProgram(object.programInfo.program);

            // Update uniforms
        {
            var projectionMatrix = mat4.create();
            var fovy = 60.0 * Math.PI / 180.0; // Vertical field of view in radians
            var aspect = state.canvas.clientWidth / state.canvas.clientHeight; // Aspect ratio of the canvas
            var near = 0.1; // Near clipping plane
            var far = 100.0; // Far clipping plane
            // Generate the projection matrix using perspective
            mat4.perspective(projectionMatrix, fovy, aspect, near, far);

            gl.uniformMatrix4fv(object.programInfo.uniformLocations.projection, false, projectionMatrix);
        
            var viewMatrix = mat4.create();
            mat4.lookAt(
                viewMatrix,
                state.camera.position,
                state.camera.center,
                state.camera.up,
            );
            gl.uniformMatrix4fv(object.programInfo.uniformLocations.view, false, viewMatrix);


            
            
            var modelMatrix = mat4.create();
            mat4.translate(modelMatrix, modelMatrix, object.model.position);
            mat4.mul(modelMatrix, modelMatrix, object.model.rotation);
            mat4.scale(modelMatrix, modelMatrix, object.model.scale);
            gl.uniformMatrix4fv(object.programInfo.uniformLocations.model, false, modelMatrix);

            gl.uniform4fv(object.programInfo.uniformLocations.colour, object.colour);

            
        }

        // Draw 
        {
            // Bind the buffer we want to draw
            gl.bindVertexArray(object.buffers.vao);

            // Draw the object
            const offset = 0; // Number of elements to skip before starting
            gl.drawElements(gl.TRIANGLES, object.buffers.numVertices, gl.UNSIGNED_SHORT, offset);
        }

    });
}


/************************************
 * UI EVENTS
 ************************************/
function setupKeypresses(state) {
    const keysPressed = {};
    

    document.addEventListener("keydown", (event) => {
        console.log(event.code);

        const player = state.objects[1]// Find player object

        keysPressed[event.code] = true;

        // Toggle first-person perspective
        if (event.code === "KeyP") {
            isFirstPerson = !isFirstPerson;
            if (isFirstPerson) {
                // Align camera with player in first-person mode
                state.camera.position = vec3.clone(player.model.position);
                state.camera.position[1] += 2.5; // Offset to simulate head height
                state.camera.center = vec3.add(
                    vec3.create(),
                    player.model.position,
                    vec3.fromValues(0, 0, -1) // Look forward
                );
                // Look slightly upward
                state.camera.center = vec3.add(vec3.create(), player.model.position,vec3.fromValues(0, 1.8, -1)); // Tilt camera upward (increase Y component)
            } else {
                // Reset to default third-person camera
                state.camera.position = vec3.fromValues(0.0, 30.0, 15.0);
                state.camera.center = vec3.fromValues(0.0, 0.0, 0.0);
                state.camera.up =  vec3.fromValues(0.0, 1.0, 0.0);
            }
        }

         // Toggle corner
         if (event.code === "KeyQ") {
            corner = !corner;
            isFirstPerson = !isFirstPerson
            if (corner) {
                state.camera.position = vec3.fromValues(15.0, 15.0, 15.0);
                state.camera.center = vec3.fromValues(0.0, 0.0, 0.0);
                state.camera.up =  vec3.fromValues(0.0, 1.0, 0.0);
            } else {
                // Reset to default third-person camera
                state.camera.position = vec3.fromValues(0.0, 30.0, 15.0);
                state.camera.center = vec3.fromValues(0.0, 0.0, 0.0);
                state.camera.up =  vec3.fromValues(0.0, 1.0, 0.0);
            }
        }

        // Movement in first-person mode
        if (isFirstPerson) {
            const forward = vec3.fromValues(0, 0, -0.4); // Movement forward vector
            const right = vec3.fromValues(0.4, 0, 0);    // Movement right vector

            if (keysPressed["KeyW"]) {
                vec3.add(state.camera.position, state.camera.position, forward);
                vec3.add(state.camera.center, state.camera.center, forward);
            }
            if (keysPressed["KeyS"]) {
                vec3.sub(state.camera.position, state.camera.position, forward);
                vec3.sub(state.camera.center, state.camera.center, forward);
            }
            if (keysPressed["KeyA"]) {
                vec3.sub(state.camera.position, state.camera.position, right);
                vec3.sub(state.camera.center, state.camera.center, right);
            }
            if (keysPressed["KeyD"]) {
                vec3.add(state.camera.position, state.camera.position, right);
                vec3.add(state.camera.center, state.camera.center, right);
            }
        }

        // Player movement (existing logic)
        const object = state.objects[1];
        if (keysPressed["KeyW"] && keysPressed["KeyA"]) {
            vec3.add(object.model.position, object.model.position, vec3.fromValues(-0.4, 0.0, -0.4));
        } else if (keysPressed["KeyW"] && keysPressed["KeyD"]) {
            vec3.add(object.model.position, object.model.position, vec3.fromValues(0.4, 0.0, -0.4));
        } else if (keysPressed["KeyS"] && keysPressed["KeyA"]) {
            vec3.add(object.model.position, object.model.position, vec3.fromValues(-0.4, 0.0, 0.4));
        } else if (keysPressed["KeyS"] && keysPressed["KeyD"]) {
            vec3.add(object.model.position, object.model.position, vec3.fromValues(0.4, 0.0, 0.4));
        } else if (keysPressed["KeyD"]) {
            vec3.add(object.model.position, object.model.position, vec3.fromValues(0.4, 0.0, 0.0));
        } else if (keysPressed["KeyA"]) {
            vec3.add(object.model.position, object.model.position, vec3.fromValues(-0.4, 0.0, 0.0));
        } else if (keysPressed["KeyW"]) {
            vec3.add(object.model.position, object.model.position, vec3.fromValues(0.0, 0.0, -0.4));
        } else if (keysPressed["KeyS"]) {
            vec3.add(object.model.position, object.model.position, vec3.fromValues(0.0, 0.0, 0.4));
        }

        document.addEventListener("keyup", (event) => {
            delete keysPressed[event.code];
        });
    });
}



/************************************
 * SHADER SETUP
 ************************************/

function simpleShader(gl){

    // Vertex shader source code
    const vsSource =
    `#version 300 es
    in vec3 aPosition;

    uniform mat4 uProjectionMatrix;
    uniform mat4 uViewMatrix;
    uniform mat4 uModelMatrix;

    uniform vec4 uColor;

    out vec4 oColor;

    void main() {
        gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aPosition, 1.0);

        oColor = uColor;
    }
    `;

    // Fragment shader source code
    const fsSource =
    `#version 300 es
    precision highp float;

    out vec4 fragColor;

    in vec4 oColor;

    void main() {
        // oColor is a 4D vector 
        // TODO add the alpha value from the oColor to correctly render its transparency
        fragColor = vec4(oColor.rgb, oColor.a);
    }
    `;


    // Create our shader program with our custom function
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    // Collect all the info needed to use the shader program.
    const programInfo = {
        // The actual shader program
        program: shaderProgram,
        // The attribute locations. WebGL will use there to hook up the buffers to the shader program.
        // NOTE: it may be wise to check if these calls fail by seeing that the returned location is not -1.
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aPosition'),
        },
        uniformLocations: {
            projection: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            view: gl.getUniformLocation(shaderProgram, 'uViewMatrix'),
            model: gl.getUniformLocation(shaderProgram, 'uModelMatrix'),
            colour: gl.getUniformLocation(shaderProgram, 'uColor'),
        },
    };

       // Check to see if we found the locations of our uniforms and attributes
    // Typos are a common source of failure
    if (programInfo.attribLocations.vertexPosition === -1 ||
        programInfo.uniformLocations.projection === -1 ||
        programInfo.uniformLocations.view === -1 ||
        programInfo.uniformLocations.model === -1 ||
        programInfo.uniformLocations.color === -1 ) {
        printError('Shader Location Error', 'One or more of the uniform and attribute variables in the shaders could not be located');
    }

    return programInfo;
}


/************************************
 * BUFFER SETUP
 ************************************/

function initQuadBuffers(gl, object) {

     // We have 3 vertices with x, y, and z values
     const positionArray = new Float32Array([
         // Front face
         -1.0, -1.0,  1.0,
         1.0, -1.0,  1.0,
         1.0,  1.0,  1.0,
         -1.0,  1.0,  1.0,
         
         // Back face
         -1.0, -1.0, -1.0,
         -1.0,  1.0, -1.0,
         1.0,  1.0, -1.0,
         1.0, -1.0, -1.0,
         
         // Top face
         -1.0,  1.0, -1.0,
         -1.0,  1.0,  1.0,
         1.0,  1.0,  1.0,
         1.0,  1.0, -1.0,
         
         // Bottom face
         -1.0, -1.0, -1.0,
         1.0, -1.0, -1.0,
         1.0, -1.0,  1.0,
         -1.0, -1.0,  1.0,
         
         // Right face
         1.0, -1.0, -1.0,
         1.0,  1.0, -1.0,
         1.0,  1.0,  1.0,
         1.0, -1.0,  1.0,
         
         // Left face
         -1.0, -1.0, -1.0,
         -1.0, -1.0,  1.0,
         -1.0,  1.0,  1.0,
         -1.0,  1.0, -1.0,
    ]);

    const normalArray = new Float32Array([
        // Front
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,

        // Back
        0.0,  0.0, -1.0,
        0.0,  0.0, -1.0,
        0.0,  0.0, -1.0,
        0.0,  0.0, -1.0,

        // Top
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,

        // Bottom
        0.0, -1.0,  0.0,
        0.0, -1.0,  0.0,
        0.0, -1.0,  0.0,
        0.0, -1.0,  0.0,

        // Right
        1.0,  0.0,  0.0,
        1.0,  0.0,  0.0,
        1.0,  0.0,  0.0,
        1.0,  0.0,  0.0,

        // Left
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0
    ]);

    // We are using gl.UNSIGNED_SHORT to enumerate the indices
    const indicesArray = new Uint16Array([
        0,  1,  2,      0,  2,  3,    // front
        4,  5,  6,      4,  6,  7,    // back
        8,  9,  10,     8,  10, 11,   // top
        12, 13, 14,     12, 14, 15,   // bottom
        16, 17, 18,     16, 18, 19,   // right
        20, 21, 22,     20, 22, 23,   // left
    ]);

    initBuffers(gl, object, positionArray, normalArray, null, null, indicesArray);
}

function initBuffers(gl, object, positionArray, normalArray, colourArray, textureCoordArray, indicesArray) {

    // We have 3 vertices with x, y, and z values
    const positions = new Float32Array(positionArray);

    const normals = new Float32Array(normalArray);

    const colours = new Float32Array(colourArray);

    const textureCoords = new Float32Array(textureCoordArray);

    // We are using gl.UNSIGNED_SHORT to enumerate the indices
    const indices = new Uint16Array(indicesArray);

    // Allocate and assign a Vertex Array Object to our handle
    var vertexArrayObject = gl.createVertexArray();

    // Bind our Vertex Array Object as the current used object
    gl.bindVertexArray(vertexArrayObject);

    object.buffers = {
        vao: vertexArrayObject,
        attributes: {
            position: initPositionAttribute(gl, object.programInfo, positions),
            normal: initNormalAttribute(gl, object.programInfo, normals),
        },
        indices: initIndexBuffer(gl, indices),
        numVertices: indices.length,
    };
}

function initPositionAttribute(gl, programInfo, positionArray) {
    if(positionArray != null && positionArray.length > 0 && programInfo.attribLocations.vertexPosition != null){
        // Create a buffer for the positions.
        const positionBuffer = gl.createBuffer();

        // Select the buffer as the one to apply buffer
        // operations to from here out.
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // Now pass the list of positions into WebGL to build the
        // shape. We do this by creating a Float32Array from the
        // JavaScript array, then use it to fill the current buffer.
        gl.bufferData(
            gl.ARRAY_BUFFER, // The kind of buffer this is
            positionArray, // The data in an Array object
            gl.STATIC_DRAW // We are not going to change this data, so it is static
        );

        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute.
        {
            const numComponents = 3; // pull out 3 values per iteration, ie vec3
            const type = gl.FLOAT; // the data in the buffer is 32bit floats
            const normalize = false; // don't normalize between 0 and 1
            const stride = 0; // how many bytes to get from one set of values to the next
            // Set stride to 0 to use type and numComponents above
            const offset = 0; // how many bytes inside the buffer to start from


            // Set the information WebGL needs to read the buffer properly
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset
            );
            // Tell WebGL to use this attribute
            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexPosition);
        }

        return positionBuffer;
    }
}


function initColourAttribute(gl, programInfo, colourArray) {

    if(colourArray != null && colourArray.length > 0 && programInfo.attribLocations.vertexColour != null) {
        // Create a buffer for the positions.
        const colourBuffer = gl.createBuffer();

        // Select the buffer as the one to apply buffer
        // operations to from here out.
        gl.bindBuffer(gl.ARRAY_BUFFER, colourBuffer);

        // Now pass the list of positions into WebGL to build the
        // shape. We do this by creating a Float32Array from the
        // JavaScript array, then use it to fill the current buffer.
        gl.bufferData(
            gl.ARRAY_BUFFER, // The kind of buffer this is
            colourArray, // The data in an Array object
            gl.STATIC_DRAW // We are not going to change this data, so it is static
        );

        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute.
        {
            const numComponents = 4; // pull out 4 values per iteration, ie vec4
            const type = gl.FLOAT; // the data in the buffer is 32bit floats
            const normalize = false; // don't normalize between 0 and 1
            const stride = 0; // how many bytes to get from one set of values to the next
            // Set stride to 0 to use type and numComponents above
            const offset = 0; // how many bytes inside the buffer to start from

            // Set the information WebGL needs to read the buffer properly
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexColour,
                numComponents,
                type,
                normalize,
                stride,
                offset
            );
            // Tell WebGL to use this attribute
            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexColour);
        }

        return colourBuffer;
    }
}


function initNormalAttribute(gl, programInfo, normalArray) {
    if(normalArray != null && normalArray.length > 0 && programInfo.attribLocations.vertexNormal != null){
        // Create a buffer for the positions.
        const normalBuffer = gl.createBuffer();

        // Select the buffer as the one to apply buffer
        // operations to from here out.
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

        // Now pass the list of positions into WebGL to build the
        // shape. We do this by creating a Float32Array from the
        // JavaScript array, then use it to fill the current buffer.
        gl.bufferData(
            gl.ARRAY_BUFFER, // The kind of buffer this is
            normalArray, // The data in an Array object
            gl.STATIC_DRAW // We are not going to change this data, so it is static
        );

        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute.
        {
            const numComponents = 3; // pull out 4 values per iteration, ie vec3
            const type = gl.FLOAT; // the data in the buffer is 32bit floats
            const normalize = false; // don't normalize between 0 and 1
            const stride = 0; // how many bytes to get from one set of values to the next
            // Set stride to 0 to use type and numComponents above
            const offset = 0; // how many bytes inside the buffer to start from

            // Set the information WebGL needs to read the buffer properly
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexNormal,
                numComponents,
                type,
                normalize,
                stride,
                offset
            );
            // Tell WebGL to use this attribute
            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexNormal);
        }

        return normalBuffer;
    }
}

function initIndexBuffer(gl, elementArray) {

    // Create a buffer for the positions.
    const indexBuffer = gl.createBuffer();

    // Select the buffer as the one to apply buffer
    // operations to from here out.
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    // Now pass the list of positions into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.
    gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER, // The kind of buffer this is
        elementArray, // The data in an Array object
        gl.STATIC_DRAW // We are not going to change this data, so it is static
    );

    return indexBuffer;
}


