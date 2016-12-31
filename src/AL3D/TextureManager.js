/**
 * Class that manager textures.
 *
 * @class
 * @author Ángel Luis Perales Gómez.
 */
AL3D.TextureManager = function(){
  this._cache = {};
}

AL3D.TextureManager.prototype = {
  /**
   * Store texture in the manager.
   *
   * @param {string} key - The url of texture
   * @param {Object} value - The texture stored
   */
  set : function(key, value){
    this._cache[key] = value;
  },

  /**
   * Get a texture stored in the manager.
   *
   * @param {string} key - The url of texture
   *
   * @returns {object} - return a texture.
   */
  get : function(key){
    return this._cache[key];
  },

  /**
   * Load a texture from the texture manager.
   *
   * @param {string} url - the url of texture
   * @param {function} callback - function to call when the texture is loaded
  */
  loadTexture : function (url, callback){
    if (this._cache[url]){
      callback(this._cache[url]);
    }else{
      var image=new Image();

      image.src=url;
      image.onload=function(e) {
        callback(this);
      };
      this._cache[url] = image;
    }
  }
}