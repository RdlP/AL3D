/**
 * Class that manager shaders.
 *
 * @class
 * @author Ángel Luis Perales Gómez.
 */
AL3D.ShaderManager = function (){
  this._cache = {};
}

AL3D.ShaderManager.prototype = {

  /**
   * Get the shader functions needed for normal mapping.
   *
   * @param {AL3D.Mesh} mesh - Mesh where shader acts.
   *
   * @returns {string} - shader function to compute tangent space for normal mapping.
   */
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

  /**
   * Get the point light function for a certain mesh.
   *
   * @param {AL3D.Mesh} mesh - Mesh where lights act.
   *
   * @returns {string} - shader function to compute points lights.
   */
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
      code.push("specular = vec4(0.0,0.0,0.0,0.0);");
      code.push("}");
      code.push("vec4 result = min((diffuse+specular)*att,vec4(1));");
      code.push("result.a = material.diffuseColor.a;");
      code.push("return result;");
    }
    code.push("}");
    return code.join("\n");
  },

  /**
   * Get the point light function for a certain mesh with toon material.
   *
   * @param {AL3D.Mesh} mesh - Mesh where lights act.
   *
   * @returns {string} - shader function to compute points lights over toon material.
   */
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

  /**
   * Get the directional light function for a certain mesh.
   *
   * @param {AL3D.Mesh} mesh - Mesh where lights act.
   *
   * @returns {string} - shader function to compute directional lights.
   */
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
      code.push("result.a = material.diffuseColor.a;");
      code.push("return result;");
    }
    code.push("}");
    return code.join("\n");
  },

  /**
   * Get the directional light function for a certain mesh with toon material.
   *
   * @param {AL3D.Mesh} mesh - Mesh where lights act.
   *
   * @returns {string} - shader function to compute directionals lights over toon material.
   */
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

  /**
   * Get the spot light function for a certain mesh.
   *
   * @param {AL3D.Mesh} mesh - Mesh where lights act.
   *
   * @returns {string} - shader function to compute spots lights.
   */
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
      code.push("result.a = material.diffuseColor.a;");
      code.push("return result;");
    }
    code.push("}");
    return code.join("\n");
  },

  /**
   * Get the spot light function for a certain mesh with toon material.
   *
   * @param {AL3D.Mesh} mesh - Mesh where lights act.
   *
   * @returns {string} - shader function to compute spots lights over toon material.
   */
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

  /**
   * Get the code to compute linear fog for a certain mesh.
   *
   * @param {AL3D.Mesh} mesh - Mesh where fog acts.
   *
   * @returns {string} - shader code to compute fog factor.
   */
  getLinearFogFactor : function(mesh){
    var code = [];
    code.push("float calculeLinearFogFactor(float start, float end, float dist){");
    code.push("float fogFactor = clamp((end - dist) / (end - start), 0.0, 1.0);");
    code.push("return fogFactor;");
    code.push("}");
    return code.join("\n");
  },

  /**
   * Function to compute the shader, compile an link it.
   *
   * @param {AL3D.Mesh} mesh - Mesh where shader acts.
   * @param {AL3D.Light[]} lights - Array of AL3D.Lights that acts over the mesh.
   */
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

    if (mesh.fog !== undefined){
      if (mesh.fog instanceof AL3D.LinearFog){
        if (mesh.material instanceof AL3D.BasicMaterial){
          vertexShader.push("uniform mat4 viewModelMatrix;");
        }
        vertexShader.push("varying float vDist;");
        fragmentShader.push("uniform vec3 uFogColor;");
        fragmentShader.push("uniform float uStartFog;");
        fragmentShader.push("uniform float uEndFog;");
        fragmentShader.push("varying float vDist;");
        fragmentShader.push(this.getLinearFogFactor(mesh));
      } else if (mesh.fog instanceof AL3D.ExpFog || mesh.fog instanceof AL3D.Exp2Fog){
        if (mesh.material instanceof AL3D.BasicMaterial){
          vertexShader.push("uniform mat4 viewModelMatrix;");
        }
        vertexShader.push("varying float vDist;");
        fragmentShader.push("uniform vec3 uFogColor;");
        fragmentShader.push("uniform float uFogDensity;");
        fragmentShader.push("varying float vDist;");
        //fragmentShader.push(this.getLinearFogFactor(mesh));
      }
    }

    fragmentShader.push("vec4 finalColor;");

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
        fragmentShader.push("fColor = vec4(0.0,0.0,0.0,0.0);");

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
          fragmentShader.push("bColor = vec4(0.,0.,0.,0.);");
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
            fragmentShader.push("finalColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t))*fColor;");
            
          }else{
            var color = AL3D.Utils.hexIntToRgbNormalized(mesh.material.diffuse);
            fragmentShader.push("finalColor = vec4("+color.r+","+color.g+","+color.b+","+color.a+")*fColor;");
          }
        }else{
          if (mesh.material.texture !== undefined){
            vertexShader.push("vTextureCoord = aTextureCoord;");
            fragmentShader.push("if (gl_FrontFacing){");
            fragmentShader.push("finalColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t))*fColor;");
            fragmentShader.push("}else{");
            fragmentShader.push("finalColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t))*bColor;");
            fragmentShader.push("}");
          }else{
            var color = AL3D.Utils.hexIntToRgbNormalized(mesh.material.diffuse);
            fragmentShader.push("if (gl_FrontFacing){");
            fragmentShader.push("finalColor = vec4("+color.r+","+color.g+","+color.b+","+color.a+")*fColor;");
            fragmentShader.push("}else{");
            fragmentShader.push("finalColor = vec4("+color.r+","+color.g+","+color.b+","+color.a+")*bColor;");
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
            fragmentShader.push("finalColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));");
          }else{
            var color = AL3D.Utils.hexIntToRgbNormalized(mesh.material.diffuse);
            fragmentShader.push("finalColor = vec4("+color.r+","+color.g+","+color.b+","+color.a+");");
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

            vertexShader.push("fColor = vec4(0.,0.,0.,0.);");
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
              vertexShader.push("bColor = vec4(0.,0.,0.,0.);");
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
                fragmentShader.push("finalColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t))*fColor;");
              }else{
                var color = AL3D.Utils.hexIntToRgbNormalized(mesh.material.diffuse);
                fragmentShader.push("finalColor = vec4("+color.r+","+color.g+","+color.b+","+color.a+")*fColor;");
              }
            }else{
              if (mesh.material.texture !== undefined){
                vertexShader.push("vTextureCoord = aTextureCoord;");
                fragmentShader.push("if (gl_FrontFacing){");
                fragmentShader.push("finalColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t))*fColor;");
                fragmentShader.push("}else{");
                fragmentShader.push("finalColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t))*bColor;");
                fragmentShader.push("}");
              }else{
                var color = AL3D.Utils.hexIntToRgbNormalized(mesh.material.diffuse);
                fragmentShader.push("if (gl_FrontFacing){");
                fragmentShader.push("finalColor = vec4("+color.r+","+color.g+","+color.b+","+color.a+")*fColor;");
                fragmentShader.push("}else{");
                fragmentShader.push("finalColor = vec4("+color.r+","+color.g+","+color.b+","+color.a+")*bColor;");
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
            fragmentShader.push("vec4 fColor=vec4(0.,0.,0.,0.0);");
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
                fragmentShader.push("finalColor =  texture2D(uSampler, vTextureCoord) *fColor;");
              }else{
                var color = AL3D.Utils.hexIntToRgbNormalized(mesh.material.diffuse);
                fragmentShader.push("finalColor = vec4("+color.r+","+color.g+","+color.b+","+color.a+")*fColor;");
              }
            }else{
              if (mesh.material.texture !== undefined){
                vertexShader.push("vTextureCoord = aTextureCoord;");
                fragmentShader.push("if (gl_FrontFacing){");
                fragmentShader.push("finalColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t))*fColor;");
                fragmentShader.push("}else{");
                fragmentShader.push("finalColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t))*bColor;");
                fragmentShader.push("}");
              }else{
                var color = AL3D.Utils.hexIntToRgbNormalized(mesh.material.diffuse);
                fragmentShader.push("if (gl_FrontFacing){");
                //fragmentShader.push("gl_FragColor = vec4("+1.0+","+0.0+","+0.0+","+1.0+");");
                fragmentShader.push("finalColor = vec4("+color.r+","+color.g+","+color.b+","+color.a+")*fColor;");
                fragmentShader.push("}else{");
                //fragmentShader.push("gl_FragColor = vec4("+0.0+","+1.0+","+0.0+","+1.0+");");
                fragmentShader.push("finalColor = vec4("+color.r+","+color.g+","+color.b+","+color.a+")*bColor;");
                fragmentShader.push("}");
                
              }
            }
            
          }// END PHONG INTERPOLATION
        }
      }
    }
    fragmentShader.push("gl_FragColor = finalColor;");
    if (mesh.fog !== undefined){
      if (mesh.fog instanceof AL3D.LinearFog || mesh.fog instanceof AL3D.ExpFog || mesh.fog instanceof AL3D.Exp2Fog){
        vertexShader.push("vDist = distance(viewModelMatrix*vec4(vPosition,1.0), vec4(E,1.0));");
        if (mesh.fog instanceof AL3D.LinearFog){
          fragmentShader.push("float fogFactor = calculeLinearFogFactor(uStartFog, uEndFog, vDist);");
        }else if (mesh.fog instanceof AL3D.ExpFog){
          fragmentShader.push("float fogFactor = exp2(-uFogDensity * vDist * 1.442695);");
        }else if (mesh.fog instanceof AL3D.Exp2Fog){
          fragmentShader.push("float fogFactor = exp2(-uFogDensity*uFogDensity*vDist * vDist * 1.442695);");
        }
        fragmentShader.push("vec3 co = mix(uFogColor, vec3(finalColor), fogFactor);");
        fragmentShader.push("gl_FragColor = vec4(co, finalColor.a);");
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
    shaderProgram._MVP = AL3D.Renderer.gl.getUniformLocation(shaderProgram, "vMVP");
    if (mesh.material.texture !== undefined){
      shaderProgram._sampler =  AL3D.Renderer.gl.getUniformLocation(shaderProgram, "uSampler");
      shaderProgram._uv = AL3D.Renderer.gl.getAttribLocation(shaderProgram, "aTextureCoord");
    }
    if (mesh.material.specularMap !== undefined){
      shaderProgram._uSpecularMapSampler =  AL3D.Renderer.gl.getUniformLocation(shaderProgram, "uSpecularMapSampler");
    }
    if (mesh.material.normalMap !== undefined){
      shaderProgram._uNormalMapSampler =  AL3D.Renderer.gl.getUniformLocation(shaderProgram, "uNormalMapSampler");
    }
    if (compileWithNormals){
      shaderProgram._vNormal =  AL3D.Renderer.gl.getAttribLocation(shaderProgram, "vNormal");
      
      shaderProgram._viewModelMatrix = AL3D.gl.getUniformLocation(shaderProgram,"viewModelMatrix");
      shaderProgram._normalMatrix = AL3D.gl.getUniformLocation(shaderProgram,"normalMatrix");
    }
    if (mesh.fog !== undefined){
      shaderProgram._uFogColor = AL3D.gl.getUniformLocation(shaderProgram,"uFogColor");
      if (mesh.fog instanceof AL3D.LinearFog){
        shaderProgram._uStartFog = AL3D.gl.getUniformLocation(shaderProgram,"uStartFog");
        shaderProgram._uEndFog = AL3D.gl.getUniformLocation(shaderProgram,"uEndFog");
      }else if (mesh.fog instanceof AL3D.ExpFog || mesh.fog instanceof AL3D.Exp2Fog){
        shaderProgram._uFogDensity = AL3D.gl.getUniformLocation(shaderProgram,"uFogDensity");
      }
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