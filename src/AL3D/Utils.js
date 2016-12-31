AL3D.Utils = {

  /**
   * Create a circle.
   *
   * @param {number} n - the number of vertex
   * @param {number} startAngle - the angle where the circle will be started to compute vertices
   * @param {number} y - Y coordinate of the circle. X and Z coordinates will be computes dinamically.
   * @param {number} radius - circle's radius.
   *
   * @returns {ALMath.Vector3[]} array of ALMath.Vector3 to store the circle's vertices
   */
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

  /**
   * Compute the normal of triangle.
   *
   * @param {ALMath.Vector3} a - Triangle vertex.
   * @param {ALMath.Vector3} b - Triangle vertex.
   * @param {ALMath.Vector3} c - Triangle vertex.
   *
   * @returns {ALMath.Vector3} Normals of the triangle.
   */
  computeNormal : function (a,b,c){
      var t1 = a.sub(b);
      var t2 = c.sub(b);
      var normal = t1.cross(t2);
      return normal;
  },

  /**
   * Convert hex value to RGB values.
   *
   * @param {string} hex - Hexadecimal value.
   *
   * @returns {Object} return an object with the properties: a,r,g,b with values between 0 and 255.
   */
  hexToRgb : function(hex) {
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

  /**
   * Convert hex value to RGB values.
   *
   * @param {string} hex - Hexadecimal value.
   *
   * @returns {Object} return an object with the properties: a,r,g,b with values between 0.0 and 1.0.
   */
  hexToRgbNormalized : function(hex) {
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

  /**
   * Convert hex value to RGB values.
   *
   * @param {number} hex - Hexadecimal value.
   *
   * @returns {Object} return an object with the properties: a,r,g,b with values between 0 and 255.
   */
  hexIntToRgb : function(hex) {
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

  /**
   * Convert hex value to RGB values.
   *
   * @param {number} hex - Hexadecimal value.
   *
   * @returns {Object} return an object with the properties: a,r,g,b with values between 0.0 and 1.0.
   */
  hexIntToRgbNormalized : function(hex) {
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

  /**
   * Function to compile an link shaders.
   *
   * @param {string} vertexShader - Vertex shader.
   * @param {string} fragmentShader - Fragment shader.
   *
   * @returns {Object} the ShaderProgram.
   */
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
  },

  /**
   * Function to load a mesh from a json file.
   *
   * @param {Object} p - Object that represent the mesh.
   * @param {function} callback - Function to call when model is loaded.
   */
  loadModel : function(p, callback){
    this.jsonFile = p.model !== undefined ? p.model : undefined;
    var mesh = this;
    if (this.jsonFile !== undefined){
      var xobj = new XMLHttpRequest();
      xobj.overrideMimeType("application/json");
      xobj.open('GET', mesh.jsonFile, true);
      xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
          var json = JSON.parse(xobj.responseText);
          var vertices = json.vertices;
          var normals = json.normals;
          var indices = json.faces;
          var uvs = json.uvs;
          var mesh = new AL3D.Mesh({vertices : vertices, indices : indices, normals : normals, uv : uvs});
          callback(mesh);
        }
      };
      xobj.send(null);
    }
  }
}

/* GLOBAL VARIABLES */

cache = new AL3D.TextureManager();
AL3D.shaderManager = new AL3D.ShaderManager();