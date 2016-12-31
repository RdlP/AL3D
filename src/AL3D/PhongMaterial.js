/**
 * Class that represents a Phong Material.
 *
 * @class
 * @author Ángel Luis Perales Gómez.
 * @augments AL3D.Material
 *
 * @param {Object} p - Object that represents a Material.
 * @param {string} p.video - video uses as video as a texture.
 * @param {string} p.texture - color map.
 * @param {string} p.specularMap - specular map.
 * @param {string} p.normalMap - normal map.
 * @param {number} p.diffuse - diffuse color.
 * @param {number} p.ambient - ambient color.
 * @param {number} p.specular - specular color.
 * @param {number} p.shininess - shininess.
 * @param {Object} p.shading - Shadding/interpolation technique (AL3D.GouraudInterpolation or AL3D.PĥongInterpolation).
 * @param {number} p.sideMode - AL3D.ONE_SIDE or AL3D.TWO_SIDE.
 */


AL3D.PhongMaterial = function (p){
  AL3D.Material.call(this, p);
  this.type = "PhongMaterial";
  this.shading =  p.shading || AL3D.GouraudInterpolation;
  this.sideMode = p.sideMode || AL3D.ONE_SIDE;
  this.diffuse = 0xFFFFFFFF;
  this.ambient = 0xFFFFFFFF;
  this.specular = 0xFFFFFFFF;
  this.shininess = 1.0;
  if (p !== undefined && p.diffuse !== undefined){
    this.diffuse = p.diffuse;
  }
  if (p !== undefined && p.ambient !== undefined){
    this.ambient = p.ambient;
  }
  if (p !== undefined && p.specular !== undefined){
    this.specular = p.specular;
  }
  if (p !== undefined && p.shininess !== undefined){
    this.shininess = p.shininess;
  }
}