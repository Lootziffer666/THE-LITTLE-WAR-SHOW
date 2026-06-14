class World {
  constructor(width, height) {

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    this.container = document.getElementsByClassName("world")[0];
    this.scene = new THREE.Scene();
    this.width = width;
    this.height = height;
    this.aspectRatio = width / height;
    this.fieldOfView = 50;
		this.nLoadedImages = 0;
		this.targetX = 0;
		this.targetY = 0;

    var nearPlane = .1;
    var farPlane = 20000;
		
		
    this.camera = new THREE.PerspectiveCamera(this.fieldOfView, this.aspectRatio, nearPlane, farPlane);
		this.camera.position.z = 260;
		this.container.appendChild(this.renderer.domElement);
    this.timer = 0;
		this.loadTextures();
  }
	
	loadTextures() {
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = '';
		
		this.textureImage = loader.load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/264161/halloween.jpg', this.imageLoaded.bind(this));
		this.textureImage.minFilter = THREE.LinearFilter;
    
    this.textureDepth = loader.load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/264161/halloween-depth.jpg', this.imageLoaded.bind(this));
    this.textureDepth.magFilter = this.textureDepth.minFilter = THREE.LinearFilter;
		
		this.textureNormal = loader.load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/264161/halloween-normal.jpg', this.imageLoaded.bind(this));
    this.textureNormal.magFilter = this.textureNormal.minFilter = THREE.LinearFilter;
		
		this.textureNoise = loader.load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/264161/noiseTexture.jpg', this.imageLoaded.bind(this));
		this.textureNoise.magFilter = this.textureDepth.minFilter = THREE.LinearFilter;
		this.textureNoise.wrapT = this.textureNoise.wrapS = THREE.RepeatWrapping;
  }
	
	imageLoaded(){
		this.nLoadedImages++;
		if ( this.nLoadedImages > 3 ) {
			this.createPlane();
			this.loop();
		}
	}

  createPlane(){
    this.material = new THREE.RawShaderMaterial({
      vertexShader: document.getElementById( 'vertexShader' ).textContent,
      fragmentShader: document.getElementById('fragmentShader').textContent,
			uniforms: { 
				time: { type: 'f', value: 5 },
				textureImage: { type: 't', value: this.textureImage },
        textureDepth: { type: 't', value: this.textureDepth },
				textureNormal: { type: 't', value: this.textureNormal },
				textureNoise: { type: 't', value: this.textureNoise },
				mousePosition: {type: 'v2', value: new THREE.Vector2( 0.5, 0.5 ) }
    	}
    });
		
		
    this.shapeGeometry = new  THREE.PlaneGeometry(200, 200, 256, 256);
    this.shape = new THREE.Mesh(this.shapeGeometry, this.material);		
		this.scene.add(this.shape);
  }
	
  render() {
    this.timer+=.01;
		this.shape.material.uniforms.time.value = this.timer;
		
		this.targetX += (mousePos.px - this.targetX) * .07;
		this.targetY += (mousePos.py - this.targetY) * .07;
		this.shape.material.uniforms.mousePosition.value = new THREE.Vector2(this.targetX, -this.targetY);
    this.renderer.render(this.scene, this.camera);
  }

  loop() {
    this.render();
		requestAnimationFrame(this.loop.bind(this));
  }

  updateSize(w, h) {
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }
	
  mouseMove(mousePos) {
		
  }
};

document.addEventListener("DOMContentLoaded", domIsReady);
let mousePos = {x:0, y:0, px:0, py:0};
let PI = Math.PI;
let world;

function domIsReady() {
    world = new World(this.container, this.renderer, window.innerWidth, window.innerHeight);
    window.addEventListener('resize', handleWindowResize, false);
    document.addEventListener("mousemove", handleMouseMove, false);
	  document.addEventListener("touchmove", handleMouseMove, false);
    handleWindowResize();
}

function handleWindowResize() {
    world.updateSize(window.innerWidth, window.innerHeight);
}

function handleMouseMove(e) {
  if ((e.clientX)&&(e.clientY)) {  
		mousePos.x = e.clientX;
    mousePos.y = e.clientY;
		mousePos.px = mousePos.x / window.innerWidth * 2 - 1;
  	mousePos.py = mousePos.y / window.innerHeight * 2 - 1;
	}else if (e.targetTouches) {
		mousePos.x = e.targetTouches[0].clientX;
		mousePos.y = e.targetTouches[0].clientY;
		mousePos.px = mousePos.x / window.innerWidth * 2 - 1;
  	mousePos.py = mousePos.y / window.innerHeight * 2 - 1;
		mousePos.px *= 1.5;
  	mousePos.py *= 1.5;
		e.preventDefault();
	}
	
  world.mouseMove(mousePos);
}

