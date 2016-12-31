/**
 * Abstract class that represents a Material.
 *
 * @class
 * @author Ángel Luis Perales Gómez.
 * @abstract
 *
 * @param {Object} p - Object that represents a Material.
 * @param {string} p.video - video uses as video as a texture.
 * @param {string} p.texture - color map.
 * @param {string} p.specularMap - specular map.
 * @param {string} p.normalMap - normal map.
 */

AL3D.Material = function(p){
  this.texture = p===undefined?undefined:p.texture;
  this.video = p===undefined?undefined:p.video;
  this.specularMap = p===undefined?undefined:p.specularMap;
  if (this.specularMap !== undefined){
    this.specularMap = new AL3D.Texture({url:this.specularMap});
    this.specularMap.loadTexture();
  }
  this.normalMap = p===undefined?undefined:p.normalMap;
  if (this.normalMap !== undefined){
    this.normalMap = new AL3D.Texture({url:this.normalMap});
    this.normalMap.loadTexture();
  }
  if (this.video !== undefined){
    this.texture = new AL3D.Texture({});
    this.texture.loadVideoTexture(this.video);
  }
}