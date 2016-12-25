var renderer;
var triangle;
var scene;
var camera;
var plane;
var indexAnimate0;
var directionalLight;

var earth, earthMaterial, moon,moon2, moonMaterial, cylinder, cylinderMaterial,
	background, backgroundMaterial, cube, cubeMaterial, cone, coneMaterial,
	sun, sunMaterial, circle, circleMaterial;
var step=0;

var teapot, dragon, suzanne;


var main = function(){
	indexAnimate0 = 0;
	var init = function(){

		renderer = new AL3D.Renderer(window.innerWidth,window.innerHeight);

		earthMaterial = new AL3D.BlinnMaterial({shininess : 128, diffuse : 0xFFAAAAAA, specular : 0xffffffff, shading : AL3D.PhongInterpolation,  texture: './res/color-map.jpg', specularMap: './res/specular-map.jpg', normalMap: './res/normal-map1.jpg'});
		earthMaterial1 = new AL3D.BlinnMaterial({shininess : 128, diffuse : 0xFFAAAAAA, specular : 0xffffffff, shading : AL3D.PhongInterpolation,  texture: './res/color-map.jpg'});

		
		earth = new AL3D.Mesh.createSphere({radius: 1, height : 2, material : earthMaterial});
		earth.position = new ALMath.Vector3(0,0,-3);

		
		
		directionalLight = new AL3D.PointLight({color : 0xFFFFFFFF, intensity : 1, position :  new ALMath.Vector3(0,0,0)});
		var light2 = new AL3D.DirectionalLight({color : 0xFFFFFFFF, intensity : 2, position :  new ALMath.Vector3(0,1,0)});


		AL3D.Utils.loadModel({model : "teapot.json"}, function(mesh){
			teapot = mesh;
			mesh.setMaterial(new AL3D.BlinnMaterial({shininess : 128, diffuse : 0xFFAAAAAA, specular : 0xffffffff, shading : AL3D.PhongInterpolation}));
			mesh.position = new ALMath.Vector3(-0.4,0.3,-2);
			mesh.orientation.x = -20;
			mesh.scale = new ALMath.Vector3(0.08,0.08,0.08);
			scene.add(mesh);
			renderer.needUpdate = true;
		})


		AL3D.Utils.loadModel({model : "suzanne.json"}, function(mesh){
			suzanne = mesh;
			mesh.setMaterial(new AL3D.BlinnMaterial({shininess : 128, diffuse : 0xFFAAAAAA, specular : 0xffffffff, shading : AL3D.PhongInterpolation}));
			mesh.position = new ALMath.Vector3(-0.9,-0.3,-2);
			mesh.orientation.x = -20;
			mesh.scale = new ALMath.Vector3(0.28,0.28,0.28);
			scene.add(mesh);
			renderer.needUpdate = true;
		})

		AL3D.Utils.loadModel({model : "dragon.json"}, function(mesh){
			dragon = mesh;
			mesh.setMaterial(new AL3D.BlinnMaterial({shininess : 128, diffuse : 0xFFAAAAAA, specular : 0xffffffff, shading : AL3D.PhongInterpolation}));
			mesh.position = new ALMath.Vector3(0.7,-0.5,-2);
			mesh.scale = new ALMath.Vector3(0.08,0.08,0.08);
			scene.add(mesh);
			renderer.needUpdate = true;
		})


		camera = new AL3D.PerspectiveCamera(40, window.innerWidth/window.innerHeight);

		scene = new AL3D.Scene();

		
		scene.add(earth);
		scene.add(directionalLight);
		scene.add(light2);
		
		document.getElementById("canvas").appendChild(renderer.getDomElement());

		window.onkeyup = function(e) {
			var key = e.keyCode ? e.keyCode : e.which;

			if (key == 48) {
		    	renderer.clearEffects();
		   	}else if (key == 49) {
		   		renderer.addEffect(new AL3D.GreyScaleEffect());
		   	}else if (key == 50) {
		   		renderer.addEffect(new AL3D.SepiaEffect());
		   	}else if (key == 51) {
		   		renderer.addEffect(new AL3D.SharpenEffect());
		   	}else if (key == 52) {
		   		renderer.addEffect(new AL3D.GaussianBlurEffect());
		   	}else if (key == 53) {
		   		renderer.addEffect(new AL3D.EdgeDetectionEffect());
		   	}else if (key == 54) {
		   		renderer.addEffect(new AL3D.NegativeEffect());
		   	}else if (key == 55) {
		   		renderer.addEffect(new AL3D.RadialBlurEffect());
		   	}else if (key == 56) {
		   		renderer.addEffect(new AL3D.EyeFishEffect());
		   	}else if (key == 57) {
		   		renderer.addEffect(new AL3D.DreamVisionEffect());
		   	}else if (key == 81) {
		   		renderer.addEffect(new AL3D.PixelationEffect());
		   	}else if (key == 87) {
		   		renderer.addEffect(new AL3D.LenEffect());
		   	}else if (key == 69) {
		   		renderer.addEffect(new AL3D.PosterizationEffect());
		   	}
		}
	}

	var animate = function(){

		earth.orientation.y = (earth.orientation.y+0.005)%360;

		if (teapot !== undefined)
		teapot.orientation.y = (teapot.orientation.y+0.005)%360;
		if (dragon !== undefined)
		dragon.orientation.y = (dragon.orientation.y+0.01)%360;

		if (suzanne !== undefined){
			suzanne.orientation.x = (suzanne.orientation.x+0.01)%360;
			suzanne.orientation.y = (suzanne.orientation.y+0.01)%360;
			suzanne.orientation.z = (suzanne.orientation.z+0.01)%360;
		}

		renderer.render(scene, camera);
		window.requestAnimationFrame(animate);
	}

	init();
	animate();
}