/**
 * Namespace where live all classes and function related to Math.
 *
 * @namespace
 */
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

/**
 * Class that represent a 2 dimensional vector.
 *
 * @class
 * @author Ángel Luis Perales Gómez

 * @param {number} x - X coordinate.
 * @param {number} y - Y coordinate.
 */
ALMath.Vector2 = function(x,y){
	this.x = x || 0;
	this.y = y || 0;
}

ALMath.Vector2.prototype = {
	/**
   	 * Function to add vector v.
   	 *
   	 * @param {ALMath.Vector2} v - Vector to add.
   	 *
   	 * @returns {ALMath.Vector2} - A new vector which is the sum between this and v.
   	 */
	add : function(v){
		return new ALMath.Vector2(this.x+v.x, this.y+v.y);
	},

	/**
   	 * Function to add scalar n.
   	 *
   	 * @param {number} n - Scalar to add.
   	 *
   	 * @returns {ALMath.Vector2} - A new vector which is the sum between each component of this and scalar n.
   	 */
	addScalar : function(n){
		return new ALMath.Vector2(this.x+n, this.y+n);
	},

	/**
   	 * Function to substract vector v.
   	 *
   	 * @param {ALMath.Vector2} v - Vector to substract.
   	 *
   	 * @returns {ALMath.Vector2} - A new vector which is the substract between this and v.
   	 */
	sub : function(v){
		return new ALMath.Vector2(this.x-v.x, this.y-v.y);
	},

	/**
   	 * Function to substract scalar n.
   	 *
   	 * @param {number} v - Scalar to substract.
   	 *
   	 * @returns {ALMath.Vector2} - A new vector which is the substract between each component of this and scalar n.
   	 */
	subScalar : function(n){
		return new ALMath.Vector2(this.x-n, this.y-n);
	},

	/**
   	 * Function to multipy by vector v.
   	 *
   	 * @param {ALMath.Vector2} v - Vector to multiply.
   	 *
   	 * @returns {ALMath.Vector2} - A new vector which is the multiplication between this and v.
   	 */
	multiply : function(v){
		return new ALMath.Vector2(this.x*v.x, this.y*v.y);
	},

	/**
   	 * Function to multiply by scalar n.
   	 *
   	 * @param {number} n - Scalar to multiply.
   	 *
   	 * @returns {ALMath.Vector2} - A new vector which is the multiplication between each component of this and scalar n.
   	 */
	multiplyByScalar : function(n){
		return new ALMath.Vector2(this.x*n, this.y*n);
	},

	/**
   	 * Function to divide by vector v.
   	 *
   	 * @param {ALMath.Vector2} v - Vector to divide.
   	 *
   	 * @throws Division by zero.
   	 *
   	 * @returns {ALMath.Vector2} - A new vector which is the divison between this and v.
   	 */
	divide : function(v){
		if (v.x === 0 || v.y === 0){
			throw new Error("ALMath.Vector2.divide(v): Division by zero.")
		}
		return new ALMath.Vector2(this.x/v.x, this.y/v.y);
	},

	/**
   	 * Function to divide by scalar n.
   	 *
   	 * @param {number} n - Scalar to divide.
   	 *
   	 * @throws Division by zero.
   	 *
   	 * @returns {ALMath.Vector2} - A new vector which is the division between each component of this and scalar n.
   	 */
	divideByScalar : function(n){
		if (n === 0){
			throw new Error("ALMath.Vector2.divideByScalar(n): Division by zero.")
		}
		return new ALMath.Vector2(this.x/n, this.y/n);
	},

	/**
   	 * Function to clamp between min and max.
   	 *
   	 * @param {number} min - Min value.
   	 * @param {number} max - Max value.
   	 *
   	 * @returns {ALMath.Vector2} - A new vector clamped between min and max.
   	 */
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

	/**
   	 * Function to floor vector.
   	 *
   	 * @returns {ALMath.Vector2} - A new vector floored.
   	 */
	floor: function () {
		var x = Math.floor( this.x );
		var y = Math.floor( this.y );

		return ALMath.Vector2(this.x,this.y);
	},

	/**
   	 * Function to ceil vector.
   	 *
   	 * @returns {ALMath.Vector2} - A new vector ceiled.
   	 */
	ceil: function () {
		var x = Math.ceil( this.x );
		var y = Math.ceil( this.y );

		return ALMath.Vector2(this.x,this.y);
	},

	/**
   	 * Function to round between min and max.
   	 *
   	 * @returns {ALMath.Vector2} - A new vector rounded.
   	 */
	round: function () {
		var x = Math.round( this.x );
		var x = Math.round( this.y );

		return ALMath.Vector2(this.x,this.y);
	},

	/**
   	 * Function to negate vector.
   	 *
   	 * @returns {ALMath.Vector2} - A new vector with each component negate.
   	 */
	negate: function () {
		return ALMath.Vector2(-this.x,-this.y);
	},

	/**
   	 * Function to compute dot product.
   	 *
   	 * @param {ALMath.Vector2} v - Vector to do the dot product.
   	 *
   	 * @returns {number} - Dot product between this and v.
   	 */
	dot: function ( v ) {
		return this.x * v.x + this.y * v.y;
	},

	/**
   	 * Function to compute length of the vector.
   	 *
   	 * @returns {number} - Vector length.
   	 */
	length: function () {
		return Math.sqrt( this.x * this.x + this.y * this.y );
	},

	/**
   	 * Function to normalize vector.
   	 *
   	 * @returns {number} - A new vector normalized.
   	 */
	normalize: function () {
		return this.divideByScalar( this.length() );
	},

	/**
   	 * Function to compute distance between vectors.
   	 *
   	 * @param {ALMath.Vector2} v - Vector to compute the distance.
   	 *
   	 * @returns {number} - Distance between this and v.
   	 */
	distanceTo: function ( v ) {
		return Math.sqrt( (this.x - v.x) * (this.x - v.x) + (this.y - v.y) * (this.y - v.y) );
	},

	/**
   	 * Function to set the vector components.
   	 *
   	 * @param {number} x - X component.
   	 * @param {number} y - Y component.
   	 *
   	 * @returns {ALMath.Vector2} - this.
   	 */
	set : function(x, y){
		this.x = x;
		this.y = y;

		return this;
	},

	/**
   	 * Function to clone vectors.
   	 *
   	 * @returns {ALMath.Vector2} - A copy of this.
   	 */
	clone : function(){
		return new ALMath.Vector2(this.x, this.y);
	},

	/**
   	 * Function to compare vectors.
   	 *
   	 * @param {ALMath.Vector2} v - Vector to compare.
   	 *
   	 * @returns {boolean} - True if this and v are equals, false otherwise.
   	 */
	equals : function (v){
		if ((!v instanceof ALMath.Vector2)){
			return false;
		}
		return (this.x === v.x) && (this.y === v.y);
	}
}