/**
 * Class that represents a Directional light.
 *
 * @class
 * @author Ángel Luis Perales Gómez.
 * @augments AL3D.Light
 *
 * @param {Object} p - Object that represents a Directional light.
 * @param {number} p.color - Light color.
 * @param {number} p.density - Light intensity.
 * @param {ALMath.Vector3} p.position - Light direction.
 */

AL3D.DirectionalLight = function(p){
  AL3D.Light.call(this, p);
  this.type = "DirectionalLight";
  this.intensity = p.intensity || 1.0;
  this.position = p.position || new ALMath.Vector3(0,1,0);
}