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


var main = function(){
	indexAnimate0 = 0;
	var init = function(){

		renderer = new AL3D.Renderer(window.innerWidth,window.innerHeight);

		earthMaterial = new AL3D.BlinnMaterial({shininess : 128, diffuse : 0xFFAAAAAA, specular : 0xffffffff, shading : AL3D.PhongInterpolation,  texture: './res/earth-tex.jpg'});
		moonMaterial = new AL3D.BlinnMaterial({shininess : 128, diffuse : 0xFFAAAAAA, specular : 0xffffffff, shading : AL3D.PhongInterpolation,  texture: './res/moon-tex.png'});
		cylinderMaterial = new AL3D.PhongMaterial({shininess : 128, diffuse : 0xFFCCCCCC, specular : 0xffffffff, shading : AL3D.PhongInterpolation, texture: './res/cylinder-tex.png'});
		coneMaterial = new AL3D.PhongMaterial({shininess : 128, diffuse : 0xFFCCCCCC, specular : 0xffffffff, shading : AL3D.PhongInterpolation, texture: './res/cone-tex.png'});
		backgroundMaterial = new AL3D.BasicMaterial({texture: './res/opengl-tex.png'});
		circleMaterial = new AL3D.LambertMaterial({texture: './res/linux-tex.png', sideMode: AL3D.TWO_SIDE});
		cubeMaterial = new AL3D.ToonMaterial({diffuse : 0xFFAAAAAA, texture: './res/earth-tex.jpg'});
		sunMaterial = new AL3D.LambertMaterial({diffuse : 0xFFAAAAAA, texture: './res/sun-tex.jpg'});
		
		earth = new AL3D.Mesh.createSphere({radius: 1, height : 2, material : earthMaterial});
		earth.position = new ALMath.Vector3(0,0,-5);

		moon = new AL3D.Mesh.createSphere({radius: 0.2, height : 2, material : moonMaterial});
		moon.position = new ALMath.Vector3(1.5,0,-5);

		moon2 = new AL3D.Mesh.createSphere({radius: 0.16, height : 2, material : moonMaterial});
		moon2.position = new ALMath.Vector3(1.5,0,-5);

		sun = new AL3D.Mesh.createSphere({radius: 5, height : 2, material : sunMaterial});
		sun.position = new ALMath.Vector3(0,0,-15);
		
		cylinder = new AL3D.Mesh.createCylinder({size: 1, height : 2, material : cylinderMaterial});
		cylinder.position = new ALMath.Vector3(-4,-1,-8);
		
		background = new AL3D.Mesh.createPlane({size: 4, height : 2, material : backgroundMaterial});
		background.position = new ALMath.Vector3(4,0,-8);

		cube = new AL3D.Mesh.createCube({size: 2, height : 2, material : cubeMaterial});
		cube.position = new ALMath.Vector3(4,2,-8);

		cone = new AL3D.Mesh.createCone({radius: 1, height : 2, material : coneMaterial});
		cone.position = new ALMath.Vector3(-4,2,-8);

		circle = new AL3D.Mesh.createCircle({radius: 1.2, resolution: 50, material : circleMaterial});
		circle.position = new ALMath.Vector3(0,2,-8);
		
		directionalLight = new AL3D.PointLight({color : 0xFFFFFFFF, intensity : 1, position :  new ALMath.Vector3(0,0,0)});
		var light2 = new AL3D.DirectionalLight({color : 0xFFFFFFFF, intensity : 2, position :  new ALMath.Vector3(0,1,0)});


		camera = new AL3D.PerspectiveCamera(40, window.innerWidth/window.innerHeight);

		scene = new AL3D.Scene();

		
		scene.add(earth);
		scene.add(sun);
		scene.add(moon);
		scene.add(moon2);
		scene.add(cube);
		scene.add(cylinder);
		scene.add(background);
		scene.add(circle);
		scene.add(cone);

		scene.add(directionalLight);
		scene.add(light2);
		document.getElementById("canvas").appendChild(renderer.getDomElement());
	}

	var animate = function(){

		earth.orientation.y = (earth.orientation.y+0.005)%360;

		cylinder.orientation.x = (cylinder.orientation.x+0.005)%360;
		cylinder.orientation.y = (cylinder.orientation.y+0.005)%360;

		background.orientation.x = (background.orientation.x+0.005)%360;
		background.orientation.y = (background.orientation.y+0.005)%360;

		cube.orientation.x = (cube.orientation.x+0.005)%360;
		cube.orientation.y = (cube.orientation.y+0.005)%360;

		moon.orientation.x = (moon.orientation.x+0.005)%360;
		moon.orientation.y = (moon.orientation.y+0.005)%360;

		cone.orientation.x = (cone.orientation.x-0.009)%360;
		cone.orientation.y = (cone.orientation.y+0.009)%360;

		circle.orientation.x = (circle.orientation.x-0.005)%360;

		moon.position.y = Math.sin(step)*1.5;
		moon.position.x = Math.cos(step)*1.5;
		moon.position.z =Math.cos(step)-6;

		//moon2.position.y = Math.cos(step/0.8)*1.5;
		moon2.position.x = Math.cos(step)*1.5;
		moon2.position.z =-5 + Math.sin(step)*1.5;
		step+=0.02;

		renderer.render(scene, camera);
		window.requestAnimationFrame(animate);
	}

	init();
	animate();
}