/**
 * Class that represents a Toon Material.
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
 * @param {Object} p.shading - Shadding/interpolation technique (AL3D.GouraudInterpolation or AL3D.PĥongInterpolation).
 * @param {number} p.sideMode - AL3D.ONE_SIDE or AL3D.TWO_SIDE.
 */


AL3D.ToonMaterial = function (p){
  AL3D.Material.call(this, p);
  this.type = "ToonMaterial";
  this.shading = p.shading || AL3D.GouraudInterpolation;
  this.sideMode = p.sideMode || AL3D.ONE_SIDE;
  this.diffuse = 0xFFFFFFFF;
  this.ambient = 0xFFFFFFFF;
  if (p !== undefined && p.diffuse !== undefined){
    this.diffuse = p.diffuse;
  }
  if (p !== undefined && p.ambient !== undefined){
    this.ambient = p.ambient;
  }

  // Texture to map the new brightness level. Power of Two
  var l = [
    0x44, 0x44, 0x44, 0x44,
    0x88, 0x88, 0x88, 0x88,
    0xCC, 0xCC, 0xCC, 0xCC,
    0xFF, 0xFF, 0xFF, 0xFF
  ];
  if (p.levels !== undefined){
    for (var i = 0; i < p.levels.length; i++){
      var c = AL3D.Utils.hexIntToRgb(p.levels[i]);
      l.push(c.r);
      l.push(c.g);
      l.push(c.b);
      l.push(c.a);
    }
  }

  this.levels = new Uint8Array(l);

  var image = this.levels;
  this.textureToon = new AL3D.Texture({});
  this.textureToon.texture = AL3D.gl.createTexture();
    AL3D.gl.bindTexture(AL3D.TEXTURE_2D, this.textureToon.texture);
    AL3D.gl.pixelStorei(AL3D.gl.UNPACK_FLIP_Y_WEBGL, true);
    AL3D.gl.texImage2D(AL3D.gl.TEXTURE_2D, 0, AL3D.gl.RGBA, l.length/4, 1, 0, AL3D.gl.RGBA, AL3D.gl.UNSIGNED_BYTE, image);
    AL3D.gl.generateMipmap( AL3D.gl.TEXTURE_2D );
    AL3D.gl.texParameteri( AL3D.gl.TEXTURE_2D, AL3D.gl.TEXTURE_MIN_FILTER, AL3D.gl.NEAREST_MIPMAP_LINEAR );
    AL3D.gl.texParameteri( AL3D.gl.TEXTURE_2D, AL3D.gl.TEXTURE_MAG_FILTER, AL3D.gl.NEAREST );


}