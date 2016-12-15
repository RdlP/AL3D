var startTime = new Date().getTime();
var dt, world;
var ctx,c;
var circles = [];
var id = 0;
var count = 0;

var Circle = function (position){
	this.body = new ALPhysics.RigidBody(position,Math.random()*15+1);
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
var main = function(){
	var init = function(){
		c = document.getElementById("canvas");
		c.width  = window.innerWidth;
		c.height = window.innerHeight;
		ctx = c.getContext("2d");
		document.addEventListener("mouseup", function (e){
			var x = e.clientX;
			var y = e.clientY;
			circles.push(new Circle(new ALMath.Vector3(x,c.height-y,0)));

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

		count += dt;
		if (count >= 3){
			for (var i = 0; i < circles.length; i++){
				var velocity = Math.random()*2-20*circles[i].body.velocity.x;
				circles[i].body.addForce(new ALMath.Vector3(velocity,-550*circles[i].body.velocity.y,0));
			}
			count = 0;
		}

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