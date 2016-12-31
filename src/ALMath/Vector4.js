/**
 * Class that represent a 4 dimensional vector.
 *
 * @class
 * @author Ángel Luis Perales Gómez

 * @param {number} x - X coordinate.
 * @param {number} y - Y coordinate.
 * @param {number} z - Z coordinate.
 * @param {number} w - W coordinate.
 */
ALMath.Vector4 = function(x,y,z,w){
	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
	this.w = w===undefined?1:w;
}

ALMath.Vector4.prototype = {

	/**
   	 * Function to add vector v.
   	 *
   	 * @param {ALMath.Vector4} v - vector to add.
   	 *
   	 * @returns {ALMath.Vector4} - A new vector which is the sum between this and v.
   	 */
	add : function(v){
		return new ALMath.Vector4(this.x+v.x,this.y+v.y,this.z+v.z,this.w+v.w);
	},

	/**
   	 * Function to add scalar n.
   	 *
   	 * @param {number} n - Scalar to add.
   	 *
   	 * @returns {ALMath.Vector4} - A new vector which is the sum between each component of this and scalar n.
   	 */
	addScalar : function(n){
		return new ALMath.Vector4(this.x+n,this.y+n,this.z+n,this.w+n);
	},

	/**
   	 * Function to substract vector v.
   	 *
   	 * @param {ALMath.Vector4} v - Vector to substract.
   	 *
   	 * @returns {ALMath.Vector4} - A new vector which is the substract between this and v.
   	 */
	sub : function(v){
		return new ALMath.Vector4(this.x-v.x,this.y-v.y,this.z-v.z,this.w-v.w);
	},

	/**
   	 * Function to substract scalar n.
   	 *
   	 * @param {number} n - Scalar to substract.
   	 *
   	 * @returns {ALMath.Vector4} - A new vector which is the substract between each component of this and scalar n.
   	 */
	subScalar : function(n){
		return new ALMath.Vector4(this.x-n,this.y-n,this.z-n,this.w-n);
	},

	/**
   	 * Function to multipy by vector v.
   	 *
   	 * @param {ALMath.Vector4} v - Vector to multiply.
   	 *
   	 * @returns {ALMath.Vector4} - A new vector which is the multiplication between this and v.
   	 */
	multiply : function(v){
		return new ALMath.Vector4(this.x*v.x,this.y*v.y,this.z*v.z,this.w*v.w);
	},

	/**
   	 * Function to multiply by scalar n.
   	 *
   	 * @param {number} n - Scalar to multiply.
   	 *
   	 * @returns {ALMath.Vector4} - A new vector which is the multiplication between each component of this and scalar n.
   	 */
	multiplyByScalar : function(n){
		return new ALMath.Vector4(this.x*n,this.y*n,this.z*n,this.w*n);
	},

	/**
   	 * Function to divide by vector v.
   	 *
   	 * @param {ALMath.Vector4} v - Vector to divide.
   	 *
   	 * @throws Division by zero.
   	 *
   	 * @returns {ALMath.Vector4} - A new vector which is the divison between this and v.
   	 */
	divide : function(v){
		if (v.x === 0 || v.y === 0 || v.z === 0 || v.w === 0){
			throw new Error("ALMath.Vector4.divide(v): Division by zero.")
		}
		return new ALMath.Vector4(this.x/v.x,this.y/v.y,this.z/v.z,this.w/v.w);
	},

	/**
   	 * Function to divide by scalar n.
   	 *
   	 * @param {number} n - Scalar to divide.
   	 *
   	 * @throws Division by zero.
   	 *
   	 * @returns {ALMath.Vector4} - A new vector which is the division between each component of this and scalar n.
   	 */
	divideByScalar : function(n){
		if (n === 0){
			throw new Error("ALMath.Vector4.divideByScalar(n): Division by zero.")
		}
		return new ALMath.Vector4(this.x/n,this.y/n,this.z/n,this.w/n);
	},

	/**
   	 * Function to clamp between min and max.
   	 *
   	 * @param {number} min - Min value.
   	 * @param {number} max - Max value.
   	 *
   	 * @returns {ALMath.Vector4} - A new vector clamped between min and max.
   	 */
	clamp : function(min, max){
		var x = this.x;
		var y = this.y;
		var z = this.z;
		var w = this.w;
		if ( this.x < min.x ) {
			x = min.x;
		} else if ( this.x > max.x ) {
			x = max.x;
		}

		if ( this.y < min.y ) {
			y = min.y;
		} else if ( this.y > max.y ) {
			y = max.y;
		}

		if ( this.z < min.z ) {
			z = min.z;
		} else if ( this.z > max.z ) {
			z = max.z;
		}

		if ( this.w < min.w ) {
			w = min.w;
		} else if ( this.w > max.w ) {
			w = max.w;
		}

		return new ALMath.Vector4(x,y,z,w);
	},

	/**
   	 * Function to floor vector.
   	 *
   	 * @returns {ALMath.Vector4} - A new vector floored.
   	 */
	floor : function () {
		var x = Math.floor( this.x );
		var y = Math.floor( this.y );
		var z = Math.floor( this.z );
		var w = Math.floor( this.w );

		return new ALMath.Vector4(x,y,z,w);
	},

	/**
   	 * Function to ceil vector.
   	 *
   	 * @returns {ALMath.Vector4} - A new vector ceiled.
   	 */
	ceil : function () {
		var x = Math.ceil( this.x );
		var y = Math.ceil( this.y );
		var z = Math.ceil( this.z );
		var w = Math.ceil( this.w );

		return new ALMath.Vector4(x,y,z,w);
	},

	/**
   	 * Function to round between min and max.
   	 *
   	 * @returns {ALMath.Vector4} - A new vector rounded.
   	 */
	round : function () {
		var x = Math.round( this.x );
		var y = Math.round( this.y );
		var z = Math.round( this.z );
		var w = Math.round( this.w );

		return new ALMath.Vector4(x,y,z,w);
	},

	/**
   	 * Function to negate vector.
   	 *
   	 * @returns {ALMath.Vector4} - A new vector with each component negate.
   	 */
	negate : function () {
		return new ALMath.Vector4(-this.x,-this.y,-this.z,-this.w);
	},

	/**
   	 * Function to compute dot product.
   	 *
   	 * @param {ALMath.Vector4} v - Vector to do the dot product.
   	 *
   	 * @returns {number} - Dot product between this and v.
   	 */
	dot : function ( v ) {
		return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
	},

	/**
   	 * Function to compute length of the vector.
   	 *
   	 * @returns {number} - Vector length.
   	 */
	length : function () {
		// Maybe it could be : return Math.sqrt( this.dot(this) );
		return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w );
	},

	/**
   	 * Function to normalize vector.
   	 *
   	 * @returns {number} - A new vector normalized.
   	 */
	normalize : function () {
		return this.divideByScalar( this.length() );
	},

	/**
   	 * Function to compute distance between vectors.
   	 *
   	 * @param {ALMath.Vector4} v - Vector to compute the distance.
   	 *
   	 * @returns {number} - Distance between this and v.
   	 */
	distanceTo : function ( v ) {
		return Math.sqrt( (this.x - v.x) * (this.x - v.x) + (this.y - v.y) * (this.y - v.y) + (this.z - v.z) * (this.z - v.z ) + (this.w - v.w) * (this.w - v.w ));
	},

	/**
   	 * Function to set the vector components.
   	 *
   	 * @param {number} x - X component.
   	 * @param {number} y - Y component.
   	 * @param {number} z - Z component.
   	 * @param {number} w - W component.
   	 *
   	 * @returns {ALMath.Vector3} - this.
   	 */
	set : function(x, y, z, w){
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
	},

	/**
   	 * Function to get the vector in format that WebGL understands.
   	 *
   	 * @returns {Float32Array} - A Float32Array with x, y, z and w.
   	 */
	getForGL : function(){
		return new Float32Array([this.x, this.y, this.z, this.w]);
	},

	/**
   	 * Function to clone vectors.
   	 *
   	 * @returns {ALMath.Vector4} - A copy of this.
   	 */
	clone : function(){
		return new ALMath.Vector3(this.x, this.y, this.z, this.w);
	},

	/**
   	 * Function to compare vectors.
   	 *
   	 * @param {ALMath.Vector4} v - Vector to compare.
   	 *
   	 * @returns {boolean} - true if this and v are equals, false otherwise.
   	 */
	equals : function (v){
		if (!(v instanceof ALMath.Vector4)){
			return false;
		}
		return (this.x === v.x) && (this.y === v.y) && (this.z === v.z) && (this.w === v.w);
	}
}