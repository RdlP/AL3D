/**
 * Class that represents a Point light.
 *
 * @class
 * @author Ángel Luis Perales Gómez.
 * @augments AL3D.Light
 *
 * @param {Object} p - Object that represents a Point light.
 * @param {number} p.color - Light color.
 * @param {ALMath.Vector3} p.position - Light poistion.
 * @param {number} p.distance - Light distance.
 * @param {number} p.intensity - Light intensity.
 * @param {number} p.linearAttenuation - Light linear attenuation.
 * @param {number} p.quadraticAttenuation - Light cuadratic attenuation.
 * @param {number} p.constantAttenuation - Light constant attenuation.
 * @param {ALMath.Vector3} p.direction - Light direction.
 * @param {number} p.spotCosCutOff - Light Spot cosine cut off.
 * @param {number} p.spotExponent - Light Spot Exponent.
 */

AL3D.SpotLight = function (p){
  AL3D.Light.call(this, color);
  this.type = "SpotLight";
  this.position = p.position || new ALMath.Vector3(0,1,0);
  this.distance = p.distance || 1.0;
  this.intensity = p.intensity || 1.0;
  this.linearAttenuation = p.linearAttenuation || 0.1;
  this.quadraticAttenuation = p.quadraticAttenuation || 0.01;
  this.constantAttenuation = p.constantAttenuation || 1.0;
  this.direction = p.direction || 1.0;
  this.spotCosCutOff = p.spotCosCutOff || 1.0;
  this.spotExponent = p.spotExponent || 1.0;
}