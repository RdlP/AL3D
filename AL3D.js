var AL3D = {
	version : "0.2 {Angel Luis 3D Library}",
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

AL3D.Renderer = function(width, height){
	this.height = height;
	this.width = width;
	this.canvas = document.createElement('canvas');
	this.canvas.id     = "3DCanvas";
	this.canvas.width  = width;
	this.canvas.height = height;
	try{
		AL3D.gl = AL3D.Renderer.gl = this.gl = this.canvas.getContext("experimental-webgl");
	}catch(e){
		return false;
	}
	this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
	this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.depthFunc(this.gl.LEQUAL);
	this.needUpdate = true;

	AL3D.LINEAR = this.gl.LINEAR;
	AL3D.NEAREST = this.gl.NEAREST;
	AL3D.LINEAR_MIPMAP_LINEAR = this.gl.LINEAR_MIPMAP_LINEAR;
	AL3D.NEAREST_MIPMAP_NEAREST = this.gl.NEAREST_MIPMAP_NEAREST;
	AL3D.NEAREST_MIPMAP_LINEAR = this.gl.NEAREST_MIPMAP_LINEAR;
	AL3D.LINEAR_MIPMAP_NEAREST = this.gl.LINEAR_MIPMAP_NEAREST;
	AL3D.CLAMP_TO_EDGE = this.gl.CLAMP_TO_EDGE;
	AL3D.REPEAT = this.gl.REPEAT;
	AL3D.MIRRORED_REPEAT =this.gl.MIRRORED_REPEAT;

	AL3D.TEXTURE_MAG_FILTER = this.gl.TEXTURE_MAG_FILTER;
	AL3D.TEXTURE_MIN_FILTER = this.gl.TEXTURE_MIN_FILTER;

	AL3D.RGBA = this.gl.RGBA;
	AL3D.RGB = this.gl.RGB;
	AL3D.UNSIGNED_BYTE = this.gl.UNSIGNED_BYTE;

	AL3D.TEXTURE_2D = this.gl.TEXTURE_2D;

	AL3D.FlatInterpolation = 0;
	AL3D.PhongInterpolation = 2;
	AL3D.GouraudInterpolation = 1;
	AL3D.ONE_SIDE = 0;
	AL3D.TWO_SIDE = 1;

	this.gl.getExtension("OES_standard_derivatives");
	this.gl.clearDepth(1.0);
	this.gl.viewport(0.0, 0.0, this.canvas.width, this.canvas.height);

	this.postprocessingEffects = [];

	return true;
}

AL3D.Renderer.prototype.constructor = AL3D.Renderer;


AL3D.EffectBasedOnKernel = function(){
    this.vertexShader = ["precision lowp float;",
    					"attribute vec2 aPosition;",
    					"varying vec2 vTexCoord;",
    					"void main() {",
      					"vTexCoord = aPosition.xy * 0.5 + 0.5;",
      					"gl_Position = vec4(aPosition,0.0,1.0);}"].join("\n");

    this.fragmentShader = ["precision mediump float;",
    					"varying vec2 vTexCoord;",
    					"uniform sampler2D uSampler;",
    					"uniform vec2 uTextureSize;",
    					"uniform float uKernel[9];",
      					"void main() {",
      					"vec2 distanceBetweenPixeles = vec2(1.0, 1.0) / uTextureSize;",
      					"vec4 colorSum =",
      					"texture2D(uSampler, vTexCoord + distanceBetweenPixeles * vec2(-1, -1)) * uKernel[0] +",
      					"texture2D(uSampler, vTexCoord + distanceBetweenPixeles * vec2( 0, -1)) * uKernel[1] +",
      					"texture2D(uSampler, vTexCoord + distanceBetweenPixeles * vec2( 1, -1)) * uKernel[2] +",
      					"texture2D(uSampler, vTexCoord + distanceBetweenPixeles * vec2(-1,  0)) * uKernel[3] +",
      					"texture2D(uSampler, vTexCoord + distanceBetweenPixeles * vec2( 0,  0)) * uKernel[4] +",
      					"texture2D(uSampler, vTexCoord + distanceBetweenPixeles * vec2( 1,  0)) * uKernel[5] +",
      					"texture2D(uSampler, vTexCoord + distanceBetweenPixeles * vec2(-1,  1)) * uKernel[6] +",
      					"texture2D(uSampler, vTexCoord + distanceBetweenPixeles * vec2( 0,  1)) * uKernel[7] +",
      					"texture2D(uSampler, vTexCoord + distanceBetweenPixeles * vec2( 1,  1)) * uKernel[8] ;",
      					"gl_FragColor = vec4((colorSum).rgb, 1.0);",
      					"}"].join("\n");

    this.shaderProgram = AL3D.Utils.compileAndLinkShader(this.vertexShader, this.fragmentShader);

	this.shaderProgram._position = AL3D.Renderer.gl.getAttribLocation(this.shaderProgram, "aPosition");
	AL3D.gl.enableVertexAttribArray(this.shaderProgram._position);
	this.shaderProgram._sampler =  AL3D.Renderer.gl.getUniformLocation(this.shaderProgram, "uSampler");
	this.shaderProgram._kernel =  AL3D.Renderer.gl.getUniformLocation(this.shaderProgram, "uKernel[0]");
	this.shaderProgram._texutreSize =  AL3D.Renderer.gl.getUniformLocation(this.shaderProgram, "uTextureSize");

}

AL3D.SepiaEffect = function(){
    this.vertexShader = ["precision lowp float;",
    					"attribute vec2 aPosition;",
    					"varying vec2 vTexCoord;",
    					"void main() {",
      					"vTexCoord = aPosition.xy * 0.5 + 0.5;",
      					"gl_Position = vec4(aPosition,0.0,1.0);}"].join("\n");

    this.fragmentShader = ["precision mediump float;",
    					"varying vec2 vTexCoord;",
    					"uniform sampler2D uSampler;",
      					"void main() {",
      					"float grey = dot(texture2D(uSampler, vTexCoord).rgb, vec3(0.299, 0.587, 0.114));",
      					"gl_FragColor = vec4(grey * vec3(1.2, 1.0, 0.8), 1.0);",
      					"}"].join("\n");

    this.shaderProgram = AL3D.Utils.compileAndLinkShader(this.vertexShader, this.fragmentShader);

	this.shaderProgram._position = AL3D.Renderer.gl.getAttribLocation(this.shaderProgram, "aPosition");
	AL3D.gl.enableVertexAttribArray(this.shaderProgram._position);
	this.shaderProgram._sampler =  AL3D.Renderer.gl.getUniformLocation(this.shaderProgram, "uSampler");

}

AL3D.GreyScaleEffect = function(){
    this.vertexShader = ["precision lowp float;",
    					"attribute vec2 aPosition;",
    					"varying vec2 vTexCoord;",
    					"void main() {",
      					"vTexCoord = aPosition.xy * 0.5 + 0.5;",
      					"gl_Position = vec4(aPosition,0.0,1.0);}"].join("\n");

    this.fragmentShader = ["precision mediump float;",
    					"varying vec2 vTexCoord;",
    					"uniform sampler2D uSampler;",
      					"void main() {",
      					"float grey = dot(texture2D(uSampler, vTexCoord).rgb, vec3(0.299, 0.587, 0.114));",
      					"gl_FragColor = vec4(grey,grey,grey, 1.0);",
      					"}"].join("\n");

    this.shaderProgram = AL3D.Utils.compileAndLinkShader(this.vertexShader, this.fragmentShader);

	this.shaderProgram._position = AL3D.Renderer.gl.getAttribLocation(this.shaderProgram, "aPosition");
	AL3D.gl.enableVertexAttribArray(this.shaderProgram._position);
	this.shaderProgram._sampler =  AL3D.Renderer.gl.getUniformLocation(this.shaderProgram, "uSampler");

}

AL3D.EdgeDetectionEffect = function(){
	AL3D.EffectBasedOnKernel.call(this);
}

AL3D.SharpenEffect = function(){
	AL3D.EffectBasedOnKernel.call(this);
}

AL3D.GaussianBlurEffect = function(){
	AL3D.EffectBasedOnKernel.call(this);
}

AL3D.Scene = function(){
	this.renderObjects = [];
	this.directionalLights=[];
	this.pointLights=[]
	this.ambientLights=[];
	this.spotLights=[];
}

AL3D.Object3D = function(x, y, z){
	this._position = new ALMath.Vector3(x||0, y||0, z||0);
	this._orientation = new ALMath.Vector3();
	this.scale = new ALMath.Vector3(0.5,0.5,0.5);
	this.transform = new ALMath.Matrix4();
}

AL3D.Object3D.prototype.constructor = AL3D.Object3D;

AL3D.Mesh = function(p){
	AL3D.Object3D.call(this);
	this.vertices = p===undefined?[]:p.vertices || [];
	this.indices = p===undefined?[]:p.indices || [];
	this.normals = p===undefined?[]:p.normals || [];
	this.uv = p===undefined?[]:p.uv || [];
	this.material = p===undefined?new AL3D.BasicMaterial():p.material || new AL3D.BasicMaterial();

	this.gl = AL3D.Renderer.gl;

	if (p!==undefined && p.uv !== undefined && p.material.urlTexture !== undefined){
		this.uv = p.uv;
		loadTexture(this.material.urlTexture);
	}

	if (p!==undefined && p.vertices !== undefined){
		this.setVertexBuffer();
	}

	if (p!==undefined && p.indices !== undefined){
		this.setIndexBuffer();
	}

}

AL3D.Camera = function(){
	AL3D.Object3D.call(this);
	this.projectionMatrix = new ALMath.Matrix4();
	this.viewMatrix = new ALMath.Matrix4();
	this.target = new ALMath.Vector3();
	this.up = new ALMath.Vector3();
}

AL3D.Camera.prototype.constructor = AL3D.Camera;

AL3D.PerspectiveCamera = function(fov, aspect, near, far){
	AL3D.Camera.call(this);

	this.fov = fov !== undefined ? fov : 40;
	this.aspect = aspect !== undefined ? aspect : 1;
	this.near = near !== undefined ? near : 0.1;
	this.far = far !== undefined ? far : 1000;

	this.projectionMatrix.perspectiveProjection(this.fov, this.aspect, this.near, this.far);
}



AL3D.OrthographicCamera = function(left, right, top, bottom, near, far){
	AL3D.Camera.call(this);

	this.projectionMatrix.orthographicProjection(left, right, top, bottom, near, far);
}

AL3D.OrthographicCamera.prototype.constructor = AL3D.OrthographicCamera;
AL3D.OrthographicCamera.prototype = Object.create( AL3D.Camera.prototype );

AL3D.Light = function(p){
	AL3D.Object3D.call(this);
	this.type = "Light";
	this.color = p.color || 0xFFFFFFFF;

}

AL3D.AmbientLight = function(p){
	AL3D.Light.call(this, p);
	this.type = "AmbientLight";
	this.intensity = p.intensity || 1.0;
}

AL3D.DirectionalLight = function(p){
	AL3D.Light.call(this, p);
	this.type = "DirectionalLight";
	this.intensity = p.intensity || 1.0;
	this.position = p.position || new ALMath.Vector3(0,1,0);
}

AL3D.PointLight = function (p){
	AL3D.Light.call(this, p);
	this.type = "PointLight";
	this.position = p.position || new ALMath.Vector3(0,1,0);
	this.distance = p.distance || 1.0;
	this.intensity = p.intensity || 1.0;
	this.linearAttenuation = p.linearAttenuation || 0.1;
	this.quadraticAttenuation = p.quadraticAttenuation || 0.01;
	this.constantAttenuation = p.constantAttenuation || 1.0;
}

AL3D.SpotLight = function (color, intensity, distance, angle, position, exponent){
	AL3D.Light.call(this, color);
	this.type = "SpotLight";
	this.position = p.position || new ALMath.Vector3(0,1,0);
	this.distance = p.distance || 1.0;
	this.intensity = p.intensity || 1.0;
	this.linearAttenuation = p.linearAttenuation || 0.1;
	this.quadraticAttenuation = p.quadraticAttenuation || 0.01;
	this.constantAttenuation = p.constantAttenuation || 1.0;
	this.direction = p.direction || 1.0;
	this.spotCosCutOff = p.spotCosCutOff || 1.0;
	this.spotExponent = p.spotExponent || 1.0;
}

AL3D.Material = function(p){
	this.texture = p===undefined?undefined:p.texture;
	this.specularMap = p===undefined?undefined:p.specularMap;
	if (this.specularMap !== undefined){
		this.specularMap = new AL3D.Texture({url:this.specularMap});
		this.specularMap.loadTexture();
	}
	this.normalMap = p===undefined?undefined:p.normalMap;
	if (this.normalMap !== undefined){
		this.normalMap = new AL3D.Texture({url:this.normalMap});
		this.normalMap.loadTexture();
	}
}

AL3D.BasicMaterial = function (p){
	AL3D.Material.call(this, p);
	this.type = "BasicMaterial";
	
	this.diffuse = 0xFFCCCCCC;
	this.ambient = 0xFFFFFFFF;
	if (p !== undefined && p.diffuse !== undefined){
		this.diffuse = p.diffuse;
	}
	if (p !== undefined && p.ambient !== undefined){
		this.ambient = p.ambient;
	}
}

AL3D.LambertMaterial = function (p){
	AL3D.Material.call(this, p);
	this.type = "LambertMaterial";
	this.shading =  p.shading || AL3D.GouraudInterpolation;
	this.sideMode = p.sideMode || AL3D.ONE_SIDE;
	this.diffuse = 0xFFFFFFFF;
	this.ambient = 0xFFFFFFFF;
	if (p !== undefined && p.diffuse !== undefined){
		this.diffuse = p.diffuse;
	}
	if (p !== undefined && p.ambient !== undefined){
		this.ambient = p.ambient;
	}
}

AL3D.PhongMaterial = function (p){
	AL3D.Material.call(this, p);
	this.type = "PhongMaterial";
	this.shading =  p.shading || AL3D.GouraudInterpolation;
	this.sideMode = p.sideMode || AL3D.ONE_SIDE;
	this.diffuse = 0xFFFFFFFF;
	this.ambient = 0xFFFFFFFF;
	this.specular = 0xFFFFFFFF;
	this.shininess = 1.0;
	if (p !== undefined && p.diffuse !== undefined){
		this.diffuse = p.diffuse;
	}
	if (p !== undefined && p.ambient !== undefined){
		this.ambient = p.ambient;
	}
	if (p !== undefined && p.specular !== undefined){
		this.specular = p.specular;
	}
	if (p !== undefined && p.shininess !== undefined){
		this.shininess = p.shininess;
	}
}

AL3D.BlinnMaterial = function (p){
	AL3D.Material.call(this, p);
	this.type = "BlinnMaterial";
	this.shading = p.shading || AL3D.GouraudInterpolation;
	this.sideMode = p.sideMode || AL3D.ONE_SIDE;
	this.diffuse = 0xFFFFFFFF;
	this.ambient = 0xFFFFFFFF;
	this.specular = 0xFFFFFFFF;
	if (p !== undefined && p.diffuse !== undefined){
		this.diffuse = p.diffuse;
	}
	if (p !== undefined && p.ambient !== undefined){
		this.ambient = p.ambient;
	}
	if (p !== undefined && p.specular !== undefined){
		this.specular = p.specular;
	}
	if (p !== undefined && p.shininess !== undefined){
		this.shininess = p.shininess;
	}
}

AL3D.ToonMaterial = function (p){
	AL3D.Material.call(this, p);
	this.type = "ToonMaterial";
	this.shading = p.shading || AL3D.GouraudInterpolation;
	this.sideMode = p.sideMode || AL3D.ONE_SIDE;
	this.diffuse = 0xFFFFFFFF;
	this.ambient = 0xFFFFFFFF;
	if (p !== undefined && p.diffuse !== undefined){
		this.diffuse = p.diffuse;
	}
	if (p !== undefined && p.ambient !== undefined){
		this.ambient = p.ambient;
	}

	// Creation of texture for reduction level. need to be power of two
	var l = [

		//0x05, 0x05, 0x05, 0x05,
		//0x10, 0x10, 0x10, 0x10,
		//0x15, 0x15, 0x15, 0x15,
		//0x22, 0x22, 0x22, 0x22,

		0x44, 0x44, 0x44, 0x44,
		0x88, 0x88, 0x88, 0x88,
		0xCC, 0xCC, 0xCC, 0xCC,
		0xFF, 0xFF, 0xFF, 0xFF
	];
	if (p.levels !== undefined){
		for (var i = 0; i < p.levels.length; i++){
			var c = AL3D.Utils.hexIntToRgb(p.levels[i]);
			l.push(c.r);
			l.push(c.g);
			l.push(c.b);
			l.push(c.a);
		}
	}

	this.levels = new Uint8Array(l);

	var image = this.levels;
	this.textureToon = new AL3D.Texture({});
	this.textureToon.texture = AL3D.gl.createTexture();
    AL3D.gl.bindTexture(AL3D.TEXTURE_2D, this.textureToon.texture);
    AL3D.gl.pixelStorei(AL3D.gl.UNPACK_FLIP_Y_WEBGL, true);
    AL3D.gl.texImage2D(AL3D.gl.TEXTURE_2D, 0, AL3D.gl.RGBA, l.length/4, 1, 0, AL3D.gl.RGBA, AL3D.gl.UNSIGNED_BYTE, image);
    AL3D.gl.generateMipmap( AL3D.gl.TEXTURE_2D );
    AL3D.gl.texParameteri( AL3D.gl.TEXTURE_2D, AL3D.gl.TEXTURE_MIN_FILTER, AL3D.gl.NEAREST_MIPMAP_LINEAR );
    AL3D.gl.texParameteri( AL3D.gl.TEXTURE_2D, AL3D.gl.TEXTURE_MAG_FILTER, AL3D.gl.NEAREST );


}

AL3D.Texture = function(p){

	this.url = p.url || "";
	this.wrapS = p.wrapS !== undefined ? p.wrapS : AL3D.CLAMP_TO_EDGE;
	this.wrapT = p.wrapT !== undefined ? p.wrapT : AL3D.CLAMP_TO_EDGE;
	this.loaded = false;

	this.magFilter = p.magFilter !== undefined ? p.magFilter : AL3D.LINEAR;
	this.minFilter = p.minFilter !== undefined ? p.minFilter : AL3D.LINEAR_MIPMAP_LINEAR;

	this.format = p.format !== undefined ? p.format : AL3D.RGBA;
	this.type = p.type !== undefined ? p.type : AL3D.UNSIGNED_BYTE;

	this.flipY = p.flipY !== undefined ? p.flipY : true;

}

AL3D.ShaderManager = function (){
	this._cache = {};
}

AL3D.TextureManager = function(){
	this._cache = {};
}

AL3D.Utils = {
	createCircle : function(n, startAngle, y, radius){
		var vertices = [],dA = Math.PI*2/(n-1),angle,r=0.9;
	    if (arguments.length === 4){
	        r = radius;
	    }
	    var index;
	    for(var i = 0; i < n-1; i++){
	        angle = startAngle + dA*i;
	        vertices.push(new ALMath.Vector3(r*Math.cos(angle),y,r*Math.sin(angle)));
	        index = i;
	    }
	    angle = startAngle + dA*(index+1);
	    vertices.push(new ALMath.Vector3(r*Math.cos(angle),y,r*Math.sin(angle)));
	    return vertices;

	},
	computeNormal : function (a,b,c){
	    var t1 = a.sub(b);
	    var t2 = c.sub(b);
	    var normal = t1.cross(t2);
	    return normal;
	},
	hexToRgb : function(hex) {
	    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
	    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])([a-f\d])$/i;
	    hex = hex.replace(shorthandRegex, function(m, a, r, g, b) {
	        return a + a + r + r + g + g + b + b;
	    });

	    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	    return result ? {
	    	a: parseInt(result[1], 16),
	        r: parseInt(result[2], 16),
	        g: parseInt(result[3], 16),
	        b: parseInt(result[4], 16)
	    } : null;
	},
	hexToRgbNormalized : function(hex) {
	    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
	    var hex = AL3D.Utils.hexToRgb(hex);
	    if (hex === null){
			return null;
		}else{
			hex.a=hex.a/255;
			hex.r=hex.r/255;
			hex.g=hex.g/255;
			hex.b=hex.b/255;
			return hex;
		}
	},
	hexIntToRgb : function(hex) {
	    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
	    var r,g,b,a;
	    r = (hex >> 16)&0xFF;
	    g = (hex >> 8)&0xFF;
	    b = (hex)&0xFF;
	    a = (hex >> 24)&0xFF;
	    return {
	    	r: r,
	    	g: g,
	    	b: b,
	    	a: a
	    };
	},
	hexIntToRgbNormalized : function(hex) {
	    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
	    var hex = AL3D.Utils.hexIntToRgb(hex);
	    if (hex === null){
			return null;
		}else{
			hex.a=hex.a/255;
			hex.r=hex.r/255;
			hex.g=hex.g/255;
			hex.b=hex.b/255;
			return hex;
		}
	},
	compileAndLinkShader : function(vertexShader, fragmentShader){
		var getShader = function (source, type, typeString){
			var shader = AL3D.Renderer.gl.createShader(type);
			AL3D.Renderer.gl.shaderSource(shader, source);
			AL3D.Renderer.gl.compileShader(shader);
			if (!AL3D.Renderer.gl.getShaderParameter(shader,AL3D.Renderer.gl.COMPILE_STATUS)){
				alert ("Error en "+typeString+ " Shader : " + AL3D.Renderer.gl.getShaderInfoLog(shader));
		   		return false;
			}
			return shader;
		}

		var vertexShaderCompiled = getShader(vertexShader, AL3D.Renderer.gl.VERTEX_SHADER, "VERTEX");
		var fragmentShaderCompiled = getShader(fragmentShader, AL3D.Renderer.gl.FRAGMENT_SHADER, "FRAGMENT");
		var shaderProgram = AL3D.Renderer.gl.createProgram();
		AL3D.Renderer.gl.attachShader(shaderProgram, vertexShaderCompiled);
		AL3D.Renderer.gl.attachShader(shaderProgram, fragmentShaderCompiled);

		AL3D.Renderer.gl.linkProgram(shaderProgram);

		return shaderProgram;
	}
}

AL3D.Texture.prototype = {
	loadTexture : function (){
		var texObject = this;
		cache.loadTexture(this.url, function(img){
			texObject.texture=AL3D.gl.createTexture();
			texObject.image = img;
			AL3D.gl.pixelStorei(AL3D.gl.UNPACK_FLIP_Y_WEBGL, true);
			AL3D.gl.bindTexture(AL3D.TEXTURE_2D, texObject.texture);
			AL3D.gl.texImage2D(AL3D.TEXTURE_2D, 0, texObject.format, texObject.format, texObject.type, img);
			AL3D.gl.texParameteri(AL3D.TEXTURE_2D, AL3D.TEXTURE_MAG_FILTER, texObject.magFilter);
			AL3D.gl.texParameteri(AL3D.TEXTURE_2D, AL3D.TEXTURE_MIN_FILTER, texObject.minFilter);
			AL3D.gl.generateMipmap(AL3D.TEXTURE_2D);
			AL3D.gl.bindTexture(AL3D.TEXTURE_2D, null);
			texObject.loaded = true;
		});
	}
}


AL3D.EdgeDetectionEffect.prototype = {
	process : function(){
		AL3D.gl.uniform2f(this.shaderProgram._texutreSize, this.width, this.height);
		var kernel = [
		     -1, -1, -1,
		     -1,  8, -1,
		     -1, -1, -1
		 ];
		 AL3D.gl.uniform1fv(this.shaderProgram._kernel, kernel);
	}
}

AL3D.SharpenEffect.prototype = {
	process : function(){
		AL3D.gl.uniform2f(this.shaderProgram._texutreSize, this.width, this.height);
		var kernel = [
		     0, -1, 0,
		     -1,  5, -1,
		     0, -1, 0
		 ];
		 AL3D.gl.uniform1fv(this.shaderProgram._kernel, kernel);
	}
}

AL3D.GaussianBlurEffect.prototype = {
	process : function(){
		AL3D.gl.uniform2f(this.shaderProgram._texutreSize, this.width, this.height);

		 var kernel = [
		     1/16, 1/8, 1/16,
		     1/8 ,  1/4, 1/8,
		     1/16, 1/8, 1/16
		 ];
		 AL3D.gl.uniform1fv(this.shaderProgram._kernel, kernel);
	}
}



AL3D.Object3D.prototype = {
	get position (){
		return this._position;
	},

	set position (value){
		this._position.x = value.x;
		this._position.y = value.y;
		this._position.z = value.z;
	},

	set rotation (value){
		this._orientation.setFromEuler(value.x,value.y,value.z);
	},

	set orientation (value){
		this._orientation.x = value.x;
		this._orientation.y = value.y;
		this._orientation.z = value.z;
	},

	get orientation (){
		return this._orientation;
	},

	get rotation () {
		this._orientation.getEuler();
	},

	prepareToRender : function(){
		this.transform = new ALMath.Matrix4();
		var qOrientation = new ALMath.Quaternion().setFromEuler(this.orientation).getMatrix();
		var scaleM = new ALMath.Matrix4();
		var orientationM = new ALMath.Matrix4();
		orientationM = orientationM.rotate(this.orientation.x, this.orientation.y, this.orientation.z);
		scaleM = scaleM.scale(this.scale.x,this.scale.y,this.scale.z);
		this.transform = this.transform.multiply(orientationM).multiply(scaleM);
		// We could do
		// var matrixT = new ALMath.Matrix4();
		// matrixT.translate(this.position.x,this.position.y,this.position.z);
		// and then multiply the transform but this take more calcules than simply put position in the correct positions.
		this.transform.components[12] = this.position.x;
		this.transform.components[13] = this.position.y;
		this.transform.components[14] = this.position.z;
	}
}


AL3D.Mesh.prototype = AL3D.Object3D.prototype;

AL3D.Mesh.prototype.getVertex = function (){
	var vertexArray = [];
	for (var i = 0; i < this.vertices.length; i++){
		v = this.vertices[i];
		if (v instanceof ALMath.Vector2){
			vertexArray.push(v.x);
			vertexArray.push(v.y);
		}else if (v instanceof ALMath.Vector3){
			vertexArray.push(v.x);
			vertexArray.push(v.y);
			vertexArray.push(v.z);
		}
	}
	if (vertexArray.length === 0){
		return this.vertices;
	}
	return vertexArray;
}

AL3D.Mesh.prototype.getNormals = function (data){
	var normalArray = [];
	var source = data || this.normals;
	for (var i = 0; i < source.length; i++){
		v = source[i];
		if (v instanceof ALMath.Vector3){
			normalArray.push(v.x);
			normalArray.push(v.y);
			normalArray.push(v.z);
		}
	}
	if (normalArray.length === 0){
		return source;
	}
	return normalArray;
}

AL3D.Mesh.prototype.getIndexes = function(){
	return this.indices;
}

AL3D.Mesh.prototype.addVertex = function(v){
	if (v instanceof ALMath.Vector2){
		v = ALMath.Vector3(v.x, v.y, 0);
	}
	this.vertices.push(v);
}

AL3D.Mesh.prototype.addIndex = function(i){
	this.indices.push(i);
}

AL3D.Mesh.createSphere = function (p){
	var mesh = new AL3D.Mesh();
	var radius = p.radius || 1;
	
	mesh.material = p.material || new AL3D.BasicMaterial();
	var urlTexture = mesh.material.texture;
    
    var sphereScale = 1;
    var latitudeOfNorthPole = Math.PI / 2.0;
    var degreeInRadian = (Math.PI / 180) * 10;
    var circleLength = Math.PI * 2.0;
    var verticesInOneStrip = circleLength / degreeInRadian;
    
    var lats = 50;
    var longs = 50;
    var latNumber, longNumber, theta, phi, sinTheta, sinPhi, cosTheta, cosPhi;
    var x, y, z;
    var first, second;

    // vertices
    for (latNumber = 0; latNumber <= lats; latNumber += 1) {
        for (longNumber = 0; longNumber <= longs; longNumber += 1) {
            theta = latNumber * Math.PI / lats;
            phi = longNumber * 2 * Math.PI / longs;
            sinTheta = Math.sin(theta);
            sinPhi = Math.sin(phi);
            cosTheta = Math.cos(theta);
            cosPhi = Math.cos(phi);

            x = cosPhi * sinTheta;
            y = cosTheta;
            z = sinPhi * sinTheta;
            var u = 1 - (longNumber / longs);
            var v = 1 - (latNumber / lats);

            mesh.vertices.push(new ALMath.Vector3(radius * x, radius * y, radius * z));
            mesh.normals.push(new ALMath.Vector3(x, y, z));
            mesh.uv.push(u);
            mesh.uv.push(v);
        }
    }

    // indices
    for (latNumber = 0; latNumber < lats; latNumber += 1) {
        for (longNumber = 0; longNumber < longs; longNumber += 1) {
            first = latNumber * (longs + 1) + longNumber;
            second = first + longs + 1;
            mesh.indices.push(first, second, first + 1);
            
            
            mesh.indices.push(second, second + 1, first + 1);
        }
    }

    mesh.setUVBuffer();

    if (urlTexture !== undefined && mesh.uv !== undefined && !mesh.material.init && mesh.material.texture.texture === undefined){
    	mesh.setTexture(urlTexture, mesh.uv);
	}
	mesh.material.init = true;
	mesh.type = "sphere";
	mesh.hasNormals = true;
	mesh.setVertexBuffer();
	mesh.setIndexBuffer();
	mesh.setNormalBuffer();
	return mesh;
}

AL3D.Mesh.createCylinder = function (p){
	var mesh = new AL3D.Mesh();
	var radius = p.radius || 1;
	var height = p.height || 1;
	mesh.material = p.material || new AL3D.BasicMaterial();
	var urlTexture = mesh.material.texture;

	var a1=[],a2=[],a3=[],a4=[],index=[],vertex=[],topCapNormal =[],bottomCapNormal = [],topBottomCapNormal = [],sideCapNormal = [],polygons = 50;
    a1.push(new ALMath.Vector3(0,-height/2,0));
    a2 = AL3D.Utils.createCircle(polygons,0,-height/2,radius);
    a3 = AL3D.Utils.createCircle(polygons,0,height/2,radius);
    //a3 = a3.reverse(); // This NOT fix the problem with light TWO_SIDE and TRIANGLE_FAN
    a4.push(new ALMath.Vector3(0,height/2,0));

    // Initialize normals for side surface
    for (var i = 0; i < polygons*2+2; i++){
        sideCapNormal.push(new ALMath.Vector3(0,0,0));
    }

    for (var i = 0; i < a2.length-1; i++){
        index.push(2+i);
        index.push(1+i);
        index.push(2+polygons+ i);

        index.push(2+polygons+i);
        index.push(2+i);
        index.push(2+polygons+1+i);
    }

    //uv coordinates for side surface
    var dA = Math.PI*2/(a2.length-1);
    var t = [];
    t.push(0.0);
    t.push(0.0);
    for (var i = 0; i < a2.length; i++){
    	
    	t.push(1 - i/polygons);
    	t.push(0.0);
    }
    t.push(0.0); // Estas coordenadas corresponden al centro de uno de los extremos, no van a ser usadas para el calculo del lateral, pero
    t.push(0.0); // es necesario indicarlas porque a la hora de hacer bind de los atributos tiene que haber una correspondencia, si estas 
    // coordenadas no se ponen entonces resulta que vamos a tener 4 coordenadas menos para los uv que número de vertices y dará error a la hora de renderizar
    for (var i = 0; i < a2.length; i++){
    	
    	t.push(1 - i/polygons);
    	t.push(1.0);
    }
    var caps = [];
    caps.push(0.5);
    caps.push(0.5);
    var radian;
    
    for (var i = 0; i < a2.length; i++){
    	caps.push(0.5 * Math.cos(dA*i) + 0.5);
    	caps.push(0.5 * Math.sin(dA*i) + 0.5);
    }
    caps.push(0.5);
    caps.push(0.5);

    for (var i = 0; i < a3.length; i++){
    	caps.push(0.5 * Math.cos(dA*i) + 0.5);
    	caps.push(0.5 * Math.sin(dA*i) + 0.5);
    }
    mesh.uv = t;
    // Normals for side surface
    for (var i = 0; i < a2.length-1; i++){
        // Normals for the first triangle
        var n = (i+1)%a2.length;
        var normal1 = AL3D.Utils.computeNormal(a2[i],a2[n],a3[i]).normalize();
        sideCapNormal[2+i] = sideCapNormal[i+2].add(normal1);
        sideCapNormal[i+1] = sideCapNormal[i+1].add(normal1);
        sideCapNormal[2+polygons+ i] = sideCapNormal[i+2+polygons].add(normal1);

        // Normals for the second triangle
        var normal2 = AL3D.Utils.computeNormal(a2[n],a3[n],a3[i]).normalize();
        sideCapNormal[2+polygons+i] = sideCapNormal[2+polygons+i].add(normal2);
        sideCapNormal[2+i] = sideCapNormal[2+i].add(normal2);
        sideCapNormal[i+polygons+2 +1] = sideCapNormal[i+polygons+2 +1].add(normal2);
    }

    for (var i = 0; i < sideCapNormal.length; i++){
    	if (sideCapNormal[i].equals(new ALMath.Vector3(0,0,0))){
    		continue;
    	}
        sideCapNormal[i] = sideCapNormal[i].normalize();
    }
    // Normals for top and bottom Cap
    for (var i = 0; i< polygons+1; i++){
        topBottomCapNormal.push(new ALMath.Vector3(0,-1,0));
    }
    for (var i = 0; i< polygons+1; i++){
        //topBottomCapNormal.push(new ALMath.Vector3(0,1,0)); // Correct, fix for winding triangle_fan
        topBottomCapNormal.push(new ALMath.Vector3(0,1,0));
    }
    mesh.hasNormals = true;

    vertex = a1.concat(a2);
    vertex = vertex.concat(a4);
    vertex = vertex.concat(a3);
    mesh.vertices = vertex;
    mesh.indices = index;

    mesh.setUVBuffer("capUVBuffer", caps);
    mesh.setUVBuffer("sideUVBuffer", mesh.uv);
    if (urlTexture !== undefined){
    	mesh.setTexture(urlTexture, mesh.uv);
	}
	mesh.setVertexBuffer();
	mesh.setIndexBuffer();
	mesh.setNormalBuffer("sideNormalsBuffer", sideCapNormal);
	mesh.setNormalBuffer("capNormalsBuffer", topBottomCapNormal);

	mesh.type = "cylinder";
	

	mesh.render = function(){
		
		mesh.gl.bindBuffer(mesh.gl.ARRAY_BUFFER, mesh.capUVBuffer);
		this.gl.vertexAttribPointer(mesh.shaderProgram._uv, 2, this.gl.FLOAT, false,4*2,0) ;
		mesh.gl.bindBuffer(mesh.gl.ARRAY_BUFFER, this.capNormalsBuffer);
		this.gl.vertexAttribPointer(mesh.shaderProgram._vNormal, 3, this.gl.FLOAT, false, 4*3, 0);
		mesh.gl.drawArrays( mesh.gl.TRIANGLE_FAN, 0, polygons+1);

		
		mesh.gl.bindBuffer(mesh.gl.ARRAY_BUFFER, mesh.sideUVBuffer);
		this.gl.vertexAttribPointer(mesh.shaderProgram._uv, 2, this.gl.FLOAT, false,4*2,0) ;
		mesh.gl.bindBuffer(mesh.gl.ARRAY_BUFFER, mesh.sideNormalsBuffer);
		this.gl.vertexAttribPointer(mesh.shaderProgram._vNormal, 3, this.gl.FLOAT, false, 4*3, 0);
		mesh.gl.bindBuffer(mesh.gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
		mesh.gl.drawElements(mesh.gl.TRIANGLE_STRIP, mesh.indices.length, mesh.gl.UNSIGNED_SHORT, 0);

		
		mesh.gl.bindBuffer(mesh.gl.ARRAY_BUFFER, mesh.capUVBuffer);
		this.gl.vertexAttribPointer(mesh.shaderProgram._uv, 2, this.gl.FLOAT, false,4*2,0) ;
		mesh.gl.bindBuffer(mesh.gl.ARRAY_BUFFER, mesh.capNormalsBuffer);
		this.gl.vertexAttribPointer(mesh.shaderProgram._vNormal, 3, this.gl.FLOAT, false, 4*3, 0);
		mesh.gl.drawArrays( mesh.gl.TRIANGLE_FAN, polygons+1, (polygons+1));
	}

	return mesh;
}

AL3D.Mesh.createCone = function (p){
	var mesh = new AL3D.Mesh();
	var radius = p.radius || 1;
	var height = p.height || 1;
	mesh.material = p.material || new AL3D.BasicMaterial();
	var urlTexture = mesh.material.texture;

	var a1=[],a2=[],a3=[],a4=[],index=[],vertex=[],topCapNormal =[],bottomCapNormal = [],topBottomCapNormal = [],sideCapNormal = [],polygons = 50;
    a1.push(new ALMath.Vector3(0,-height/2,0));
    a2 = AL3D.Utils.createCircle(polygons,0,-height/2,radius);
    a3 = AL3D.Utils.createCircle(polygons,0,height/2,0.0001);
    a4.push(new ALMath.Vector3(0,height/2,0));

    // Initialize normals for side surface
    for (var i = 0; i < polygons*2+2; i++){
        sideCapNormal.push(new ALMath.Vector3(0,0,0));
    }

    for (var i = 0; i < a2.length-1; i++){
        index.push(2+i);
        index.push(1+i);
        index.push(2+polygons+ i);

        index.push(2+polygons+i);
        index.push(2+i);
        index.push(2+polygons+1+i);
    }

    //uv coordinates for side surface
    var dA = Math.PI*2/(a2.length-1);
    var t = [];
    t.push(0.0);
    t.push(0.0);
    for (var i = 0; i < a2.length; i++){
    	
    	t.push(1 - i/polygons);
    	t.push(0.0);
    }
    t.push(0.0); // Estas coordenadas corresponden al centro de uno de los extremos, no van a ser usadas para el calculo del lateral, pero
    t.push(0.0); // es necesario indicarlas porque a la hora de hacer bind de los atributos tiene que haber una correspondencia, si estas 
    // coordenadas no se ponen entonces resulta que vamos a tener 4 coordenadas menos para los uv que número de vertices y dará error a la hora de renderizar
    for (var i = 0; i < a2.length; i++){
    	
    	t.push(1 - i/polygons);
    	t.push(1.0);
    }
    var caps = [];
    caps.push(0.5);
    caps.push(0.5);
    var radian;
    
    for (var i = 0; i < a2.length; i++){
    	caps.push(0.5 * Math.cos(dA*i) + 0.5);
    	caps.push(0.5 * Math.sin(dA*i) + 0.5);
    	//caps.push(1 - i/polygons);
    }
    caps.push(0.5);
    caps.push(0.5);

    for (var i = 0; i < a3.length; i++){
    	caps.push(0.5 * Math.cos(dA*i) + 0.5);
    	caps.push(0.5 * Math.sin(dA*i) + 0.5);
    }
    mesh.uv = t;
    // Normals for side surface
    for (var i = 0; i < a2.length-1; i++){
        // Normals for the first triangle
        var n = (i+1)%a2.length;
        var normal1 = AL3D.Utils.computeNormal(a2[i],a2[n],a3[i]).normalize();
        sideCapNormal[i+1] = sideCapNormal[i+1].add(normal1);
        sideCapNormal[i+2] = sideCapNormal[i+2].add(normal1);
        sideCapNormal[i+2+polygons] = sideCapNormal[i+2+polygons].add(normal1);

        // Normals for the second triangle
        var normal2 = AL3D.Utils.computeNormal(a2[n],a3[n],a3[i]).normalize();
        sideCapNormal[i+2] = sideCapNormal[i+2].add(normal2);
        sideCapNormal[i+polygons+2 +1] = sideCapNormal[i+polygons+2 +1].add(normal2);
        sideCapNormal[i+2+polygons] = sideCapNormal[i+2+polygons].add(normal2);
    }

    for (var i = 0; i < sideCapNormal.length; i++){
    	if (sideCapNormal[i].equals(new ALMath.Vector3(0,0,0))){
    		continue;
    	}
        sideCapNormal[i] = sideCapNormal[i].normalize();
    }
    // Normals for top and bottom Cap
    for (var i = 0; i< polygons+1; i++){
        topBottomCapNormal.push(new ALMath.Vector3(0,-1,0));
    }
    for (var i = 0; i< polygons+1; i++){
        topBottomCapNormal.push(new ALMath.Vector3(0,1,0));
    }
    mesh.hasNormals = true;

    vertex = a1.concat(a2);
    vertex = vertex.concat(a4);
    vertex = vertex.concat(a3);
    mesh.vertices = vertex;
    mesh.indices = index;


    mesh.setUVBuffer("capUVBuffer", caps);
    mesh.setUVBuffer("sideUVBuffer", mesh.uv);
    if (urlTexture !== undefined){
    	mesh.setTexture(urlTexture, mesh.uv);
	}
	mesh.setVertexBuffer();
	mesh.setIndexBuffer();
	mesh.setNormalBuffer("sideNormalsBuffer", sideCapNormal);
	mesh.setNormalBuffer("capNormalsBuffer", topBottomCapNormal);

	mesh.type = "cone";

	mesh.render = function(){
		
		mesh.gl.bindBuffer(mesh.gl.ARRAY_BUFFER, mesh.capUVBuffer);
		this.gl.vertexAttribPointer(mesh.shaderProgram._uv, 2, this.gl.FLOAT, false,4*2,0) ;
		mesh.gl.bindBuffer(mesh.gl.ARRAY_BUFFER, this.capNormalsBuffer);
		this.gl.vertexAttribPointer(mesh.shaderProgram._vNormal, 3, this.gl.FLOAT, false, 4*3, 0);
		mesh.gl.drawArrays( mesh.gl.TRIANGLE_FAN, 0, polygons+1);

		
		mesh.gl.bindBuffer(mesh.gl.ARRAY_BUFFER, mesh.sideUVBuffer);
		this.gl.vertexAttribPointer(mesh.shaderProgram._uv, 2, this.gl.FLOAT, false,4*2,0) ;
		mesh.gl.bindBuffer(mesh.gl.ARRAY_BUFFER, mesh.sideNormalsBuffer);
		this.gl.vertexAttribPointer(mesh.shaderProgram._vNormal, 3, this.gl.FLOAT, false, 4*3, 0);
		mesh.gl.bindBuffer(mesh.gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
		mesh.gl.drawElements(mesh.gl.TRIANGLE_STRIP, mesh.indices.length, mesh.gl.UNSIGNED_SHORT, 0);

		
		mesh.gl.bindBuffer(mesh.gl.ARRAY_BUFFER, mesh.capUVBuffer);
		this.gl.vertexAttribPointer(mesh.shaderProgram._uv, 2, this.gl.FLOAT, false,4*2,0) ;
		mesh.gl.bindBuffer(mesh.gl.ARRAY_BUFFER, mesh.capNormalsBuffer);
		this.gl.vertexAttribPointer(mesh.shaderProgram._vNormal, 3, this.gl.FLOAT, false, 4*3, 0);
		mesh.gl.drawArrays( mesh.gl.TRIANGLE_FAN, polygons+1, (polygons+1));
	}

	return mesh;
}

AL3D.Mesh.createCircle = function(p){
	var mesh = new AL3D.Mesh();
	var r = p.radius || 1;
	var res = p.resolution || 20;
	mesh.material = p.material || new AL3D.BasicMaterial();
	var urlTexture = mesh.material.texture;

	var resolution = res || 20;
	var createCircle = function(n, startAngle, z, radius){
		var vertices = [],dA = Math.PI*2/(n-1),angle,r=0.9;
	    if (arguments.length === 4){
	        r = radius;
	    }
	    var index;
	    for(var i = 0; i < n-1; i++){
	        angle = startAngle + dA*i;
	        vertices.push(new ALMath.Vector3(r*Math.cos(angle),z,r*Math.sin(angle)));
	        index = i;
	    }
	    angle = startAngle + dA*(index+1);
	    vertices.push(new ALMath.Vector3(r*Math.cos(angle),z,r*Math.sin(angle)));
	    return vertices;
	};

	mesh.vertices.push(new ALMath.Vector3(0,0,0));
	mesh.vertices = mesh.vertices.concat(createCircle(resolution,0,0,r));


    var dA = Math.PI*2/(resolution-1);
    mesh.uv = [];
    mesh.uv.push(0.5);
    mesh.uv.push(0.5);
    var radian;
    
    for (var i = 0; i < resolution; i++){
    	mesh.uv.push(0.5 * Math.cos(dA*i) + 0.5);
    	mesh.uv.push(0.5 * Math.sin(dA*i) + 0.5);
    }
    mesh.uv.push(0.5);

    for (var i = 0; i< resolution+1; i++){
        mesh.normals.push(new ALMath.Vector3(0,-1,0));
    }
    mesh.hasNormals = true;

    mesh.type = "circle";

    mesh.setUVBuffer();
    if (urlTexture !== undefined ){
		mesh.setTexture(urlTexture, mesh.uv);
	}
	mesh.setVertexBuffer();
	mesh.setIndexBuffer();
	mesh.setNormalBuffer();
	mesh.gl.bindBuffer(mesh.gl.ARRAY_BUFFER, mesh.uvBuffer);
	mesh.gl.bufferData(mesh.gl.ARRAY_BUFFER, new Float32Array(mesh.uv),mesh.gl.STATIC_DRAW);
	mesh.gl.bindBuffer(mesh.gl.ARRAY_BUFFER, mesh.normalBuffer);
	mesh.gl.bufferData(mesh.gl.ARRAY_BUFFER, new Float32Array(mesh.getNormals()),mesh.gl.STATIC_DRAW);
	mesh.render = function(){
		//this.gl.vertexAttribPointer(mesh.shaderProgram._vNormal, 3, this.gl.FLOAT, false, 4*3, 0);
		this.gl.drawArrays( this.gl.TRIANGLE_FAN, 0, resolution+1);
	}
	return mesh;
}

AL3D.Mesh.createCube = function(p){
	var mesh = new AL3D.Mesh();
	var l = p.size;
	mesh.material = p.material || new AL3D.BasicMaterial();
	var urlTexture = mesh.material.texture;
	l = l || 1;
	n = l/2;
	mesh.vertices = [
	    // Front face
	    -n, -n,  n,
	     n, -n,  n,
	     n,  n,  n,
	    -n,  n,  n,
	    
	    // Back face
	    -n, -n, -n,
	    -n,  n, -n,
	     n,  n, -n,
	     n, -n, -n,
	    
	    // Top face
	    -n,  n, -n,
	    -n,  n,  n,
	     n,  n,  n,
	     n,  n, -n,
	    
	    // Bottom face
	    -n, -n, -n,
	     n, -n, -n,
	     n, -n,  n,
	    -n, -n,  n,
	    
	    // Right face
	     n, -n, -n,
	     n,  n, -n,
	     n,  n,  n,
	     n, -n,  n,
	    
	    // Left face
	    -n, -n, -n,
	    -n, -n,  n,
	    -n,  n,  n,
	    -n,  n, -n
  	];

  	mesh.normals = [
		0, 0, 1,
		0, 0, 1,
		0, 0, 1,
		0, 0, 1,

		0, 0, -1,
		0, 0, -1,
		0, 0, -1,
		0, 0, -1,

		0, 1, 0,
		0, 1, 0,
		0, 1, 0,
		0, 1, 0,

		0, -1, 0,
		0, -1, 0,
		0, -1, 0,
		0, -1, 0,

		1, 0, 0,
		1, 0, 0,
		1, 0, 0,
		1, 0, 0,

		-1, 0, 0,
		-1, 0, 0,
		-1, 0, 0,
		-1, 0, 0
	];

	mesh.hasNormals = true;

	mesh.indices = [
		0,  1,  2,      0,  2,  3,    // front
	    4,  5,  6,      4,  6,  7,    // back
	    8,  9,  10,     8,  10, 11,   // top
	    12, 13, 14,     12, 14, 15,   // bottom
	    16, 17, 18,     16, 18, 19,   // right
	    20, 21, 22,     20, 22, 23    // left
	];

	mesh.uv = [
	    // Front
	    0.0,  0.0,
	    1.0,  0.0,
	    1.0,  1.0,
	    0.0,  1.0,
	    // Back
	    
	    1.0,0.0,
	    1.0,1.0,
	    0.0,1.0,
	    0.0,0.0,
	    
	    // Top
	    0.0,  1.0,
	    0.0,  0.0,
	    1.0,  0.0,
	    1.0,  1.0,
	    
	    // Bottom
	    0.0,  0.0,
	    1.0,  0.0,
	    1.0,  1.0,
	    0.0,  1.0,
	    // Right

	    0.0,  0.0,
	    
	    
	    0.0,  1.0,
	    1.0,  1.0,
	    1.0,  0.0,
	    // Left
	    0.0,  0.0,
	    1.0,  0.0,
	    1.0,  1.0,
	    0.0,  1.0
	];

	mesh.type = "cube";

	mesh.setUVBuffer();
	
	if (urlTexture !== undefined && mesh.uv !== undefined){
		mesh.setTexture(urlTexture, mesh.uv);
	}

	mesh.setVertexBuffer();
	mesh.setIndexBuffer();
	mesh.setNormalBuffer();
	return mesh;
}

AL3D.Mesh.createPlane = function(p){
	var mesh = new AL3D.Mesh();
	mesh.material = p.material || new AL3D.BasicMaterial();

	var l = p.size;
	var urlTexture = mesh.material.texture;

	l = l || 1;
	n = l/2;

	mesh.vertices = [
	    -n, -n,  0,
	     n, -n,  0,
	     n,  n,  0,
	    -n,  n,  0
    ];

    mesh.indices = [
		0,  1,  2,      0,  2,  3
	];

	mesh.uv = [
	    0.0,  0.0,
	    1.0,  0.0,
	    1.0,  1.0,
	    0.0,  1.0,
	];

	mesh.normals = [
		0, 0, 1,
		0, 0, 1,
		0, 0, 1,
		0, 0, 1
	];
	mesh.hasNormals = true;

	mesh.type = "plane";

	mesh.setUVBuffer();

	if (urlTexture !== undefined && mesh.uv !== undefined){
		mesh.setTexture(urlTexture, mesh.uv);
	}

	mesh.setVertexBuffer();
	mesh.setIndexBuffer();
	mesh.setNormalBuffer();
	return mesh;
}

AL3D.TextureManager.prototype = {
	set : function(key, value){
		this._cache[key] = value;
	},
	get : function(key){
		return this._cache[key];
	},
	loadTexture : function (url, callback){
		if (this._cache[url]){
			callback(this._cache[url]);
		}else{
			var image=new Image();

			image.src=url;
			image.onload=function(e) {
				callback(this);
			};
			this._cache[url] = image;
		}
	}
}

AL3D.ShaderManager.prototype = {
	getTangentComputationFunctions : function (mesh){
		var code = [];
		code.push("mat3 computeTangentSpace(vec3 N, vec3 p, vec2 uv){");
		code.push("vec3 dp1 = dFdx( p );");
		code.push("vec3 dp2 = dFdy( p );");
		code.push("vec2 duv1 = dFdx( uv );");
		code.push("vec2 duv2 = dFdy( uv );");
		code.push("vec3 dp2perp = cross( dp2, N );");
		code.push("vec3 dp1perp = cross( N, dp1 );");
		code.push("vec3 T = dp2perp * duv1.x + dp1perp * duv2.x;");
		code.push("vec3 B = dp2perp * duv1.y + dp1perp * duv2.y;");
		code.push("float invmax = inversesqrt( max( dot(T,T), dot(B,B) ) );");
		code.push("return mat3( T * invmax, B * invmax, N );");
		code.push("}");
		code.push("");
		code.push("vec3 transformNormalWithTangentSpace( vec3 N, vec3 V, vec2 texcoord ){");
		code.push("vec3 map = texture2D(uNormalMapSampler, texcoord ).xyz;");
		code.push("map = map * 255./127. - 128./127.;");
		code.push("mat3 TBN = computeTangentSpace(N, -V, texcoord);");
		code.push("return normalize(TBN * map);");
		code.push("}");
		return code.join("\n");
	},
	getPointLightFor : function (mesh){
		var code = [];
		code.push("vec4 calculePointLight(int index, PointLight light, vec3 N){");
		code.push("vec3 L;")
		code.push("vec4 diffuse;");
		code.push("float Kd, dist, att;");
		code.push("dist = distance(P, light.position);");
		code.push("att = 1.0/(light.constantAttenuation + light.linearAttenuation * dist + light.quadraticAttenuation * dist * dist);");
		code.push("L = normalize( light.position.xyz - P );");
		code.push("Kd = max( dot(L, N), 0.0 );");
		code.push("diffuse = Kd*light.color*light.intensity*material.diffuseColor;");
		if (mesh.material instanceof AL3D.LambertMaterial){
			code.push("return diffuse*att;");
		}else if (mesh.material instanceof AL3D.PhongMaterial || mesh.material instanceof AL3D.BlinnMaterial){
			code.push("float angle;");
			if (mesh.material instanceof AL3D.BlinnMaterial){
				code.push("H = normalize(L+E);");
				code.push("angle = max(dot(N,H),0.0);");
			}else{
				code.push("vec3 R = reflect(-L,N);");
				code.push("angle = max(dot(R,E),0.0);");
			}
			if (mesh.material.specularMap !== undefined){
				code.push("float shininess = texture2D(uSpecularMapSampler, vec2(vTextureCoord.s, vTextureCoord.t)).r*255.0;");
				code.push("float Ks = 0.0;");
				code.push("if (shininess > 5.0){");
				code.push("Ks = pow(angle, shininess);}");
			}else{
				code.push("float Ks = pow(angle, material.shininess);");
			}
			code.push("vec4 specular = Ks*light.color*light.intensity*material.specularColor;");
			code.push("if (dot(L,N) < 0.0){");
			code.push("specular = vec4(0.0,0.0,0.0,1.0);");
			code.push("}");
			code.push("vec4 result = min((diffuse+specular)*att,vec4(1));");
			code.push("result.a = 1.0;");
			code.push("return result;");
		}
		code.push("}");
		return code.join("\n");
	},
	getPointLightToonFor : function (mesh){
		var code = [];
		code.push("float calculePointLight(int index, PointLight light, vec3 N){");
		code.push("vec3 L;")
		code.push("vec4 diffuse;");
		code.push("float Kd, dist, att;");
		code.push("dist = distance(P, light.position);");
		code.push("att = 1.0/(light.constantAttenuation + light.linearAttenuation * dist + light.quadraticAttenuation * dist * dist);");
		code.push("L = normalize( light.position.xyz - P );");
		code.push("Kd = pow(max( dot(L, N), 0.0 ), 5.0);");
		code.push("return Kd*att;");
		code.push("}");
		return code.join("\n");
	},
	getDirectionalLightFor : function (mesh){
		var code = []
		code.push("vec4 calculeDirectionalLight(int index, DirectionalLight light, vec3 N){");
		code.push("vec4 diffuse;");
		code.push("vec3 L;");
		code.push("float Kd;");
		code.push("L = normalize(light.position.xyz);");
		code.push("Kd = max( dot(L, N), 0.0 );");
		code.push("diffuse = Kd*light.color*light.intensity*material.diffuseColor;");
		if (mesh.material instanceof AL3D.LambertMaterial){
			code.push("return diffuse;");
		}else if (mesh.material instanceof AL3D.PhongMaterial || mesh.material instanceof AL3D.BlinnMaterial){
			code.push("float angle;");
			if (mesh.material instanceof AL3D.BlinnMaterial){
				code.push("H = normalize(L+E);");
				code.push("angle = max(dot(N,H),0.0);");
			}else{
				code.push("vec3 R = reflect(-L,N);");
				code.push("angle = max(dot(R,E),0.0);");
			}
			if (mesh.material.specularMap !== undefined){
				code.push("float shininess = texture2D(uSpecularMapSampler, vec2(vTextureCoord.s, vTextureCoord.t)).r*255.0;");
				code.push("float Ks = 0.0;");
				code.push("if (shininess > 5.0){");
				code.push("Ks = pow(angle, shininess);}");
			}else{
				code.push("float Ks = pow(angle, material.shininess);");
			}
			code.push("vec4 specular = Ks*light.color*light.intensity*material.specularColor;");
			code.push("if (dot(L,N) < 0.0){");
			code.push("specular = vec4(0.0,0.0,0.0,1.0);");
			code.push("}");
			code.push("vec4 result = min((diffuse+specular),vec4(1));");
			code.push("result.a = 1.0;");
			code.push("return result;");
		}
		code.push("}");
		return code.join("\n");
	},
	getDirectionalLightToonFor : function (mesh){
		var code = []
		code.push("float calculeDirectionalLight(int index, DirectionalLight light, vec3 N){");
		code.push("vec3 L;")
		code.push("vec4 diffuse;");
		code.push("float Kd;");
		code.push("L = normalize( light.position.xyz - P );");
		code.push("Kd = pow(max( dot(L, N), 0.0 ), 5.0);");
		code.push("return Kd;");
		code.push("}");
		return code.join("\n");
	},
	getSpotLigthFor : function (mesh){
		var code = [];
		code.push("vec4 calculeSpotLight(int index, SpotLight light, vec3 N){");
		code.push("vec4 diffuse;");
		code.push("vec3 L;");
		code.push("float Kd, dist, att;");
		code.push("dist = distance(P, light.position);");
		code.push("att = 1.0/(light.constantAttenuation + light.linearAttenuation * dist + light.quadraticAttenuation * dist * dist);");
		code.push("float spotCos = dot(P, -light.coneDirection);");
		code.push("if (spotCos < light.spotCosCutOff){");
		code.push("att = 0.0;");
		code.push("}else{");
		code.push("att *= pow(spotCos, light.spotExponent);");
		code.push("}");
		code.push("L = normalize( light.position.xyz - P );");
		code.push("Kd = max( dot(L, N), 0.0 );");
		code.push("diffuse = (Kd*light.color*light.intensity*material.diffuseColor);");
		if (mesh.material instanceof AL3D.LambertMaterial){
			code.push("return diffuse*att;");
		}else if (mesh.material instanceof AL3D.PhongMaterial || mesh.material instanceof AL3D.BlinnMaterial){
			code.push("float angle;");
			if (mesh.material instanceof AL3D.BlinnMaterial){
				code.push("H = normalize(L+E);");
				code.push("angle = max(dot(N,H),0.0);");
			}else{
				code.push("vec3 R = reflect(-L,N);");
				code.push("angle = max(dot(R,E),0.0);");
			}
			if (mesh.material.specularMap !== undefined){
				code.push("float shininess = texture2D(uSpecularMapSampler, vec2(vTextureCoord.s, vTextureCoord.t)).r * 255.0;");
				code.push("float Ks = pow(angle, shininess);");
			}else{
				code.push("float Ks = pow(angle, material.shininess);");
			}
			code.push("vec4 specular = Ks*light.color*light.intensity*material.specularColor;");
			code.push("if (dot(L,N) < 0.0){");
			code.push("specular = vec4(0.0,0.0,0.0,1.0);");
			code.push("}");
			code.push("vec4 result = min((diffuse+specular)*att,vec4(1));");
			code.push("result.a = 1.0;");
			code.push("return result;");
		}
		code.push("}");
		return code.join("\n");
	},
	getSpotLigthToonFor : function (mesh){
		var code = [];
		code.push("float calculeSpotLight(int index, SpotLight light, vec3 N){");
		code.push("vec4 diffuse;");
		code.push("vec3 L;");
		code.push("float Kd, dist, att;");
		code.push("dist = distance(P, light.position);");
		code.push("att = 1.0/(light.constantAttenuation + light.linearAttenuation * dist + light.quadraticAttenuation * dist * dist);");
		code.push("float spotCos = dot(P, -light.coneDirection);");
		code.push("if (spotCos < light.spotCosCutOff){");
		code.push("att = 0.0;");
		code.push("}else{");
		code.push("att *= pow(spotCos, light.spotExponent);");
		code.push("}");
		code.push("L = normalize( light.position.xyz - P );");
		code.push("Kd = pow(max( dot(L, N), 0.0 ), 5.0);");
		code.push("return Kd;");
		code.push("}");
		return code.join("\n");
	},
	getShader : function (mesh, lights){
		var vertexShader = [], fragmentShader = [], fragmentShaderStr, vertexShaderStr,id;
		var directionalLights=[], pointLights=[], ambientLights=[], spotLights=[];
		for (var i = 0; i< lights.length; i++){
			if (lights[i] instanceof AL3D.AmbientLight){
				ambientLights.push(lights[i]);
			}else if (lights[i] instanceof AL3D.DirectionalLight){
				directionalLights.push(lights[i]);
			}else if (lights[i] instanceof AL3D.PointLight){
				pointLights.push(lights[i]);
			}else if (lights[i] instanceof AL3D.SpotLight){
				spotLights.push(lights[i]);
			}
		}

		// Create id for this shader
		id = ""+mesh.material.type;
		id += mesh.material.shading;
		id += (mesh.material.texture ===undefined)?"NOTEXTURE":"TEXTURE";
		id += "AL"+ambientLights.length;
		id += "DL"+directionalLights.length;
		id += "PL"+pointLights.length;
		
		vertexShader.push("attribute vec3 vPosition;");
		fragmentShader.push("#extension GL_OES_standard_derivatives : enable");
		fragmentShader.push("precision mediump float;");

		if (mesh.material.texture !== undefined){
			vertexShader.push("attribute vec2 aTextureCoord;");
			fragmentShader.push("varying highp vec2 vTextureCoord;");
			fragmentShader.push("uniform sampler2D uSampler;");
		}
		if (mesh.material.specularMap !== undefined){
			fragmentShader.push("uniform sampler2D uSpecularMapSampler;");
		}
		if (mesh.material.normalMap !== undefined){
			fragmentShader.push("uniform sampler2D uNormalMapSampler;");
		}
		vertexShader.push("uniform mat4 vMVP;");
		if (mesh.material.texture !== undefined){
			vertexShader.push("varying highp vec2 vTextureCoord;");
		}

		/* HELPER FUNCTIONS (i.e compute light) */
		var compileWithNormals = false;

		if (mesh.material instanceof AL3D.ToonMaterial){
			if (mesh.material !== undefined){
				vertexShader.push("attribute vec3 vNormal;");
				vertexShader.push("uniform mat3 normalMatrix;");
				vertexShader.push("uniform mat4 viewModelMatrix;");

				fragmentShader.push("struct AmbientLight{");
				fragmentShader.push("vec4 color;");
				fragmentShader.push("float intensity;");
				fragmentShader.push("};");

				fragmentShader.push("struct DirectionalLight{");
				fragmentShader.push("vec4 color;");
				fragmentShader.push("float intensity;");
				fragmentShader.push("vec3 position;");
				fragmentShader.push("};");

				fragmentShader.push("struct PointLight{");
				fragmentShader.push("vec4 color;");
				fragmentShader.push("float intensity;");
				fragmentShader.push("vec3 position;");
				fragmentShader.push("float linearAttenuation;");
				fragmentShader.push("float quadraticAttenuation;");
				fragmentShader.push("float constantAttenuation;");
				fragmentShader.push("};");

				fragmentShader.push("struct SpotLight{");
				fragmentShader.push("vec4 color;");
				fragmentShader.push("float intensity;");
				fragmentShader.push("vec3 position;");
				fragmentShader.push("vec3 coneDirection;");
				fragmentShader.push("float spotCosCutOff;");
				fragmentShader.push("float spotExponent;");
				fragmentShader.push("float linearAttenuation;");
				fragmentShader.push("float quadraticAttenuation;");
				fragmentShader.push("float constantAttenuation;");
				fragmentShader.push("};");

				if (ambientLights.length > 0){
					fragmentShader.push("const int MAX_AMBIENT_LIGHT = " + ambientLights.length+";");
					fragmentShader.push("uniform AmbientLight ambientLights["+ambientLights.length+"];");
				}
				if (directionalLights.length > 0){
					fragmentShader.push("uniform DirectionalLight directionalLights["+directionalLights.length+"];");
					fragmentShader.push("const int MAX_DIRECTIONAL_LIGHT = " + directionalLights.length+";");
				}
				if (pointLights.length > 0){
					fragmentShader.push("uniform PointLight pointLights["+pointLights.length+"];");
					fragmentShader.push("const int MAX_POINT_LIGHT = " + pointLights.length+";");
				}
				if (spotLights.length > 0){
					fragmentShader.push("uniform SpotLight spotLights["+spotLights.length+"];");
					fragmentShader.push("const int MAX_SPOT_LIGHT = " + spotLights.length+";");
				}

				fragmentShader.push("struct Material{");
				fragmentShader.push("vec4 diffuseColor;");
				fragmentShader.push("};");
				fragmentShader.push("uniform Material material;");
				vertexShader.push("varying vec3 N,E,P;");
				fragmentShader.push("varying vec3 N,E,P;");

				compileWithNormals = true;

				// POINT LIGHT
				fragmentShader.push(this.getPointLightToonFor(mesh));
				// SPOT LIGTH
				fragmentShader.push(this.getSpotLigthToonFor(mesh));
				// DIRECTIONAL LIGTH
				fragmentShader.push(this.getDirectionalLightToonFor(mesh));
				
				fragmentShader.push("uniform sampler2D uSamplerToon;");
				vertexShader.push("void main(){");
				fragmentShader.push("void main(){");
				vertexShader.push("gl_Position = vMVP*vec4(vPosition,1.);");

				vertexShader.push("vec4 vPos = vec4(vPosition,1);");
				vertexShader.push("P = normalize((viewModelMatrix * vPos).xyz);");
				vertexShader.push("N = normalize( normalMatrix*vNormal);");
				fragmentShader.push("vec4 fColor;");
				fragmentShader.push("fColor = vec4(0,0,0,1);");

				if (directionalLights.length > 0){
					fragmentShader.push("for (int i = 0; i < MAX_DIRECTIONAL_LIGHT; i++){");
					fragmentShader.push("float Kd = calculeDirectionalLight(i, directionalLights[i], N);");
					fragmentShader.push("fColor += texture2D(uSamplerToon, vec2(Kd, 0.5));//texture2D(uSamplerToon, vec2(calculeDirectionalLight(i, directionalLights[i]),0.5));");
					fragmentShader.push("}");
				}

				if (pointLights.length > 0){
					fragmentShader.push("for (int i = 0; i < MAX_POINT_LIGHT; i++){");
					fragmentShader.push("fColor += texture2D(uSamplerToon, vec2(calculePointLight(i, pointLights[i], N),0.5));");
					fragmentShader.push("}");
				}

				if (spotLights.length > 0){
					fragmentShader.push("for (int i = 0; i < MAX_SPOT_LIGHT; i++){");
					fragmentShader.push("fColor += texture2D(uSamplerToon, vec2(calculeSpotLight(i, spotLights[i], N),0.5));");
					fragmentShader.push("}");
				}
				if (mesh.material.sideMode === AL3D.TWO_SIDE){
					fragmentShader.push("vec4 bColor;");
					fragmentShader.push("bColor = vec4(0,0,0,1);");
					if (directionalLights.length > 0){
						fragmentShader.push("for (int i = 0; i < MAX_DIRECTIONAL_LIGHT; i++){");
						fragmentShader.push("float Kd = calculeDirectionalLight(i, directionalLights[i], -N);");
						fragmentShader.push("bColor += texture2D(uSamplerToon, vec2(Kd, 0.5));//texture2D(uSamplerToon, vec2(calculeDirectionalLight(i, directionalLights[i]),0.5));");
						fragmentShader.push("}");
					}

					if (pointLights.length > 0){
						fragmentShader.push("for (int i = 0; i < MAX_POINT_LIGHT; i++){");
						fragmentShader.push("float Kd = calculePointLight(i, pointLights[i], -N);");
						fragmentShader.push("bColor += texture2D(uSamplerToon, vec2(Kd,0.5))*(Kd*0.8+0.2);");
						fragmentShader.push("}");
					}

					if (spotLights.length > 0){
						fragmentShader.push("for (int i = 0; i < MAX_SPOT_LIGHT; i++){");
						fragmentShader.push("bColor += texture2D(uSamplerToon, vec2(calculeSpotLight(i, spotLights[i], -N),0.5));");
						fragmentShader.push("}");
					}
				}
				if (mesh.material.sideMode === AL3D.ONE_SIDE){
					if (mesh.material.texture !== undefined){
						vertexShader.push("vTextureCoord = aTextureCoord;");
						fragmentShader.push("gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t))*fColor;");
						
					}else{
						var color = AL3D.Utils.hexIntToRgbNormalized(mesh.material.diffuse);
						fragmentShader.push("gl_FragColor = vec4("+color.r+","+color.g+","+color.b+","+color.a+")*fColor;");
					}
				}else{
					if (mesh.material.texture !== undefined){
						vertexShader.push("vTextureCoord = aTextureCoord;");
						fragmentShader.push("if (gl_FrontFacing){");
						fragmentShader.push("gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t))*fColor;");
						fragmentShader.push("}else{");
						fragmentShader.push("gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t))*bColor;");
						fragmentShader.push("}");
					}else{
						var color = AL3D.Utils.hexIntToRgbNormalized(mesh.material.diffuse);
						fragmentShader.push("if (gl_FrontFacing){");
						fragmentShader.push("gl_FragColor = vec4("+color.r+","+color.g+","+color.b+","+color.a+")*fColor;");
						fragmentShader.push("}else{");
						fragmentShader.push("gl_FragColor = vec4("+color.r+","+color.g+","+color.b+","+color.a+")*bColor;");
						fragmentShader.push("}");
					}
				}
				
			}
		}else{
			if (mesh.material !== undefined){
				if (mesh.material.shading === AL3D.GouraudInterpolation){
					vertexShader.push("attribute vec3 vNormal;");
					vertexShader.push("uniform mat3 normalMatrix;");
					vertexShader.push("uniform mat4 viewModelMatrix;");
					vertexShader.push("varying vec4 fColor;");
					fragmentShader.push("varying vec4 fColor;");
					vertexShader.push("varying vec4 bColor;");
					fragmentShader.push("varying vec4 bColor;");

					vertexShader.push("struct AmbientLight{");
					vertexShader.push("vec4 color;");
					vertexShader.push("float intensity;");
					vertexShader.push("};");

					vertexShader.push("struct DirectionalLight{");
					vertexShader.push("vec4 color;");
					vertexShader.push("float intensity;");
					vertexShader.push("vec3 position;");
					vertexShader.push("};");

					vertexShader.push("struct PointLight{");
					vertexShader.push("vec4 color;");
					vertexShader.push("float intensity;");
					vertexShader.push("vec3 position;");
					vertexShader.push("float linearAttenuation;");
					vertexShader.push("float quadraticAttenuation;");
					vertexShader.push("float constantAttenuation;");
					vertexShader.push("};");

					vertexShader.push("struct SpotLight{");
					vertexShader.push("vec4 color;");
					vertexShader.push("float intensity;");
					vertexShader.push("vec3 position;");
					vertexShader.push("vec3 coneDirection;");
					vertexShader.push("float spotCosCutOff;");
					vertexShader.push("float spotExponent;");
					vertexShader.push("float linearAttenuation;");
					vertexShader.push("float quadraticAttenuation;");
					vertexShader.push("float constantAttenuation;");
					vertexShader.push("};");

					if (ambientLights.length > 0){
						vertexShader.push("const int MAX_AMBIENT_LIGHT = " + ambientLights.length+";");
								vertexShader.push("uniform AmbientLight ambientLights["+ambientLights.length+"];");
					}
					if (directionalLights.length > 0){
						vertexShader.push("uniform DirectionalLight directionalLights["+directionalLights.length+"];");
						vertexShader.push("const int MAX_DIRECTIONAL_LIGHT = " + directionalLights.length+";");
					}
					if (pointLights.length > 0){
						vertexShader.push("uniform PointLight pointLights["+pointLights.length+"];");
						vertexShader.push("const int MAX_POINT_LIGHT = " + pointLights.length+";");
					}
					if (spotLights.length > 0){
						vertexShader.push("uniform SpotLight spotLights["+spotLights.length+"];");
						vertexShader.push("const int MAX_SPOT_LIGHT = " + spotLights.length+";");
					}

					if (mesh.material instanceof AL3D.LambertMaterial){
						vertexShader.push("struct Material{");
						vertexShader.push("vec4 diffuseColor;");
						vertexShader.push("};");
					}else if (mesh.material instanceof AL3D.PhongMaterial || mesh.material instanceof AL3D.BlinnMaterial){
						vertexShader.push("struct Material{");
						vertexShader.push("vec4 diffuseColor;");
						vertexShader.push("vec4 specularColor;");
						vertexShader.push("float shininess;");
						vertexShader.push("};");
					}

					vertexShader.push("uniform Material material;");

					vertexShader.push("vec3 N,H,E,P;");

					compileWithNormals = true;

					// POINT LIGHT
					vertexShader.push(this.getPointLightFor(mesh));
					// SPOT LIGTH
					vertexShader.push(this.getSpotLigthFor(mesh));
					// DIRECTIONAL LIGTH
					vertexShader.push(this.getDirectionalLightFor(mesh));
					// Functions for normal maps
					if (mesh.material.normalMap !== undefined){
						vertexShader.push(this.getTangentComputationFunctions(mesh));
					}
				}else if ( mesh.material.shading === AL3D.PhongInterpolation){

					vertexShader.push("attribute vec3 vNormal;");
					vertexShader.push("uniform mat3 normalMatrix;");
					vertexShader.push("uniform mat4 viewModelMatrix;");

					fragmentShader.push("struct AmbientLight{");
					fragmentShader.push("vec4 color;");
					fragmentShader.push("float intensity;");
					fragmentShader.push("};");

					fragmentShader.push("struct DirectionalLight{");
					fragmentShader.push("vec4 color;");
					fragmentShader.push("float intensity;");
					fragmentShader.push("vec3 position;");
					fragmentShader.push("};");

					fragmentShader.push("struct PointLight{");
					fragmentShader.push("vec4 color;");
					fragmentShader.push("float intensity;");
					fragmentShader.push("vec3 position;");
					fragmentShader.push("float linearAttenuation;");
					fragmentShader.push("float quadraticAttenuation;");
					fragmentShader.push("float constantAttenuation;");
					fragmentShader.push("};");

					fragmentShader.push("struct SpotLight{");
					fragmentShader.push("vec4 color;");
					fragmentShader.push("float intensity;");
					fragmentShader.push("vec3 position;");
					fragmentShader.push("vec3 coneDirection;");
					fragmentShader.push("float spotCosCutOff;");
					fragmentShader.push("float spotExponent;");
					fragmentShader.push("float linearAttenuation;");
					fragmentShader.push("float quadraticAttenuation;");
					fragmentShader.push("float constantAttenuation;");
					fragmentShader.push("};");

					if (ambientLights.length > 0){
						fragmentShader.push("const int MAX_AMBIENT_LIGHT = " + ambientLights.length+";");
								fragmentShader.push("uniform AmbientLight ambientLights["+ambientLights.length+"];");
					}
					if (directionalLights.length > 0){
						fragmentShader.push("uniform DirectionalLight directionalLights["+directionalLights.length+"];");
						fragmentShader.push("const int MAX_DIRECTIONAL_LIGHT = " + directionalLights.length+";");
					}
					if (pointLights.length > 0){
						fragmentShader.push("uniform PointLight pointLights["+pointLights.length+"];");
						fragmentShader.push("const int MAX_POINT_LIGHT = " + pointLights.length+";");
					}
					if (spotLights.length > 0){
						fragmentShader.push("uniform SpotLight spotLights["+spotLights.length+"];");
						fragmentShader.push("const int MAX_SPOT_LIGHT = " + spotLights.length+";");
					}

					if (mesh.material instanceof AL3D.LambertMaterial){
						fragmentShader.push("struct Material{");
						fragmentShader.push("vec4 diffuseColor;");
						fragmentShader.push("};");
					}else if (mesh.material instanceof AL3D.PhongMaterial || mesh.material instanceof AL3D.BlinnMaterial){
						fragmentShader.push("struct Material{");
						fragmentShader.push("vec4 diffuseColor;");
						fragmentShader.push("vec4 specularColor;");
						fragmentShader.push("float shininess;");
						fragmentShader.push("};");
					}

					fragmentShader.push("uniform Material material;");
					vertexShader.push("varying vec3 E,N,P;");
					fragmentShader.push("varying vec3 E,N,P;");
					fragmentShader.push("vec3 H;");

					compileWithNormals = true;

					// POINT LIGHT
					fragmentShader.push(this.getPointLightFor(mesh));
					// SPOT LIGTH
					fragmentShader.push(this.getSpotLigthFor(mesh));
					// DIRECTIONAL LIGTH
					fragmentShader.push(this.getDirectionalLightFor(mesh));
					// Functions for normal maps
					if (mesh.material.normalMap !== undefined){
						fragmentShader.push(this.getTangentComputationFunctions(mesh));
					}
				}
				vertexShader.push("void main(){");
				fragmentShader.push("void main(){");
				vertexShader.push("gl_Position = vMVP*vec4(vPosition,1.);");
				if (mesh.material instanceof AL3D.BasicMaterial){
					if (mesh.material.texture !== undefined){
						vertexShader.push("vTextureCoord = aTextureCoord;");
						fragmentShader.push("gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));");
					}else{
						var color = AL3D.Utils.hexIntToRgbNormalized(mesh.material.diffuse);
						fragmentShader.push("gl_FragColor = vec4("+color.r+","+color.g+","+color.b+","+color.a+");");
					}
				}else{
					if ( mesh.material.shading === AL3D.GouraudInterpolation){
						vertexShader.push("vec4 vPos = vec4(vPosition,1);");
						vertexShader.push("P = normalize((viewModelMatrix * vPos).xyz);");
						vertexShader.push("E = normalize( -P );");
						vertexShader.push("N = normalize( normalMatrix*vNormal);");
						if (mesh.material.normalMap !== undefined){
							vertexShader.push("N = transformNormalWithTangentSpace(N, E ,aTextureCoord.st);");
						}

						vertexShader.push("fColor = vec4(0,0,0,1);");
						if (ambientLights.length > 0){
							vertexShader.push("for (int i = 0; i < MAX_AMBIENT_LIGHT; i++){");
							vertexShader.push("fColor += ambientLights[i].color;");
							vertexShader.push("}");
						}

						if (directionalLights.length > 0){
							vertexShader.push("for (int i = 0; i < MAX_DIRECTIONAL_LIGHT; i++){");
							vertexShader.push("fColor += calculeDirectionalLight(i, directionalLights[i], N);");
							vertexShader.push("}");
						}

						if (pointLights.length > 0){
							vertexShader.push("for (int i = 0; i < MAX_POINT_LIGHT; i++){");
							vertexShader.push("fColor += calculePointLight(i, pointLights[i], N);");
							vertexShader.push("}");
						}

						if (spotLights.length > 0){
							vertexShader.push("for (int i = 0; i < MAX_SPOT_LIGHT; i++){");
							vertexShader.push("fColor += calculeSpotLight(i, spotLights[i], N);");
							vertexShader.push("}");
						}
						if (mesh.material.sideMode === AL3D.TWO_SIDE){
							vertexShader.push("bColor = vec4(0,0,0,1);");
							if (ambientLights.length > 0){
								vertexShader.push("for (int i = 0; i < MAX_AMBIENT_LIGHT; i++){");
								vertexShader.push("bColor += ambientLights[i].color;");
								vertexShader.push("}");
							}

							if (directionalLights.length > 0){
								vertexShader.push("for (int i = 0; i < MAX_DIRECTIONAL_LIGHT; i++){");
								vertexShader.push("bColor += calculeDirectionalLight(i, directionalLights[i], -N);");
								vertexShader.push("}");
							}

							if (pointLights.length > 0){
								vertexShader.push("for (int i = 0; i < MAX_POINT_LIGHT; i++){");
								vertexShader.push("bColor += calculePointLight(i, pointLights[i], -N);");
								vertexShader.push("}");
							}

							if (spotLights.length > 0){
								vertexShader.push("for (int i = 0; i < MAX_SPOT_LIGHT; i++){");
								vertexShader.push("bColor += calculeSpotLight(i, spotLights[i], -N);");
								vertexShader.push("}");
							}
						}
						if (mesh.material.sideMode === AL3D.ONE_SIDE){
							if (mesh.material.texture !== undefined){
								vertexShader.push("vTextureCoord = aTextureCoord;");
								fragmentShader.push("gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t))*fColor;");
							}else{
								var color = AL3D.Utils.hexIntToRgbNormalized(mesh.material.diffuse);
								fragmentShader.push("gl_FragColor = vec4("+color.r+","+color.g+","+color.b+","+color.a+")*fColor;");
							}
						}else{
							if (mesh.material.texture !== undefined){
								vertexShader.push("vTextureCoord = aTextureCoord;");
								fragmentShader.push("if (gl_FrontFacing){");
								fragmentShader.push("gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t))*fColor;");
								fragmentShader.push("}else{");
								fragmentShader.push("gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t))*bColor;");
								fragmentShader.push("}");
							}else{
								var color = AL3D.Utils.hexIntToRgbNormalized(mesh.material.diffuse);
								fragmentShader.push("if (gl_FrontFacing){");
								//fragmentShader.push("gl_FragColor = vec4("+1.0+","+0.0+","+0.0+","+1.0+");");
								fragmentShader.push("gl_FragColor = vec4("+color.r+","+color.g+","+color.b+","+color.a+")*fColor;");
								fragmentShader.push("}else{");
								//fragmentShader.push("gl_FragColor = vec4("+0.0+","+1.0+","+0.0+","+1.0+");");
								fragmentShader.push("gl_FragColor = vec4("+color.r+","+color.g+","+color.b+","+color.a+")*bColor;");
								fragmentShader.push("}");
							}
						}
					}else if (mesh.material.shading === AL3D.PhongInterpolation){
						
						vertexShader.push("vec4 vPos = vec4(vPosition,1);");
						vertexShader.push("P = normalize((viewModelMatrix * vPos).xyz);");
						vertexShader.push("E = normalize( -P );");
						vertexShader.push("N = normalize( normalMatrix*vNormal);");
						if (mesh.material.normalMap !== undefined){
							fragmentShader.push("vec3 PN = transformNormalWithTangentSpace(N, E ,vTextureCoord.st);");
						}else{
							fragmentShader.push("vec3 PN = N;");
						}
						fragmentShader.push("vec4 fColor=vec4(0,0,0,1);");
						if (ambientLights.length > 0){
							fragmentShader.push("for (int i = 0; i < MAX_AMBIENT_LIGHT; i++){");
							fragmentShader.push("fColor += ambientLights[i].color;");
							fragmentShader.push("}");
						}

						if (directionalLights.length > 0){
							fragmentShader.push("for (int i = 0; i < MAX_DIRECTIONAL_LIGHT; i++){");
							fragmentShader.push("fColor += calculeDirectionalLight(i, directionalLights[i], PN);");
							fragmentShader.push("}");
						}

						if (pointLights.length > 0){
							fragmentShader.push("for (int i = 0; i < MAX_POINT_LIGHT; i++){");
							fragmentShader.push("fColor += calculePointLight(i, pointLights[i], PN);");
							fragmentShader.push("}");
						}

						if (spotLights.length > 0){
							fragmentShader.push("for (int i = 0; i < MAX_SPOT_LIGHT; i++){");
							fragmentShader.push("fColor += calculeSpotLight(i, spotLights[i], PN);");
							fragmentShader.push("}");
						}
						if (mesh.material.sideMode === AL3D.TWO_SIDE){
							fragmentShader.push("vec4 bColor;");
							if (ambientLights.length > 0){
								fragmentShader.push("for (int i = 0; i < MAX_AMBIENT_LIGHT; i++){");
								fragmentShader.push("bColor += ambientLights[i].color;");
								fragmentShader.push("}");
							}

							if (directionalLights.length > 0){
								fragmentShader.push("for (int i = 0; i < MAX_DIRECTIONAL_LIGHT; i++){");
								fragmentShader.push("bColor += calculeDirectionalLight(i, directionalLights[i], -PN);");
								fragmentShader.push("}");
							}

							if (pointLights.length > 0){
								fragmentShader.push("for (int i = 0; i < MAX_POINT_LIGHT; i++){");
								fragmentShader.push("bColor += calculePointLight(i, pointLights[i], -PN);");
								fragmentShader.push("}");
							}

							if (spotLights.length > 0){
								fragmentShader.push("for (int i = 0; i < MAX_SPOT_LIGHT; i++){");
								fragmentShader.push("bColor += calculeSpotLight(i, spotLights[i], -PN);");
								fragmentShader.push("}");
							}
						}
						if (mesh.material.sideMode === AL3D.ONE_SIDE){
							if (mesh.material.texture !== undefined){
								vertexShader.push("vTextureCoord = aTextureCoord;");
								fragmentShader.push("gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t))*fColor;");
							}else{
								var color = AL3D.Utils.hexIntToRgbNormalized(mesh.material.diffuse);
								fragmentShader.push("gl_FragColor = vec4("+color.r+","+color.g+","+color.b+","+color.a+")*fColor;");
							}
						}else{
							if (mesh.material.texture !== undefined){
								vertexShader.push("vTextureCoord = aTextureCoord;");
								fragmentShader.push("if (gl_FrontFacing){");
								fragmentShader.push("gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t))*fColor;");
								fragmentShader.push("}else{");
								fragmentShader.push("gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t))*bColor;");
								fragmentShader.push("}");
							}else{
								var color = AL3D.Utils.hexIntToRgbNormalized(mesh.material.diffuse);
								fragmentShader.push("if (gl_FrontFacing){");
								//fragmentShader.push("gl_FragColor = vec4("+1.0+","+0.0+","+0.0+","+1.0+");");
								fragmentShader.push("gl_FragColor = vec4("+color.r+","+color.g+","+color.b+","+color.a+")*fColor;");
								fragmentShader.push("}else{");
								//fragmentShader.push("gl_FragColor = vec4("+0.0+","+1.0+","+0.0+","+1.0+");");
								fragmentShader.push("gl_FragColor = vec4("+color.r+","+color.g+","+color.b+","+color.a+")*bColor;");
								fragmentShader.push("}");
								
							}
						}
						
					}// END PHONG INTERPOLATION
				}
			}
		}
		vertexShader.push("}");
		fragmentShader.push("}");

		fragmentShaderStr = fragmentShader.join("\n");
		vertexShaderStr = vertexShader.join("\n");


		var getShader = function (source, type, typeString){
			var shader = AL3D.Renderer.gl.createShader(type);
			AL3D.Renderer.gl.shaderSource(shader, source);
			AL3D.Renderer.gl.compileShader(shader);
			if (!AL3D.Renderer.gl.getShaderParameter(shader,AL3D.Renderer.gl.COMPILE_STATUS)){
				alert ("Error en "+typeString+ " Shader : " + AL3D.Renderer.gl.getShaderInfoLog(shader));
	      		return false;
			}
			return shader;
		}

		var vertexShaderCompiled = getShader(vertexShaderStr, AL3D.Renderer.gl.VERTEX_SHADER, "VERTEX");
		var fragmentShaderCompiled = getShader(fragmentShaderStr, AL3D.Renderer.gl.FRAGMENT_SHADER, "FRAGMENT");
		var shaderProgram = AL3D.Renderer.gl.createProgram();
		AL3D.Renderer.gl.attachShader(shaderProgram, vertexShaderCompiled);
		AL3D.Renderer.gl.attachShader(shaderProgram, fragmentShaderCompiled);

		AL3D.Renderer.gl.linkProgram(shaderProgram);

		shaderProgram._position = AL3D.Renderer.gl.getAttribLocation(shaderProgram, "vPosition");
		AL3D.gl.enableVertexAttribArray(shaderProgram._position);
		shaderProgram._MVP = AL3D.Renderer.gl.getUniformLocation(shaderProgram, "vMVP");
		if (mesh.material.texture !== undefined){
			shaderProgram._sampler =  AL3D.Renderer.gl.getUniformLocation(shaderProgram, "uSampler");
			shaderProgram._uv = AL3D.Renderer.gl.getAttribLocation(shaderProgram, "aTextureCoord");
			AL3D.gl.enableVertexAttribArray(shaderProgram._uv);
		}
		if (mesh.material.specularMap !== undefined){
			shaderProgram._uSpecularMapSampler =  AL3D.Renderer.gl.getUniformLocation(shaderProgram, "uSpecularMapSampler");
		}
		if (mesh.material.normalMap !== undefined){
			shaderProgram._uNormalMapSampler =  AL3D.Renderer.gl.getUniformLocation(shaderProgram, "uNormalMapSampler");
		}
		if (compileWithNormals){
			shaderProgram._vNormal =  AL3D.Renderer.gl.getAttribLocation(shaderProgram, "vNormal");
			AL3D.gl.enableVertexAttribArray(shaderProgram._vNormal);
			
			shaderProgram._viewModelMatrix = AL3D.gl.getUniformLocation(shaderProgram,"viewModelMatrix");
			shaderProgram._normalMatrix = AL3D.gl.getUniformLocation(shaderProgram,"normalMatrix");
		}
		// Uniform for matrix

	    // Uniforms for lights
	    // Ambient light
	    shaderProgram._ambientLights = [];          // locations of light properties
	    for (var i = 0; i < ambientLights.length; i++) {
	        shaderProgram._ambientLights[i] = {};   // locations of properties of light number i
	        shaderProgram._ambientLights[i].color = AL3D.gl.getUniformLocation(shaderProgram,"ambientLights[" + i + "].color");
	        shaderProgram._ambientLights[i].intensity = AL3D.gl.getUniformLocation(shaderProgram,"ambientLights[" + i + "].intensity");
	    }
	    // Directional lights
	    shaderProgram._directionalLights = [];          // locations of light properties
	    for (var i = 0; i < directionalLights.length; i++) {
	        shaderProgram._directionalLights[i] = {};   // locations of properties of light number i
	        shaderProgram._directionalLights[i].color = AL3D.gl.getUniformLocation(shaderProgram,"directionalLights[" + i + "].color");
	        shaderProgram._directionalLights[i].intensity = AL3D.gl.getUniformLocation(shaderProgram,"directionalLights[" + i + "].intensity");
	        shaderProgram._directionalLights[i].position = AL3D.gl.getUniformLocation(shaderProgram,"directionalLights[" + i + "].position");
	    }
	    shaderProgram._pointLights = [];          // locations of light properties
	    for (var i = 0; i < pointLights.length; i++) {
	        shaderProgram._pointLights[i] = {};   // locations of properties of light number i
	        shaderProgram._pointLights[i].position = AL3D.gl.getUniformLocation(shaderProgram,"pointLights[" + i + "].position");
	        shaderProgram._pointLights[i].intensity = AL3D.gl.getUniformLocation(shaderProgram,"pointLights[" + i + "].intensity");
	        shaderProgram._pointLights[i].linearAttenuation = AL3D.gl.getUniformLocation(shaderProgram,"pointLights[" + i + "].linearAttenuation");
	        shaderProgram._pointLights[i].quadraticAttenuation = AL3D.gl.getUniformLocation(shaderProgram,"pointLights[" + i + "].quadraticAttenuation");
	        shaderProgram._pointLights[i].constantAttenuation = AL3D.gl.getUniformLocation(shaderProgram,"pointLights[" + i + "].constantAttenuation");
	        shaderProgram._pointLights[i].color = AL3D.gl.getUniformLocation(shaderProgram,"pointLights[" + i + "].color");
	    }
	    shaderProgram._spotLights = [];          // locations of light properties
	    for (var i = 0; i < spotLights.length; i++) {
	        shaderProgram._spotLights[i] = {};   // locations of properties of light number i
	        shaderProgram._spotLights[i].position = AL3D.gl.getUniformLocation(shaderProgram,"spotLights[" + i + "].position");
	        shaderProgram._spotLights[i].intensity = AL3D.gl.getUniformLocation(shaderProgram,"spotLights[" + i + "].intensity");
	        shaderProgram._spotLights[i].linearAttenuation = AL3D.gl.getUniformLocation(shaderProgram,"spotLights[" + i + "].linearAttenuation");
	        shaderProgram._spotLights[i].quadraticAttenuation = AL3D.gl.getUniformLocation(shaderProgram,"spotLights[" + i + "].quadraticAttenuation");
	        shaderProgram._spotLights[i].constantAttenuation = AL3D.gl.getUniformLocation(shaderProgram,"spotLights[" + i + "].constantAttenuation");
	        shaderProgram._spotLights[i].spotCosCutOff = AL3D.gl.getUniformLocation(shaderProgram,"spotLights[" + i + "].spotCosCutOff");
	        shaderProgram._spotLights[i].spotExponent = AL3D.gl.getUniformLocation(shaderProgram,"spotLights[" + i + "].spotExponent");
	        shaderProgram._spotLights[i].coneDirection = AL3D.gl.getUniformLocation(shaderProgram,"spotLights[" + i + "].coneDirection");
	        shaderProgram._spotLights[i].color = AL3D.gl.getUniformLocation(shaderProgram,"spotLights[" + i + "].color");
	    }
	    if (mesh.material instanceof AL3D.LambertMaterial){
	    	shaderProgram._material = {};
	    	shaderProgram._material.diffuseColor = AL3D.gl.getUniformLocation(shaderProgram, "material.diffuseColor");
	    }else if (mesh.material instanceof AL3D.PhongMaterial || mesh.material instanceof AL3D.BlinnMaterial){
	    	shaderProgram._material = {};
	    	shaderProgram._material.diffuseColor = AL3D.gl.getUniformLocation(shaderProgram, "material.diffuseColor");
	    	shaderProgram._material.specularColor = AL3D.gl.getUniformLocation(shaderProgram, "material.specularColor");
	    	shaderProgram._material.shininess = AL3D.gl.getUniformLocation(shaderProgram, "material.shininess");
	    }else if (mesh.material instanceof AL3D.ToonMaterial){
	    	shaderProgram._uSamplerToon =  AL3D.Renderer.gl.getUniformLocation(shaderProgram, "uSamplerToon");
	    }

		this._cache[id] = shaderProgram;
		mesh.shaderProgram = shaderProgram;

	}
}


/* GLOBAL VARIABLES */

cache = new AL3D.TextureManager();
AL3D.shaderManager = new AL3D.ShaderManager();

AL3D.Mesh.prototype.setTexture = function(urlTexture, uv){
	this.material.texture = new AL3D.Texture({url:urlTexture});
	this.material.texture.loadTexture();
	this.texBuffer = this.gl.createBuffer();
	//this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texBuffer);
	//this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.uv),this.gl.STATIC_DRAW);
}

AL3D.Mesh.prototype.setMaterial = function(material){
	this.material = material || new AL3D.BasicMaterial();
	var urlTexture = this.material.texture;
	if (urlTexture !== undefined && this.uv !== undefined && !this.material.init && this.material.texture.texture === undefined){
    	this.setTexture(urlTexture, this.uv);
	}
	this.material.init = true;
}

AL3D.Mesh.prototype.setSpecularMap = function(urlTexture){
	this.material.texture = new AL3D.Texture({url:urlTexture});
	this.material.specularMap.loadTexture();
}

AL3D.Mesh.prototype.setNormalMap = function(urlTexture){
	this.material.texture = new AL3D.Texture({url:urlTexture});
	this.material.normalMap.loadTexture();
}

AL3D.Mesh.prototype.setShader = function(vs, fs){
	var getShader = function (source, type, typeString){
		var shader = AL3D.Renderer.gl.createShader(type);
		AL3D.Renderer.gl.shaderSource(shader, source);
		AL3D.Renderer.gl.compileShader(shader);
		if (!AL3D.Renderer.gl.getShaderParameter(shader,AL3D.Renderer.gl.COMPILE_STATUS)){
			alert ("Error en "+typeString+ " Shader : " + AL3D.Renderer.gl.getShaderInfoLog(shader));
      		return false;
		}
		return shader;
	}

	var vertexShader = getShader(vs, AL3D.Renderer.gl.VERTEX_SHADER, "VERTEX");
	var fragmentShader = getShader(fs, AL3D.Renderer.gl.FRAGMENT_SHADER, "FRAGMENT");
	this.shaderProgram = AL3D.Renderer.gl.createProgram();
	AL3D.Renderer.gl.attachShader(this.shaderProgram, vertexShader);
	AL3D.Renderer.gl.attachShader(this.shaderProgram, fragmentShader);

	AL3D.Renderer.gl.linkProgram(this.shaderProgram);

	this.shaderProgram._position = AL3D.Renderer.gl.getAttribLocation(this.shaderProgram, "vPosition");
	this.gl.enableVertexAttribArray(this.shaderProgram._position);
	this.shaderProgram._M = AL3D.Renderer.gl.getUniformLocation(this.shaderProgram, "vM");
	this.shaderProgram._V = AL3D.Renderer.gl.getUniformLocation(this.shaderProgram, "vV");
	this.shaderProgram._P = AL3D.Renderer.gl.getUniformLocation(this.shaderProgram, "vP");
	this.shaderProgram._MVP = AL3D.Renderer.gl.getUniformLocation(this.shaderProgram, "vMVP");
	this.shaderProgram._sampler =  AL3D.Renderer.gl.getUniformLocation(this.shaderProgram, "uSampler");
	this.shaderProgram._uSpecularMapSampler =  AL3D.Renderer.gl.getUniformLocation(shaderProgram, "uSpecularMapSampler");
	this.shaderProgram._uNormalMapSampler =  AL3D.Renderer.gl.getUniformLocation(shaderProgram, "uNormalMapSampler");
	this.shaderProgram._uv = AL3D.Renderer.gl.getAttribLocation(this.shaderProgram, "aTextureCoord");
	this.gl.enableVertexAttribArray(this.shaderProgram._uv);
}

AL3D.Mesh.prototype.setVertexBuffer = function(){
	this.vertexBuffer = this.gl.createBuffer();
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
	var a = new Float32Array(this.getVertex());
	this.gl.bufferData(this.gl.ARRAY_BUFFER, a, this.gl.STATIC_DRAW);
}

AL3D.Mesh.prototype.setNormalBuffer = function(property, data){
	if (property === undefined && data === undefined){
		this.normalBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
		var a = new Float32Array(this.getNormals());
		this.gl.bufferData(this.gl.ARRAY_BUFFER, a, this.gl.STATIC_DRAW);
	}else{
		this[property] = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this[property]);
		var a = new Float32Array(this.getNormals(data));
		this.gl.bufferData(this.gl.ARRAY_BUFFER, a, this.gl.STATIC_DRAW);
	}
}

AL3D.Mesh.prototype.setUVBuffer = function(property, data){
	if (property === undefined && data === undefined){
		this.uvBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.uvBuffer);
		var a = new Float32Array(this.uv);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, a, this.gl.STATIC_DRAW);
	}else{
		this[property] = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this[property]);
		var a = new Float32Array(data);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, a, this.gl.STATIC_DRAW);
	}
}

AL3D.Mesh.prototype.setIndexBuffer = function(){
	this.indexBuffer = this.gl.createBuffer();
	this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
	var a = this.getIndexes();
	this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.getIndexes()), this.gl.STATIC_DRAW);
}

AL3D.Renderer.prototype = {
	addEffect : function(effect){
		if (this.postprocessingEffects.length > 0){
			this.postprocessingEffects[0] = effect;
		}else{
			this.postprocessingEffects.push(effect);
		}
		if (this.postprocessingEffects.length > 0){
			// create an empty texture
			this.textureToRender = this.gl.createTexture();
			this.gl.bindTexture(this.gl.TEXTURE_2D, this.textureToRender);
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
			// Prevents s-coordinate wrapping (repeating).
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
			// Prevents t-coordinate wrapping (repeating).
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
			
			this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.width, this.height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);

			this.depthToRender = this.gl.createRenderbuffer();
			this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.depthToRender);
			this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, this.width, this.height);



			// Create a framebuffer and attach the texture.
			this.fb = this.gl.createFramebuffer();
			//this.gl.viewport(0.0, 0.0, this.width, this.height);
			this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fb);
			this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.textureToRender, 0);
			this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, this.depthToRender);
			this.gl.bindTexture(this.gl.TEXTURE_2D, null);
			this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);
			this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);


			this.renderToTexturePlaneVertex = [
			      // First triangle:
             1.0,  1.0,
            -1.0,  1.0,
            -1.0, -1.0,
            // Second triangle:
            -1.0, -1.0,
             1.0, -1.0,
             1.0,  1.0
			];   
			this.renderToTexturePlaneBuffer = this.gl.createBuffer();
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.renderToTexturePlaneBuffer);
			this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.renderToTexturePlaneVertex), this.gl.STATIC_DRAW);
			this.gl.enableVertexAttribArray(this.postprocessingEffects[0].shaderProgram._position);

			this.postprocessingEffects[0].width = this.width;
		    this.postprocessingEffects[0].height = this.height;

		    //this.postprocessingEffects[0].shaderProgram._uv = this.gl.getUniformLocation(this.postprocessingEffects[0].shaderProgram, "u_sampler")


		}
	},
	clearEffects : function(){
		this.postprocessingEffects = [];
	},
	getDomElement : function (){
		return this.canvas;
	},

	render : function(scene, camera){
		if (this.postprocessingEffects.length > 0){
			
			this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fb);

		}	
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
		if (this.needUpdate){
			var lights = [];

			for (var i = 0; i < scene.getChilds().length; i++){
				if (scene.getChild(i) instanceof AL3D.AmbientLight ||
					scene.getChild(i) instanceof AL3D.DirectionalLight ||
					scene.getChild(i) instanceof AL3D.PointLight ||
					scene.getChild(i) instanceof AL3D.SpotLight){
					lights.push(scene.getChild(i));
				}
			}
			scene.ambientLights = [];
			scene.pointLights = [];
			scene.spotLights = [];
			scene.directionalLights = [];
			for (var i = 0; i< lights.length; i++){
				if (lights[i] instanceof AL3D.AmbientLight){
					scene.ambientLights.push(lights[i]);
				}else if (lights[i] instanceof AL3D.DirectionalLight){
					scene.directionalLights.push(lights[i]);
				}else if (lights[i] instanceof AL3D.PointLight){
					scene.pointLights.push(lights[i]);
				}else if (lights[i] instanceof AL3D.SpotLight){
					scene.spotLights.push(lights[i]);
				}
			}
			for (var i = 0; i < scene.getChilds().length; i++){
				if (scene.getChild(i) instanceof AL3D.Mesh){
					AL3D.shaderManager.getShader(scene.getChild(i), lights);
				}
			}
			this.needUpdate = false;
		}
		for (var oi = 0; oi < scene.getChilds().length; oi++){
			var o = scene.getChild(oi);

			// We only render mesh objects
			if (!(o instanceof AL3D.Mesh)){
				continue;
			}
			

			this.gl.useProgram(o.shaderProgram);

			// NORMALS BUFFER
			
			if (o.hasNormals){
				this.gl.bindBuffer(this.gl.ARRAY_BUFFER, o.normalBuffer);
				this.gl.vertexAttribPointer(o.shaderProgram._vNormal, 3, this.gl.FLOAT, false, 4*3, 0);
			}

			// VERTEX BUFFER
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, o.vertexBuffer);
			this.gl.vertexAttribPointer(o.shaderProgram._position, 3, this.gl.FLOAT, false, 4*3, 0);
			
			o.prepareToRender();

			// TEXTURE BUFFER

			if (o.material.texture !== undefined){

				// ERROR
				// Error: WebGL: drawElements: no VBO bound to enabled vertex attrib index 1!
				// Esto se produce porque seguramente al principio aún no se ha cargado la textura
				this.gl.activeTexture(this.gl.TEXTURE0);
				this.gl.bindTexture(this.gl.TEXTURE_2D, o.material.texture.texture);
				this.gl.uniform1i(this.gl.getUniformLocation(o.shaderProgram, "uSampler"), 0);

				this.gl.bindBuffer(this.gl.ARRAY_BUFFER, o.uvBuffer);
				this.gl.vertexAttribPointer(o.shaderProgram._uv, 2, this.gl.FLOAT, false,4*2,0) ;
				this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

			}

			if (o.material.specularMap !== undefined){
				this.gl.activeTexture(this.gl.TEXTURE1);
				this.gl.bindTexture(this.gl.TEXTURE_2D, o.material.specularMap.texture);
				this.gl.uniform1i(this.gl.getUniformLocation(o.shaderProgram, "uSpecularMapSampler"), 1);
			}

			if (o.material.normalMap !== undefined){
				this.gl.activeTexture(this.gl.TEXTURE2);
				this.gl.bindTexture(this.gl.TEXTURE_2D, o.material.normalMap.texture);
				this.gl.uniform1i(this.gl.getUniformLocation(o.shaderProgram, "uNormalMapSampler"), 2);
			}

			//shaderProgram._uSpecularMapSampler =  AL3D.Renderer.gl.getUniformLocation(shaderProgram, "uSpecularMapSampler");
			
			//camera.update();
			var mv = new ALMath.Matrix4();
			mv = mv.multiply(o.transform);
			var aux = new ALMath.Matrix4();
			var mvp = camera.projectionMatrix.multiply(aux);
			mvp = mvp.multiply(o.transform);

			if (o.hasNormals){

				this.gl.uniformMatrix4fv(o.shaderProgram._viewModelMatrix, false,mv.components);
				var normalMatrix = mv.getNormalMatrix(o.scale.equals(new ALMath.Vector3(1,1,1)));
				
				this.gl.uniformMatrix3fv(o.shaderProgram._normalMatrix, false,normalMatrix.components);
			}

			this.gl.uniformMatrix4fv(o.shaderProgram._MVP, false,mvp.components);

			//Uniforms for lights
			// ambient lights
			for (var i = 0; i< scene.ambientLights.length; i++){
				var c = AL3D.Utils.hexIntToRgbNormalized(scene.ambientLights[i].color);
				AL3D.gl.uniform4fv(o.shaderProgram._ambientLights[i].color, new Float32Array([c.r, c.g, c.b, c.a]));
	            AL3D.gl.uniform1f(o.shaderProgram._ambientLights[i].intensity, scene.ambientLights[i].intensity );
			}
			// Directional Lights
			for (var i = 0; i< scene.directionalLights.length; i++){
				var c = AL3D.Utils.hexIntToRgbNormalized(scene.directionalLights[i].color);
				AL3D.gl.uniform4fv(o.shaderProgram._directionalLights[i].color, new Float32Array([c.r, c.g, c.b, c.a]));
				AL3D.gl.uniform1f(o.shaderProgram._directionalLights[i].intensity, scene.directionalLights[i].intensity);
				AL3D.gl.uniform3fv(o.shaderProgram._directionalLights[i].position, scene.directionalLights[i].position.getForGL());
	            
			}
			// Point Lights
			for (var i = 0; i< scene.pointLights.length; i++){
				var c = AL3D.Utils.hexIntToRgbNormalized(scene.pointLights[i].color);
				AL3D.gl.uniform4fv(o.shaderProgram._pointLights[i].color, new Float32Array([c.r, c.g, c.b, c.a]));
				AL3D.gl.uniform3fv(o.shaderProgram._pointLights[i].position, scene.pointLights[i].position.getForGL());
	            AL3D.gl.uniform1f(o.shaderProgram._pointLights[i].intensity, scene.pointLights[i].intensity);
	            AL3D.gl.uniform1f(o.shaderProgram._pointLights[i].linearAttenuation, scene.pointLights[i].linearAttenuation);
	            AL3D.gl.uniform1f(o.shaderProgram._pointLights[i].quadraticAttenuation, scene.pointLights[i].quadraticAttenuation);
	            AL3D.gl.uniform1f(o.shaderProgram._pointLights[i].constantAttenuation, scene.pointLights[i].constantAttenuation);
			}

			for (var i = 0; i< scene.spotLights.length; i++){
				var c = AL3D.Utils.hexIntToRgbNormalized(scene.spotLights[i].color);
				AL3D.gl.uniform4fv(o.shaderProgram._spotLights[i].color, new Float32Array([c.r, c.g, c.b, c.a]));
				AL3D.gl.uniform3fv(o.shaderProgram._spotLights[i].position, scene.spotLights[i].position.getForGL());
	            AL3D.gl.uniform1f(o.shaderProgram._spotLights[i].intensity, scene.spotLights[i].intensity);
	            AL3D.gl.uniform1f(o.shaderProgram._spotLights[i].linearAttenuation, scene.spotLights[i].linearAttenuation);
	            AL3D.gl.uniform1f(o.shaderProgram._spotLights[i].quadraticAttenuation, scene.spotLights[i].quadraticAttenuation);
	            AL3D.gl.uniform1f(o.shaderProgram._spotLights[i].constantAttenuation, scene.spotLights[i].constantAttenuation);
	            AL3D.gl.uniform3fv(o.shaderProgram._spotLights[i].coneDirection, scene.spotLights[i].direction.getForGL());
	            AL3D.gl.uniform1f(o.shaderProgram._spotLights[i].spotCosCutOff, scene.spotLights[i].spotCosCutOff);
	            AL3D.gl.uniform1f(o.shaderProgram._spotLights[i].spotExponent, scene.spotLights[i].spotExponent);
			}

			if (o.material instanceof AL3D.LambertMaterial){
				var color = AL3D.Utils.hexIntToRgbNormalized(o.material.diffuse);
				AL3D.gl.uniform4fv(o.shaderProgram._material.diffuseColor, new Float32Array([color.r, color.g, color.b, color.a]));
			}else if (o.material instanceof AL3D.PhongMaterial || o.material instanceof AL3D.BlinnMaterial){
				var color = AL3D.Utils.hexIntToRgbNormalized(o.material.diffuse);
				AL3D.gl.uniform4fv(o.shaderProgram._material.diffuseColor, new Float32Array([color.r, color.g, color.b, color.a]));
				color = AL3D.Utils.hexIntToRgbNormalized(o.material.specular);
				AL3D.gl.uniform4fv(o.shaderProgram._material.specularColor, new Float32Array([color.r, color.g, color.b, color.a]));
				AL3D.gl.uniform1f(o.shaderProgram._material.shininess, o.material.shininess);
			}else if (o.material instanceof AL3D.ToonMaterial){
				this.gl.activeTexture(this.gl.TEXTURE1);
				this.gl.bindTexture(this.gl.TEXTURE_2D, o.material.textureToon.texture);
				this.gl.uniform1i(o.shaderProgram._uSamplerToon, 1);
			}

			if (o.hasOwnProperty("render")){
				o.render();
			}else{

				if (o.getIndexes().length != 0){
					this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, o.indexBuffer);
					this.gl.drawElements(this.gl.TRIANGLES, o.getIndexes().length, this.gl.UNSIGNED_SHORT, 0);
				}else{
					var l = o.getVertex().length/3;
					this.gl.drawArrays(this.gl.TRIANGLES, 0, l); 
				}
			}
			//this.gl.flush();
		}

		if (this.postprocessingEffects.length > 0){
			this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

			this.gl.useProgram(this.postprocessingEffects[0].shaderProgram);
			
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.renderToTexturePlaneBuffer);
			this.gl.vertexAttribPointer(this.postprocessingEffects[0].shaderProgram._position, 2, this.gl.FLOAT, false, 0, 0);
			this.gl.activeTexture(this.gl.TEXTURE0);
			this.gl.bindTexture(this.gl.TEXTURE_2D, this.textureToRender);
		    
		    if (typeof this.postprocessingEffects[0].process === 'function'){
		    	this.postprocessingEffects[0].process();
			}

			this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
		}
	},

	setScene : function(scene){
		this.scene = scene;
	}
}

AL3D.Scene.prototype = {
	add : function(m){
		this.renderObjects.push(m);
	},

	getChilds : function(){
		return this.renderObjects;
	},

	getChild : function(i){
		return this.renderObjects[i];
	}
}


AL3D.Camera.prototype = {
	lookAt : function (eye, target, up){
		this.position = eye;
		this.target = target;
		this.up = up;
	},
	update : function (){
		this.viewMatrix = this.viewMatrix.lookAt(this.position,this.target,this.up);
	}
}

AL3D.PerspectiveCamera.prototype.constructor = AL3D.PerspectiveCamera;
AL3D.PerspectiveCamera.prototype = Object.create( AL3D.Camera.prototype );