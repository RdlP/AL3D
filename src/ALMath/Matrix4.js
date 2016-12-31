/**
 * Class that represent a 4x4 matrix.
 *
 * @class
 * @author Ángel Luis Perales Gómez
 */
ALMath.Matrix4 = function(){
	this.components = new Float32Array([
		1,0,0,0,
		0,1,0,0,
		0,0,1,0,
		0,0,0,1
	]);
}

ALMath.Matrix4.prototype = {

	/**
   	 * Function to set each component.
   	 * 
   	 * Set the component in row major order.
   	 *
   	 * @param {number} n11 - component for row 1 column 1.
   	 * @param {number} n12 - component for row 1 column 2.
   	 * @param {number} n13 - component for row 1 column 3.
   	 * @param {number} n14 - component for row 1 column 4.
   	 * @param {number} n21 - component for row 2 column 1.
   	 * @param {number} n22 - component for row 2 column 2.
   	 * @param {number} n23 - component for row 2 column 3.
   	 * @param {number} n24 - component for row 2 column 4.
   	 * @param {number} n31 - component for row 3 column 1.
   	 * @param {number} n32 - component for row 3 column 2.
   	 * @param {number} n33 - component for row 3 column 3.
   	 * @param {number} n34 - component for row 3 column 4.
   	 * @param {number} n41 - component for row 4 column 1.
   	 * @param {number} n42 - component for row 4 column 2.
   	 * @param {number} n43 - component for row 4 column 3.
   	 * @param {number} n44 - component for row 4 column 4.
   	 */
	set : function ( n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44 ) {
		var c = this.components;

		c[0] = n11;
		c[1] = n21;
		c[2] = n31;
		c[3] = n41;
		c[4] = n12;
		c[5] = n22;
		c[6] = n32;
		c[7] = n42;
		c[8] = n13;
		c[9] = n23;
		c[10] = n33;
		c[11] = n43;
		c[12] = n14;		
		c[13] = n24;
		c[14] = n34;
		c[15] = n44;
	},
	/**
   	 * Function to set this matrix to the identity matrix.
   	 *
   	 * @returns {ALMath.Matrix4} Identity Matrix.
   	 */
	identity : function () {
		this.set(
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		);
		return this;
	},

	
	multiply: function ( m ) {

		var o = m.components;
		var c = this.components;
		result = new ALMath.Matrix4();
		var r = result.components;

		var o11 = o[0], o12 = o[4], o13 = o[8], o14 = o[12];
		var o21 = o[1], o22 = o[5], o23 = o[9], o24 = o[13];
		var o31 = o[2], o32 = o[6], o33 = o[10], o34 = o[14];
		var o41 = o[3], o42 = o[7], o43 = o[11], o44 = o[15];

		r[0] = c[0] * o11 + c[4] * o21 + c[8] * o31 + c[12] * o41;
		r[4] = c[0] * o12 + c[4] * o22 + c[8] * o32 + c[12] * o42;
		r[8] = c[0] * o13 + c[4] * o23 + c[8] * o33 + c[12] * o43;
		r[12] = c[0] * o14 + c[4] * o24 + c[8] * o34 + c[12] * o44;

		r[1] = c[1] * o11 + c[5] * o21 + c[9] * o31 + c[13] * o41;
		r[5] = c[1] * o12 + c[5] * o22 + c[9] * o32 + c[13] * o42;
		r[9] = c[1] * o13 + c[5] * o23 + c[9] * o33 + c[13] * o43;
		r[13] = c[1] * o14 + c[5] * o24 + c[9] * o34 + c[13] * o44;

		r[2] = c[2] * o11 + c[6] * o21 + c[10] * o31 + c[14] * o41;
		r[6] = c[2] * o12 + c[6] * o22 + c[10] * o32 + c[14] * o42;
		r[10] = c[2] * o13 + c[6] * o23 + c[10] * o33 + c[14] * o43;
		r[14] = c[2] * o14 + c[6] * o24 + c[10] * o34 + c[14] * o44;

		r[3] = c[3] * o11 + c[7] * o21 + c[11] * o31 + c[15] * o41;
		r[7] = c[3] * o12 + c[7] * o22 + c[11] * o32 + c[15] * o42;
		r[11] = c[3] * o13 + c[7] * o23 + c[11] * o33 + c[15] * o43;
		r[15] = c[3] * o14 + c[7] * o24 + c[11] * o34 + c[15] * o44;

		return result;
	},

	/**
   	 * Function to multiply by scalar n.
   	 *
   	 * @param {number} n - Scalar to multiply.
   	 *
   	 * @returns {ALMath.Matrix4} - this that is the multiplication between this and scalar n.
   	 */
	multiplyByScalar : function ( n ) {
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
		c[9] *= n;
		c[10] *= n;
		c[11] *= n;
		c[12] *= n;
		c[13] *= n;
		c[14] *= n;
		c[15] *= n;

		return this;
	},

	/**
   	 * Function to multiply by vector v.
   	 *
   	 * @param {ALMath.Vector3} v - Vector to multiply.
   	 *
   	 * @returns {ALMath.Vector3} - A new vector which is the multiplication between the matrix this and the vector v.
   	 */
	multiplyByVector : function (v){
		var result,nx,ny,nz;
		var c = this.components;
		nx = c[0]*v.x+c[4]*v.y+c[8]*v.z+c[12];
		ny = c[1]*v.x+c[5]*v.y+c[9]*v.z+c[13];
		nz = c[2]*v.x+c[6]*v.y+c[10]*v.z+c[14];
		return new ALMath.Vector3(nx,ny,nz);
	},

	/**
   	 * Function to multiply by vector v.
   	 *
   	 * @param {ALMath.Vector4} v - Vector to multiply.
   	 *
   	 * @returns {ALMath.Vector4} - A new vector which is the multiplication between the matrix this and the vector v.
   	 */
	multiplyByVector4 : function (v){
		var vector = v;
		if (v instanceof ALMath.Vector3){
			vector = new ALMath.Vector4(v.x,v.y,v.z,0);
		}
		var result,nx,ny,nz,nw;
		var c = this.components;
		nx = c[0]*v.x+c[4]*v.y+c[8]*v.z+c[12]*v.w;
		ny = c[1]*v.x+c[5]*v.y+c[9]*v.z+c[13]*v.w;
		nz = c[2]*v.x+c[6]*v.y+c[10]*v.z+c[14]*v.w;
		nw = c[3]*v.x+c[7]*v.y+c[11]*v.z+c[15]*v.w;
		return new ALMath.Vector4(nx,ny,nz,nw);
	},

	/**
   	 * Function to transform a vector v by matrix this.
   	 *
   	 * The difference between transformPoint and multiplyByVector is that transformPoint do the perspective division
   	 *
   	 * @param {ALMath.Vector4} v - Vector to multiply.
   	 *
   	 * @returns {ALMath.Vector4} - A new vector which is the multiplication between the matrix this and the vector v.
   	 */
	transformPoint : function(v){
		var m = this.components;

		var dst = new ALMath.Vector3();
	    var v0 = v.x;
	    var v1 = v.y;
	    var v2 = v.z;
	    var d = v0 * m[0 * 4 + 3] + v1 * m[1 * 4 + 3] + v2 * m[2 * 4 + 3] + m[3 * 4 + 3];

	    dst.x = (v0 * m[0 * 4 + 0] + v1 * m[1 * 4 + 0] + v2 * m[2 * 4 + 0] + m[3 * 4 + 0]) / d;
	    dst.y = (v0 * m[0 * 4 + 1] + v1 * m[1 * 4 + 1] + v2 * m[2 * 4 + 1] + m[3 * 4 + 1]) / d;
	    dst.z = (v0 * m[0 * 4 + 2] + v1 * m[1 * 4 + 2] + v2 * m[2 * 4 + 2] + m[3 * 4 + 2]) / d;

	    return dst;

	},

	/**
   	 * Function to divide by scalar n.
   	 *
   	 * @param {number} n - Scalar to divide.
   	 *
   	 * @throws Division by zero.
   	 *
   	 * @returns {ALMath.Vector4} - this that is the division between this and scalar n.
   	 */
	divideByScalar : function ( n ) {
		if (n === 0){
			throw new Error("ALMath.Matrix4.divideByScalar(n): Division by zero.")
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
		c[9] /= n;
		c[10] /= n;
		c[11] /= n;
		c[12] /= n;
		c[13] /= n;
		c[14] /= n;
		c[15] /= n;

		return this;
	},

	/**
   	 * Function to transpose matrix.
   	 *
   	 * @returns {ALMath.Matrix4} - this that is the transpose matrix.
   	 */
	transpose : function () {
		var c = this.components;
		var t;

		t = c[1];
		c[1] = c[4];
		c[4] = t;

		t = c[2];
		c[2] = c[8];
		c[8] = t;

		t = c[6];
		c[6] = c[9];
		c[9] = t;

		t = c[3];
		c[3] = c[12];
		c[12] = t;

		t = c[7];
		c[7] = c[13];
		c[13] = t;

		t = c[11];
		c[11] = c[14];
		c[14] = t;

		return this;
	},

	/**
	 * Function to create a translation matrix.
	 *
	 * @param {number} x - X component of translation matrix.
	 * @param {number} y - Y component of translation matrix.
	 * @param {number} z - Z component of translation matrix.
	 *
	 * @returns {ALMath.Matrix4} - A translation matrix.
	 */
	translate : function ( x, y, z ) {
		this.set(
			1, 0, 0, x,
			0, 1, 0, y,
			0, 0, 1, z,
			0, 0, 0, 1
		);

		return this;
	},

	/**
	 * Function to create a rotation matrix on X axis.
	 *
	 * @param {number} theta - rotation angle in degrees  on X axis.
	 *
	 * @returns {ALMath.Matrix4} - A rotation matrix on X axis.
	 */
	rotateX : function ( theta ) {
		var c = Math.cos( theta ), s = Math.sin( theta );
		this.set(
			1, 0,  0, 0,
			0, c, - s, 0,
			0, s,  c, 0,
			0, 0,  0, 1
		);

		return this;
	},

	/**
	 * Function to create a rotation matrix on Y axis.
	 *
	 * @param {number} theta - rotation angle in degrees  on Y axis.
	 *
	 * @returns {ALMath.Matrix4} - A rotation matrix on Y axis.
	 */
	rotateY : function ( theta ) {
		var c = Math.cos( theta ), s = Math.sin( theta );
		this.set(
			 c, 0, s, 0,
			 0, 1, 0, 0,
			- s, 0, c, 0,
			 0, 0, 0, 1
		);

		return this;
	},

	/**
	 * Function to create a rotation matrix on Z axis.
	 *
	 * @param {number} theta - rotation angle in degrees  on Z axis.
	 *
	 * @returns {ALMath.Matrix4} - A rotation matrix on Z axis.
	 */
	rotateZ : function ( theta ) {
		var c = Math.cos( theta ), s = Math.sin( theta );
		this.set(
			c, - s, 0, 0,
			s,  c, 0, 0,
			0,  0, 1, 0,
			0,  0, 0, 1
		);

		return this;
	},

	/**
	 * Function to create a rotation matrix on (X,Y,Z) axis.
	 *
	 * @param {number} x - rotation angle in degrees on X axis.
	 * @param {number} y - rotation angle in degrees  on Y axis.
	 * @param {number} z - rotation angle in degrees  on Z axis.
	 *
	 * @returns {ALMath.Matrix4} - A rotation matrix on (X,Y,Z) axis.
	 */
	rotate : function ( x, y, z ) {
		var rx, ry, rz, r;
		rx = new ALMath.Matrix4();
		ry = new ALMath.Matrix4();
		rz = new ALMath.Matrix4();
		rx.rotateX(x);
		ry.rotateY(y);
		rz.rotateZ(z);
		r = rz.multiply(ry);
		r = r.multiply(rx);
		return r;
	},

	/**
	 * Function to create a scale matrix.
	 *
	 * @param {number} x - scale factor on X axis.
	 * @param {number} y - scale factor on Y axis.
	 * @param {number} z - scale factor on Z axis.
	 *
	 * @returns {ALMath.Matrix4} - A scale matrix.
	 */
	scale : function ( x, y, z ) {
		this.set(
			x, 0, 0, 0,
			0, y, 0, 0,
			0, 0, z, 0,
			0, 0, 0, 1
		);

		return this;
	},

	/**
	 * Function to create a orthographic projection matrix.
	 *
	 * @params {number} left - Frustum left.
	 * @params {number} right - Frustum right.
	 * @params {number} top - Frustum top.
	 * @params {number} bottom - Frustum bottom.
	 * @params {number} near - Frustum near.
	 * @params {number} far - Frustum far.
	 *
	 * @returns {ALMath.Matrix4} - A orthographic projection matrix.
	 */
	orthographicProjection : function(left, right, top, bottom, near, far){
		var a = 2/(right-left);
		var b = 2/(top-bottom);
		var c = -2/(far-near);
		var d = -((right+left)/(right-left));
		var e = -((top+bottom)/(top-bottom));
		var f = -((far+near)/(far-near));

		var te = this.components;

		te[ 0 ] = a;		te[ 4 ] = 0;		te[ 8 ] = 0;		te[ 12 ] = 0;
		te[ 1 ] = 0;		te[ 5 ] = b;		te[ 9 ] = 0;		te[ 13 ] = 0;
		te[ 2 ] = 0;		te[ 6 ] = 0;		te[ 10 ] = c;		te[ 14 ] = 0;
		te[ 3 ] = d;		te[ 7 ] = e;		te[ 11 ] = f;		te[ 15 ] = 1;

		return this;
	},

	/**
	 * Function to create a perspective projection matrix.
	 *
	 * @params {number} fov - Angle of the frustum in degrees.
	 * @params {number} aspect - Aspect ratio.
	 * @params {number} zNear - Frustum near.
	 * @params {number} zFar - Frustum far.
	 *
	 * @returns {ALMath.Matrix4} - A perspective projection matrix.
	 */
	perspectiveProjection : function ( fov, aspect, zNear, zFar ) {
		var a = aspect;

		var tan=Math.tan(ALMath.degToRad(0.5*fov)),
        	A=-(zFar+zNear)/(zFar-zNear),
        	B=(-2*zFar*zNear)/(zFar-zNear);

    	var c = this.components;

    	c[ 0 ] = 0.5/tan;		c[ 4 ] = 0;				c[ 8 ] = 0;			c[ 12 ] = 0;
		c[ 1 ] = 0;				c[ 5 ] = (0.5*a/tan);	c[ 9 ] = 0;			c[ 13 ] = 0;
		c[ 2 ] = 0;				c[ 6 ] = 0;				c[ 10 ] = A;		c[ 14 ] = B;
		c[ 3 ] = 0;				c[ 7 ] = 0;				c[ 11 ] =-1;		c[ 15 ] = 0;

		return this;
	},

	/**
	 * Function to get a matrix that can be used to transform normals on the shaders.
	 *
	 * @params {boolean} scale - If true or undefined, the matrix has a scale component so to get Matrix that transform normal is necessary transpose the matrix and then invert it. If it is false the transpose is enough.
	 *
	 * @returns {ALMath.Matrix4} - Matrix that can be used in the shader to transform normals.
	 */
	getNormalMatrix : function (scale){
		var m3 = new ALMath.Matrix3();
		var c = this.components;

		if (scale === undefined || scale === true){
			m3.set(
				c[0], c[1], c[2],
				c[4], c[5], c[6],
				c[8], c[9], c[10]
			);
			m3 = m3.inverse().transpose();
		}else{
			m3.set(
				c[0], c[4], c[8],
				c[1], c[5], c[9],
				c[2], c[6], c[10]
			);
		}
		return m3;
	},

	/**
   	 * Function to compute matrix inverse.
   	 *
   	 * @returns {ALMath.Matrix4} - this that is the invert matrix.
   	 */
	getInverse : function (){
		var inv = new ALMath.Matrix4();
		var tc = this.components;
		var oc = inv.components;



		var n11 = tc[ 0 ], n21 = tc[ 1 ], n31 = tc[ 2 ], n41 = tc[ 3 ],
		n12 = tc[ 4 ], n22 = tc[ 5 ], n32 = tc[ 6 ], n42 = tc[ 7 ],
		n13 = tc[ 8 ], n23 = tc[ 9 ], n33 = tc[ 10 ], n43 = tc[ 11 ],
		n14 = tc[ 12 ], n24 = tc[ 13 ], n34 = tc[ 14 ], n44 = tc[ 15 ],

		t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44,
		t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44,
		t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44,
		t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;

		var det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;


		var detInv = 1 / det;

		oc[ 0 ] = t11 * detInv;
		oc[ 1 ] = ( n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44 ) * detInv;
		oc[ 2 ] = ( n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44 ) * detInv;
		oc[ 3 ] = ( n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43 ) * detInv;

		oc[ 4 ] = t12 * detInv;
		oc[ 5 ] = ( n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44 ) * detInv;
		oc[ 6 ] = ( n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44 ) * detInv;
		oc[ 7 ] = ( n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43 ) * detInv;

		oc[ 8 ] = t13 * detInv;
		oc[ 9 ] = ( n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44 ) * detInv;
		oc[ 10 ] = ( n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44 ) * detInv;
		oc[ 11 ] = ( n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43 ) * detInv;

		oc[ 12 ] = t14 * detInv;
		oc[ 13 ] = ( n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34 ) * detInv;
		oc[ 14 ] = ( n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34 ) * detInv;
		oc[ 15 ] = ( n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33 ) * detInv;


		return inv;

	},

	/**
	 * Function to create a lookAt matrix.
	 *
	 * @params {ALMath.Vector3} eye - Camera's position.
	 * @params {ALMath.Vector3} target - Where camera is looking.
	 * @params {ALMath.Vector3} up - Camera's up vector.
	 *
	 * @returns {ALMath.Matrix4} - A lookAt matrix.
	 */
	lookAt : function(eye, target, up){
		var eye = eye || new ALMath.Vector3();
		var up = up || new ALMath.Vector3();
		var target = target || new ALMath.Vector3();

		var c = this.components;

		var z = target.sub(eye);
		z = z.normalize();

		var x = z.cross(up);
		x = x.normalize();

		var y = x.cross(z);
		y = y.normalize();

		c[0] = x.x; c[1] = x.y; c[2] = x.z; c[3] = 0;
		c[4] = y.x; c[5] = y.y; c[6] = y.z; c[7] = 0;
		c[8] = -z.x; c[9] = -z.y; c[10] = -z.z; c[11] = 0;
		c[12] = eye.x; c[13] = eye.y; c[14] = eye.z; c[15] = 1;

		return this;
	},

	/**
   	 * Function clone a matrix.
   	 *
   	 * @returns {ALMath.Matrix4} - A copy of this.
   	 */
	clone : function(){
		c = this.components;
		cloned = new ALMath.Matrix4();
		cloned.set(c[0],c[1],c[2],c[3],c[4],c[5],c[6],c[7],c[8],c[9],c[10],c[11],c[12],c[13],c[14],c[15]);
		return cloned;
	},

	/**
   	 * Function compare two matrices.
   	 *
   	 * @returns {boolean} - true if this and v are equals, false otherwise.
   	 */
	equals : function (m){
		if (!(m instanceof ALMath.Matrix4)){
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