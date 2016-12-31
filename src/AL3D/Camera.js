/**
 * Abstract class that represents a Camera.
 *
 * @class
 * @abstract
 * @author Ángel Luis Perales Gómez.
 * @augments AL3D.Object3D
 */
AL3D.Camera = function(){
  AL3D.Object3D.call(this);
  this.projectionMatrix = new ALMath.Matrix4();
  this.viewMatrix = new ALMath.Matrix4();
  this.target = new ALMath.Vector3();
  this.up = new ALMath.Vector3();
}

AL3D.Camera.prototype.constructor = AL3D.Camera;

AL3D.Camera.prototype = {
  /**
   * Set the camera parameters.
   *
   * @param {ALMath.Vector3} eye - Position of the camera.
   * @param {ALMath.Vector3} target - Where camera is looking.
   * @param {ALMath.Vector3} up - Up vector of the camera.
  */
  lookAt : function (eye, target, up){
    this.position = eye;
    this.target = target;
    this.up = up;
    this.update();
  },
  /**
   * Update matrices of the camera.
  */
  update : function (){
    this.viewMatrix = this.viewMatrix.lookAt(this.position,this.target,this.up);
  },

  /**
   * Project a vector.
   *
   * Project a 3D world vector to 2D screen vector.
   *
   * @param {ALMath.Vector3} vector - 3D world vector to map to screen coordinates.
  */
  project : function (vector){
    var viewMatrix = camera.viewMatrix;
    var projectionMatrix = camera.projectionMatrix;

    var mv = viewMatrix.multiply(projectionMatrix);
    var transformedVector = mv.transformPoint(vector);
    var x = (transformedVector.x *0.5 + 0.5)*AL3D.width + x;
    var y = (transformedVector.y *0.5 + 0.5)*AL3D.height + y;
    var z = (1 + transformedVector.z) * 0.5;

    var screenCoords = new ALMath.Vector3(x,y,z);
    return screenCoords;
  },

  /**
   * Unproject a vector.
   *
   * Unproject a 2D screen vector to 3D world vector.
   *
   * @param {ALMath.Vector3} vector - 2D screen vector to map to world coordinates.
  */
  unproject : function (vector){
    var viewMatrix = camera.viewMatrix;
    var projectionMatrix = camera.projectionMatrix;

    var mv = viewMatrix.multiply(projectionMatrix);
    var invMV = mv.getInverse();
    
    var x = ((vector.x -0) / (AL3D.width)) *2 -1;
    var y = ((vector.y -0) / (AL3D.height)) * 2 -1;
    var z = 2*vector.z-1;
    var w = 1;
    var vec4 = new ALMath.Vector4(x,y,z,w);
    var transformedVector = invMV.transformPoint(vec4);
    return transformedVector;
  }
}