class e {
  constructor(e, n) {
    (this.$image = document.querySelector(".tile__image")),
      (this.scene = e),
      (this.callback = n),
      (this.loader = new THREE.TextureLoader()),
      (this.image = this.loader.load(this.$image.src, () => {
        this.start();
      })),
      (this.hover = this.loader.load(this.$image.dataset.hover)),
      (this.$image.style.opacity = 0),
      (this.sizes = new THREE.Vector2(0, 0)),
      (this.offset = new THREE.Vector2(0, 0)),
      (this.mouse = new THREE.Vector2(0, 0)),
      window.addEventListener("pointermove", (e) => {
        this.onMouseMove(e);
      });
  }
  start() {
    this.getSizes(), this.createMesh(), this.callback();
  }
  getSizes() {
    const {
      width: e,
      height: n,
      top: t,
      left: i
    } = this.$image.getBoundingClientRect();
    this.sizes.set(e, n),
      this.offset.set(
        i - window.innerWidth / 2 + e / 2,
        -t + window.innerHeight / 2 - n / 2
      );
  }
  createMesh() {
    (this.uniforms = {
      u_image: { type: "t", value: this.image },
      u_imagehover: { type: "t", value: this.hover },
      u_mouse: { value: this.mouse },
      u_time: { value: 0 },
      u_res: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
    }),
      (this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1)),
      (this.material = new THREE.ShaderMaterial({
        uniforms: this.uniforms,
        vertexShader:
          "varying vec2 v_uv;\n\nvoid main() {\n    v_uv = uv;\n\n    gl_Position = projectionMatrix * modelViewMatrix * \n\t\tvec4(position, 1.0);\n}",
        fragmentShader:
          "uniform vec2 u_mouse;\nuniform vec2 u_res;\n\nuniform sampler2D u_image;\nuniform sampler2D u_imagehover;\n\nuniform float u_time;\n\nvarying vec2 v_uv;\n\nfloat circle(in vec2 _st, in float _radius, in float blurriness){\n    vec2 dist = _st;\n    return 1.-smoothstep(_radius-(_radius*blurriness), _radius+(_radius*blurriness), dot(dist,dist)*4.0);\n}\n\nvec3 mod289(vec3 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 mod289(vec4 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 permute(vec4 x) {\n     return mod289(((x*34.0)+1.0)*x);\n}\n\nvec4 taylorInvSqrt(vec4 r)\n{\n  return 1.79284291400159 - 0.85373472095314 * r;\n}\n\nfloat snoise3(vec3 v)\n  {\n  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;\n  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);\n\n// First corner\n  vec3 i  = floor(v + dot(v, C.yyy) );\n  vec3 x0 =   v - i + dot(i, C.xxx) ;\n\n// Other corners\n  vec3 g = step(x0.yzx, x0.xyz);\n  vec3 l = 1.0 - g;\n  vec3 i1 = min( g.xyz, l.zxy );\n  vec3 i2 = max( g.xyz, l.zxy );\n\n  //   x0 = x0 - 0.0 + 0.0 * C.xxx;\n  //   x1 = x0 - i1  + 1.0 * C.xxx;\n  //   x2 = x0 - i2  + 2.0 * C.xxx;\n  //   x3 = x0 - 1.0 + 3.0 * C.xxx;\n  vec3 x1 = x0 - i1 + C.xxx;\n  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y\n  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y\n\n// Permutations\n  i = mod289(i);\n  vec4 p = permute( permute( permute(\n             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))\n           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))\n           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));\n\n// Gradients: 7x7 points over a square, mapped onto an octahedron.\n// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)\n  float n_ = 0.142857142857; // 1.0/7.0\n  vec3  ns = n_ * D.wyz - D.xzx;\n\n  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)\n\n  vec4 x_ = floor(j * ns.z);\n  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)\n\n  vec4 x = x_ *ns.x + ns.yyyy;\n  vec4 y = y_ *ns.x + ns.yyyy;\n  vec4 h = 1.0 - abs(x) - abs(y);\n\n  vec4 b0 = vec4( x.xy, y.xy );\n  vec4 b1 = vec4( x.zw, y.zw );\n\n  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;\n  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;\n  vec4 s0 = floor(b0)*2.0 + 1.0;\n  vec4 s1 = floor(b1)*2.0 + 1.0;\n  vec4 sh = -step(h, vec4(0.0));\n\n  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;\n  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;\n\n  vec3 p0 = vec3(a0.xy,h.x);\n  vec3 p1 = vec3(a0.zw,h.y);\n  vec3 p2 = vec3(a1.xy,h.z);\n  vec3 p3 = vec3(a1.zw,h.w);\n\n//Normalise gradients\n  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));\n  p0 *= norm.x;\n  p1 *= norm.y;\n  p2 *= norm.z;\n  p3 *= norm.w;\n\n// Mix final noise value\n  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);\n  m = m * m;\n  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),\n                                dot(p2,x2), dot(p3,x3) ) );\n  }\n\nvoid main() {\n\t// We manage the device ratio by passing PR constant\n\tvec2 res = u_res * PR;\n\tvec2 st = gl_FragCoord.xy / res.xy - vec2(0.5);\n\t// tip: use the following formula to keep the good ratio of your coordinates\n\tst.y *= u_res.y / u_res.x;\n\n\t// We readjust the mouse coordinates\n\tvec2 mouse = u_mouse * -0.5;\n\t\n\tvec2 circlePos = st + mouse;\n\tfloat c = circle(circlePos, 0.15, 2.) * 2.5;\n\n\tfloat offx = v_uv.x + sin(v_uv.y + u_time * .1);\n\tfloat offy = v_uv.y - u_time * 0.1 - cos(u_time * .001) * .01;\n\n\tfloat n = snoise3(vec3(offx, offy, u_time * .1) * 8.) - 1.;\n\n\tfloat finalMask = smoothstep(0.4, 0.5, n + pow(c, 2.));\n\n\tvec4 image = texture2D(u_image, v_uv);\n\tvec4 hover = texture2D(u_imagehover, v_uv);\n\n\tvec4 finalImage = mix(image, hover, finalMask);\n\n\tgl_FragColor = finalImage;\n}",
        defines: { PR: window.devicePixelRatio.toFixed(1) }
      })),
      (this.mesh = new THREE.Mesh(this.geometry, this.material)),
      this.mesh.position.set(this.offset.x, this.offset.y, 0),
      this.mesh.scale.set(this.sizes.x, this.sizes.y, 1),
      this.scene.add(this.mesh);
  }
  onMouseMove(e) {
    gsap.to(this.mouse, 0.5, {
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: (-e.clientY / window.innerHeight) * 2 + 1
    }),
      gsap.to(this.mesh.rotation, 0.5, {
        x: 0.3 * -this.mouse.y,
        y: this.mouse.x * (Math.PI / 6)
      });
  }
  update() {
    this.uniforms.u_time.value += 0.01;
  }
}
window.scene = new (class {
  constructor() {
    (this.container = document.getElementById("stage")),
      (this.scene = new THREE.Scene()),
      (this.renderer = new THREE.WebGLRenderer({
        canvas: this.container,
        alpha: !0
      })),
      this.renderer.setSize(window.innerWidth, window.innerHeight),
      this.renderer.setPixelRatio(window.devicePixelRatio),
      this.initLights(),
      this.initCamera(),
      (this.figure = new e(this.scene, () => {
        this.update();
      }));
  }
  initLights() {
    const e = new THREE.AmbientLight(16777215, 2);
    this.scene.add(e);
  }
  initCamera() {
    const e = (2 * Math.atan(window.innerHeight / 2 / 800) * 180) / Math.PI;
    (this.camera = new THREE.PerspectiveCamera(
      e,
      window.innerWidth / window.innerHeight,
      1,
      1e3
    )),
      this.camera.position.set(0, 0, 800);
  }
  update() {
    void 0 !== this.renderer &&
      (requestAnimationFrame(this.update.bind(this)),
      this.figure.update(),
      this.renderer.render(this.scene, this.camera));
  }
})();
