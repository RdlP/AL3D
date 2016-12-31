/**
 * Class that can be use to select meshes in the scene.
 *
 * @class
 * @author Ángel Luis Perales Gómez.
 *
 * @param {Object} p - Object that represents the picker.
 * @param {function} p.callback - Callback to execute when mesh is picked.
 */
AL3D.Picker = function(p){
  this.callback = p!==undefined?p.callback:undefined;
  this.vertexShader = ` attribute vec4 aPosition;
                        uniform mat4 uMVP;
                         
                        void main() {
                           gl_Position = uMVP * aPosition;
                        }`;

  this.fragmentShader = ` precision mediump float;
                          uniform vec3 uCode;
                           
                          void main() {
                             gl_FragColor = vec4(uCode.x/255.0, uCode.y/255.0, uCode.z/255.0,1.0);
                          }`;

  this.shaderProgram = AL3D.Utils.compileAndLinkShader(this.vertexShader, this.fragmentShader);

  this.shaderProgram._position = AL3D.Renderer.gl.getAttribLocation(this.shaderProgram, "aPosition");
  AL3D.gl.enableVertexAttribArray(this.shaderProgram._position);
  this.shaderProgram._uMVP =  AL3D.Renderer.gl.getUniformLocation(this.shaderProgram, "uMVP");
  this.shaderProgram._uCode =  AL3D.Renderer.gl.getUniformLocation(this.shaderProgram, "uCode");
  this.gl = AL3D.gl;

  this.textureToRender = this.gl.createTexture();
  this.gl.bindTexture(this.gl.TEXTURE_2D, this.textureToRender);
  this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
  this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
  this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
      
  this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, AL3D.width, AL3D.height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);

  this.depthToRender = this.gl.createRenderbuffer();
  this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.depthToRender);
  this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, AL3D.width, AL3D.height);



  // Create a framebuffer and attach the texture.
  this.fb = this.gl.createFramebuffer();
  this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fb);
  this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.textureToRender, 0);
  this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, this.depthToRender);
  this.gl.bindTexture(this.gl.TEXTURE_2D, null);
  this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);
  this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,null);

}

AL3D.Picker.prototype = {

  /**
   * Set the x and y coordenates and tell the system that must do the pick process.
   *
   * @param {number} x - screen x coordinate.
   * @param {number} y - screen y coordinate.
  */
  pick : function (x,y){
    this.x = x;
    this.y = y;
    this.picking = true;
  },

  /**
   * Do the pick process and call the mesh clickListener or the callback passed to picker constructor.
   *
   * @param {AL3D.Object3D[]} renderObjects - Objects in the scene.
   * @param {AL3D.Camera} camera - Camera to use to render the scene.
   * @param {number} width - Viewport width
   * @param {number} height - Viewport height.
  */
  doPick : function (renderObjects, camera, width, height){
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fb);
    this.gl.useProgram(this.shaderProgram);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    var code = 0;
    for (var i = 0; i < renderObjects.length; i++){
      mesh = renderObjects[i];
      if (!(mesh instanceof AL3D.Mesh)){
        continue;
      }

      if (mesh.pickable == undefined || mesh.pickable == true){
        code +=100;
        mesh.code = code;
        var c = AL3D.Utils.hexIntToRgb(code);
        AL3D.gl.uniform3fv(this.shaderProgram._uCode, new Float32Array([c.r, c.g, c.b]));
      }

      mesh.prepareToRender();

      // VERTEX BUFFER
      AL3D.gl.enableVertexAttribArray(this.shaderProgram._position);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.vertexBuffer);
      this.gl.vertexAttribPointer(this.shaderProgram._position, 3, this.gl.FLOAT, false, 4*3, 0);



      var transform = mesh.transform;
      var viewMatrix = camera.viewMatrix;
      var projectionMatrix = camera.projectionMatrix;

      var mv = transform.multiply(viewMatrix);

      var mvp = projectionMatrix.multiply(mv);

      this.gl.uniformMatrix4fv(this.shaderProgram._uMVP, false,mvp.components);

      if (mesh.hasOwnProperty("render")){
        mesh.render();
      }else{

        if (mesh.getIndexes().length != 0){
          this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
          this.gl.drawElements(this.gl.TRIANGLES, mesh.getIndexes().length, this.gl.UNSIGNED_SHORT, 0);
        }else{
          var l = mesh.getVertex().length/3;
          this.gl.drawArrays(this.gl.TRIANGLES, 0, l); 
        }
      }
    }

    if (this.picking == true){
    var pixels = new Uint8Array(4);

    this.gl.readPixels(this.x, height - this.y, 1, 1, this.gl.RGBA, this.gl.UNSIGNED_BYTE, pixels);
    var color = pixels[0] << 16 | pixels[1] << 8 | pixels[2];
    for (var i=0; i < renderObjects.length; i++){
      mesh = renderObjects[i];
      if (!(mesh instanceof AL3D.Mesh)){
        continue;
      }
       if (mesh.pickable == false){
        continue
      }
      if (mesh.code == color){
        if (typeof this.callback == 'function') { 
          this.callback(mesh);
        } else if (typeof mesh.clickListener == 'function'){
          mesh.clickListener();
        }
      }
    }
  }
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    this.picking = false;

  }
}