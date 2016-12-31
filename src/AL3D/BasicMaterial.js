/**
 * Class that represents a Basic Material.
 *
 * @class
 * @augments AL3D.Material
 * @author Ángel Luis Perales Gómez.
 *
 * @param {Object} p - Object that represents a Material.
 * @param {string} p.video - video uses as video as a texture.
 * @param {string} p.texture - color map.
 * @param {string} p.specularMap - specular map.
 * @param {string} p.normalMap - normal map.
 * @param {number} p.diffuse - diffuse color.
 * @param {number} p.ambient - ambient color.
 */

AL3D.BasicMaterial = function (p){
  AL3D.Material.call(this, p);
  this.type = "BasicMaterial";
  
  this.diffuse = 0xFFCCCCCC;
  this.ambient = 0xFFFFFFFF;
  if (p !== undefined && p.diffuse !== undefined){
    this.diffuse = p.diffuse;
  }
  if (p !== undefined && p.ambient !== undefined){
    this.ambient = p.ambient;
  }
}