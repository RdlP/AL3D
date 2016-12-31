/**
 * Class that represents a SkyBox.
 *
 * @class
 * @author Ángel Luis Perales Gómez.
 *
 * @param {Object} p - Object that represent a SkyBox.
 * @param {string[]} p.urls - The sixth textures for the SkyBox (posx,negx,posy,negy,posz,negz).
 */
AL3D.SkyBox = function(p){
  AL3D.Object3D.call(this);
  this.urls = p.urls;
  this.vertexShader = `attribute vec3 aPosition;
              varying vec3 vTexCoord;
              uniform mat4 uMVP;
              void main() {
                vTexCoord = aPosition;
                vec4 pos = uMVP * vec4(aPosition,1.0);
                gl_Position = pos.xyww;}`;

    this.fragmentShader = `precision mediump float;
              varying vec3 vTexCoord;
              uniform samplerCube uSamplerCube;
                void main() {
                gl_FragColor = textureCube(uSamplerCube, vTexCoord);
                }`;

    this.shaderProgram = AL3D.Utils.compileAndLinkShader(this.vertexShader, this.fragmentShader);

  this.shaderProgram._position = AL3D.Renderer.gl.getAttribLocation(this.shaderProgram, "aPosition");
  AL3D.gl.enableVertexAttribArray(this.shaderProgram._position);
  this.shaderProgram._sampler =  AL3D.Renderer.gl.getUniformLocation(this.shaderProgram, "uSamplerCube");
  this.shaderProgram._MVP =  AL3D.Renderer.gl.getUniformLocation(this.shaderProgram, "uMVP");
}

AL3D.SkyBox.prototype = {

  /**
   * Function that load the sixth textures for the SkyBox.
   */
  load : function(){
    var imagesLoaded = 0;
    this.imgs = [];
    var texObject = this;
    for (var i = 0; i < 6; i++) {
      texObject.imgs[i] = new Image();
      texObject.imgs[i].onload = function() {
        imagesLoaded++;
        if (imagesLoaded == 6) {
          AL3D.gl.pixelStorei(AL3D.gl.UNPACK_FLIP_Y_WEBGL, false);
          texObject.texture = AL3D.gl.createTexture();
          AL3D.gl.bindTexture(AL3D.gl.TEXTURE_CUBE_MAP, texObject.texture);
          var targets = [
            AL3D.gl.TEXTURE_CUBE_MAP_POSITIVE_X, AL3D.gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 
            AL3D.gl.TEXTURE_CUBE_MAP_POSITIVE_Y, AL3D.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 
            AL3D.gl.TEXTURE_CUBE_MAP_POSITIVE_Z, AL3D.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z 
          ];

          for (var j = 0; j < 6; j++) {

            AL3D.gl.texImage2D(targets[j], 0,AL3D.gl.RGBA, AL3D.gl.RGBA, AL3D.gl.UNSIGNED_BYTE, texObject.imgs[j]);

            AL3D.gl.texParameteri(AL3D.gl.TEXTURE_CUBE_MAP, AL3D.gl.TEXTURE_WRAP_S, AL3D.gl.CLAMP_TO_EDGE);
            AL3D.gl.texParameteri(AL3D.gl.TEXTURE_CUBE_MAP, AL3D.gl.TEXTURE_WRAP_T, AL3D.gl.CLAMP_TO_EDGE);
          }
          AL3D.gl.generateMipmap(AL3D.gl.TEXTURE_CUBE_MAP);

        }
      }
      texObject.imgs[i].src = texObject.urls[i];
    }
    this.mesh = new AL3D.Mesh.createCube({size: 2, height : 2});
  }
}