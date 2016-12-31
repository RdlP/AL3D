/**
 * Class that represents an Object in 3D world that can adds to Scene.
 *
 * @class
 * @author Ángel Luis Perales Gómez.
 * @abstract
 *
 * @param {number} x - The x coordenate in the 3D world.
 * @param {number} y - The y coordenate in the 3D world.
 * @param {number} z - The z coordenate in the 3D world.
 */
AL3D.Object3D = function(x, y, z){
  this._position = new ALMath.Vector3(x||0, y||0, z||0);
  this._orientation = new ALMath.Vector3();
  this.scale = new ALMath.Vector3(0.5,0.5,0.5);
  this.transform = new ALMath.Matrix4();
}

AL3D.Object3D.prototype.constructor = AL3D.Object3D;

AL3D.Object3D.prototype = {
  
  /**
   * Return the Object3D position.
   *
   * @returns {ALMath.Vector3} - The Object3D position
   */
  get position (){
    return this._position;
  },

  /**
   * Set the Object3D position.
   *
   * @param {ALMath.Vector3} value - The Object3D position
   */
  set position (value){
    this._position.x = value.x;
    this._position.y = value.y;
    this._position.z = value.z;
  },

  /**
   * Set the Object3D rotation.
   *
   * @param {ALMath.Vector3} value - The Object3D rotation
   */
  set rotation (value){
    this._orientation.setFromEuler(value.x,value.y,value.z);
  },

  /**
   * Set the Object3D orientation.
   *
   * @param {ALMath.Vector3} value - The Object3D orientation
   */
  set orientation (value){
    this._orientation.x = value.x;
    this._orientation.y = value.y;
    this._orientation.z = value.z;
  },

  /**
   * Return the Object3D orientation.
   *
   * @returns {ALMath.Vector3} - The Object3D orientation
   */
  get orientation (){
    return this._orientation;
  },

  /**
   * Return the Object3D rotation.
   *
   * @returns {ALMath.Vector3} - The Object3D rotation
   */
  get rotation () {
    this._orientation.getEuler();
  },

  /**
   * Prepare Object3D to render.
   *
   * This method update the position, orientation and scale
   */
  prepareToRender : function(){
    this.transform = new ALMath.Matrix4();
    var qOrientation = new ALMath.Quaternion().setFromEuler(this.orientation).getMatrix();
    var scaleM = new ALMath.Matrix4();
    var orientationM = new ALMath.Matrix4();
    orientationM = orientationM.rotate(this.orientation.x, this.orientation.y, this.orientation.z);
    scaleM = scaleM.scale(this.scale.x,this.scale.y,this.scale.z);
    this.transform = this.transform.multiply(orientationM).multiply(scaleM);
    // We could do
    // var matrixT = new ALMath.Matrix4();
    // matrixT.translate(this.position.x,this.position.y,this.position.z);
    // and then multiply the transform but this take more calcules than simply put position in the correct positions.
    this.transform.components[12] = this.position.x;
    this.transform.components[13] = this.position.y;
    this.transform.components[14] = this.position.z;
  }
}