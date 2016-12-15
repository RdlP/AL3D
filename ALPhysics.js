var ALPhysics = {
	version : "0.05 {Angel Luis Physics Library}",
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
		THE SOFTWARE."
}

ALPhysics.RigidBody = function(position, mass, restitution){
	this.mass = mass;
	this.position = position || new ALMath.Vector3();
	this.forceNet = new ALMath.Vector3();
	this.velocity = new ALMath.Vector3();
	this.transform = new ALMath.Matrix4();
	this.restitution = restitution || 1;
	this.primitives = [];

}

ALPhysics.ForceGenerator = function(){

}

ALPhysics.GravityGenerator = function(gravity){
	this.gravity = gravity || new ALMath.Vector3(0,-9.8,0);
}

ALPhysics.World = function(gravity){
	this.bodies = [];
	this.gravityGenerator = new ALPhysics.GravityGenerator(gravity);
	this.solver = new ALPhysics.CollisionResolver();
}

ALPhysics.Collision = function(){
	this.point = undefined;
	this.normal = undefined;
	this.depth = undefined;
	this.restitution = undefined;
	this.friction = undefined;
	this.body = [];
}

ALPhysics.PotentialCollision = function(one, two){
	this.bodies = [];
	this.bodies.push(one);
	this.bodies.push(two);
}

ALPhysics.Primitive = function (offset){
	this.transform = new ALMath.Matrix4();
	this.offset = offset || new ALMath.Vector3();
	this.position = undefined;
	this.body = undefined;
}

ALPhysics.Primitive.prototype = {
	getXAxis : function(){
		return new ALMath.Vector3(this.transform.components[0], this.transform.components[4], this.transform.components[8]);
	},
	getYAxis : function(){
		return new ALMath.Vector3(this.transform.components[1], this.transform.components[5], this.transform.components[9]);
	},
	getZAxis : function(){
		return new ALMath.Vector3(this.transform.components[2], this.transform.components[6], this.transform.components[10]);
	},
	getAxis : function(i){
		if (i===0){
			return this.getXAxis();
		}else if (i===1){
			return this.getYAxis();
		}else if (i===2){
			return this.getZAxis();
		}
	}
}

ALPhysics.Sphere = function(radius){
	ALPhysics.Primitive.call(this);
	this.radius = radius;
}

ALPhysics.Box = function(halfSize){
	ALPhysics.Primitive.call(this);
	this.halfSize = halfSize;
}

ALPhysics.Box.prototype = {
	getXAxis : function(){
		return new ALMath.Vector3(this.transform.components[0], this.transform.components[4], this.transform.components[8]);
	},
	getYAxis : function(){
		return new ALMath.Vector3(this.transform.components[1], this.transform.components[5], this.transform.components[9]);
	},
	getZAxis : function(){
		return new ALMath.Vector3(this.transform.components[2], this.transform.components[6], this.transform.components[10]);
	},
	getAxis : function(i){
		if (i===0){
			return this.getXAxis();
		}else if (i===1){
			return this.getYAxis();
		}else if (i===2){
			return this.getZAxis();
		}
	}
}


ALPhysics.NarrowPhase = function(){
	this.collisions = [];
}

ALPhysics.BroadPhase = function(){

}

ALPhysics.CollisionResolver = function(){
	this.broadPhase = new ALPhysics.BroadPhase();
	this.narrowPhase = new ALPhysics.NarrowPhase();
}

ALPhysics.PotentialCollision.prototype = {
	equals : function (other){
		if (!(other instanceof ALPhysics.PotentialCollision)){
			return false;
		}
		return ((this.bodies[0] === other.bodies[0] && this.bodies[1] === other.bodies[1]) ||
				(this.bodies[0] === other.bodies[1] && this.bodies[1] === other.bodies[0]));
	}
}

ALPhysics.RigidBody.prototype = {
	get mass(){
		if (this.inverseMass === 0){
			return 999999;
		}
		return 1/this.inverseMass;
	},
	set mass(value){
		if (value === 0){
			this.inverseMass = 0;
		}else{
			this.inverseMass = 1/value;
		}
	},
	hasFiniteMass : function(){
		return this.inverseMass >= 0;
	},
	addForce : function (force){
		this.forceNet = this.forceNet.add(force);
	},
	addPrimitive : function (primitive){
		primitive.body = this;
		this.primitives.push(primitive);
		this.updateInternals();
	},
	integrate : function (dt){
		if (this.inverseMass <= 0) {
			return;
		}
		this.position = this.position.add(this.velocity.multiplyByScalar(dt));
		var acc = this.forceNet.multiplyByScalar(this.inverseMass);
		this.velocity =  this.velocity.add(acc.multiplyByScalar(dt));
		this.clearForces();
		this.updateInternals();
	},
	updateInternals : function(){
		this.transform.components[12] = this.position.x;
		this.transform.components[13] = this.position.y;
		this.transform.components[14] = this.position.z;
		for (var i = 0; i < this.primitives.length; i++){
			this.primitives[i].transform.components[12] = this.transform.components[12]+this.primitives[i].offset.x;
			this.primitives[i].transform.components[13] = this.transform.components[13]+this.primitives[i].offset.y;
			this.primitives[i].transform.components[14] = this.transform.components[14]+this.primitives[i].offset.z;
			this.primitives[i].position = new ALMath.Vector3(this.primitives[i].transform.components[12],this.primitives[i].transform.components[13],this.primitives[i].transform.components[14]);
		}
	},
	clearForces : function (){
		this.forceNet = new ALMath.Vector3();
	}
}

ALPhysics.GravityGenerator.prototype = {
	updateForce : function (body, dt){
		if (!body.hasFiniteMass()){
			return undefined;
		}
		body.addForce(this.gravity.multiplyByScalar(body.mass));
	}
}

ALPhysics.World.prototype = {
	step : function(dt){
		for (var i = 0; i < this.bodies.length; i++){
			this.gravityGenerator.updateForce(this.bodies[i], dt);
			this.bodies[i].integrate(dt);
		}
		if (this.bodies.length > 0){
			this.solver.solve(this.bodies, dt);
		}

	},
	addBody : function (body){
		this.bodies.push(body);
	}
}

ALPhysics.NarrowPhase.prototype = {
	compute : function(potentialCollisions){
		var collision, shape1, shape2;
		this.collisions = [];
		for (var i = 0; i < potentialCollisions.length; i++){
			collision = -1;
			shape1 = potentialCollisions[i].bodies[0];
			shape2 = potentialCollisions[i].bodies[1];
			if (shape1 instanceof ALPhysics.Box && shape2 instanceof ALPhysics.Sphere){
				collision = this.sphereAndBox(shape2, shape1);
			}
			if (shape2 instanceof ALPhysics.Box && shape1 instanceof ALPhysics.Sphere){
				collision = this.sphereAndBox(shape1, shape2);
			}
			if (shape1 instanceof ALPhysics.Box && shape2 instanceof ALPhysics.Box){
				collision = this.boxAndBox(shape1, shape2);
			}
			if (shape1 instanceof ALPhysics.Sphere && shape2 instanceof ALPhysics.Sphere){
				collision = this.sphereAndSphere(shape1, shape2);
			}
			if (collision !== -1){
				this.collisions.push(collision);
			}
		}
		return this.collisions;
	},
	sphereAndSphere : function(one, two){
		var oneToTwo = one.position.sub(two.position);
		var oneToTwoLength = oneToTwo.length();
		if (oneToTwoLength < 0 || oneToTwoLength > one.radius + two.radius){
			return -1;
		}
		var normal = oneToTwo.divideByScalar(oneToTwoLength);
		var data = new ALPhysics.Collision();
		data.normal = normal;
		data.point = one.position+oneToTwo*0.5;
		data.depth = one.radius+two.radius - oneToTwoLength;
		data.body = [];
		data.body.push(one);
		data.body.push(two);
		data.restitution = Math.min(one.body.restitution, two.body.restitution);
		return data;
	},
	checkAxis : function (one, two, toCenter, axis, penetration, i){
		var a = axis.normalize();
		var pen = this.penetrationOnAxis(one,two,a,toCenter);
		if (pen < 0) return false;
		if (pen < penetration){
			var r = [pen, i]
			return r;
		}
	},
	fillCollisionDataForBoxBox : function (one, two, toCenter, best, penetration){
		var normal = one.getAxis(best).clone();
		if (one.getAxis(best).dot(toCenter) > 0)
	    {
	        normal = normal.multiplyByScalar(-1);
	    }
	    var vertex = two.halfSize.clone();
	    if (two.getAxis(0).dot(normal) < 0) vertex.x = - vertex.x;
	    if (two.getAxis(1).dot(normal) < 0) vertex.y =  - vertex.y;
	    if (two.getAxis(2).dot(normal) < 0) vertex.z = - vertex.z;
	    var data = new ALPhysics.Collision();
		data.normal = normal;
		data.point = two.transform.multiplyByVector(vertex);
		data.depth = penetration;
		data.body = [];
		data.body.push(one);
		data.body.push(two);
		data.restitution = Math.min(one.body.restitution, two.body.restitution);
		return data;
	},
	penetrationOnAxis : function(one,two,axis,toCenter){
		var oneProject = this.projectToAxis(one,axis);
		var twoProject = this.projectToAxis(two,axis);
		var distance = Math.abs(toCenter.dot(axis));
		return oneProject+twoProject-distance;
	},
	projectToAxis : function(box, axis){
		return box.halfSize.x * (axis.dot(box.getXAxis()))+
			box.halfSize.y * (axis.dot(box.getYAxis()))+
			box.halfSize.z * (axis.dot(box.getZAxis()));
	},
	boxAndBox : function(one,two){
		var axis = [];
		var toCenter;
		var penetration = 0xFFFFFFFF, best = 0xFFFFFFFF;
		var result;

		toCenter = two.position.sub(one.position);

		//First
		result = this.checkAxis(one,two, toCenter, one.getXAxis(), penetration, 0);
		if (result === false){
			return -1;
		}
		if (result !== undefined){
			penetration = result[0];
			best = result[1];
		}
		result = this.checkAxis(one,two, toCenter, one.getYAxis(), penetration, 1);
		if (result === false){
			return -1;
		}
		if (result !== undefined){
			penetration = result[0];
			best = result[1];
		}
		result = this.checkAxis(one,two, toCenter, one.getZAxis(), penetration, 2);
		if (result === false){
			return -1;
		}
		if (result !== undefined){
			//penetration = result[0];
			//best = result[1];
		}

		// Second
		result = this.checkAxis(one,two, toCenter, two.getXAxis(), penetration, 3);
		if (result === false){
			return -1;
		}
		if (result !== undefined){
			penetration = result[0];
			best = result[1];
		}
		result = this.checkAxis(one,two, toCenter, two.getYAxis(), penetration, 4);
		if (result === false){
			return -1;
		}
		if (result !== undefined){
			penetration = result[0];
			best = result[1];
		}
		result = this.checkAxis(one,two, toCenter, two.getZAxis(), penetration, 5);
		if (result === false){
			return -1;
		}
		if (result !== undefined){
			//penetration = result[0];
			//best = result[1];
		}
		var data;
		if (best < 3)
	    {
	        // We've got a vertex of box two on a face of box one.
	        data = this.fillCollisionDataForBoxBox(one, two, toCenter, best, penetration);
	    }
	    else if (best < 6)
	    {
	        data = this.fillCollisionDataForBoxBox(two, one, toCenter.multiplyByScalar(-1.0), best-3, penetration);
	    }
	    return data;
		/*axis.push(one.getXAxis());
		axis.push(one.getYAxis());
		axis.push(one.getZAxis());*/

		/*axis.push(two.getXAxis());
		axis.push(two.getYAxis());
		axis.push(two.getZAxis());*/

		//FIX: En 2D Z=0 por tanto cuando se hace el producto vectorial con Z sale un vector (0,0,0) que da fallo en el bucle de abajo
		// a la hora de hacer var a = axis[i].normalize() ya que intenta dividir por 0.

		/*axis.push(one.getXAxis().cross(two.getXAxis()));
		axis.push(one.getXAxis().cross(two.getYAxis()));
		axis.push(one.getXAxis().cross(two.getZAxis()));

		axis.push(one.getYAxis().cross(two.getXAxis()));
		axis.push(one.getYAxis().cross(two.getYAxis()));
		axis.push(one.getYAxis().cross(two.getZAxis()));

		axis.push(one.getZAxis().cross(two.getXAxis()));
		axis.push(one.getZAxis().cross(two.getYAxis()));
		axis.push(one.getZAxis().cross(two.getZAxis()));*/
	},
	sphereAndBox : function (sphere, box){
		var center = box.position.sub(sphere.position);
		var relCenter = box.transform.getInverse().multiplyByVector(center);
		if (Math.abs(relCenter.x) - sphere.radius > box.halfSize.x ||
			Math.abs(relCenter.y) - sphere.radius > box.halfSize.y ||
			Math.abs(relCenter.z) - sphere.radius > box.halfSize.z){
			return -1;
		}
		var closestPoint = new ALMath.Vector3();

		var dist = relCenter.x;
		if (dist > box.halfSize.x) dist = box.halfSize.x;
		if (dist < -box.halfSize.x) dist = -box.halfSize.x;
		closestPoint.x = dist;

		dist = relCenter.y;
		if (dist > box.halfSize.y) dist = box.halfSize.y;
		if (dist < -box.halfSize.y) dist = -box.halfSize.y;
		closestPoint.y = dist;

		dist = relCenter.z;
		if (dist > box.halfSize.z) dist = box.halfSize.z;
		if (dist < -box.halfSize.z) dist = -box.halfSize.z;
		closestPoint.z = dist;

		dist = (closestPoint.sub(relCenter)).squareLength();
		if (dist > sphere.radius * sphere.radius){
			return -1;
		}

		var worldPointCollision = box.transform.multiplyByVector(closestPoint);

		var data = new ALPhysics.Collision();
		data.normal = worldPointCollision.sub(center).normalize();
		data.point = worldPointCollision;
		data.depth = sphere.radius - (Math.sqrt(dist));
		data.body = [];
		data.body.push(sphere);
		data.body.push(box);
		data.restitution = Math.min(sphere.body.restitution, box.body.restitution);
		return data;
	}
}

ALPhysics.BroadPhase.prototype = {
	compute : function (bodies){
		this.potentialCollisions = []
		for (var i = 0; i < bodies.length; i++){
			for (var j = 0; j< bodies.length; j++){
				if (bodies[i] === bodies[j]){
					continue;
				}
				for (var a = 0; a < bodies[i].primitives.length; a++){
					for (var b = 0; b < bodies[j].primitives.length; b++){
						var potentialCollision = new ALPhysics.PotentialCollision(bodies[i].primitives[a],bodies[j].primitives[b]);
						var add = true;
						for (var k=0; k < this.potentialCollisions.length; k++){
							if (potentialCollision.equals(this.potentialCollisions[k])){
								add = false;
							}
						}
						if (add){
							this.potentialCollisions.push(new ALPhysics.PotentialCollision(bodies[i].primitives[a],bodies[j].primitives[b]));
						}
					}
				}
				
			}
		}
		return this.potentialCollisions;
	}
}

ALPhysics.CollisionResolver.prototype = {
	solve : function(bodies, dt){
		var potentialCollisions = this.broadPhase.compute(bodies);
		var collisions = this.narrowPhase.compute(potentialCollisions);
		// Collision resolution
		for (var i = 0; i < collisions.length; i++){
			this.solveInterpenetration(collisions[i]);
			this.solveVelocity(collisions[i]);
		}
	},
	solveInterpenetration : function (collision){
		var body1 = collision.body[0].body;
		var body2 = collision.body[1].body;
		if (collision.depth <= 0){
			return;
		}
		var totalIMass = body1.inverseMass+body2.inverseMass;
		if (totalIMass <= 0){
			return;
		}
		var movePerIMass = collision.normal.multiplyByScalar(collision.depth/totalIMass);
		var particleMovement = [];
		particleMovement.push(movePerIMass.multiplyByScalar(body1.inverseMass));
		particleMovement.push(movePerIMass.multiplyByScalar(-body2.inverseMass));
		body1.position = body1.position.add(particleMovement[0]);
		body2.position = body2.position.add(particleMovement[1]);
	},
	solveVelocity : function (collision){
		var body1 = collision.body[0].body;
		var body2 = collision.body[1].body;
		var relativeVelocity = body1.velocity.sub(body2.velocity);
		var separatingVelocity = relativeVelocity.dot(collision.normal);
		if (separatingVelocity > 0){
			return;
		}
		var newSeparatingVelocity = separatingVelocity * -collision.restitution;
		var deltaVelocity = newSeparatingVelocity - separatingVelocity;
		var totalIMass = body1.inverseMass+body2.inverseMass;
		if (totalIMass <= 0){
			return;
		}
		var impulse = deltaVelocity / totalIMass;
		var impulsePerMass = collision.normal.multiplyByScalar(impulse);
		body1.velocity = impulsePerMass.multiplyByScalar(body1.inverseMass).add(body1.velocity);
		body2.velocity = impulsePerMass.multiplyByScalar(-body2.inverseMass).add(body2.velocity);
	}
}