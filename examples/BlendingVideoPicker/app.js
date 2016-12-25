var renderer;
var scene;
var camera;
var plane;
var directionalLight;

var cubeMaterial;
var step=0;
var cube;
var picker;

var main = function(){
	indexAnimate0 = 0;
	var init = function(){
		renderer = new AL3D.Renderer(window.innerWidth,window.innerHeight);

		picker = new AL3D.Picker();

		scene = new AL3D.Scene();

		scene.setPicker(picker);

		var video=document.getElementById("bunny_video");

		cubeMaterial = new AL3D.BlinnMaterial({shininess : 128, diffuse : 0x22AAAAAA, specular : 0xFFFFFFFF, shading : AL3D.PhongInterpolation, video : video});
		
		cube = new AL3D.Mesh.createCube({size: 4, height : 4, material : cubeMaterial});
		cube.position = new ALMath.Vector3(0,0,-6);

		cube.clickListener = function(){
			alert("has pinchado sobre el cubo");
		};

		
		directionalLight = new AL3D.PointLight({color : 0xFFFFFFFF, intensity : 1, position :  new ALMath.Vector3(0,0,0)});
		var light2 = new AL3D.DirectionalLight({color : 0xFFFFFFFF, intensity : 1, position :  new ALMath.Vector3(0,1,0)});


		camera = new AL3D.PerspectiveCamera(40, window.innerWidth/window.innerHeight);
		camera.lookAt(new ALMath.Vector3(), new ALMath.Vector3(0,-0.5,-2), new ALMath.Vector3(0,1,0));

		var ambientLight = new AL3D.AmbientLight({color : 0x33555555});

		scene.add(cube);
		scene.add(ambientLight);
		scene.add(directionalLight);
		scene.add(light2);
		
		var canvas = document.getElementById("canvas");
		
		document.getElementById("canvas").appendChild(renderer.getDomElement());

		canvas.addEventListener('click', function(event) {
			var rect = canvas.getBoundingClientRect();
			var x = event.pageX - rect.left,
        	y = event.pageY - rect.top;

        	picker.pick(x,y);

		 });
	}

	var animate = function(){		
		cube.orientation.y = (cube.orientation.y+0.003)%360;
		cube.orientation.x = (cube.orientation.x+0.003)%360;
		cube.orientation.z = (cube.orientation.z+0.003)%360;
		renderer.render(scene, camera);
		window.requestAnimationFrame(animate);
	}

	init();
	animate();
}