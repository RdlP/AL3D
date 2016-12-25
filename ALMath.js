var ALMath = {
	version : "0.2 {Angel Luis Math Library}",
	license: "The MIT License (MIT) \
		\
		Copyright (c) <year> <copyright holders> \
		\
		Permission is hereby granted, free of charge, to any person obtaining a copy \
		of this software and associated documentation files (the 'Software'), to deal \
		in the Software without restriction, including without limitation the rights \
		to use, copy, modify, merge, publish, distribute, sublicense, and/or sell \
		copies of the Software, and to permit persons to whom the Software is \
		furnished to do so, subject to the following conditions: \
		\
		The above copyright notice and this permission notice shall be included in \
		all copies or substantial portions of the Software. \
		\
		THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR \
		IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, \
		FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE \
		AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER \
		LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, \
		OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN \
		THE SOFTWARE.",
	degToRad : function (deg){
		return deg * (Math.PI/180);
	},
	radToDeg : function(rad){
		return rad * (180/Math.PI);
	}
}

ALMath.Vector2 = function(x,y){
	this.x = x || 0;
	this.y = y || 0;
}

ALMath.Vector3 = function(x,y,z){
	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
}

ALMath.Vector4 = function(x,y,z,w){
	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
	this.w = w===undefined?1:w;
}


ALMath.Quaternion = function ( x, y, z, w ) {

	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
	this.w = ( w !== undefined ) ? w : 1;

};

ALMath.Matrix3 = function(){
	this.components = new Float32Array([
		1,0,0,
		0,1,0,
		0,0,1
	]);
}

ALMath.Matrix4 = function(){
	this.components = new Float32Array([
		1,0,0,0,
		0,1,0,0,
		0,0,1,0,
		0,0,0,1
	]);
}

ALMath.Vector2.prototype = {

	add : function(v){
		return new ALMath.Vector2(this.x+v.x, this.y+v.y);
	},

	addScalar : function(n){
		return new ALMath.Vector2(this.x+n, this.y+n);
	},

	sub : function(v){
		return new ALMath.Vector2(this.x-v.x, this.y-v.y);
	},

	subScalar : function(n){
		return new ALMath.Vector2(this.x-n, this.y-n);
	},

	multiply : function(v){
		return new ALMath.Vector2(this.x*v.x, this.y*v.y);
	},

	multiplyByScalar : function(n){
		return new ALMath.Vector2(this.x*n, this.y*n);
	},

	divide : function(v){
		if (v.x === 0 || v.y === 0){
			throw new Error("ALMath.Vector2.divide(v): Division by zero.")
		}
		return new ALMath.Vector2(this.x/v.x, this.y/v.y);
	},

	divideByScalar : function(n){
		if (n === 0){
			throw new Error("ALMath.Vector2.divideByScalar(n): Division by zero.")
		}
		return new ALMath.Vector2(this.x/n, this.y/n);
	},

	clamp : function(min, max){
		var x=this.x,y=this.y;
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

		return new ALMath.Vector2(x,y);
	},

	floor: function () {
		var x = Math.floor( this.x );
		var y = Math.floor( this.y );

		return ALMath.Vector2(this.x,this.y);
	},

	ceil: function () {
		var x = Math.ceil( this.x );
		var y = Math.ceil( this.y );

		return ALMath.Vector2(this.x,this.y);
	},

	round: function () {
		var x = Math.round( this.x );
		var x = Math.round( this.y );

		return ALMath.Vector2(this.x,this.y);
	},

	negate: function () {
		return ALMath.Vector2(-this.x,-this.y);
	},

	dot: function ( v ) {
		return this.x * v.x + this.y * v.y;
	},

	length: function () {
		return Math.sqrt( this.x * this.x + this.y * this.y );
	},

	normalize: function () {
		return this.divideByScalar( this.length() );
	},

	distanceTo: function ( v ) {
		return Math.sqrt( (this.x - v.x) * (this.x - v.x) + (this.y - v.y) * (this.y - v.y) );
	},

	set : function(x, y){
		this.x = x;
		this.y = y;

		return this;
	},

	clone : function(){
		return new ALMath.Vector2(this.x, this.y);
	},

	equals : function (v){
		if ((!v instanceof ALMath.Vector2)){
			return false;
		}
		return (this.x === v.x) && (this.y === v.y);
	}
}

ALMath.Vector3.prototype = {

	add : function(v){
		return new ALMath.Vector3(this.x+v.x, this.y+v.y, this.z+v.z);
	},

	addScalar : function(n){
		return new ALMath.Vector3(this.x+n, this.y+n, this.z+n);
	},

	sub : function(v){
		return new ALMath.Vector3(this.x-v.x, this.y-v.y, this.z-v.z);
	},

	subScalar : function(n){
		return new ALMath.Vector3(this.x-n, this.y-n, this.z-n);
	},

	multiply : function(v){
		return new ALMath.Vector3(this.x*v.x, this.y*v.y, this.z*v.z);
	},

	multiplyByScalar : function(n){
		return new ALMath.Vector3(this.x*n, this.y*n, this.z*n);
	},

	divide : function(v){
		if (v.x === 0 || v.y === 0 || v.z === 0){
			throw new Error("ALMath.Vector3.divide(v): Division by zero.")
		}
		return new ALMath.Vector3(this.x/v.x, this.y/v.y, this.z/v.z);
	},

	divideByScalar : function(n){
		if (n === 0){
			throw new Error("ALMath.Vector3.divideByScalar(n): Division by zero.")
		}
		return new ALMath.Vector3(this.x/n, this.y/n, this.z/n);
	},

	clamp : function(min, max){
		var x = this.x;
		var y = this.y;
		var z = this.z;
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

		return new ALMath.Vector3(x,y,z);
	},

	floor : function () {
		var x = Math.floor( this.x );
		var y = Math.floor( this.y );
		var z = Math.floor( this.z );

		return new ALMath.Vector3(x,y,z);
	},

	ceil : function () {
		var x = Math.ceil( this.x );
		var y = Math.ceil( this.y );
		var z = Math.ceil( this.z );

		return new ALMath.Vector3(x,y,z);
	},

	round : function () {
		var x = Math.round( this.x );
		var y = Math.round( this.y );
		var z = Math.round( this.z );

		return new ALMath.Vector3(x,y,z);
	},

	negate : function () {
		return new ALMath.Vector3(-this.x, -this.y, -this.z);
	},

	dot : function ( v ) {
		return this.x * v.x + this.y * v.y + this.z * v.z;
	},

	cross : function(v){
		var x = this.x, y = this.y, z = this.z;

		var nx = y * v.z - z * v.y;
		var ny = z * v.x - x * v.z;
		var nz = x * v.y - y * v.x;

		return new ALMath.Vector3(nx,ny,nz);
	},

	length : function () {
		// Maybe it could be : return Math.sqrt( this.dot(this) );
		return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );
	},

	squareLength : function () {
		// Maybe it could be : return this.dot(this);
		return this.x * this.x + this.y * this.y + this.z * this.z;
	},

	normalize : function () {
		return this.divideByScalar( this.length() );
	},

	distanceTo : function ( v ) {
		return Math.sqrt( (this.x - v.x) * (this.x - v.x) + (this.y - v.y) * (this.y - v.y) + (this.z - v.z) * (this.z - v.z ));
	},

	set : function(x, y, z){
		this.x = x;
		this.y = y;
		this.z = z;
	},

	getForGL : function (){
		return new Float32Array([this.x, this.y, this.z]);
	},

	clone : function(){
		return new ALMath.Vector3(this.x, this.y, this.z);
	},

	equals : function (v){
		if (!(v instanceof ALMath.Vector3)){
			return false;
		}
		return (this.x === v.x) && (this.y === v.y) && (this.z === v.z);
	}
}

ALMath.Vector4.prototype = {

	add : function(v){
		return new ALMath.Vector4(this.x+v.x,this.y+v.y,this.z+v.z,this.w+v.w);
	},

	addScalar : function(n){
		return new ALMath.Vector4(this.x+n,this.y+n,this.z+n,this.w+n);
	},

	sub : function(v){
		return new ALMath.Vector4(this.x-v.x,this.y-v.y,this.z-v.z,this.w-v.w);
	},

	subScalar : function(n){
		return new ALMath.Vector4(this.x-n,this.y-n,this.z-n,this.w-n);
	},

	multiply : function(v){
		return new ALMath.Vector4(this.x*v.x,this.y*v.y,this.z*v.z,this.w*v.w);
	},

	multiplyByScalar : function(n){
		return new ALMath.Vector4(this.x*n,this.y*n,this.z*n,this.w*n);
	},

	divide : function(v){
		if (v.x === 0 || v.y === 0 || v.z === 0 || v.w === 0){
			throw new Error("ALMath.Vector4.divide(v): Division by zero.")
		}
		return new ALMath.Vector4(this.x/v.x,this.y/v.y,this.z/v.z,this.w/v.w);
	},

	divideByScalar : function(n){
		if (n === 0){
			throw new Error("ALMath.Vector4.divideByScalar(n): Division by zero.")
		}
		return new ALMath.Vector4(this.x/n,this.y/n,this.z/n,this.w/n);
	},

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

	floor : function () {
		var x = Math.floor( this.x );
		var y = Math.floor( this.y );
		var z = Math.floor( this.z );
		var w = Math.floor( this.w );

		return new ALMath.Vector4(x,y,z,w);
	},

	ceil : function () {
		var x = Math.ceil( this.x );
		var y = Math.ceil( this.y );
		var z = Math.ceil( this.z );
		var w = Math.ceil( this.w );

		return new ALMath.Vector4(x,y,z,w);
	},

	round : function () {
		var x = Math.round( this.x );
		var y = Math.round( this.y );
		var z = Math.round( this.z );
		var w = Math.round( this.w );

		return new ALMath.Vector4(x,y,z,w);
	},

	negate : function () {
		return new ALMath.Vector4(-this.x,-this.y,-this.z,-this.w);
	},

	dot : function ( v ) {
		return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
	},

	length : function () {
		// Maybe it could be : return Math.sqrt( this.dot(this) );
		return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w );
	},

	normalize : function () {
		return this.divideByScalar( this.length() );
	},

	distanceTo : function ( v ) {
		return Math.sqrt( (this.x - v.x) * (this.x - v.x) + (this.y - v.y) * (this.y - v.y) + (this.z - v.z) * (this.z - v.z ) + (this.w - v.w) * (this.w - v.w ));
	},

	set : function(x, y, z, w){
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
	},

	getForGL : function(){
		return new Float32Array([this.x, this.y, this.z, this.w]);
	},

	clone : function(){
		return new ALMath.Vector3(this.x, this.y, this.z, this.w);
	},

	equals : function (v){
		if (!(v instanceof ALMath.Vector4)){
			return false;
		}
		return (this.x === v.x) && (this.y === v.y) && (this.z === v.z) && (this.w === v.w);
	}
}

ALMath.Quaternion.prototype = {
	lenght : function(){
		return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w );
	},

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

	multiply : function(q){
		var nx,ny,nz,nw;
		nw = this.w*q.w - this.x*q.x - this.y*q.y - this.z*q.z;
		nx = this.w*q.x + this.x*q.w + this.y*q.z - this.z*q.y;
		ny = this.w*q.y + this.y*q.w + this.z*q.x - this.x*q.z;
		nz = this.w*q.z + this.z*q.w + this.x*q.y - this.y*q.x;

		return new ALMath.Quaternion(nx,ny,nz,nw);
	},

	conjugate : function (){
		return new ALMath.Quaternion(-this.x, -this.y, -this.z, this.w);
	},

	inverse : function (){
		return this.conjugate().normalize();
	},

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

	getEuler : function (){
		/*var p = Math.asin(-2*(this.y*this.z - this.w*this.x));
		var h,b;
		if (Math.cos(p)===0){
			h = Math.atan2(-this.x*this.z + this.w*this.y, 0.5 - this.y*this.y - this.z*this.z);
			b = 0;
		}else{
			h = Math.atan2(this.x*this.z + this.w*this.y, 0.5 - this.x*this.x - this.y*this.y);
			b = Math.atan2(this.x*this.y + this.w*this.z, 0.5 - this.x*this.x - this.z*this.z);
		}
		//p = (p > 0 ? p : (2*Math.PI + p)) * 360 / (2*Math.PI);
		//h = (h > 0 ? h : (2*Math.PI + h)) * 360 / (2*Math.PI);
		//b = (b > 0 ? b : (2*Math.PI + b)) * 360 / (2*Math.PI);
		//p = ALMath.radToDeg(p);
		if (p < 0){
			p+=360;
		}
		//h = ALMath.radToDeg(h);
		if (h < 0){
			h+=360;
		}
		//b = ALMath.radToDeg(b);
		if (b < 0){
			b+=360;
		}*/

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

ALMath.Matrix3.prototype = {

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

	identity : function(){
		this.set(
			1, 0, 0,
			0, 1, 0,
			0, 0, 1
		);
	},

	multiplyByVector : function(v){
		var c = this.components;
		return new ALMath.Vector3(c[0]*v.x+c[1]*v.y+c[2]*v.z, c[3]*v.x+c[4]*v.y+c[5]*v.z, c[6]*v.x+c[7]*v.y+c[8]*v.z);
	},

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

	determinant : function(){
		var c = this.components;
		return c[0]*c[4]*c[8]-c[0]*c[5]*c[7]-c[1]*c[3]*c[8]+c[1]*c[5]*c[6]+c[1]*c[3]*c[7]-c[2]*c[4]*c[6];
	},

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
	
	clone : function(){
		c = this.components;
		cloned = new ALMath.Matrix3();
		cloned.set(c[0],c[1],c[2],c[3],c[4],c[5],c[6],c[7],c[8]);
	},

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

ALMath.Matrix4.prototype = {

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

	identity : function () {
		this.set(
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		);
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

	multiplyByVector : function (v){
		/*var vector = v;
		if (v instanceof ALMath.Vector3){
			vector = new ALMath.Vector4(v.x,v.y,v.z,0);
		}*/
		var result,nx,ny,nz;
		var c = this.components;
		nx = c[0]*v.x+c[4]*v.y+c[8]*v.z+c[12];
		ny = c[1]*v.x+c[5]*v.y+c[9]*v.z+c[13];
		nz = c[2]*v.x+c[6]*v.y+c[10]*v.z+c[14];
		return new ALMath.Vector3(nx,ny,nz);
	},

	multiplyByVector4 : function (v){
		/*var vector = v;
		if (v instanceof ALMath.Vector3){
			vector = new ALMath.Vector4(v.x,v.y,v.z,0);
		}*/
		var result,nx,ny,nz,nw;
		var c = this.components;
		nx = c[0]*v.x+c[4]*v.y+c[8]*v.z+c[12]*v.w;
		ny = c[1]*v.x+c[5]*v.y+c[9]*v.z+c[13]*v.w;
		nz = c[2]*v.x+c[6]*v.y+c[10]*v.z+c[14]*v.w;
		nw = c[3]*v.x+c[7]*v.y+c[11]*v.z+c[15]*v.w;
		/*nx = c[0]*v.x+c[1]*v.y+c[2]*v.z+c[3]*v.w;
		ny = c[4]*v.x+c[5]*v.y+c[6]*v.z+c[7]*v.w;
		nz = c[8]*v.x+c[9]*v.y+c[10]*v.z+c[11]*v.w;
		nw = c[12]*v.x+c[13]*v.y+c[14]*v.z+c[15]*v.w;*/
		return new ALMath.Vector4(nx,ny,nz,nw);
	},

	transformPoint : function(v){
		//var vec4 = this.multiplyByVector(v);
		/*vec4.x = vec4.x / vec4.w;
		vec4.y = vec4.y / vec4.w;
		vec4.z = vec4.z / vec4.w;
		vec4.w = 1;*/
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

	translate : function ( x, y, z ) {
		this.set(
			1, 0, 0, x,
			0, 1, 0, y,
			0, 0, 1, z,
			0, 0, 0, 1
		);

		return this;
	},

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

	scale : function ( x, y, z ) {
		this.set(
			x, 0, 0, 0,
			0, y, 0, 0,
			0, 0, z, 0,
			0, 0, 0, 1
		);

		return this;
	},

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