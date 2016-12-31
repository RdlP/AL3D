/**
 * Class that represent a 3x3 matrix.
 *
 * @class
 * @author Ángel Luis Perales Gómez
 */
ALMath.Matrix3 = function(){
	this.components = new Float32Array([
		1,0,0,
		0,1,0,
		0,0,1
	]);
}

ALMath.Matrix3.prototype = {

	/**
   	 * Function to set each component.
   	 * 
   	 * Set the component in row major order.
   	 *
   	 * @param {number} n11 - component for row 1 column 1.
   	 * @param {number} n12 - component for row 1 column 2.
   	 * @param {number} n13 - component for row 1 column 3.
   	 * @param {number} n21 - component for row 2 column 1.
   	 * @param {number} n22 - component for row 2 column 2.
   	 * @param {number} n23 - component for row 2 column 3.
   	 * @param {number} n31 - component for row 3 column 1.
   	 * @param {number} n32 - component for row 3 column 2.
   	 * @param {number} n33 - component for row 3 column 3.
   	 */
	set : function(n11,n12,n13,n21,n22,n23,n31,n32,n33){
		var c = this.components;
		c[0] = n11;
		c[1] = n21;
		c[2] = n31;
		c[3] = n12;
		c[4] = n22;
		c[5] = n32;
		c[6] = n13;
		c[7] = n23;
		c[8] = n33;
	},

	/**
   	 * Function to set this matrix to the identity matrix.
   	 */
	identity : function(){
		this.set(
			1, 0, 0,
			0, 1, 0,
			0, 0, 1
		);
	},

	/**
   	 * Function to multiply by vector v.
   	 *
   	 * @param {ALMath.Vector3} v - Vector to multiply.
   	 *
   	 * @returns {ALMath.Vector3} - A new vector which is the multiplication between the matrix this and the vector v.
   	 */
	multiplyByVector : function(v){
		var c = this.components;
		return new ALMath.Vector3(c[0]*v.x+c[1]*v.y+c[2]*v.z, c[3]*v.x+c[4]*v.y+c[5]*v.z, c[6]*v.x+c[7]*v.y+c[8]*v.z);
	},

	/**
   	 * Function to multiply by scalar n.
   	 *
   	 * @param {number} n - Scalar to multiply.
   	 *
   	 * @returns {ALMath.Matrix3} - this that is the multiplication between this and scalar n.
   	 */
	multiplyByScalar : function(n){
		var c = this.components;

		c[0] *= n;
		c[1] *= n;
		c[2] *= n;
		c[3] *= n;
		c[4] *= n;
		c[5] *= n;
		c[6] *= n;
		c[7] *= n;
		c[8] *= n;

		return this;
	},

	/**
   	 * Function to divide by scalar n.
   	 *
   	 * @param {number} n - Scalar to divide.
   	 *
   	 * @throws Division by zero.
   	 *
   	 * @returns {ALMath.Matrix3} - this that is the division between this and scalar n.
   	 */
	divideByScalar : function (n){
		if (n === 0){
			throw new Error("ALMath.Matrix3.divideByScalar(n): Division by zero.")
		}
		var c = this.components;
		c[0] /= n;
		c[1] /= n;
		c[2] /= n;
		c[3] /= n;
		c[4] /= n;
		c[5] /= n;
		c[6] /= n;
		c[7] /= n;
		c[8] /= n;

		return this;
	},

	/**
   	 * Function to compute the matrix determinant.
   	 *
   	 * @returns {number} - The determinant of this.
   	 */
	determinant : function(){
		var c = this.components;
		return c[0]*c[4]*c[8]-c[0]*c[5]*c[7]-c[1]*c[3]*c[8]+c[1]*c[5]*c[6]+c[1]*c[3]*c[7]-c[2]*c[4]*c[6];
	},

	/**
   	 * Function to transpose matrix.
   	 *
   	 * @returns {ALMath.Matrix3} - this that is the transpose matrix.
   	 */
	transpose : function () {
		var t, c = this.components;

		t = c[1];
		c[1] = c[3];
		c[3] = t;

		t = c[2];
		c[2] = c[6];
		c[6] = t;

		t = c[5];
		c[5] = c[7];
		c[7] = t;

		return this;
	},

	/**
   	 * Function to compute matrix inverse.
   	 *
   	 * @throws Singular matrix. The matrix hasn't inverse.
   	 *
   	 * @returns {ALMath.Matrix3} - this that is the invert matrix.
   	 */
	inverse: function () {
		var c = this.components;
		var n11 = c[4]*c[8] - c[5]*c[7],
			n12 = -1*(c[1]*c[8] - c[2]*c[7]),
			n13 = c[1]*c[5] - c[2]*c[4],

			n21 = -1*(c[3]*c[8] - c[5]*c[6]),
			n22 = c[0]*c[8] - c[2]*c[6],
			n23 = -1*(c[0]*c[5] - c[2]*c[3]),

			n31 = c[3]*c[7] - c[4]*c[6],
			n32 = -1*(c[0]*c[7] - c[1]*c[6]),
			n33 = c[0]*c[4] - c[1]*c[3];

		this.set(
			n11, n12, n13,
			n21, n22, n23,
			n31, n32, n33
		);

		var determinant = this.determinant();
		if (determinant === 0){
			throw new Error("ALMath.Matrix3.inverse(): Matrix not reversible");
		}
		this.multiplyByScalar(1/determinant);
		return this;
	},
	
	/**
   	 * Function clone a matrix.
   	 *
   	 * @returns {ALMath.Matrix3} - A copy of this.
   	 */
	clone : function(){
		c = this.components;
		cloned = new ALMath.Matrix3();
		cloned.set(c[0],c[1],c[2],c[3],c[4],c[5],c[6],c[7],c[8]);
		return cloned;
	},

	/**
   	 * Function compare two matrices.
   	 *
   	 * @returns {boolean} - true if this and v are equals, false otherwise.
   	 */
	equals : function (m){
		if (!(m instanceof ALMath.Matrix3)){
			return false;
		}

		for (var i = 0; i < this.components.length; i++){
			if (this.components[i] !== m.components[i]){
				return false;
			}
		}
		return true;
	}
}