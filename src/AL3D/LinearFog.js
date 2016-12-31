/**
 * Class that represents Linar Fog effect.
 *
 * @class
 * @author Ángel Luis Perales Gómez.
 *
 * @param {Object} p - Object that represents a Linear Fog.
 * @param {number} p.start - Where start the fog.
 * @param {number} p.end - Where end the fog.
 */

AL3D.LinearFog = function(p){
  this.color = p===undefined?0xFFFFFFFF:p.color || 0xFFFFFFFF;
  this.start = p===undefined?1:p.start || 1;
  this.end = p===undefined?10:p.end || 10;
}