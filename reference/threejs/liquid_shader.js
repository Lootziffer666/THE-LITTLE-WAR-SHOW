window.addEventListener("resize", onWindowResize);

var frustumSize = 600;
var aspect = window.innerWidth / window.innerHeight;

var clock = new THREE.Clock(true);

var scene = new THREE.Scene();
camera = new THREE.OrthographicCamera(
	frustumSize * aspect / -2,
	frustumSize * aspect / 2,
	frustumSize / 2,
	frustumSize / -2,
	1,
	2000
);

camera.lookAt(scene.position);
camera.position.z = 1;

var renderer = new THREE.WebGLRenderer();

renderer.setPixelRatio = 1;
renderer.setClearColor(0xffffff, 1.0);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

function onWindowResize() {
	var aspect = window.innerWidth / window.innerHeight;

	camera.left = -frustumSize * aspect / 2;
	camera.right = frustumSize * aspect / 2;
	camera.top = frustumSize / 2;
	camera.bottom = -frustumSize / 2;

	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}

var addToGPU = function(t) {
	renderer.setTexture2D(t, 0);
};

var loader = new THREE.TextureLoader();
loader.crossOrigin = "";
var texture1 = loader.load("https://robindelaporte.fr/codepen/loader/0.png", function(texture) {
	addToGPU(texture);
});
var texture2 = loader.load("https://robindelaporte.fr/codepen/loader/10.png", function(texture) {
	addToGPU(texture);
});
var texture3 = loader.load("https://robindelaporte.fr/codepen/loader/28.png", function(texture) {
	addToGPU(texture);
});
var texture4 = loader.load("https://robindelaporte.fr/codepen/loader/44.png", function(texture) {
	addToGPU(texture);
});
var texture5 = loader.load("https://robindelaporte.fr/codepen/loader/61.png", function(texture) {
	addToGPU(texture);
});
var texture6 = loader.load("https://robindelaporte.fr/codepen/loader/85.png", function(texture) {
	addToGPU(texture);
});
var texture7 = loader.load("https://robindelaporte.fr/codepen/loader/99.png", function(texture) {
	addToGPU(texture);
});
var texture8 = loader.load("https://robindelaporte.fr/codepen/loader/done.png", function(texture) {
	addToGPU(texture);
});

var disp = loader.load("https://robindelaporte.fr/codepen/loader/fluid.jpg");
disp.wrapS = disp.wrapT = THREE.RepeatWrapping;

var mat = new THREE.ShaderMaterial({
	uniforms: {
		time: { type: "f", value: 1.0 },
		random: { type: "f", value: 0.0 },
		dispFactor: { type: "f", value: 0.0 },
		texture: { type: "t", value: texture1 },
		texture2: { type: "t", value: texture2 },
		disp: { type: "t", value: disp }
	},

	vertexShader: document.getElementById("vertexShader").textContent,
	fragmentShader: document.getElementById("fragmentShader").textContent,
	transparent: true,
	opacity: 1.0
});

var geometry = new THREE.PlaneBufferGeometry(600, 600, 1);
var object = new THREE.Mesh(geometry, mat);
scene.add(object);

var c = false;
var step = 0;
window.addEventListener("click", function() {});

var doClick = function() {
	switch (step) {
		case 0:
			break;
		case 1:
			mat.uniforms.texture.value = texture3;
			break;
		case 2:
			mat.uniforms.texture2.value = texture4;
			break;
		case 3:
			mat.uniforms.texture.value = texture5;
			break;
		case 4:
			mat.uniforms.texture2.value = texture6;
			break;
		case 5:
			mat.uniforms.texture.value = texture7;
			break;
		case 6:
			mat.uniforms.texture2.value = texture8;
			break;
		default:
	}

	step += 1;

	if (!c) {
		TweenMax.to(mat.uniforms.dispFactor, 1.5, { value: 1, ease: Expo.easeInOut });
		c = true;
		mat.uniforms.random.value = Math.random() * 10;
	} else {
		TweenMax.to(mat.uniforms.dispFactor, 1.5, { value: 0, ease: Expo.easeInOut });
		c = false;
	}
};

setInterval(function() {
	if (step > 6) {
		return;
	}
	doClick();
}, 1600);

var animate = function() {
	requestAnimationFrame(animate);

	renderer.render(scene, camera);

	var d = clock.getDelta();
	mat.uniforms.time.value += d;
};
animate();
