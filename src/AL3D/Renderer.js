/**
 * Namespace where live all classes and function to manipulate 3D world.
 *
 * @namespace
 */
var AL3D = {
  version : "0.3 {Angel Luis 3D Library}",
  license: "The MIT License (MIT) \
    \
    Copyright (c) <year> <copyright holders> \
    \
    Permission is hereby granted, free of charge, to any person obtaining a copy \
    of this software and associated documentation files (the 'Software'), to deal \
    in the Software without restriction, including without limitation the rights \
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell \
    copies of the Software, and to permit persons to whom the Software is \
    furnished to do so, subject to the following conditions: \
    \
    The above copyright notice and this permission notice shall be included in \
    all copies or substantial portions of the Software. \
    \
    THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR \
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, \
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE \
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER \
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, \
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN \
    THE SOFTWARE."
}

/**
 * Class that render the scene.
 *
 * @class
 * @author Ángel Luis Perales Gómez
 *
 * @param {number} width - The width of the viewport.
 * @param {number} height - The height of the viewport.
 */

AL3D.Renderer = function(width, height){
  AL3D.height = this.height = height;
  AL3D.width = this.width = width;
  this.canvas = document.createElement('canvas');
  this.canvas.id     = "3DCanvas";
  this.canvas.width  = width;
  this.canvas.height = height;
  try{
    AL3D.gl = AL3D.Renderer.gl = this.gl = this.canvas.getContext("experimental-webgl" , {preserveDrawingBuffer: true});
  }catch(e){
    return false;
  }
  this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
  this.gl.enable(this.gl.DEPTH_TEST);
  this.gl.depthFunc(this.gl.LEQUAL);
  this.needUpdate = true;

  AL3D.LINEAR = this.gl.LINEAR;
  AL3D.NEAREST = this.gl.NEAREST;
  AL3D.LINEAR_MIPMAP_LINEAR = this.gl.LINEAR_MIPMAP_LINEAR;
  AL3D.NEAREST_MIPMAP_NEAREST = this.gl.NEAREST_MIPMAP_NEAREST;
  AL3D.NEAREST_MIPMAP_LINEAR = this.gl.NEAREST_MIPMAP_LINEAR;
  AL3D.LINEAR_MIPMAP_NEAREST = this.gl.LINEAR_MIPMAP_NEAREST;
  AL3D.CLAMP_TO_EDGE = this.gl.CLAMP_TO_EDGE;
  AL3D.REPEAT = this.gl.REPEAT;
  AL3D.MIRRORED_REPEAT =this.gl.MIRRORED_REPEAT;

  AL3D.TEXTURE_MAG_FILTER = this.gl.TEXTURE_MAG_FILTER;
  AL3D.TEXTURE_MIN_FILTER = this.gl.TEXTURE_MIN_FILTER;

  AL3D.RGBA = this.gl.RGBA;
  AL3D.RGB = this.gl.RGB;
  AL3D.UNSIGNED_BYTE = this.gl.UNSIGNED_BYTE;

  AL3D.TEXTURE_2D = this.gl.TEXTURE_2D;

  AL3D.FlatInterpolation = 0;
  AL3D.PhongInterpolation = 2;
  AL3D.GouraudInterpolation = 1;
  AL3D.ONE_SIDE = 0;
  AL3D.TWO_SIDE = 1;

  this.gl.getExtension("OES_standard_derivatives");
  this.gl.clearDepth(1.0);
  this.gl.viewport(0.0, 0.0, this.canvas.width, this.canvas.height);

  this.postprocessingEffects = [];

  return true;
}

AL3D.Renderer.prototype.constructor = AL3D.Renderer;

AL3D.Renderer.prototype = {
/**
 * Function to add postprocessing effect to the render.
 *
 * @param {number} effect - The effect to add.
 *
 * @see {@link AL3D.SepiaEffect}
 * @see {@link AL3D.GreyScaleEffect}
 * @see {@link AL3D.NegativeEffect}
 * @see {@link AL3D.RadialBlurEffect}
 * @see {@link AL3D.EyeFishEffect}
 * @see {@link AL3D.DreamVisionEffect}
 * @see {@link AL3D.PixelationEffect}
 * @see {@link AL3D.LenEffect}
 * @see {@link AL3D.PosterizationEffect}
 * @see {@link AL3D.NightEffect}
 * @see {@link AL3D.AcidMetalEffect}
 * @see {@link AL3D.ChristmasEffect}
 * @see {@link AL3D.CoolEffect}
 * @see {@link AL3D.FireEffect}
 * @see {@link AL3D.Fire2Effect}
 * @see {@link AL3D.SunsetEffect}
 * @see {@link AL3D.EdgeDetectionEffect}
 * @see {@link AL3D.SharpenEffect}
 * @see {@link AL3D.GaussianBlurEffect}
 */
  addEffect : function(effect){
    if (this.postprocessingEffects.length > 0){
      this.postprocessingEffects[0] = effect;
    }else{
      this.postprocessingEffects.push(effect);
    }
    if (this.postprocessingEffects.length > 0){
      // create an empty texture
      this.textureToRender = this.gl.createTexture();
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.textureToRender);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
      this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.width, this.height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
      this.depthToRender = this.gl.createRenderbuffer();
      this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.depthToRender);
      this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, this.width, this.height);

      // Create a framebuffer and attach the texture.
      this.fb = this.gl.createFramebuffer();
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fb);
      this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.textureToRender, 0);
      this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, this.depthToRender);
      this.gl.bindTexture(this.gl.TEXTURE_2D, null);
      this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);


      this.renderToTexturePlaneVertex = [
            // First triangle:
             1.0,  1.0,
            -1.0,  1.0,
            -1.0, -1.0,
            // Second triangle:
            -1.0, -1.0,
             1.0, -1.0,
             1.0,  1.0
      ];   
      this.renderToTexturePlaneBuffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.renderToTexturePlaneBuffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.renderToTexturePlaneVertex), this.gl.STATIC_DRAW);
      this.gl.enableVertexAttribArray(this.postprocessingEffects[0].shaderProgram._position);

      this.postprocessingEffects[0].width = this.width;
      this.postprocessingEffects[0].height = this.height;
    }
  },
/**
 * Function to clear the effects in the render.
 */
  clearEffects : function(){
    this.postprocessingEffects = [];
  },
  /**
   * Return the canvas that render the scene.
   */
  getDomElement : function (){
    return this.canvas;
  },
  /**
   * Function to order the Mesh to renders for blending mode.
   *
   * @param {Object} scene - The scene to render.
   * @param {Object} camera - The camera uses to render the scene.
   */
  orderForBlending : function (scene, camera){
    alphaMeshes = [];
    opaqueMeshes = [];
    noMeshes = [];

    for (var i = 0; i < scene.getChilds().length; i++){
      var mesh = scene.getChild(i);
      if (mesh instanceof AL3D.Mesh){
        var color = AL3D.Utils.hexIntToRgbNormalized(mesh.material.diffuse);
        if (color.a !== 1.0){
          alphaMeshes.push(mesh);
        }else{
          opaqueMeshes.push(mesh);
        }
      }else{
        noMeshes.push(mesh);
      }
    }
    alphaMeshes.sort(function (meshA, meshB){
      var distA = camera.position.distanceTo(meshA.position);
      var distB = camera.position.distanceTo(meshB.position);
      return distB - distA;
    });
    newOrder = noMeshes.concat(opaqueMeshes.concat(alphaMeshes));
    scene.setChilds(newOrder);
    return opaqueMeshes.length;
  },

  /**
   * Function to render the scene.
   *
   * @param {Object} scene - The scene to render.
   * @param {Object} camera - The camera uses to render the scene.
   */
  render : function(scene, camera){
    if (this.postprocessingEffects.length > 0){
      
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fb);

    } 
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    if (this.needUpdate){
      var lights = [];

      for (var i = 0; i < scene.getChilds().length; i++){
        if (scene.getChild(i) instanceof AL3D.AmbientLight ||
          scene.getChild(i) instanceof AL3D.DirectionalLight ||
          scene.getChild(i) instanceof AL3D.PointLight ||
          scene.getChild(i) instanceof AL3D.SpotLight){
          lights.push(scene.getChild(i));
        }
      }
      scene.ambientLights = [];
      scene.pointLights = [];
      scene.spotLights = [];
      scene.directionalLights = [];
      for (var i = 0; i< lights.length; i++){
        if (lights[i] instanceof AL3D.AmbientLight){
          scene.ambientLights.push(lights[i]);
        }else if (lights[i] instanceof AL3D.DirectionalLight){
          scene.directionalLights.push(lights[i]);
        }else if (lights[i] instanceof AL3D.PointLight){
          scene.pointLights.push(lights[i]);
        }else if (lights[i] instanceof AL3D.SpotLight){
          scene.spotLights.push(lights[i]);
        }
      }
      for (var i = 0; i < scene.getChilds().length; i++){
        if (scene.getChild(i) instanceof AL3D.Mesh){
          if (scene.fog !== undefined){
            scene.getChild(i).fog = scene.fog;
          }
          AL3D.shaderManager.getShader(scene.getChild(i), lights);
        }
      }
      this.needUpdate = false;
    }
    var numbersOfOpaqueMeshes = this.orderForBlending(scene, camera);
    
    if (scene.picker !== undefined){
      if (scene.picker.picking == true){
        scene.picker.doPick(scene.getChilds(), camera, this.width, this.height);
      }
    }
    
    AL3D.gl.enable(AL3D.gl.BLEND);
    AL3D.gl.blendFunc(AL3D.gl.SRC_ALPHA, AL3D.gl.ONE_MINUS_SRC_ALPHA);
    AL3D.gl.enable(AL3D.gl.DEPTH_TEST);
    var meshNumber = -1;
    for (var oi = 0; oi < scene.getChilds().length; oi++){
      var o = scene.getChild(oi);
      
      if (o instanceof AL3D.SkyBox){
        this.gl.useProgram(o.shaderProgram);

        var transform = o.transform;
        var viewMatrix = camera.viewMatrix;
        var projectionMatrix = camera.projectionMatrix;

        var mv = transform.multiply(viewMatrix);
        var mvp = projectionMatrix.multiply(mv);

        this.gl.uniformMatrix4fv(o.shaderProgram._MVP, false,mvp.components);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, o.mesh.vertexBuffer);
        this.gl.vertexAttribPointer(o.shaderProgram._position, 3, this.gl.FLOAT, false, 4*3, 0);
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, o.texture);
        this.gl.uniform1i(o.shaderProgram._sampler, 0);
        o.mesh.prepareToRender();
        if (o.mesh.getIndexes().length != 0){
          this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, o.mesh.indexBuffer);
          this.gl.drawElements(this.gl.TRIANGLES, o.mesh.getIndexes().length, this.gl.UNSIGNED_SHORT, 0);
        }else{
          var l = o.mesh.getVertex().length/3;
          this.gl.drawArrays(this.gl.TRIANGLES, 0, l); 
        }
      }

      // We only render mesh objects
      if (!(o instanceof AL3D.Mesh)){
        continue;
      }
      meshNumber += 1;
      if (meshNumber == numbersOfOpaqueMeshes){
        AL3D.gl.disable(AL3D.gl.DEPTH_TEST);
      }

      this.gl.useProgram(o.shaderProgram);

      // NORMALS BUFFER
      if (o.hasNormals && o.normalBuffer !== undefined){
        AL3D.gl.enableVertexAttribArray(o.shaderProgram._vNormal);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, o.normalBuffer);
        this.gl.vertexAttribPointer(o.shaderProgram._vNormal, 3, this.gl.FLOAT, false, 4*3, 0);
        
      }

      o.prepareToRender();

      // VERTEX BUFFER
      AL3D.gl.enableVertexAttribArray(o.shaderProgram._position);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, o.vertexBuffer);
      this.gl.vertexAttribPointer(o.shaderProgram._position, 3, this.gl.FLOAT, false, 4*3, 0);
      // TEXTURE BUFFER
      if (o.material.video !== undefined){
        this.gl.activeTexture(this.gl.TEXTURE0);
        o.material.texture.updateVideoTexture();
        this.gl.uniform1i(o.shaderProgram._sampler, 0);
        if (o.uvBuffer !== undefined){
          AL3D.gl.enableVertexAttribArray(o.shaderProgram._uv);
          this.gl.bindBuffer(this.gl.ARRAY_BUFFER, o.uvBuffer);
          this.gl.vertexAttribPointer(o.shaderProgram._uv, 2, this.gl.FLOAT, false,4*2,0) ;
          this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        }
      }else if (o.material.texture !== undefined){

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, o.material.texture.texture);
        this.gl.uniform1i(o.shaderProgram._sampler, 0);

        if (o.uvBuffer !== undefined){
          AL3D.gl.enableVertexAttribArray(o.shaderProgram._uv);
          this.gl.bindBuffer(this.gl.ARRAY_BUFFER, o.uvBuffer);
          this.gl.vertexAttribPointer(o.shaderProgram._uv, 2, this.gl.FLOAT, false,4*2,0) ;
          this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        }
      }

      if (o.material.specularMap !== undefined){
        this.gl.activeTexture(this.gl.TEXTURE1);
        this.gl.bindTexture(this.gl.TEXTURE_2D, o.material.specularMap.texture);
        this.gl.uniform1i(o.shaderProgram._uSpecularMapSampler, 1);
      }

      if (o.material.normalMap !== undefined){
        this.gl.activeTexture(this.gl.TEXTURE2);
        this.gl.bindTexture(this.gl.TEXTURE_2D, o.material.normalMap.texture);
        this.gl.uniform1i(o.shaderProgram._uNormalMapSampler, 2);
      }

      var transform = o.transform;
      var viewMatrix = camera.viewMatrix;
      var projectionMatrix = camera.projectionMatrix;

      var mv = transform.multiply(viewMatrix);

      var mvp = projectionMatrix.multiply(mv);

      if (o.fog !== undefined){
        this.gl.uniformMatrix4fv(o.shaderProgram._viewModelMatrix, false,mv.components);
        if (o.fog instanceof AL3D.LinearFog){
          this.gl.uniform1f(o.shaderProgram._uStartFog,o.fog.start);
          this.gl.uniform1f(o.shaderProgram._uEndFog,o.fog.end);
        }else if (o.fog instanceof AL3D.ExpFog || o.fog instanceof AL3D.Exp2Fog){
          this.gl.uniform1f(o.shaderProgram._uFogDensity,o.fog.density);
        }
        var c = AL3D.Utils.hexIntToRgbNormalized(o.fog.color);
        AL3D.gl.uniform3fv(o.shaderProgram._uFogColor, new Float32Array([c.r, c.g, c.b]));
      }

      if (o.hasNormals){

        this.gl.uniformMatrix4fv(o.shaderProgram._viewModelMatrix, false,mv.components);
        var normalMatrix = mv.getNormalMatrix(o.scale.equals(new ALMath.Vector3(1,1,1)));
        
        this.gl.uniformMatrix3fv(o.shaderProgram._normalMatrix, false,normalMatrix.components);
      }

      this.gl.uniformMatrix4fv(o.shaderProgram._MVP, false,mvp.components);

      //Uniforms for lights
      // ambient lights
      for (var i = 0; i< scene.ambientLights.length; i++){
        var c = AL3D.Utils.hexIntToRgbNormalized(scene.ambientLights[i].color);
        AL3D.gl.uniform4fv(o.shaderProgram._ambientLights[i].color, new Float32Array([c.r, c.g, c.b, c.a]));
              AL3D.gl.uniform1f(o.shaderProgram._ambientLights[i].intensity, scene.ambientLights[i].intensity );
      }
      // Directional Lights
      for (var i = 0; i< scene.directionalLights.length; i++){
        var c = AL3D.Utils.hexIntToRgbNormalized(scene.directionalLights[i].color);
        AL3D.gl.uniform4fv(o.shaderProgram._directionalLights[i].color, new Float32Array([c.r, c.g, c.b, c.a]));
        AL3D.gl.uniform1f(o.shaderProgram._directionalLights[i].intensity, scene.directionalLights[i].intensity);
        AL3D.gl.uniform3fv(o.shaderProgram._directionalLights[i].position, scene.directionalLights[i].position.getForGL());
              
      }
      // Point Lights
      for (var i = 0; i< scene.pointLights.length; i++){
        var c = AL3D.Utils.hexIntToRgbNormalized(scene.pointLights[i].color);
        AL3D.gl.uniform4fv(o.shaderProgram._pointLights[i].color, new Float32Array([c.r, c.g, c.b, c.a]));
        AL3D.gl.uniform3fv(o.shaderProgram._pointLights[i].position, scene.pointLights[i].position.getForGL());
              AL3D.gl.uniform1f(o.shaderProgram._pointLights[i].intensity, scene.pointLights[i].intensity);
              AL3D.gl.uniform1f(o.shaderProgram._pointLights[i].linearAttenuation, scene.pointLights[i].linearAttenuation);
              AL3D.gl.uniform1f(o.shaderProgram._pointLights[i].quadraticAttenuation, scene.pointLights[i].quadraticAttenuation);
              AL3D.gl.uniform1f(o.shaderProgram._pointLights[i].constantAttenuation, scene.pointLights[i].constantAttenuation);
      }

      for (var i = 0; i< scene.spotLights.length; i++){
        var c = AL3D.Utils.hexIntToRgbNormalized(scene.spotLights[i].color);
        AL3D.gl.uniform4fv(o.shaderProgram._spotLights[i].color, new Float32Array([c.r, c.g, c.b, c.a]));
        AL3D.gl.uniform3fv(o.shaderProgram._spotLights[i].position, scene.spotLights[i].position.getForGL());
              AL3D.gl.uniform1f(o.shaderProgram._spotLights[i].intensity, scene.spotLights[i].intensity);
              AL3D.gl.uniform1f(o.shaderProgram._spotLights[i].linearAttenuation, scene.spotLights[i].linearAttenuation);
              AL3D.gl.uniform1f(o.shaderProgram._spotLights[i].quadraticAttenuation, scene.spotLights[i].quadraticAttenuation);
              AL3D.gl.uniform1f(o.shaderProgram._spotLights[i].constantAttenuation, scene.spotLights[i].constantAttenuation);
              AL3D.gl.uniform3fv(o.shaderProgram._spotLights[i].coneDirection, scene.spotLights[i].direction.getForGL());
              AL3D.gl.uniform1f(o.shaderProgram._spotLights[i].spotCosCutOff, scene.spotLights[i].spotCosCutOff);
              AL3D.gl.uniform1f(o.shaderProgram._spotLights[i].spotExponent, scene.spotLights[i].spotExponent);
      }

      if (o.material instanceof AL3D.LambertMaterial){
        var color = AL3D.Utils.hexIntToRgbNormalized(o.material.diffuse);
        AL3D.gl.uniform4fv(o.shaderProgram._material.diffuseColor, new Float32Array([color.r, color.g, color.b, color.a]));
      }else if (o.material instanceof AL3D.PhongMaterial || o.material instanceof AL3D.BlinnMaterial){
        var color = AL3D.Utils.hexIntToRgbNormalized(o.material.diffuse);
        AL3D.gl.uniform4fv(o.shaderProgram._material.diffuseColor, new Float32Array([color.r, color.g, color.b, color.a]));
        color = AL3D.Utils.hexIntToRgbNormalized(o.material.specular);
        AL3D.gl.uniform4fv(o.shaderProgram._material.specularColor, new Float32Array([color.r, color.g, color.b, color.a]));
        AL3D.gl.uniform1f(o.shaderProgram._material.shininess, o.material.shininess);
      }else if (o.material instanceof AL3D.ToonMaterial){
        this.gl.activeTexture(this.gl.TEXTURE1);
        this.gl.bindTexture(this.gl.TEXTURE_2D, o.material.textureToon.texture);
        this.gl.uniform1i(o.shaderProgram._uSamplerToon, 1);
      }

      if (o.hasOwnProperty("render")){
        o.render();
      }else{

        if (o.getIndexes().length != 0){
          this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, o.indexBuffer);
          this.gl.drawElements(this.gl.TRIANGLES, o.getIndexes().length, this.gl.UNSIGNED_SHORT, 0);
        }else{
          var l = o.getVertex().length/3;
          this.gl.drawArrays(this.gl.TRIANGLES, 0, l); 
        }
      }
    }

    if (this.postprocessingEffects.length > 0){
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

      this.gl.useProgram(this.postprocessingEffects[0].shaderProgram);
      
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.renderToTexturePlaneBuffer);
      this.gl.vertexAttribPointer(this.postprocessingEffects[0].shaderProgram._position, 2, this.gl.FLOAT, false, 0, 0);
      this.gl.activeTexture(this.gl.TEXTURE0);
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.textureToRender);
        
        if (typeof this.postprocessingEffects[0].process === 'function'){
          this.postprocessingEffects[0].process();
      }

      this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }
  },

  /**
   * Function to set the scene to render.
   *
   * @param {Object} scene - The scene to render.
   */
  setScene : function(scene){
    this.scene = scene;
  }
}