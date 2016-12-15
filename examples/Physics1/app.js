var startTime = new Date().getTime();
var dt, world;
var ctx,c;
var circles = [];
var id = 0;
var count = 0;

var Circle = function (position){
	this.body = new ALPhysics.RigidBody(position,Math.random()*15+1, Math.random());
	this.primitive = new ALPhysics.Sphere(15);
	this.primitive.id = id;
	id += 1;
	this.body.addPrimitive(this.primitive);
	world.addBody(this.body);
	this.r = Math.floor((Math.random() * 256));
	this.g = Math.floor((Math.random() * 256));
	this.b = Math.floor((Math.random() * 256));
}

Circle.prototype = {
	render : function (){
		ctx.beginPath();

		ctx.arc(this.body.position.x,c.height-this.body.position.y,15,0,2*Math.PI,false);
		ctx.fillStyle = "rgb("+this.r+","+this.g+","+this.b+")";
		ctx.fill();
		ctx.stroke();
	}
}

var Square = function (position, mass, width, height, restitution){
	this.width = width || 15;
	this.height = height || 15;
	this.restitution = restitution  || Math.random();
	if (mass === undefined){
		this.mass = (Math.random()*15+1);
	}else{
		this.mass = mass;
	}
	this.body = new ALPhysics.RigidBody(position, this.mass, this.restitution );

	this.primitive = new ALPhysics.Box(new ALMath.Vector3(this.width, this.height,0));
	this.primitive.id = id;
	id += 1;
	this.body.addPrimitive(this.primitive);
	world.addBody(this.body);
	this.r = Math.floor((Math.random() * 256));
	this.g = Math.floor((Math.random() * 256));
	this.b = Math.floor((Math.random() * 256));
}

Square.prototype = {
	render : function (){
		ctx.beginPath();

		ctx.fillStyle = "rgb("+this.r+","+this.g+","+this.b+")";
		ctx.fillRect(this.body.position.x-this.width,c.height-this.body.position.y-this.height,this.width*2,this.height*2);
		ctx.stroke();
	}
}

var main = function(){
	var init = function(){
		c = document.getElementById("canvas");
		c.width  = window.innerWidth;
		c.height = window.innerHeight;
		ctx = c.getContext("2d");
		document.addEventListener("contextmenu", function (e){
			return false;
		});
		document.addEventListener("mouseup", function (e){
			var x = e.clientX;
			var y = e.clientY;
			if (e.button ===0){
				circles.push(new Circle(new ALMath.Vector3(x,c.height-y,0)));
			}else{
				circles.push(new Square(new ALMath.Vector3(x,c.height-y,0)));
			}
			
		});
		document.addEventListener("keyup",function(e){
			if (e.keyCode == 13) {
		        var value = parseInt(txtGravity.value);
				world.gravityGenerator.gravity.y = value;
		    }
		});
		var btnGravity = document.getElementById("btnGravity");
		var txtGravity = document.getElementById("txtGravity");
		txtGravity.value="-60";
		btnGravity.addEventListener("click", function(e){
			var value = parseInt(txtGravity.value);
			world.gravityGenerator.gravity.y = value;
		});
		world = new ALPhysics.World(new ALMath.Vector3(0,-60,0));
		var ground = new Square(new ALMath.Vector3(window.innerWidth/2, 20,0), 0, window.innerWidth/2, 40,50);
		circles.push(ground);
	}

	var animate = function(){
		var newTime = new Date().getTime();
		dt = (newTime-startTime)/1000;
		startTime = newTime;
		world.step(dt);

		//Render
		//Clear
		ctx.fillStyle = "#FFFFFF";
		ctx.fillRect(0,0,c.width,c.height);
		//ctx.fillStyle = "#FF0000";

		for (var i = 0; i < circles.length; i++){
			circles[i].render();
		}

		/*count += dt;
		if (count >= 3){
			for (var i = 0; i < circles.length; i++){
				var velocity = Math.random()*2-20*circles[i].body.velocity.x;
				circles[i].body.addForce(new ALMath.Vector3(velocity,-550*circles[i].body.velocity.y,0));
			}
			count = 0;
		}*/

		/*for (var i = circles.length-1; i >= 0; i--){
			if (circles[i].body.position.y < 0){
				circles.splice(i, 1);
			}
		}*/
		window.requestAnimationFrame(animate);
	}

	init();
	animate();
}