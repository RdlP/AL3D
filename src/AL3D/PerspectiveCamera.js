/**
 * Class that represents a PerspectiveCamera.
 *
 * @class
 * @augments AL3D.Camera
 * @author Ángel Luis Perales Gómez.
 *
 * @param {number} fov - Field of view.
 * @param {number} aspect - Aspect ratio.
 * @param {number} near - Frustum's near.
 * @param {number} far - Frustum's far.
 */
AL3D.PerspectiveCamera = function(fov, aspect, near, far){
  AL3D.Camera.call(this);

  this.fov = fov !== undefined ? fov : 40;
  this.aspect = aspect !== undefined ? aspect : 1;
  this.near = near !== undefined ? near : 0.1;
  this.far = far !== undefined ? far : 1000;

  this.projectionMatrix.perspectiveProjection(this.fov, this.aspect, this.near, this.far);
}

AL3D.PerspectiveCamera.prototype.constructor = AL3D.PerspectiveCamera;
AL3D.PerspectiveCamera.prototype = Object.create( AL3D.Camera.prototype );