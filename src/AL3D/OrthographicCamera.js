/**
 * Class that represents an OrthographicCamera.
 *
 * @class
 * @augments AL3D.Camera
 * @author Ángel Luis Perales Gómez.
 *
 * @param {number} left - Frustum's left.
 * @param {number} right - Frustum's right.
 * @param {number} top - Frustum's top.
 * @param {number} bottom - Frustum's bottom.
 * @param {number} near - Frustum's near.
 * @param {number} far - Frustum's far.
 */
AL3D.OrthographicCamera = function(left, right, top, bottom, near, far){
  AL3D.Camera.call(this);

  this.projectionMatrix.orthographicProjection(left, right, top, bottom, near, far);
}

AL3D.OrthographicCamera.prototype.constructor = AL3D.OrthographicCamera;
AL3D.OrthographicCamera.prototype = Object.create( AL3D.Camera.prototype );