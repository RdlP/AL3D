/**
 * Class that represents an Ambient light.
 *
 * @class
 * @author Ángel Luis Perales Gómez.
 * @augments AL3D.Light
 *
 * @param {Object} p - Object that represents an Ambient light.
 * @param {number} p.color - Light color.
 * @param {number} p.density - Light intensity.
 */

AL3D.AmbientLight = function(p){
  AL3D.Light.call(this, p);
  this.type = "AmbientLight";
  this.intensity = p.intensity || 1.0;
}