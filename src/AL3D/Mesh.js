/**
 * Class that represents a Mesh.
 *
 * @class
 * @author Ángel Luis Perales Gómez.
 * @augments AL3D.Object3D
 *
 * @param {Object} p - Object that represent a Mesh.
 * @param {number[]} p.vertices - An array with the mesh's vertices.
 * @param {number[]} p.indices - An array with the mesh's indices.
 * @param {number[]} p.normals - An array with the mesh's normals.
 * @param {number[]} p.uv - An array with the mesh's uv coordinates.
 * @param {AL3D.Material} p.material - The mesh's material, if not present the material would be BasicMaterial.
 */
AL3D.Mesh = function(p){
  AL3D.Object3D.call(this);
  this.vertices = p===undefined?[]:p.vertices || [];
  this.indices = p===undefined?[]:p.indices || [];
  this.normals = p===undefined?[]:p.normals || [];
  this.uv = p===undefined?[]:p.uv || [];
  this.material = p===undefined?new AL3D.BasicMaterial():p.material || new AL3D.BasicMaterial();

  this.gl = AL3D.Renderer.gl;

    if (p!==undefined && p.uv !== undefined && p.material !== undefined){
    this.uv = p.uv;
    this.setUVBuffer();
    if (p.material.texture !== undefined){
      this.setTexture(this.material.texture, this.uv);
    }else if (p.material.video !== undefined){
      //loadVideoTexture(this.material.video);
    }
  }

  if (p!==undefined && p.vertices !== undefined){
    this.setVertexBuffer();
  }
  if (p!==undefined && p.indices !== undefined){
    this.setIndexBuffer();
  }

  if (p!==undefined && p.normals !== undefined){
    this.setNormalBuffer();
    this.hasNormals = true;
  }
}

AL3D.Mesh.prototype = AL3D.Object3D.prototype;

/**
 * Get the mesh's vertices.
 *
 * @returns {number[]} - The mesh's vertices.
*/
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

/**
 * Get the mesh's normals.
 *
 * @returns {number[]} - The mesh's normals.
*/
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

/**
 * Get the mesh's indices.
 *
 * @returns {number[]} - The mesh's indices.
*/
AL3D.Mesh.prototype.getIndexes = function(){
  return this.indices;
}

/**
 * Add a vertex.
 *
 * @param {Object} v - Vertex to add.
*/
AL3D.Mesh.prototype.addVertex = function(v){
  if (v instanceof ALMath.Vector2){
    v = ALMath.Vector3(v.x, v.y, 0);
  }
  this.vertices.push(v);
}

/**
 * Add a index.
 *
 * @param {number} i - Index to add.
*/
AL3D.Mesh.prototype.addIndex = function(i){
  this.indices.push(i);
}

/**
 * Create a Sphere mesh.
 *
 * @param {Object} p - Object that represent a sphere.
 * @param {number} p.radius - Sphere's radius.
 * @param {Al3D.Material} p.material - sphere's material. If material is not defined, the Basic Material will set.
 *
 * @returns {AL3D.Mesh} - A sphere's mesh.
*/
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

/**
 * Create a Cylinder mesh.
 *
 * @param {Object} p - Object that represent a cylinder.
 * @param {number} p.radius - Cylinder's radius.
 * @param {number} p.height - Cylinder's height.
 * @param {AL3D.Material} p.material - Cylinder's material. If material is not defined, the Basic Material will set.
 *
 * @returns {AL3D.Mesh} - A cylinder's mesh.
*/
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

/**
 * Create a Cone mesh.
 *
 * @param {Object} p - Object that represent a cone.
 * @param {number} p.radius - Cone's radius.
 * @param {number} p.height - Cone's height.
 * @param {AL3D.Material} p.material - Cone's material. If material is not defined, the Basic Material will set.
 *
 * @returns {AL3D.Mesh} - A cone's mesh. 
*/
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

/**
 * Create a Circle mesh.
 *
 * @param {Object} p - Object that represent a circle.
 * @param {number} p.radius - Circle's radius.
 * @param {number} p.resolution - Circle's height.
 * @param {AL3D.Material} p.material - Circle's material. If material is not defined, the Basic Material will set.
 *
 * @returns {AL3D.Mesh} - A circle's mesh.
*/
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
    this.gl.drawArrays( this.gl.TRIANGLE_FAN, 0, resolution+1);
  }
  return mesh;
}

/**
 * Create a Cube mesh.
 *
 * @param {Object} p - Object that represent a cube.
 * @param {number} p.size - Cube's side size.
 * @param {AL3D.Material} p.material - Cube's material. If material is not defined, the Basic Material will set.
 *
 * @returns {AL3D.Mesh} - A cube's mesh.
*/
AL3D.Mesh.createCube = function(p){
  var mesh = {};
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

  var realMesh = new AL3D.Mesh({vertices : mesh.vertices, indices : mesh.indices, normals : mesh.normals, uv : mesh.uv, material : mesh.material});
  return realMesh;
}

/**
 * Create a Plane mesh.
 *
 * @param {Object} p - Object that represent a plane.
 * @param {number} p.size - Plane's side size.
 * @param {AL3D.Material} p.material - Plane's material. If material is not defined, the Basic Material will set.
 *
 * @returns {AL3D.Mesh} - A plane's mesh.
*/
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

/**
 * Set a color map.
 *
 * @param {string} urlTexture - Color map's url to set.
 * @param {number[]} uv - Array with the uv coordinates.
*/
AL3D.Mesh.prototype.setTexture = function(urlTexture, uv){
  this.material.texture = new AL3D.Texture({url:urlTexture});
  this.material.texture.loadTexture();
  this.texBuffer = this.gl.createBuffer();
}

/**
 * Set a material
 *
 * @param {AL3D.Material} material - Material to set, If material is not defined, the Basic Material will set.
*/
AL3D.Mesh.prototype.setMaterial = function(material){
  this.material = material || new AL3D.BasicMaterial();
  var urlTexture = this.material.texture;
  if (urlTexture !== undefined && this.uv !== undefined && !this.material.init && this.material.texture.texture === undefined){
      this.setTexture(urlTexture, this.uv);
  }
  this.material.init = true;
}

/**
 * Set a specular map
 *
 * @param {string} urlTexture - Specular map's url to set.
*/
AL3D.Mesh.prototype.setSpecularMap = function(urlTexture){
  this.material.texture = new AL3D.Texture({url:urlTexture});
  this.material.specularMap.loadTexture();
}

/**
 * Set a normal map
 *
 * @param {string} urlTexture - Normal map's url to set.
*/
AL3D.Mesh.prototype.setNormalMap = function(urlTexture){
  this.material.texture = new AL3D.Texture({url:urlTexture});
  this.material.normalMap.loadTexture();
}

/**
 * Set a shader for the mesh
 *
 * @param {string} vs - Vertex shader to use.
 * @param {string} fs - Fragment shader to use.
*/
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

/**
 * Set the vertex buffer for the mesh
 */
AL3D.Mesh.prototype.setVertexBuffer = function(){
  this.vertexBuffer = this.gl.createBuffer();
  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
  var a = new Float32Array(this.getVertex());
  this.gl.bufferData(this.gl.ARRAY_BUFFER, a, this.gl.STATIC_DRAW);
}

/**
 * Set the normal buffer for the mesh
 */
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

/**
 * Set the uv buffer for the mesh
 */
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

/**
 * Set the index buffer for the mesh
 */
AL3D.Mesh.prototype.setIndexBuffer = function(){
  this.indexBuffer = this.gl.createBuffer();
  this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  var a = this.getIndexes();
  this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.getIndexes()), this.gl.STATIC_DRAW);
}