/**
 * Abstract class that represents an light.
 *
 * @class
 * @author Ángel Luis Perales Gómez.
 * @augments AL3D.Object3D
 * @abstract
 *
 * @param {Object} p - Object that represents an light.
 * @param {number} p.color - Light color.
 */

AL3D.Light = function(p){
  AL3D.Object3D.call(this);
  this.type = "Light";
  this.color = p.color || 0xFFFFFFFF;
}