const canvas = document.getElementById('myCanvas');
const gl = canvas.getContext('webgl2');

const vertexShaderSource = `#version 300 es

in vec2 a_position;

void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const fragmentShaderSource = `#version 300 es

precision highp float;

uniform vec2 iResolution; // Declare as vec2 (canvas width and height)
uniform vec2 iMouse;
uniform float iTime;

out vec4 fragColor;

// Shadertoy code here

#define PI 3.14159265359
#define RES iResolution
#define PT iMouse
#define smin smoothmin
#define smax smoothmax
#define rot(a) mat2(cos(a-vec4(0,11,33,0)))


int partID = 0;

float smoothmin(float d1, float d2, float k) {
  float h = max(k - abs(d1 - d2), 0.) / k;
  return min(d1, d2) - h * h * k * (1. / 4.);
}

float smoothmax(float d1, float d2, float k) {
    float h = max(k - abs(d1 - d2), 0.) / k;
    return max(d1, d2) + h * h * k * (1. / 4.);
}

float sdSeg(in vec3 p, in vec3 a, in vec3 b) {
  vec3 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0., 1.);
  return length(pa - ba * h);
}

// Signed distance function for a 3D line segment
float map(vec3 p) {

  p.x+=1.; // centering the eagle

  vec3 p0 = p; // coordinates

  float beak = (length(p) - .5 + abs(p.z)*.75)/2.; // a sphere that has its radius limited in the z axis, resulting in a bifocal lens' shape 

  float bCut = beak; // saving the above for later

  beak = max(beak,-beak) - .01; // the solid is hollowed out, then thickened

  p.x-=.0;
  p.y+=.7;

  beak = max(beak, -(length(p.xy) - .9)); // the solid is carved using a cylinder; this creates the shape of the beak

  p = p0; // reset to base coordinas
  p.x-=.5;
  p.y-=.17;
  p.y/=1.25;

  float LBeak = length(abs(p.yz) + (p.y - .1)*(p.x + .2) + abs(p.z))/2.44948974278 - .125 - p.x/10.; // forming the lower half of the beak - which narrows towards the tip and has some curvature to its side view
  LBeak = max(LBeak, -LBeak); // hollowing it out
  LBeak = max(LBeak, p.y) - .01; // trimming it in the Y

  beak = min(beak, LBeak); // joing the two parts together
  beak = max(beak, p.x - p.y/2. + .1)/1.41421356237; //sqrt(2.); // cutting off the excess that would stick out from the head

  float result = 0.; // establishing the variable for the final whole object

  result = beak; // adding beak to it
  if (result == beak) { partID = 1; } // adding a color to it

  p = p0; // resetting the coordinates
  p.x-=.656;
  p.x/=1.25;
  p.y-=.1;
  p.y*=1.1;
  p.z*=2.; // moving and stretching coordinates for the head

  float head = length(p) - .45; // basic sphere/ovoid forming the head
  head = smax(head,
                 smin(-p.x + p.y/3. - .3, -p.x - p.y/3. - .2, .1),
                 .1)/2.; // slicing off the part where the beak will be

  p = p0;
  p.x-=.65;
  p.y-=.5;

  vec3 b = vec3(-p.x - .4, abs(p.y), abs(p.z) - .1 + p.x/6.); // formula for the brow ridge in the form of a rounded cuboid
  float brow = length(max(b,0.)) - .1; // the brow ridge

  p.y-=.4;
  brow = smax(brow, -max(abs(p.z), abs(p.y - p.x/2.) - .2), .125); // cutting a groove into the front of the brow ridge, to give the eagle a stern look

  head = smin(head, brow, .1);

  p = p0;
  p.x-=1.4;

  float sk = 1.5;
  p.y*=sk; // shrinking the y axis
  head = smin(head, -p.x, .15); // melting the head's ovoid into a vertical wall, to create a smooth elongation
  p.y/=sk; // "soft reset" of the coordinates as modified two lines above

  p.y-=.2;
  
  head = smin(head, length(p) - .5, .3); // adding some girth to the elongation by melting a small sphere into it

  p.y+=.2;

  head = max(head, -head - .02); // hollowing out the head

  p.x+=.3;
  p.y-=.2;
  p.z*=3.; // squishing the z axis by a factor of 3.;

  float neckFeathers = p.x; // variable for neck feather cutout

  int fCount = 6;
  for (int nf = 0; nf < fCount; nf++) {
    p.yz*=rot(PI/float(fCount));
    neckFeathers = smax(neckFeathers, -max(abs(p.y), -p.x - .2), .2);
  } // adding a series of incrementally rotated flat surfaces that will cut into the neck

  p.yz*=rot(PI/9.);
  neckFeathers = smax(neckFeathers, -max(abs(p.y), -p.x - .2), .2);
  
  p.yz*=rot(PI/-5.);
  neckFeathers = smax(neckFeathers, -max(abs(p.y), -p.x - .2), .2);

  // adding two more cutsom ones outside the loop for a better, more uniform look

  head = max(head, neckFeathers); // cutting off the smoothmin connecting the head to the vertical wall
  
  p = p0;
  float mouth = max(bCut, -p.y + .15); // shape analogous to the upper beak that will cut off the part of the head that sticks out inside the beak

  result = min(result, max(head, -mouth));
  if (result == head) { partID = 2; } // adding the white color to the beak

  p = p0;
  p.x-=.35;
  p.y-=.4;
  p.z*=2.;

  vec2 e = vec2(length(p.xy), abs(p.z) - .25); // basic formula for the eyes: two spheres
  float eyes = length(e) - .125;

  result = min(result, eyes);
  if (result == eyes) {
     p.x+=.05;
     p.y+=.02;
     if (length(p.xy) < .03 ) { partID = 4; } // the pupil, ergo the inner part of the eye
     else { partID = 3; } // the eye-white, which will be yellow
     }

  p = p0;

  p.x-=1.25;
  p.y-=.19;

  float torTrim = -p.x - .34;
  float torTrim2 = p.y - .6 + p.x/4.; // surfaces to shave excess bits from the torso
  p.xy*=rot(PI/-36.);

  p.x/=1.2;
  p.y*=1.7;
  p.z*=2.75;

  float torso = max(length(p) - .8, torTrim); // an ovoid with its front part cut off where it meets the neck
  torso = smax(torso, torTrim2, .3); // a smoothing of the back

  p = p0;
  p.x-=2.1;
  p.y-=.34;
  p.xy*=rot(PI/-9.); // rotating the coordinate system slightly upwards so that the tail points up
  p.yz*=1.5; // scaling down the y and z

  float butt = length(p) - .15; // a little bum to place the tail on
  torso = smin(torso, butt, .1);

  p.yz/1.5; // undoing the the scaling down of y and z;
  p.x-=.1;
  p.y*=3.;
  p.x*=1.5;

  p.xz*=rot(PI/-2. - PI/32.); // rotating the coordinate system to place the first feather at a sharp angle
  vec3 tA = vec3(0); // start of the line segment (a single feather)
  vec3 tB = tA; // end of the line segment, set to a placeholder default
  float tail = 1.; // variable for the tail

  for (int tf = 0; tf<8; tf++) {
    p.xz*=rot(PI/8.); // turn
    tB.x = 1.; // the deather will be 1 unit long
    tail = min(tail, sdSeg(p,tA,tB) - .1 - p.x/15.); // adding feathers to the tail
  }

  p.xz*=rot(PI/16.); // when the first row of feathers is created, a second one will start, offset sligthly radially
  p.yz*=rot(PI/-8.); // and below the first row

  for (int tf = 0; tf<7; tf++) {
    p.xz*=rot(PI/-8.);
    tB.x = .8; // feathers are .8 units in lenght
    tail = min(tail, sdSeg(p,tA,tB) - .1 - p.x/15.); // adding feathers to the tail
  }
    
  tail/=5.; // tweak to render the whole thing correctly

  p = p0;

  p.x-=1.27;
  p.y-=.3;

  vec3 pW = p; // creating a reset point at the base of the wings
  float wingCut = p.z;
  float wing = 1.;
  float shldr;
  float flapV = iTime*2.;
  vec3 pS, pH, pF; // creating reset points variables that will be set inside loops but need to be accessible outside them

  for (int ti=-1;ti<=1;ti+=2) { // starting a loop, with the variable t intended to be either -1 or 1, which will be used to toggle rotation direction for each wing
    float t = float(ti);
    p = pW; // resetting to wing reset point at the start of each loop
    p.z+=.05*t;

    p.yz*=rot(PI/-6.*cos(flapV)*t); // flapping movement - in opposite direction for each wing   
    p.xz*=rot(PI/-10.*t); // inclining the shoulder/arm slightly away from the standard T-pose

    pS = p; // reset point for the shoulders
    p.z/=2.5;
    shldr = length(p) - .01; // a long ovoid forming the shoulder
    shldr = max(shldr, wingCut*t); // cutting off the part that would stick out of the other side

    p = pS; // reset to shoulder base
    p.z+=.25*t;
    p.yz*=rot(PI/-4.*cos(-PI/2. + flapV)*t); // flapping - out of sync with the parent joint for a move flowing effect 
    p.xz*=rot(PI/10.*t); // reversing the shoulder incline, so that the forearm is perpendicular to the torso
    p.z+=.9*t;
    p.x+=.1;

    pH = p; // reset point for the "hand"
    p.z/=1.5;

    float handCut = p.z*t; // surface slicing off the part of the "hand" where feathers will be

    p.y*=3.;

    float hand = length(p) - .25 - p.z/2.*t; // the hand;
    hand/=3.; // correction factor
    hand = smax(hand, -handCut, .2);

    p = pH;
    p.x+=.3;

    float zOff = .1*t;
    p.z-=zOff; // offset for rotation pivot
    p.yz*=rot(PI/4.*cos(flapV)*t); // flapping - in sync with the top flappy joing, and so out of sync with the direct parent node
    p.z+=zOff + .05*t; // reverting the offset and adding some more
  
    pF = p; // feather reset point;
    float wFeathers = 1.; // variable for the collection of feathers

    for (int fi=0;fi<4;fi++) { // loop for feathers
      float f = float(fi);
      p.xz*=rot(PI/-18.*f*t); // rotate incrementally by 20deg for each feather

      p.z+=.2*t;
      p.z/=3.;
      p.y*=3.;
      wFeathers = min(wFeathers, length(p) - .1); // each feather is formed from a very thinly stretched sphere
      p = pF;
      p.x-=.2*(f+1.);
      
    }

    hand = smin(hand, wFeathers/2.64575131106, .15); // the feathers are melted into the hand
    shldr = smin(shldr, hand, .3); // hand is melted into the shoulder

    torso = smin(torso, shldr, .05); // shoulder (now a full complete wing) added to torso
  }

  p = p0; // reset to original base
  p.x-=1.6;
  p.y-=.2;

  vec3 pL = p; // reset point for legs
  float legs = 1.; // variable for the thigh part of the legs
  float shins = 1.; // the non-feathery shins
  float nails = 1.; // the talons

  for (int li=-1;li<=1;li+=2) {
    float l = float(li);
    p = pL; // reset to base at the start of each loop
    p.xz*=rot(PI/36.*l); // spread the legs slightly apart
    p.xy*=rot(PI/5.); // incline the legs so they're dangling at an angle
    p.x-=.3;
    p.z+=.1*l;
    
    p.x/=2.; // stretching the sphere
    legs = min(legs, length(p) - .14); // each leg/thigh is an ovoid
    p.x*=2.; // reverting the stretch of the sphere

    p.x-=.4;
    vec2 f = vec2(length(p.zy), abs(p) - .15); // formula for the shins - a rounded cylinder
    shins = min(shins, length(max(f,0.)) - .03); // shins are added - one per leg 
    
    p.x-=.175;

    p.xy*=rot(PI/mix(4.,5.,cos(iTime*2.))); // inclining the foot more, and adding a slight floppy movement
    p.xz*=rot(PI/36.*l); // spreading the feet out, so that the toes don't overlap
    vec3 pT = p; // reset point for toes

    float toes = 1.; // variable for the full set of toes

    for (int ti=-1;ti<4;ti+=2) { // loop to create 3 toes, with rotation factor slightly assymetrical
      float toe = float(ti)/2.;
      p = pT;
      p.xz*=rot(PI/9.*l*toe); // rotate by the toes by 40 deg incrementally
      p.x-=.225;
      vec2 t = vec2(length(p.zy), abs(p) - .2); // formula for the toes - like legs, it's a rounded cylinder
      toes = min(toes, length(max(t,0.)) - .03 - length(max(p.x,-.0)/5.)); // adding three toes

      p.x-=.2;
      p.xy*=rot(PI/6.); // rotating by 30 deg to place the talons at an angle
      p.xz*=4.;
      nails = min(nails, (max(length(p.xz) - .25 + p.y*1.5, -p.y))/3.46410161514); // each talon is a cone
    }

    p = pT;

    // now we need to add the opposing toe + talon at the back of the foot

    p.xy*=rot(PI/-2.);
    p.x-=.0666;
    vec2 t = vec2(length(p.zy), abs(p) - .0666);
    toes = min(toes, length(max(t,0.)) - .03 - length(max(p.x*1.5,-.0)/5.));

    p = pT;

    p.y-=.1333;
    p.xy*=rot(PI/2.);
    p.xz*=4.;
    nails = min(nails, (max(length(p.xz) - .18 + p.y*1.5, -p.y))/3.46410161514); // they are grouped because they don't share the color with the rest of the foot/shin

    shins = smin(shins, toes,.1); // toes are melted into the shins
  }

  torso = smin(torso, legs, .05); // legs are melted into the torso

  result = min(result, min(torso, tail)); // torso and tail are united
  if (result == torso) { partID = 5; } // torso will be brown/black
  if (result == tail) { partID = 2; } // the tail will be white

  result = min(result, shins);
  if (result == shins) { partID = 1; } // shins and feet will be orange and glossy, like the beak

  result = min(result, nails);
  if (result == nails) { partID = 4; } // nails will be black and glossy

  return result;
}

vec3 norm(vec3 p) {
  float h = 1e-3;
  vec2 k = vec2(-1, 1);
  return normalize(
    k.xyy * map(p + k.xyy * h) +
    k.yxy * map(p + k.yxy * h) +
    k.yyx * map(p + k.yyx * h) +
    k.xxx * map(p + k.xxx * h)
  );
}

float d0 = 7.;

float raymarch(inout vec3 p, vec3 rd) {
  float dd = 0.0;
  for (float i = 0.0; i < 100.0; i++) {
    float d = map(p);
    if (d < 1e-4 || dd > d0) break;
    p += rd * d;
    dd += d;
  }
  return dd;
}

vec3 render(vec3 p, vec3 rd) {
  float d = raymarch(p, rd);
  vec3 col = vec3(0);

  if (d < d0) {
    vec3 n = norm(p),
         lp = vec3(-100, 100, -50),
         l = normalize(lp - p);
    float diffuse = clamp(dot(l, n), 0., 1.),
          reflective = clamp(dot(reflect(rd, n), l), .0, 1.0);

    if (partID == 1) {
      col = mix(col, vec3(1,.5,0) - vec3(1.),.75); // orange for the beak, shins and toes
    }
    else if (partID == 2) {
      col = mix(col, vec3(.25), .5); // white for the head and tail
    }
    else if (partID == 3) {
      col = mix(col, vec3(1,.75,0) - vec3(.75), .5); // yellow for the eyes
    }
    else if (partID == 4) {
      col = col - vec3(.75); // black/brown for the nails
    }
    else if (partID == 5) {
      col = col - vec3(1); // darker black brown for the torso
    }

    col += diffuse; // + diffuse2;

    if (partID != 2 && partID != 5) {
      col+=pow(reflective, 16.); // the beak, eyes and talons are glossy
    }

  }
  else { // the background

    vec3 rd0 = rd; // reset point
    rd.xy*=rot(PI/4.); // rotating the background up
    rd.xz*=rot(PI/-9.); // rotating it to the left slightly

    // this will produce a brighter blue around the sun

    float gC = clamp((2.25 - rd.x)/4., 0., 1.); // the green channel for that color; it is also prevented from taking negative values

    rd.x+=.99; // the x coordinate is moved almost to the outer limits

    vec3 sun = vec3(1.-rd.x*10.); // the color beyond that will be white, forming the blazing sun

    rd = rd0; // coordinates of the background are reset

    vec3 blueSky = vec3(
      0.,
      gC,
      1); // the color of the sky, consisting of pure blue and a slight green gradient
    
    col += min(blueSky, ceil(rd.y)); // limits the blue sky to the upper half of the scene

    vec3 desert = vec3(
      1,
      gC,
      0 // the color of the desert is pure red plus the slight green gradient, combinining into orange and more yellow around the sun 
    );

    col += min(desert*.85, ceil(-rd.y)); // limits the desert to the upper half of the scene
    
    col = max(sun, col); // sun is added to the scene
    }

  col=mix(col, vec3(1.,.5,.5),.5); // a reddish tint is added to the scene

  return col;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 uv = (fragCoord.xy - .5 * RES.xy) / RES.y;

  float angleX = PT.x > 0. ? (PT.x / RES.x * 2.)*PI : PI + iTime/4.,
        angleY = PT.x > 0. ? (PT.y / RES.y * 2. - 1.)*PI*-.5 : 0.,
        camR = 3.5;  // Rotate around the x- and y-axis based on mouse position
  vec3 target = vec3(0.0); // Center of the cube

  vec3 ro = vec3(
    sin(angleX)*cos(angleY),
    sin(angleY) + cos(iTime/10.)/3.,
    cos(angleX)*cos(angleY)
    )*camR;

  // Calculate the ray direction
  vec3 fwd = normalize(target - ro), // fwd direction
      right = normalize(cross(vec3(0., 1., 0.), fwd)), // Right direction
      up = cross(fwd, right), // Up direction
      rd = normalize(fwd + uv.x * right + uv.y * up); // Ray direction

  float t = 0.0; // Total distance travelled
  vec3 p = ro, col = render(ro, rd);
  fragColor = vec4(col, 1);
}

// Shadertoy code ends here

void main() {
    mainImage(fragColor, gl_FragCoord.xy);
}

`;

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);  


const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);

const  
 program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);  


const positions = [
    -1.0, -1.0,
    1.0, -1.0,
    -1.0, 1.0,
    1.0, 1.0,
];

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new  
 Float32Array(positions), gl.STATIC_DRAW);

const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
gl.enableVertexAttribArray(positionAttributeLocation);  

gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);  


const iResolutionLocation = gl.getUniformLocation(program, 'iResolution');
const iMouseLocation = gl.getUniformLocation(program, 'iMouse');
const iTimeLocation = gl.getUniformLocation(program, 'iTime');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);  

resizeCanvas(); // Initial resize

let isMouseDown = false;
let mouseX = 0; // Store the last mouse X position
let mouseY = 0; // Store the last mouse Y position

canvas.addEventListener('mousedown', (event) => {
    isMouseDown = true;
});

canvas.addEventListener('mouseup', (event) => {
    isMouseDown = false;
    // Optional: Reset mouse position in the shader when the button is released.
    // This is important to stop any lingering movement in the shader.
     gl.uniform2f(iMouseLocation, -1, -1); // Or some other "out of bounds" value.

    mouseX = -1; //reset mouse position
    mouseY = -1;
});

canvas.addEventListener('mouseout', (event) => {
    isMouseDown = false;
    gl.uniform2f(iMouseLocation, -1, -1); // Reset in shader as well
    mouseX = -1; //reset mouse position
    mouseY = -1;
});

canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = canvas.height - (event.clientY - rect.top);

    mouseX = x;
    mouseY = y;

    if (isMouseDown) {
        gl.uniform2f(iMouseLocation, x, y);
    } else {
        // Maintain a "resting" value in the shader, or set it to a specific value.
        gl.uniform2f(iMouseLocation, -1, -1); // Or some other "out of bounds" value.
    }
});

function render() {
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.uniform2f(iResolutionLocation, canvas.width, canvas.height);
    gl.uniform1f(iTimeLocation, performance.now() * 0.001);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    requestAnimationFrame(render);
}

render();