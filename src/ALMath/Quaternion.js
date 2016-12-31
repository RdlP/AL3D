/**
 * Class that represent a quaternion.
 *
 * @class
 * @author Ángel Luis Perales Gómez

 * @param {number} x - X coordinate.
 * @param {number} y - Y coordinate.
 * @param {number} z - Z coordinate.
 * @param {number} w - W coordinate.
 */
ALMath.Quaternion = function ( x, y, z, w ) {

	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
	this.w = ( w !== undefined ) ? w : 1;

};

ALMath.Quaternion.prototype = {

	/**
	 * Function to compute the length of the quaternion.
	 *
	 *	@returns {number} - Lenght of the quaternion.
	 */
	lenght : function(){
		return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w );
	},

	/**
   	 * Function to normalize quaternion.
   	 *
   	 * @returns {number} - A new quaternion normalized.
   	 */
	normalize : function(){
		var d = this.length();
		var x,y,z,w;
		if ( d === 0 ) {
			x = 0;
			y = 0;
			z = 0;
			w = 1;
		} else {
			d = 1 / d;
			x = this.x * d;
			y = this.y * d;
			z = this.z * d;
			w = this.w * d;
		}
		return new ALMath.Quaternion(x,y,z,w);
	},

	/*
	 * Function to multiply two quaternions.
	 *
	 * @param {ALMath.Quaternion} q - Quaternion to multiply.
	 *
	 * @returns {ALMath.Quaternion} - A new quaternion result of multiply this by q.
	 */
	multiply : function(q){
		var nx,ny,nz,nw;
		nw = this.w*q.w - this.x*q.x - this.y*q.y - this.z*q.z;
		nx = this.w*q.x + this.x*q.w + this.y*q.z - this.z*q.y;
		ny = this.w*q.y + this.y*q.w + this.z*q.x - this.x*q.z;
		nz = this.w*q.z + this.z*q.w + this.x*q.y - this.y*q.x;

		return new ALMath.Quaternion(nx,ny,nz,nw);
	},

	/**
	 * Function to conjugate the quaternion.
	 *
	 * @returns {ALMath.Quaternion} - A new quaternion conjugated.
	 */
	conjugate : function (){
		return new ALMath.Quaternion(-this.x, -this.y, -this.z, this.w);
	},

	/**
	 * Function to get the inverse of quaternion.
	 *
	 * @returns {ALMath.Quaternion} - A new quaternion conjugated.
	 */
	inverse : function (){
		return this.conjugate().normalize();
	},

	/**
	 * Function to get matrix rotation from quaternion.
	 *
	 * @returns {ALMath.Matrix4} - A 4x4 rotation matrix.
	 */
	getMatrix : function (){
		var n11 = 1-2*this.y*this.y-2*this.z*this.z,
			n12 = 2*this.x*this.y + 2*this.w*this.z,
			n13 = 2*this.x*this.z - 2*this.w*this.x,
			n21 = 2*this.x*this.y - 2*this.w*this.z,
			n22 = 1-2*this.x*this.x-2*this.z*this.z,
			n23 = 2*this.y*this.z - 2*this.w*this.x,
			n31 = 2*this.x*this.z + 2*this.w*this.y,
			n32 = 2*this.y*this.z - 2*this.w*this.x,
			n33 = 1-2*this.x*this.x-2*this.y*this.y;
		var matrix = new ALMath.Matrix4();
		matrix.set(
			n11, n21, n31, 0,
			n12, n22, n32, 0,
			n13, n23, n33, 0,
			0,   0,   0,   1
		);
		return matrix;
	},

	/**
	 * Function to create a quaternion from Euler's angles.
	 *
	 * @param {ALMath.Vector3} v - Vector with the Euler's angles rotation in degrees.
	 *
	 * @returns {ALMath.Quaternion} - A quaternion seted from the Euler's angles
	 */
	setFromEuler : function(v){
		var c = new ALMath.Vector3();
		c.x = ALMath.degToRad(v.x);
		c.y = ALMath.degToRad(v.y);
		c.z = ALMath.degToRad(v.z);
		var q1 = new ALMath.Quaternion(0,Math.sin(c.y/2),0,Math.cos(c.y/2)),
			q2 = new ALMath.Quaternion(Math.sin(c.x/2),0,0,Math.cos(c.x/2)),
			q3 = new ALMath.Quaternion(0,0,Math.sin(c.z/2),Math.cos(c.z/2));
		var result = q1.multiply(q2);
		result = result.multiply(q3);

		this.x = result.x;
		this.y = result.y;
		this.z = result.z;
		this.w = result.w;
		return this;
	},

	/**
	 * Function to get the Euler's angles from the quaternion.
	 *
	 * @returns {ALMath.Vector3} - A vector with the Euler's angles.
	 */
	getEuler : function (){
		p = -2*(this.y*this.z - this.w*this.x);
		if (Math.abs(p)>0.9999){
			p = 1.570796*p;
			h = Math.atan2(-this.x*this.z + this.w*this.y, 0.5 - this.y*this.y - this.z*this.z);
			b = 0;
		}else{
			p = Math.asin(p);
			h = Math.atan2(this.x*this.z + this.w*this.y, 0.5 - this.x*this.x - this.y*this.y);
			b = Math.atan2(this.x*this.y + this.w*this.z, 0.5 - this.x*this.x - this.z*this.z);
		}
		return new ALMath.Vector3(ALMath.radToDeg(p),ALMath.radToDeg(h),ALMath.radToDeg(b));
	}
}