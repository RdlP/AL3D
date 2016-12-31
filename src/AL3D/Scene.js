/**
 * Class that represents a scene to render.
 *
 * @class
 * @author Ángel Luis Perales Gómez.
 */

AL3D.Scene = function(){
  this.renderObjects = [];
  this.directionalLights=[];
  this.pointLights=[]
  this.ambientLights=[];
  this.spotLights=[];
}

AL3D.Scene.prototype = {
  /**
   * Function to add an Object3D to the scene.
   *
   * @param {AL3D.Object3D} m - Object3D to add.
   */
  add : function(m){
    if (m instanceof AL3D.SkyBox){
      m.load();
    }
    this.renderObjects.push(m);
  },

  /**
   * Function to get the Object3D's in the scene.
   *
   * @return {AL3D.Object3D[]} The Object3D's in the scene.
   */
  getChilds : function(){
    return this.renderObjects;
  },

  /**
   * Function to get the ith Object3D in the scene.
   *
   * @param {number} i - The ith Object3D to get.
   */
  getChild : function(i){
    return this.renderObjects[i];
  },

  /**
   * Function to set the Object3D's childs in the scene.
   *
   * @param {AL3D.Object3D[]} childs - Array of Object3D to set as scene's childs.
   */
  setChilds : function(childs){
    this.renderObjects = childs;
  },

  /**
   * Function to set the picker object to the scene.
   *
   * @param {AL3D.Picker} picker - Picker object.
   */
  setPicker : function(picker){
    this.picker = picker;
  }
}