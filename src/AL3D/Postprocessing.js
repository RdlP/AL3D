/**
 * Abstract class that represents a postprocessing effect based on convolution operation and uses a kernel.
 * Subclass must implement a process function where pass the kernel and other variables to the shader.
 *
 * @class
 * @author Ángel Luis Perales Gómez
 */

AL3D.EffectBasedOnKernel = function(){
    this.vertexShader = `precision lowp float;
              attribute vec2 aPosition;
              varying vec2 vTexCoord;
              void main() {
                vTexCoord = aPosition.xy * 0.5 + 0.5;
                gl_Position = vec4(aPosition,0.0,1.0);}`;

    this.fragmentShader = `precision mediump float;
              varying vec2 vTexCoord;
              uniform sampler2D uSampler;
              uniform vec2 uTextureSize;
              uniform float uKernel[9];
                void main() {
                vec2 distanceBetweenPixeles = vec2(1.0, 1.0) / uTextureSize;
                vec4 colorSum =
                texture2D(uSampler, vTexCoord + distanceBetweenPixeles * vec2(-1, -1)) * uKernel[0] +
                texture2D(uSampler, vTexCoord + distanceBetweenPixeles * vec2( 0, -1)) * uKernel[1] +
                texture2D(uSampler, vTexCoord + distanceBetweenPixeles * vec2( 1, -1)) * uKernel[2] +
                texture2D(uSampler, vTexCoord + distanceBetweenPixeles * vec2(-1,  0)) * uKernel[3] +
                texture2D(uSampler, vTexCoord + distanceBetweenPixeles * vec2( 0,  0)) * uKernel[4] +
                texture2D(uSampler, vTexCoord + distanceBetweenPixeles * vec2( 1,  0)) * uKernel[5] +
                texture2D(uSampler, vTexCoord + distanceBetweenPixeles * vec2(-1,  1)) * uKernel[6] +
                texture2D(uSampler, vTexCoord + distanceBetweenPixeles * vec2( 0,  1)) * uKernel[7] +
                texture2D(uSampler, vTexCoord + distanceBetweenPixeles * vec2( 1,  1)) * uKernel[8] ;
                gl_FragColor = vec4((colorSum).rgb, 1.0);
                }`;

    this.shaderProgram = AL3D.Utils.compileAndLinkShader(this.vertexShader, this.fragmentShader);

  this.shaderProgram._position = AL3D.Renderer.gl.getAttribLocation(this.shaderProgram, "aPosition");
  AL3D.gl.enableVertexAttribArray(this.shaderProgram._position);
  this.shaderProgram._sampler =  AL3D.Renderer.gl.getUniformLocation(this.shaderProgram, "uSampler");
  this.shaderProgram._kernel =  AL3D.Renderer.gl.getUniformLocation(this.shaderProgram, "uKernel[0]");
  this.shaderProgram._texutreSize =  AL3D.Renderer.gl.getUniformLocation(this.shaderProgram, "uTextureSize");

}

/**
 * Class that adds Sepia postprocessing effect to the render.
 *
 * @class
 * @author Ángel Luis Perales Gómez.
 */

AL3D.SepiaEffect = function(){
    this.vertexShader = `precision lowp float;
              attribute vec2 aPosition;
              varying vec2 vTexCoord;
              void main() {
                vTexCoord = aPosition.xy * 0.5 + 0.5;
                gl_Position = vec4(aPosition,0.0,1.0);}`;

    this.fragmentShader = `precision mediump float;
              varying vec2 vTexCoord;
              uniform sampler2D uSampler;
                void main() {
                float grey = dot(texture2D(uSampler, vTexCoord).rgb, vec3(0.299, 0.587, 0.114));
                gl_FragColor = vec4(grey * vec3(1.2, 1.0, 0.8), 1.0);
                }`;

    this.shaderProgram = AL3D.Utils.compileAndLinkShader(this.vertexShader, this.fragmentShader);

  this.shaderProgram._position = AL3D.Renderer.gl.getAttribLocation(this.shaderProgram, "aPosition");
  AL3D.gl.enableVertexAttribArray(this.shaderProgram._position);
  this.shaderProgram._sampler =  AL3D.Renderer.gl.getUniformLocation(this.shaderProgram, "uSampler");

}

/**
 * Class that adds Grey Scale postprocessing effect to the render.
 *
 * @class
 * @author Ángel Luis Perales Gómez.
 */

AL3D.GreyScaleEffect = function(){
    this.vertexShader = `precision lowp float;
              attribute vec2 aPosition;
              varying vec2 vTexCoord;
              void main() {
                vTexCoord = aPosition.xy * 0.5 + 0.5;
                gl_Position = vec4(aPosition,0.0,1.0);}`;

    this.fragmentShader = `precision mediump float;
              varying vec2 vTexCoord;
              uniform sampler2D uSampler;
                void main() {
                float grey = dot(texture2D(uSampler, vTexCoord).rgb, vec3(0.299, 0.587, 0.114));
                gl_FragColor = vec4(grey,grey,grey, 1.0);
                }`;

    this.shaderProgram = AL3D.Utils.compileAndLinkShader(this.vertexShader, this.fragmentShader);

  this.shaderProgram._position = AL3D.Renderer.gl.getAttribLocation(this.shaderProgram, "aPosition");
  AL3D.gl.enableVertexAttribArray(this.shaderProgram._position);
  this.shaderProgram._sampler =  AL3D.Renderer.gl.getUniformLocation(this.shaderProgram, "uSampler");

}

/**
 * Class that adds Negative postprocessing effect (invert the colors) to the render.
 *
 * @class
 * @author Ángel Luis Perales Gómez.
 */

AL3D.NegativeEffect = function(){
    this.vertexShader = `precision lowp float;
              attribute vec2 aPosition;
              varying vec2 vTexCoord;
              void main() {
                vTexCoord = aPosition.xy * 0.5 + 0.5;
                gl_Position = vec4(aPosition,0.0,1.0);}`;

    this.fragmentShader = `precision mediump float;
              varying vec2 vTexCoord;
              uniform sampler2D uSampler;
                void main() {
                vec4 color = texture2D(uSampler, vTexCoord);
                gl_FragColor = vec4(1.0-color.rgb, 1.0);
                }`;

    this.shaderProgram = AL3D.Utils.compileAndLinkShader(this.vertexShader, this.fragmentShader);

  this.shaderProgram._position = AL3D.Renderer.gl.getAttribLocation(this.shaderProgram, "aPosition");
  AL3D.gl.enableVertexAttribArray(this.shaderProgram._position);
  this.shaderProgram._sampler =  AL3D.Renderer.gl.getUniformLocation(this.shaderProgram, "uSampler");

}

/**
 * Class that adds Radial Blur postprocessing effect to the render.
 *
 * @class
 * @author Ángel Luis Perales Gómez.
 */

AL3D.RadialBlurEffect = function(){
    this.vertexShader = `precision lowp float;
              attribute vec2 aPosition;
              varying vec2 vTexCoord;
              void main() {
                vTexCoord = aPosition.xy * 0.5 + 0.5;
                gl_Position = vec4(aPosition,0.0,1.0);}`;

    this.fragmentShader = `precision mediump float;
              varying vec2 vTexCoord;
              uniform sampler2D uSampler;
              const float sampleDist = 1.0;
              const float sampleStrength = 2.2;
                void main() {
                float samples[10];
                samples[0] = -0.08;
                samples[1] = -0.05;
                samples[2] = -0.03;
                samples[3] = -0.02;
                samples[4] = -0.01;
                samples[5] = 0.01;
                samples[6] = 0.02;
                samples[7] = 0.03;
                samples[8] = 0.04;
                samples[9] = 0.08;
                vec2 dir = 0.5 - vTexCoord; 
                float dist = sqrt(dir.x*dir.x + dir.y*dir.y); 
                dir = dir/dist; 
                vec4 color = texture2D(uSampler,vTexCoord); 
                vec4 sum = color;
                for (int i = 0; i < 10; i++)
                sum += texture2D( uSampler, vTexCoord + dir * samples[i] * sampleDist );
                sum *= 1.0/11.0;
                float t = dist * sampleStrength;
                t = clamp( t ,0.0,1.0);
                gl_FragColor = mix( color, sum, t );
                }`;

    this.shaderProgram = AL3D.Utils.compileAndLinkShader(this.vertexShader, this.fragmentShader);

  this.shaderProgram._position = AL3D.Renderer.gl.getAttribLocation(this.shaderProgram, "aPosition");
  AL3D.gl.enableVertexAttribArray(this.shaderProgram._position);
  this.shaderProgram._sampler =  AL3D.Renderer.gl.getUniformLocation(this.shaderProgram, "uSampler");;

}

/**
 * Class that adds Eye Fish postprocessing effect to the render.
 *
 * @class
 * @author Ángel Luis Perales Gómez.
 */

AL3D.EyeFishEffect = function(){
    this.vertexShader = `precision lowp float;
              attribute vec2 aPosition;
              varying vec2 vTexCoord;
              void main() {
                vTexCoord = aPosition.xy * 0.5 + 0.5;
                gl_Position = vec4(aPosition,0.0,1.0);}`;

    this.fragmentShader = `precision mediump float;
              varying vec2 vTexCoord;
              uniform sampler2D uSampler;
              const float PI = 3.1415926535;
                void main() {
                float aperture = 178.0;
                float apertureHalf = 0.5 * aperture * (PI / 180.0);
                float maxFactor = sin(apertureHalf);
                vec2 uv;
                vec2 xy = 2.0 * vTexCoord.xy - 1.0;
                float d = length(xy);
                if (d < (2.0-maxFactor)){
                d = length(xy * maxFactor);
                float z = sqrt(1.0 - d * d);
                float r = atan(d, z) / PI;
                float phi = atan(xy.y, xy.x);
                uv.x = r * cos(phi) + 0.5;
                uv.y = r * sin(phi) + 0.5;
                }else{
                uv = vTexCoord.xy;}
                vec4 c = texture2D(uSampler, uv);
                gl_FragColor = c;
                }`;

    this.shaderProgram = AL3D.Utils.compileAndLinkShader(this.vertexShader, this.fragmentShader);

  this.shaderProgram._position = AL3D.Renderer.gl.getAttribLocation(this.shaderProgram, "aPosition");
  AL3D.gl.enableVertexAttribArray(this.shaderProgram._position);
  this.shaderProgram._sampler =  AL3D.Renderer.gl.getUniformLocation(this.shaderProgram, "uSampler");
}

/**
 * Class that adds Dream Vision postprocessing effect to the render.
 *
 * @class
 * @author Ángel Luis Perales Gómez.
 */

AL3D.DreamVisionEffect = function(){
    this.vertexShader = `precision lowp float;
              attribute vec2 aPosition;
              varying vec2 vTexCoord;
              void main() {
                vTexCoord = aPosition.xy * 0.5 + 0.5;
                gl_Position = vec4(aPosition,0.0,1.0);}`;

    this.fragmentShader = `precision mediump float;
              varying vec2 vTexCoord;
              uniform sampler2D uSampler;
            void main ()
            {
              vec4 c = texture2D(uSampler, vTexCoord);
              c += texture2D(uSampler, vTexCoord+0.001);
              c += texture2D(uSampler, vTexCoord+0.003);
              c += texture2D(uSampler, vTexCoord+0.005);
              c += texture2D(uSampler, vTexCoord+0.007);
              c += texture2D(uSampler, vTexCoord+0.009);
              c += texture2D(uSampler, vTexCoord+0.011);

              c += texture2D(uSampler, vTexCoord-0.001);
              c += texture2D(uSampler, vTexCoord-0.003);
              c += texture2D(uSampler, vTexCoord-0.005);
              c += texture2D(uSampler, vTexCoord-0.007);
              c += texture2D(uSampler, vTexCoord-0.009);
              c += texture2D(uSampler, vTexCoord-0.011);

              c.rgb = vec3((c.r+c.g+c.b)/3.0);
              c = c / 9.5;
              gl_FragColor = c;   
                }`;

    this.shaderProgram = AL3D.Utils.compileAndLinkShader(this.vertexShader, this.fragmentShader);

  this.shaderProgram._position = AL3D.Renderer.gl.getAttribLocation(this.shaderProgram, "aPosition");
  AL3D.gl.enableVertexAttribArray(this.shaderProgram._position);
  this.shaderProgram._sampler =  AL3D.Renderer.gl.getUniformLocation(this.shaderProgram, "uSampler");
}

/**
 * Class that adds Pixelation postprocessing effect to the render.
 *
 * @class
 * @author Ángel Luis Perales Gómez.
 */

AL3D.PixelationEffect = function(){
    this.vertexShader = `precision lowp float;
              attribute vec2 aPosition;
              varying vec2 vTexCoord;
              void main() {
                vTexCoord = aPosition.xy * 0.5 + 0.5;
                gl_Position = vec4(aPosition,0.0,1.0);}`;

    this.fragmentShader = `precision mediump float;
              varying vec2 vTexCoord;
              uniform sampler2D uSampler;
              void main()
            {
             float dx = 2.5*(1./512.);
             float dy = 2.5*(1./512.);
             vec2 coord = vec2(dx*floor(vTexCoord.x/dx),
                               dy*floor(vTexCoord.y/dy));
             gl_FragColor = texture2D(uSampler, coord);
            }`;


    this.shaderProgram = AL3D.Utils.compileAndLinkShader(this.vertexShader, this.fragmentShader);

  this.shaderProgram._position = AL3D.Renderer.gl.getAttribLocation(this.shaderProgram, "aPosition");
  AL3D.gl.enableVertexAttribArray(this.shaderProgram._position);
  this.shaderProgram._sampler =  AL3D.Renderer.gl.getUniformLocation(this.shaderProgram, "uSampler");
}

/**
 * Class that adds Lens postprocessing effect to the render.
 *
 * @class
 * @author Ángel Luis Perales Gómez.
 */

AL3D.LenEffect = function(){
    this.vertexShader = `precision lowp float;
              attribute vec2 aPosition;
              varying vec2 vTexCoord;
              void main() {
                vTexCoord = aPosition.xy * 0.5 + 0.5;
                gl_Position = vec4(aPosition,0.0,1.0);}`;

    this.fragmentShader = `precision mediump float;
              varying vec2 vTexCoord;
              uniform sampler2D uSampler;
              const vec2 lenRadius = vec2(0.30,0.20);
            void main() 
            { 
              vec4 Color = texture2D(uSampler, vTexCoord.xy);
              float dist = distance(vTexCoord.xy, vec2(0.5,0.5));
              Color.rgb *= smoothstep(lenRadius.x, lenRadius.y, dist);
              gl_FragColor = Color;
            }`;


    this.shaderProgram = AL3D.Utils.compileAndLinkShader(this.vertexShader, this.fragmentShader);

  this.shaderProgram._position = AL3D.Renderer.gl.getAttribLocation(this.shaderProgram, "aPosition");
  AL3D.gl.enableVertexAttribArray(this.shaderProgram._position);
  this.shaderProgram._sampler =  AL3D.Renderer.gl.getUniformLocation(this.shaderProgram, "uSampler");
}

/**
 * Class that adds Posterization postprocessing effect to the render.
 *
 * @class
 * @author Ángel Luis Perales Gómez.
 */

AL3D.PosterizationEffect = function(){
    this.vertexShader = `precision lowp float;
              attribute vec2 aPosition;
              varying vec2 vTexCoord;
              void main() {
                vTexCoord = aPosition.xy * 0.5 + 0.5;
                gl_Position = vec4(aPosition,0.0,1.0);}`;

    this.fragmentShader = `precision mediump float;
              varying vec2 vTexCoord;
              uniform sampler2D uSampler;
              const float gamma = 0.6;
            const float numColors = 8.0;
            void main() 
            { 
              vec3 c = texture2D(uSampler, vTexCoord.xy).rgb;
              c = pow(c, vec3(gamma, gamma, gamma));
              c = c * numColors;
              c = floor(c);
              c = c / numColors;
              c = pow(c, vec3(1.0/gamma));
              gl_FragColor = vec4(c, 1.0);
            }`;


    this.shaderProgram = AL3D.Utils.compileAndLinkShader(this.vertexShader, this.fragmentShader);

  this.shaderProgram._position = AL3D.Renderer.gl.getAttribLocation(this.shaderProgram, "aPosition");
  AL3D.gl.enableVertexAttribArray(this.shaderProgram._position);
  this.shaderProgram._sampler =  AL3D.Renderer.gl.getUniformLocation(this.shaderProgram, "uSampler");
}

/**
 * Class that adds Night postprocessing effect to the render.
 *
 * @class
 * @author Ángel Luis Perales Gómez.
 */

AL3D.NightEffect = function(){
    this.vertexShader = `precision lowp float;
              attribute vec2 aPosition;
              varying vec2 vTexCoord;
              void main() {
                vTexCoord = aPosition.xy * 0.5 + 0.5;
                gl_Position = vec4(aPosition,0.0,1.0);}`;

    this.fragmentShader = `precision mediump float;
              varying vec2 vTexCoord;
              uniform sampler2D uSampler;
              void main()
              {
                vec4 c0 = texture2D(uSampler, vTexCoord.xy);
                float green = c0.g;

                if (c0.g < 0.50)
                  green = c0.r + c0.b;

                gl_FragColor = vec4(0.0, green, 0.0, 1.0);
              }`;


    this.shaderProgram = AL3D.Utils.compileAndLinkShader(this.vertexShader, this.fragmentShader);

  this.shaderProgram._position = AL3D.Renderer.gl.getAttribLocation(this.shaderProgram, "aPosition");
  AL3D.gl.enableVertexAttribArray(this.shaderProgram._position);
  this.shaderProgram._sampler =  AL3D.Renderer.gl.getUniformLocation(this.shaderProgram, "uSampler");
}

/**
 * Class that adds Acid Metal postprocessing effect to the render.
 *
 * @class
 * @author Ángel Luis Perales Gómez.
 */

AL3D.AcidMetalEffect = function(){
    this.vertexShader = `precision lowp float;
              attribute vec2 aPosition;
              varying vec2 vTexCoord;
              void main() {
                vTexCoord = aPosition.xy * 0.5 + 0.5;
                gl_Position = vec4(aPosition,0.0,1.0);}`;

    this.fragmentShader = `precision mediump float;
              varying vec2 vTexCoord;
              uniform sampler2D uSampler;
              void main()
              {
                vec4 c0 = texture2D(uSampler, vTexCoord.xy);
                float red = 0.0;
                float blue  = 0.0;

                if (c0.r > 0.15 && c0.b > 0.15)
                {
                  blue = 0.5;
                  red = 0.5;
                }

                float green = max(c0.r + c0.b, c0.g);

                gl_FragColor = vec4(red, green, blue, 1.0);
              }`;


    this.shaderProgram = AL3D.Utils.compileAndLinkShader(this.vertexShader, this.fragmentShader);

  this.shaderProgram._position = AL3D.Renderer.gl.getAttribLocation(this.shaderProgram, "aPosition");
  AL3D.gl.enableVertexAttribArray(this.shaderProgram._position);
  this.shaderProgram._sampler =  AL3D.Renderer.gl.getUniformLocation(this.shaderProgram, "uSampler");
}

/**
 * Class that adds Christmas postprocessing effect to the render.
 *
 * @class
 * @author Ángel Luis Perales Gómez.
 */

AL3D.ChristmasEffect = function(){
    this.vertexShader = `precision lowp float;
              attribute vec2 aPosition;
              varying vec2 vTexCoord;
              void main() {
                vTexCoord = aPosition.xy * 0.5 + 0.5;
                gl_Position = vec4(aPosition,0.0,1.0);}`;

    this.fragmentShader = `precision mediump float;
              varying vec2 vTexCoord;
              uniform sampler2D uSampler;
              void main()
              {
                vec4 c0 = texture2D(uSampler, vTexCoord.xy);
                float red = 0.0;
                float green = 0.0;

                if (c0.r < 0.35 || c0.b > 0.35)
                  green = c0.g + (c0.b / 2.0);
                else
                  red = c0.r + 0.4;

                gl_FragColor = vec4(red, green, 0.0, 1.0);
              }`;


    this.shaderProgram = AL3D.Utils.compileAndLinkShader(this.vertexShader, this.fragmentShader);

  this.shaderProgram._position = AL3D.Renderer.gl.getAttribLocation(this.shaderProgram, "aPosition");
  AL3D.gl.enableVertexAttribArray(this.shaderProgram._position);
  this.shaderProgram._sampler =  AL3D.Renderer.gl.getUniformLocation(this.shaderProgram, "uSampler");
}

/**
 * Class that adds Cool postprocessing effect to the render.
 *
 * @class
 * @author Ángel Luis Perales Gómez.
 */

AL3D.CoolEffect = function(){
    this.vertexShader = `precision lowp float;
              attribute vec2 aPosition;
              varying vec2 vTexCoord;
              void main() {
                vTexCoord = aPosition.xy * 0.5 + 0.5;
                gl_Position = vec4(aPosition,0.0,1.0);}`;

    this.fragmentShader = `precision mediump float;
              varying vec2 vTexCoord;
              uniform sampler2D uSampler;
              void main()
              {
                vec4 c0 = texture2D(uSampler, vTexCoord.xy);
                float red = 0.0;
                float green = 0.0;
                float blue  = 0.0;

                if (c0.r < 0.50 || c0.b > 0.5)
                {
                  blue = c0.r;
                  red = c0.g;
                }
                else
                {
                  blue = c0.r;
                  green = c0.r;
                }

                gl_FragColor = vec4(red, green, blue, 1.0);
              }`;


    this.shaderProgram = AL3D.Utils.compileAndLinkShader(this.vertexShader, this.fragmentShader);

  this.shaderProgram._position = AL3D.Renderer.gl.getAttribLocation(this.shaderProgram, "aPosition");
  AL3D.gl.enableVertexAttribArray(this.shaderProgram._position);
  this.shaderProgram._sampler =  AL3D.Renderer.gl.getUniformLocation(this.shaderProgram, "uSampler");
}

/**
 * Class that adds Fire postprocessing effect to the render.
 *
 * @class
 * @author Ángel Luis Perales Gómez.
 */

AL3D.FireEffect = function(){
    this.vertexShader = `precision lowp float;
              attribute vec2 aPosition;
              varying vec2 vTexCoord;
              void main() {
                vTexCoord = aPosition.xy * 0.5 + 0.5;
                gl_Position = vec4(aPosition,0.0,1.0);}`;

    this.fragmentShader = `precision mediump float;
              varying vec2 vTexCoord;
              uniform sampler2D uSampler;
              void main()
              {
                vec4 c0 = texture2D(uSampler, vTexCoord.xy);
                float red = 0.0;
                float green = 0.0;
                float blue  = 0.0;

                red = c0.r;

                if (c0.r > 0.0 && c0.g > c0.r)
                  green = (c0.g - (c0.g - c0.r)) / 3.0;

                if (c0.b > 0.0 && c0.r < 0.25)
                {
                  red = c0.b;
                  green = c0.b / 3.0;
                }

                if (c0.g > 0.0 && c0.r < 0.25)
                {
                  red = c0.g;
                  green = c0.g / 3.0;
                }

                if (((c0.r + c0.g + c0.b) / 3.0) > 0.9)
                  green = c0.r / 3.0;

                gl_FragColor = vec4(red, green, blue, 1.0);
              }`;


    this.shaderProgram = AL3D.Utils.compileAndLinkShader(this.vertexShader, this.fragmentShader);

  this.shaderProgram._position = AL3D.Renderer.gl.getAttribLocation(this.shaderProgram, "aPosition");
  AL3D.gl.enableVertexAttribArray(this.shaderProgram._position);
  this.shaderProgram._sampler =  AL3D.Renderer.gl.getUniformLocation(this.shaderProgram, "uSampler");
}

/**
 * Class that adds Fire postprocessing effect to the render.
 *
 * @class
 * @author Ángel Luis Perales Gómez.
 */

AL3D.Fire2Effect = function(){
    this.vertexShader = `precision lowp float;
              attribute vec2 aPosition;
              varying vec2 vTexCoord;
              void main() {
                vTexCoord = aPosition.xy * 0.5 + 0.5;
                gl_Position = vec4(aPosition,0.0,1.0);}`;

    this.fragmentShader = `precision mediump float;
              varying vec2 vTexCoord;
              uniform sampler2D uSampler;
              void main()
              {
                vec4 c0 = texture2D(uSampler, vTexCoord.xy);
                float red = 0.0;
                float green = 0.0;
                float blue  = 0.0;
                float avg = (c0.r + c0.g + c0.b) / 3.0;

                red = c0.r + (c0.g / 2.0) + (c0.b / 3.0);
                green = c0.r / 3.0;

                gl_FragColor = vec4(red, green, blue, 1.0);
              }`;


    this.shaderProgram = AL3D.Utils.compileAndLinkShader(this.vertexShader, this.fragmentShader);

  this.shaderProgram._position = AL3D.Renderer.gl.getAttribLocation(this.shaderProgram, "aPosition");
  AL3D.gl.enableVertexAttribArray(this.shaderProgram._position);
  this.shaderProgram._sampler =  AL3D.Renderer.gl.getUniformLocation(this.shaderProgram, "uSampler");
}

/**
 * Class that adds Sunset postprocessing effect to the render.
 *
 * @class
 * @author Ángel Luis Perales Gómez.
 */

AL3D.SunsetEffect = function(){
    this.vertexShader = `precision lowp float;
              attribute vec2 aPosition;
              varying vec2 vTexCoord;
              void main() {
                vTexCoord = aPosition.xy * 0.5 + 0.5;
                gl_Position = vec4(aPosition,0.0,1.0);}`;

    this.fragmentShader = `precision mediump float;
              varying vec2 vTexCoord;
              uniform sampler2D uSampler;
              void main()
              {
                vec4 c0 = texture2D(uSampler, vTexCoord.xy);
                gl_FragColor = vec4(c0.r * 1.5, c0.g, c0.b * 0.5, c0.a);
              }`;


    this.shaderProgram = AL3D.Utils.compileAndLinkShader(this.vertexShader, this.fragmentShader);

  this.shaderProgram._position = AL3D.Renderer.gl.getAttribLocation(this.shaderProgram, "aPosition");
  AL3D.gl.enableVertexAttribArray(this.shaderProgram._position);
  this.shaderProgram._sampler =  AL3D.Renderer.gl.getUniformLocation(this.shaderProgram, "uSampler");
}

/**
 * Class that adds Edge Detection postprocessing effect to the render.
 *
 * @class
 * @author Ángel Luis Perales Gómez.
 */

AL3D.EdgeDetectionEffect = function(){
  AL3D.EffectBasedOnKernel.call(this);
}

/**
 * Class that adds Sharpen postprocessing effect to the render.
 *
 * @class
 * @author Ángel Luis Perales Gómez.
 */

AL3D.SharpenEffect = function(){
  AL3D.EffectBasedOnKernel.call(this);
}

/**
 * Class that adds Gaussian Blur postprocessing effect to the render.
 *
 * @class
 * @author Ángel Luis Perales Gómez.
 */

AL3D.GaussianBlurEffect = function(){
  AL3D.EffectBasedOnKernel.call(this);
}

AL3D.EdgeDetectionEffect.prototype = {
  /**
   * Function uses to pass kernel an other variables to shader.
   */
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
  /**
   * Function uses to pass kernel an other variables to shader.
   */
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
  /**
   * Function uses to pass kernel an other variables to shader.
   */
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