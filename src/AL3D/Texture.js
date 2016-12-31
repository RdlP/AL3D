/**
 * Class that represents a texture.
 *
 * @class
 * @author Ángel Luis Perales Gómez.
 *
 * @param {Object} p - Object that represents a texture.
 * @param {string} p.url - texture url.
 * @param {number} p.wrapS - TEXTURE_WRAP_S.
 * @param {number} p.wrapT - TEXTURE_WRAP_T
 * @param {number} p.magFilter - TEXTURE_MAG_FILTER.
 * @param {number} p.minFilter - TEXTURE_MIN_FILTER.
 * @param {number} p.format - texture format.
 * @param {number} p.type - texture type.
 * @param {boolean} p.flipY - if the texture must be flipped.
 */
AL3D.Texture = function(p){

  this.url = p.url || "";
  this.wrapS = p.wrapS !== undefined ? p.wrapS : AL3D.CLAMP_TO_EDGE;
  this.wrapT = p.wrapT !== undefined ? p.wrapT : AL3D.CLAMP_TO_EDGE;
  this.loaded = false;

  this.magFilter = p.magFilter !== undefined ? p.magFilter : AL3D.LINEAR;
  this.minFilter = p.minFilter !== undefined ? p.minFilter : AL3D.LINEAR_MIPMAP_LINEAR;

  this.format = p.format !== undefined ? p.format : AL3D.RGBA;
  this.type = p.type !== undefined ? p.type : AL3D.UNSIGNED_BYTE;

  this.flipY = p.flipY !== undefined ? p.flipY : true;

}

AL3D.Texture.prototype = {
  /**
   * Load the texture.
  */
  loadTexture : function (){
    var texObject = this;
    cache.loadTexture(this.url, function(img){
      texObject.texture=AL3D.gl.createTexture();
      texObject.image = img;
      AL3D.gl.pixelStorei(AL3D.gl.UNPACK_FLIP_Y_WEBGL, true);
      AL3D.gl.bindTexture(AL3D.TEXTURE_2D, texObject.texture);
      AL3D.gl.texImage2D(AL3D.TEXTURE_2D, 0, AL3D.gl.RGBA, AL3D.gl.RGBA, AL3D.gl.UNSIGNED_BYTE, img);
      AL3D.gl.texParameteri(AL3D.TEXTURE_2D, AL3D.TEXTURE_MAG_FILTER, texObject.magFilter);
      AL3D.gl.texParameteri(AL3D.TEXTURE_2D, AL3D.TEXTURE_MIN_FILTER, texObject.minFilter);
      AL3D.gl.generateMipmap(AL3D.TEXTURE_2D);
      AL3D.gl.bindTexture(AL3D.TEXTURE_2D, null);
      texObject.loaded = true;
    });
  },

  /**
   * Load the texture from video.
   *
   * @param {Object} video - video element dom to load.
  */
  loadVideoTexture : function (video){

    this.texture=AL3D.gl.createTexture();
    this.video = video;
    AL3D.gl.pixelStorei(AL3D.gl.UNPACK_FLIP_Y_WEBGL, true);
    AL3D.gl.bindTexture(AL3D.TEXTURE_2D, this.texture);
      
    AL3D.gl.texParameteri(AL3D.TEXTURE_2D, AL3D.TEXTURE_MAG_FILTER, AL3D.gl.LINEAR);
    AL3D.gl.texParameteri(AL3D.TEXTURE_2D, AL3D.TEXTURE_MIN_FILTER, AL3D.gl.LINEAR);
    AL3D.gl.texParameteri( AL3D.gl.TEXTURE_2D, AL3D.gl.TEXTURE_WRAP_S, AL3D.gl.CLAMP_TO_EDGE );
    AL3D.gl.texParameteri( AL3D.gl.TEXTURE_2D, AL3D.gl.TEXTURE_WRAP_T, AL3D.gl.CLAMP_TO_EDGE );
    AL3D.gl.bindTexture(AL3D.TEXTURE_2D, null);
  },

  /**
   * Update video texture.
  */
  updateVideoTexture : function (){
    AL3D.gl.bindTexture(AL3D.TEXTURE_2D, this.texture);
    AL3D.gl.texImage2D(AL3D.TEXTURE_2D, 0, AL3D.gl.RGBA, AL3D.gl.RGBA, AL3D.gl.UNSIGNED_BYTE, this.video);
  }
}