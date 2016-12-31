/**
 * Class that represents Exponential Fog effect.
 *
 * @class
 * @author Ángel Luis Perales Gómez.
 *
 * @param {Object} p - Object that represents a ExpFog.
 * @param {number} p.color - Fog color.
 * @param {number} p.density - Fog density.
 */

AL3D.ExpFog = function(p){
  this.color = p===undefined?0xFFFFFFFF:p.color || 0xFFFFFFFF;
  this.density = p===undefined?1:p.density || 1;
}